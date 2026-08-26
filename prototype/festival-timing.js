(function attachFestivalTiming(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.FestivalTiming = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFestivalTiming() {
  const DAY_MS = 86400000;

  function koreaDateValue(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return NaN;
    return Date.parse(`${value}T00:00:00+09:00`);
  }

  function todayInKorea(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function festivalCountdownLabel(place, todayValue = todayInKorea()) {
    const today = koreaDateValue(todayValue);
    const start = koreaDateValue(place?.startDate);
    const end = koreaDateValue(place?.endDate);
    if (!Number.isFinite(today)) return '일정 확인';

    if (Number.isFinite(start) && today < start) {
      return `시작까지 D-${Math.ceil((start - today) / DAY_MS)}`;
    }

    if (Number.isFinite(end) && today <= end) {
      const days = Math.ceil((end - today) / DAY_MS);
      return days === 0 ? '종료까지 D-Day' : `종료까지 D-${days}`;
    }

    if (Number.isFinite(end) && today > end) return '종료됨';
    if (Number.isFinite(start) && today >= start) return '종료일 확인';
    return '일정 확인';
  }

  // Map pin states. 'ended' is the only state that hides a pin; 'unknown' keeps a
  // festival visible in the muted style so incomplete data never reads as a
  // confident "happening now" or "already over" claim.
  const DATE_STATUS = { ACTIVE: 'active', UPCOMING: 'upcoming', ENDED: 'ended', UNKNOWN: 'unknown' };

  function comparisonWindow({ today, rangeStart, rangeEnd } = {}) {
    const first = koreaDateValue(rangeStart);
    const last = koreaDateValue(rangeEnd);
    // A half-filled travel range behaves like a single-day trip, matching the
    // start-or-end fallback the date filter already uses.
    const from = Number.isFinite(first) ? first : last;
    const to = Number.isFinite(last) ? last : first;
    if (Number.isFinite(from) && Number.isFinite(to)) {
      return { start: Math.min(from, to), end: Math.max(from, to) };
    }
    const todayValue = koreaDateValue(today || todayInKorea());
    if (!Number.isFinite(todayValue)) return null;
    return { start: todayValue, end: todayValue };
  }

  function festivalDateStatus(place, options = {}) {
    const start = koreaDateValue(place?.startDate);
    const end = koreaDateValue(place?.endDate);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) return DATE_STATUS.UNKNOWN;

    const window = comparisonWindow(options);
    if (!window) return DATE_STATUS.UNKNOWN;

    // Boundaries are inclusive on both sides: a festival that opens on the last
    // day of the trip, or closes on the first, still counts as overlapping.
    if (end < window.start) return DATE_STATUS.ENDED;
    if (start > window.end) return DATE_STATUS.UPCOMING;
    return DATE_STATUS.ACTIVE;
  }

  function isFestivalVisibleOnMap(place, options = {}) {
    return festivalDateStatus(place, options) !== DATE_STATUS.ENDED;
  }

  // A cluster reports 'active' when any member is live in the window, so a mixed
  // bubble reads as "there is something to see here" instead of averaging into a
  // state none of its festivals actually has.
  function groupDateStatus(places = [], options = {}) {
    const statuses = (Array.isArray(places) ? places : [])
      .map(place => festivalDateStatus(place, options))
      .filter(status => status !== DATE_STATUS.ENDED);
    if (!statuses.length) return DATE_STATUS.ENDED;
    return statuses.includes(DATE_STATUS.ACTIVE) ? DATE_STATUS.ACTIVE : DATE_STATUS.UPCOMING;
  }

  return {
    DATE_STATUS,
    festivalCountdownLabel,
    festivalDateStatus,
    groupDateStatus,
    isFestivalVisibleOnMap,
    todayInKorea
  };
});
