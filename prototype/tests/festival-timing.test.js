const test = require('node:test');
const assert = require('node:assert/strict');

const {
  festivalCountdownLabel,
  festivalDateStatus,
  groupDateStatus,
  isFestivalVisibleOnMap,
  todayInKorea
} = require('../festival-timing');

const TODAY = '2026-08-25';

test('shows days until an upcoming festival starts', () => {
  assert.equal(
    festivalCountdownLabel({ startDate: '2026-09-02', endDate: '2026-09-05' }, '2026-08-25'),
    '시작까지 D-8'
  );
});

test('shows days until an active festival ends', () => {
  assert.equal(
    festivalCountdownLabel({ startDate: '2026-08-21', endDate: '2026-08-28' }, '2026-08-25'),
    '종료까지 D-3'
  );
  assert.equal(
    festivalCountdownLabel({ startDate: '2026-08-25', endDate: '2026-08-25' }, '2026-08-25'),
    '종료까지 D-Day'
  );
});

test('uses clear fallbacks for finished or incomplete schedules', () => {
  assert.equal(
    festivalCountdownLabel({ startDate: '2026-08-01', endDate: '2026-08-20' }, '2026-08-25'),
    '종료됨'
  );
  assert.equal(festivalCountdownLabel({}, '2026-08-25'), '일정 확인');
  assert.equal(
    festivalCountdownLabel({ startDate: '2026-08-21' }, '2026-08-25'),
    '종료일 확인'
  );
});

test('calculates the current date in Korea', () => {
  assert.equal(todayInKorea(new Date('2026-08-24T15:30:00Z')), '2026-08-25');
});

test('marks today\'s festivals active, future ones upcoming, and finished ones ended', () => {
  const status = place => festivalDateStatus(place, { today: TODAY });
  assert.equal(status({ startDate: '2026-08-21', endDate: '2026-08-28' }), 'active');
  assert.equal(status({ startDate: '2026-09-02', endDate: '2026-09-05' }), 'upcoming');
  assert.equal(status({ startDate: '2026-08-01', endDate: '2026-08-24' }), 'ended');
});

test('treats the first and last day of a festival as inclusive boundaries', () => {
  const status = place => festivalDateStatus(place, { today: TODAY });
  assert.equal(status({ startDate: TODAY, endDate: '2026-08-30' }), 'active', 'opening day is active');
  assert.equal(status({ startDate: '2026-08-10', endDate: TODAY }), 'active', 'closing day is still active');
  assert.equal(status({ startDate: TODAY, endDate: TODAY }), 'active', 'single-day festival today is active');
  assert.equal(status({ startDate: '2026-08-10', endDate: '2026-08-24' }), 'ended', 'ends the day before today');
  assert.equal(status({ startDate: '2026-08-26', endDate: '2026-08-27' }), 'upcoming', 'starts the day after today');
});

test('highlights festivals overlapping the travel range by even a single day', () => {
  const range = { today: TODAY, rangeStart: '2026-09-10', rangeEnd: '2026-09-20' };
  const status = place => festivalDateStatus(place, range);
  assert.equal(status({ startDate: '2026-09-20', endDate: '2026-09-25' }), 'active', 'starts on the last trip day');
  assert.equal(status({ startDate: '2026-09-05', endDate: '2026-09-10' }), 'active', 'ends on the first trip day');
  assert.equal(status({ startDate: '2026-09-01', endDate: '2026-09-30' }), 'active', 'spans the whole trip');
  assert.equal(status({ startDate: '2026-09-12', endDate: '2026-09-14' }), 'active', 'sits inside the trip');
  assert.equal(status({ startDate: '2026-09-21', endDate: '2026-09-25' }), 'upcoming', 'starts after the trip ends');
  assert.equal(status({ startDate: '2026-08-01', endDate: '2026-09-09' }), 'ended', 'closed before the trip starts');
});

test('ignores today once a travel range is chosen and accepts a half-filled range', () => {
  const running = { startDate: '2026-08-21', endDate: '2026-08-28' };
  assert.equal(festivalDateStatus(running, { today: TODAY }), 'active');
  assert.equal(
    festivalDateStatus(running, { today: TODAY, rangeStart: '2026-09-10', rangeEnd: '2026-09-20' }),
    'ended',
    'a festival running today is over by the time the chosen trip starts'
  );
  const singleDay = { today: TODAY, rangeStart: '2026-09-12' };
  assert.equal(festivalDateStatus({ startDate: '2026-09-11', endDate: '2026-09-13' }, singleDay), 'active');
  assert.equal(festivalDateStatus({ startDate: '2026-09-13', endDate: '2026-09-14' }, singleDay), 'upcoming');
});

test('keeps festivals with incomplete or unparseable dates visible instead of inventing a state', () => {
  const status = place => festivalDateStatus(place, { today: TODAY });
  assert.equal(status({ startDate: '2026-08-21' }), 'unknown', 'missing end date');
  assert.equal(status({ endDate: '2026-08-28' }), 'unknown', 'missing start date');
  assert.equal(status({}), 'unknown', 'no dates at all');
  assert.equal(status({ startDate: '2026-08-21', endDate: '미정' }), 'unknown', 'unparseable end date');
  assert.equal(status({ startDate: '2026/08/21', endDate: '2026/08/28' }), 'unknown', 'wrong date format');
  assert.equal(status({ startDate: '2026-08-28', endDate: '2026-08-21' }), 'unknown', 'end before start');

  assert.equal(isFestivalVisibleOnMap({ startDate: '2026-08-21' }, { today: TODAY }), true);
  assert.equal(isFestivalVisibleOnMap({}, { today: TODAY }), true);
});

test('hides only ended festivals from the map', () => {
  const visible = place => isFestivalVisibleOnMap(place, { today: TODAY });
  assert.equal(visible({ startDate: '2026-08-21', endDate: '2026-08-28' }), true, 'active stays');
  assert.equal(visible({ startDate: '2026-09-02', endDate: '2026-09-05' }), true, 'upcoming stays');
  assert.equal(visible({ startDate: '2026-08-01', endDate: '2026-08-24' }), false, 'ended is hidden');
});

test('gives a cluster one consistent state and never counts hidden ended festivals', () => {
  const options = { today: TODAY };
  const running = { startDate: '2026-08-21', endDate: '2026-08-28' };
  const future = { startDate: '2026-09-02', endDate: '2026-09-05' };
  const finished = { startDate: '2026-08-01', endDate: '2026-08-24' };
  const undated = { startDate: '2026-08-21' };

  assert.equal(groupDateStatus([running, future], options), 'active', 'a mixed cluster reads as active');
  assert.equal(groupDateStatus([future, undated], options), 'upcoming', 'upcoming and unknown share the muted state');
  assert.equal(groupDateStatus([finished, future], options), 'upcoming', 'ended members do not make a cluster active');
  assert.equal(groupDateStatus([finished, running], options), 'active');
  assert.equal(groupDateStatus([finished], options), 'ended', 'an all-ended cluster has nothing left to draw');
  assert.equal(groupDateStatus([], options), 'ended');
});
