(function attachNavigationLinks(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.NavigationLinks = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createNavigationLinks() {
  const KOREA_BOUNDS = { minLat: 33, maxLat: 39, minLng: 124, maxLng: 132 };

  function coordinate(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function validCoordinates(lat, lng) {
    return lat !== null && lng !== null
      && lat >= KOREA_BOUNDS.minLat && lat <= KOREA_BOUNDS.maxLat
      && lng >= KOREA_BOUNDS.minLng && lng <= KOREA_BOUNDS.maxLng;
  }

  function normalizeDestination(destination) {
    const lat = coordinate(destination?.lat);
    const lng = coordinate(destination?.lng);
    if (!validCoordinates(lat, lng)) return null;
    return {
      name: String(destination?.name || '축제 목적지').trim() || '축제 목적지',
      lat,
      lng
    };
  }

  function normalizeOrigin(origin) {
    const lat = coordinate(origin?.lat);
    const lng = coordinate(origin?.lng);
    return validCoordinates(lat, lng) ? { lat, lng } : null;
  }

  function buildNaverUrl(mode, destination, origin, appName) {
    const target = normalizeDestination(destination);
    if (!target || !['transit', 'navigation'].includes(mode)) return null;
    const start = normalizeOrigin(origin);
    const path = mode === 'transit' ? 'route/public' : 'navigation';
    const params = new URLSearchParams({
      dlat: String(target.lat),
      dlng: String(target.lng),
      dname: target.name,
      appname: String(appName || 'https://daejeon-parking-planning.vercel.app')
    });
    if (start) {
      params.set('slat', String(start.lat));
      params.set('slng', String(start.lng));
      params.set('sname', '현재 위치');
    }
    return `nmap://${path}?${params.toString()}`;
  }

  function buildNaverAndroidIntent(naverUrl) {
    if (!String(naverUrl || '').startsWith('nmap://')) return null;
    return `intent://${String(naverUrl).slice('nmap://'.length)}#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end`;
  }

  function buildNaverWebUrl(destination) {
    const target = normalizeDestination(destination);
    return target ? `https://map.naver.com/p/search/${encodeURIComponent(target.name)}` : null;
  }

  function buildKakaoMapAppUrl(destination, origin) {
    const target = normalizeDestination(destination);
    const start = normalizeOrigin(origin);
    if (!target || !start) return null;
    const params = new URLSearchParams({
      sp: `${start.lat},${start.lng}`,
      ep: `${target.lat},${target.lng}`,
      by: 'publictransit'
    });
    return `kakaomap://route?${params.toString()}`;
  }

  function buildKakaoMapMobileUrl(destination, origin) {
    const target = normalizeDestination(destination);
    const start = normalizeOrigin(origin);
    if (!target || !start) return null;
    const params = new URLSearchParams({
      sp: `${start.lat},${start.lng}`,
      ep: `${target.lat},${target.lng}`,
      by: 'publictransit'
    });
    return `https://m.map.kakao.com/scheme/route?${params.toString()}`;
  }

  function buildKakaoMapWebUrl(destination, origin) {
    const target = normalizeDestination(destination);
    if (!target) return null;
    const start = normalizeOrigin(origin);
    const destinationPath = `${encodeURIComponent(target.name)},${target.lat},${target.lng}`;
    if (!start) return `https://map.kakao.com/link/to/${destinationPath}`;
    return `https://map.kakao.com/link/by/traffic/${encodeURIComponent('현재 위치')},${start.lat},${start.lng}/${destinationPath}`;
  }

  function buildTmapRedirectUrl(destination) {
    const target = normalizeDestination(destination);
    if (!target) return null;
    const params = new URLSearchParams({
      name: target.name,
      lat: String(target.lat),
      lng: String(target.lng)
    });
    return `/api/tmap-navigation?${params.toString()}`;
  }

  function platformFromUserAgent(userAgent) {
    const value = String(userAgent || '').toLowerCase();
    if (/android/.test(value)) return 'android';
    if (/iphone|ipad|ipod/.test(value)) return 'ios';
    return 'desktop';
  }

  return {
    buildKakaoMapAppUrl,
    buildKakaoMapMobileUrl,
    buildKakaoMapWebUrl,
    buildNaverAndroidIntent,
    buildNaverUrl,
    buildNaverWebUrl,
    buildTmapRedirectUrl,
    normalizeDestination,
    normalizeOrigin,
    platformFromUserAgent
  };
}));
