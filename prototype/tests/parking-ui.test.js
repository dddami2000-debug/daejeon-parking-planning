const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const prototypeRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(prototypeRoot, 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(prototypeRoot, 'index.html'), 'utf8');

test('offers explicit distance, price, and large-lot parking priorities', () => {
  assert.match(indexSource, /TOP 3 PARKING/);
  assert.match(indexSource, /추천 주차장 순위/);
  assert.match(indexSource, /data-parking-priority="distance"/);
  assert.match(indexSource, /data-parking-priority="price"/);
  assert.match(indexSource, /data-parking-priority="large"/);
  assert.match(appSource, /rankLabel:String\(index\+1\)/);
  assert.doesNotMatch(indexSource, /3-WAY PARKING PLAN|3가지 기준/);
  assert.doesNotMatch(appSource, /parkingPlanCriteria|option:'1안'|option:'2안'|option:'3안'/);
});

test('shows apparent temperature once and labels missing real-time congestion honestly', () => {
  const renderParkings = appSource.match(/function renderParkings\(\)[\s\S]*?\n}\n\nfunction openPlanner/)?.[0] || '';
  assert.match(indexSource, /체감온도 확인 중/);
  assert.doesNotMatch(indexSource, /weatherRecommendation|parkingWeatherBadge/);
  assert.match(renderParkings, /도보 \$\{parking\.walk\}분/);
  assert.match(renderParkings, /예상 요금/);
  assert.match(renderParkings, /혼잡도/);
  assert.match(renderParkings, /제공 안 됨/);
  assert.doesNotMatch(renderParkings, /실시간 여유|잔여 주차면/);
});

test('uses capacity only for the explicit large-lot priority', () => {
  assert.match(appSource, /parkingPriority==='large'/);
  assert.match(appSource, /Number\(b\.capacity\)-Number\(a\.capacity\)/);
  assert.match(appSource, /주차면수 확인 필요/);
});
