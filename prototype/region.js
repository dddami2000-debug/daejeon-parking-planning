(function exposeFestivalRegion(globalScope, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (globalScope) globalScope.FestivalRegion = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const REGION_ALIASES = new Map([
    ['서울', '서울특별시'], ['서울시', '서울특별시'], ['서울특별시', '서울특별시'],
    ['부산', '부산광역시'], ['부산시', '부산광역시'], ['부산광역시', '부산광역시'],
    ['대구', '대구광역시'], ['대구시', '대구광역시'], ['대구광역시', '대구광역시'],
    ['인천', '인천광역시'], ['인천시', '인천광역시'], ['인천광역시', '인천광역시'],
    ['광주', '광주광역시'], ['광주시', '광주광역시'], ['광주광역시', '광주광역시'],
    ['대전', '대전광역시'], ['대전시', '대전광역시'], ['대전광역시', '대전광역시'],
    ['울산', '울산광역시'], ['울산시', '울산광역시'], ['울산광역시', '울산광역시'],
    ['세종', '세종특별자치시'], ['세종시', '세종특별자치시'], ['세종특별자치시', '세종특별자치시'],
    ['경기', '경기도'], ['경기도', '경기도'],
    ['강원', '강원특별자치도'], ['강원도', '강원특별자치도'], ['강원특별자치도', '강원특별자치도'],
    ['충북', '충청북도'], ['충청북도', '충청북도'],
    ['충남', '충청남도'], ['충청남도', '충청남도'],
    ['전북', '전북특별자치도'], ['전라북도', '전북특별자치도'], ['전북특별자치도', '전북특별자치도'],
    ['전남', '전라남도'], ['전라남도', '전라남도'],
    ['경북', '경상북도'], ['경상북도', '경상북도'],
    ['경남', '경상남도'], ['경상남도', '경상남도'],
    ['제주', '제주특별자치도'], ['제주도', '제주특별자치도'], ['제주특별자치도', '제주특별자치도']
  ]);

  function festivalRegionLabel(address) {
    const tokens = String(address || '').replace(/[(),]/g, ' ').trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return '지역 정보 확인';
    const province = REGION_ALIASES.get(tokens[0]);
    if (!province) {
      const municipality = tokens.find((token) => /^[가-힣]+(?:시|군|구)$/.test(token));
      return municipality || '지역 정보 확인';
    }
    const municipality = tokens.slice(1).find((token) => /^[가-힣]+(?:시|군|구)$/.test(token));
    return municipality ? `${province} ${municipality}` : province;
  }

  return { festivalRegionLabel };
}));
