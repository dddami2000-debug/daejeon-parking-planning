const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const prototypeRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(prototypeRoot, 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(prototypeRoot, 'index.html'), 'utf8');

test('uses a single ranked top-three parking plan instead of three separate criteria', () => {
  assert.match(indexSource, /TOP 3 PARKING/);
  assert.match(indexSource, /추천 주차장 순위/);
  assert.match(appSource, /rankLabel:`추천 \$\{index\+1\}위`/);
  assert.doesNotMatch(indexSource, /3-WAY PARKING PLAN|3가지 기준/);
  assert.doesNotMatch(appSource, /parkingPlanCriteria|option:'1안'|option:'2안'|option:'3안'/);
});

test('shows apparent temperature once above cards and keeps each card to walk and fee stats', () => {
  const renderParkings = appSource.match(/function renderParkings\(\)[\s\S]*?\n}\n\nfunction openPlanner/)?.[0] || '';
  assert.match(indexSource, /체감온도 확인 중/);
  assert.doesNotMatch(indexSource, /weatherRecommendation|parkingWeatherBadge/);
  assert.match(renderParkings, /도보 거리/);
  assert.match(renderParkings, /예상 요금/);
  assert.doesNotMatch(renderParkings, /날씨 반영|주차 규모|총 주차면수/);
});

test('does not use parking capacity in the fallback recommendation score', () => {
  assert.doesNotMatch(appSource, /recommendationScore:[^\n]*parking\.capacity/);
});
