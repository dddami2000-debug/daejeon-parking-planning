const {
  asArray,
  cleanText,
  createSyncLog,
  fetchJson,
  fetchText,
  finishSyncLog,
  formatTime,
  isAuthorizedCron,
  isDaejeonCoordinate,
  methodNotAllowed,
  normalizeCoordinates,
  normalizedServiceKey,
  parseParkingXml,
  sendJson,
  supabaseUpsert,
  toInteger
} = require('./_lib');

const FESTIVAL_URL = 'https://apis.data.go.kr/6300000/openapi2022/festv/getfestv';
const TOURSPOT_URL = 'https://apis.data.go.kr/6300000/openapi2022/tourspot/gettourspot';
const PARKING_URL = 'https://apis.data.go.kr/6300000/pis/parkinglotIF';
const SHARE_NURI_LIST_URL = 'https://www.eshare.go.kr/eshare-openapi/rsrc/list';
const SHARE_NURI_DETAIL_URL = 'https://www.eshare.go.kr/eshare-openapi/rsrc/detail';

function getPageItems(body) {
  const items = body?.items?.item || body?.items || body?.data || [];
  return asArray(items);
}

function dataGovEnvelope(payload) {
  // Some data.go.kr services wrap the documented header/body inside `response`.
  return payload?.response || payload;
}

function getTotalCount(body, fallback) {
  return toInteger(body?.totalCount || body?.body?.totalCount) || fallback;
}

function isoDate(value) {
  const match = cleanText(value).match(/(20\d{2})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})/);
  if (!match) return null;
  return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
}

function festivalDates(period) {
  const matches = cleanText(period).match(/20\d{2}[.\-/년\s]+\d{1,2}[.\-/월\s]+\d{1,2}/g) || [];
  return { startDate: isoDate(matches[0]), endDate: isoDate(matches[1]) };
}

async function fetchPagedDataGov(url, key, source) {
  const requestPage = async (pageNo) => {
    const requestUrl = new URL(url);
    requestUrl.searchParams.set('serviceKey', normalizedServiceKey(key));
    requestUrl.searchParams.set('pageNo', String(pageNo));
    requestUrl.searchParams.set('numOfRows', '100');
    const payload = dataGovEnvelope(await fetchJson(requestUrl));
    const resultCode = cleanText(payload?.header?.resultCode);
    if (resultCode && resultCode !== '00') throw new Error(`upstream_result_${resultCode}`);
    return payload;
  };

  const first = await requestPage(1);
  const firstItems = getPageItems(first?.body || first);
  const total = getTotalCount(first, firstItems.length);
  const pages = Math.max(1, Math.ceil(total / 100));
  console.info(JSON.stringify({ event: 'datagov_page_summary', source, total, firstPageItems: firstItems.length, pages }));
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, index) => requestPage(index + 2)));
  return [first, ...rest].flatMap((payload) => getPageItems(payload?.body || payload));
}

async function fetchParkingRows() {
  const key = cleanText(process.env.DAEJEON_PARK_API_KEY);
  if (!key) throw new Error('parking_api_key_missing');
  const requestPage = async (pageNo) => {
    const requestUrl = new URL(PARKING_URL);
    requestUrl.searchParams.set('serviceKey', normalizedServiceKey(key));
    requestUrl.searchParams.set('pageNo', String(pageNo));
    requestUrl.searchParams.set('numOfRows', '50');
    return parseParkingXml(await fetchText(requestUrl));
  };

  const first = await requestPage(1);
  if (first.resultCode && first.resultCode !== '00') throw new Error(`upstream_result_${first.resultCode}`);
  const pages = Math.max(1, Math.ceil(first.totalCount / 50));
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, index) => requestPage(index + 2)));
  return [first, ...rest].flatMap((page) => page.items);
}

async function fetchShareNuriRows() {
  const key = cleanText(process.env.SHARENURI_API_KEY);
  if (!key) throw new Error('sharenuri_api_key_missing');
  const apiKey = normalizedServiceKey(key);
  const requestUrl = new URL(`${SHARE_NURI_LIST_URL}/010700/${encodeURIComponent(apiKey)}`);
  requestUrl.searchParams.set('pageNo', '1');
  requestUrl.searchParams.set('numOfRows', '1000');
  const listPayload = await fetchJson(requestUrl);
  const list = getPageItems(listPayload);
  const daejeon = list.filter((item) => cleanText(item.addr).includes('대전'));
  if (!daejeon.length) return [];

  try {
    const detailUrl = `${SHARE_NURI_DETAIL_URL}/${encodeURIComponent(apiKey)}`;
    const detailPayload = await fetchJson(detailUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rsrcNoList: daejeon.map((item) => item.rsrcNo).filter(Boolean).slice(0, 100) })
    });
    const detailById = new Map(getPageItems(detailPayload).map((item) => [cleanText(item.rsrcNo), item]));
    return daejeon.map((item) => ({ ...item, detail: detailById.get(cleanText(item.rsrcNo)) || {} }));
  } catch {
    return daejeon.map((item) => ({ ...item, detail: {} }));
  }
}

function mapFestival(item) {
  const period = cleanText(item.festvPrid);
  const { startDate, endDate } = festivalDates(period);
  const name = cleanText(item.festvNm);
  const address = [item.festvAddr, item.festvDtlAddr].map(cleanText).filter(Boolean).join(' ');
  const externalId = cleanText(item.refadNo) || `${name}|${address}`;
  return {
    source: 'daejeon_festival',
    external_id: externalId,
    category: 'festival',
    name,
    address: address || null,
    latitude: null,
    longitude: null,
    start_date: startDate,
    end_date: endDate,
    operating_hours: { raw: null },
    description: cleanText(item.festvSumm) || null,
    image_url: null,
    homepage_url: cleanText(item.hmpgAddr) || null,
    metadata: {
      period_raw: period || null,
      topic: cleanText(item.festvTpic) || null,
      place_name: cleanText(item.festvPlcNm) || null,
      host_name: cleanText(item.festvHostNm) || null,
      organizer_name: cleanText(item.svorgnNm) || null,
      zip: cleanText(item.festvZip) || null
    },
    synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function mapTourspot(item) {
  const name = cleanText(item.tourspotNm);
  const address = [item.tourspotAddr, item.tourspotDtlAddr].map(cleanText).filter(Boolean).join(' ');
  const coordinates = normalizeCoordinates(item.mapLat, item.mapLot);
  const externalId = cleanText(item.refadNo) || `${name}|${address}`;
  return {
    source: 'daejeon_tourspot',
    external_id: externalId,
    category: 'landmark',
    name,
    address: address || null,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    start_date: null,
    end_date: null,
    operating_hours: { raw: cleanText(item.mngTime) || null },
    description: cleanText(item.tourspotSumm) || null,
    image_url: null,
    homepage_url: cleanText(item.urlAddr) || null,
    metadata: {
      zip: cleanText(item.tourspotZip) || null,
      usage_fee: cleanText(item.tourUtlzAmt) || null,
      ancillary_facilities: cleanText(item.pkgFclt) || null,
      convenience_facilities: cleanText(item.cnvenFcltGuid) || null
    },
    synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function mapDaejeonParking(item) {
  const coordinates = normalizeCoordinates(item.lat, item.lon);
  const name = cleanText(item.name);
  const parkingType = name.includes('노상') ? 'roadside' : 'public';
  return {
    source: 'daejeon_parking',
    external_id: `${name}|${coordinates.latitude}|${coordinates.longitude}`,
    name,
    parking_type: parkingType,
    address: cleanText(item.address) || null,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    total_spaces: toInteger(item.totalQty),
    available_spaces: toInteger(item.resQty),
    availability_updated_at: new Date().toISOString(),
    operating_hours: {
      weekday: { open: formatTime(item.weekdayOpenTime, null), close: formatTime(item.weekdayCloseTime, null) },
      saturday: { open: formatTime(item.satOpenTime, null), close: formatTime(item.satCloseTime, null) },
      holiday: { open: formatTime(item.holidayOpenTime, null), close: formatTime(item.holidayCloseTime, null) },
      operating_days: cleanText(item.operDay) || null
    },
    fee_rules: {
      type: cleanText(item.type) || null,
      free: cleanText(item.type).includes('무료'),
      baseTime: toInteger(item.baseTime),
      baseRate: toInteger(item.baseRate),
      addTime: toInteger(item.addTime),
      addRate: toInteger(item.addRate),
      extraBaseTime: toInteger(item.extraBaseTime),
      extraAddTime: toInteger(item.extraAddTime),
      extraAddRate: toInteger(item.extraAddRate)
    },
    free_periods: [],
    restrictions: null,
    metadata: { telephone: cleanText(item.tel) || null },
    synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function mapShareNuriParking(item) {
  const detail = item.detail || {};
  const coordinates = normalizeCoordinates(detail.lat || item.lat || item.latl, detail.lot || item.lot || item.lon);
  const name = cleanText(detail.rsrcNm || item.rsrcNm);
  const address = [detail.addr || item.addr, detail.daddr || item.daddr].map(cleanText).filter(Boolean).join(' ');
  const isFree = cleanText(detail.freeYn) === 'Y';
  return {
    source: 'sharenuri',
    external_id: cleanText(detail.rsrcNo || item.rsrcNo) || `${name}|${address}`,
    name,
    parking_type: 'public_institution',
    address: address || null,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    total_spaces: null,
    available_spaces: null,
    availability_updated_at: null,
    operating_hours: { raw: cleanText(detail.gdsAtrbCn || detail.usePrpse) || null },
    fee_rules: { free: isFree, type: isFree ? '무료' : '요금 확인 필요' },
    free_periods: [],
    restrictions: cleanText(detail.atpn) || null,
    metadata: {
      use_possible: cleanText(detail.usePsblYn) || null,
      reservation_required: cleanText(detail.rsvtNdlsYn) || null,
      institution_name: cleanText(detail.rsrcInstNm) || null,
      reservation_url: cleanText(detail.instUrlAddr) || null,
      detail_url: cleanText(detail.dtlUrlAddr) || null,
      image_url: cleanText(detail.bnrImgFileUrlAddr || item.imgFileUrlAddr) || null
    },
    synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function syncOne(dataset) {
  const jobs = {
    festival: {
      source: 'daejeon_festival',
      run: () => fetchPagedDataGov(FESTIVAL_URL, process.env.FESTIVAL_API_KEY, 'festival').then((items) => items.map(mapFestival))
    },
    landmark: {
      source: 'daejeon_tourspot',
      run: () => fetchPagedDataGov(TOURSPOT_URL, process.env.TOUR_API_KEY, 'landmark').then((items) => items.map(mapTourspot))
    },
    parking: {
      source: 'daejeon_parking',
      run: () => fetchParkingRows().then((items) => items.map(mapDaejeonParking).filter((item) => isDaejeonCoordinate(item.latitude, item.longitude)))
    },
    sharenuri: {
      source: 'sharenuri',
      run: () => fetchShareNuriRows().then((items) => items.map(mapShareNuriParking).filter((item) => isDaejeonCoordinate(item.latitude, item.longitude)))
    }
  };
  const job = jobs[dataset];
  if (!job) throw new Error('unsupported_dataset');
  const log = await createSyncLog(dataset === 'landmark' ? 'landmark' : dataset === 'festival' ? 'festival' : 'parking', job.source);
  try {
    const records = await job.run();
    const table = dataset === 'festival' || dataset === 'landmark' ? 'places' : 'parking_lots';
    const written = await supabaseUpsert(table, records);
    await finishSyncLog(log, 'success', { recordsReceived: records.length, recordsUpserted: written.length });
    return { dataset, received: records.length, upserted: written.length };
  } catch (error) {
    await finishSyncLog(log, 'failed', { errorMessage: cleanText(error.message).slice(0, 500) });
    throw error;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
  if (!isAuthorizedCron(req)) return sendJson(res, 401, { error: 'unauthorized' });
  const requested = cleanText(req.query?.dataset || 'all');
  const datasets = requested === 'all' ? ['festival', 'landmark', 'parking', 'sharenuri'] : [requested];
  try {
    const results = [];
    for (const dataset of datasets) results.push(await syncOne(dataset));
    return sendJson(res, 200, { ok: true, results });
  } catch (error) {
    return sendJson(res, 502, { error: 'sync_failed', message: cleanText(error.message) });
  }
};
