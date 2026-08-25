(function attachFestivalRecommender(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.FestivalRecommender = api;
})(typeof window !== 'undefined' ? window : globalThis, function createFestivalRecommender() {
  const VIEW_WEIGHT = 1;
  const FAVORITE_WEIGHT = 8;
  const VIEW_HALF_LIFE_DAYS = 30;
  const MAX_HISTORY_ITEMS = 50;
  const RAPID_REPEAT_MS = 600000;
  const FULL_CONFIDENCE_STRENGTH = 8;
  const MAX_BEHAVIOR_WEIGHT = 0.45;
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
    const viewStrength = Math.min(12, entry.views * VIEW_WEIGHT) * Math.pow(0.5, elapsedDays / VIEW_HALF_LIFE_DAYS);
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

  function hasHistory(rawHistory) {
    return Object.keys(normalizeHistory(rawHistory)).length > 0;
  }

  return {
    FAVORITE_WEIGHT,
    VIEW_WEIGHT,
    behaviorAffinity,
    combineScore,
    hasHistory,
    isFavorite,
    matchesRegionQuery,
    matchesTopicQuery,
    normalizeHistory,
    placeSimilarity,
    regionSimilarity,
    regionTokens,
    recordView,
    setFavorite,
    topicTagLabels,
    topicTokens
  };
});
