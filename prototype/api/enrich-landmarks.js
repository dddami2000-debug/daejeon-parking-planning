const {
  cleanText,
  isAuthorizedLandmarkEnrichment,
  methodNotAllowed,
  sendJson,
  supabaseRequest
} = require('./_lib');
const {
  allowedDomainsFor,
  imageResultsFromResponse,
  landmarkSearchPrompt,
  normalizeEnrichment,
  parseModelJson,
  pickOfficialImage,
  sourceUrlsFromResponse
} = require('./_landmark-enrichment');

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const MAX_BATCH_SIZE = 4;

function parseLimit(value) {
  const parsed = Number.parseInt(cleanText(value), 10);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(MAX_BATCH_SIZE, parsed)) : MAX_BATCH_SIZE;
}

function existingEnrichment(place) {
  return place?.metadata?.landmark_enrichment || null;
}

function shouldEnrich(place, force) {
  if (force) return true;
  const enrichment = existingEnrichment(place);
  return !enrichment?.enriched_at || !place.image_url || !cleanText(place.description);
}

async function callOpenAiLandmarkSearch(place) {
  const apiKey = cleanText(process.env.OPENAI_API_KEY);
  if (!apiKey) throw new Error('openai_api_key_missing');
  const allowedDomains = allowedDomainsFor(place);
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // `gpt-5.6` is the Sol alias. Luna is the cost-efficient model enabled
      // for this project and supports both web search and structured output.
      model: cleanText(process.env.OPENAI_SEARCH_MODEL) || 'gpt-5.6-luna',
      reasoning: { effort: 'low' },
      store: false,
      max_output_tokens: 900,
      tool_choice: 'required',
      tools: [{
        type: 'web_search',
        search_content_types: ['image', 'text'],
        image_settings: { max_results: 4, caption: true },
        filters: { allowed_domains: allowedDomains },
        user_location: { type: 'approximate', country: 'KR', city: 'Daejeon', region: 'Daejeon' }
      }],
      include: ['web_search_call.results', 'web_search_call.action.sources'],
      input: landmarkSearchPrompt(place),
      text: {
        format: {
          type: 'json_schema',
          name: 'landmark_content',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['summary', 'tags', 'highlights', 'visit_tip', 'recommended_for', 'admission', 'venue', 'operating_hours'],
            properties: {
              summary: { type: ['string', 'null'] },
              tags: { type: 'array', items: { type: 'string' } },
              highlights: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['title', 'description'],
                  properties: { title: { type: 'string' }, description: { type: 'string' } }
                }
              },
              visit_tip: { type: ['string', 'null'] },
              recommended_for: { type: ['string', 'null'] },
              admission: { type: ['string', 'null'] },
              venue: { type: ['string', 'null'] },
              operating_hours: { type: ['string', 'null'] }
            }
          }
        }
      }
    })
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = cleanText(payload?.error?.message || payload?.message).slice(0, 200);
    throw new Error(`openai_http_${response.status}${message ? `_${message}` : ''}`);
  }
  const content = normalizeEnrichment(parseModelJson(payload?.output_text) || {});
  const image = pickOfficialImage(imageResultsFromResponse(payload), allowedDomains);
  const sourceUrls = sourceUrlsFromResponse(payload).filter((url) => allowedDomains.some((domain) => {
    try {
      const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
      return host === domain || host.endsWith(`.${domain}`);
    } catch { return false; }
  }));
  return { content, image, sourceUrls, allowedDomains };
}

function mergeUpdate(place, searchResult) {
  const previousMetadata = place.metadata && typeof place.metadata === 'object' ? place.metadata : {};
  const content = searchResult.content;
  const enrichment = {
    ...content,
    image_source_url: searchResult.image?.sourceUrl || null,
    image_caption: searchResult.image?.caption || null,
    source_urls: searchResult.sourceUrls,
    allowed_domains: searchResult.allowedDomains,
    enriched_at: new Date().toISOString(),
    provider: 'openai_web_search_v1'
  };
  return {
    description: content.summary || cleanText(place.description) || null,
    image_url: searchResult.image?.imageUrl || cleanText(place.image_url) || null,
    homepage_url: cleanText(place.homepage_url) || searchResult.sourceUrls[0] || null,
    operating_hours: content.operatingHours ? { ...(place.operating_hours || {}), raw: content.operatingHours } : (place.operating_hours || { raw: null }),
    metadata: { ...previousMetadata, landmark_enrichment: enrichment },
    updated_at: new Date().toISOString()
  };
}

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
  if (!isAuthorizedLandmarkEnrichment(req)) return sendJson(res, 401, { error: 'unauthorized' });

  const force = cleanText(req.query?.force) === 'true';
  const limit = parseLimit(req.query?.limit);
  try {
    const rows = await supabaseRequest('places?select=id,name,address,description,homepage_url,image_url,operating_hours,metadata&source=eq.daejeon_tourspot&category=eq.landmark&order=updated_at.asc&limit=100');
    const candidates = (Array.isArray(rows) ? rows : []).filter((place) => shouldEnrich(place, force)).slice(0, limit);
    const results = [];
    for (const place of candidates) {
      try {
        const searchResult = await callOpenAiLandmarkSearch(place);
        const update = mergeUpdate(place, searchResult);
        await supabaseRequest(`places?id=eq.${encodeURIComponent(place.id)}`, {
          method: 'PATCH',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify(update)
        });
        results.push({ id: place.id, name: place.name, ok: true, imageFound: Boolean(searchResult.image), sources: searchResult.sourceUrls.length });
      } catch (error) {
        results.push({ id: place.id, name: place.name, ok: false, error: cleanText(error.message).slice(0, 200) });
      }
    }
    return sendJson(res, 200, {
      ok: true,
      requested: candidates.length,
      updated: results.filter((result) => result.ok).length,
      remaining: Math.max(0, (Array.isArray(rows) ? rows : []).filter((place) => shouldEnrich(place, force)).length - candidates.length),
      results
    });
  } catch (error) {
    return sendJson(res, 503, { error: 'landmark_enrichment_unavailable', message: cleanText(error.message) });
  }
}

module.exports = handler;
module.exports.callOpenAiLandmarkSearch = callOpenAiLandmarkSearch;
module.exports.mergeUpdate = mergeUpdate;
module.exports.shouldEnrich = shouldEnrich;
