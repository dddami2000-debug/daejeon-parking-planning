const {
  cleanText,
  isKoreaCoordinate,
  methodNotAllowed,
  sendJson,
  toNumber
} = require('./_lib');

function buildTmapInvokeUrl({ appKey, name, lat, lng }) {
  const url = new URL('https://apis.openapi.sk.com/tmap/app/routes');
  url.searchParams.set('appKey', appKey);
  url.searchParams.set('name', name);
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('lat', String(lat));
  return url.toString();
}

async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const name = cleanText(req.query?.name);
  const lat = toNumber(req.query?.lat);
  const lng = toNumber(req.query?.lng);
  if (!name || !isKoreaCoordinate(lat, lng)) {
    return sendJson(res, 400, { error: 'invalid_destination' });
  }
  const appKey = cleanText(process.env.TMAP_APP_KEY);
  if (!appKey) return sendJson(res, 503, { error: 'tmap_unavailable' });

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Location', buildTmapInvokeUrl({ appKey, name, lat, lng }));
  return res.status(302).end();
}

handler.buildTmapInvokeUrl = buildTmapInvokeUrl;
module.exports = handler;
