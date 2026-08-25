const { cleanText } = require('./_lib');

const TRUSTED_SOURCE_DOMAINS = [
  'daejeon.go.kr',
  'daejeontour.co.kr',
  'visitkorea.or.kr',
  'knto.or.kr'
];

function hostnameFor(value) {
  try { return new URL(cleanText(value)).hostname.toLowerCase().replace(/^www\./, ''); } catch { return ''; }
}

function isHttpUrl(value) {
  try {
    const url = new URL(cleanText(value));
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch { return false; }
}

function allowedDomainsFor(place = {}) {
  const homepageHost = hostnameFor(place.homepage_url || place.homepageUrl);
  return [...new Set([...TRUSTED_SOURCE_DOMAINS, homepageHost].filter(Boolean))];
}

function isAllowedSource(url, allowedDomains) {
  const hostname = hostnameFor(url);
  return Boolean(hostname) && allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function imageResultsFromResponse(response = {}) {
  return (Array.isArray(response.output) ? response.output : [])
    .filter((item) => item?.type === 'web_search_call')
    .flatMap((item) => Array.isArray(item.results) ? item.results : [])
    .filter((item) => item?.type === 'image_result');
}

function sourceUrlsFromResponse(response = {}) {
  const urls = [];
  (Array.isArray(response.output) ? response.output : [])
    .filter((item) => item?.type === 'web_search_call')
    .forEach((item) => {
      (item?.action?.sources || []).forEach((source) => urls.push(source?.url));
      (item?.results || []).forEach((result) => urls.push(result?.source_website_url));
    });
  return [...new Set(urls.map(cleanText).filter(isHttpUrl))];
}

function pickOfficialImage(results, allowedDomains) {
  const match = results.find((result) => (
    isHttpUrl(result?.image_url)
    && isAllowedSource(result?.source_website_url, allowedDomains)
  ));
  if (!match) return null;
  return {
    imageUrl: cleanText(match.image_url),
    sourceUrl: cleanText(match.source_website_url),
    caption: cleanText(match.caption) || null
  };
}

function parseModelJson(value) {
  const text = cleanText(value).replace(/^```json\s*|```$/g, '').trim();
  try { return JSON.parse(text); } catch { return null; }
}

function cleanList(values, max, itemMapper = (item) => cleanText(item)) {
  if (!Array.isArray(values)) return [];
  return values.map(itemMapper).filter(Boolean).slice(0, max);
}

function normalizeEnrichment(value = {}) {
  return {
    summary: cleanText(value.summary) || null,
    tags: cleanList(value.tags, 4),
    highlights: cleanList(value.highlights, 3, (item) => {
      const title = cleanText(item?.title);
      const description = cleanText(item?.description);
      return title && description ? { title, description } : null;
    }),
    visitTip: cleanText(value.visit_tip) || null,
    audience: cleanText(value.recommended_for) || null,
    admission: cleanText(value.admission) || null,
    venue: cleanText(value.venue) || null,
    operatingHours: cleanText(value.operating_hours) || null
  };
}

function landmarkSearchPrompt(place = {}) {
  const name = cleanText(place.name);
  const address = cleanText(place.address);
  const homepage = cleanText(place.homepage_url || place.homepageUrl);
  const publicSummary = cleanText(place.description);
  return [
    `대전광역시 랜드마크 "${name}"의 방문 안내와 대표 사진을 찾으세요.`,
    '반드시 웹 검색 결과와 제공된 공식·관광 기관 도메인만 근거로 사용하세요.',
    '확인할 수 없는 사실은 추측하지 말고 null 또는 빈 배열로 두세요.',
    '문구는 한국어로, 사용자용으로 짧고 자연스럽게 작성하세요. 긴 원문을 복사하지 마세요.',
    'summary는 2문장 이내, highlights는 최대 3개, 각 설명은 45자 이내여야 합니다.',
    'JSON만 반환하세요. 키는 summary, tags, highlights, visit_tip, recommended_for, admission, venue, operating_hours 입니다.',
    `이름: ${name}`,
    address ? `주소: ${address}` : '',
    homepage ? `공식 홈페이지 후보: ${homepage}` : '',
    publicSummary ? `공공데이터 기본 소개: ${publicSummary}` : ''
  ].filter(Boolean).join('\n');
}

module.exports = {
  TRUSTED_SOURCE_DOMAINS,
  allowedDomainsFor,
  imageResultsFromResponse,
  isAllowedSource,
  landmarkSearchPrompt,
  normalizeEnrichment,
  parseModelJson,
  pickOfficialImage,
  sourceUrlsFromResponse
};
