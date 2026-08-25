const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const prototypeRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(prototypeRoot, 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(prototypeRoot, 'index.html'), 'utf8');
const recommenderSource = fs.readFileSync(path.join(prototypeRoot, 'festival-recommender.js'), 'utf8');

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

test('contains no landmark fallback, search, or detail UI', () => {
  assert.doesNotMatch(appSource, /landmark|랜드마크/);
  assert.doesNotMatch(indexSource, /landmark|랜드마크/);
  assert.match(indexSource, /축제 이름이나 지역 검색/);
});

test('personalizes festivals from views and favorites without using parking behavior', () => {
  assert.match(indexSource, /festival-recommender\.js/);
  assert.match(indexSource, /나를 위한 추천 축제/);
  assert.match(indexSource, /맞춤 추천 축제/);
  assert.match(appSource, /daejeonMap\.festivalPreferences\.v1/);
  assert.match(appSource, /recordFestivalView\(activePlace\)/);
  assert.match(appSource, /festivalRecommender\.setFavorite/);
  assert.match(appSource, /주제·지역·즐겨찾기·조회 반영/);
  assert.match(appSource, /if\(!festivalRecommender\|\|place\?\.type!=='festival'\)return/);
  assert.match(recommenderSource, /candidate\.type !== 'festival'/);
  assert.match(recommenderSource, /FAVORITE_WEIGHT = 8/);

  const plannerBlock = appSource.match(/function openPlanner\(\)[\s\S]*?\n}/)?.[0] || '';
  const parkingBlock = appSource.match(/function renderParkings\(\)[\s\S]*?\n}\n\nfunction openPlanner/)?.[0] || '';
  assert.doesNotMatch(plannerBlock, /festivalPreferences|recordFestivalView|setFavorite|festivalBehaviorFor/);
  assert.doesNotMatch(parkingBlock, /festivalPreferences|recordFestivalView|setFavorite|festivalBehaviorFor/);
});

test('offers a favorite-only festival list and favorite-only map mode', () => {
  assert.match(indexSource, /data-ranking-filter="favorites"/);
  assert.match(indexSource, /id="favoriteMapButton"/);
  assert.match(indexSource, /aria-pressed="false"/);
  assert.match(appSource, /rankingFilter==='favorites'/);
  assert.match(appSource, /즐겨찾기한 축제/);
  assert.match(appSource, /showFavoritePinsOnly\?allVisible\.filter/);
  assert.match(appSource, /favorite-place-pin/);
  assert.match(appSource, /marker-favorite-badge/);
  assert.match(appSource, /favorite-place-cluster/);
});
