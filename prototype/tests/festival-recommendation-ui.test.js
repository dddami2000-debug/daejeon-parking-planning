const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const prototypeRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(prototypeRoot, 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(prototypeRoot, 'index.html'), 'utf8');
const recommenderSource = fs.readFileSync(path.join(prototypeRoot, 'festival-recommender.js'), 'utf8');
const readmeSource = fs.readFileSync(path.join(prototypeRoot, '..', 'README.md'), 'utf8');

// app.js는 한 줄로 압축된 스타일이라, 선언부터 첫 열 끝 중괄호까지를 함수 본문으로 본다.
function functionBody(name) {
  const start = appSource.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name}을 app.js에서 찾지 못했습니다`);
  const end = appSource.indexOf('\n}', start);
  assert.notEqual(end, -1, `${name}의 끝을 찾지 못했습니다`);
  return appSource.slice(start, end + 2);
}

test('scores recommendations with the named 60 / 25 / 15 weights, not inline magic numbers', () => {
  assert.match(recommenderSource, /const RECOMMENDATION_WEIGHTS = \{ taste: 60, distance: 25, schedule: 15 \};/);

  const baseScore = functionBody('baseRecommendationScoreFor');
  assert.match(baseScore, /taste:tasteMatchFor\(place\)/);
  assert.match(baseScore, /distance:distanceRecommendationScore\(place\)/);
  assert.match(baseScore, /schedule:festivalTimingScore\(place\)/);
  // 예전 62 / 23 / 15 하드코딩이 되살아나지 않게 막는다.
  assert.doesNotMatch(baseScore, /,62\]|,23\]/);
});

test('keeps the numeric score internal and shows evidence copy on cards and detail', () => {
  const fitLabel = functionBody('recommendationFitLabel');

  // 점수 구간을 그대로 문구로 바꾸던 방식을 되돌리지 않는다.
  assert.doesNotMatch(fitLabel, /recommendationScoreFor/);
  assert.doesNotMatch(fitLabel, />=82|>=68/);
  assert.match(fitLabel, /recommendationFitCopy/);
  assert.match(fitLabel, /tasteScore:tasteMatchFor\(place\)/);
  assert.match(fitLabel, /tripSelected:Boolean\(activeFestivalDateRange\(\)\)/);

  ['취향에 잘 맞아요', '여행 기간에 열려요', '즐겨찾기한 축제와 비슷해요', '방문 조건에 맞아요']
    .forEach(copy => assert.ok(recommenderSource.includes(copy), `${copy} 문구가 없습니다`));

  // 화면 어디에도 '추천 96점' 같은 숫자 점수 표현이 남아 있지 않다.
  [appSource, indexSource, recommenderSource].forEach(source => {
    assert.doesNotMatch(source, /추천\s*\d+\s*점/);
    assert.doesNotMatch(source, /\d+\s*%\s*일치/);
    assert.doesNotMatch(source, /적합도|매칭 점수|추천 점수 \d/);
  });

  // 정렬용 점수는 그대로 유지된다.
  assert.match(appSource, /function recommendationScoreFor\(place\)/);
  assert.match(appSource, /recommendationScoreFor\(b\)-recommendationScoreFor\(a\)/);

  // 화면 문구와 정렬 점수가 같은 계산 결과를 보도록 행동 신호도 함께 캐시한다.
  assert.match(appSource, /recommendationBehaviorCache=behaviors;/);
  assert.match(functionBody('festivalBehaviorFor'), /recommendationBehaviorCache\.has\(place\.id\)/);
});

test('reuses the existing card and detail markup so the mobile layout is untouched', () => {
  // 문구만 바뀌고 카드·상세 시트의 클래스 구조는 그대로다.
  assert.match(appSource, /<div class="recommend-reason">/);
  assert.match(appSource, /class="festival-card"/);
  assert.match(appSource, /class="compact-place-details"/);
  assert.match(appSource, /recommendationFitLabel\(place\)/);
  assert.match(appSource, /recommendationFitLabel\(activePlace\)/);
});

test('scores the schedule from the chosen travel window instead of today', () => {
  const timing = functionBody('festivalTimingScore');

  assert.match(timing, /scheduleScore\(place,\{today:todayValueInKorea\(\),\.\.\.options\}\)/);
  assert.match(timing, /options=festivalDateStatusOptions\(\)/);
  // 오늘 날짜만 보던 예전 계산이 남아 있지 않다.
  assert.doesNotMatch(timing, /const today=todayInKorea\(\)/);
  assert.doesNotMatch(timing, /days<=7\?90:days<=30\?75:60/);
  // 날짜 필터도 같은 창을 쓴다.
  assert.match(appSource, /festivalTimingScore\(place,festivalDateStatusOptions\(range\)\)<=0/);
});

test('scores distance on the nationwide curve rather than the 20km cliff', () => {
  const distance = functionBody('distanceRecommendationScore');

  assert.match(distance, /festivalRecommender\?\.distanceScore\(Number\(place\?\.distance\)\)\?\?50/);
  assert.doesNotMatch(distance, /Math\.min\(distance,20\)\*5/);
  assert.doesNotMatch(appSource, /Math\.min\(distance,20\)\*5/);
});

test('applies diversity reranking to recommendations but not to favorites or deadlines', () => {
  const rankings = appSource.match(/function renderRankings\(\)[\s\S]*?\r?\n\}/)?.[0] || '';
  const festivals = appSource.match(/function renderFestivals\(\)[\s\S]*?\r?\n\}/)?.[0] || '';

  // 기본 추천 카드와 맞춤 추천 순위에만 적용한다.
  assert.match(festivals, /diversifiedRecommendations\(filteredFestivals\(\)/);
  assert.match(rankings, /isDeadline\|\|isFavorites\?sorted:diversifiedRecommendations\(sorted\)/);
  assert.match(appSource, /festivalRecommender\.diversifyRecommendations\(ordered/);
});

test('preserves the map, favorite, tag, search, and mobile sheet behaviour', () => {
  assert.match(appSource, /minZoom:7/);
  assert.match(appSource, /function festivalMapDateStatus/);
  assert.match(appSource, /function festivalVisibleOnMap/);
  assert.match(appSource, /festivalRecommender\.setFavorite/);
  assert.match(appSource, /festivalRecommender\?\.matchesTopicQuery/);
  assert.match(appSource, /function setPlaceSheetExpanded/);
  assert.match(indexSource, /축제 이름·지역·주제 검색/);
  assert.match(indexSource, /맞춤 추천 축제|취향 알고리즘 기반 추천|festival-recommender\.js/);
});

test('leaves the view and favorite personalization constants untouched', () => {
  assert.match(recommenderSource, /const VIEW_WEIGHT = 1;/);
  assert.match(recommenderSource, /const FAVORITE_WEIGHT = 8;/);
  assert.match(recommenderSource, /const VIEW_HALF_LIFE_DAYS = 30;/);
  assert.match(recommenderSource, /const MAX_BEHAVIOR_WEIGHT = 0\.45;/);
  // 주석이 실제 동작과 어긋나지 않게: 반감기는 조회에만 걸린다.
  assert.match(recommenderSource, /반감기 30일은 '조회'에만 적용된다/);
});

test('records the weights as a hypothesis to validate with real usage', () => {
  assert.match(readmeSource, /초기 가설/);
  assert.match(readmeSource, /상세 조회율/);
  assert.match(readmeSource, /즐겨찾기율/);
});

test('rebuilds the score cache whenever the travel date filter changes', () => {
  // 일정 점수가 여행 기간을 기준으로 계산되므로, 기간이 바뀌면 정렬용 점수
  // 캐시를 다시 채워야 한다. 이 호출이 빠지면 문구만 바뀌고 순서는 그대로 남는다.
  ['applyFestivalDateFilter', 'clearFestivalDateFilter'].forEach(name => {
    const body = functionBody(name);
    const assigned = body.indexOf('festivalDateFilter={');
    const refreshed = body.indexOf('refreshRecommendationScoreCache()');
    const rendered = body.indexOf('renderFestivals()');

    assert.notEqual(assigned, -1, `${name}이 festivalDateFilter를 설정하지 않습니다`);
    assert.notEqual(refreshed, -1, `${name}에 refreshRecommendationScoreCache() 호출이 없습니다`);
    assert.notEqual(rendered, -1, `${name}이 renderFestivals()를 호출하지 않습니다`);
    assert.ok(assigned < refreshed, `${name}: 기간을 정하기 전에 캐시를 갱신하고 있습니다`);
    assert.ok(refreshed < rendered, `${name}: 캐시 갱신 전에 화면을 그리고 있습니다`);
  });
});

test('leaves no festivalDateFilter assignment without a following cache refresh', () => {
  // 나중에 날짜를 바꾸는 경로가 늘어나도 같은 연결이 빠지지 않게 막는다.
  const assignments = [...appSource.matchAll(/festivalDateFilter=\{/g)].map(match => match.index);
  assert.ok(assignments.length >= 2, 'festivalDateFilter 설정 지점을 찾지 못했습니다');

  assignments.forEach(index => {
    const following = appSource.slice(index, index + 600);
    const refreshed = following.indexOf('refreshRecommendationScoreCache()');
    const rendered = following.indexOf('renderFestivals()');
    assert.notEqual(refreshed, -1, '날짜 변경 뒤 점수 캐시를 갱신하지 않는 경로가 있습니다');
    assert.ok(rendered === -1 || refreshed < rendered, '캐시 갱신보다 렌더가 먼저인 경로가 있습니다');
  });
});
