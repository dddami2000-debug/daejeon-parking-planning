const test = require('node:test');
const assert = require('node:assert/strict');

function responseCapture() {
  let body;
  const headers = {};
  return {
    response: {
      setHeader(name, value) { headers[name.toLowerCase()] = value; },
      status(statusCode) { this.statusCode = statusCode; return this; },
      json(payload) { body = payload; return payload; },
      end() { this.ended = true; }
    },
    body: () => body,
    headers
  };
}

test('publishes only browser-safe navigation configuration', async () => {
  const previousKakao = process.env.KAKAO_JAVASCRIPT_KEY;
  const previousTmap = process.env.TMAP_APP_KEY;
  process.env.KAKAO_JAVASCRIPT_KEY = 'public-kakao-key';
  process.env.TMAP_APP_KEY = 'private-tmap-key';
  const handler = require('../api/navigation-config');
  const capture = responseCapture();

  try {
    await handler({ method: 'GET', query: {} }, capture.response);
  } finally {
    if (previousKakao === undefined) delete process.env.KAKAO_JAVASCRIPT_KEY;
    else process.env.KAKAO_JAVASCRIPT_KEY = previousKakao;
    if (previousTmap === undefined) delete process.env.TMAP_APP_KEY;
    else process.env.TMAP_APP_KEY = previousTmap;
  }

  assert.equal(capture.response.statusCode, 200);
  assert.deepEqual(capture.body(), { kakaoJavaScriptKey: 'public-kakao-key', tmapAvailable: true });
  assert.doesNotMatch(JSON.stringify(capture.body()), /private-tmap-key/);
});

test('validates a TMAP destination and redirects through the server-held app key', async () => {
  const previousTmap = process.env.TMAP_APP_KEY;
  process.env.TMAP_APP_KEY = 'private-tmap-key';
  delete require.cache[require.resolve('../api/tmap-navigation')];
  const handler = require('../api/tmap-navigation');
  const capture = responseCapture();

  try {
    await handler({
      method: 'GET',
      query: { name: '대전 0시 축제', lat: '36.3298', lng: '127.4307' }
    }, capture.response);
  } finally {
    if (previousTmap === undefined) delete process.env.TMAP_APP_KEY;
    else process.env.TMAP_APP_KEY = previousTmap;
    delete require.cache[require.resolve('../api/tmap-navigation')];
  }

  assert.equal(capture.response.statusCode, 302);
  assert.equal(capture.response.ended, true);
  const redirect = new URL(capture.headers.location);
  assert.equal(redirect.hostname, 'apis.openapi.sk.com');
  assert.equal(redirect.searchParams.get('appKey'), 'private-tmap-key');
  assert.equal(redirect.searchParams.get('name'), '대전 0시 축제');
  assert.equal(redirect.searchParams.get('lon'), '127.4307');
  assert.equal(capture.body(), undefined);
});

test('rejects invalid coordinates before attempting a TMAP redirect', async () => {
  const handler = require('../api/tmap-navigation');
  const capture = responseCapture();
  await handler({ method: 'GET', query: { name: '축제', lat: '1', lng: '1' } }, capture.response);
  assert.equal(capture.response.statusCode, 400);
  assert.equal(capture.body().error, 'invalid_destination');
  assert.equal(capture.headers.location, undefined);
});

test('returns a TMAP driving-route distance and duration without exposing the app key', async () => {
  const previousTmap = process.env.TMAP_APP_KEY;
  const previousFetch = global.fetch;
  let request;
  process.env.TMAP_APP_KEY = 'private-tmap-key';
  global.fetch = async (url, options) => {
    request = { url: String(url), options };
    return {
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: { totalDistance: 1677, totalTime: 467 }
          }]
        });
      }
    };
  };
  delete require.cache[require.resolve('../api/tmap-route')];
  const handler = require('../api/tmap-route');
  const capture = responseCapture();

  try {
    await handler({
      method: 'GET',
      query: {
        startLat: '36.3515', startLng: '127.4050',
        endLat: '36.3298', endLng: '127.4307'
      }
    }, capture.response);
  } finally {
    if (previousTmap === undefined) delete process.env.TMAP_APP_KEY;
    else process.env.TMAP_APP_KEY = previousTmap;
    global.fetch = previousFetch;
    delete require.cache[require.resolve('../api/tmap-route')];
  }

  assert.equal(capture.response.statusCode, 200);
  assert.deepEqual(capture.body(), {
    distanceMeters: 1677,
    distanceKm: 1.7,
    durationSeconds: 467,
    durationMinutes: 8,
    source: 'TMAP 자동차 경로안내'
  });
  assert.equal(capture.headers['cache-control'], 'private, max-age=300');
  assert.match(request.url, /\/tmap\/routes\?version=1&format=json$/);
  assert.equal(request.options.headers.appKey, 'private-tmap-key');
  assert.doesNotMatch(JSON.stringify(capture.body()), /private-tmap-key/);
  assert.deepEqual(JSON.parse(request.options.body), {
    startX: '127.405', startY: '36.3515',
    endX: '127.4307', endY: '36.3298',
    reqCoordType: 'WGS84GEO', resCoordType: 'WGS84GEO',
    searchOption: '0', trafficInfo: 'N'
  });
});

test('rejects invalid coordinates before calling the TMAP route API', async () => {
  const previousFetch = global.fetch;
  let called = false;
  global.fetch = async () => { called = true; throw new Error('should_not_call'); };
  const handler = require('../api/tmap-route');
  const capture = responseCapture();
  try {
    await handler({
      method: 'GET',
      query: { startLat: '1', startLng: '1', endLat: '36.3', endLng: '127.4' }
    }, capture.response);
  } finally {
    global.fetch = previousFetch;
  }
  assert.equal(capture.response.statusCode, 400);
  assert.equal(capture.body().error, 'invalid_route_coordinates');
  assert.equal(called, false);
});
