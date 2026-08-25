const {
  asArray,
  cleanText,
  fetchJson,
  isAuthorizedLandmarkEnrichment,
  methodNotAllowed,
  normalizedServiceKey,
  sendJson,
  supabaseRequest,
  toInteger
} = require('./_lib');

const KTO_AREA_URL = 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2';
const MAX_BATCH_SIZE = 4;
const LANDMARK_QUERY = 'places?select=id,name,address,image_url,metadata&source=eq.daejeon_tourspot&category=eq.landmark&order=updated_at.asc&limit=500';

function parseLimit(value) {
  const parsed = Number.parseInt(cleanText(value), 10);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(MAX_BATCH_SIZE, parsed)) : MAX_BATCH_SIZE;
}

function normalizeName(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/\([^)]*\)|\[[^\]]*\]/g, '')
    .replace(/[^0-9a-z가-힣]/g, '');
}

function getPageItems(payload) {
  const body = payload?.response?.body || payload?.body || payload;
  return asArray(body?.items?.item || body?.items || []);
}

function getTotalCount(payload, fallback) {
  const body = payload?.response?.body || payload?.body || payload;
  return toInteger(body?.totalCount || body?.totalCnt) || fallback;
}

async function fetchKtoDaejeonPlaces() {
  const key = cleanText(process.env.FESTIVAL_API_KEY);
  if (!key) throw new Error('festival_api_key_missing');
  const fetchPage = async (pageNo) => {
    const url = new URL(KTO_AREA_URL);
    url.searchParams.set('serviceKey', normalizedServiceKey(key));
    url.searchParams.set('pageNo', String(pageNo));
    url.searchParams.set('numOfRows', '100');
    url.searchParams.set('MobileOS', 'WEB');
    url.searchParams.set('MobileApp', 'daejeongalkka');
    url.searchParams.set('_type', 'json');
    url.searchParams.set('lDongRegnCd', '30');
    const payload = await fetchJson(url);
    const resultCode = cleanText(payload?.response?.header?.resultCode || payload?.header?.resultCode);
    if (resultCode && resultCode !== '0000') throw new Error(`upstream_result_${resultCode}`);
    return payload;
  };
  const first = await fetchPage(1);
  const firstItems = getPageItems(first);
  const total = getTotalCount(first, firstItems.length);
  const pages = Math.min(10, Math.max(1, Math.ceil(total / 100)));
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, index) => fetchPage(index + 2)));
  return [first, ...rest].flatMap(getPageItems).filter((item) => cleanText(item.firstimage || item.firstimage2));
}

function imageMatchFor(place, ktoPlaces) {
  const target = normalizeName(place.name);
  if (!target) return null;
  const exact = ktoPlaces.find((item) => normalizeName(item.title) === target);
  if (!exact) return null;
  const imageUrl = cleanText(exact.firstimage || exact.firstimage2);
  if (!imageUrl) return null;
  return {
    imageUrl,
    sourceUrl: `https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=${encodeURIComponent(cleanText(exact.contentid))}`,
    caption: cleanText(exact.title) || cleanText(place.name),
    contentId: cleanText(exact.contentid) || null
  };
}

function enrichmentOf(place) {
  const metadata = place?.metadata && typeof place.metadata === 'object' ? place.metadata : {};
  return metadata.landmark_enrichment && typeof metadata.landmark_enrichment === 'object'
    ? metadata.landmark_enrichment
    : null;
}

function shouldFillImage(place, force) {
  const enrichment = enrichmentOf(place);
  if (!enrichment?.enriched_at || enrichment?.image_source_url) return false;
  return force || !enrichment?.kto_image_checked_at;
}

function imageUpdate(place, match) {
  const previousMetadata = place.metadata && typeof place.metadata === 'object' ? place.metadata : {};
  const enrichment = enrichmentOf(place) || {};
  return {
    image_url: match?.imageUrl || cleanText(place.image_url) || null,
    metadata: {
      ...previousMetadata,
      landmark_enrichment: {
        ...enrichment,
        image_source_url: match?.sourceUrl || enrichment.image_source_url || null,
        image_caption: match?.caption || enrichment.image_caption || null,
        kto_content_id: match?.contentId || null,
        kto_image_checked_at: new Date().toISOString(),
        image_provider: match ? 'kto_tourapi_v4' : enrichment.provider || null
      }
    },
    updated_at: new Date().toISOString()
  };
}

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
  if (!isAuthorizedLandmarkEnrichment(req)) return sendJson(res, 401, { error: 'unauthorized' });
  const force = cleanText(req.query?.force) === 'true';
  const limit = parseLimit(req.query?.limit);
  try {
    const rows = await supabaseRequest(LANDMARK_QUERY);
    const candidates = rows.filter((place) => shouldFillImage(place, force)).slice(0, limit);
    const ktoPlaces = candidates.length ? await fetchKtoDaejeonPlaces() : [];
    const results = [];
    for (const place of candidates) {
      try {
        const match = imageMatchFor(place, ktoPlaces);
        await supabaseRequest(`places?id=eq.${encodeURIComponent(place.id)}`, {
          method: 'PATCH',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify(imageUpdate(place, match))
        });
        results.push({ id: place.id, name: place.name, ok: true, imageFound: Boolean(match), match: match?.caption || null });
      } catch (error) {
        results.push({ id: place.id, name: place.name, ok: false, error: cleanText(error.message).slice(0, 200) });
      }
    }
    const currentRows = await supabaseRequest(LANDMARK_QUERY);
    return sendJson(res, 200, {
      ok: true,
      requested: candidates.length,
      updated: results.filter((result) => result.ok).length,
      imagesFound: results.filter((result) => result.imageFound).length,
      remaining: currentRows.filter((place) => shouldFillImage(place, force)).length,
      results
    });
  } catch (error) {
    return sendJson(res, 503, { error: 'kto_landmark_image_unavailable', message: cleanText(error.message) });
  }
}

module.exports = handler;
module.exports.normalizeName = normalizeName;
module.exports.imageMatchFor = imageMatchFor;
module.exports.shouldFillImage = shouldFillImage;
