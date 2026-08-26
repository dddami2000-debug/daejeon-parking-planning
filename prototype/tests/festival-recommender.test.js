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

test('selects stable display tags from the official overview before old free-form tags', () => {
  const festival = {
    id: 'official-overview',
    type: 'festival',
    name: '도심 여름 축제',
    category: '지역축제',
    summary: '시민이 함께하는 행사',
    officialOverview: '지역 양조장의 와인과 맥주를 시음하며 라이브 음악 공연을 즐기는 축제입니다.',
    programs: '푸드 페어링과 콘서트',
    tags: ['로봇', 'AI', '가족 체험']
  };

  assert.deepEqual(recommender.topicTagLabels(festival, 3), ['주류', '공연', '먹거리']);
  assert.equal(recommender.topicTagLabels(festival, 3).includes('과학'), false);
});

test('does not infer one-character topics from unrelated Korean compound words', () => {
  const industryExpo = {
    id: 'industry-expo',
    type: 'festival',
    name: '도시지역혁신 산업박람회',
    category: '지역축제',
    officialOverview: '산업 기술과 정책 분야의 주체들이 성과를 공유하는 박람회입니다.'
  };

  assert.equal(recommender.topicTokens(industryExpo).has('alcohol'), false);
  assert.equal(recommender.topicTokens(industryExpo).has('seafood'), false);
  assert.equal(recommender.topicTokens(industryExpo).has('nature'), false);
});

test('treats a summer night as night content instead of chestnut produce', () => {
  const summerNight = {
    id: 'summer-night',
    type: 'festival',
    name: '한여름 밤 축제',
    summary: '거리 공연과 야시장을 늦은 밤까지 즐기는 도심 행사',
    programs: '라이브 공연과 먹거리 부스'
  };

  assert.deepEqual(recommender.topicTagLabels(summerNight, 3), ['야간', '공연', '먹거리']);
  assert.equal(recommender.topicTokens(summerNight).has('local_produce'), false);
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

test('states the default recommendation weights as named MVP hypothesis constants', () => {
  assert.deepEqual(recommender.RECOMMENDATION_WEIGHTS, {taste: 60, distance: 25, schedule: 15});

  const source = require('node:fs').readFileSync(
    require('node:path').join(__dirname, '..', 'festival-recommender.js'),
    'utf8'
  );
  assert.match(source, /초기 MVP 가설값이며/);
  assert.match(source, /상세 조회율·즐겨찾기율/);
});

test('weights taste, distance, and schedule at 60 / 25 / 15', () => {
  assert.equal(recommender.baseScore({taste: 100, distance: 0, schedule: 0}), 60);
  assert.equal(recommender.baseScore({taste: 0, distance: 100, schedule: 0}), 25);
  assert.equal(recommender.baseScore({taste: 0, distance: 0, schedule: 100}), 15);
  assert.equal(recommender.baseScore({taste: 90, distance: 100, schedule: 100}), 94);
});

test('renormalizes the remaining weights when a signal cannot be scored', () => {
  // 취향을 아직 설정하지 않은 사용자는 거리 25 : 일정 15 비율만 남는다.
  assert.equal(recommender.baseScore({taste: null, distance: 100, schedule: 100}), 100);
  assert.equal(recommender.baseScore({taste: null, distance: 0, schedule: 100}), 38);
  assert.equal(recommender.baseScore({}), 0);
});

test('scores nationwide distances on a continuous banded curve', () => {
  const score = recommender.distanceScore;

  // 구간 경계값은 요구한 기준과 정확히 일치한다.
  assert.equal(score(0), 100);
  assert.equal(score(10), 85);
  assert.equal(score(50), 65);
  assert.equal(score(150), 40);
  assert.equal(score(300), 20);

  // 경계 양쪽에서 값이 끊기지 않는다.
  [10, 50, 150, 300].forEach(boundary => {
    const before = score(boundary - 0.001);
    const after = score(boundary + 0.001);
    assert.ok(Math.abs(before - score(boundary)) < 0.01, `${boundary}km 왼쪽이 불연속`);
    assert.ok(Math.abs(after - score(boundary)) < 0.01, `${boundary}km 오른쪽이 불연속`);
  });
});

test('never drops a far festival to zero and keeps the curve monotonic', () => {
  const score = recommender.distanceScore;

  // 20km 밖이 전부 0점이 되던 예전 규칙을 되돌리지 않는다.
  assert.ok(score(20) > 0);
  assert.ok(score(400) >= 5 && score(400) < 20);
  assert.ok(score(100000) >= 5);

  let previous = Infinity;
  for (let km = 0; km <= 600; km += 0.5) {
    const current = score(km);
    assert.ok(current <= previous + 1e-9, `${km}km에서 점수가 다시 올라감`);
    assert.ok(current >= 5 && current <= 100, `${km}km 점수가 범위를 벗어남`);
    previous = current;
  }
});

test('treats an unknown location as neutral instead of as zero kilometres', () => {
  assert.equal(recommender.distanceScore(null), 50);
  assert.equal(recommender.distanceScore(undefined), 50);
  assert.equal(recommender.distanceScore(''), 50);
  assert.equal(recommender.distanceScore(Number.NaN), 50);
  assert.equal(recommender.distanceScore(-1), 50);
});

const scheduleFestival = (startDate, endDate) => ({type: 'festival', startDate, endDate});
const TODAY = '2026-08-26';

test('scores the schedule against today when no travel dates are picked', () => {
  const today = {today: TODAY};

  assert.equal(recommender.scheduleScore(scheduleFestival('2026-08-21', '2026-08-28'), today), 100);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-08-01', '2026-08-26'), today), 100);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-08-01', '2026-08-25'), today), 0);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-02', '2026-09-05'), today), 90);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-25', '2026-09-26'), today), 75);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-26', '2026-09-27'), today), 60);
});

test('scores the schedule against the chosen travel window instead of today', () => {
  const trip = {today: TODAY, rangeStart: '2026-09-10', rangeEnd: '2026-09-12'};

  // 여행 기간과 겹치면 100
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-11', '2026-09-13'), trip), 100);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-12', '2026-09-20'), trip), 100);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-01', '2026-09-10'), trip), 100);
  // 여행 기간 전에 끝났으면 0 — 오늘 기준으로는 진행 중이어도 마찬가지다.
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-08-21', '2026-08-28'), trip), 0);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-01', '2026-09-09'), trip), 0);
  // 여행 시작일 기준 7일 이내 / 30일 이내 / 그 뒤
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-17', '2026-09-18'), trip), 90);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-18', '2026-09-19'), trip), 75);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-10-10', '2026-10-11'), trip), 75);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-10-11', '2026-10-12'), trip), 60);
});

test('handles half-filled and reversed travel ranges without drifting a day', () => {
  const festival = scheduleFestival('2026-09-11', '2026-09-13');

  // 한쪽만 고른 기간은 지도 핀 상태와 같은 규칙으로 당일치기처럼 다룬다.
  assert.equal(recommender.scheduleScore(festival, {today: TODAY, rangeStart: '2026-09-12'}), 100);
  assert.equal(recommender.scheduleScore(festival, {today: TODAY, rangeEnd: '2026-09-12'}), 100);
  // 거꾸로 고른 기간도 같은 창으로 정규화한다.
  assert.equal(
    recommender.scheduleScore(festival, {today: TODAY, rangeStart: '2026-09-12', rangeEnd: '2026-09-10'}),
    recommender.scheduleScore(festival, {today: TODAY, rangeStart: '2026-09-10', rangeEnd: '2026-09-12'})
  );
  // 축제 마지막 날 자정 직전까지는 여전히 '겹침'이다. (KST 경계)
  assert.equal(recommender.scheduleScore(festival, {today: TODAY, rangeStart: '2026-09-13'}), 100);
  assert.equal(recommender.scheduleScore(festival, {today: TODAY, rangeStart: '2026-09-14'}), 0);
});

test('falls back to a neutral schedule score for missing or broken dates', () => {
  assert.equal(recommender.scheduleScore(scheduleFestival(null, null), {today: TODAY}), 60);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-01', null), {today: TODAY}), 60);
  assert.equal(recommender.scheduleScore(scheduleFestival('', '2026-09-01'), {today: TODAY}), 60);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026/09/01', '2026-09-02'), {today: TODAY}), 60);
  // 끝이 시작보다 앞선 잘못된 데이터를 '종료됨'으로 단정하지 않는다.
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-05', '2026-09-01'), {today: TODAY}), 60);
  assert.equal(recommender.scheduleScore(scheduleFestival('2026-09-01', '2026-09-02'), {}), 60);
  // 축제가 아닌 후보는 일정으로 순위를 흔들지 않는다.
  assert.equal(recommender.scheduleScore({type: 'parking'}, {today: TODAY}), 70);
});

test('groups a festival by its topic and metropolitan region only when both are known', () => {
  assert.equal(recommender.recommendationGroupKey(wine), 'alcohol|대전광역시');
  assert.equal(recommender.recommendationGroupKey(science), 'science|대전광역시');
  assert.equal(recommender.recommendationGroupKey({...wine, area: ''}), null);
  assert.equal(
    recommender.recommendationGroupKey({...wine, name: '축제', category: '', summary: '', tags: [], audience: ''}),
    null
  );
});

function longestSameGroupRun(ordered) {
  let longest = 0;
  let current = 0;
  let previous = null;
  ordered.forEach(item => {
    current = item.key !== null && item.key === previous ? current + 1 : 1;
    previous = item.key;
    longest = Math.max(longest, current);
  });
  return longest;
}

test('breaks up runs of the same topic and region without reshuffling the whole list', () => {
  const keyOf = item => item.key;
  const wineGroup = '와인|대전광역시';
  const scienceGroup = '과학|충청남도';
  const list = [
    {id: 'a', key: wineGroup},
    {id: 'b', key: wineGroup},
    {id: 'c', key: wineGroup},
    {id: 'd', key: wineGroup},
    {id: 'e', key: scienceGroup},
    {id: 'f', key: scienceGroup}
  ];
  const ordered = recommender.diversifyRecommendations(list, {keyOf});

  assert.deepEqual(ordered.map(item => item.id), ['a', 'b', 'e', 'c', 'd', 'f']);
  // 대체 후보가 남아 있는 한 같은 묶음이 3개 연속으로 나오지 않는다.
  assert.equal(longestSameGroupRun(ordered), 2);
  // 순수 함수: 입력 배열을 건드리지 않는다.
  assert.deepEqual(list.map(item => item.id), ['a', 'b', 'c', 'd', 'e', 'f']);
  // 원점수 1·2위는 그대로 유지되고, 각 묶음 안의 상대 순서도 지켜진다.
  assert.deepEqual(ordered.slice(0, 2).map(item => item.id), ['a', 'b']);
  assert.deepEqual(ordered.filter(item => item.key === wineGroup).map(item => item.id), ['a', 'b', 'c', 'd']);
  assert.deepEqual(ordered.filter(item => item.key === scienceGroup).map(item => item.id), ['e', 'f']);
});

test('accepts a leftover run rather than inventing a candidate that is not there', () => {
  const keyOf = item => item.key;
  // 마지막 구간에 대체 후보가 남지 않으면 원점수 순서를 지키는 쪽을 택한다.
  const ordered = recommender.diversifyRecommendations([
    {id: 'a', key: 'w'},
    {id: 'b', key: 'w'},
    {id: 'c', key: 'w'},
    {id: 'd', key: 'w'},
    {id: 'e', key: 's'},
    {id: 'f', key: 'w'}
  ], {keyOf});

  assert.deepEqual(ordered.map(item => item.id), ['a', 'b', 'e', 'c', 'd', 'f']);
  assert.equal(longestSameGroupRun(ordered), 3);
});

test('keeps the original order when diversity has nothing to trade', () => {
  const keyOf = item => item.key;
  const identical = ['a', 'b', 'c', 'd'].map(id => ({id, key: 'x'}));
  const unknown = ['a', 'b', 'c', 'd'].map(id => ({id, key: null}));

  // 대체 후보가 아예 없으면 원점수 순서를 유지한다.
  assert.deepEqual(recommender.diversifyRecommendations(identical, {keyOf}).map(item => item.id), ['a', 'b', 'c', 'd']);
  // 주제나 지역을 모르는 축제는 '반복'으로 세지 않는다.
  assert.deepEqual(recommender.diversifyRecommendations(unknown, {keyOf}).map(item => item.id), ['a', 'b', 'c', 'd']);
  assert.deepEqual(recommender.diversifyRecommendations([], {keyOf}), []);
  assert.deepEqual(recommender.diversifyRecommendations(null, {keyOf}), []);
});

test('only promotes a replacement once it is inside the lookahead window', () => {
  const keyOf = item => item.key;
  const sameGroup = Array.from({length: 20}, (unused, index) => ({id: `x${index}`, key: 'x'}));
  const ordered = recommender.diversifyRecommendations([...sameGroup, {id: 'z', key: 'y'}], {keyOf});
  const promotedTo = ordered.findIndex(item => item.id === 'z');

  // 맨 아래 후보를 1위로 끌어올리지 않는다: lookahead 안에 들어왔을 때만 한 칸씩 앞선다.
  assert.equal(promotedTo, 14);
  assert.ok(promotedTo >= 20 - 6, '원점수 순서를 크게 훼손하며 끌어올림');
  // 상위 후보들의 상대 순서는 그대로다.
  assert.deepEqual(
    ordered.filter(item => item.key === 'x').map(item => item.id),
    sameGroup.map(item => item.id)
  );
});

test('explains a recommendation with evidence copy instead of a number', () => {
  const copy = recommender.recommendationFitCopy;

  assert.equal(copy({tasteScore: 85}), '취향에 잘 맞아요');
  assert.equal(copy({tasteScore: 40, scheduleScore: 100, tripSelected: true}), '여행 기간에 열려요');
  assert.equal(copy({tasteScore: 40, scheduleScore: 100, tripSelected: false}), '지금 열리고 있어요');
  assert.equal(copy({tasteScore: 40, scheduleScore: 75}), '방문 조건에 맞아요');
  assert.equal(copy({}), '방문 조건에 맞아요');

  const strongFavorite = {referenceSimilarity: 70, confidence: 0.8, referenceFavorite: true};
  assert.equal(copy({tasteScore: 90, behavior: strongFavorite}), '즐겨찾기한 축제와 비슷해요');
  assert.equal(copy({tasteScore: 90, behavior: {...strongFavorite, referenceFavorite: false}}), '자주 본 축제와 비슷해요');
  // 근거가 약한 행동 신호로는 '비슷해요'라고 단정하지 않는다.
  assert.equal(copy({tasteScore: 90, behavior: {...strongFavorite, referenceSimilarity: 20}}), '취향에 잘 맞아요');
  assert.equal(copy({tasteScore: 90, behavior: {...strongFavorite, confidence: 0.1}}), '취향에 잘 맞아요');

  // 어떤 조합에서도 숫자 점수를 노출하지 않는다.
  Object.values(recommender.FIT_COPY).forEach(text => assert.doesNotMatch(text, /\d/));
});
