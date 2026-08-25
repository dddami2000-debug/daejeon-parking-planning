const {
  cleanText,
  fetchJson,
  normalizedServiceKey,
  toNumber
} = require('./_lib');

const KMA_FORECAST_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const KMA_BASE_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function shiftedKstDate(date) {
  return new Date(date.getTime() + KST_OFFSET_MS);
}

function compactDateFromShifted(date) {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`;
}

function isoDateFromShifted(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function latestKmaBase(now = new Date()) {
  const shifted = shiftedKstDate(now);
  const publishedMinute = shifted.getUTCHours() * 60 + shifted.getUTCMinutes() - 15;
  const baseHour = [...KMA_BASE_HOURS].reverse().find((hour) => hour * 60 <= publishedMinute);
  if (baseHour !== undefined) {
    return {
      baseDate: compactDateFromShifted(shifted),
      baseTime: `${String(baseHour).padStart(2, '0')}00`
    };
  }
  shifted.setUTCDate(shifted.getUTCDate() - 1);
  return { baseDate: compactDateFromShifted(shifted), baseTime: '2300' };
}

// KMA DFS grid conversion constants published with the Village Forecast API.
function coordinatesToKmaGrid(latitude, longitude) {
  const earthRadiusKm = 6371.00877;
  const gridKm = 5;
  const firstStandardParallel = 30;
  const secondStandardParallel = 60;
  const originLongitude = 126;
  const originLatitude = 38;
  const originX = 43;
  const originY = 136;
  const degreesToRadians = Math.PI / 180;
  const radius = earthRadiusKm / gridKm;
  const parallel1 = firstStandardParallel * degreesToRadians;
  const parallel2 = secondStandardParallel * degreesToRadians;
  const originLng = originLongitude * degreesToRadians;
  const originLat = originLatitude * degreesToRadians;
  let sn = Math.tan(Math.PI * 0.25 + parallel2 * 0.5) / Math.tan(Math.PI * 0.25 + parallel1 * 0.5);
  sn = Math.log(Math.cos(parallel1) / Math.cos(parallel2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + parallel1 * 0.5);
  sf = (sf ** sn) * Math.cos(parallel1) / sn;
  let ro = Math.tan(Math.PI * 0.25 + originLat * 0.5);
  ro = radius * sf / (ro ** sn);
  let ra = Math.tan(Math.PI * 0.25 + latitude * degreesToRadians * 0.5);
  ra = radius * sf / (ra ** sn);
  let theta = longitude * degreesToRadians - originLng;
  if (theta > Math.PI) theta -= 2 * Math.PI;
  if (theta < -Math.PI) theta += 2 * Math.PI;
  theta *= sn;
  return {
    nx: Math.floor(ra * Math.sin(theta) + originX + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + originY + 0.5)
  };
}

function summerApparentTemperature(temperature, humidity) {
  const wetBulb = temperature * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659))
    + Math.atan(temperature + humidity)
    - Math.atan(humidity - 1.67633)
    + 0.00391838 * (humidity ** 1.5) * Math.atan(0.023101 * humidity)
    - 4.686035;
  return -0.2442 + 0.55399 * wetBulb + 0.45535 * temperature
    - 0.0022 * (wetBulb ** 2) + 0.00278 * wetBulb * temperature + 3;
}

function winterApparentTemperature(temperature, windSpeedMs) {
  const windSpeedKmh = windSpeedMs * 3.6;
  return 13.12 + 0.6215 * temperature - 11.37 * (windSpeedKmh ** 0.16)
    + 0.3965 * (windSpeedKmh ** 0.16) * temperature;
}

function calculateApparentTemperature(temperature, humidity, windSpeedMs = null) {
  const temp = toNumber(temperature);
  const relativeHumidity = toNumber(humidity);
  const wind = toNumber(windSpeedMs);
  if (temp === null) return null;
  if (temp >= 20 && relativeHumidity !== null) {
    return round(summerApparentTemperature(temp, clamp(relativeHumidity, 0, 100)));
  }
  if (temp <= 10 && wind !== null && wind * 3.6 >= 4.8) {
    return round(winterApparentTemperature(temp, wind));
  }
  return round(temp);
}

function visitDateTime(visitDate, visitTime) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanText(visitDate))) return null;
  if (!/^\d{1,2}:\d{2}$/.test(cleanText(visitTime))) return null;
  const normalizedTime = cleanText(visitTime).padStart(5, '0');
  const value = new Date(`${visitDate}T${normalizedTime}:00+09:00`);
  return Number.isNaN(value.getTime()) ? null : value;
}

function targetVisitTimes(visitDate, startTime, endTime) {
  const start = visitDateTime(visitDate, startTime);
  const end = visitDateTime(visitDate, endTime);
  return [start, end].filter(Boolean);
}

function selectHighestApparent(samples) {
  const usable = samples.filter((sample) => Number.isFinite(sample?.apparentTemperature));
  if (!usable.length) return null;
  return usable.sort((a, b) => b.apparentTemperature - a.apparentTemperature)[0];
}

function parseKmaSamples(items, targets) {
  const grouped = new Map();
  (Array.isArray(items) ? items : []).forEach((item) => {
    const date = cleanText(item.fcstDate);
    const time = cleanText(item.fcstTime).padStart(4, '0');
    const category = cleanText(item.category);
    if (!date || !time || !['TMP', 'REH', 'WSD'].includes(category)) return;
    const key = `${date}${time}`;
    const current = grouped.get(key) || { date, time };
    current[category] = toNumber(item.fcstValue);
    grouped.set(key, current);
  });
  const records = [...grouped.values()].map((record) => ({
    ...record,
    timestamp: new Date(`${record.date.slice(0, 4)}-${record.date.slice(4, 6)}-${record.date.slice(6, 8)}T${record.time.slice(0, 2)}:${record.time.slice(2, 4)}:00+09:00`)
  }));
  return targets.map((target) => {
    const nearest = records
      .filter((record) => record.TMP !== null && record.REH !== null && !Number.isNaN(record.timestamp.getTime()))
      .map((record) => ({ record, difference: Math.abs(record.timestamp.getTime() - target.getTime()) }))
      .filter(({ difference }) => difference <= 90 * 60 * 1000)
      .sort((a, b) => a.difference - b.difference)[0]?.record;
    if (!nearest) return null;
    return {
      apparentTemperature: calculateApparentTemperature(nearest.TMP, nearest.REH, nearest.WSD),
      forecastAt: nearest.timestamp.toISOString(),
      temperature: nearest.TMP,
      humidity: nearest.REH,
      windSpeed: nearest.WSD
    };
  }).filter(Boolean);
}

function parseOpenMeteoSamples(payload, targets) {
  const times = Array.isArray(payload?.hourly?.time) ? payload.hourly.time : [];
  const temperatures = Array.isArray(payload?.hourly?.apparent_temperature)
    ? payload.hourly.apparent_temperature
    : [];
  const records = times.map((time, index) => ({
    timestamp: new Date(`${time}:00+09:00`),
    apparentTemperature: toNumber(temperatures[index])
  }));
  return targets.map((target) => {
    const nearest = records
      .filter((record) => record.apparentTemperature !== null && !Number.isNaN(record.timestamp.getTime()))
      .map((record) => ({ record, difference: Math.abs(record.timestamp.getTime() - target.getTime()) }))
      .filter(({ difference }) => difference <= 90 * 60 * 1000)
      .sort((a, b) => a.difference - b.difference)[0]?.record;
    if (!nearest) return null;
    return {
      apparentTemperature: round(nearest.apparentTemperature),
      forecastAt: nearest.timestamp.toISOString()
    };
  }).filter(Boolean);
}

async function fetchWithTimeout(fetcher, url, timeoutMs = 2500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetcher(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchKmaWeather(params, dependencies = {}) {
  const apiKey = normalizedServiceKey(params.apiKey);
  if (!apiKey) throw new Error('kma_weather_key_missing');
  const targets = targetVisitTimes(params.visitDate, params.startTime, params.endTime);
  if (!targets.length) throw new Error('invalid_visit_time');
  const base = latestKmaBase(dependencies.now || new Date());
  const grid = coordinatesToKmaGrid(params.lat, params.lng);
  const url = new URL(KMA_FORECAST_URL);
  url.searchParams.set('serviceKey', apiKey);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '1000');
  url.searchParams.set('dataType', 'JSON');
  url.searchParams.set('base_date', base.baseDate);
  url.searchParams.set('base_time', base.baseTime);
  url.searchParams.set('nx', String(grid.nx));
  url.searchParams.set('ny', String(grid.ny));
  const payload = await fetchWithTimeout(dependencies.fetchJson || fetchJson, url, dependencies.timeoutMs);
  const response = payload?.response;
  if (cleanText(response?.header?.resultCode) !== '00') throw new Error('kma_weather_unavailable');
  const samples = parseKmaSamples(response?.body?.items?.item, targets);
  const selected = selectHighestApparent(samples);
  if (!selected) throw new Error('kma_forecast_time_unavailable');
  return selected;
}

async function fetchOpenMeteoWeather(params, dependencies = {}) {
  const targets = targetVisitTimes(params.visitDate, params.startTime, params.endTime);
  if (!targets.length) throw new Error('invalid_visit_time');
  const url = new URL(OPEN_METEO_FORECAST_URL);
  url.searchParams.set('latitude', String(params.lat));
  url.searchParams.set('longitude', String(params.lng));
  url.searchParams.set('hourly', 'apparent_temperature');
  url.searchParams.set('timezone', 'Asia/Seoul');
  url.searchParams.set('start_date', params.visitDate);
  url.searchParams.set('end_date', params.visitDate);
  const payload = await fetchWithTimeout(dependencies.fetchJson || fetchJson, url, dependencies.timeoutMs);
  const selected = selectHighestApparent(parseOpenMeteoSamples(payload, targets));
  if (!selected) throw new Error('open_meteo_forecast_time_unavailable');
  return selected;
}

function daysFromToday(visitDate, now = new Date()) {
  const shifted = shiftedKstDate(now);
  const today = new Date(`${isoDateFromShifted(shifted)}T00:00:00+09:00`);
  const visit = new Date(`${visitDate}T00:00:00+09:00`);
  if (Number.isNaN(visit.getTime())) return null;
  return Math.round((visit.getTime() - today.getTime()) / 86400000);
}

function weatherResult(sample, source, sourceLabel, fallbackUsed = false) {
  return {
    available: true,
    source,
    sourceLabel,
    apparentTemperature: sample.apparentTemperature,
    forecastAt: sample.forecastAt,
    fallbackUsed
  };
}

async function getWeatherContext(params, dependencies = {}) {
  const now = dependencies.now || new Date();
  const dayOffset = daysFromToday(params.visitDate, now);
  if (dayOffset === null || dayOffset < 0 || dayOffset > 16) {
    return {
      available: false,
      source: null,
      sourceLabel: null,
      apparentTemperature: null,
      forecastAt: null,
      fallbackUsed: false,
      reason: 'forecast_out_of_range'
    };
  }

  const kmaKey = cleanText(params.kmaApiKey);
  if (kmaKey && dayOffset <= 4) {
    try {
      const sample = await fetchKmaWeather({ ...params, apiKey: kmaKey }, { ...dependencies, now });
      return weatherResult(sample, 'kma', '기상청 단기예보');
    } catch (error) {
      console.warn(JSON.stringify({ event: 'kma_weather_fallback', reason: cleanText(error.message) }));
    }
  }

  try {
    const sample = await fetchOpenMeteoWeather(params, dependencies);
    return weatherResult(sample, 'open_meteo', 'Open-Meteo', Boolean(kmaKey));
  } catch (error) {
    console.warn(JSON.stringify({ event: 'weather_unavailable', reason: cleanText(error.message) }));
    return {
      available: false,
      source: null,
      sourceLabel: null,
      apparentTemperature: null,
      forecastAt: null,
      fallbackUsed: Boolean(kmaKey),
      reason: 'weather_unavailable'
    };
  }
}

module.exports = {
  calculateApparentTemperature,
  coordinatesToKmaGrid,
  daysFromToday,
  fetchKmaWeather,
  fetchOpenMeteoWeather,
  getWeatherContext,
  latestKmaBase,
  parseKmaSamples,
  parseOpenMeteoSamples
};
