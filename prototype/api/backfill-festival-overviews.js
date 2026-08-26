const {
  asArray,
  cleanText,
  isAuthorizedCron,
  methodNotAllowed,
  sendJson,
  supabaseRequest
} = require('./_lib');
const { fetchTourApiDetails } = require('./enrich-festivals');

const MAX_BATCH_SIZE = 100;
const REQUEST_CONCURRENCY = 5;

function isAuthorized(req) {
  if (isAuthorizedCron(req)) return true;
  const adminToken = cleanText(process.env.ENRICH_ADMIN_TOKEN);
  const backfillToken = cleanText(process.env.FESTIVAL_OVERVIEW_BACKFILL_TOKEN);
  const authorization = cleanText(req.headers?.authorization);
  const enrichmentToken = cleanText(req.headers?.['x-enrich-token']);
  const backfillHeader = cleanText(req.headers?.['x-backfill-token']);
  return (Boolean(adminToken) && (authorization === `Bearer ${adminToken}` || enrichmentToken === adminToken))
    || (Boolean(backfillToken) && backfillHeader === backfillToken);
}

function parseLimit(value) {
  const parsed = Number.parseInt(cleanText(value), 10);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(MAX_BATCH_SIZE, parsed)) : MAX_BATCH_SIZE;
}

function hasOverview(place) {
  return Boolean(cleanText(place?.metadata?.festival_content?.official_overview));
}

function mergeOverviewMetadata(metadataValue, overviewValue) {
  const metadata = metadataValue && typeof metadataValue === 'object' && !Array.isArray(metadataValue)
    ? metadataValue
    : {};
  const festivalContent = metadata.festival_content
    && typeof metadata.festival_content === 'object'
    && !Array.isArray(metadata.festival_content)
    ? metadata.festival_content
    : {};
  return {
    ...metadata,
    festival_content: {
      ...festivalContent,
      official_overview: cleanText(overviewValue)
    }
  };
}

async function addOfficialOverview(place) {
  try {
    const official = await fetchTourApiDetails(place);
    const overview = cleanText(official.content?.overview);
    if (!overview) return { id: place.id, name: place.name, status: 'skipped', reason: official.error || 'official_overview_empty' };
    await supabaseRequest(`places?id=eq.${encodeURIComponent(place.id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ metadata: mergeOverviewMetadata(place.metadata, overview) })
    });
    return { id: place.id, name: place.name, status: 'added', length: overview.length };
  } catch (error) {
    return { id: place.id, name: place.name, status: 'failed', reason: cleanText(error.message).slice(0, 160) };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
  if (!isAuthorized(req)) return sendJson(res, 401, { error: 'unauthorized' });
  const limit = parseLimit(req.query?.limit);
  try {
    const rows = await supabaseRequest('places?select=id,external_id,name,metadata&source=eq.kto_festival&category=eq.festival&order=updated_at.asc&limit=100');
    const candidates = asArray(rows).filter((place) => !hasOverview(place)).slice(0, limit);
    const results = [];
    for (let index = 0; index < candidates.length; index += REQUEST_CONCURRENCY) {
      results.push(...await Promise.all(candidates.slice(index, index + REQUEST_CONCURRENCY).map(addOfficialOverview)));
    }
    const added = results.filter((result) => result.status === 'added').length;
    const skipped = results.filter((result) => result.status === 'skipped').length;
    const failed = results.filter((result) => result.status === 'failed').length;
    return sendJson(res, 200, {
      ok: failed === 0,
      requested: candidates.length,
      added,
      skipped,
      failed,
      remaining: Math.max(0, asArray(rows).filter((place) => !hasOverview(place)).length - added),
      results
    });
  } catch (error) {
    return sendJson(res, 502, { error: 'festival_overview_backfill_failed', message: cleanText(error.message).slice(0, 180) });
  }
};

module.exports.addOfficialOverview = addOfficialOverview;
module.exports.hasOverview = hasOverview;
module.exports.mergeOverviewMetadata = mergeOverviewMetadata;
module.exports.parseLimit = parseLimit;
