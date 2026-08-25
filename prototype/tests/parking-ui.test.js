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

test('zooms ordinary cluster bubbles and only opens a picker for co-located pins', () => {
  assert.match(indexSource, /id="placeChoiceLayer"/);
  assert.match(indexSource, /id="placeChoiceList"/);
  assert.match(appSource, /function openPlaceChoice\(groupPlaces\)/);
  assert.match(appSource, /function placesShareMapLocation\(groupPlaces\)/);
  assert.match(appSource, /SAME_LOCATION_RADIUS_KM/);
  assert.match(appSource, /function groupPlacesBySharedLocation\(visible\)/);
  assert.match(appSource, /if\(zoom>=MAP_MAX_ZOOM\)return groupPlacesBySharedLocation\(visible\)/);
  assert.match(appSource, /function handlePlaceGroupClick\(group\)/);
  const clusterHandler = appSource.match(/function handlePlaceGroupClick\(group\)[\s\S]*?\n}/)?.[0] || '';
  assert.doesNotMatch(clusterHandler, /openPlaceChoice/);
  assert.match(clusterHandler, /if\(currentZoom>=MAP_MAX_ZOOM\)\{renderMap\(\);return;}/);
  assert.match(appSource, /focusMapOn\(new naver\.maps\.LatLng\(group\.lat,group\.lng\),nextZoom,'overview',260\)/);
  assert.match(appSource, /openPlaceChoice\(group\.places\)/);
  assert.match(appSource, /handlePlaceGroupClick\(group\)/);
  assert.match(appSource, /data-place-choice=/);
  assert.match(appSource, /closePlaceChoice\(\{restoreFocus:false\}\);\s*openPlace\(id,'select'\)/);
  assert.match(appSource, /class="map-marker colocated-map-marker/);
  assert.match(appSource, /marker-overlap-count/);
  assert.match(appSource, /sharedLocation\?openPlaceChoice\(group\.places\):handlePlaceGroupClick\(group\)/);
  assert.match(appSource, /곳 보려면 지도 확대/);
});

test('shows a right-side map zoom control and uses one neutral cluster style', () => {
  assert.match(appSource, /zoomControl:true/);
  assert.match(appSource, /position:naver\.maps\.Position\.RIGHT_CENTER/);
  assert.doesNotMatch(appSource, /const clusterColor=/);
  assert.doesNotMatch(appSource, /--cluster-color:/);
});

test('personalizes only festival discovery from festival views and selections', () => {
  const engineIndex = indexSource.indexOf('recommendation-engine.js');
  const appIndex = indexSource.indexOf('app.js?v=');
  assert.ok(engineIndex >= 0 && appIndex > engineIndex);
  assert.match(indexSource, /나를 위한 추천 축제/);
  assert.match(indexSource, /맞춤 추천 축제/);
  assert.match(appSource, /daejeonMap\.festivalInteractions\.v2/);
  assert.match(appSource, /function openPlace\(id,interactionKind='view'\)/);
  assert.match(appSource, /recordFestivalInteraction\(activePlace,interactionKind\)/);
  assert.match(appSource, /openPlace\(card\.dataset\.place,'select'\)/);
  assert.match(appSource, /openPlace\(button\.dataset\.rankingPlace,'select'\)/);
  assert.match(appSource, /if\(!festivalRecommender\|\|place\?\.type!=='festival'\)return/);
  assert.match(appSource, /personalizedFestivalScoreFor\(b\)-personalizedFestivalScoreFor\(a\)/);
  assert.match(appSource, /festivalDeadlineValue\(a\)-festivalDeadlineValue\(b\)\|\|personalizedFestivalScoreFor/);
  assert.match(appSource, /축제 조회·선택 취향 반영/);
  const plannerBlock = appSource.match(/function openPlanner\(\)[\s\S]*?\n}/)?.[0] || '';
  const parkingBlock = appSource.match(/function renderParkings\(\)[\s\S]*?\n}\n\nfunction openPlanner/)?.[0] || '';
  assert.doesNotMatch(plannerBlock, /recordFestivalInteraction|personalizedFestivalScoreFor/);
  assert.doesNotMatch(parkingBlock, /recordFestivalInteraction|personalizedFestivalScoreFor/);
});
