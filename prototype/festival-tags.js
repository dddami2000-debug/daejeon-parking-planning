(function attachFestivalTags(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.FestivalTags = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFestivalTags() {
  const MAX_TAGS = 3;
  // Single Hangul syllables (e.g. '술' inside '기술', '게' inside '짧게') collide with
  // unrelated words far too often to trust as tag evidence, even though the looser
  // search/filter matching in festival-recommender.js can afford that noise.
  const MIN_ALIAS_LENGTH = 2;

  const topicLabels = {
    alcohol: '술',
    local_produce: '농산물',
    food: '먹거리',
    seafood: '수산물',
    science: '과학',
    performance: '공연',
    night: '야간',
    family: '가족',
    nature: '자연',
    culture: '문화',
    wellness: '힐링',
    sports: '스포츠',
    pet: '반려동물',
    eco: '친환경'
  };

  function tokenize(text) {
    return String(text || '').toLowerCase().split(/[^0-9a-z가-힣]+/u).filter(Boolean);
  }

  function programText(programs) {
    if (!Array.isArray(programs)) return '';
    return programs
      .map(item => [item?.title, item?.description].filter(Boolean).join(' '))
      .join(' ');
  }

  function evidenceTokens({name, summary, description, category, existingTags, programs} = {}) {
    const text = [name, summary, description, category, ...(Array.isArray(existingTags) ? existingTags : []), programText(programs)]
      .filter(Boolean)
      .join(' ');
    return tokenize(text);
  }

  function matchedTopicTags(tokens, topicGroups) {
    if (!tokens.length || !topicGroups || typeof topicGroups !== 'object') return [];
    return Object.entries(topicGroups)
      .filter(([, aliases]) => Array.isArray(aliases) && aliases
        .filter(alias => String(alias).length >= MIN_ALIAS_LENGTH)
        .some(alias => {
          const needle = String(alias).toLowerCase();
          return tokens.some(token => token.startsWith(needle));
        }))
      .map(([topic]) => topicLabels[topic])
      .filter(Boolean);
  }

  // Pure: only derives tags the source text actually supports, so a festival with
  // thin data yields fewer tags (or none) instead of a padded generic label.
  function deriveFestivalTags({name, summary, description, category, existingTags, programs, topicGroups, maxTags = MAX_TAGS} = {}) {
    const tokens = evidenceTokens({name, summary, description, category, existingTags, programs});
    return matchedTopicTags(tokens, topicGroups).slice(0, Math.max(0, maxTags));
  }

  return {deriveFestivalTags, topicLabels};
});
