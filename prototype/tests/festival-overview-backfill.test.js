const test = require('node:test');
const assert = require('node:assert/strict');

function responseRecorder() {
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

test('merges only the official overview into existing festival metadata', () => {
  const { mergeOverviewMetadata } = require('../api/backfill-festival-overviews');
  const original = {
    content_id: '123',
    image_url: 'https://example.com/image.jpg',
    festival_content: {
      summary: '기존 설명',
      programs: [{ title: '기존 프로그램' }],
      source_urls: ['https://example.com']
    }
  };
  const merged = mergeOverviewMetadata(original, '  공식 축제 소개  ');

  assert.deepEqual(merged, {
    ...original,
    festival_content: {
      ...original.festival_content,
      official_overview: '공식 축제 소개'
    }
  });
  assert.equal(original.festival_content.official_overview, undefined);
});

test('backfills an overview with the dedicated token and preserves every existing field', async () => {
  const lib = require('../api/_lib');
  const enrichment = require('../api/enrich-festivals');
  const originalSupabaseRequest = lib.supabaseRequest;
  const originalFetchTourApiDetails = enrichment.fetchTourApiDetails;
  const originalToken = process.env.FESTIVAL_OVERVIEW_BACKFILL_TOKEN;
  const calls = [];
  const existingMetadata = {
    content_id: '123',
    untouched: { nested: true },
    festival_content: { summary: '기존 설명', programs: ['기존 프로그램'] }
  };
  lib.supabaseRequest = async (path, options = {}) => {
    calls.push({ path, options });
    if (!options.method) return [{ id: 'festival-1', external_id: '123', name: '유성재즈', metadata: existingMetadata }];
    return null;
  };
  enrichment.fetchTourApiDetails = async () => ({ content: { overview: '한국관광공사 소개 원문' }, error: null });
  process.env.FESTIVAL_OVERVIEW_BACKFILL_TOKEN = 'one-time-token';
  delete require.cache[require.resolve('../api/backfill-festival-overviews')];
  const handler = require('../api/backfill-festival-overviews');
  const recorder = responseRecorder();

  try {
    await handler({ method: 'POST', query: { limit: '1' }, headers: { 'x-backfill-token': 'one-time-token' } }, recorder.response);
  } finally {
    lib.supabaseRequest = originalSupabaseRequest;
    enrichment.fetchTourApiDetails = originalFetchTourApiDetails;
    if (originalToken === undefined) delete process.env.FESTIVAL_OVERVIEW_BACKFILL_TOKEN;
    else process.env.FESTIVAL_OVERVIEW_BACKFILL_TOKEN = originalToken;
    delete require.cache[require.resolve('../api/backfill-festival-overviews')];
  }

  assert.equal(recorder.response.statusCode, 200);
  assert.equal(recorder.body().added, 1);
  assert.equal(recorder.body().failed, 0);
  assert.equal(calls.length, 2);
  const update = JSON.parse(calls[1].options.body);
  assert.deepEqual(Object.keys(update), ['metadata']);
  assert.deepEqual(update.metadata, {
    ...existingMetadata,
    festival_content: {
      ...existingMetadata.festival_content,
      official_overview: '한국관광공사 소개 원문'
    }
  });
});

test('rejects a manual backfill without a valid token', async () => {
  delete require.cache[require.resolve('../api/backfill-festival-overviews')];
  const handler = require('../api/backfill-festival-overviews');
  const recorder = responseRecorder();
  await handler({ method: 'POST', query: {}, headers: {} }, recorder.response);
  assert.equal(recorder.response.statusCode, 401);
  assert.deepEqual(recorder.body(), { error: 'unauthorized' });
});
