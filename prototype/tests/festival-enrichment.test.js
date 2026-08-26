const test = require('node:test');
const assert = require('node:assert/strict');

const {
  festivalSearchPrompt,
  mergeFestivalContent,
  normalizeOpenAiContent,
  officialFestivalContent,
  parseModelJson,
  responseOutputText,
  sourceUrlsFromResponse
} = require('../api/_festival-enrichment');
const { shouldEnrich } = require('../api/enrich-festivals');

test('extracts a concise purpose and core programs from TourAPI detail fields', () => {
  const content = officialFestivalContent(
    {
      overview: '<p>지역 농산물의 가치를 알리고 방문객과 생산자가 함께 어울리는 축제입니다.</p><p>매년 가을 열립니다.</p>',
      homepage: '<a href="https://festival.example.kr">공식 홈페이지</a>'
    },
    {
      program: '로컬푸드 요리 체험<br>농산물 직거래 장터<br>주민 문화공연',
      eventplace: '완주 고산자연휴양림 일원',
      usetimefestival: '무료',
      playtime: '10:00~18:00'
    }
  );

  assert.equal(content.summary, '지역 농산물의 가치를 알리고 방문객과 생산자가 함께 어울리는 축제입니다.');
  assert.deepEqual(content.programs, [
    { title: '로컬푸드 요리 체험', description: null },
    { title: '농산물 직거래 장터', description: null },
    { title: '주민 문화공연', description: null }
  ]);
  assert.equal(content.venue, '완주 고산자연휴양림 일원');
  assert.equal(content.admission, '무료');
  assert.equal(content.operatingHours, '10:00~18:00');
  assert.equal(content.homepageUrl, 'https://festival.example.kr/');
});

test('keeps official fields and uses OpenAI only for missing content', () => {
  const merged = mergeFestivalContent(
    { description: '기존 소개' },
    {
      summary: '공식 API 목적 소개',
      programs: [],
      venue: '공식 행사장',
      admission: null,
      operatingHours: null,
      homepageUrl: null,
      overview: '공식 원문',
      programText: null
    },
    normalizeOpenAiContent({
      summary: 'AI 소개',
      tags: ['체험', '가족'],
      highlights: [{ title: '공식 확인 프로그램', description: '가족이 함께 참여해요.' }],
      recommended_for: '가족 방문객'
    }),
    ['https://official.example/festival']
  );

  assert.equal(merged.summary, '공식 API 목적 소개');
  assert.equal(merged.summary_source, 'tourapi');
  assert.equal(merged.programs_source, 'openai');
  assert.equal(merged.programs[0].title, '공식 확인 프로그램');
  assert.deepEqual(merged.tags, ['체험', '가족']);
  assert.equal(merged.venue, '공식 행사장');
});

test('parses Responses API output text and web sources', () => {
  const response = {
    output: [
      {
        type: 'web_search_call',
        action: { sources: [{ url: 'https://www.example.go.kr/festival' }] }
      },
      {
        type: 'message',
        content: [{ type: 'output_text', text: '{"summary":"축제 소개","tags":[],"highlights":[],"recommended_for":null}' }]
      }
    ]
  };
  assert.match(responseOutputText(response), /축제 소개/);
  assert.deepEqual(sourceUrlsFromResponse(response), ['https://www.example.go.kr/festival']);
});

test('extracts structured JSON even when web-search text wraps it', () => {
  const parsed = parseModelJson('확인한 공식 정보입니다.\n```json\n{"summary":"축제 소개","tags":[],"highlights":[],"recommended_for":null}\n```');
  assert.equal(parsed.summary, '축제 소개');
});

test('uses the first complete JSON object when multiple outputs are joined', () => {
  const parsed = parseModelJson('{"summary":"첫 요약"}{"summary":"두 번째 요약"}');
  assert.equal(parsed.summary, '첫 요약');
});

test('asks OpenAI to avoid invented program names', () => {
  const prompt = festivalSearchPrompt(
    { name: '계룡軍문화축제', address: '충청남도 계룡시', start_date: '2026-10-01', end_date: '2026-10-05' },
    { summary: null, programs: [] }
  );
  assert.match(prompt, /공식 출처/);
  assert.match(prompt, /만들어내지 말고/);
  assert.match(prompt, /계룡軍문화축제/);
});

test('uses GPT-5.6 Luna as the search model default', () => {
  const exampleEnv = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', '.env.example'), 'utf8');
  assert.match(exampleEnv, /^OPENAI_SEARCH_MODEL=gpt-5\.6-luna$/m);
});

test('retries stored festival content when its purpose summary is still missing', () => {
  assert.equal(shouldEnrich({ metadata: { festival_content: { enriched_at: '2026-08-25T00:00:00Z', summary: null, programs: [{ title: '체험' }] } } }), true);
  assert.equal(shouldEnrich({ metadata: { festival_content: { enriched_at: '2026-08-25T00:00:00Z', summary: '축제 목적', programs: [{ title: '체험' }] } } }), false);
});

test('removes web citations from the purpose shown in the service', () => {
  const content = normalizeOpenAiContent({
    summary: '황새 보전 가치를 알리는 축제입니다. ([yesan.go.kr](https://yesan.go.kr/festival))',
    tags: [],
    highlights: [],
    recommended_for: null
  });
  assert.equal(content.summary, '황새 보전 가치를 알리는 축제입니다.');
  assert.equal(shouldEnrich({ metadata: { festival_content: { enriched_at: '2026-08-25T00:00:00Z', summary: '[출처](https://example.com)', programs: [{ title: '체험' }] } } }), true);
});

test('uses the next TourAPI key when the first key returns programs without an overview', async () => {
  const originalFetch = global.fetch;
  const originalFestivalKey = process.env.FESTIVAL_API_KEY;
  const originalTourKey = process.env.TOUR_API_KEY;
  process.env.FESTIVAL_API_KEY = 'intro-only-key';
  process.env.TOUR_API_KEY = 'overview-key';
  global.fetch = async (urlValue) => {
    const url = new URL(urlValue);
    const apiKey = url.searchParams.get('serviceKey');
    const endpoint = url.pathname.split('/').pop();
    if (endpoint === 'detailCommon2') {
      assert.equal(url.searchParams.has('contentTypeId'), false);
      assert.equal(url.searchParams.has('defaultYN'), false);
      assert.equal(url.searchParams.has('overviewYN'), false);
    } else assert.equal(url.searchParams.get('contentTypeId'), '15');
    let item = {};
    if (apiKey === 'intro-only-key' && endpoint === 'detailIntro2') item = { program: '재즈 공연' };
    if (apiKey === 'overview-key' && endpoint === 'detailCommon2') item = { overview: '<p>유성재즈 공식 소개입니다.</p>' };
    if (apiKey === 'intro-only-key' && endpoint === 'detailCommon2') {
      return new Response(JSON.stringify({ resultCode: '10', resultMsg: 'INVALID_REQUEST_PARAMETER_ERROR(contentTypeId)' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ response: { header: { resultCode: '0000' }, body: { items: { item: [item] } } } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };
  delete require.cache[require.resolve('../api/enrich-festivals')];
  const { fetchTourApiDetails } = require('../api/enrich-festivals');

  try {
    const result = await fetchTourApiDetails({ external_id: '2833003', metadata: {} });
    assert.equal(result.content.overview, '유성재즈 공식 소개입니다.');
    assert.equal(result.content.programs[0].title, '재즈 공연');
  } finally {
    global.fetch = originalFetch;
    if (originalFestivalKey === undefined) delete process.env.FESTIVAL_API_KEY;
    else process.env.FESTIVAL_API_KEY = originalFestivalKey;
    if (originalTourKey === undefined) delete process.env.TOUR_API_KEY;
    else process.env.TOUR_API_KEY = originalTourKey;
    delete require.cache[require.resolve('../api/enrich-festivals')];
  }
});
