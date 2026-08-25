const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const prototypeRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(prototypeRoot, 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(prototypeRoot, 'index.html'), 'utf8');
const recommenderSource = fs.readFileSync(path.join(prototypeRoot, 'festival-recommender.js'), 'utf8');
const themeSource = fs.readFileSync(path.join(prototypeRoot, 'seed-theme.css'), 'utf8');

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
  const renderParkings = appSource.match(/function renderParkings\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction openPlanner/)?.[0] || '';
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
  assert.match(indexSource, /축제 이름·지역·주제 검색/);
});

test('personalizes festivals from views and favorites without using parking behavior', () => {
  assert.match(indexSource, /festival-recommender\.js/);
  assert.match(indexSource, /나를 위한 추천 축제/);
  assert.match(indexSource, /맞춤 추천 축제/);
  assert.match(appSource, /daejeonMap\.festivalPreferences\.v1/);
  assert.match(appSource, /recordFestivalView\(activePlace\)/);
  assert.match(appSource, /festivalRecommender\.setFavorite/);
  assert.match(appSource, /취향 알고리즘 기반 추천/);
  assert.match(appSource, /if\(!festivalRecommender\|\|place\?\.type!=='festival'\)return/);
  assert.match(recommenderSource, /candidate\.type !== 'festival'/);
  assert.match(recommenderSource, /FAVORITE_WEIGHT = 8/);

  const plannerBlock = appSource.match(/function openPlanner\(\)[\s\S]*?\r?\n}/)?.[0] || '';
  const parkingBlock = appSource.match(/function renderParkings\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction openPlanner/)?.[0] || '';
  assert.doesNotMatch(plannerBlock, /festivalPreferences|recordFestivalView|setFavorite|festivalBehaviorFor/);
  assert.doesNotMatch(parkingBlock, /festivalPreferences|recordFestivalView|setFavorite|festivalBehaviorFor/);
});

test('offers a favorite-only festival list and favorite-only map mode', () => {
  assert.match(indexSource, /data-ranking-filter="favorites"/);
  assert.match(indexSource, /id="favoriteMapButton"/);
  assert.match(indexSource, /aria-pressed="false"/);
  assert.match(appSource, /rankingFilter==='favorites'/);
  assert.match(appSource, /즐겨찾기한 축제/);
  assert.match(appSource, /showFavoritePinsOnly[\s\S]*allVisible\.filter\(place=>isFestivalFavorite/);
  assert.match(appSource, /favorite-place-pin/);
  assert.match(appSource, /marker-favorite-badge/);
  assert.match(appSource, /favorite-place-cluster/);
});

test('auto-advances recommendation cards without overriding user or reduced-motion preferences', () => {
  assert.match(appSource, /FESTIVAL_AUTOPLAY_INTERVAL_MS = 5000/);
  assert.match(appSource, /festivalAutoplayDirection/);
  assert.match(appSource, /scrollTo\(\{left:positions\[next\],behavior:'smooth'\}\)/);
  assert.match(appSource, /festivalMotionPreference\.matches/);
  assert.match(appSource, /!slider\.matches\(':hover'\)/);
  assert.match(appSource, /!slider\.contains\(document\.activeElement\)/);
  assert.match(appSource, /festivalSlider'\)\.addEventListener\('pointerdown'/);
  assert.match(appSource, /document\.addEventListener\('visibilitychange'/);
  assert.match(indexSource, /seed-theme\.css\?v=67/);
  assert.match(indexSource, /app\.js\?v=62/);
});

test('searches by province aliases and related festival topics', () => {
  assert.match(indexSource, /data-search-query="충청북도">충북/);
  assert.doesNotMatch(indexSource, /data-search-query="수산물"/);
  assert.doesNotMatch(indexSource, /data-search-query="술"/);
  assert.match(indexSource, /축제 이름·지역·주제 검색/);
  assert.match(appSource, /if\(topicQuery\)return Boolean\(festivalRecommender\.matchesTopicQuery/);
  assert.match(appSource, /matchesTopicQuery\(searchPlace,term\)/);
  assert.match(appSource, /matchesRegionQuery\(searchPlace,term\)/);
  assert.match(indexSource, /app\.js\?v=62/);
});

test('refreshes recommendation ordering on load and every ten minutes instead of on favorite clicks', () => {
  assert.match(appSource, /RECOMMENDATION_REFRESH_INTERVAL_MS = 10 \* 60 \* 1000/);
  assert.match(appSource, /refreshRecommendationScoreCache\(\);renderFestivals\(\);renderRankings\(\)/);
  assert.match(appSource, /startRecommendationRefreshSchedule\(\)/);
  const favoriteBlock=appSource.match(/function toggleFestivalFavorite\(placeId\)[\s\S]*?\r?\n}/)?.[0]||'';
  assert.match(favoriteBlock, /syncFavoriteButtons\(\)/);
  assert.match(favoriteBlock, /updateFavoriteMapButton\(\)/);
  assert.match(favoriteBlock, /scheduleFavoriteVisualRefresh\(\)/);
  assert.doesNotMatch(favoriteBlock, /renderFestivals\(\)|renderRankings\(\)|renderMap\(\)/);
  const viewBlock=appSource.match(/function recordFestivalView\(place\)[\s\S]*?\r?\n}/)?.[0]||'';
  assert.doesNotMatch(viewBlock, /renderFestivals\(\)|renderRankings\(\)/);
});

test('keeps the smaller ranking favorite pinned over the photo as deadline copy changes height', () => {
  assert.match(themeSource, /\.ranking-item\s*\{[\s\S]*grid-template-columns:\s*23px minmax\(0, 1fr\) 82px/);
  assert.match(themeSource, /\.ranking-favorite\s*\{[\s\S]*top:\s*calc\(50% - 28px\)[\s\S]*right:\s*7px[\s\S]*width:\s*28px/);
});

test('aligns the current-location control with the right-side map controls', () => {
  assert.match(themeSource, /\.current-location-fab\s*\{[\s\S]*right:\s*12px[\s\S]*left:\s*auto/);
});

test('filters map festivals with large horizontally scrollable topic chips', () => {
  const toolbar=indexSource.match(/<div class="map-topic-filters"[\s\S]*?<\/div>/)?.[0]||'';
  assert.match(toolbar, /id="favoriteMapButton"/);
  ['술','농산물','먹거리','수산물','과학','공연','야간','가족','자연','문화'].forEach(topic=>{
    assert.match(toolbar,new RegExp(`data-map-topic="${topic}"`));
  });
  assert.ok(toolbar.indexOf('favoriteMapButton')<toolbar.indexOf('data-map-topic="술"'));
  assert.match(themeSource, /\.map-topic-filters\s*\{[\s\S]*display:\s*flex[\s\S]*overflow-x:\s*auto/);
  assert.match(themeSource, /\.map-topic-filters\s*\{[\s\S]*top:\s*98px/);
  assert.match(themeSource, /\.map-topic-filter\s*\{[\s\S]*height:\s*38px/);
  assert.match(appSource, /activeMapTopicFilter/);
  assert.match(appSource, /matchesTopicQuery\(behaviorPlaceFor\(place\),activeMapTopicFilter\)/);
  assert.match(appSource, /toggleMapTopicFilter\(button\.dataset\.mapTopic\)/);
});

test('expands recommendations below the search bar and labels personalized order clearly', () => {
  assert.match(indexSource, /data-ranking-filter="popular"[^>]*>추천순위<\/button>/);
  assert.doesNotMatch(indexSource, />인기순위<\/button>/);
  assert.match(themeSource, /--recommend-sheet-expanded-height:\s*calc\(100% - 98px\)/);
  assert.match(themeSource, /--recommend-sheet-expanded-height:\s*calc\(100% - 72px - env\(safe-area-inset-top\)\)/);
});

test('keeps map filters uniform and festival favorite controls compact', () => {
  assert.match(themeSource, /\.map-favorite-filter,\s*\.map-topic-filter\s*\{[\s\S]*height:\s*38px[\s\S]*font-size:\s*13px/);
  assert.match(themeSource, /\.festival-favorite-button\s*\{[\s\S]*width:\s*32px[\s\S]*height:\s*32px[\s\S]*font-size:\s*18px/);
  assert.match(themeSource, /\.place-hero-favorite\s*\{[\s\S]*width:\s*38px[\s\S]*height:\s*38px[\s\S]*font-size:\s*21px/);
});

test('replaces festival detail parking and homepage CTAs with travel guidance apps', () => {
  const detailBlock = appSource.match(/function openPlace\(id\)[\s\S]*?\r?\n}\r?\n\r?\nfunction setPlaceSheetHeights/)?.[0] || '';
  assert.match(detailBlock, /대중교통 안내/);
  assert.match(detailBlock, /내비게이션 안내/);
  assert.doesNotMatch(detailBlock, /🚌|🚘/);
  assert.doesNotMatch(detailBlock, /공식 홈페이지|주차 플랜 보기/);
  assert.match(indexSource, /id="festivalTravelModal"/);
  assert.doesNotMatch(indexSource, /id="festivalTravelIcon"/);
  assert.match(indexSource, /navigation-links\.js/);
  assert.match(appSource, /naver-map/);
  assert.match(appSource, /kakao-map/);
  assert.match(appSource, /kakao-navi/);
  assert.match(appSource, /tmap/);
  for (const iconFile of [
    'tmap-app-icon.png',
    'naver-map-app-icon.png',
    'kakao-map-app-icon.png',
    'kakao-navi-app-icon.png'
  ]) {
    assert.match(appSource, new RegExp(`assets/navigation/${iconFile.replace('.', '\\.')}`));
    assert.equal(fs.existsSync(path.join(prototypeRoot, 'assets/navigation', iconFile)), true);
  }
});

test('chooses between the festival and the algorithm top parking before opening navigation apps', () => {
  assert.match(indexSource, /id="festivalTravelBack"/);
  assert.match(appSource, /어디까지 안내할까요\?/);
  assert.match(appSource, /data-festival-destination="festival"/);
  assert.match(appSource, /data-festival-destination="parking"/);
  assert.match(appSource, /const parking=currentParkingList\(\)\[0\]\|\|null/);
  assert.match(appSource, /const algorithmTop=parkingTemplates\.find\(candidate=>festivalDestination\(candidate\)\)/);
  assert.match(appSource, /가장 추천하는 공영주차장이에요/);
  assert.match(appSource, /축제장까지 도보 \$\{Number\(parking\.walk\)\|\|0\}분/);
  assert.doesNotMatch(appSource, /추천 1순위/);
  assert.match(appSource, /renderFestivalProviderStep\(festivalDestination\(choice\.parking\)\)/);
  assert.match(themeSource, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
});

test('treats public parking hours as paid hours instead of closing hours', () => {
  assert.match(appSource, /function isPublicParking\(parking\)\{return parking\?\.type==='공영';\}/);
  assert.match(appSource, /code:'public-always-open'/);
  assert.match(appSource, /24시간 이용 가능하며 유료 시간대만 요금에 반영해요/);
  assert.match(appSource, /paid<=0\)return isPublicParking\(parking\)\?0:null/);
  assert.match(appSource, /24시간 이용 · 유료/);
  assert.match(appSource, /이용·유료 시간/);
});

test('does not render ranked or other parking pins on the map', () => {
  assert.doesNotMatch(appSource, /parkingMarkers|parkingPosition\(/);
  assert.doesNotMatch(appSource, /parking-map-marker|parking-rank-dot|parking-dot/);
  assert.doesNotMatch(themeSource, /parking-map-marker|parking-rank-dot/);
});

test('shows the nationwide festival map without a grayscale regional mask', () => {
  assert.match(indexSource, /aria-label="전국 축제 지도"/);
  assert.doesNotMatch(indexSource, /daejeon-focus-mask/);
  assert.doesNotMatch(themeSource, /\.daejeon-focus-mask/);
});

test('shows but does not navigate regional parking mock data', () => {
  assert.match(appSource, /parkingDataState='regional-unavailable'/);
  assert.match(appSource, /축제 인근 공영주차장 \(예시\)/);
  assert.match(appSource, /공영주차장\$\{mock\?' · 목업 데이터':''\}/);
  assert.match(appSource, /choice\.status!=='available'/);
  assert.match(appSource, /목업 정보라 실제 길안내를 제공하지 않아요/);
});
