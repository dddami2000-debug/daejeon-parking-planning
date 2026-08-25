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
