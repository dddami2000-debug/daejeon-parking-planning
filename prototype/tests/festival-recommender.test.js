const test = require('node:test');
const assert = require('node:assert/strict');

const recommender = require('../festival-recommender');

const NOW = Date.parse('2026-08-25T12:00:00+09:00');
const beer = {
  id: 'beer', type: 'festival', name: '수제 맥주 축제', category: '먹거리축제',
  area: '충청남도 계룡시', summary: '지역 브루어리의 맥주와 안주를 시음하는 행사',
  tags: ['수제 맥주', '시음', '미식'], audience: '성인',
  affinities: {'공연·축제형': 70, '감성·데이트형': 92, '가족·체험형': 24, '역사·힐링형': 42},
  lat: 36.27, lng: 127.25
};
const wine = {
  id: 'wine', type: 'festival', name: '대전 국제 와인 EXPO', category: '와인축제',
  area: '대전광역시 유성구', summary: '세계 와인과 푸드 페어링을 즐기는 가을 미식 축제',
  tags: ['와인 시음', '푸드 페어링', '미식'], audience: '성인과 미식가',
  affinities: {'공연·축제형': 72, '감성·데이트형': 97, '가족·체험형': 42, '역사·힐링형': 55},
  lat: 36.374, lng: 127.386
};
const science = {
  id: 'science', type: 'festival', name: '대전 사이언스 페스티벌', category: '과학축제',
  area: '대전광역시 유성구', summary: '로봇과 인공지능을 직접 만나는 가족 체험 축제',
  tags: ['로봇', 'AI', '가족 체험'], audience: '가족과 학생',
  affinities: {'공연·축제형': 72, '감성·데이트형': 42, '가족·체험형': 96, '역사·힐링형': 40},
  lat: 36.375, lng: 127.387
};

test('keeps the base score until a festival is viewed or favorited', () => {
  assert.equal(recommender.behaviorAffinity(wine, [beer, wine], {}), null);
  assert.equal(recommender.combineScore(78, null), 78);
  assert.equal(recommender.hasHistory({}), false);
});

test('connects alcohol-related favorites to the Daejeon wine expo', () => {
  const history = recommender.setFavorite({}, beer.id, true, NOW);
  const catalog = [beer, wine, science];
  const wineAffinity = recommender.behaviorAffinity(wine, catalog, history, NOW);
  const scienceAffinity = recommender.behaviorAffinity(science, catalog, history, NOW);

  assert.ok(wineAffinity.score > scienceAffinity.score);
  assert.equal(wineAffinity.referenceId, beer.id);
  assert.equal(wineAffinity.referenceFavorite, true);
  assert.ok(recommender.topicTokens(beer).has('alcohol'));
  assert.ok(recommender.topicTokens(wine).has('alcohol'));
  assert.ok(
    recommender.combineScore(58, wineAffinity) > recommender.combineScore(76, scienceAffinity),
    'a strongly related wine festival should outrank an unrelated festival even with a lower base score'
  );
});

test('connects produce interest to other agricultural and harvest festivals', () => {
  const apple = {
    ...beer,
    id: 'apple',
    name: '예산 사과 축제',
    category: '농산물축제',
    area: '충청남도 예산군',
    summary: '지역 농가의 사과와 로컬푸드를 만나는 수확 축제',
    tags: ['농산물', '사과', '수확'],
    affinities: {'공연·축제형': 55, '감성·데이트형': 45, '가족·체험형': 86, '역사·힐링형': 58}
  };
  const chestnut = {
    ...apple,
    id: 'chestnut',
    name: '공주 알밤 축제',
    area: '충청남도 공주시',
    summary: '지역 농산물 알밤을 직접 맛보고 수확을 체험하는 축제',
    tags: ['농산물', '밤', '농촌 체험']
  };
  const concert = {
    ...science,
    id: 'concert',
    name: '대전 재즈 페스티벌',
    area: '대전광역시 중구',
    category: '음악축제',
    summary: '도심에서 라이브 음악과 공연을 즐기는 축제',
    tags: ['재즈', '라이브', '공연']
  };
  const history = recommender.setFavorite({}, apple.id, true, NOW);
  const catalog = [apple, chestnut, concert];

  assert.ok(recommender.topicTokens(apple).has('local_produce'));
  assert.ok(recommender.topicTokens(chestnut).has('local_produce'));
  assert.ok(
    recommender.behaviorAffinity(chestnut, catalog, history, NOW).score
      > recommender.behaviorAffinity(concert, catalog, history, NOW).score
  );
});

test('matches broad search words to related festival topics', () => {
  const seafood = {
    ...science,
    id: 'seafood',
    name: '서해 수산물 축제',
    category: '먹거리축제',
    summary: '새우와 굴, 조개 등 지역 해산물을 맛보는 행사',
    tags: ['수산물', '해산물', '새우']
  };

  assert.equal(recommender.matchesTopicQuery(wine, '술'), true);
  assert.equal(recommender.matchesTopicQuery(beer, '주류'), true);
  assert.equal(recommender.matchesTopicQuery(seafood, '수산물'), true);
  assert.equal(recommender.matchesTopicQuery(science, '술'), false);
  assert.equal(recommender.matchesTopicQuery(wine, '충북'), false);
});

test('matches province abbreviations to their full administrative names', () => {
  const chungbuk = {...science, id: 'chungbuk', area: '충청북도 제천시'};

  assert.equal(recommender.matchesRegionQuery(chungbuk, '충북'), true);
  assert.equal(recommender.matchesRegionQuery(chungbuk, '충청북도'), true);
  assert.equal(recommender.matchesRegionQuery(chungbuk, '제천시'), true);
  assert.equal(recommender.matchesRegionQuery(chungbuk, '충남'), false);
});

test('repeated views raise festivals from the same administrative region', () => {
  const viewed = {
    ...science,
    id: 'viewed-region',
    name: '유성 체험 축제',
    area: '대전광역시 유성구',
    summary: '시민 체험 행사',
    tags: ['시민 체험']
  };
  const sameRegion = {
    ...viewed,
    id: 'same-region',
    name: '유성 문화 축제',
    category: '문화축제',
    summary: '지역 문화 행사',
    tags: ['지역 문화']
  };
  const distantRegion = {
    ...sameRegion,
    id: 'distant-region',
    name: '부산 문화 축제',
    area: '부산광역시 해운대구',
    lat: 35.16,
    lng: 129.16
  };
  let history = {};
  for (let index = 0; index < 4; index += 1) {
    history = recommender.recordView(history, viewed.id, NOW + index * 11 * 60000);
  }
  const catalog = [viewed, sameRegion, distantRegion];

  assert.deepEqual(recommender.regionTokens(sameRegion), ['대전광역시', '유성구']);
  assert.equal(recommender.regionSimilarity(viewed, sameRegion), 1);
  assert.equal(recommender.regionSimilarity(viewed, distantRegion), 0);
  assert.ok(
    recommender.behaviorAffinity(sameRegion, catalog, history, NOW + 33 * 60000).score
      > recommender.behaviorAffinity(distantRegion, catalog, history, NOW + 33 * 60000).score
  );
});

test('treats a favorite as a stronger signal than a single detail view', () => {
  const favoriteHistory = recommender.setFavorite({}, beer.id, true, NOW);
  const viewHistory = recommender.recordView({}, beer.id, NOW);
  const catalog = [beer, wine];
  const favoriteAffinity = recommender.behaviorAffinity(wine, catalog, favoriteHistory, NOW);
  const viewAffinity = recommender.behaviorAffinity(wine, catalog, viewHistory, NOW);

  assert.ok(favoriteAffinity.confidence > viewAffinity.confidence);
  assert.ok(recommender.combineScore(55, favoriteAffinity) > recommender.combineScore(55, viewAffinity));
});

test('lets repeated festival views build confidence over time', () => {
  let repeated = {};
  for (let index = 0; index < 4; index += 1) {
    repeated = recommender.recordView(repeated, beer.id, NOW + index * 11 * 60000);
  }
  const once = recommender.recordView({}, beer.id, NOW);
  const catalog = [beer, wine];

  assert.equal(repeated[beer.id].views, 4);
  assert.ok(
    recommender.behaviorAffinity(wine, catalog, repeated, NOW + 33 * 60000).confidence
      > recommender.behaviorAffinity(wine, catalog, once, NOW + 33 * 60000).confidence
  );
});

test('removing a favorite removes its strong signal but keeps genuine views', () => {
  let history = recommender.recordView({}, beer.id, NOW);
  history = recommender.setFavorite(history, beer.id, true, NOW + 1000);
  history = recommender.setFavorite(history, beer.id, false, NOW + 2000);

  assert.equal(recommender.isFavorite(history, beer.id), false);
  assert.equal(history[beer.id].views, 1);
});

test('suppresses accidental rapid repeat views and ignores parking candidates', () => {
  const once = recommender.recordView({}, beer.id, NOW);
  const duplicate = recommender.recordView(once, beer.id, NOW + 1000);
  const parking = {...wine, id: 'parking-1', type: 'parking', name: '엑스포 주차장'};

  assert.equal(duplicate[beer.id].views, 1);
  assert.equal(recommender.behaviorAffinity(parking, [beer, parking], once, NOW), null);
});

test('combines behavior conservatively with the visit-condition score', () => {
  assert.equal(recommender.combineScore(80, {score: 100, confidence: 1}), 89);
  assert.equal(recommender.combineScore(80, {score: 0, confidence: 1}), 44);
  assert.equal(recommender.combineScore(80, {score: 100, confidence: 0.5}), 85);
});
