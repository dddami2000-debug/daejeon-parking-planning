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

test('asks OpenAI to avoid invented program names', () => {
  const prompt = festivalSearchPrompt(
    { name: '계룡軍문화축제', address: '충청남도 계룡시', start_date: '2026-10-01', end_date: '2026-10-05' },
    { summary: null, programs: [] }
  );
  assert.match(prompt, /공식 출처/);
  assert.match(prompt, /만들어내지 말고/);
  assert.match(prompt, /계룡軍문화축제/);
});

test('uses an accessible search model default in the example environment', () => {
  const exampleEnv = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', '.env.example'), 'utf8');
  assert.match(exampleEnv, /^OPENAI_SEARCH_MODEL=gpt-5-mini$/m);
});
