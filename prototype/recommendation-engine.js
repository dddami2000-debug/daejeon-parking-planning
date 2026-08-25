(function attachFestivalRecommender(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.FestivalRecommender = api;
})(typeof window !== 'undefined' ? window : globalThis, function createFestivalRecommender() {
  const VIEW_WEIGHT = 1;
  const SELECT_WEIGHT = 3;
  const HALF_LIFE_DAYS = 30;
  const MAX_HISTORY_ITEMS = 20;
  const RAPID_REPEAT_MS = 600000;
  const FULL_CONFIDENCE_STRENGTH = 6;
  const genericValues = new Set(['지역축제', '대전광역시', '공식 일정 확인 필요', '친구·연인·가족']);

  function clamp(value, min = 0, max = 100) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function normalizedTokens(values) {
    return new Set(
      values
        .filter(value => !genericValues.has(String(value || '').trim()))
        .flatMap(value => String(value || '').toLowerCase().split(/[^0-9a-z가-힣]+/u))
        .map(value => value.trim())
        .filter(value => value.length >= 2 && !['대전', '축제'].includes(value))
    );
  }

  function jaccard(left, right) {
    if (!left.size && !right.size) return 0.5;
    const intersection = [...left].filter(value => right.has(value)).length;
    const union = new Set([...left, ...right]).size;
    return union ? intersection / union : 0;
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
    if (!values.every(Number.isFinite)) return 0.5;
    const radians = value => value * Math.PI / 180;
    const [lat1, lng1, lat2, lng2] = values;
    const dLat = radians(lat2 - lat1);
    const dLng = radians(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2;
    const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(0, 1 - distance / 80);
  }

  function placeSimilarity(candidate, reference) {
    if (!candidate || !reference || candidate.id === reference.id) return 0;
    const candidateCategory = genericValues.has(String(candidate.category || '').trim()) ? '' : candidate.category;
    const referenceCategory = genericValues.has(String(reference.category || '').trim()) ? '' : reference.category;
    const categoryMatch = candidateCategory && referenceCategory && candidateCategory === referenceCategory ? 1 : 0;
    const tagSimilarity = jaccard(normalizedTokens(candidate.tags || []), normalizedTokens(reference.tags || []));
    const textSimilarity = jaccard(
      normalizedTokens([candidate.name, candidate.summary, candidate.audience, candidate.area]),
      normalizedTokens([reference.name, reference.summary, reference.audience, reference.area])
    );
    const tasteSimilarity = affinitySimilarity(candidate.affinities, reference.affinities);
    const nearbySimilarity = geographicSimilarity(candidate, reference);
    return Math.round(clamp((tasteSimilarity * 0.45 + categoryMatch * 0.15 + tagSimilarity * 0.15 + textSimilarity * 0.05 + nearbySimilarity * 0.2) * 100));
  }

  function normalizeHistory(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    return Object.fromEntries(Object.entries(raw)
      .filter(([id, entry]) => id && entry && typeof entry === 'object')
      .map(([id, entry]) => [id, {
        views: Math.max(0, Math.floor(Number(entry.views) || 0)),
        selections: Math.max(0, Math.floor(Number(entry.selections) || 0)),
        lastAt: Number(entry.lastAt) || 0,
        lastViewAt: Number(entry.lastViewAt) || 0,
        lastSelectionAt: Number(entry.lastSelectionAt) || 0
      }])
      .filter(([, entry]) => entry.views || entry.selections)
      .sort((left, right) => right[1].lastAt - left[1].lastAt)
      .slice(0, MAX_HISTORY_ITEMS));
  }

  function recordInteraction(rawHistory, placeId, kind, now = Date.now()) {
    const history = normalizeHistory(rawHistory);
    if (!placeId || !['view', 'select'].includes(kind)) return history;
    const previous = history[placeId] || { views: 0, selections: 0, lastAt: 0, lastViewAt: 0, lastSelectionAt: 0 };
    const timestampKey = kind === 'select' ? 'lastSelectionAt' : 'lastViewAt';
    if (now - previous[timestampKey] < RAPID_REPEAT_MS) return history;
    history[placeId] = {
      ...previous,
      views: previous.views + (kind === 'view' ? 1 : 0),
      selections: previous.selections + (kind === 'select' ? 1 : 0),
      lastAt: now,
      [timestampKey]: now
    };
    return normalizeHistory(history);
  }

  function interactionStrength(entry, now = Date.now()) {
    const countWeight = Math.min(12, entry.views * VIEW_WEIGHT + entry.selections * SELECT_WEIGHT);
    const elapsedDays = Math.max(0, now - entry.lastAt) / 86400000;
    return countWeight * Math.pow(0.5, elapsedDays / HALF_LIFE_DAYS);
  }

  function behaviorAffinity(candidate, catalog, rawHistory, now = Date.now()) {
    if (!candidate || candidate.type !== 'festival') return null;
    const history = normalizeHistory(rawHistory);
    const references = catalog
      .filter(place => place.type === 'festival' && place.id !== candidate.id && history[place.id])
      .map(place => {
        const strength = interactionStrength(history[place.id], now);
        const similarity = placeSimilarity(candidate, place);
        return { id: place.id, strength, similarity, weightedSimilarity: strength * similarity };
      })
      .filter(item => item.strength > 0)
      .sort((left, right) => right.strength - left.strength)
      .slice(0, 3);
    if (!references.length) return null;
    const totalStrength = references.reduce((sum, item) => sum + item.strength, 0);
    const score = Math.round(references.reduce((sum, item) => sum + item.weightedSimilarity, 0) / totalStrength);
    const strongest = [...references].sort((left, right) => right.weightedSimilarity - left.weightedSimilarity)[0];
    const confidence = Math.min(1, totalStrength / FULL_CONFIDENCE_STRENGTH);
    return { score: clamp(score), confidence, referenceId: strongest.id, referenceSimilarity: strongest.similarity };
  }

  function combineScore(baseScore, behavior) {
    if (!behavior || !Number.isFinite(Number(behavior.score))) return Math.round(clamp(baseScore));
    const confidence = Math.min(1, Math.max(0, Number(behavior.confidence ?? 1)));
    const behaviorWeight = 0.35 * confidence;
    return Math.round(clamp(Number(baseScore) * (1 - behaviorWeight) + Number(behavior.score) * behaviorWeight));
  }

  function hasHistory(rawHistory) {
    return Object.keys(normalizeHistory(rawHistory)).length > 0;
  }

  return {
    VIEW_WEIGHT,
    SELECT_WEIGHT,
    behaviorAffinity,
    combineScore,
    hasHistory,
    normalizeHistory,
    placeSimilarity,
    recordInteraction
  };
});
