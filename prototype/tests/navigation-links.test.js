const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildKakaoMapAppUrl,
  buildKakaoMapMobileUrl,
  buildKakaoMapWebUrl,
  buildNaverAndroidIntent,
  buildNaverUrl,
  buildNaverWebUrl,
  buildTmapRedirectUrl,
  initializeKakaoNavi,
  normalizeDestination,
  platformFromUserAgent
} = require('../navigation-links');

const destination = { name: '대전 0시 축제', lat: 36.3298, lng: 127.4307 };
const origin = { lat: 36.35, lng: 127.38 };

test('builds Naver public-transit and navigation schemes with a named destination', () => {
  const transit = new URL(buildNaverUrl('transit', destination, origin, 'https://example.com'));
  assert.equal(transit.protocol, 'nmap:');
  assert.equal(transit.pathname, '/public');
  assert.equal(transit.hostname, 'route');
  assert.equal(transit.searchParams.get('dname'), destination.name);
  assert.equal(transit.searchParams.get('slat'), String(origin.lat));
  assert.equal(transit.searchParams.get('appname'), 'https://example.com');

  const navigation = new URL(buildNaverUrl('navigation', destination, null, 'https://example.com'));
  assert.equal(navigation.hostname, 'navigation');
  assert.equal(navigation.searchParams.get('dlat'), String(destination.lat));
  assert.equal(navigation.searchParams.has('slat'), false);
});

test('builds the Android intent and desktop public-transit route for Naver Map', () => {
  const scheme = buildNaverUrl('navigation', destination, null, 'https://example.com');
  const intent = buildNaverAndroidIntent(scheme);
  assert.match(intent, /^intent:\/\/navigation\?/);
  assert.match(intent, /package=com\.nhn\.android\.nmap/);
  assert.equal(
    buildNaverWebUrl(destination,origin),
    `https://map.naver.com/p/directions/${origin.lng},${origin.lat},${encodeURIComponent('현재 위치')},,COORDINATE/${destination.lng},${destination.lat},${encodeURIComponent(destination.name)},,ADDRESS_POI/-/transit?c=15.00,0,0,0,dh`
  );
  assert.match(buildNaverWebUrl(destination), /\/directions\/-\//);
});

test('builds Kakao Map public-transit links with and without an origin', () => {
  const appUrl = new URL(buildKakaoMapAppUrl(destination, origin));
  assert.equal(appUrl.protocol, 'kakaomap:');
  assert.equal(appUrl.hostname, 'route');
  assert.equal(appUrl.searchParams.get('sp'), `${origin.lat},${origin.lng}`);
  assert.equal(appUrl.searchParams.get('ep'), `${destination.lat},${destination.lng}`);
  assert.equal(appUrl.searchParams.get('by'), 'publictransit');

  const mobileUrl = new URL(buildKakaoMapMobileUrl(destination, origin));
  assert.equal(mobileUrl.hostname, 'm.map.kakao.com');
  assert.equal(mobileUrl.searchParams.get('by'), 'publictransit');
  assert.match(buildKakaoMapWebUrl(destination, origin), /\/link\/by\/traffic\//);
  assert.match(buildKakaoMapWebUrl(destination), /\/link\/to\//);
});

test('builds a local TMAP redirect without putting an app key in browser code', () => {
  const tmap = new URL(buildTmapRedirectUrl(destination), 'https://example.com');
  assert.equal(tmap.pathname, '/api/tmap-navigation');
  assert.equal(tmap.searchParams.get('name'), destination.name);
  assert.equal(tmap.searchParams.get('lat'), String(destination.lat));
  assert.equal(tmap.searchParams.has('appKey'), false);
});

test('initializes Kakao before checking and using the Navi module', () => {
  let initializedKey = null;
  const kakao = {
    initialized: false,
    isInitialized() { return this.initialized; },
    init(key) {
      initializedKey = key;
      this.initialized = true;
      this.Navi = { start() {} };
    }
  };

  assert.equal(initializeKakaoNavi(kakao, ' kakao-javascript-key '), true);
  assert.equal(initializedKey, 'kakao-javascript-key');
  assert.equal(initializeKakaoNavi(kakao, 'kakao-javascript-key'), true);
  assert.equal(initializeKakaoNavi(null, 'kakao-javascript-key'), false);
  assert.equal(initializeKakaoNavi(kakao, ''), false);
});

test('rejects out-of-country coordinates and detects mobile platforms', () => {
  assert.equal(normalizeDestination({ name: '잘못된 좌표', lat: 1, lng: 1 }), null);
  assert.equal(buildNaverUrl('transit', { name: '잘못된 좌표', lat: 1, lng: 1 }), null);
  assert.equal(platformFromUserAgent('Mozilla/5.0 (Linux; Android 15)'), 'android');
  assert.equal(platformFromUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)'), 'ios');
  assert.equal(platformFromUserAgent('Mozilla/5.0 (Macintosh)'), 'desktop');
});
