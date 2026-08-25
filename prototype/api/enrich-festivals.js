const {
  asArray,
  cleanText,
  fetchJson,
  isAuthorizedCron,
  methodNotAllowed,
  normalizedServiceKey,
  sendJson,
  supabaseRequest
} = require('./_lib');
const {
  festivalSearchPrompt,
  mergeFestivalContent,
  normalizeOpenAiContent,
  officialFestivalContent,
  parseModelJson,
  responseOutputText,
  sourceUrlsFromResponse
} = require('./_festival-enrichment');

const TOUR_API_BASE = 'https://apis.data.go.kr/B551011/KorService2';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const OPENAI_FALLBACK_MODELS = ['gpt-5-mini', 'gpt-4.1-mini', 'gpt-4o-mini'];
const MAX_BATCH_SIZE = 4;

function parseLimit(value) {
  const parsed = Number.parseInt(cleanText(value), 10);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(MAX_BATCH_SIZE, parsed)) : MAX_BATCH_SIZE;
}

function isAuthorizedEnrichment(req) {
  if (isAuthorizedCron(req)) return true;
  const adminToken = cleanText(process.env.ENRICH_ADMIN_TOKEN);
  const cronToken = cleanText(process.env.CRON_SECRET);
  const authorization = cleanText(req.headers?.authorization);
  const enrichmentToken = cleanText(req.headers?.['x-enrich-token']);
  return (Boolean(adminToken) && (authorization === `Bearer ${adminToken}` || enrichmentToken === adminToken))
    || (Boolean(cronToken) && enrichmentToken === cronToken);
}

function festivalApiKeys() {
  return [...new Set([
    cleanText(process.env.FESTIVAL_API_KEY),
    cleanText(process.env.TOUR_API_KEY)
  ].filter(Boolean).map(normalizedServiceKey))];
}

function dataGovEnvelope(payload) {
  return payload?.response || payload;
}

function firstTourApiItem(payload) {
  const envelope = dataGovEnvelope(payload);
  const resultCode = cleanText(envelope?.header?.resultCode);
  if (resultCode && resultCode !== '0000') {
    const message = cleanText(envelope?.header?.resultMsg).replace(/[^\w가-힣 -]/g, '').slice(0, 100);
    throw new Error(`tourapi_result_${resultCode}${message ? `_${message}` : ''}`);
  }
  return asArray(envelope?.body?.items?.item)[0] || {};
}

async function fetchTourApiItem(endpoint, apiKey, contentId) {
  const requestUrl = new URL(`${TOUR_API_BASE}/${endpoint}`);
  const params = {
    serviceKey: apiKey,
    numOfRows: '10',
    pageNo: '1',
    MobileOS: 'WEB',
    MobileApp: 'daejeongalkka',
    _type: 'json',
    contentId,
    contentTypeId: '15'
  };
  if (endpoint === 'detailCommon2') Object.assign(params, {
    defaultYN: 'Y',
    firstImageYN: 'Y',
    areacodeYN: 'Y',
    catcodeYN: 'Y',
    addrinfoYN: 'Y',
    mapinfoYN: 'Y',
    overviewYN: 'Y'
  });
  Object.entries(params).forEach(([key, value]) => requestUrl.searchParams.set(key, value));
  return firstTourApiItem(await fetchJson(requestUrl));
}

async function fetchTourApiDetails(place) {
  const contentId = cleanText(place.metadata?.content_id || place.external_id);
  if (!contentId) return { content: officialFestivalContent(), error: 'tourapi_content_id_missing' };
  const keys = festivalApiKeys();
  if (!keys.length) return { content: officialFestivalContent(), error: 'tourapi_key_missing' };
  const errors = [];
  for (const apiKey of keys) {
    const [commonResult, introResult] = await Promise.allSettled([
      fetchTourApiItem('detailCommon2', apiKey, contentId),
      fetchTourApiItem('detailIntro2', apiKey, contentId)
    ]);
    const common = commonResult.status === 'fulfilled' ? commonResult.value : {};
    const intro = introResult.status === 'fulfilled' ? introResult.value : {};
    if (Object.keys(common).length || Object.keys(intro).length) {
      return {
        content: officialFestivalContent(common, intro),
        error: [commonResult, introResult]
          .filter((result) => result.status === 'rejected')
          .map((result) => cleanText(result.reason?.message).slice(0, 120))
          .join(' | ') || null
      };
    }
    [commonResult, introResult]
      .filter((result) => result.status === 'rejected')
      .forEach((result) => errors.push(cleanText(result.reason?.message).slice(0, 120)));
    if (commonResult.status === 'fulfilled' || introResult.status === 'fulfilled') break;
  }
  return { content: officialFestivalContent(), error: [...new Set(errors)].join(' | ') || 'tourapi_detail_empty' };
}

function openAiModelCandidates() {
  return [...new Set([
    cleanText(process.env.OPENAI_SEARCH_MODEL),
    ...OPENAI_FALLBACK_MODELS
  ].filter(Boolean))];
}

function isModelAccessError(status, payload) {
  const errorCode = cleanText(payload?.error?.code);
  const message = cleanText(payload?.error?.message || payload?.message);
  return errorCode === 'model_not_found'
    || status === 404
    || (status === 403 && /(?:does not have access to model|model.*(?:access|permission))/i.test(message));
}

function openAiRequestBody(model, place, official) {
  const body = {
    model,
    store: false,
    max_output_tokens: 900,
    tool_choice: 'required',
    tools: [{
      type: 'web_search',
      search_content_types: ['text'],
      user_location: { type: 'approximate', country: 'KR', city: 'Daejeon', region: 'Daejeon' }
    }],
    include: ['web_search_call.action.sources'],
    input: festivalSearchPrompt(place, official),
    text: {
      format: {
        type: 'json_schema',
        name: 'festival_content',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['summary', 'tags', 'highlights', 'recommended_for'],
          properties: {
            summary: { type: ['string', 'null'] },
            tags: { type: 'array', items: { type: 'string' } },
            highlights: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'description'],
                properties: {
                  title: { type: 'string' },
                  description: { type: ['string', 'null'] }
                }
              }
            },
            recommended_for: { type: ['string', 'null'] }
          }
        }
      }
    }
  };
  if (model.startsWith('gpt-5')) body.reasoning = { effort: 'low' };
  return body;
}

async function callOpenAiFestivalSearch(place, official) {
  const apiKey = cleanText(process.env.OPENAI_API_KEY);
  if (!apiKey) throw new Error('openai_api_key_missing');
  for (const model of openAiModelCandidates()) {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openAiRequestBody(model, place, official))
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      if (isModelAccessError(response.status, payload)) continue;
      const message = cleanText(payload?.error?.message || payload?.message).slice(0, 180);
      throw new Error(`openai_http_${response.status}${message ? `_${message}` : ''}`);
    }
    const parsed = parseModelJson(responseOutputText(payload));
    if (!parsed) throw new Error('openai_invalid_json');
    return {
      content: normalizeOpenAiContent(parsed),
      sourceUrls: sourceUrlsFromResponse(payload),
      model
    };
  }
  throw new Error('openai_model_access_unavailable');
}

function existingFestivalContent(place) {
  return place?.metadata?.festival_content || null;
}

function shouldEnrich(place, force = false) {
  if (force) return true;
  const enrichment = existingFestivalContent(place);
  if (!enrichment?.enriched_at) return true;
  const modifiedAt = cleanText(place?.metadata?.modified_at);
  return Boolean(modifiedAt) && enrichment.source_modified_at !== modifiedAt;
}

function mergeUpdate(place, officialResult, aiResult) {
  const previousMetadata = place.metadata && typeof place.metadata === 'object' ? place.metadata : {};
  const sourceUrls = [
    officialResult.content.homepageUrl,
    ...(aiResult?.sourceUrls || [])
  ].filter(Boolean);
  const content = mergeFestivalContent(place, officialResult.content, aiResult?.content || {}, sourceUrls);
  const providers = [
    (officialResult.content.summary || officialResult.content.programs.length) && 'tourapi_detail',
    aiResult && 'openai_web_search'
  ].filter(Boolean);
  const festivalContent = {
    ...content,
    source_modified_at: cleanText(previousMetadata.modified_at) || null,
    tourapi_available: {
      overview: Boolean(officialResult.content.overview),
      program: Boolean(officialResult.content.programs.length)
    },
    tourapi_error: officialResult.error || null,
    providers,
    enriched_at: new Date().toISOString()
  };
  return {
    description: content.summary || cleanText(place.description) || null,
    homepage_url: content.homepage_url || cleanText(place.homepage_url) || null,
    operating_hours: content.operating_hours
      ? { ...(place.operating_hours || {}), raw: content.operating_hours }
      : (place.operating_hours || { raw: null }),
    metadata: { ...previousMetadata, festival_content: festivalContent },
    updated_at: new Date().toISOString()
  };
}

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
  const force = cleanText(req.query?.force) === 'true';
  const dryRun = cleanText(req.query?.dryRun) === 'true';
  const isPreviewDryRun = dryRun && cleanText(process.env.VERCEL_ENV) === 'preview';
  if (!isPreviewDryRun && !isAuthorizedEnrichment(req)) return sendJson(res, 401, { error: 'unauthorized' });
  const limit = parseLimit(req.query?.limit);
  try {
    const rows = await supabaseRequest('places?select=id,external_id,name,address,start_date,end_date,description,homepage_url,operating_hours,metadata&source=eq.kto_festival&category=eq.festival&order=updated_at.asc&limit=100');
    const pending = (Array.isArray(rows) ? rows : []).filter((place) => shouldEnrich(place, force));
    const candidates = pending.slice(0, limit);
    const results = [];
    for (const place of candidates) {
      try {
        const officialResult = await fetchTourApiDetails(place);
        const needsOpenAi = !officialResult.content.summary || !officialResult.content.programs.length;
        let aiResult = null;
        let aiError = null;
        if (needsOpenAi) {
          try { aiResult = await callOpenAiFestivalSearch(place, officialResult.content); }
          catch (error) { aiError = cleanText(error.message).slice(0, 180); }
        }
        const update = mergeUpdate(place, officialResult, aiResult);
        const content = update.metadata.festival_content;
        if (!content.summary && !content.programs.length) throw new Error(aiError || officialResult.error || 'festival_content_empty');
        if (!dryRun) {
          await supabaseRequest(`places?id=eq.${encodeURIComponent(place.id)}`, {
            method: 'PATCH',
            headers: { Prefer: 'return=minimal' },
            body: JSON.stringify(update)
          });
        }
        results.push({
          id: place.id,
          name: place.name,
          ok: true,
          summarySource: content.summary_source,
          programsSource: content.programs_source,
          programs: content.programs.length,
          tourApiOverview: content.tourapi_available.overview,
          tourApiProgram: content.tourapi_available.program,
          aiUsed: Boolean(aiResult),
          aiModel: aiResult?.model || null,
          aiError,
          preview: dryRun ? {
            summary: content.summary,
            programs: content.programs,
            tags: content.tags,
            audience: content.audience,
            venue: content.venue,
            admission: content.admission,
            operatingHours: content.operating_hours,
            sourceUrls: content.source_urls
          } : undefined
        });
      } catch (error) {
        results.push({ id: place.id, name: place.name, ok: false, error: cleanText(error.message).slice(0, 200) });
      }
    }
    const validated = results.filter((result) => result.ok).length;
    const updated = dryRun ? 0 : validated;
    return sendJson(res, 200, {
      ok: true,
      dryRun,
      requested: candidates.length,
      validated,
      updated,
      remaining: Math.max(0, pending.length - (dryRun ? 0 : updated)),
      results
    });
  } catch (error) {
    return sendJson(res, 503, { error: 'festival_enrichment_unavailable', message: cleanText(error.message) });
  }
}

module.exports = handler;
module.exports.callOpenAiFestivalSearch = callOpenAiFestivalSearch;
module.exports.fetchTourApiDetails = fetchTourApiDetails;
module.exports.mergeUpdate = mergeUpdate;
module.exports.shouldEnrich = shouldEnrich;
