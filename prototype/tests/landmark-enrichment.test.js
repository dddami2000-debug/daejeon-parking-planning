const test = require('node:test');
const assert = require('node:assert/strict');

const {
  allowedDomainsFor,
  imageResultsFromResponse,
  landmarkSearchPrompt,
  normalizeEnrichment,
  pickOfficialImage,
  sourceUrlsFromResponse
} = require('../api/_landmark-enrichment');
const { shouldEnrich } = require('../api/enrich-landmarks');
const { imageMatchFor, shouldFillImage } = require('../api/fill-landmark-images');

const response = {
  output: [{
    type: 'web_search_call',
    action: { sources: [{ url: 'https://www.daejeon.go.kr/tour/arboretum' }] },
    results: [
      {
        type: 'image_result',
        image_url: 'https://cdn.daejeon.go.kr/arboretum.jpg',
        source_website_url: 'https://www.daejeon.go.kr/tour/arboretum',
        caption: '한밭수목원 전경'
      },
      {
        type: 'image_result',
        image_url: 'https://untrusted.example/photo.jpg',
        source_website_url: 'https://untrusted.example/place',
        caption: '외부 이미지'
      }
    ]
  }]
};

test('uses public and supplied official domains for landmark searches', () => {
  assert.deepEqual(allowedDomainsFor({ homepage_url: 'https://www.hanbat-arboretum.kr/info' }), [
    'daejeon.go.kr', 'daejeontour.co.kr', 'visitkorea.or.kr', 'knto.or.kr', 'hanbat-arboretum.kr'
  ]);
});

test('keeps only the image whose source page is an allowed official domain', () => {
  const allowedDomains = allowedDomainsFor({});
  const image = pickOfficialImage(imageResultsFromResponse(response), allowedDomains);
  assert.deepEqual(image, {
    imageUrl: 'https://cdn.daejeon.go.kr/arboretum.jpg',
    sourceUrl: 'https://www.daejeon.go.kr/tour/arboretum',
    caption: '한밭수목원 전경'
  });
  assert.deepEqual(sourceUrlsFromResponse(response), [
    'https://www.daejeon.go.kr/tour/arboretum',
    'https://untrusted.example/place'
  ]);
});

test('normalizes concise place content without accepting malformed highlight cards', () => {
  assert.deepEqual(normalizeEnrichment({
    summary: '  도심 속 수목원입니다. ',
    tags: ['산책', '', '사진'],
    highlights: [{ title: '계절 정원', description: '꽃과 나무를 둘러봐요.' }, { title: '빈 항목' }],
    visit_tip: '편한 신발을 추천해요.',
    recommended_for: '가족 · 산책객',
    admission: '무료',
    venue: '한밭수목원',
    operating_hours: '운영시간은 공식 안내 확인'
  }), {
    summary: '도심 속 수목원입니다.',
    tags: ['산책', '사진'],
    highlights: [{ title: '계절 정원', description: '꽃과 나무를 둘러봐요.' }],
    visitTip: '편한 신발을 추천해요.',
    audience: '가족 · 산책객',
    admission: '무료',
    venue: '한밭수목원',
    operatingHours: '운영시간은 공식 안내 확인'
  });
});

test('prompt contains the public dataset context and prohibits guessing', () => {
  const prompt = landmarkSearchPrompt({ name: '한밭수목원', address: '대전광역시 서구', description: '도심 수목원' });
  assert.match(prompt, /한밭수목원/);
  assert.match(prompt, /추측하지/);
  assert.match(prompt, /도심 수목원/);
});

test('does not endlessly re-enrich a completed landmark without an image or summary', () => {
  assert.equal(shouldEnrich({
    description: null,
    image_url: null,
    metadata: { landmark_enrichment: { enriched_at: '2026-08-25T00:00:00.000Z' } }
  }, false), false);
});

test('uses a Korea Tourism Organization image only for an exact landmark-name match', () => {
  const match = imageMatchFor({ name: '대전시립미술관' }, [{
    title: '대전시립미술관', contentid: '1234', firstimage: 'https://cdn.visitkorea.or.kr/museum.jpg'
  }]);
  assert.equal(match.imageUrl, 'https://cdn.visitkorea.or.kr/museum.jpg');
  assert.equal(imageMatchFor({ name: '대전시립미술관' }, [{
    title: '대전시립박물관', firstimage: 'https://cdn.visitkorea.or.kr/wrong.jpg'
  }]), null);
});

test('marks unmatched Korea Tourism Organization image attempts as completed', () => {
  assert.equal(shouldFillImage({ metadata: { landmark_enrichment: {
    enriched_at: '2026-08-25T00:00:00.000Z', kto_image_checked_at: '2026-08-25T00:01:00.000Z'
  } } }, false), false);
});
