const { cleanText } = require('./_lib');

const DEFAULT_FESTIVAL_SUMMARY = '대전과 근교에서 즐길 수 있는 지역 축제예요.';

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function richTextWithBreaks(value) {
  return decodeEntities(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|li|div|tr|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function cleanRichText(value) {
  return cleanText(richTextWithBreaks(value));
}

function truncate(value, maxLength) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).replace(/[\s,;:·ㆍ-]+$/g, '')}…`;
}

function purposeFromOverview(value) {
  const overview = cleanRichText(value);
  if (!overview) return null;
  const sentences = overview.match(/[^.!?。]+[.!?。]?/g) || [overview];
  return truncate(sentences[0], 110) || null;
}

function normalizeProgramTitle(value) {
  return truncate(cleanText(value)
    .replace(/^[-–—•·ㆍ▪◦*\d.)\s]+/, '')
    .replace(/^(?:메인|주요|핵심|상설|부대)?\s*프로그램\s*[:：-]?\s*/i, ''), 70);
}

function programsFromOfficialText(value) {
  const raw = richTextWithBreaks(value);
  if (!raw) return [];
  let parts = raw.split(/\n+|\s*[•▪◦]\s*|\s+[–—]\s+/).map(normalizeProgramTitle).filter(Boolean);
  if (parts.length < 2) {
    parts = raw.split(/\s*(?:·|ㆍ|;|,|\/)\s*/).map(normalizeProgramTitle).filter(Boolean);
  }
  return [...new Set(parts)]
    .filter((title) => title.length >= 2)
    .slice(0, 3)
    .map((title) => ({ title, description: null }));
}

function extractHomepage(value) {
  const raw = String(value || '');
  const href = raw.match(/href=["']([^"']+)["']/i)?.[1];
  const plain = cleanRichText(raw);
  const candidate = href || plain.match(/https?:\/\/[^\s<>"]+/i)?.[0] || '';
  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch { return null; }
}

function officialFestivalContent(common = {}, intro = {}) {
  const overview = cleanRichText(common.overview);
  const rawProgram = intro.program || intro.subevent;
  const programText = cleanRichText(rawProgram);
  return {
    summary: purposeFromOverview(overview),
    overview: overview || null,
    programs: programsFromOfficialText(rawProgram),
    programText: programText || null,
    venue: cleanRichText(intro.eventplace) || null,
    admission: cleanRichText(intro.usetimefestival) || null,
    operatingHours: cleanRichText(intro.playtime) || null,
    homepageUrl: extractHomepage(intro.eventhomepage || common.homepage),
    bookingPlace: cleanRichText(intro.bookingplace) || null,
    duration: cleanRichText(intro.spendtimefestival) || null
  };
}

function parseModelJson(value) {
  const raw = String(value || '').trim();
  const withoutFence = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const objectStart = withoutFence.indexOf('{');
  const objectEnd = withoutFence.lastIndexOf('}');
  const candidates = [
    withoutFence,
    objectStart >= 0 && objectEnd > objectStart ? withoutFence.slice(objectStart, objectEnd + 1) : ''
  ];
  for (const candidate of [...new Set(candidates)].filter(Boolean)) {
    try { return JSON.parse(candidate); } catch { /* try the extracted object */ }
  }
  return null;
}

function responseOutputText(response = {}) {
  if (cleanText(response.output_text)) return cleanText(response.output_text);
  return cleanText((Array.isArray(response.output) ? response.output : [])
    .flatMap((item) => Array.isArray(item?.content) ? item.content : [])
    .filter((item) => item?.type === 'output_text')
    .map((item) => item.text)
    .join('\n'));
}

function sourceUrlsFromResponse(response = {}) {
  const urls = [];
  (Array.isArray(response.output) ? response.output : [])
    .filter((item) => item?.type === 'web_search_call')
    .forEach((item) => {
      (item?.action?.sources || []).forEach((source) => urls.push(source?.url));
      (item?.results || []).forEach((result) => urls.push(result?.url || result?.source_website_url));
    });
  return [...new Set(urls.map(cleanText).filter((value) => {
    try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
  }))];
}

function normalizeOpenAiContent(value = {}) {
  const highlights = Array.isArray(value.highlights) ? value.highlights : [];
  return {
    summary: truncate(value.summary, 110) || null,
    tags: (Array.isArray(value.tags) ? value.tags : []).map(cleanText).filter(Boolean).slice(0, 4),
    programs: highlights.map((item) => ({
      title: truncate(item?.title, 70),
      description: truncate(item?.description, 100) || null
    })).filter((item) => item.title).slice(0, 3),
    audience: truncate(value.recommended_for, 80) || null
  };
}

function festivalSearchPrompt(place = {}, official = {}) {
  const missing = [!official.summary && '한 문장 목적 소개', !official.programs?.length && '핵심 프로그램 최대 3개'].filter(Boolean).join(', ');
  return [
    `한국 지역 축제 "${cleanText(place.name)}"의 공식 정보를 웹에서 확인해 부족한 항목을 보완하세요.`,
    '지자체·주최기관·한국관광공사 등 공식 출처를 우선하고, 블로그나 추측성 문구는 사용하지 마세요.',
    '웹에서 확인할 수 없는 구체적인 프로그램명은 만들어내지 말고 빈 배열로 두세요.',
    'summary는 축제의 목적과 무엇을 즐기는지 드러나는 자연스러운 한국어 한 문장, 90자 이내로 작성하세요.',
    'highlights는 확인된 핵심 프로그램만 최대 3개로 작성하고, 각 설명은 70자 이내로 작성하세요.',
    'JSON만 반환하세요. 키는 summary, tags, highlights, recommended_for 입니다.',
    `보완할 항목: ${missing || '없음'}`,
    `축제명: ${cleanText(place.name)}`,
    cleanText(place.address) ? `주소: ${cleanText(place.address)}` : '',
    [place.start_date, place.end_date].filter(Boolean).length ? `기간: ${[place.start_date, place.end_date].filter(Boolean).join(' ~ ')}` : '',
    official.overview ? `TourAPI 소개: ${official.overview}` : '',
    official.programText ? `TourAPI 프로그램: ${official.programText}` : ''
  ].filter(Boolean).join('\n');
}

function mergeFestivalContent(place = {}, official = {}, ai = {}, sourceUrls = []) {
  const officialPrograms = Array.isArray(official.programs) ? official.programs : [];
  const aiPrograms = Array.isArray(ai.programs) ? ai.programs : [];
  const savedDescription = cleanText(place.description);
  const summary = official.summary || ai.summary || (savedDescription !== DEFAULT_FESTIVAL_SUMMARY ? savedDescription : '') || null;
  const programs = officialPrograms.length ? officialPrograms : aiPrograms;
  return {
    summary,
    summary_source: official.summary ? 'tourapi' : ai.summary ? 'openai' : savedDescription ? 'database' : null,
    programs,
    programs_source: officialPrograms.length ? 'tourapi' : aiPrograms.length ? 'openai' : null,
    tags: ai.tags || [],
    audience: ai.audience || null,
    venue: official.venue || null,
    admission: official.admission || null,
    operating_hours: official.operatingHours || null,
    homepage_url: official.homepageUrl || null,
    official_overview: official.overview || null,
    official_program: official.programText || null,
    booking_place: official.bookingPlace || null,
    duration: official.duration || null,
    source_urls: [...new Set(sourceUrls.map(cleanText).filter(Boolean))]
  };
}

module.exports = {
  DEFAULT_FESTIVAL_SUMMARY,
  cleanRichText,
  festivalSearchPrompt,
  mergeFestivalContent,
  normalizeOpenAiContent,
  officialFestivalContent,
  parseModelJson,
  programsFromOfficialText,
  purposeFromOverview,
  responseOutputText,
  sourceUrlsFromResponse
};
