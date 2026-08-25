const test = require('node:test');
const assert = require('node:assert/strict');

const { festivalCountdownLabel, todayInKorea } = require('../festival-timing');

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
