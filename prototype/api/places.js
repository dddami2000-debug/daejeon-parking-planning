const {
  cleanText,
  methodNotAllowed,
  sendJson,
  supabaseRequest,
  toNumber
} = require('./_lib');

const ALLOWED_CATEGORIES = new Set(['festival', 'landmark']);

function asIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(cleanText(value)) ? cleanText(value) : null;
}

function dateLabel(place) {
  if (place.category !== 'festival') return '오늘 추천';
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
  const end = asIsoDate(place.end_date);
  if (!end) return '축제';
  const remaining = Math.ceil((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
  if (remaining < 0) return '지난 축제';
  return remaining === 0 ? 'D-DAY' : `D-${remaining}`;
}

function periodLabel(place) {
  const raw = cleanText(place.metadata?.period_raw);
  if (raw) return raw;
  if (place.start_date && place.end_date) return `${place.start_date.slice(5).replace('-', '.')} — ${place.end_date.slice(5).replace('-', '.')}`;
  return cleanText(place.operating_hours?.raw) || '운영 정보 확인';
}

function mapPlace(place) {
  return {
    id: cleanText(place.id),
    source: cleanText(place.source),
    type: place.category,
    name: cleanText(place.name),
    address: cleanText(place.address),
    lat: toNumber(place.latitude),
    lng: toNumber(place.longitude),
    startDate: asIsoDate(place.start_date),
    endDate: asIsoDate(place.end_date),
    date: dateLabel(place),
    period: periodLabel(place),
    hours: cleanText(place.operating_hours?.raw) || (place.category === 'festival' ? '행사 시간 확인' : '운영 시간 확인'),
    summary: cleanText(place.description) || '대전에서 즐길 수 있는 추천 장소예요.',
    imageUrl: cleanText(place.image_url) || cleanText(place.metadata?.image_url) || null,
    homepageUrl: cleanText(place.homepage_url) || null,
    metadata: place.metadata || {},
    updatedAt: place.updated_at || null
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const category = cleanText(req.query?.category);
  if (category && !ALLOWED_CATEGORIES.has(category)) return sendJson(res, 400, { error: 'invalid_category' });

  try {
    const sourceFilter = category === 'landmark'
      ? '&source=eq.daejeon_tourspot'
      : '&source=in.(kto_festival,daejeon_festival,daejeon_tourspot)';
    const categoryFilter = category ? `&category=eq.${category}` : '';
    const rows = await supabaseRequest(`places?select=id,source,category,name,address,latitude,longitude,start_date,end_date,operating_hours,description,homepage_url,image_url,metadata,updated_at&order=updated_at.desc${sourceFilter}${categoryFilter}`);
    const mapped = (Array.isArray(rows) ? rows : []).map(mapPlace);
    const hasCurrentFestivalSource = mapped.some((place) => place.source === 'kto_festival');
    const places = hasCurrentFestivalSource
      ? mapped.filter((place) => place.type !== 'festival' || place.source === 'kto_festival')
      : mapped;
    return sendJson(res, 200, {
      places,
      sourceAttribution: '출처: 한국관광공사 TourAPI · 대전광역시 문화관광(관광지)',
      generatedAt: new Date().toISOString()
    }, 'public, s-maxage=300, stale-while-revalidate=600');
  } catch (error) {
    return sendJson(res, 503, { error: 'places_unavailable', message: cleanText(error.message) });
  }
};
