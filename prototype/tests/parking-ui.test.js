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
  assert.match(indexSource, /seed-theme\.css\?v=93/);
  assert.match(indexSource, /app\.js\?v=94/);
});

test('searches by province aliases and related festival topics', () => {
  assert.match(indexSource, /data-search-query="충청북도">충북/);
  assert.doesNotMatch(indexSource, /data-search-query="수산물"/);
  assert.doesNotMatch(indexSource, /data-search-query="술"/);
  assert.match(indexSource, /축제 이름·지역·주제 검색/);
  assert.match(appSource, /if\(topicQuery\)return Boolean\(festivalRecommender\.matchesTopicQuery/);
  assert.match(appSource, /matchesTopicQuery\(searchPlace,term\)/);
  assert.match(appSource, /matchesRegionQuery\(searchPlace,term\)/);
  assert.match(indexSource, /app\.js\?v=94/);
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

test('shows the official TourAPI overview before core programs when available', () => {
  const detailBlock = appSource.match(/function openPlace\(id\)[\s\S]*?\n}\n\nfunction setPlaceSheetHeights/)?.[0] || '';
  assert.match(detailBlock, /festival_content\?\.official_overview/);
  assert.match(detailBlock, /<h3>축제 소개<\/h3><span>한국관광공사<\/span>/);
  assert.ok(detailBlock.indexOf('${overviewMarkup}') < detailBlock.indexOf('<section class="place-programs">'));
});

test('uses normalized evidence-based festival tags as detail chips', () => {
  const detailBlock = appSource.match(/function openPlace\(id\)[\s\S]*?\n}\n\nfunction setPlaceSheetHeights/)?.[0] || '';
  assert.match(appSource, /officialOverview:content\.official_overview\|\|''/);
  assert.match(detailBlock, /const chipRowMarkup=experience\.tags\.length/);
  assert.match(detailBlock, /chipRowMarkup,[\s\S]*?id="placeSheetPeekEnd"/);
});

test('replaces clipped recommendation-card descriptions with up to two topic tags', () => {
  const festivalCards = appSource.match(/function renderFestivals\(\)[\s\S]*?\n}\n\nfunction renderRankings/)?.[0] || '';
  assert.match(festivalCards, /festivalTopicTagsFor\(place\)\.slice\(0,2\)/);
  assert.match(festivalCards, /class="compact-place-tags"/);
  assert.match(festivalCards, /const cardAriaLabel=\[place\.name,countdown\.label,valueLine,topicTags\.length\?`주제 \$\{topicTags\.join\(', '\)\}`:''/);
  assert.doesNotMatch(festivalCards, /<span class="compact-place-value">\$\{escapeHtml\(valueLine\)\}<\/span><span class="compact-place-location">/);
  assert.match(themeSource, /\.compact-place-tags > span/);
  const compactTagStyles = themeSource.match(/\.compact-place-tags > span \{[\s\S]*?\n}/)?.[0] || '';
  assert.match(compactTagStyles, /background: var\(--seed-color-bg-neutral-weak\)/);
  assert.match(compactTagStyles, /color: var\(--seed-color-fg-neutral\)/);
  assert.doesNotMatch(compactTagStyles, /--festival-accent/);
});

test('uses the PR 5 compact filled countdown badge without changing the card layout', () => {
  const festivalCards = appSource.match(/function renderFestivals\(\)[\s\S]*?\n}\n\nfunction renderRankings/)?.[0] || '';
  assert.match(appSource, /function festivalCardCountdown\(place\)/);
  assert.match(appSource, /if\(label\.startsWith\('시작까지 '\)\)return \{label,tone:'upcoming'\}/);
  assert.match(appSource, /if\(label\.startsWith\('종료까지 '\)\)return \{label:`진행 중 · \$\{label\}`,tone:'ongoing'\}/);
  assert.match(festivalCards, /festivalCardCountdownMarkup\(countdown\)/);
  assert.doesNotMatch(festivalCards, /class="compact-place-kind"/);
  assert.match(themeSource, /\.compact-festival-countdown \{[\s\S]*?min-height: 18px;[\s\S]*?padding: 4px 7px;[\s\S]*?background: #23854d;[\s\S]*?color: var\(--seed-color-palette-static-white\);[\s\S]*?font-size: 8px;/);
  assert.match(themeSource, /\.compact-festival-countdown\.is-ongoing \{[\s\S]*?background: #d45320;/);
  assert.match(themeSource, /\.compact-festival-countdown\.is-neutral \{[\s\S]*?background: var\(--seed-color-bg-neutral-weak\);/);
  assert.match(themeSource, /\.festival-content-compact \{[\s\S]*?padding: 13px 17px;/);
});

test('labels deadline rankings with start and end countdowns before an event begins', () => {
  assert.match(appSource, /function festivalDeadlineCardLabel\(place\)/);
  assert.match(appSource, /return `\$\{countdown\} · \$\{deadline\}`/);
  assert.match(appSource, /return `종료까지 D-\$\{days\}`/);
  assert.match(appSource, /const deadlineLabel=isDeadline\?festivalDeadlineCardLabel\(place\):''/);
  assert.match(appSource, /if\(day>0\)return `시작까지 D-\$\{day\}`/);
  assert.match(appSource, /if\(countdown\.startsWith\('종료까지 '\)\)return `진행 중 · \$\{deadline\}`/);
  assert.match(appSource, /return remaining===0\?'오늘 종료':`진행 중 · 종료까지 D-\$\{remaining\}`/);
});

test('shows the start and end dates in deadline rankings', () => {
  assert.match(appSource, /function festivalScheduleLabel\(place\)/);
  assert.match(appSource, /return `\$\{start\} ~ \$\{end\}`/);
  assert.match(appSource, /const scheduleLabel=isDeadline\?festivalScheduleLabel\(place\):''/);
  assert.match(appSource, /class="ranking-deadline"[\s\S]*?\| \$\{escapeHtml\(scheduleLabel\)\}/);
  assert.match(appSource, /class="ranking-schedule"/);
  assert.match(appSource, /<b>\$\{escapeHtml\(place\.name\)\}<\/b><span>\$\{escapeHtml\(area\)\}<\/span>\$\{deadline\}/);
  assert.match(themeSource, /\.ranking-copy \.ranking-schedule \{[\s\S]*?display: inline;[\s\S]*?font-size: 10px;/);
});

test('keeps search results text-only without decorative festival emojis', () => {
  const searchBlock=appSource.match(/function renderSearchResults\(query=''\)[\s\S]*?\n}\n\nfunction openSearch/)?.[0]||'';
  assert.doesNotMatch(searchBlock, /search-result-icon|place\.emoji|<i>→<\/i>/);
  assert.match(appSource, /function searchResultMetaMarkup\(place\)/);
  assert.match(searchBlock, /\$\{searchResultMetaMarkup\(place\)\}/);
  assert.match(themeSource, /\.search-result \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\);/);
  assert.doesNotMatch(themeSource, /\.search-result-icon|\.search-result > i/);
});

test('uses distinct colors for search result status, countdown, and location', () => {
  assert.match(appSource, /search-result-status is-\$\{tone\}/);
  assert.match(appSource, /search-result-countdown/);
  assert.match(appSource, /search-result-area/);
  assert.match(themeSource, /\.search-result-status\.is-ongoing \{ color: #d45320; \}/);
  assert.match(themeSource, /\.search-result-status\.is-upcoming \{ color: #23854d; \}/);
  assert.match(themeSource, /\.search-result-countdown \{ color: var\(--seed-color-fg-neutral\); \}/);
  assert.match(themeSource, /\.search-result-area \{ color: var\(--seed-color-fg-neutral-muted\); \}/);
});

test('prevents mobile Safari from zooming when the festival search input receives focus', () => {
  assert.match(themeSource, /@media \(max-width: 768px\) \{[\s\S]*?\.place-search-form input \{ font-size: 16px; \}/);
  assert.match(themeSource, /\.place-search-form input \{ font-size: 16px; \}/);
});

test('keeps long recommendation-card titles to two lines without pushing metadata away', () => {
  const festivalCards = appSource.match(/function renderFestivals\(\)[\s\S]*?\n}\n\nfunction renderRankings/)?.[0] || '';
  assert.match(appSource, /function festivalCardTitleDensity\(name\)/);
  assert.match(appSource, /if\(length>=20\)return 'is-title-compact'/);
  assert.match(appSource, /if\(length>=13\)return 'is-title-long'/);
  assert.match(festivalCards, /class="compact-place-title \$\{titleDensity\}"><span>\$\{escapeHtml\(place\.name\)\}<\/span><\/h3>/);
  assert.match(festivalCards, /class="compact-place-details"/);
  const compactTitleStyles = themeSource.match(/\.festival-content-compact h3,[\s\S]*?\n}/)?.[0] || '';
  assert.match(compactTitleStyles, /height: 45px/);
  assert.match(compactTitleStyles, /align-items: center/);
  assert.match(compactTitleStyles, /width: 150px/);
  assert.match(compactTitleStyles, /overflow: hidden/);
  const compactTitleTextStyles = themeSource.match(/\.festival-content-compact h3 > span \{[\s\S]*?\n}/)?.[0] || '';
  assert.match(compactTitleTextStyles, /-webkit-line-clamp: 2/);
  assert.match(compactTitleTextStyles, /display: -webkit-box/);
  const compactDetailsStyles = themeSource.match(/\.compact-place-details \{[\s\S]*?\n}/)?.[0] || '';
  assert.match(compactDetailsStyles, /margin-top: auto/);
});

test('keeps festival card borders inside the horizontal scroll viewport', () => {
  const festivalSliderStyles = [...themeSource.matchAll(/\.festival-slider \{[\s\S]*?\n}/g)]
    .map(match => match[0])
    .find(block => block.includes('padding-inline: 4px')) || '';
  assert.match(festivalSliderStyles, /padding-inline: 4px/);
  assert.match(festivalSliderStyles, /scroll-padding-inline: 4px/);
});

test('keeps the festival carousel and personalized ranking visually separated without a divider line', () => {
  const rankingSectionStyles = themeSource.match(/\.recommend-rankings \{[\s\S]*?\n}/)?.[0] || '';
  assert.match(rankingSectionStyles, /padding: 18px 1px 26px/);
  assert.match(rankingSectionStyles, /border-top: 0/);
});

test('uses one continuous festival detail sheet that expands from content gestures', () => {
  assert.doesNotMatch(indexSource, /placeSheetBack|placeSheetDismiss|place-sheet-header-action/);
  assert.doesNotMatch(appSource, /placeSheetBack|placeSheetDismiss/);
  assert.match(appSource, /if\(sheet\.id==='placeSheet'\)return !sheet\.classList\.contains\('is-expanded'\)/);
  assert.match(appSource, /function expandPlaceSheetOnWheel\(event\)/);
  assert.match(appSource, /screenHeight-expandedTopInset/);
  const beginPlaceDrag = appSource.match(/function beginPlaceSheetDrag\(event\)[\s\S]*?\n}/)?.[0] || '';
  assert.doesNotMatch(beginPlaceDrag, /event\.preventDefault\(\)/);
  assert.doesNotMatch(beginPlaceDrag, /setPointerCapture/);
  assert.match(beginPlaceDrag, /fromGrabber:Boolean/);
  const movePlaceDrag = appSource.match(/function movePlaceSheetDrag\(event\)[\s\S]*?\n}/)?.[0] || '';
  assert.match(movePlaceDrag, /!placeSheetDrag\.moved/);
  assert.match(movePlaceDrag, /captureTarget\?\.setPointerCapture/);
  const endPlaceDrag = appSource.match(/function endPlaceSheetDrag\(event\)[\s\S]*?\n}/)?.[0] || '';
  assert.match(endPlaceDrag, /!drag\.moved&&drag\.fromGrabber/);
  assert.match(endPlaceDrag, /setPlaceSheetExpanded\(!drag\.expanded\)/);
  assert.match(themeSource, /#placeSheet:not\(\.is-expanded\) \{[\s\S]*?overflow-y: hidden;[\s\S]*?touch-action: none;/);
  assert.match(themeSource, /#placeSheet\.is-expanded \{[\s\S]*?overflow-y: auto;[\s\S]*?touch-action: pan-y;/);
  assert.match(themeSource, /#placeSheet\.is-expanded \.place-sheet-grabber \.sheet-handle \{[\s\S]*?opacity: 1;[\s\S]*?pointer-events: auto;/);
});

test('sizes the initial festival detail peek to end after the topic tags', () => {
  assert.match(appSource, /id="placeSheetPeekEnd"/);
  assert.match(appSource, /const peekEnd=\$\('#placeSheetPeekEnd'\)/);
  assert.match(appSource, /const actionReserve=actions\?Math\.ceil\(actions\.getBoundingClientRect\(\)\.height\):0/);
  assert.match(appSource, /peekEndRect\.bottom-sheetRect\.top\+actionReserve\+12/);
  assert.match(appSource, /const peekHeight=Math\.min\(fullHeight-56,Math\.max\(260,measuredPeekHeight\)\)/);
  assert.match(appSource, /setPlaceSheetHeights\(\);[\s\S]*?classList\.add\('show'\);[\s\S]*?focusMapOn\(targetPosition,15,'place',750\)/);
  assert.match(themeSource, /\.place-peek-end \{[\s\S]*?height: 0;[\s\S]*?pointer-events: none;/);
});

test('collapses a fully scrolled-up festival detail without overscroll whitespace or an extra close action', () => {
  assert.doesNotMatch(indexSource, /placeSheetClose|place-sheet-close/);
  assert.doesNotMatch(appSource, /placeSheetClose/);
  assert.match(appSource, /function beginPlaceSheetTopPull\(event\)/);
  assert.match(appSource, /function isPlaceSheetTopPullTarget\(event,sheet\)/);
  assert.match(appSource, /sheet\.scrollTop>1/);
  assert.match(appSource, /if\(event\.cancelable\)event\.preventDefault\(\)/);
  assert.match(appSource, /if\(pullDistance<10\)return;[\s\S]*?setPlaceSheetExpanded\(false\)/);
  assert.match(appSource, /if\(placeSheetDrag\.topPullCandidate\)[\s\S]*?if\(delta>-10\)return;[\s\S]*?setPlaceSheetExpanded\(false\)/);
  assert.match(themeSource, /#placeSheet \{[\s\S]*?overscroll-behavior-y: none;/);
  assert.doesNotMatch(themeSource, /place-sheet-close/);
});

test('collapses the fully scrolled-up home recommendation sheet without overscroll whitespace', () => {
  assert.match(appSource, /function beginRecommendSheetTopPull\(event\)/);
  assert.match(appSource, /function moveRecommendSheetTopPull\(event\)/);
  assert.match(appSource, /section\.scrollTop>1/);
  assert.match(appSource, /if\(pullDistance<10\)return;[\s\S]*?setRecommendationsState\('preview'\)/);
  assert.match(appSource, /function collapseRecommendationsOnWheel\(event\)/);
  assert.match(appSource, /event\.deltaY>=0/);
  assert.match(appSource, /isRecommendSheetTopPullTarget\(event,section\)/);
  assert.match(appSource, /\.recommend-section'\)\.addEventListener\('pointerdown',beginRecommendSheetDrag\)/);
  assert.match(themeSource, /\.recommend-section\.is-expanded \{[\s\S]*?overscroll-behavior-y: none;/);
});

test('keeps recommendation ranking tabs out of sheet pull gestures', () => {
  assert.match(appSource, /function isRecommendSheetInteractiveTarget\(target\)/);
  assert.match(appSource, /target\.closest\('button, a, input, select, textarea, \[contenteditable="true"\]'\)/);
  assert.match(appSource, /!isRecommendSheetInteractiveTarget\(target\)/);
  assert.match(appSource, /\|\|isRecommendSheetInteractiveTarget\(target\)/);
  assert.match(indexSource, /data-ranking-filter="popular"/);
  assert.match(indexSource, /data-ranking-filter="deadline"/);
  assert.match(indexSource, /data-ranking-filter="favorites"/);
});

test('shows readable festival dates and recommendation reasons before visit facts without rain cancellation copy', () => {
  assert.match(appSource, /function festivalPeriodMarkup\(place\)/);
  assert.match(appSource, /class="festival-period"/);
  assert.match(appSource, /chipRowMarkup,[\s\S]*?id="placeSheetPeekEnd"[\s\S]*?recommendationMarkup,\s*'<section class="place-intro"/);
  assert.match(appSource, /class="recommend-reason"[\s\S]*?<ul>/);
  assert.doesNotMatch(appSource, /placeRainNotice|우천·취소/);
  assert.match(themeSource, /#placeSheet\.festival-detail \.festival-period span \{[\s\S]*?white-space: nowrap;/);
  assert.match(themeSource, /#placeSheet\.festival-detail \.recommend-reason li span \{[\s\S]*?word-break: keep-all;/);
});

test('loads a cached TMAP driving time only after the user location is available', () => {
  assert.match(appSource, /const drivingRouteCache = new Map\(\)/);
  assert.match(appSource, /function loadDrivingRouteForActivePlace\(\)/);
  assert.match(appSource, /fetch\(`\/api\/tmap-route\?\$\{params\.toString\(\)\}`/);
  assert.match(appSource, /도로 \$\{normalized\.distanceKm\}km · 차로 약 \$\{normalized\.durationMinutes\}분/);
  assert.match(appSource, /현재 위치로 계산하기/);
  assert.match(appSource, /직선거리 \$\{place\.distance\}km/);
  assert.match(appSource, /if\(isPlaceFocused\)loadDrivingRouteForActivePlace\(\)/);
  assert.match(appSource, /id="placeRouteRequest"/);
  assert.match(appSource, /id="placeRouteEstimate"/);
  assert.match(appSource, /id="placeRouteSource"/);
  assert.match(appSource, /requestCurrentLocation\(\{focusMap:false,announce:false\}\)/);
  assert.match(appSource, /\$\('#placeRouteRequest'\)\.addEventListener\('click',requestCurrentLocationForRoute\)/);
  assert.doesNotMatch(appSource, /현재 위치에서 차로 약 \$\{place\.eta\}분/);
  assert.match(themeSource, /\.festival-facts \.festival-route-fact small \{[\s\S]*?word-break: keep-all;/);
  assert.match(themeSource, /\.festival-facts \.festival-route-request \{[\s\S]*?background: transparent;[\s\S]*?text-align: left;/);
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
  assert.match(appSource, /minZoom:7,maxZoom:18/);
  assert.doesNotMatch(indexSource, /daejeon-focus-mask/);
  assert.doesNotMatch(themeSource, /\.daejeon-focus-mask/);
});

test('styles map pins by date state through the shared FestivalTiming module', () => {
  assert.match(indexSource, /<script src="festival-timing\.js/);
  const renderMap = appSource.match(/function renderMap\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction renderNearbyPanel/)?.[0] || '';

  // Ended festivals drop off the map; upcoming and unknown ones stay as muted pins.
  assert.match(renderMap, /festivalVisibleOnMap\(place,statusOptions\)/);
  assert.doesNotMatch(renderMap, /festivalMatchesDateFilter/);
  const visibilityBlock = appSource.match(/function festivalVisibleOnMap\(place[\s\S]*?\r?\n}/)?.[0] || '';
  assert.match(visibilityBlock, /festivalMapDateStatus\(place,options\)!=='ended'/);

  // Pins and clusters carry the state in the class list, not only in colour.
  assert.match(renderMap, /place-pin-festival\$\{status==='active'\?'':' place-pin-upcoming'\}/);
  assert.match(renderMap, /groupDateStatus\(group\.places,statusOptions\)/);
  assert.match(renderMap, /\$\{groupStatus==='active'\?'':' upcoming-place-cluster'\}/);
  assert.match(renderMap, /--cluster-color:\$\{groupStatus==='active'\?'#ff4f64':'#8b95a1'\}/);
  assert.match(renderMap, /festivalDateStatusLabel\(status\)/);

  // The favourite badge and favourite-only mode keep working alongside the state.
  assert.match(renderMap, /favorite\?' favorite-place-pin':''/);
  assert.match(renderMap, /marker-favorite-badge/);
  assert.match(renderMap, /showFavoritePinsOnly/);
  assert.match(renderMap, /matchesTopicQuery\(behaviorPlaceFor\(place\),activeMapTopicFilter\)/);

  // Muted styling is declared after the favourite rules so date state wins the bubble.
  assert.match(themeSource, /\.map-marker\.place-pin-upcoming \.marker-bubble/);
  assert.match(themeSource, /\.place-cluster-marker\.upcoming-place-cluster/);
  assert.ok(
    themeSource.indexOf('.map-marker.place-pin-upcoming .marker-bubble')
      > themeSource.indexOf('.map-marker.favorite-place-pin .marker-bubble'),
    'the upcoming pin rule must come after the favourite pin rule to override the bubble colour'
  );
  // The translucent cluster bubble design stays intact.
  assert.match(themeSource, /\.place-cluster-marker\s*\{[\s\S]*background: color-mix\(in srgb, var\(--cluster-color/);
  assert.match(themeSource, /\.place-cluster-marker\s*\{[\s\S]*backdrop-filter: blur\(3px\)/);
});

test('derives festival detail tags from real data through the shared FestivalTags module instead of a hardcoded list', () => {
  assert.match(indexSource, /<script src="festival-tags\.js/);
  assert.doesNotMatch(appSource, /tags:\['야간 축제','거리 공연','먹거리'\]/);
  assert.doesNotMatch(appSource, /tags:\['로봇·AI','우주 체험','가족 나들이'\]/);
  assert.doesNotMatch(appSource, /tags:\['와인 시음','푸드 페어링','문화 공연'\]/);
  assert.doesNotMatch(appSource, /'공식 일정 확인'/);
  assert.doesNotMatch(appSource, /'공식 일정 확인 필요'/);

  const helperBlock = appSource.match(/function festivalTagsFor\(place[\s\S]*?\r?\n}/)?.[0] || '';
  assert.match(helperBlock, /window\.FestivalTags\?\.deriveFestivalTags/);
  assert.match(helperBlock, /topicGroups:window\.FestivalRecommender\?\.topicGroups/);

  const experienceBlock = appSource.match(/function experienceFor\(place\)[\s\S]*?\r?\n}/)?.[0] || '';
  assert.match(experienceBlock, /tags:festivalTagsFor\(place,\{programs,existingTags:content\.tags\}\)/);
  assert.match(experienceBlock, /tags:festivalTagsFor\(place,\{programs:curated\.highlights\}\)/);
  assert.match(experienceBlock, /tags:festivalTagsFor\(place,\{programs:\[\]\}\)/);

  assert.doesNotMatch(appSource, /experience\.tags\.slice\(0,3\)\.map/);
  assert.match(appSource, /const chipRowMarkup=experience\.tags\.length\?`<div class="festival-chip-row">/);
});

test('shows but does not navigate regional parking mock data', () => {
  assert.match(appSource, /parkingDataState='regional-unavailable'/);
  assert.match(appSource, /축제 인근 공영주차장 \(예시\)/);
  assert.match(appSource, /공영주차장\$\{mock\?' · 목업 데이터':''\}/);
  assert.match(appSource, /choice\.status!=='available'/);
  assert.match(appSource, /목업 정보라 실제 길안내를 제공하지 않아요/);
});
