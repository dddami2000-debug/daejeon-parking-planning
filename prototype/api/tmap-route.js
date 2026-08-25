const {
  cleanText,
  fetchJson,
  isKoreaCoordinate,
  methodNotAllowed,
  sendJson,
  toNumber
} = require('./_lib');

const TMAP_ROUTE_URL = 'https://apis.openapi.sk.com/tmap/routes?version=1&format=json';

function routeSummary(payload) {
  const properties = (Array.isArray(payload?.features) ? payload.features : [])
    .map((feature) => feature?.properties || {})
    .find((item) => Number(item.totalDistance) > 0 && Number(item.totalTime) > 0);
  if (!properties) throw new Error('tmap_route_summary_missing');
  const distanceMeters = Math.round(Number(properties.totalDistance));
  const durationSeconds = Math.round(Number(properties.totalTime));
  return {
    distanceMeters,
    distanceKm: Number((distanceMeters / 1000).toFixed(1)),
    durationSeconds,
    durationMinutes: Math.max(1, Math.ceil(durationSeconds / 60)),
    source: 'TMAP 자동차 경로안내'
  };
}

function routeRequestBody({ startLat, startLng, endLat, endLng }) {
  return {
    startX: String(startLng),
    startY: String(startLat),
    endX: String(endLng),
    endY: String(endLat),
    reqCoordType: 'WGS84GEO',
    resCoordType: 'WGS84GEO',
    searchOption: '0',
    trafficInfo: 'N'
  };
}

async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const startLat = toNumber(req.query?.startLat);
  const startLng = toNumber(req.query?.startLng);
  const endLat = toNumber(req.query?.endLat);
  const endLng = toNumber(req.query?.endLng);
  if (!isKoreaCoordinate(startLat, startLng) || !isKoreaCoordinate(endLat, endLng)) {
    return sendJson(res, 400, { error: 'invalid_route_coordinates' });
  }
  const appKey = cleanText(process.env.TMAP_APP_KEY);
  if (!appKey) return sendJson(res, 503, { error: 'tmap_unavailable' });

  try {
    const payload = await fetchJson(TMAP_ROUTE_URL, {
      method: 'POST',
      headers: {
        appKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(routeRequestBody({ startLat, startLng, endLat, endLng }))
    });
    return sendJson(res, 200, routeSummary(payload), 'private, max-age=300');
  } catch (error) {
    console.error(JSON.stringify({ event: 'tmap_route_failed', reason: cleanText(error?.message).slice(0, 120) }));
    return sendJson(res, 502, { error: 'tmap_route_failed' });
  }
}

handler.routeRequestBody = routeRequestBody;
handler.routeSummary = routeSummary;
module.exports = handler;
