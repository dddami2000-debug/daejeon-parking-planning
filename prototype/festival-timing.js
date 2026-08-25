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

  return { festivalCountdownLabel, todayInKorea };
});
