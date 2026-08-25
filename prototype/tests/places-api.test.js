const test = require('node:test');
const assert = require('node:assert/strict');

function responseCapture() {
  let body;
  return {
    response: {
      setHeader() {},
      status(statusCode) { this.statusCode = statusCode; return this; },
      json(payload) { body = payload; return payload; }
    },
    body: () => body
  };
}

test('returns festivals only with their real region labels', async () => {
  const lib = require('../api/_lib');
  const originalSupabaseRequest = lib.supabaseRequest;
  let requestedPath = '';
  lib.supabaseRequest = async (path) => {
    requestedPath = path;
    return [
      {
        id: 'festival-1', source: 'kto_festival', category: 'festival',
        name: '계룡軍문화축제', address: '충청남도 계룡시 신도안면 정장리 16',
        latitude: 36.3067, longitude: 127.2371, start_date: '2026-09-01', end_date: '2026-09-05',
        metadata: {}, updated_at: '2026-08-25T00:00:00Z'
      },
      {
        id: 'landmark-1', source: 'daejeon_tourspot', category: 'landmark',
        name: '한밭수목원', address: '대전광역시 서구', metadata: {}
      }
    ];
  };
  delete require.cache[require.resolve('../api/places')];
  const handler = require('../api/places');
  const capture = responseCapture();

  try {
    await handler({ method: 'GET', query: {} }, capture.response);
  } finally {
    lib.supabaseRequest = originalSupabaseRequest;
    delete require.cache[require.resolve('../api/places')];
  }

  assert.equal(capture.response.statusCode, 200);
  assert.match(requestedPath, /category=eq\.festival/);
  assert.doesNotMatch(requestedPath, /daejeon_tourspot/);
  assert.equal(capture.body().places.length, 1);
  assert.equal(capture.body().places[0].name, '계룡軍문화축제');
  assert.equal(capture.body().places[0].region, '충청남도 계룡시');
  assert.equal(capture.body().sourceAttribution, '출처: 한국관광공사 TourAPI');
});

test('rejects the removed landmark category', async () => {
  delete require.cache[require.resolve('../api/places')];
  const handler = require('../api/places');
  const capture = responseCapture();
  await handler({ method: 'GET', query: { category: 'landmark' } }, capture.response);
  assert.equal(capture.response.statusCode, 400);
  assert.equal(capture.body().error, 'invalid_category');
});
