const {
  cleanText,
  estimateParkingCost,
  haversineKm,
  methodNotAllowed,
  parkingTypeLabel,
  sendJson,
  supabaseRequest,
  toInteger,
  toNumber
} = require('./_lib');
const {
  recommendationReason,
  scoreParkingCandidate
} = require('./_parking-ranking');
const { getWeatherContext } = require('./_weather');

function numberQuery(value) {
  const number = toNumber(value);
  return number !== null && Number.isFinite(number) ? number : null;
}

function selectedSchedule(hours, visitDate) {
  const day = new Date(`${visitDate || '2026-01-01'}T12:00:00+09:00`).getUTCDay();
  const key = day === 6 ? 'saturday' : day === 0 ? 'holiday' : 'weekday';
  return hours?.[key] || hours?.weekday || {};
}

function mapParking(row, origin, visitDate, startTime, endTime, weather) {
  const latitude = toNumber(row.latitude);
  const longitude = toNumber(row.longitude);
  const fee = row.fee_rules || {};
  const hours = row.operating_hours || {};
  const schedule = selectedSchedule(hours, visitDate);
  const distance = haversineKm(origin.lat, origin.lng, latitude, longitude);
  const estimatedCost = estimateParkingCost(row, visitDate, startTime, endTime);
  const unknownFee = estimatedCost === null;
  const walk = Math.max(1, Math.round(distance * 13));
  const ranking = scoreParkingCandidate({ walk, estimatedCost }, weather);
  const reason = recommendationReason({ walk, estimatedCost, distance }, weather);
  return {
    id: cleanText(row.id),
    name: cleanText(row.name),
    source: cleanText(row.source),
    type: parkingTypeLabel(row.parking_type),
    address: cleanText(row.address),
    lat: latitude,
    lng: longitude,
    distance: Number(distance.toFixed(2)),
    drive: Math.max(2, Math.round(distance * 5)),
    walk,
    open: cleanText(schedule.open) || '운영시간 확인',
    close: cleanText(schedule.close) || '',
    operatingHours: hours,
    base: toInteger(fee.baseRate) || 0,
    baseMin: toInteger(fee.baseTime) || 0,
    add: toInteger(fee.addRate) || 0,
    addMin: toInteger(fee.addTime) || 0,
    free: fee.free === true || cleanText(fee.type).includes('무료'),
    unknownFee,
    estimatedCost,
    restrictions: cleanText(row.restrictions) || null,
    reservationUrl: cleanText(row.metadata?.reservation_url) || null,
    capacity: toInteger(row.total_spaces),
    availabilityKnown: toInteger(row.available_spaces) !== null,
    availabilityUpdatedAt: row.availability_updated_at || null,
    updatedAt: row.updated_at || null,
    feeVerified: !unknownFee,
    scheduleVerified: Boolean(cleanText(schedule.open) && cleanText(schedule.close)),
    reason,
    recommendationScore: ranking.score,
    scoreBreakdown: ranking.breakdown
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const lat = numberQuery(req.query?.lat);
  const lng = numberQuery(req.query?.lng);
  if (lat === null || lng === null || lat < 35.9 || lat > 36.8 || lng < 127 || lng > 127.7) {
    return sendJson(res, 400, { error: 'valid_daejeon_coordinates_required' });
  }
  const radiusKm = Math.min(Math.max(numberQuery(req.query?.radius) || 3, 0.2), 10);
  const visitDate = cleanText(req.query?.date) || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
  const startTime = cleanText(req.query?.startTime) || '18:00';
  const endTime = cleanText(req.query?.endTime) || '22:00';

  try {
    const origin = { lat, lng };
    const [rows, weather] = await Promise.all([
      supabaseRequest('parking_lots?select=id,source,name,parking_type,address,latitude,longitude,total_spaces,available_spaces,availability_updated_at,operating_hours,fee_rules,restrictions,metadata,updated_at'),
      getWeatherContext({
        lat,
        lng,
        visitDate,
        startTime,
        endTime,
        kmaApiKey: process.env.KMA_WEATHER_API_KEY
      })
    ]);
    const parkingLots = (Array.isArray(rows) ? rows : [])
      .filter((row) => toNumber(row.latitude) !== null && toNumber(row.longitude) !== null)
      .map((row) => mapParking(row, origin, visitDate, startTime, endTime, weather))
      .filter((parking) => parking.distance <= radiusKm)
      .sort((a, b) => a.recommendationScore - b.recommendationScore || a.distance - b.distance)
      .slice(0, 30);
    const weatherAttribution = weather.available ? ` · ${weather.sourceLabel}` : '';
    return sendJson(res, 200, {
      parkingLots,
      weather,
      sourceAttribution: `출처: 대전광역시 주차장 정보 · 공유누리${weatherAttribution}`,
      generatedAt: new Date().toISOString()
    }, 'public, s-maxage=60, stale-while-revalidate=120');
  } catch (error) {
    return sendJson(res, 503, { error: 'parking_unavailable', message: cleanText(error.message) });
  }
};
