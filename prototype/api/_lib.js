const DAEJEON_BOUNDS = { minLat: 35.9, maxLat: 36.8, minLng: 127.0, maxLng: 127.7 };

function sendJson(res, status, body, cacheControl = 'no-store') {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cacheControl);
  res.status(status).json(body);
}

function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed);
  return sendJson(res, 405, { error: 'method_not_allowed' });
}

function cleanText(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).replace(/[,원분]/g, '').trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function toInteger(value) {
  const parsed = toNumber(value);
  return parsed === null ? null : Math.round(parsed);
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function isDaejeonCoordinate(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= DAEJEON_BOUNDS.minLat && lat <= DAEJEON_BOUNDS.maxLat
    && lng >= DAEJEON_BOUNDS.minLng && lng <= DAEJEON_BOUNDS.maxLng;
}

function normalizeCoordinates(first, second) {
  const a = toNumber(first);
  const b = toNumber(second);
  if (a === null || b === null) return { latitude: null, longitude: null };
  if (isDaejeonCoordinate(a, b)) return { latitude: a, longitude: b };
  if (isDaejeonCoordinate(b, a)) return { latitude: b, longitude: a };
  return { latitude: null, longitude: null };
}

function decodeXml(value) {
  return cleanText(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function xmlTag(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function parseParkingXml(xml) {
  const items = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemPattern.exec(xml))) {
    const itemXml = match[1];
    const item = {};
    [
      'name', 'lat', 'lon', 'address', 'tel', 'totalQty', 'resQty', 'type',
      'baseTime', 'baseRate', 'addTime', 'addRate', 'extraBaseTime',
      'extraAddTime', 'extraAddRate', 'weekdayOpenTime', 'weekdayCloseTime',
      'satOpenTime', 'satCloseTime', 'holidayOpenTime', 'holidayCloseTime', 'operDay'
    ].forEach((tag) => { item[tag] = xmlTag(itemXml, tag); });
    items.push(item);
  }
  return {
    resultCode: xmlTag(xml, 'resultCode'),
    resultMsg: xmlTag(xml, 'resultMsg'),
    totalCount: toInteger(xmlTag(xml, 'totalCount')) || 0,
    items
  };
}

function normalizedServiceKey(value) {
  const raw = cleanText(value);
  if (!raw) return '';
  try { return decodeURIComponent(raw); } catch { return raw; }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', ...(options.headers || {}) }
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`upstream_http_${response.status}`);
  try { return JSON.parse(text); } catch { throw new Error('upstream_invalid_json'); }
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  if (!response.ok) throw new Error(`upstream_http_${response.status}`);
  return text;
}

function supabaseConfig() {
  const url = cleanText(process.env.SUPABASE_URL).replace(/\/$/, '');
  const key = cleanText(process.env.SUPABASE_SECRET_KEY);
  if (!url || !key) throw new Error('supabase_environment_missing');
  return { url, key };
}

async function supabaseRequest(path, options = {}) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`supabase_http_${response.status}`);
  }
  return text ? JSON.parse(text) : null;
}

async function supabaseUpsert(table, records) {
  if (!records.length) return [];
  const chunks = [];
  for (let index = 0; index < records.length; index += 100) chunks.push(records.slice(index, index + 100));
  const written = [];
  for (const chunk of chunks) {
    const result = await supabaseRequest(`${table}?on_conflict=source,external_id`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(chunk)
    });
    written.push(...asArray(result));
  }
  return written;
}

async function createSyncLog(dataset, source) {
  const result = await supabaseRequest('data_sync_logs', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ dataset, source, status: 'running' })
  });
  return asArray(result)[0] || null;
}

async function finishSyncLog(log, status, details) {
  if (!log?.id) return;
  await supabaseRequest(`data_sync_logs?id=eq.${encodeURIComponent(log.id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      status,
      completed_at: new Date().toISOString(),
      records_received: details.recordsReceived || 0,
      records_upserted: details.recordsUpserted || 0,
      error_message: details.errorMessage || null,
      details: details.metadata || {}
    })
  });
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const radians = (value) => value * Math.PI / 180;
  const earthRadiusKm = 6371;
  const dLat = radians(lat2 - lat1);
  const dLng = radians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function minutesFromTime(value) {
  const normalized = cleanText(value).replace(/^(\d{1,2})(\d{2})$/, '$1:$2');
  const match = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 ? hours * 60 + minutes : null;
}

function formatTime(value, fallback) {
  const minutes = minutesFromTime(value);
  if (minutes === null) return fallback;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function scheduleForDate(hours, date) {
  // Vercel Functions run in UTC. The requested visit date is Korean local time.
  const weekday = new Date(`${date || '2026-01-01'}T12:00:00+09:00`).getUTCDay();
  const key = weekday === 6 ? 'saturday' : weekday === 0 ? 'holiday' : 'weekday';
  return hours?.[key] || hours?.weekday || {};
}

function estimateParkingCost(parking, date, startTime, endTime) {
  const fee = parking.fee_rules || {};
  if (fee.free === true || cleanText(fee.type).includes('무료')) return 0;
  const fixedAmount = toInteger(fee.fixedAmount);
  const baseRate = toInteger(fee.baseRate);
  if (!baseRate && fixedAmount) return fixedAmount;
  if (!baseRate) return null;
  const start = minutesFromTime(startTime);
  const end = minutesFromTime(endTime);
  if (start === null || end === null || end <= start) return 0;
  const schedule = scheduleForDate(parking.operating_hours, date);
  const open = minutesFromTime(schedule.open);
  const close = minutesFromTime(schedule.close);
  if (open === null || close === null) return null;
  const paidMinutes = Math.max(0, Math.min(end, close) - Math.max(start, open));
  if (!paidMinutes) return 0;
  const baseMinutes = toInteger(fee.baseTime) || 0;
  const addMinutes = toInteger(fee.addTime);
  const addRate = toInteger(fee.addRate) || 0;
  if (paidMinutes <= baseMinutes || !addMinutes) return baseRate;
  return baseRate + Math.ceil((paidMinutes - baseMinutes) / addMinutes) * addRate;
}

function parkingTypeLabel(type) {
  return { public: '공영', roadside: '노상', public_institution: '공공기관' }[type] || '주차장';
}

function isAuthorizedCron(req) {
  const secret = cleanText(process.env.CRON_SECRET);
  if (!secret) return false;
  const authorization = cleanText(req.headers.authorization);
  return authorization === `Bearer ${secret}` || cleanText(req.query?.secret) === secret;
}

module.exports = {
  asArray,
  cleanText,
  createSyncLog,
  estimateParkingCost,
  fetchJson,
  fetchText,
  finishSyncLog,
  formatTime,
  haversineKm,
  isAuthorizedCron,
  isDaejeonCoordinate,
  methodNotAllowed,
  normalizeCoordinates,
  normalizedServiceKey,
  parkingTypeLabel,
  parseParkingXml,
  sendJson,
  supabaseRequest,
  supabaseUpsert,
  toInteger,
  toNumber
};
