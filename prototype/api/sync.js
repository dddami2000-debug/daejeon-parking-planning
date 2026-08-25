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
  normalizeKoreaCoordinates,
  normalizedServiceKey,
  parseParkingXml,
  sendJson,
  supabaseRequest,
  supabaseUpsert,
  toInteger
} = require('./_lib');

const FESTIVAL_URL = 'https://apis.data.go.kr/B551011/KorService2/searchFestival2';
const PARKING_URL = 'https://apis.data.go.kr/6300000/pis/parkinglotIF';
const SHARE_NURI_LIST_URL = 'https://www.eshare.go.kr/eshare-openapi/rsrc/list';
const SHARE_NURI_DETAIL_URL = 'https://www.eshare.go.kr/eshare-openapi/rsrc/detail';
const NAVER_GEOCODE_URL = 'https://maps.apigw.ntruss.com/map-geocode/v2/geocode';
const FESTIVAL_SOURCE = 'kto_festival';

function getPageItems(body) {
  const items = body?.items?.item || body?.items || body?.data || [];
  return asArray(items);
}

function dataGovEnvelope(payload) {
  // Some data.go.kr services wrap the documented header/body inside `response`.
  return payload?.response || payload;
}

function getTotalCount(body, fallback) {
  return toInteger(
    body?.totalCount
    || body?.totalCnt
    || body?.pageInfo?.totalCount
    || body?.body?.totalCount
  ) || fallback;
}

function isoDate(value) {
  const match = cleanText(value).match(/(20\d{2})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})/);
  if (!match) return null;
  return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
}

function isCurrentOrUpcomingFestival(record) {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
  const lastDate = record.end_date || record.start_date;
  return Boolean(lastDate && lastDate >= today);
}

function compactKstDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date).reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  return `${parts.year}${parts.month}${parts.day}`;
}

async function fetchKtoFestivals() {
  const key = cleanText(process.env.FESTIVAL_API_KEY);
  if (!key) throw new Error('festival_api_key_missing');

  const today = compactKstDate();
  const currentYear = Number(today.slice(0, 4));
  const requestPage = async (pageNo) => {
    const requestUrl = new URL(FESTIVAL_URL);
    requestUrl.searchParams.set('serviceKey', normalizedServiceKey(key));
    requestUrl.searchParams.set('pageNo', String(pageNo));
    requestUrl.searchParams.set('numOfRows', '100');
    requestUrl.searchParams.set('MobileOS', 'WEB');
    requestUrl.searchParams.set('MobileApp', 'daejeongalkka');
    requestUrl.searchParams.set('_type', 'json');
    requestUrl.searchParams.set('arrange', 'C');
    // 행사 시작일은 필수다. 올해 초부터 내년 말까지 가져온 뒤 종료일 기준으로
    // 이미 끝난 행사는 제외해, 진행 중인 축제도 함께 노출한다.
    requestUrl.searchParams.set('eventStartDate', `${currentYear}0101`);
    requestUrl.searchParams.set('eventEndDate', `${currentYear + 1}1231`);
    // TourAPI v4.4에서는 기존 areaCode 대신 법정동 시도 코드로 지역을 좁힌다.
    requestUrl.searchParams.set('lDongRegnCd', '30');
    const payload = dataGovEnvelope(await fetchJson(requestUrl));
    const resultCode = cleanText(payload?.header?.resultCode);
    if (resultCode !== '0000') {
      const message = cleanText(payload?.header?.resultMsg).replace(/[^\w가-힣 -]/g, '').slice(0, 120);
      throw new Error(`upstream_result_${resultCode || 'unknown'}${message ? `_${message}` : ''}`);
    }
    return payload;
  };

  const first = await requestPage(1);
  const firstItems = getPageItems(first?.body || first);
  const total = getTotalCount(first?.body || first, firstItems.length);
  const pages = Math.max(1, Math.ceil(total / 100));
  console.info(JSON.stringify({ event: 'kto_festival_page_summary', total, firstPageItems: firstItems.length, pages }));
  const rest = [];
  for (let pageNo = 2; pageNo <= pages; pageNo += 3) {
    const batch = Array.from({ length: Math.min(3, pages - pageNo + 1) }, (_, index) => requestPage(pageNo + index));
    rest.push(...await Promise.all(batch));
  }
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
  const requestPage = async (pageNo) => {
    const requestUrl = new URL(`${SHARE_NURI_LIST_URL}/010700/${encodeURIComponent(apiKey)}`);
    requestUrl.searchParams.set('pageNo', String(pageNo));
    // 공유누리 주차장 목록 API의 한 페이지 최대값은 100이다.
    requestUrl.searchParams.set('numOfRows', '100');
    // 대전광역시 법정동 시도 코드는 30이다.
    requestUrl.searchParams.set('ctpvCd', '30');
    return fetchJson(requestUrl);
  };

  const first = await requestPage(1);
  const firstItems = getPageItems(first);
  const total = getTotalCount(first, firstItems.length);
  const pages = Math.max(1, Math.ceil(total / 100));
  console.info(JSON.stringify({ event: 'sharenuri_page_summary', total, firstPageItems: firstItems.length, pages }));
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, index) => requestPage(index + 2)));
  const list = [first, ...rest].flatMap(getPageItems);
  if (!list.length) return [];

  try {
    const detailUrl = `${SHARE_NURI_DETAIL_URL}/${encodeURIComponent(apiKey)}`;
    const detailPayload = await fetchJson(detailUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rsrcNoList: list.map((item) => item.rsrcNo).filter(Boolean).slice(0, 100) })
    });
    const detailById = new Map(getPageItems(detailPayload).map((item) => [cleanText(item.rsrcNo), item]));
    return list.map((item) => ({ ...item, detail: detailById.get(cleanText(item.rsrcNo)) || {} }));
  } catch {
    // 목록 정보는 상세 API가 실패해도 유효하므로, 동기화 자체는 계속한다.
    return list.map((item) => ({ ...item, detail: {} }));
  }
}

function dedupeRecords(records) {
  const seen = new Map();
  records.forEach((record) => {
    const key = `${cleanText(record.source)}\u0000${cleanText(record.external_id)}`;
    if (!seen.has(key)) seen.set(key, record);
  });
  return [...seen.values()];
}

function naverGeocodingCredentials() {
  const clientId = cleanText(process.env.NAVER_MAPS_CLIENT_ID);
  const clientSecret = cleanText(process.env.NAVER_MAPS_CLIENT_SECRET);
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

async function geocodeAddress(query, credentials) {
  const requestUrl = new URL(NAVER_GEOCODE_URL);
  requestUrl.searchParams.set('query', query);
  requestUrl.searchParams.set('count', '1');
  const payload = await fetchJson(requestUrl, {
    headers: {
      'X-NCP-APIGW-API-KEY-ID': credentials.clientId,
      'X-NCP-APIGW-API-KEY': credentials.clientSecret
    }
  });
  const address = asArray(payload?.addresses)[0];
  const coordinates = normalizeKoreaCoordinates(address?.y, address?.x);
  return coordinates.latitude !== null ? coordinates : null;
}

async function existingFestivalRecords() {
  try {
    const rows = await supabaseRequest(`places?select=external_id,latitude,longitude,description,homepage_url,operating_hours,metadata&source=eq.${FESTIVAL_SOURCE}`);
    return new Map(asArray(rows).map((row) => [cleanText(row.external_id), row]));
  } catch {
    return new Map();
  }
}

function preserveFestivalContent(record, saved) {
  const festivalContent = saved?.metadata?.festival_content;
  if (!festivalContent?.enriched_at) return record;
  return {
    ...record,
    description: cleanText(saved.description) || record.description,
    homepage_url: cleanText(saved.homepage_url) || record.homepage_url,
    operating_hours: saved.operating_hours || record.operating_hours,
    metadata: { ...record.metadata, festival_content: festivalContent }
  };
}

async function enrichFestivalCoordinates(records) {
  const credentials = naverGeocodingCredentials();
  const savedRecords = await existingFestivalRecords();

  if (!credentials) {
    return records.map((record) => {
      const saved = savedRecords.get(record.external_id);
      const savedCoordinates = normalizeKoreaCoordinates(saved?.latitude, saved?.longitude);
      const merged = preserveFestivalContent(record, saved);
      return savedCoordinates.latitude !== null
        ? { ...merged, latitude: savedCoordinates.latitude, longitude: savedCoordinates.longitude }
        : merged;
    });
  }

  const enriched = [];
  for (const record of records) {
    const saved = savedRecords.get(record.external_id);
    const savedCoordinates = normalizeKoreaCoordinates(saved?.latitude, saved?.longitude);
    const candidates = [
      cleanText(record.address),
      [cleanText(record.metadata?.place_name), cleanText(record.address)].filter(Boolean).join(' '),
      cleanText(record.metadata?.place_name)
    ].filter((value, index, values) => value && values.indexOf(value) === index);
    let coordinates = null;
    for (const candidate of candidates) {
      try {
        coordinates = await geocodeAddress(candidate, credentials);
        if (coordinates) break;
      } catch {
        // A single ambiguous festival address must not stop the whole daily sync.
      }
    }
    if (!coordinates && savedCoordinates.latitude !== null) coordinates = savedCoordinates;
    const merged = preserveFestivalContent(record, saved);
    enriched.push({
      ...merged,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null
    });
  }
  return enriched;
}

function mapFestival(item) {
  const startRaw = cleanText(item.eventstartdate);
  const endRaw = cleanText(item.eventenddate);
  const startDate = /^20\d{6}$/.test(startRaw)
    ? `${startRaw.slice(0, 4)}-${startRaw.slice(4, 6)}-${startRaw.slice(6, 8)}`
    : null;
  const endDate = /^20\d{6}$/.test(endRaw)
    ? `${endRaw.slice(0, 4)}-${endRaw.slice(4, 6)}-${endRaw.slice(6, 8)}`
    : null;
  const period = [startDate, endDate].filter(Boolean).join(' — ');
  const name = cleanText(item.title);
  const address = [item.addr1, item.addr2].map(cleanText).filter(Boolean).join(' ');
  const coordinates = normalizeKoreaCoordinates(item.mapy, item.mapx);
  const externalId = cleanText(item.contentid) || `${name}|${period}|${address}`;
  return {
    source: FESTIVAL_SOURCE,
    external_id: externalId,
    category: 'festival',
    name,
    address: address || null,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    start_date: startDate,
    end_date: endDate,
    operating_hours: { raw: null },
    description: null,
    image_url: cleanText(item.firstimage || item.firstimage2) || null,
    homepage_url: null,
    metadata: {
      period_raw: period || null,
      content_id: cleanText(item.contentid) || null,
      place_name: cleanText(item.addr2) || null,
      telephone: cleanText(item.tel) || null,
      zip: cleanText(item.zipcode) || null,
      progress_type: cleanText(item.progresstype) || null,
      festival_type: cleanText(item.festivaltype) || null,
      copyright_type: cleanText(item.cpyrhtDivCd) || null,
      registered_at: cleanText(item.createdtime) || null,
      modified_at: cleanText(item.modifiedtime) || null
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
      source: FESTIVAL_SOURCE,
      run: async () => enrichFestivalCoordinates(
        (await fetchKtoFestivals()).map(mapFestival).filter(isCurrentOrUpcomingFestival)
      )
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
  const log = await createSyncLog(dataset === 'festival' ? 'festival' : 'parking', job.source);
  try {
    const receivedRecords = await job.run();
    const records = dedupeRecords(receivedRecords);
    const table = dataset === 'festival' ? 'places' : 'parking_lots';
    const written = await supabaseUpsert(table, records);
    await finishSyncLog(log, 'success', {
      recordsReceived: receivedRecords.length,
      recordsUpserted: written.length,
      metadata: { duplicateRecordsSkipped: receivedRecords.length - records.length }
    });
    return { dataset, received: receivedRecords.length, upserted: written.length, duplicatesSkipped: receivedRecords.length - records.length };
  } catch (error) {
    await finishSyncLog(log, 'failed', { errorMessage: cleanText(error.message).slice(0, 500) });
    throw error;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
  if (!isAuthorizedCron(req)) return sendJson(res, 401, { error: 'unauthorized' });
  const requested = cleanText(req.query?.dataset || 'all');
  const datasets = requested === 'all' ? ['festival', 'parking', 'sharenuri'] : [requested];
  const results = await Promise.allSettled(datasets.map(syncOne));
  const summary = results.map((result, index) => result.status === 'fulfilled'
    ? { ok: true, ...result.value }
    : { ok: false, dataset: datasets[index], error: cleanText(result.reason?.message) });
  const allSucceeded = summary.every((result) => result.ok);
  return sendJson(res, allSucceeded ? 200 : 207, { ok: allSucceeded, results: summary });
};
