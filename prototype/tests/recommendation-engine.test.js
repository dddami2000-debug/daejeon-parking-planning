const test = require('node:test');
const assert = require('node:assert/strict');

const recommender = require('../recommendation-engine');

const NOW = Date.parse('2026-08-25T12:00:00+09:00');
const science = {
  id: 'science', type: 'festival', name: '대전 사이언스 페스티벌', category: '과학축제',
  area: '유성구 도룡동', summary: '로봇과 인공지능을 직접 만나는 가족 체험 축제',
  tags: ['로봇', 'AI', '가족 체험'], audience: '가족과 학생',
  affinities: {'공연·축제형': 72, '감성·데이트형': 42, '가족·체험형': 96, '역사·힐링형': 40},
  lat: 36.374, lng: 127.387
};
const scienceNight = {
  ...science, id: 'science-night', name: '과학관 별빛 체험', category: '과학축제',
  area: '유성구 구성동', summary: '천문 관측과 로봇을 함께 즐기는 야간 과학 체험',
  tags: ['로봇', '천문', '가족 체험'], lat: 36.376, lng: 127.373
};
const wine = {
  id: 'wine', type: 'festival', name: '대전 국제 와인 EXPO', category: '와인축제',
  area: '유성구 도룡동', summary: '세계 와인을 시음하는 성인 미식 축제',
  tags: ['와인', '시음', '미식'], audience: '성인',
  affinities: {'공연·축제형': 58, '감성·데이트형': 92, '가족·체험형': 22, '역사·힐링형': 54},
  lat: 36.375, lng: 127.389
};
const bread = {
  id: 'bread', type: 'festival', name: '대전 빵축제', category: '먹거리축제',
  area: '중구 은행동', summary: '대전 빵집을 한자리에서 만나는 먹거리 축제',
  tags: ['빵', '먹거리', '가족'], audience: '누구나',
  affinities: {'공연·축제형': 76, '감성·데이트형': 68, '가족·체험형': 72, '역사·힐링형': 44},
  lat: 36.328, lng: 127.428
};

test('keeps the base recommendation unchanged until a festival interaction exists', () => {
  assert.equal(recommender.behaviorAffinity(scienceNight, [science, scienceNight], {}), null);
  assert.equal(recommender.combineScore(82, null), 82);
  assert.equal(recommender.hasHistory({}), false);
});

test('never applies festival personalization to a parking candidate', () => {
  const parking = {...scienceNight, id: 'parking-1', type: 'parking', name: '대전역 주차장'};
  const history = recommender.recordInteraction({}, science.id, 'select', NOW);
  assert.equal(recommender.behaviorAffinity(parking, [science, parking], history, NOW), null);
});

test('ranks a festival similar to the recently viewed festival above an unrelated one', () => {
  const history = recommender.recordInteraction({}, science.id, 'view', NOW);
  const catalog = [science, scienceNight, wine];
  const similar = recommender.behaviorAffinity(scienceNight, catalog, history, NOW);
  const unrelated = recommender.behaviorAffinity(wine, catalog, history, NOW);

  assert.ok(similar.score > unrelated.score);
  assert.equal(similar.referenceId, science.id);
});

test('gives an explicit festival selection more influence than a map-pin detail view', () => {
  let selectedHistory = recommender.recordInteraction({}, science.id, 'select', NOW);
  selectedHistory = recommender.recordInteraction(selectedHistory, wine.id, 'view', NOW);
  let viewedHistory = recommender.recordInteraction({}, science.id, 'view', NOW);
  viewedHistory = recommender.recordInteraction(viewedHistory, wine.id, 'select', NOW);
  const catalog = [science, scienceNight, wine];

  const selectionLed = recommender.behaviorAffinity(scienceNight, catalog, selectedHistory, NOW);
  const viewLed = recommender.behaviorAffinity(scienceNight, catalog, viewedHistory, NOW);
  assert.ok(selectionLed.score > viewLed.score);
});

test('reduces the influence of old interactions', () => {
  const oldAt = NOW - 120 * 86400000;
  let history = recommender.recordInteraction({}, science.id, 'view', oldAt);
  history = recommender.recordInteraction(history, wine.id, 'view', NOW);
  const result = recommender.behaviorAffinity(scienceNight, [science, scienceNight, wine], history, NOW);

  assert.equal(result.referenceId, wine.id);
  assert.ok(result.score < recommender.placeSimilarity(scienceNight, science));
});

test('uses interaction strength as confidence instead of giving every history item full weight', () => {
  const oldAt = NOW - 120 * 86400000;
  const recentView = recommender.recordInteraction({}, science.id, 'view', NOW);
  const recentSelection = recommender.recordInteraction({}, science.id, 'select', NOW);
  const oldView = recommender.recordInteraction({}, science.id, 'view', oldAt);
  const catalog = [science, scienceNight];
  const viewBehavior = recommender.behaviorAffinity(scienceNight, catalog, recentView, NOW);
  const selectionBehavior = recommender.behaviorAffinity(scienceNight, catalog, recentSelection, NOW);
  const oldBehavior = recommender.behaviorAffinity(scienceNight, catalog, oldView, NOW);
  const base = 60;

  assert.ok(selectionBehavior.confidence > viewBehavior.confidence);
  assert.ok(viewBehavior.confidence > oldBehavior.confidence);
  assert.ok(recommender.combineScore(base, selectionBehavior) > recommender.combineScore(base, viewBehavior));
  assert.ok(recommender.combineScore(base, viewBehavior) > recommender.combineScore(base, oldBehavior));
});

test('does not recommend a festival from its own interaction record', () => {
  const history = recommender.recordInteraction({}, science.id, 'select', NOW);
  assert.equal(recommender.behaviorAffinity(science, [science], history, NOW), null);
});

test('normalizes corrupt history, suppresses rapid repeats, caps storage, and does not mutate input', () => {
  assert.deepEqual(recommender.normalizeHistory(null), {});
  assert.deepEqual(recommender.normalizeHistory([]), {});

  const input = {};
  const once = recommender.recordInteraction(input, science.id, 'view', NOW);
  const duplicate = recommender.recordInteraction(once, science.id, 'view', NOW + 1000);
  assert.deepEqual(input, {});
  assert.equal(once[science.id].views, 1);
  assert.equal(duplicate[science.id].views, 1);

  const oversized = Object.fromEntries(Array.from({length: 24}, (_, index) => [
    `festival-${index}`,
    {views: 1, selections: 0, lastAt: NOW + index}
  ]));
  const normalized = recommender.normalizeHistory(oversized);
  assert.equal(Object.keys(normalized).length, 20);
  assert.ok(normalized['festival-23']);
  assert.equal(normalized['festival-0'], undefined);
});

test('combines personal behavior conservatively with the existing recommendation score', () => {
  assert.equal(recommender.combineScore(80, {score: 100, confidence: 1}), 87);
  assert.equal(recommender.combineScore(80, {score: 0, confidence: 1}), 52);
  assert.equal(recommender.combineScore(80, {score: 100, confidence: 0.5}), 84);
});
