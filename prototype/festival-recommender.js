(function attachFestivalRecommender(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.FestivalRecommender = api;
})(typeof window !== 'undefined' ? window : globalThis, function createFestivalRecommender() {
  // 개인화 신호의 세기. 상세 조회 1회는 1점, 즐겨찾기는 8점으로 센다.
  // 반감기 30일은 '조회'에만 적용된다. 즐겨찾기는 사용자가 직접 해제할 때까지
  // 세기가 줄지 않는 명시적 신호라 감쇠시키지 않는다.
  const VIEW_WEIGHT = 1;
  const FAVORITE_WEIGHT = 8;
  const VIEW_HALF_LIFE_DAYS = 30;
  const MAX_VIEW_STRENGTH = 12; // 한 축제를 반복해서 본다고 무한정 세지지 않게 상한을 둔다.
  const MAX_HISTORY_ITEMS = 50;
  const RAPID_REPEAT_MS = 600000; // 10분 안의 재방문은 같은 한 번의 조회로 본다.
  const FULL_CONFIDENCE_STRENGTH = 8; // 즐겨찾기 1건이면 확신도가 1이 된다.
  const MAX_BEHAVIOR_WEIGHT = 0.45; // 행동 신호가 최종 점수를 45% 넘게 좌우하지 않게 한다.
  const DAY_MS = 86400000;

  // 기본 추천 가중치. 취향 60 / 거리 25 / 일정 15은 초기 MVP 가설값이며,
  // 사용자 데이터(상세 조회율·즐겨찾기율)로 추후 검증해 조정한다.
  const RECOMMENDATION_WEIGHTS = { taste: 60, distance: 25, schedule: 15 };

  // 전국 축제를 다루므로 20km 밖을 전부 0점으로 만들지 않는다. 구간 사이는
  // 선형 보간해 경계에서 값이 끊기지 않고, 300km 밖도 5점까지만 완만히 낮아진다.
  const DISTANCE_BANDS = [
    { from: 0, to: 10, high: 100, low: 85 },   // 근거리
    { from: 10, to: 50, high: 85, low: 65 },   // 당일 이동
    { from: 50, to: 150, high: 65, low: 40 },  // 근교·단기 여행
    { from: 150, to: 300, high: 40, low: 20 }  // 목적형 여행
  ];
  const DISTANCE_FAR_FLOOR = 5;
  const DISTANCE_FAR_DECAY_KM = 400;
  const NEUTRAL_DISTANCE_SCORE = 50; // 위치를 모르면 거리로 순위를 흔들지 않는다.

  // 일정 점수. 여행 날짜를 고르면 '오늘'이 아니라 그 기간을 기준으로 계산한다.
  const SCHEDULE_SCORES = { open: 100, soon: 90, near: 75, later: 60, ended: 0, unknown: 60 };
  const SCHEDULE_SOON_DAYS = 7;
  const SCHEDULE_NEAR_DAYS = 30;
  const NON_FESTIVAL_SCHEDULE_SCORE = 70;

  // 추천 목록의 과도한 중복 완화. 동일 주제 + 동일 광역지역이 3개 연속으로
  // 나오지 않게 하되, 대체 후보는 바로 아래 구간에서만 끌어올려 원점수 순서를 지킨다.
  const MAX_SAME_GROUP_RUN = 2;
  const DIVERSITY_LOOKAHEAD = 6;

  // 숫자 추천 점수는 내부 정렬에만 쓰고, 화면에는 근거를 설명하는 문구만 노출한다.
  const FIT_COPY = {
    favorite: '즐겨찾기한 축제와 비슷해요',
    viewed: '자주 본 축제와 비슷해요',
    taste: '취향에 잘 맞아요',
    tripOpen: '여행 기간에 열려요',
    openNow: '지금 열리고 있어요',
    fallback: '방문 조건에 맞아요'
  };
  const FIT_TASTE_THRESHOLD = 70;
  const FIT_BEHAVIOR_SIMILARITY = 55;
  const FIT_BEHAVIOR_CONFIDENCE = 0.5;
  const genericValues = new Set(['지역축제', '지역 정보 확인', '공식 일정 확인 필요', '친구 · 연인 · 가족']);
  const topicGroups = {
    alcohol: ['와인', '술', '주류', '맥주', '막걸리', '소주', '칵테일', '시음', '양조', '브루어리'],
    local_produce: ['농산물', '농업', '농촌', '로컬푸드', '특산물', '수확', '과수', '과일', '사과', '배축제', '포도', '복숭아', '딸기', '수박', '토마토', '인삼', '고추', '마늘', '쌀', '쌀축제', '감자', '고구마', '옥수수', '버섯', '알밤', '밤축제', '대추'],
    food: ['먹거리', '미식', '음식', '요리', '빵', '빵축제', '디저트', '커피', '푸드', '맛집', '쿠킹'],
    seafood: ['수산물', '해산물', '생선', '회', '회센터', '횟감', '새우', '게', '대게', '꽃게', '게장', '굴', '굴축제', '조개', '오징어', '낙지'],
    science: ['과학', '로봇', '인공지능', 'ai', '우주', '천문', '기술', '실험'],
    performance: ['공연', '콘서트', '라이브', '음악', '댄스', '퍼레이드', '무대'],
    night: ['야간', '야행', '밤', '밤축제', '밤거리', '밤공연', '야시장', '불꽃', '빛', '빛축제', '별빛', '조명'],
    family: ['가족', '어린이', '아이', '키즈', '학생', '체험', '교육'],
    nature: ['꽃', '꽃축제', '꽃박람회', '정원', '숲', '숲길', '산', '산림', '산행', '바다', '생태', '자연', '산책', '단풍', '벚꽃', '철쭉'],
    culture: ['역사', '전통', '문화', '예술', '공예', '박물관', '전시', '유산', '민속'],
    wellness: ['힐링', '건강', '웰니스', '명상', '온천', '치유', '요가'],
    sports: ['스포츠', '마라톤', '걷기', '자전거', '등산', '레저', '경기'],
    pet: ['반려동물', '반려견', '강아지', '고양이', '펫'],
    eco: ['환경', '친환경', '재활용', '탄소', '기후', '업사이클']
  };
  const topicLabels = {
    alcohol: '주류',
    local_produce: '농산물',
    food: '먹거리',
    seafood: '수산물',
    science: '과학',
    performance: '공연',
    night: '야간',
    family: '가족·체험',
    nature: '자연',
    culture: '문화·예술',
    wellness: '힐링',
    sports: '스포츠',
    pet: '반려동물',
    eco: '친환경'
  };
  const regionSearchAliases = {
    서울: ['서울특별시'], 부산: ['부산광역시'], 대구: ['대구광역시'], 인천: ['인천광역시'], 광주: ['광주광역시'], 대전: ['대전광역시'], 울산: ['울산광역시'], 세종: ['세종특별자치시'],
    경기: ['경기도'], 강원: ['강원특별자치도', '강원도'], 충북: ['충청북도'], 충남: ['충청남도'], 전북: ['전북특별자치도', '전라북도'], 전남: ['전라남도'], 경북: ['경상북도'], 경남: ['경상남도'], 제주: ['제주특별자치도', '제주도']
  };

  function clamp(value, min = 0, max = 100) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function normalizedTokens(values) {
    return new Set(values
      .filter(value => !genericValues.has(String(value || '').trim()))
      .flatMap(value => String(value || '').toLowerCase().split(/[^0-9a-z가-힣]+/u))
      .map(value => value.trim())
      .filter(value => value.length >= 2 && !['대전', '축제', '페스티벌'].includes(value)));
  }

  function jaccard(left, right, emptyValue = 0.35) {
    if (!left.size && !right.size) return emptyValue;
    const intersection = [...left].filter(value => right.has(value)).length;
    const union = new Set([...left, ...right]).size;
    return union ? intersection / union : 0;
  }

  function searchableText(value) {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value).toLowerCase();
    try { return JSON.stringify(value).toLowerCase(); } catch { return ''; }
  }

  function topicSources(place = {}) {
    return [
      {value: place.name, weight: 7},
      {value: place.category, weight: 5},
      {value: place.officialOverview || place.overview, weight: 4},
      {value: place.programs || place.officialProgram, weight: 4},
      {value: place.summary, weight: 3},
      {value: place.audience, weight: 2},
      {value: place.tags, weight: 1}
    ].map(source => ({text: searchableText(source.value), weight: source.weight}));
  }

  function aliasMatches(text, alias) {
    const keyword = searchableText(alias);
    if (!keyword) return false;
    if ([...keyword].length > 1) return text.includes(keyword);
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const particle = '(?:은|는|이|가|을|를|과|와|도|에|의|로|으로|에서|부터|까지|만|이나|나)?';
    return new RegExp(`(^|[^0-9a-z가-힣])${escaped}${particle}(?=$|[^0-9a-z가-힣])`, 'u').test(text);
  }

  function topicEvidence(place = {}) {
    return Object.entries(topicGroups).map(([topic, aliases], order) => {
      const score = topicSources(place).reduce((total, source) => total + aliases.reduce(
        (sourceScore, alias) => aliasMatches(source.text, alias) ? sourceScore + source.weight : sourceScore,
        0
      ), 0);
      return {topic, score, order};
    }).filter(item => item.score > 0)
      .sort((left, right) => right.score - left.score || left.order - right.order);
  }

  function topicTokens(place) {
    return new Set(topicEvidence(place).map(item => item.topic));
  }

  function topicTagLabels(place, limit = 3) {
    const max = Math.max(0, Math.floor(Number(limit) || 0));
    return topicEvidence(place).slice(0, max).map(item => topicLabels[item.topic]);
  }

  function matchesTopicQuery(place, query) {
    const queryTopics = topicTokens({name: String(query || '')});
    if (!queryTopics.size) return false;
    const placeTopics = topicTokens(place);
    return [...queryTopics].some(topic => placeTopics.has(topic));
  }

  function normalizedSearchValue(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function regionQueryVariants(query) {
    const normalized = normalizedSearchValue(query);
    const aliases = Object.entries(regionSearchAliases)
      .filter(([short, longNames]) => normalizedSearchValue(short) === normalized
        || longNames.some(name => normalizedSearchValue(name) === normalized))
      .flatMap(([short, longNames]) => [short, ...longNames]);
    return [...new Set([normalized, ...aliases.map(normalizedSearchValue)])].filter(Boolean);
  }

  function matchesRegionQuery(place, query) {
    const region = normalizedSearchValue(place?.area || place?.region || place?.address);
    return Boolean(region) && regionQueryVariants(query).some(keyword => region.includes(keyword));
  }

  function regionTokens(place = {}) {
    const source = String(place.area || '').trim().replace(/\s+/g, ' ');
    if (!source || genericValues.has(source)) return [];
    const administrative = source.match(/[가-힣]+(?:특별자치도|특별자치시|광역시|특별시|도|시|군|구)/g) || [];
    return [...new Set(administrative.map(token => token.replace(/특별자치/g, '')))].slice(0, 3);
  }

  function regionSimilarity(candidate, reference) {
    const candidateRegions = regionTokens(candidate);
    const referenceRegions = regionTokens(reference);
    if (!candidateRegions.length || !referenceRegions.length) return 0.35;
    const shared = candidateRegions.filter(region => referenceRegions.includes(region));
    if (!shared.length) return 0;
    if (candidateRegions.slice(0, 2).join('|') === referenceRegions.slice(0, 2).join('|')) return 1;
    if (candidateRegions[0] === referenceRegions[0]) return 0.62;
    return 0.48;
  }

  function affinitySimilarity(left = {}, right = {}) {
    const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])]
      .filter(key => Number.isFinite(Number(left[key])) && Number.isFinite(Number(right[key])));
    if (!keys.length) return 0.5;
    const difference = keys.reduce((sum, key) => sum + Math.abs(Number(left[key]) - Number(right[key])), 0) / keys.length;
    return 1 - clamp(difference) / 100;
  }

  function geographicSimilarity(candidate, reference) {
    const values = [candidate.lat, candidate.lng, reference.lat, reference.lng].map(Number);
    if (!values.every(Number.isFinite)) return 0.4;
    const radians = value => value * Math.PI / 180;
    const [lat1, lng1, lat2, lng2] = values;
    const dLat = radians(lat2 - lat1);
    const dLng = radians(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2;
    const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(0, 1 - distance / 120);
  }

  function placeSimilarity(candidate, reference) {
    if (!candidate || !reference || candidate.id === reference.id) return 0;
    if (candidate.type !== 'festival' || reference.type !== 'festival') return 0;
    const candidateCategory = genericValues.has(String(candidate.category || '').trim()) ? '' : candidate.category;
    const referenceCategory = genericValues.has(String(reference.category || '').trim()) ? '' : reference.category;
    const categoryMatch = candidateCategory && referenceCategory && candidateCategory === referenceCategory ? 1 : 0;
    const topicSimilarity = jaccard(topicTokens(candidate), topicTokens(reference));
    const tagSimilarity = jaccard(normalizedTokens(candidate.tags || []), normalizedTokens(reference.tags || []));
    const textSimilarity = jaccard(
      normalizedTokens([candidate.name, candidate.summary, candidate.audience]),
      normalizedTokens([reference.name, reference.summary, reference.audience])
    );
    const tasteSimilarity = affinitySimilarity(candidate.affinities, reference.affinities);
    const regionalSimilarity = regionSimilarity(candidate, reference);
    const nearbySimilarity = geographicSimilarity(candidate, reference);
    return Math.round(clamp((
      topicSimilarity * 0.35
      + regionalSimilarity * 0.18
      + tasteSimilarity * 0.2
      + categoryMatch * 0.08
      + tagSimilarity * 0.08
      + nearbySimilarity * 0.07
      + textSimilarity * 0.04
    ) * 100));
  }

  function normalizeHistory(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    return Object.fromEntries(Object.entries(raw)
      .filter(([id, entry]) => id && entry && typeof entry === 'object')
      .map(([id, entry]) => [id, {
        views: Math.max(0, Math.floor(Number(entry.views) || 0)),
        favorite: Boolean(entry.favorite),
        lastAt: Math.max(0, Number(entry.lastAt) || 0),
        lastViewAt: Math.max(0, Number(entry.lastViewAt) || 0),
        favoritedAt: Math.max(0, Number(entry.favoritedAt) || 0)
      }])
      .filter(([, entry]) => entry.views || entry.favorite)
      .sort((left, right) => Number(right[1].favorite) - Number(left[1].favorite) || right[1].lastAt - left[1].lastAt)
      .slice(0, MAX_HISTORY_ITEMS));
  }

  function recordView(rawHistory, placeId, now = Date.now()) {
    const history = normalizeHistory(rawHistory);
    if (!placeId) return history;
    const previous = history[placeId] || {views: 0, favorite: false, lastAt: 0, lastViewAt: 0, favoritedAt: 0};
    if (previous.lastViewAt && now - previous.lastViewAt < RAPID_REPEAT_MS) return history;
    history[placeId] = {...previous, views: previous.views + 1, lastAt: now, lastViewAt: now};
    return normalizeHistory(history);
  }

  function setFavorite(rawHistory, placeId, favorite, now = Date.now()) {
    const history = normalizeHistory(rawHistory);
    if (!placeId) return history;
    const previous = history[placeId] || {views: 0, favorite: false, lastAt: 0, lastViewAt: 0, favoritedAt: 0};
    history[placeId] = {
      ...previous,
      favorite: Boolean(favorite),
      lastAt: now,
      favoritedAt: favorite ? now : previous.favoritedAt
    };
    return normalizeHistory(history);
  }

  function isFavorite(rawHistory, placeId) {
    return Boolean(normalizeHistory(rawHistory)[placeId]?.favorite);
  }

  function interactionStrength(entry, now = Date.now()) {
    const elapsedDays = Math.max(0, now - entry.lastViewAt) / 86400000;
    const viewStrength = Math.min(MAX_VIEW_STRENGTH, entry.views * VIEW_WEIGHT) * Math.pow(0.5, elapsedDays / VIEW_HALF_LIFE_DAYS);
    return viewStrength + (entry.favorite ? FAVORITE_WEIGHT : 0);
  }

  function behaviorAffinity(candidate, catalog, rawHistory, now = Date.now()) {
    if (!candidate || candidate.type !== 'festival') return null;
    const history = normalizeHistory(rawHistory);
    const references = catalog
      .filter(place => place.type === 'festival' && place.id !== candidate.id && history[place.id])
      .map(place => {
        const entry = history[place.id];
        const strength = interactionStrength(entry, now);
        const similarity = placeSimilarity(candidate, place);
        return {id: place.id, favorite: entry.favorite, strength, similarity, weightedSimilarity: strength * similarity};
      })
      .filter(item => item.strength > 0)
      .sort((left, right) => right.strength - left.strength)
      .slice(0, 5);
    if (!references.length) return null;
    const totalStrength = references.reduce((sum, item) => sum + item.strength, 0);
    const score = Math.round(references.reduce((sum, item) => sum + item.weightedSimilarity, 0) / totalStrength);
    const strongest = [...references].sort((left, right) => right.weightedSimilarity - left.weightedSimilarity)[0];
    return {
      score: clamp(score),
      confidence: Math.min(1, totalStrength / FULL_CONFIDENCE_STRENGTH),
      referenceId: strongest.id,
      referenceFavorite: strongest.favorite,
      referenceSimilarity: strongest.similarity
    };
  }

  function combineScore(baseScore, behavior) {
    if (!behavior || !Number.isFinite(Number(behavior.score))) return Math.round(clamp(baseScore));
    const confidence = Math.min(1, Math.max(0, Number(behavior.confidence ?? 1)));
    const behaviorWeight = MAX_BEHAVIOR_WEIGHT * confidence;
    return Math.round(clamp(Number(baseScore) * (1 - behaviorWeight) + Number(behavior.score) * behaviorWeight));
  }

  // 구간형 거리 점수. 0km=100, 10km=85, 50km=65, 150km=40, 300km=20이며
  // 각 경계는 양쪽 구간이 같은 값을 내도록 맞춰 불연속이 없다.
  function distanceScore(distanceKm) {
    // null·''처럼 '거리를 모른다'는 값이 0km로 둔갑하지 않도록 숫자만 받는다.
    const distance = typeof distanceKm === 'number' ? distanceKm : Number.NaN;
    if (!Number.isFinite(distance) || distance < 0) return NEUTRAL_DISTANCE_SCORE;
    const band = DISTANCE_BANDS.find(item => distance <= item.to);
    if (band) {
      const progress = (distance - band.from) / (band.to - band.from);
      return band.high + (band.low - band.high) * progress;
    }
    // 300km 밖은 20점에서 지수적으로 완만하게 낮아지되 5점 아래로는 내려가지 않는다.
    const farthest = DISTANCE_BANDS[DISTANCE_BANDS.length - 1];
    const decay = Math.exp(-(distance - farthest.to) / DISTANCE_FAR_DECAY_KM);
    return DISTANCE_FAR_FLOOR + (farthest.low - DISTANCE_FAR_FLOOR) * decay;
  }

  function koreaDayStart(value) {
    const day = String(value == null ? '' : value).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return NaN;
    return Date.parse(`${day}T00:00:00+09:00`);
  }

  function koreaDayEnd(value) {
    const day = String(value == null ? '' : value).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return NaN;
    return Date.parse(`${day}T23:59:59+09:00`);
  }

  // 여행 기간이 있으면 그 기간이, 없으면 '오늘 하루'가 비교 창이 된다.
  // 한쪽 날짜만 고른 기간은 지도 핀 상태와 같은 규칙으로 당일치기처럼 다룬다.
  function scheduleWindow({ today, rangeStart, rangeEnd } = {}) {
    const first = koreaDayStart(rangeStart);
    const last = koreaDayStart(rangeEnd);
    const from = Number.isFinite(first) ? first : last;
    const to = Number.isFinite(last) ? last : first;
    if (Number.isFinite(from) && Number.isFinite(to)) {
      return { start: Math.min(from, to), end: Math.max(from, to) + DAY_MS - 1000, selected: true };
    }
    const todayStart = koreaDayStart(today);
    if (!Number.isFinite(todayStart)) return null;
    return { start: todayStart, end: todayStart + DAY_MS - 1000, selected: false };
  }

  function scheduleScore(place, options = {}) {
    if (place && place.type && place.type !== 'festival') return NON_FESTIVAL_SCHEDULE_SCORE;
    const start = koreaDayStart(place && place.startDate);
    const end = koreaDayEnd(place && place.endDate);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) return SCHEDULE_SCORES.unknown;
    const window = scheduleWindow(options);
    if (!window) return SCHEDULE_SCORES.unknown;
    if (end < window.start) return SCHEDULE_SCORES.ended;
    if (start <= window.end) return SCHEDULE_SCORES.open;
    const days = Math.ceil((start - window.start) / DAY_MS);
    if (days <= SCHEDULE_SOON_DAYS) return SCHEDULE_SCORES.soon;
    if (days <= SCHEDULE_NEAR_DAYS) return SCHEDULE_SCORES.near;
    return SCHEDULE_SCORES.later;
  }

  // 취향·거리·일정 신호를 가중 평균한다. 값을 낼 수 없는 신호는 빼고
  // 남은 가중치로 다시 정규화해, 취향 미설정 사용자도 같은 척도를 유지한다.
  function baseScore({ taste, distance, schedule } = {}) {
    const signals = [
      [taste, RECOMMENDATION_WEIGHTS.taste],
      [distance, RECOMMENDATION_WEIGHTS.distance],
      [schedule, RECOMMENDATION_WEIGHTS.schedule]
    ].filter(([score]) => Number.isFinite(score));
    const weightTotal = signals.reduce((sum, [, weight]) => sum + weight, 0);
    if (!weightTotal) return 0;
    return Math.round(clamp(signals.reduce((sum, [score, weight]) => sum + Number(score) * weight, 0) / weightTotal));
  }

  // 주제와 광역지역이 모두 확인된 축제만 묶음으로 센다. 둘 중 하나라도
  // 모르면 null을 돌려주어 '같은 묶음이 반복됐다'고 단정하지 않는다.
  function recommendationGroupKey(place) {
    const topic = topicEvidence(place)[0];
    const region = regionTokens(place)[0];
    return topic && region ? `${topic.topic}|${region}` : null;
  }

  function diversifyRecommendations(items, options = {}) {
    const queue = Array.isArray(items) ? [...items] : [];
    const keyOf = typeof options.keyOf === 'function' ? options.keyOf : recommendationGroupKey;
    const maxRun = Math.max(1, Math.floor(Number(options.maxRun) || MAX_SAME_GROUP_RUN));
    const lookahead = Math.max(0, Math.floor(Number(options.lookahead ?? DIVERSITY_LOOKAHEAD)));
    const ordered = [];
    let runKey = null;
    let runLength = 0;
    while (queue.length) {
      let index = 0;
      if (runKey !== null && runLength >= maxRun && keyOf(queue[0]) === runKey) {
        const alternative = queue.slice(0, lookahead + 1).findIndex(item => keyOf(item) !== runKey);
        if (alternative > 0) index = alternative;
      }
      const [picked] = queue.splice(index, 1);
      const key = keyOf(picked);
      if (key !== null && key === runKey) runLength += 1;
      else {
        runKey = key;
        runLength = 1;
      }
      ordered.push(picked);
    }
    return ordered;
  }

  // 정렬용 숫자 점수 대신 화면에 보여줄 근거 문구를 고른다.
  function recommendationFitCopy({ tasteScore, scheduleScore: schedule, behavior, tripSelected } = {}) {
    if (behavior
      && Number(behavior.referenceSimilarity) >= FIT_BEHAVIOR_SIMILARITY
      && Number(behavior.confidence) >= FIT_BEHAVIOR_CONFIDENCE) {
      return behavior.referenceFavorite ? FIT_COPY.favorite : FIT_COPY.viewed;
    }
    if (Number(tasteScore) >= FIT_TASTE_THRESHOLD) return FIT_COPY.taste;
    if (Number(schedule) >= SCHEDULE_SCORES.open) return tripSelected ? FIT_COPY.tripOpen : FIT_COPY.openNow;
    return FIT_COPY.fallback;
  }

  function hasHistory(rawHistory) {
    return Object.keys(normalizeHistory(rawHistory)).length > 0;
  }

  return {
    FAVORITE_WEIGHT,
    FIT_COPY,
    RECOMMENDATION_WEIGHTS,
    SCHEDULE_SCORES,
    VIEW_WEIGHT,
    baseScore,
    behaviorAffinity,
    combineScore,
    distanceScore,
    diversifyRecommendations,
    hasHistory,
    isFavorite,
    matchesRegionQuery,
    matchesTopicQuery,
    normalizeHistory,
    placeSimilarity,
    regionSimilarity,
    regionTokens,
    recommendationFitCopy,
    recommendationGroupKey,
    recordView,
    scheduleScore,
    setFavorite,
    topicTagLabels,
    topicGroups,
    topicTokens
  };
});
