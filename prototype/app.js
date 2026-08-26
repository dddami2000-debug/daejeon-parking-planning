const fallbackPlaces = [
  {id:'zero',type:'festival',name:'대전 0시 축제',address:'대전광역시 중구 중앙로 일대',date:'축제',startDate:'2026-08-21',endDate:'2026-08-28',period:'8.21 — 8.28',hours:'14:00 — 00:00',distance:2.4,eta:12,taste:94,emoji:'🎆',imageUrl:'https://www.daejeon.go.kr/plugins/crosseditor4/binary/images/000396/20250822142519537_QFJ4O0PY.jpg',color:'#ff7657',tile:'#fff0eb',lat:36.3298,lng:127.4307,summary:'대전의 한여름 밤을 거대한 무대로 바꾸는, 도심 한복판의 대표 축제예요.',reason:'도심 한복판에서 열리는 대표 여름 축제예요',gradient:'linear-gradient(135deg,#ff7657,#ed4e7a)'},
  {id:'science',type:'festival',name:'대전 사이언스 페스티벌',address:'대전광역시 유성구 엑스포로 일대',date:'축제',startDate:'2026-09-02',endDate:'2026-09-05',period:'9.02 — 9.05',hours:'10:00 — 20:00',distance:3.1,eta:16,taste:88,emoji:'🚀',imageUrl:'https://www.daejeon.go.kr/plugins/crosseditor4/binary/images/000326/20241016174536107_AEQ50TLH.png',color:'#8d72e1',tile:'#f0edff',lat:36.3746,lng:127.3869,summary:'과학도시 대전의 상상력을 직접 만지고 즐기는 대표 체험 축제예요.',reason:'가족·체험 취향에 잘 맞아요',gradient:'linear-gradient(135deg,#8d72e1,#5f78e9)'},
  {id:'wine',type:'festival',name:'대전 국제 와인 EXPO',address:'대전광역시 유성구 엑스포로 일대',date:'축제',startDate:'2026-09-11',endDate:'2026-09-13',period:'9.11 — 9.13',hours:'11:00 — 21:00',distance:4.2,eta:19,taste:84,emoji:'🍇',imageUrl:'https://www.djwinefair.com/images/korean/new_202208/main/msection02/mp_tab04/mp_tab04_img02.JPG',color:'#a64f72',tile:'#faeaf1',lat:36.3741,lng:127.3860,summary:'와인과 미식, 음악이 한자리에 모이는 대전의 특별한 가을 미식 축제예요.',reason:'감성·데이트 취향에 잘 맞아요',gradient:'linear-gradient(135deg,#a64f72,#e58580)'}
];

const curatedExperiences = [
  {
    match:['0시 축제'],venue:'중앙로·은행동 일대',admission:'무료 프로그램 중심',audience:'친구 · 연인 · 가족',
    highlights:[
      {icon:'🎤',title:'도심 한복판 라이브',description:'중앙로 곳곳의 무대와 거리 공연을 따라 걸으며 축제 분위기를 즐겨요.'},
      {icon:'🎭',title:'퍼레이드 구경',description:'시간대별 행렬과 퍼포먼스를 가까이서 보고 사진도 남겨보세요.'},
      {icon:'🍢',title:'야시장 한 바퀴',description:'은행동 먹거리와 축제 부스를 함께 둘러보며 늦은 밤까지 즐겨요.'}
    ],
    tip:'저녁에는 중앙로 주변이 붐빌 수 있어요. 보고 싶은 공연 시간을 먼저 확인하고 대중교통이나 외곽 주차장을 이용하면 편해요.'
  },
  {
    match:['사이언스','과학축제'],venue:'대전컨벤션센터·엑스포과학공원 일대',admission:'무료·유료 체험 혼합',audience:'가족 · 학생 · 과학 팬',
    highlights:[
      {icon:'🤖',title:'로봇·AI 체험',description:'직접 조작하고 결과를 확인하는 참여형 과학 프로그램을 골라 즐겨요.'},
      {icon:'🚀',title:'우주 테마 탐험',description:'전시와 체험 부스를 돌며 우주와 미래 기술 이야기를 만나보세요.'},
      {icon:'🧪',title:'과학 실험 미션',description:'가족이나 친구와 함께 짧게 참여할 수 있는 실험 프로그램에 도전해요.'}
    ],
    tip:'인기 체험은 현장 접수가 일찍 마감될 수 있어요. 방문 전 공식 시간표와 사전 예약 여부를 확인해 주세요.'
  },
  {
    match:['와인','Wine'],venue:'대전컨벤션센터 일대',admission:'프로그램별 이용권 확인',audience:'연인 · 친구 · 미식가',
    highlights:[
      {icon:'🍷',title:'국내외 와인 시음',description:'여러 산지와 품종을 비교하며 내 취향의 와인을 발견해 보세요.'},
      {icon:'🧀',title:'푸드 페어링',description:'와인과 어울리는 음식 부스를 함께 둘러보며 조합을 즐겨요.'},
      {icon:'🎼',title:'공연과 클래스',description:'문화 공연과 소믈리에 프로그램을 일정에 맞춰 골라보세요.'}
    ],
    tip:'시음 프로그램을 이용한다면 차량 운전은 피하고 대중교통을 이용해 주세요. 세부 일정과 이용권은 공식 안내를 확인해 주세요.',
    officialUrl:'https://djwinefair.com/'
  }
];

const compactPlaceLabels = [
  {match:['0시 축제'],category:'야간축제',area:'대전광역시 중구 은행동'},
  {match:['사이언스 페스티벌','과학축제'],category:'과학축제',area:'대전광역시 유성구 도룡동'},
  {match:['와인 EXPO','와인엑스포'],category:'와인축제',area:'대전광역시 유성구 도룡동'}
];

const curatedPlaceValueLines = [
  {match:['0시 축제'],copy:'대전의 한여름 밤을 거대한 무대로 바꾸는 도심 축제'},
  {match:['사이언스 페스티벌','과학축제'],copy:'과학도시 대전의 상상력을 직접 만나는 체험 축제'},
  {match:['와인 EXPO','와인엑스포'],copy:'와인과 미식, 음악을 한자리에서 누리는 가을 축제'}
];

const fallbackParkingTemplates = [
  {name:'중앙로 공영주차장',type:'공영',distance:0.42,drive:4,walk:6,capacity:118,open:'09:00',close:'22:00',base:500,baseMin:30,add:200,addMin:10,reason:'목적지까지 가장 가까워요'},
  {name:'대흥동 제1노상주차장',type:'노상',distance:0.68,drive:6,walk:9,capacity:46,open:'09:00',close:'19:00',base:300,baseMin:30,add:200,addMin:10,reason:'19시 이후 무료라 저녁 방문에 유리해요'},
  {name:'중구청 부설 개방주차장',type:'공공기관',distance:0.91,drive:7,walk:12,capacity:82,open:'18:00',close:'23:30',base:0,baseMin:0,add:0,addMin:10,reason:'선택 시간에 무료로 이용할 수 있어요'},
  {name:'우리들공원 공영주차장',type:'공영',distance:1.18,drive:8,walk:15,capacity:156,open:'08:00',close:'23:00',base:600,baseMin:30,add:300,addMin:10,reason:'주차면이 넉넉한 대안이에요'},
  {name:'선화동 공영주차장',type:'공영',distance:1.34,drive:9,walk:17,capacity:74,open:'08:00',close:'22:00',base:500,baseMin:30,add:250,addMin:10,reason:'행사장 반대편에서 접근하기 좋아요'},
  {name:'대흥동 제2노상주차장',type:'노상',distance:1.42,drive:10,walk:18,capacity:31,open:'09:00',close:'19:00',base:300,baseMin:30,add:200,addMin:10,reason:'짧게 방문할 때 이용하기 좋아요'},
  {name:'은행동 공영주차장',type:'공영',distance:1.56,drive:11,walk:20,capacity:96,open:'08:00',close:'23:00',base:600,baseMin:30,add:300,addMin:10,reason:'주변 상권을 함께 둘러보기 좋아요'}
];

const questions = [
  {key:'companions',q:'누구와 가나요?',description:'함께 가는 사람에게 맞는 장소를 먼저 골라요.',answers:[['혼자','역사·힐링형','solo'],['연인·친구','감성·데이트형','friends'],['가족','가족·체험형','family']]},
  {key:'activity',q:'오늘 원하는 활동은?',description:'성격이 아니라 오늘 실제로 하고 싶은 일을 알려주세요.',answers:[['축제','공연·축제형','festival'],['체험','가족·체험형','experience'],['감성','감성·데이트형','mood'],['휴식','역사·힐링형','rest']]},
  {key:'mobility',q:'이동 범위는 어느 정도가 좋은가요?',description:'가까운 지역을 우선 볼지, 전국의 축제를 함께 볼지 알려주세요.',answers:[['가까운 지역 위주','역사·힐링형','near'],['전국 어디든 괜찮아요','공연·축제형','any']]},
  {key:'venue',q:'실내 행사를 선호하나요?',description:'실내 행사를 우선 볼지 알려주세요.',answers:[['실내 위주','가족·체험형','indoor'],['실내·야외 모두 괜찮아요','','both']]}
];

const tasteTypes = ['공연·축제형','감성·데이트형','가족·체험형','역사·힐링형'];
const ageBands = ['10대','20대','30대','40대','50대','60대 이상'];
const totalSurveySteps = questions.length;
const genderLabels = {male:'남성',female:'여성'};
const tasteMeta = {
  '공연·축제형':{short:'공연·축제',description:'현장의 열기와 음악, 사람들과 함께 즐기는 순간에서 에너지를 얻어요.',tags:['#라이브','#야간축제','#활기찬현장']},
  '감성·데이트형':{short:'감성·데이트',description:'예쁜 풍경과 맛있는 음식, 오래 남길 사진이 있는 나들이를 좋아해요.',tags:['#포토스팟','#미식','#분위기']},
  '가족·체험형':{short:'가족·체험',description:'직접 해보고 배우며, 함께 온 사람과 추억을 만드는 프로그램을 선호해요.',tags:['#체험프로그램','#가족나들이','#새로운경험']},
  '역사·힐링형':{short:'역사·힐링',description:'붐비지 않는 공간에서 자연과 건축, 이야기를 천천히 만나는 것을 좋아해요.',tags:['#산책','#문화공간','#조용한휴식']}
};
const curatedTasteAffinities = {
  zero:{'공연·축제형':98,'감성·데이트형':70,'가족·체험형':68,'역사·힐링형':28},
  science:{'공연·축제형':72,'감성·데이트형':58,'가족·체험형':98,'역사·힐링형':52},
  wine:{'공연·축제형':72,'감성·데이트형':97,'가족·체험형':42,'역사·힐링형':55}
};
const tasteKeywords = {
  '공연·축제형':['공연','음악','콘서트','퍼레이드','야시장','댄스','불꽃','무대','페스티벌','축제'],
  '감성·데이트형':['야경','노을','사진','포토','감성','데이트','와인','미식','카페','꽃','빛','전망'],
  '가족·체험형':['체험','가족','어린이','과학','로봇','우주','교육','놀이','키즈','만들기','ai'],
  '역사·힐링형':['역사','문화재','자연','산책','공원','수목원','전시','박물관','힐링','건축','생태']
};
const curatedAgeSuitability = {
  zero:{'10대':95,'20대':95,'30대':95,'40대':95,'50대':95,'60대 이상':95},
  science:{'10대':100,'20대':90,'30대':90,'40대':90,'50대':88,'60대 이상':85},
  wine:{'10대':30,'20대':95,'30대':95,'40대':95,'50대':95,'60대 이상':95}
};

let places = [...fallbackPlaces];
let parkingTemplates = fallbackParkingTemplates.map((parking,index)=>({
  ...parking,
  id:`demo-parking-${index}`,
  free:parking.base===0&&parking.add===0,
  unknownFee:false,
  scheduleVerified:true,
  feeVerified:true,
  availabilityKnown:false,
  updatedAt:'2026-08-25T00:00:00+09:00',
  dataStatus:'demo'
}));
const $ = selector => document.querySelector(selector);
let activePlace = places[0];
let questionIndex = -1;
let answers = [];
let visitConditions = {companions:null,activity:null,mobility:null,venue:null};
let demographicAnswers = {gender:null,ageBand:null};
let excludedParkings = [];
let pendingParking = null;
let pendingFestivalDestination = null;
let festivalTravelMode = null;
let festivalTravelStage = 'provider';
let festivalTravelLastTrigger = null;
let navigationConfigPromise = null;
let naverMap = null;
let placeMarkers = [];
let currentLocationMarker = null;
let userPosition = null;
let currentLocationRequestPending = false;
let isPlaceFocused = false;
let rankingFilter = 'popular';
let showFavoritePinsOnly = false;
let activeMapTopicFilter = null;
let parkingPriority = 'distance';
let festivalDateFilter = {start:null,end:null};
const overviewPosition = {lat:36.3515,lng:127.4050,zoom:13};
let previousMapView = {...overviewPosition};
let placeSourceAttribution = '';
let parkingSourceAttribution = '';
let placeDataState = 'loading';
let parkingDataState = 'demo';
let placeDataUpdatedAt = null;
let parkingDataUpdatedAt = null;
let parkingWeather = null;
let parkingRequestSequence = 0;
const parkingCache = new Map();
const drivingRouteCache = new Map();
let drivingRouteRequestSequence = 0;
let placeSheetDrag = null;
let placeSheetTopPull = null;
let suppressPlaceSheetGestureClick = false;
let plannerSheetDrag = null;
let suppressPlannerSheetGestureClick = false;
let plannerDismissTimer = null;
let recommendSheetDrag = null;
let recommendSheetTopPull = null;
let suppressRecommendSheetGestureClick = false;
let recommendGestureClickTimer = null;
let festivalAutoplayTimer = null;
let festivalAutoplayResumeTimer = null;
let festivalAutoplayDirection = 1;
let favoriteVisualRefreshFrame = null;
let recommendationRefreshTimer = null;
let recommendationLastRefreshedAt = 0;
let recommendationScoreCache = new Map();
let recommendationBehaviorCache = new Map();
let tasteProfile = readTasteProfile();
const FESTIVAL_PREFERENCE_KEY = 'daejeonMap.festivalPreferences.v1';
const festivalRecommender = window.FestivalRecommender || null;
let festivalPreferences = readFestivalPreferences();
const GESTURE_VELOCITY_THRESHOLD = .11;
const FESTIVAL_AUTOPLAY_INTERVAL_MS = 5000;
const FESTIVAL_AUTOPLAY_RESUME_MS = 10000;
const RECOMMENDATION_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const festivalMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
function gestureVelocity(distance,startTime){return distance/Math.max(1,performance.now()-startTime);}
function dampGestureValue(value,min,max){
  if(value<min)return min-(min-value)*.18;
  if(value>max)return max+(value-max)*.18;
  return value;
}
function emptyTasteScores(){return Object.fromEntries(tasteTypes.map(type=>[type,0]));}
function validTasteScores(scores){
  if(!scores||tasteTypes.some(type=>!Number.isFinite(Number(scores[type]))))return false;
  return Math.abs(tasteTypes.reduce((sum,type)=>sum+Number(scores[type]),0)-100)<=1;
}
function validTasteAffinities(scores){
  return Boolean(scores)&&tasteTypes.every(type=>Number.isFinite(Number(scores[type]))&&Number(scores[type])>=0&&Number(scores[type])<=100);
}
function readTasteProfile(){
  try{
    const saved=JSON.parse(localStorage.getItem('daejeonMap.personalityProfile'));
    if(tasteTypes.includes(saved?.primary)&&validTasteScores(saved.scores)){
      if(saved.conditions){
        visitConditions={...visitConditions,...saved.conditions};
        if(visitConditions.mobility==='indoor'){
          visitConditions.mobility='any';
          visitConditions.venue='indoor';
        }
      }
      return saved;
    }
  }catch{ /* 이전 버전의 저장값은 아래에서 변환한다. */ }
  const legacy=localStorage.getItem('daejeonMap.personalityResult');
  if(!tasteTypes.includes(legacy))return null;
  const scores=emptyTasteScores();scores[legacy]=100;
  return {version:1,primary:legacy,scores,counts:null};
}
function calculateTasteProfile(selectedAnswers,demographics={}){
  const counts=emptyTasteScores();
  selectedAnswers.forEach(type=>{if(type in counts)counts[type]++;});
  const total=Math.max(1,selectedAnswers.length);
  const scores=Object.fromEntries(tasteTypes.map(type=>[type,Math.round(counts[type]/total*100)]));
  const activityPrimary={festival:'공연·축제형',experience:'가족·체험형',mood:'감성·데이트형',rest:'역사·힐링형'}[visitConditions.activity];
  const highest=Math.max(...tasteTypes.map(type=>counts[type]));
  const tied=tasteTypes.filter(type=>counts[type]===highest);
  const primary=activityPrimary||tied[0]||'공연·축제형';
  return {
    version:4,
    primary,
    scores,
    counts,
    conditions:{...visitConditions},
    demographics:{gender:null,ageBand:null},
    completedAt:new Date().toISOString()
  };
}
function tasteAffinitiesFor(place){
  if(curatedTasteAffinities[place.id])return curatedTasteAffinities[place.id];
  if(validTasteAffinities(place.metadata?.taste_affinities))return place.metadata.taste_affinities;
  const base=place.type==='festival'
    ? {'공연·축제형':62,'감성·데이트형':58,'가족·체험형':58,'역사·힐링형':48}
    : {'공연·축제형':40,'감성·데이트형':60,'가족·체험형':58,'역사·힐링형':65};
  const text=[place.name,place.summary,place.description,place.metadata?.place_name,JSON.stringify(place.metadata||{})].join(' ').toLowerCase();
  tasteTypes.forEach(type=>{
    const matches=tasteKeywords[type].filter(keyword=>text.includes(keyword)).length;
    base[type]=Math.min(98,base[type]+matches*9);
  });
  return base;
}
function tasteMatchFor(place,profile=tasteProfile){
  if(!profile||!validTasteScores(profile.scores))return null;
  const affinities=tasteAffinitiesFor(place);
  return Math.round(tasteTypes.reduce((score,type)=>score+(profile.scores[type]/100)*affinities[type],0));
}
function readFestivalPreferences(){
  if(!festivalRecommender)return {};
  try{return festivalRecommender.normalizeHistory(JSON.parse(localStorage.getItem(FESTIVAL_PREFERENCE_KEY)||'{}'));}
  catch{return {};}
}
function persistFestivalPreferences(){
  try{localStorage.setItem(FESTIVAL_PREFERENCE_KEY,JSON.stringify(festivalPreferences));}catch{/* 저장 공간이 없어도 기본 추천은 유지한다. */}
}
function festivalTopicSourceFor(place){
  const content=place.metadata?.festival_content||{};
  const experience=experienceFor(place);
  const programs=[
    content.official_program,
    ...(experience.highlights||[]).flatMap(item=>[item.title,item.description])
  ].filter(Boolean).join(' ');
  return {
    id:place.id,
    type:place.type,
    name:place.name,
    category:compactPlaceCategory(place),
    area:compactPlaceArea(place),
    summary:[place.summary,place.description,placeValueLine(place),content.summary].filter(Boolean).join(' '),
    officialOverview:content.official_overview||'',
    programs,
    audience:experience.audience||''
  };
}
function festivalTopicTagsFor(place,topicSource=festivalTopicSourceFor(place)){
  if(!festivalRecommender||place?.type!=='festival')return [];
  return festivalRecommender.topicTagLabels(topicSource,3);
}
function behaviorPlaceFor(place){
  const topicSource=festivalTopicSourceFor(place);
  const explicitAffinities=curatedTasteAffinities[place.id]||(validTasteAffinities(place.metadata?.taste_affinities)?place.metadata.taste_affinities:{});
  return {
    ...topicSource,
    tags:festivalTopicTagsFor(place,topicSource),
    affinities:explicitAffinities,
    lat:Number(place.lat),
    lng:Number(place.lng)
  };
}
// 같은 주제 + 같은 광역지역 축제가 3개 이상 연달아 나오지 않도록 상위 후보에서
// 대체 후보를 끌어올린다. 원점수 순서를 크게 훼손하지 않게 탐색 범위는 제한된다.
// 즐겨찾기 목록과 마감순위는 사용자가 기대하는 정렬이 따로 있어 적용하지 않는다.
function diversifiedRecommendations(ordered){
  if(!festivalRecommender)return ordered;
  const keys=new Map(ordered.map(place=>[place.id,festivalRecommender.recommendationGroupKey(behaviorPlaceFor(place))]));
  return festivalRecommender.diversifyRecommendations(ordered,{keyOf:place=>keys.get(place.id)??null});
}
// 카드마다 전체 카탈로그를 다시 만들지 않도록 점수 캐시와 같은 주기로 재사용한다.
// 캐시가 비어 있을 때만 직접 계산한다.
function festivalBehaviorFor(place){
  if(!festivalRecommender||place?.type!=='festival')return null;
  if(recommendationBehaviorCache.has(place.id))return recommendationBehaviorCache.get(place.id);
  const catalog=places.filter(item=>item.type==='festival').map(behaviorPlaceFor);
  return festivalRecommender.behaviorAffinity(behaviorPlaceFor(place),catalog,festivalPreferences);
}
function refreshRecommendationScoreCache(){
  const catalog=places.filter(item=>item.type==='festival').map(behaviorPlaceFor);
  const behaviors=new Map();
  recommendationScoreCache=new Map(places.map(place=>{
    const baseScore=baseRecommendationScoreFor(place);
    if(place?.type!=='festival')return [place.id,baseScore];
    const behavior=festivalRecommender?.behaviorAffinity(behaviorPlaceFor(place),catalog,festivalPreferences)??null;
    behaviors.set(place.id,behavior);
    return [place.id,festivalRecommender?.combineScore(baseScore,behavior)??baseScore];
  }));
  // 정렬 점수와 화면 문구가 같은 계산 결과를 보도록 함께 갱신한다.
  recommendationBehaviorCache=behaviors;
  recommendationLastRefreshedAt=Date.now();
}
function refreshFestivalRecommendations(){
  refreshRecommendationScoreCache();
  renderFestivals();
  renderRankings();
}
function startRecommendationRefreshSchedule(){
  window.clearInterval(recommendationRefreshTimer);
  recommendationRefreshTimer=window.setInterval(()=>{
    if(!document.hidden)refreshFestivalRecommendations();
  },RECOMMENDATION_REFRESH_INTERVAL_MS);
}
function isFestivalFavorite(placeId){return Boolean(festivalRecommender?.isFavorite(festivalPreferences,placeId));}
function hasFestivalPreferenceHistory(){return Boolean(festivalRecommender?.hasHistory(festivalPreferences));}
function favoriteFestivalCount(){return places.filter(place=>place.type==='festival'&&isFestivalFavorite(place.id)).length;}
function recordFestivalView(place){
  if(!festivalRecommender||place?.type!=='festival')return;
  const previous=JSON.stringify(festivalPreferences);
  festivalPreferences=festivalRecommender.recordView(festivalPreferences,place.id);
  if(JSON.stringify(festivalPreferences)===previous)return;
  persistFestivalPreferences();
}
function syncFavoriteButtons(){
  document.querySelectorAll('[data-favorite]').forEach(button=>{
    const active=isFestivalFavorite(button.dataset.favorite);
    const place=places.find(item=>item.id===button.dataset.favorite);
    button.classList.toggle('is-favorite',active);
    button.setAttribute('aria-pressed',String(active));
    button.setAttribute('aria-label',`${place?.name||'축제'} 즐겨찾기 ${active?'해제':'추가'}`);
    button.setAttribute('title',active?'즐겨찾기 해제':'즐겨찾기 추가');
  });
}
function toggleFestivalFavorite(placeId){
  const place=places.find(item=>item.id===placeId);
  if(!festivalRecommender||place?.type!=='festival')return;
  const nextFavorite=!isFestivalFavorite(placeId);
  festivalPreferences=festivalRecommender.setFavorite(festivalPreferences,placeId,nextFavorite);
  persistFestivalPreferences();
  syncFavoriteButtons();
  updateFavoriteMapButton();
  toast(nextFavorite?`즐겨찾기에 저장했어요: ${place.name}`:`즐겨찾기에서 해제했어요: ${place.name}`);
  scheduleFavoriteVisualRefresh();
}
function favoriteButtonMarkup(place,extraClass=''){
  const active=isFestivalFavorite(place.id);
  return `<button class="festival-favorite-button ${extraClass}${active?' is-favorite':''}" type="button" data-favorite="${escapeHtml(place.id)}" aria-label="${escapeHtml(`${place.name} 즐겨찾기 ${active?'해제':'추가'}`)}" aria-pressed="${active}" title="${active?'즐겨찾기 해제':'즐겨찾기 추가'}"><span aria-hidden="true">★</span></button>`;
}
function bindFavoriteButtons(root=document){
  root.querySelectorAll('[data-favorite]').forEach(button=>button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    toggleFestivalFavorite(button.dataset.favorite);
  }));
}
function scheduleFavoriteVisualRefresh(){
  if(favoriteVisualRefreshFrame!==null)window.cancelAnimationFrame(favoriteVisualRefreshFrame);
  favoriteVisualRefreshFrame=window.requestAnimationFrame(()=>{
    favoriteVisualRefreshFrame=window.requestAnimationFrame(()=>{
      favoriteVisualRefreshFrame=null;
      if(rankingFilter==='favorites')renderRankings();
      renderMap();
    });
  });
}
function stopFestivalAutoplay(){
  window.clearTimeout(festivalAutoplayTimer);
  festivalAutoplayTimer=null;
}
function stopFestivalAutoplayResume(){
  window.clearTimeout(festivalAutoplayResumeTimer);
  festivalAutoplayResumeTimer=null;
}
function festivalAutoplayAllowed(){
  const slider=$('#festivalSlider');
  return Boolean(
    slider
    && !festivalMotionPreference.matches
    && document.visibilityState==='visible'
    && !isPlaceFocused
    && recommendationState()!=='collapsed'
    && !slider.matches(':hover')
    && !slider.contains(document.activeElement)
    && slider.querySelectorAll('.festival-card').length>1
  );
}
function advanceFestivalSlider(){
  const slider=$('#festivalSlider');
  const cards=[...slider.querySelectorAll('.festival-card')];
  if(cards.length<2)return;
  const origin=cards[0].offsetLeft;
  const positions=cards.map(card=>card.offsetLeft-origin);
  const current=positions.reduce((best,position,index)=>Math.abs(position-slider.scrollLeft)<Math.abs(positions[best]-slider.scrollLeft)?index:best,0);
  let next=current+festivalAutoplayDirection;
  if(next>=cards.length){festivalAutoplayDirection=-1;next=Math.max(0,cards.length-2);}
  if(next<0){festivalAutoplayDirection=1;next=Math.min(1,cards.length-1);}
  slider.scrollTo({left:positions[next],behavior:'smooth'});
}
function scheduleFestivalAutoplay(delay=FESTIVAL_AUTOPLAY_INTERVAL_MS){
  stopFestivalAutoplay();
  if(!festivalAutoplayAllowed())return;
  festivalAutoplayTimer=window.setTimeout(()=>{
    advanceFestivalSlider();
    scheduleFestivalAutoplay();
  },delay);
}
function restartFestivalAutoplay(){
  stopFestivalAutoplay();
  stopFestivalAutoplayResume();
  scheduleFestivalAutoplay();
}
function deferFestivalAutoplay(delay=FESTIVAL_AUTOPLAY_RESUME_MS){
  stopFestivalAutoplay();
  stopFestivalAutoplayResume();
  if(festivalMotionPreference.matches)return;
  festivalAutoplayResumeTimer=window.setTimeout(()=>scheduleFestivalAutoplay(),delay);
}
function updateFavoriteMapButton(){
  const button=$('#favoriteMapButton');
  if(!button)return;
  const count=favoriteFestivalCount();
  button.classList.toggle('is-active',showFavoritePinsOnly);
  button.setAttribute('aria-pressed',String(showFavoritePinsOnly));
  button.setAttribute('aria-label',showFavoritePinsOnly?'전체 축제 핀 보기':`즐겨찾기 축제 핀만 보기, ${count}개 저장됨`);
  button.setAttribute('title',showFavoritePinsOnly?'전체 축제 핀 보기':'즐겨찾기 핀만 보기');
  const badge=$('#favoriteMapCount');
  if(badge){badge.textContent=String(count);badge.hidden=count===0;}
  document.querySelectorAll('[data-map-topic]').forEach(topicButton=>{
    const active=topicButton.dataset.mapTopic===activeMapTopicFilter;
    topicButton.classList.toggle('is-active',active);
    topicButton.setAttribute('aria-pressed',String(active));
  });
}
function toggleFavoriteMapFilter(){
  showFavoritePinsOnly=!showFavoritePinsOnly;
  if(showFavoritePinsOnly)activeMapTopicFilter=null;
  updateFavoriteMapButton();
  renderMap();
  const count=favoriteFestivalCount();
  toast(showFavoritePinsOnly?(count?`즐겨찾기한 축제 ${count}곳만 지도에 표시해요.`:'아직 즐겨찾기한 축제가 없어요.'):'전체 축제 핀을 표시해요.');
}
function toggleMapTopicFilter(topic){
  activeMapTopicFilter=activeMapTopicFilter===topic?null:topic;
  showFavoritePinsOnly=false;
  updateFavoriteMapButton();
  renderMap();
  if(!activeMapTopicFilter){toast('전체 축제 핀을 표시해요.');return;}
  const count=places.filter(place=>place.type==='festival'&&hasCoordinates(place)&&festivalVisibleOnMap(place)&&festivalRecommender?.matchesTopicQuery(behaviorPlaceFor(place),activeMapTopicFilter)).length;
  toast(count?`${activeMapTopicFilter} 관련 축제 ${count}곳을 표시해요.`:`${activeMapTopicFilter} 관련 축제를 찾지 못했어요.`);
}
function todayValueInKorea(){return window.FestivalTiming?.todayInKorea()||new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});}
function todayInKorea(){return Date.parse(`${todayValueInKorea()}T00:00:00+09:00`);}
// 여행 날짜를 고르면 '오늘'이 아니라 선택한 기간을 기준으로 일정 점수를 낸다.
// 날짜를 고르지 않으면 비교 창이 '오늘 하루'가 되어 기존 동작을 그대로 유지한다.
function festivalTimingScore(place,options=festivalDateStatusOptions()){
  if(place?.type!=='festival')return 70;
  return festivalRecommender?.scheduleScore(place,{today:todayValueInKorea(),...options})??60;
}
function koreaDateTime(value,endOfDay=false){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return NaN;
  return Date.parse(`${value}T${endOfDay?'23:59:59':'00:00:00'}+09:00`);
}
function activeFestivalDateRange(){
  const startValue=festivalDateFilter.start||festivalDateFilter.end;
  const endValue=festivalDateFilter.end||festivalDateFilter.start;
  if(!startValue||!endValue)return null;
  const first=Math.min(koreaDateTime(startValue),koreaDateTime(endValue));
  const last=Math.max(koreaDateTime(startValue,true),koreaDateTime(endValue,true));
  if(!Number.isFinite(first)||!Number.isFinite(last))return null;
  return {start:first,end:last,startValue:startValue<=endValue?startValue:endValue,endValue:startValue<=endValue?endValue:startValue};
}
function festivalMatchesDateFilter(place,range=activeFestivalDateRange()){
  if(place.type!=='festival'||festivalTimingScore(place,festivalDateStatusOptions(range))<=0)return false;
  if(!range)return true;
  const festivalStart=koreaDateTime(place.startDate);
  const festivalEnd=koreaDateTime(place.endDate,true);
  if(!Number.isFinite(festivalStart)||!Number.isFinite(festivalEnd))return false;
  return festivalStart<=range.end&&festivalEnd>=range.start;
}
function filteredFestivals(){return places.filter(place=>festivalMatchesDateFilter(place));}
function festivalDateStatusOptions(range=activeFestivalDateRange()){
  return {rangeStart:range?.startValue||null,rangeEnd:range?.endValue||null};
}
function festivalMapDateStatus(place,options=festivalDateStatusOptions()){
  return window.FestivalTiming?.festivalDateStatus(place,options)||'unknown';
}
// The map keeps upcoming festivals as muted pins, so it deliberately shows more
// than the ranking list: only festivals already over for the chosen window drop out.
function festivalVisibleOnMap(place,options=festivalDateStatusOptions()){
  return place.type==='festival'&&festivalMapDateStatus(place,options)!=='ended';
}
function festivalDateStatusLabel(status){
  return status==='active'?'진행 중':status==='upcoming'?'예정':'일정 확인 필요';
}
function shortKoreanDate(value){
  const [,month,day]=String(value||'').split('-');
  return month&&day?`${Number(month)}.${Number(day)}`:'';
}
function festivalFilterLabel(count){
  const range=activeFestivalDateRange();
  if(!range)return `전체 일정 · ${count}개`;
  const dateLabel=range.startValue===range.endValue?shortKoreanDate(range.startValue):`${shortKoreanDate(range.startValue)}–${shortKoreanDate(range.endValue)}`;
  return `${dateLabel} · ${count}개`;
}
function festivalDeadlineValue(place){
  const end=koreaDateTime(place.endDate,true);
  return Number.isFinite(end)?end:Number.POSITIVE_INFINITY;
}
function festivalDeadlineLabel(place){
  const end=festivalDeadlineValue(place);
  if(!Number.isFinite(end))return '마감일 확인';
  const endDate=koreaDateTime(place.endDate);
  const days=Math.max(0,Math.ceil((endDate-todayInKorea())/86400000));
  if(days===0)return '오늘 종료';
  return `종료까지 D-${days}`;
}
function festivalDeadlineCardLabel(place){
  const countdown=festivalCountdownLabel(place);
  const deadline=festivalDeadlineLabel(place);
  if(countdown.startsWith('시작까지 ')&&deadline.startsWith('종료까지 ')){
    return `${countdown} · ${deadline}`;
  }
  if(countdown.startsWith('종료까지 '))return `진행 중 · ${deadline}`;
  return deadline;
}
function festivalScheduleLabel(place){
  const start=shortKoreanDate(place?.startDate);
  const end=shortKoreanDate(place?.endDate);
  if(start&&end)return `${start} ~ ${end}`;
  if(start)return start;
  if(end)return end;
  return '일정 확인';
}
// 전국 축제를 다루므로 20km 밖을 전부 0점으로 만들지 않는다.
// 실제 구간형 곡선은 festival-recommender.js의 distanceScore가 갖는다.
function distanceRecommendationScore(place){
  return festivalRecommender?.distanceScore(Number(place?.distance))??50;
}
function audienceTextFor(place){
  return [place.name,place.summary,place.description,experienceFor(place).audience,JSON.stringify(place.metadata||{})].join(' ').toLowerCase();
}
function ageSuitabilityFor(place,profile=tasteProfile){
  const ageBand=profile?.demographics?.ageBand;
  if(!ageBands.includes(ageBand))return null;
  if(curatedAgeSuitability[place.id])return curatedAgeSuitability[place.id][ageBand];
  const text=audienceTextFor(place);
  if(['성인 전용','19세 이상','주류','와인 시음','맥주','칵테일'].some(keyword=>text.includes(keyword)))return ageBand==='10대'?30:95;
  if(['어린이','청소년','학생','키즈'].some(keyword=>text.includes(keyword)))return ageBand==='10대'?100:85;
  return null;
}
function genderSuitabilityFor(place,profile=tasteProfile){
  const gender=profile?.demographics?.gender;
  if(!Object.hasOwn(genderLabels,gender))return null;
  const text=audienceTextFor(place);
  const femaleTarget=['여성 전용','여성 대상','여성만'].some(keyword=>text.includes(keyword));
  const maleTarget=['남성 전용','남성 대상','남성만'].some(keyword=>text.includes(keyword));
  if(!femaleTarget&&!maleTarget)return null;
  return (femaleTarget&&gender==='female')||(maleTarget&&gender==='male')?100:30;
}
// 가중치(취향 60 / 거리 25 / 일정 15)는 festival-recommender.js의
// RECOMMENDATION_WEIGHTS에 상수로 두었다. 초기 MVP 가설값이다.
function baseRecommendationScoreFor(place){
  const signals={
    taste:tasteMatchFor(place),
    distance:distanceRecommendationScore(place),
    schedule:festivalTimingScore(place)
  };
  if(festivalRecommender)return festivalRecommender.baseScore(signals);
  const values=Object.values(signals).filter(value=>Number.isFinite(value));
  return values.length?Math.round(values.reduce((sum,value)=>sum+value,0)/values.length):0;
}
function recommendationScoreFor(place){
  if(recommendationScoreCache.has(place?.id))return recommendationScoreCache.get(place.id);
  const baseScore=baseRecommendationScoreFor(place);
  if(place?.type!=='festival')return baseScore;
  return festivalRecommender?.combineScore(baseScore,festivalBehaviorFor(place))??baseScore;
}
// 숫자 추천 점수는 내부 정렬에만 쓰고, 화면에는 왜 추천했는지 설명하는 문구만 보여준다.
function recommendationFitLabel(place){
  return festivalRecommender?.recommendationFitCopy({
    tasteScore:tasteMatchFor(place),
    scheduleScore:festivalTimingScore(place),
    behavior:festivalBehaviorFor(place),
    tripSelected:Boolean(activeFestivalDateRange())
  })??'방문 조건에 맞아요';
}
function recommendationSignalsFor(place){
  const signals=[];
  const behavior=festivalBehaviorFor(place);
  const reference=behavior&&places.find(item=>item.id===behavior.referenceId);
  if(reference)signals.push(behavior.referenceFavorite?`★ 즐겨찾기한 ${reference.name}과 취향이 비슷해요`:`✓ 자주 본 ${reference.name} 취향을 반영했어요`);
  if(place.type==='festival'){
    const schedule=festivalTimingScore(place);
    const tripSelected=Boolean(activeFestivalDateRange());
    signals.push(schedule>=100
      ?(tripSelected?'✓ 여행 기간에 열리는 행사':'✓ 지금 열리고 있는 행사')
      :schedule>=90?'✓ 곧 시작하는 행사':'✓ 일정이 확인된 행사');
  }
  if(userPosition&&Number.isFinite(Number(place.distance)))signals.push('✓ 현재 위치와의 거리를 반영했어요');
  const activityLabels={festival:'축제',experience:'체험',mood:'감성',rest:'휴식'};
  if(visitConditions.activity)signals.push(`✓ ${activityLabels[visitConditions.activity]} 활동 조건과 일치`);
  if(visitConditions.mobility==='near'&&Number(place.distance)>3)signals.push('△ 가까운 곳을 원한다면 이동 거리를 확인하세요');
  if(visitConditions.venue==='indoor'&&!/실내|전시|박물관|컨벤션|과학/.test(audienceTextFor(place)))signals.push('△ 야외 일정이 포함될 수 있어요');
  return signals.slice(0,4);
}
function recommendationReasonFor(place){
  return recommendationSignalsFor(place).join(' · ')||'✓ 일정과 이동 거리를 확인한 추천이에요.';
}
function applyTasteProfileUI(){
  if(!tasteProfile)return;
  $('#profileLabel').textContent='방문 조건';
  $('#retestButton').setAttribute('title','방문 조건 다시 설정');
  $('#recommendTitle').textContent='나를 위한 추천 축제';
}
function hasCoordinates(place){return Number.isFinite(Number(place?.lat))&&Number.isFinite(Number(place?.lng));}
function hasNaverMapApi(){return Boolean(window.naver?.maps?.Map&&window.naver?.maps?.LatLng&&window.naver?.maps?.Marker);}
function haversineDistance(lat1,lng1,lat2,lng2){
  const radians=value=>value*Math.PI/180;
  const dLat=radians(lat2-lat1),dLng=radians(lng2-lng1);
  const a=Math.sin(dLat/2)**2+Math.cos(radians(lat1))*Math.cos(radians(lat2))*Math.sin(dLng/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function festivalDateBadge(place){
  if(place.type!=='festival')return place.date||'오늘 추천';
  const start=place.startDate&&Date.parse(`${place.startDate}T00:00:00+09:00`);
  const end=place.endDate&&Date.parse(`${place.endDate}T00:00:00+09:00`);
  if(!Number.isFinite(start)||!Number.isFinite(end))return place.date||'축제 일정 확인';
  const todayLabel=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});
  const today=Date.parse(`${todayLabel}T00:00:00+09:00`);
  const day=Math.ceil((start-today)/86400000);
  if(day>0)return `시작까지 D-${day}`;
  if(today<=end){
    const remaining=Math.max(0,Math.ceil((end-today)/86400000));
    return remaining===0?'오늘 종료':`진행 중 · 종료까지 D-${remaining}`;
  }
  return '종료된 축제';
}
function searchResultMetaMarkup(place){
  const timing=festivalDateBadge(place);
  const area=compactPlaceArea(place);
  let status='일정';
  let countdown=timing;
  let tone='neutral';
  if(timing.startsWith('진행 중 · ')){
    status='진행 중';
    countdown=timing.replace('진행 중 · ','');
    tone='ongoing';
  }else if(timing.startsWith('시작까지 ')){
    status='시작 전';
    tone='upcoming';
  }else if(timing==='오늘 종료'){
    status='진행 중';
    tone='ongoing';
  }else if(timing==='종료된 축제'){
    status='종료됨';
    tone='ended';
  }
  return `<small class="search-result-meta"><span class="search-result-status is-${tone}">${escapeHtml(status)}</span><i aria-hidden="true">·</i><span class="search-result-countdown">${escapeHtml(countdown)}</span><i aria-hidden="true">·</i><span class="search-result-area">${escapeHtml(area)}</span></small>`;
}
function markerVisual(place){
  const fallback=`<span class="marker-fallback">${escapeHtml(place.emoji)}</span>`;
  if(!place.imageUrl)return fallback;
  return `<img src="${escapeHtml(place.imageUrl)}" alt="" loading="lazy" onerror="this.remove()" />${fallback}`;
}
function photoVisual(place){
  const fallback=`<span class="photo-fallback" aria-hidden="true">${escapeHtml(place.emoji)}</span>`;
  if(!place.imageUrl)return fallback;
  return `<img src="${escapeHtml(place.imageUrl)}" alt="${escapeHtml(place.name)} 대표 사진" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()" />${fallback}`;
}
function placeVisual(name){
  const seed=[...String(name)].reduce((sum,char)=>sum+char.charCodeAt(0),0);
  const palettes=[['🎆','#ff7657','#fff0eb','linear-gradient(135deg,#ff7657,#ed4e7a)'],['🎪','#8d72e1','#f0edff','linear-gradient(135deg,#8d72e1,#5f78e9)'],['🎵','#a64f72','#faeaf1','linear-gradient(135deg,#a64f72,#e58580)']];
  const [emoji,color,tile,gradient]=palettes[seed%palettes.length];
  return {emoji,color,tile,gradient};
}
function distanceFromOverview(lat,lng){
  return Number(haversineDistance(overviewPosition.lat,overviewPosition.lng,lat,lng).toFixed(1));
}
function normalizeApiPlace(place){
  const visual=placeVisual(place.name);
  const distance=hasCoordinates(place)?distanceFromOverview(Number(place.lat),Number(place.lng)):null;
  return {...place,...visual,imageUrl:place.imageUrl||place.metadata?.image_url||null,lat:Number(place.lat),lng:Number(place.lng),distance:distance??0,eta:distance===null?0:Math.max(2,Math.round(distance*5))};
}

function updateDistancesFromCurrentLocation(lat,lng){
  places=places.map(place=>{
    if(!hasCoordinates(place))return place;
    const distance=Number(haversineDistance(lat,lng,Number(place.lat),Number(place.lng)).toFixed(1));
    return {...place,distance,eta:Math.max(2,Math.round(distance*5))};
  });
  activePlace=places.find(place=>place.id===activePlace.id)||places[0];
  refreshRecommendationScoreCache();
  renderFestivals();
  renderRankings();
  renderMap();
}

function festivalTagsFor(place,{programs,existingTags}={}){
  return window.FestivalTags?.deriveFestivalTags({
    name:place.name,
    summary:place.summary,
    description:place.description,
    category:compactPlaceCategory(place),
    existingTags,
    programs,
    topicGroups:window.FestivalRecommender?.topicGroups
  })||[];
}

function experienceFor(place){
  const content=place.metadata?.festival_content;
  if(content?.enriched_at){
    const icons=['①','②','③'];
    const programs=Array.isArray(content.programs)?content.programs:[];
    return {
      venue:content.venue||place.metadata?.place_name||place.address||'행사장 정보 확인',
      admission:content.admission||place.metadata?.usage_fee||'공식 데이터에 요금 정보가 없어요',
      audience:content.audience||'친구 · 연인 · 가족',
      tags:festivalTagsFor(place,{programs,existingTags:content.tags}),
      highlights:programs.slice(0,3).map((item,index)=>({icon:icons[index],title:String(item?.title||''),description:String(item?.description||'')})).filter(item=>item.title),
      tip:null,
      contentSource:content
    };
  }
  const curated=curatedExperiences.find(item=>item.match.some(keyword=>String(place.name).toLowerCase().includes(keyword.toLowerCase())));
  if(curated)return {...curated,tags:festivalTagsFor(place,{programs:curated.highlights})};
  return {
    venue:place.metadata?.place_name||place.address||'행사장 정보 확인',
    admission:place.metadata?.usage_fee||'공식 데이터에 요금 정보가 없어요',
    audience:'친구 · 연인 · 가족',
    tags:festivalTagsFor(place,{programs:[]}),
    highlights:[],
    tip:null
  };
}

function compactLabelFor(place){
  const name=String(place?.name||'').replace(/\s+/g,'').toLowerCase();
  return compactPlaceLabels.find(item=>item.match.some(keyword=>name.includes(keyword.replace(/\s+/g,'').toLowerCase())))||null;
}

function compactPlaceCategory(place){
  const curated=compactLabelFor(place);
  if(curated)return curated.category;
  return '지역축제';
}

function festivalCountdownLabel(place){
  return window.FestivalTiming?.festivalCountdownLabel(place)||'일정 확인';
}

function festivalCardCountdown(place){
  const label=festivalCountdownLabel(place);
  if(label.startsWith('시작까지 '))return {label,tone:'upcoming'};
  if(label.startsWith('종료까지 '))return {label:`진행 중 · ${label}`,tone:'ongoing'};
  if(label==='종료됨')return {label:'종료된 축제',tone:'neutral'};
  return {label,tone:['일정 확인','종료일 확인'].includes(label)?'neutral':'upcoming'};
}

function festivalCardCountdownMarkup(countdown){
  return `<span class="compact-festival-countdown is-${countdown.tone}">${escapeHtml(countdown.label)}</span>`;
}

function compactPlaceArea(place){
  const curated=compactLabelFor(place);
  if(curated)return curated.area;
  if(place.region)return String(place.region);
  const address=String(place.address||place.metadata?.address||place.metadata?.road_address||'').trim();
  return window.FestivalRegion?.festivalRegionLabel(address)||'지역 정보 확인';
}

function placeValueLine(place){
  const source=String(place?.summary||'').replace(/\s+/g,' ').trim();
  if(source&&!['대전과 근교에서 즐길 수 있는 지역 축제예요.','축제 상세 정보를 준비하고 있어요.'].includes(source))return source.replace(/[.!?。]+$/,'');
  const name=String(place?.name||'').replace(/\s+/g,'').toLowerCase();
  const curated=curatedPlaceValueLines.find(item=>item.match.some(keyword=>name.includes(keyword.replace(/\s+/g,'').toLowerCase())));
  if(curated)return curated.copy;
  if(source)return source.replace(/[.!?。]+$/,'');
  return '평범한 하루를 여행의 한 장면으로 바꿔 줄 지역 축제';
}

function festivalProgramSourceLabel(place){
  const source=place.metadata?.festival_content?.programs_source;
  if(source==='tourapi')return '공식 API';
  if(source==='openai')return 'AI 요약';
  return '최대 3개';
}

function festivalContentAttribution(place){
  const content=place.metadata?.festival_content;
  if(!content?.enriched_at)return placeSourceAttribution||'공식 출처 확인 필요';
  if(content.summary_source==='openai'||content.programs_source==='openai')return 'TourAPI 우선 · 부족한 내용은 OpenAI 요약';
  return '한국관광공사 TourAPI 상세정보';
}

function dataUpdatedLabel(value){
  if(!value)return '업데이트 시각 확인 필요';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '업데이트 시각 확인 필요';
  return `${new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(date)} 업데이트`;
}
function placeDataNotice(){
  if(placeDataState==='demo')return '<div class="data-status-card warning"><b>샘플 데이터로 둘러보는 중</b><span>최신 공공데이터 연결에 실패했어요. 아래 장소는 화면 체험용이며 출발 전 공식 정보를 확인해 주세요.</span></div>';
  if(placeDataState==='error')return '<div class="data-status-card error"><b>장소 정보를 불러오지 못했어요</b><span>잠시 후 다시 시도해 주세요. 이전 추천을 최신 정보처럼 표시하지 않습니다.</span></div>';
  return '';
}
function placeLoadingMarkup(){
  return '<div class="place-loading" role="status"><div class="loading-orbit" aria-hidden="true"></div><b>대전의 최신 축제 정보를 확인하고 있어요</b><span>운영 일정과 공식 정보를 불러오는 중이에요.</span><div class="loading-skeleton"><i></i><i></i><i></i></div></div>';
}

async function withPreviewFestivalEnrichment(loadedPlaces){
  if(new URLSearchParams(window.location.search).get('enrichmentPreview')!=='true')return loadedPlaces;
  try{
    const response=await fetch('/api/enrich-festivals?limit=1&dryRun=true');
    if(!response.ok)return loadedPlaces;
    const payload=await response.json();
    const result=payload.results?.find(item=>item.ok&&item.preview?.summary);
    if(!result)return loadedPlaces;
    return loadedPlaces.map(place=>place.id===result.id?{
      ...place,
      summary:result.preview.summary,
      hours:result.preview.operatingHours||place.hours,
      metadata:{...place.metadata,festival_content:{
        summary:result.preview.summary,
        summary_source:result.summarySource,
        programs:result.preview.programs||[],
        programs_source:result.programsSource,
        tags:result.preview.tags||[],
        audience:result.preview.audience||null,
        venue:result.preview.venue||null,
        admission:result.preview.admission||null,
        source_urls:result.preview.sourceUrls||[],
        enriched_at:new Date().toISOString()
      }}
    }:place);
  }catch{return loadedPlaces;}
}

async function loadPlaces(){
  try{
    const response=await fetch('/api/places');
    if(!response.ok)throw new Error('places_unavailable');
    const payload=await response.json();
    if(!Array.isArray(payload.places)||!payload.places.length)throw new Error('empty_places');
    places=await withPreviewFestivalEnrichment(payload.places.filter(place=>place.type==='festival').map(normalizeApiPlace));
    if(userPosition)updateDistancesFromCurrentLocation(userPosition.lat,userPosition.lng);
    activePlace=places.find(hasCoordinates)||places[0];
    placeSourceAttribution=payload.sourceAttribution||'';
    placeDataState='live';
    placeDataUpdatedAt=payload.generatedAt||new Date().toISOString();
    refreshRecommendationScoreCache();
    renderFestivals();renderRankings();renderMap();
    toast('대전 공공데이터를 불러왔어요.');
  }catch{
    places=[...fallbackPlaces];
    activePlace=places[0];
    placeDataState='demo';
    placeDataUpdatedAt=null;
    placeSourceAttribution='샘플 데이터 · 공식 운영 정보는 출발 전 확인 필요';
    refreshRecommendationScoreCache();
    renderFestivals();renderRankings();renderMap();
    toast('공공데이터 연결이 어려워 샘플 화면을 표시해요.');
  }
}

async function loadParkingForActivePlace(){
  if(!hasCoordinates(activePlace))return;
  const requestId=++parkingRequestSequence;
  if(!isDaejeonFestival(activePlace)){
    parkingTemplates=[];
    parkingWeather=null;
    parkingSourceAttribution='대전 외 지역 공영주차장 데이터 준비 중';
    parkingDataUpdatedAt=null;
    parkingDataState='regional-unavailable';
    renderParkings();renderMap();
    return;
  }
  const date=$('#visitDate').value||new Date().toISOString().slice(0,10);
  const cacheKey=`${activePlace.id}|${date}|${$('#startTime').value}|${$('#endTime').value}`;
  parkingDataState='loading';
  renderParkings();
  try{
    let payload=parkingCache.get(cacheKey);
    if(!payload){
      parkingWeather=null;
      const query=new URLSearchParams({lat:String(activePlace.lat),lng:String(activePlace.lng),radius:'4',date,startTime:$('#startTime').value,endTime:$('#endTime').value});
      const response=await fetch(`/api/parking?${query}`);
      if(!response.ok)throw new Error('parking_unavailable');
      payload=await response.json();parkingCache.set(cacheKey,payload);
    }
    if(requestId!==parkingRequestSequence)return;
    parkingWeather=payload.weather||null;
    if(!Array.isArray(payload.parkingLots)||!payload.parkingLots.length)throw new Error('empty_parking');
    parkingTemplates=payload.parkingLots.map(parking=>({...parking,dataStatus:'live'}));
    parkingSourceAttribution=payload.sourceAttribution||'';
    parkingDataUpdatedAt=payload.generatedAt||new Date().toISOString();
    parkingDataState='live';
    renderParkings();renderMap();
  }catch{
    if(requestId!==parkingRequestSequence)return;
    parkingTemplates=fallbackParkingTemplates.map((parking,index)=>({...parking,id:`demo-parking-${index}`,free:parking.base===0&&parking.add===0,unknownFee:false,scheduleVerified:true,feeVerified:true,availabilityKnown:false,updatedAt:'2026-08-25T00:00:00+09:00',dataStatus:'demo'}));
    parkingSourceAttribution='샘플 주차장 데이터 · 실제 운영·요금은 출발 전 확인 필요';
    parkingDataUpdatedAt=null;
    parkingDataState='demo';
    renderParkings();renderMap();
  }
}

function isDaejeonFestival(place=activePlace){
  return /(?:^|\s)대전(?:광역시|시)?(?:\s|$)/.test(`${place?.region||''} ${place?.address||''}`.trim());
}

function festivalCardTitleDensity(name){
  const length=[...String(name||'').replace(/\s+/g,'')].length;
  if(length>=20)return 'is-title-compact';
  if(length>=13)return 'is-title-long';
  return '';
}

function renderFestivals(){
  if(placeDataState==='loading'){
    stopFestivalAutoplay();
    $('#festivalFilterStatus').textContent='확인 중';
    $('#placeDataStatus').innerHTML='';
    $('#festivalSlider').innerHTML=placeLoadingMarkup();
    return;
  }
  const festivalPlaces = diversifiedRecommendations(filteredFestivals()
    .sort((a,b)=>recommendationScoreFor(b)-recommendationScoreFor(a)||a.distance-b.distance));
  $('#festivalFilterStatus').textContent=festivalFilterLabel(festivalPlaces.length);
  $('#festivalDateTrigger').classList.toggle('has-value',Boolean(festivalDateFilter.start||festivalDateFilter.end));
  $('#placeDataStatus').innerHTML=placeDataNotice();
  $('#festivalSlider').innerHTML = festivalPlaces.length?festivalPlaces.map(place=>{
    const countdown=festivalCardCountdown(place);
    const area=compactPlaceArea(place);
    const valueLine=placeValueLine(place);
    const topicTags=festivalTopicTagsFor(place).slice(0,2);
    const titleDensity=festivalCardTitleDensity(place.name);
    const cardTopicMarkup=topicTags.length
      ? `<span class="compact-place-tags">${topicTags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</span>`
      : `<span class="compact-place-value">${escapeHtml(valueLine)}</span>`;
    const cardAriaLabel=[place.name,countdown.label,valueLine,topicTags.length?`주제 ${topicTags.join(', ')}`:'',recommendationFitLabel(place),`${area} 상세 보기`].filter(Boolean).join(', ');
    return `<article class="festival-card" style="--card-gradient:${place.gradient};--festival-accent:${place.color}"><button class="festival-card-open" type="button" data-place="${escapeHtml(place.id)}" aria-label="${escapeHtml(cardAriaLabel)}"><span class="festival-visual"></span><span class="festival-shape festival-photo">${photoVisual(place)}</span><span class="festival-content festival-content-compact">${festivalCardCountdownMarkup(countdown)}<h3 class="compact-place-title ${titleDensity}"><span>${escapeHtml(place.name)}</span></h3><span class="compact-place-details">${cardTopicMarkup}<span class="compact-place-location">${escapeHtml(area)}</span></span></span></button>${favoriteButtonMarkup(place,'festival-card-favorite')}</article>`;
  }).join(''):`<div class="festival-filter-empty"><b>선택한 날짜에 열리는 축제가 없어요.</b><span>기간을 넓히거나 ‘전체’를 눌러보세요.</span></div>`;
  document.querySelectorAll('.festival-card-open').forEach(card=>card.addEventListener('click',()=>openPlace(card.dataset.place)));
  bindFavoriteButtons($('#festivalSlider'));
  festivalAutoplayDirection=1;
  restartFestivalAutoplay();
}

function renderRankings(){
  if(placeDataState==='loading'){
    $('#rankingList').innerHTML='<div class="ranking-loading" aria-hidden="true"><i></i><i></i><i></i></div>';
    return;
  }
  const isDeadline=rankingFilter==='deadline';
  const isFavorites=rankingFilter==='favorites';
  const favoriteCount=favoriteFestivalCount();
  $('#rankingTitle').textContent=isFavorites?'즐겨찾기한 축제':isDeadline?'마감 임박 순위':'맞춤 추천 축제';
  $('#rankingMetric').textContent=isFavorites?`${favoriteCount}개 저장됨`:isDeadline?'종료일 가까운 순':'취향 알고리즘 기반 추천';
  $('#festivalDateTrigger').hidden=isFavorites;
  if(isFavorites)setFestivalDateFilterOpen(false);
  const rankingSource=isFavorites?places.filter(place=>place.type==='festival'&&isFestivalFavorite(place.id)):filteredFestivals();
  const sorted=rankingSource
    .sort((a,b)=>isDeadline
      ? festivalDeadlineValue(a)-festivalDeadlineValue(b)||recommendationScoreFor(b)-recommendationScoreFor(a)
      : recommendationScoreFor(b)-recommendationScoreFor(a)||(Number(a.distance)||99)-(Number(b.distance)||99));
  const ranked=(isDeadline||isFavorites?sorted:diversifiedRecommendations(sorted)).slice(0,6);
  $('#rankingList').innerHTML=ranked.length?ranked.map((place,index)=>{
    const area=compactPlaceArea(place);
    const deadlineLabel=isDeadline?festivalDeadlineCardLabel(place):'';
    const scheduleLabel=isDeadline?festivalScheduleLabel(place):'';
    const favoriteCountdown=festivalCardCountdown(place).label;
    const deadline=isDeadline?`<em><span class="ranking-deadline">${escapeHtml(deadlineLabel)}</span><span class="ranking-schedule"> | ${escapeHtml(scheduleLabel)}</span></em>`:isFavorites?`<em>${escapeHtml(favoriteCountdown)}</em>`:'';
    return `<article class="ranking-item-shell"><button class="ranking-item" type="button" data-ranking-place="${escapeHtml(place.id)}" aria-label="${escapeHtml(`${index+1}위 ${place.name}, ${area}${isDeadline?`, ${scheduleLabel}, ${deadlineLabel}`:''} 상세 보기`)}"><strong class="ranking-number">${index+1}</strong><span class="ranking-copy"><b>${escapeHtml(place.name)}</b><span>${escapeHtml(area)}</span>${deadline}</span><span class="ranking-photo" style="--ranking-tile:${place.tile||'#f2f4f3'}">${photoVisual(place)}</span></button>${favoriteButtonMarkup(place,'ranking-favorite')}</article>`;
  }).join(''):isFavorites?'<p class="ranking-empty"><b>아직 즐겨찾기한 축제가 없어요.</b><span>카드의 별표를 누르면 여기에 모아볼 수 있어요.</span></p>':'<p class="ranking-empty">선택한 날짜에 순위를 표시할 축제가 없어요.</p>';
  document.querySelectorAll('[data-ranking-place]').forEach(button=>button.addEventListener('click',()=>openPlace(button.dataset.rankingPlace)));
  bindFavoriteButtons($('#rankingList'));
}

function applyFestivalDateFilter(changedField){
  const startInput=$('#festivalStartDate');
  const endInput=$('#festivalEndDate');
  if(startInput.value&&endInput.value&&startInput.value>endInput.value){
    if(changedField==='start')endInput.value=startInput.value;
    else startInput.value=endInput.value;
  }
  festivalDateFilter={start:startInput.value||null,end:endInput.value||null};
  // 일정 점수는 선택한 여행 기간을 기준으로 계산하므로, 정렬용 점수 캐시를
  // 먼저 다시 채워야 추천 순서와 근거 문구가 같은 기간을 보게 된다.
  refreshRecommendationScoreCache();
  renderFestivals();
  renderRankings();
  renderMap();
}

function clearFestivalDateFilter(){
  $('#festivalStartDate').value='';
  $('#festivalEndDate').value='';
  festivalDateFilter={start:null,end:null};
  // 기간을 지우면 다시 '오늘' 기준 일정 점수로 되돌려야 한다.
  refreshRecommendationScoreCache();
  renderFestivals();
  renderRankings();
  renderMap();
}

function setFestivalDateFilterOpen(open){
  const filter=$('#festivalDateFilter');
  const trigger=$('#festivalDateTrigger');
  filter.hidden=!open;
  trigger.classList.toggle('is-open',open);
  trigger.setAttribute('aria-expanded',String(open));
}

function groupPlacesForZoom(visible){
  const withCenter=places=>({
    places,
    lat:places.reduce((sum,place)=>sum+Number(place.lat),0)/places.length,
    lng:places.reduce((sum,place)=>sum+Number(place.lng),0)/places.length
  });
  const fallbackGroups=visible.map(place=>withCenter([place]));
  if(!naverMap?.getProjection||!visible.length||!window.MapClustering)return fallbackGroups;
  const projection=naverMap.getProjection();
  let projected;
  try{
    projected=visible.map(place=>{
      const point=projection.fromCoordToOffset(new naver.maps.LatLng(place.lat,place.lng));
      return {place,x:point.x,y:point.y};
    });
  }catch{return fallbackGroups;}
  return window.MapClustering
    .clusterProjectedPlaces(projected)
    .map(cluster=>withCenter(cluster.map(item=>item.place)));
}

function renderMap(){
  updateFavoriteMapButton();
  const statusOptions=festivalDateStatusOptions();
  const allVisible = placeDataState==='loading'?[]:places.filter(place=>hasCoordinates(place)&&festivalVisibleOnMap(place,statusOptions));
  const visible=showFavoritePinsOnly
    ? allVisible.filter(place=>isFestivalFavorite(place.id))
    : activeMapTopicFilter
      ? allVisible.filter(place=>festivalRecommender?.matchesTopicQuery(behaviorPlaceFor(place),activeMapTopicFilter))
      : allVisible;
  renderNearbyPanel(visible);
  if(!naverMap)return;
  placeMarkers.forEach(marker=>marker.setMap(null));
  if(isPlaceFocused){
    if(!hasCoordinates(activePlace))return;
    const targetPosition=new naver.maps.LatLng(activePlace.lat,activePlace.lng);
    const activeFavorite=isFestivalFavorite(activePlace.id);
    const activeStatus=festivalMapDateStatus(activePlace,statusOptions);
    placeMarkers=[new naver.maps.Marker({map:naverMap,position:targetPosition,title:activePlace.name,zIndex:30,icon:{content:`<span class="map-marker selected-map-marker place-pin-festival${activeStatus==='active'?'':' place-pin-upcoming'}${activeFavorite?' favorite-place-pin':''}" style="--pin:${activePlace.color}" aria-label="선택한 축제, ${festivalDateStatusLabel(activeStatus)}${activeFavorite?', 즐겨찾기':''}"><span class="marker-bubble"><span class="marker-icon">${markerVisual(activePlace)}</span></span>${activeFavorite?'<i class="marker-favorite-badge" aria-hidden="true">★</i>':''}</span>`,anchor:new naver.maps.Point(32,66)}})];
    return;
  }
  const zoom=naverMap.getZoom();
  placeMarkers=groupPlacesForZoom(visible).map(group=>{
    if(group.places.length>1){
      const groupFavoriteCount=group.places.filter(place=>isFestivalFavorite(place.id)).length;
      const groupStatus=window.FestivalTiming?.groupDateStatus(group.places,statusOptions)||'upcoming';
      const marker=new naver.maps.Marker({map:naverMap,position:new naver.maps.LatLng(group.lat,group.lng),title:`축제 ${group.places.length}곳`,zIndex:24,icon:{content:`<button class="place-cluster-marker${groupStatus==='active'?'':' upcoming-place-cluster'}${groupFavoriteCount?' favorite-place-cluster':''}" style="--cluster-color:${groupStatus==='active'?'#ff4f64':'#8b95a1'}" aria-label="축제 ${group.places.length}곳, ${groupStatus==='active'?'진행 중 포함':'예정'}${groupFavoriteCount?`, 즐겨찾기 ${groupFavoriteCount}곳`:''} 확대해서 보기">${groupFavoriteCount?'<i aria-hidden="true">★</i>':''}<span>축제</span><b>${group.places.length}</b></button>`,anchor:new naver.maps.Point(39,39)}});
      naver.maps.Event.addListener(marker,'click',()=>focusMapOn(new naver.maps.LatLng(group.lat,group.lng),Math.min(18,zoom+2),'overview',600));
      return marker;
    }
    const place=group.places[0];
    const favorite=isFestivalFavorite(place.id);
    const status=festivalMapDateStatus(place,statusOptions);
    const marker=new naver.maps.Marker({
      map:naverMap,
      position:new naver.maps.LatLng(place.lat,place.lng),
      title:place.name,
      zIndex:place.id===activePlace.id?20:status==='active'?12:10,
      icon:{
        content:`<button class="map-marker place-pin-festival${status==='active'?'':' place-pin-upcoming'}${favorite?' favorite-place-pin':''} ${place.id===activePlace.id?'active':''}" style="--pin:${place.color}" aria-label="${escapeHtml(place.name)}, ${festivalDateStatusLabel(status)}${favorite?', 즐겨찾기':''} 상세 보기"><span class="marker-bubble"><span class="marker-icon">${markerVisual(place)}</span></span>${favorite?'<i class="marker-favorite-badge" aria-hidden="true">★</i>':''}</button>`,
        anchor:new naver.maps.Point(32,66)
      }
    });
    naver.maps.Event.addListener(marker,'click',()=>openPlace(place.id));
    return marker;
  });
}

function renderNearbyPanel(visible){
  const title=$('.nearby-title h3'),eyebrow=$('.nearby-title p');
  if(isPlaceFocused){
    const parkings=currentParkingList();
    eyebrow.textContent='선택한 장소 주변';
    title.textContent='추천 주차장';
    $('#nearbyCount').textContent=`${parkings.length}곳`;
    $('#nearbyList').innerHTML=parkings.map(parking=>`<button class="nearby-item nearby-parking" data-parking="${escapeHtml(parking.id||parking.name)}" style="--tile:#eff7ef;--accent:#3d7657"><span class="nearby-emoji">${parking.recommendationRank}위</span><span class="nearby-info"><span>${escapeHtml(parking.rankLabel)} · ${escapeHtml(parking.type)} 주차장</span><b>${escapeHtml(parking.name)}</b><p>${formatCost(parking)} · 도보 ${parking.walk}분</p></span></button>`).join('');
    document.querySelectorAll('[data-parking]').forEach(item=>item.addEventListener('click',openPlanner));
    return;
  }
  const near=[...visible].sort((a,b)=>a.distance-b.distance).slice(0,4);
  eyebrow.textContent='내 주변';
  title.textContent='가까운 장소';
  $('#nearbyCount').textContent=`${near.length}곳`;
  $('#nearbyList').innerHTML=near.map(place=>`<button class="nearby-item" data-place="${escapeHtml(place.id)}" style="--tile:${place.tile};--accent:${place.color}"><span class="nearby-emoji">${escapeHtml(place.emoji)}</span><span class="nearby-info"><span>${escapeHtml(compactPlaceArea(place))}</span><b>${escapeHtml(place.name)}</b><p>${place.distance}km · ${place.eta}분 · ${escapeHtml(festivalDateBadge(place))}</p></span></button>`).join('');
  document.querySelectorAll('.nearby-item').forEach(item=>item.addEventListener('click',()=>openPlace(item.dataset.place)));
}

function isVisibleOverlay(element){
  if(!element)return false;
  const style=getComputedStyle(element);
  const rect=element.getBoundingClientRect();
  return style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity||1)>0&&rect.width>0&&rect.height>0;
}

function visibleMapTargetY(mode='overview'){
  const mapRect=$('#map').getBoundingClientRect();
  let visibleTop=mapRect.top;
  ['.app-header'].forEach(selector=>{
    const overlay=$(selector);
    if(!isVisibleOverlay(overlay))return;
    const rect=overlay.getBoundingClientRect();
    if(rect.bottom>mapRect.top&&rect.top<mapRect.bottom)visibleTop=Math.max(visibleTop,Math.min(rect.bottom,mapRect.bottom));
  });
  visibleTop=Math.min(mapRect.bottom,visibleTop+8);

  let visibleBottom=mapRect.bottom;
  if(mode==='place'){
    const peekHeight=parseFloat($('#placeSheet').style.getPropertyValue('--place-sheet-peek-height'))||mapRect.height*.6;
    visibleBottom=Math.max(mapRect.top,mapRect.bottom-peekHeight);
  }else{
    const recommendations=$('.recommend-section');
    if(isVisibleOverlay(recommendations)){
      const rect=recommendations.getBoundingClientRect();
      if(rect.top<mapRect.bottom&&rect.bottom>mapRect.top)visibleBottom=Math.min(visibleBottom,Math.max(mapRect.top,rect.top));
    }
  }

  if(visibleBottom-visibleTop<120){
    visibleTop=mapRect.top;
    visibleBottom=Math.max(mapRect.top+120,visibleBottom);
  }
  return Math.max(40,Math.min(mapRect.height-40,(visibleTop+visibleBottom)/2-mapRect.top));
}

function mapCenterForVisibleTarget(position,zoom,mode='overview'){
  if(!naverMap)return position;
  try{
    const projection=naverMap.getProjection();
    const point=projection.fromCoordToPoint(position);
    const factor=projection.factor(zoom);
    const mapHeight=$('#map').getBoundingClientRect().height;
    const pixelShift=mapHeight/2-visibleMapTargetY(mode);
    return projection.fromPointToCoord(new naver.maps.Point(point.x,point.y+pixelShift/factor));
  }catch{
    return position;
  }
}

function focusMapOn(position,zoom,mode='overview',duration=0){
  if(!naverMap)return;
  const center=mapCenterForVisibleTarget(position,zoom,mode);
  naverMap.stop();
  if(duration)naverMap.morph(center,zoom,{duration,easing:'easeOutCubic'});
  else{
    naverMap.setZoom(zoom);
    naverMap.setCenter(center);
  }
}

function fitAllPlaces(){
  if(!naverMap)return;
  focusMapOn(new naver.maps.LatLng(overviewPosition.lat,overviewPosition.lng),overviewPosition.zoom,'overview');
  const center=naverMap.getCenter();
  previousMapView={lat:center.lat(),lng:center.lng(),zoom:naverMap.getZoom()};
}

function morphToOverview(){
  if(!naverMap)return;
  naverMap.stop();
  naverMap.morph(new naver.maps.LatLng(previousMapView.lat,previousMapView.lng),previousMapView.zoom,{duration:750,easing:'easeOutCubic'});
}

function initNaverMap(){
  if(!hasNaverMapApi()){
    $('#map').innerHTML='<p class="map-status">지도를 불러오지 못했어요. 등록한 Web 서비스 URL을 확인해 주세요.</p>';
    renderMap();
    return;
  }
  naverMap=new naver.maps.Map('map',{center:new naver.maps.LatLng(overviewPosition.lat,overviewPosition.lng),zoom:overviewPosition.zoom,minZoom:7,maxZoom:18});
  naver.maps.Event.addListener(naverMap,'idle',()=>{if(!isPlaceFocused)renderMap();});
  renderMap();
  fitAllPlaces();
}

function requestCurrentLocation({focusMap=true,announce=true}={}){
  if(currentLocationRequestPending)return;
  if(!navigator.geolocation){
    if(isPlaceFocused)setPlaceRouteEstimate('현재 위치를 사용할 수 없어요.','브라우저의 위치 기능을 확인해 주세요.');
    if(announce)toast('이 브라우저에서는 현재 위치를 사용할 수 없어요.');
    return;
  }
  currentLocationRequestPending=true;
  if(isPlaceFocused)setPlaceRouteEstimate('현재 위치 확인 중…','위치 권한을 확인해 주세요.');
  navigator.geolocation.getCurrentPosition(({coords})=>{
    currentLocationRequestPending=false;
    if(!naverMap){toast('지도가 준비된 뒤 다시 시도해 주세요.');return;}
    userPosition={lat:coords.latitude,lng:coords.longitude};
    updateDistancesFromCurrentLocation(userPosition.lat,userPosition.lng);
    if(isPlaceFocused)loadDrivingRouteForActivePlace();
    const position=new naver.maps.LatLng(coords.latitude,coords.longitude);
    if(currentLocationMarker)currentLocationMarker.setPosition(position);
    else currentLocationMarker=new naver.maps.Marker({map:naverMap,position,icon:{content:'<span class="current-location-marker" aria-label="현재 위치"><b aria-hidden="true"></b></span>',anchor:new naver.maps.Point(20,20)},zIndex:30});
    const fromDaejeon=haversineDistance(coords.latitude,coords.longitude,overviewPosition.lat,overviewPosition.lng);
    if(focusMap){
      if(fromDaejeon<=25)focusMapOn(position,14,'overview',650);
      else fitAllPlaces();
    }
    if(announce)toast(fromDaejeon<=25?'현재 위치에서 거리를 다시 계산했어요.':'현재 위치에서 거리를 계산하고 지도는 대전 중심으로 유지했어요.');
  },()=>{
    currentLocationRequestPending=false;
    if(isPlaceFocused)setPlaceRouteEstimate('현재 위치 설정 필요','위치 권한을 허용하면 실제 차량 시간을 계산해요.');
    if(announce)toast('위치 권한을 허용하면 현재 위치를 기준으로 거리를 계산해요.');
  },{enableHighAccuracy:true,timeout:7000,maximumAge:60000});
}

function moveToCurrentLocation(){
  requestCurrentLocation({focusMap:true,announce:true});
}

function requestCurrentLocationForRoute(){
  requestCurrentLocation({focusMap:false,announce:false});
}

function placeOperationStatus(place){
  if(place.type!=='festival')return {label:'상시 방문 장소',tone:'neutral'};
  const start=koreaDateTime(place.startDate);
  const end=koreaDateTime(place.endDate,true);
  if(!Number.isFinite(start)||!Number.isFinite(end))return {label:'행사 일정 확인 필요',tone:'warning'};
  const now=Date.now();
  if(now<start)return {label:'행사 시작 전',tone:'neutral'};
  if(now<=end)return {label:'현재 진행 중',tone:'positive'};
  return {label:'행사 종료',tone:'muted'};
}
function placeHoursNotice(place){
  const hours=String(place.hours||'').trim();
  return hours&&!/확인/.test(hours)?hours:'공식 데이터에 운영 시간이 제공되지 않았어요. 출발 전에 공식 행사 안내에서 확인해 주세요.';
}

function festivalPeriodMarkup(place){
  const start=String(place?.startDate||'').trim();
  const end=String(place?.endDate||'').trim();
  if(start&&end){
    return `<b class="festival-period"><span>${escapeHtml(start)}</span><span><i aria-hidden="true">—</i>${escapeHtml(end)}</span></b>`;
  }
  const period=String(place?.period||'일정 확인 필요').trim();
  return `<b class="festival-period"><span>${escapeHtml(period)}</span></b>`;
}

function drivingRouteCacheKey(place){
  if(!userPosition||!hasCoordinates(place))return '';
  return [
    Number(userPosition.lat).toFixed(3),
    Number(userPosition.lng).toFixed(3),
    Number(place.lat).toFixed(4),
    Number(place.lng).toFixed(4)
  ].join(':');
}

function initialRouteEstimateFor(place){
  if(!userPosition){
    return {value:'현재 위치로 계산하기',note:'누르면 실제 도로 거리와 차량 시간을 확인해요.'};
  }
  return {value:`직선거리 ${place.distance}km`,note:'TMAP 차량 경로 계산 중…'};
}

function setPlaceRouteEstimate(value,note){
  const estimate=$('#placeRouteEstimate');
  const source=$('#placeRouteSource');
  if(estimate)estimate.textContent=value;
  if(source)source.textContent=note||'';
}

async function loadDrivingRouteForActivePlace(){
  const place=activePlace;
  if(!place||!hasCoordinates(place))return;
  if(!userPosition){
    const fallback=initialRouteEstimateFor(place);
    setPlaceRouteEstimate(fallback.value,fallback.note);
    return;
  }
  const key=drivingRouteCacheKey(place);
  const cached=drivingRouteCache.get(key);
  if(cached){
    setPlaceRouteEstimate(`도로 ${cached.distanceKm}km · 차로 약 ${cached.durationMinutes}분`,cached.source);
    return;
  }
  const requestId=++drivingRouteRequestSequence;
  setPlaceRouteEstimate(`직선거리 ${place.distance}km`,'TMAP 차량 경로 계산 중…');
  const params=new URLSearchParams({
    startLat:String(userPosition.lat),
    startLng:String(userPosition.lng),
    endLat:String(place.lat),
    endLng:String(place.lng)
  });
  try{
    const response=await fetch(`/api/tmap-route?${params.toString()}`,{headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error(`tmap_route_http_${response.status}`);
    const route=await response.json();
    if(!Number.isFinite(Number(route.distanceKm))||!Number.isFinite(Number(route.durationMinutes)))throw new Error('tmap_route_invalid');
    const normalized={
      distanceKm:Number(route.distanceKm),
      durationMinutes:Math.max(1,Math.round(Number(route.durationMinutes))),
      source:String(route.source||'TMAP 자동차 경로안내')
    };
    drivingRouteCache.set(key,normalized);
    if(requestId!==drivingRouteRequestSequence||activePlace.id!==place.id)return;
    setPlaceRouteEstimate(`도로 ${normalized.distanceKm}km · 차로 약 ${normalized.durationMinutes}분`,normalized.source);
  }catch{
    if(requestId!==drivingRouteRequestSequence||activePlace.id!==place.id)return;
    setPlaceRouteEstimate(`직선거리 ${place.distance}km`,'차량 소요 시간을 불러오지 못했어요.');
  }
}

function openPlace(id){
  if(naverMap&&!isPlaceFocused){
    const center=naverMap.getCenter();
    previousMapView={lat:center.lat(),lng:center.lng(),zoom:naverMap.getZoom()};
  }
  activePlace=places.find(place=>place.id===id)||places[0];
  recordFestivalView(activePlace);
  isPlaceFocused=true;
  stopFestivalAutoplay();
  excludedParkings=[];
  parkingWeather=null;
  $('.app-shell').classList.add('is-place-focused');
  renderMap();
  if(!hasCoordinates(activePlace))toast('이 축제의 지도 좌표는 확인 중이에요. 상세 정보는 먼저 볼 수 있어요.');
  const placeLabel='축제';
  const routeEstimate=hasCoordinates(activePlace)?initialRouteEstimateFor(activePlace):{value:'지도 좌표 확인 중',note:''};
  const experience=experienceFor(activePlace);
  const sourceCopy=`<p class="data-source-note">${escapeHtml(festivalContentAttribution(activePlace))} · ${escapeHtml(dataUpdatedLabel(activePlace.updatedAt||placeDataUpdatedAt))}</p>`;
  const status=placeOperationStatus(activePlace);
  const programs=experience.highlights.slice(0,3);
  const programsMarkup=programs.length?`<ol class="place-program-list">${programs.map(item=>`<li><span>${escapeHtml(item.icon)}</span><div><b>${escapeHtml(item.title)}</b>${item.description?`<small>${escapeHtml(item.description)}</small>`:''}</div></li>`).join('')}</ol>`:'<p class="missing-data-copy">공식 데이터와 검색 결과에서 확인된 세부 프로그램이 없어요.</p>';
  const chipRowMarkup=experience.tags.length?`<div class="festival-chip-row">${experience.tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div>`:'';
  const hasHeroImage=Boolean(activePlace.imageUrl);
  const heroImage=hasHeroImage?`<img class="place-hero-photo" src="${escapeHtml(activePlace.imageUrl)}" alt="${escapeHtml(activePlace.name)} 대표 이미지" referrerpolicy="no-referrer" onerror="this.parentElement.classList.remove('has-photo');this.remove()" />`:'';
  $('#placeSheet').classList.add('festival-detail');
  const travelDisabled=hasCoordinates(activePlace)?'':' disabled aria-disabled="true"';
  const officialOverview=String(activePlace.metadata?.festival_content?.official_overview||'').trim();
  const overviewMarkup=officialOverview?`<section class="festival-overview"><div class="place-section-heading"><h3>축제 소개</h3><span>한국관광공사</span></div><p>${escapeHtml(officialOverview)}</p></section>`:'';
  const recommendationItems=recommendationSignalsFor(activePlace);
  const readableRecommendationItems=(recommendationItems.length?recommendationItems:['✓ 일정과 이동 거리를 확인한 추천이에요.']).map(item=>{
    const match=item.match(/^([★✓△])\s*/);
    return {icon:match?.[1]||'✓',copy:item.slice(match?.[0]?.length||0)};
  });
  const recommendationMarkup=`<div class="recommend-reason"><i aria-hidden="true">✓</i><div><strong>${escapeHtml(recommendationFitLabel(activePlace))}</strong><ul>${readableRecommendationItems.map(item=>`<li><em aria-hidden="true">${escapeHtml(item.icon)}</em><span>${escapeHtml(item.copy)}</span></li>`).join('')}</ul></div></div>`;
  $('#placeSheetContent').innerHTML=[
    `<div class="place-hero place-hero-rich${hasHeroImage?' has-photo':''}" style="--hero:${activePlace.gradient};--emoji:'${escapeHtml(activePlace.emoji)}'">${heroImage}${favoriteButtonMarkup(activePlace,'place-hero-favorite')}<div class="place-hero-badges"><span>${placeLabel}</span><span class="status-badge ${status.tone}">${escapeHtml(status.label)}</span></div><div class="place-hero-copy"><h2>${escapeHtml(activePlace.name)}</h2><p>${escapeHtml(placeValueLine(activePlace))}</p></div></div>`,
    chipRowMarkup,
    '<div class="place-peek-end" id="placeSheetPeekEnd" aria-hidden="true"></div>',
    recommendationMarkup,
    '<section class="place-intro"><h3>방문 전에 확인하세요</h3></section>',
    `<div class="festival-facts"><div><span>행사 일정</span>${festivalPeriodMarkup(activePlace)}</div><div><span>현재 상태</span><b>${escapeHtml(status.label)}</b></div><div><span>운영 시간</span><b>${escapeHtml(placeHoursNotice(activePlace))}</b></div><div><span>장소</span><b>${escapeHtml(experience.venue)}</b></div><div><span>입장·예약</span><b>${escapeHtml(experience.admission)}</b></div><div class="festival-route-fact"><span>현재 위치에서</span><button class="festival-route-request" id="placeRouteRequest" type="button"><b id="placeRouteEstimate">${escapeHtml(routeEstimate.value)}</b><small id="placeRouteSource">${escapeHtml(routeEstimate.note)}</small></button></div></div>`,
    overviewMarkup,
    `<section class="place-programs"><div class="place-section-heading"><h3>핵심 프로그램</h3><span>${escapeHtml(festivalProgramSourceLabel(activePlace))}</span></div>${programsMarkup}</section>`,
    `<section class="visit-verification"><div><span>정보 기준</span><b>${escapeHtml(dataUpdatedLabel(activePlace.updatedAt||placeDataUpdatedAt))}</b></div></section>`,
    `<div class="festival-actions"><button class="festival-travel-button transit" id="openTransitGuide" type="button"${travelDisabled}><span><small>버스 · 지하철</small><b>대중교통 안내</b></span><em aria-hidden="true">→</em></button><button class="festival-travel-button navigation" id="openNavigationGuide" type="button"${travelDisabled}><span><small>자동차 길찾기</small><b>내비게이션 안내</b></span><em aria-hidden="true">→</em></button></div>`,
    sourceCopy
  ].join('');
  document.querySelectorAll('.bottom-sheet').forEach(sheet=>sheet.classList.remove('show'));
  $('#sheetBackdrop').classList.remove('show');
  suppressPlaceSheetGestureClick=false;
  setPlaceSheetExpanded(false);
  setPlaceSheetHeights();
  $('#placeSheet').classList.add('show');
  if(naverMap&&hasCoordinates(activePlace)){
    const targetPosition=new naver.maps.LatLng(activePlace.lat,activePlace.lng);
    focusMapOn(targetPosition,15,'place',750);
  }
  bindFavoriteButtons($('#placeSheetContent'));
  $('#placeRouteRequest').addEventListener('click',requestCurrentLocationForRoute);
  $('#openTransitGuide').addEventListener('click',event=>openFestivalTravel('transit',event.currentTarget));
  $('#openNavigationGuide').addEventListener('click',event=>openFestivalTravel('navigation',event.currentTarget));
  loadDrivingRouteForActivePlace();
  loadParkingForActivePlace();
}

function setPlaceSheetHeights(){
  const mapRect=$('.map-card')?.getBoundingClientRect();
  const screenHeight=mapRect?.height||window.innerHeight;
  const header=$('.app-header');
  const headerRect=isVisibleOverlay(header)?header.getBoundingClientRect():null;
  const expandedTopInset=headerRect&&mapRect
    ? Math.max(12,Math.round(headerRect.bottom-mapRect.top+8))
    : 12;
  const fullHeight=Math.max(320,Math.round(screenHeight-expandedTopInset));
  const sheet=$('#placeSheet');
  const peekEnd=$('#placeSheetPeekEnd');
  const actions=$('.festival-actions');
  const sheetRect=sheet.getBoundingClientRect();
  const peekEndRect=peekEnd?.getBoundingClientRect();
  const actionReserve=actions?Math.ceil(actions.getBoundingClientRect().height):0;
  const measuredPeekHeight=peekEndRect
    ? Math.ceil(peekEndRect.bottom-sheetRect.top+actionReserve+12)
    : Math.round(screenHeight*.6);
  const peekHeight=Math.min(fullHeight-56,Math.max(260,measuredPeekHeight));
  sheet.style.setProperty('--place-sheet-peek-height',`${peekHeight}px`);
  sheet.style.setProperty('--place-sheet-full-height',`${fullHeight}px`);
}

function setPlaceSheetExpanded(expanded){
  const sheet=$('#placeSheet');
  sheet.classList.toggle('is-expanded',expanded);
  sheet.classList.remove('is-dragging');
  sheet.style.removeProperty('--place-sheet-drag-height');
  const handle=$('#placeSheetHandle');
  handle.setAttribute('aria-expanded',String(expanded));
  handle.setAttribute('aria-label',expanded?'축제 상세 축소하기':'축제 상세 펼치기');
  if(!expanded)sheet.scrollTop=0;
}

function canStartSheetDrag(event,sheet,grabberSelector){
  const target=event.target;
  if(!(target instanceof Element)||!sheet.contains(target))return false;
  if(target.closest('[data-no-sheet-drag]'))return false;
  if(target.closest(grabberSelector))return true;
  if(target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable="true"]'))return false;
  if(sheet.id==='placeSheet')return !sheet.classList.contains('is-expanded');
  const contentBlock=target.closest([
    '.place-hero-rich',
    '.festival-chip-row',
    '.place-intro',
    '.festival-facts > div',
    '.recommend-reason',
    '.festival-activity-grid article',
    '.festival-tip',
    '.festival-actions',
    '.planner-head',
    '.time-form',
    '.parking-summary',
    '.parking-item',
    '.data-note',
    '.parking-info-kicker',
    '.parking-info-grid > div',
    '.parking-info-reason',
    '.parking-info-actions'
  ].join(','));
  return !contentBlock;
}

function isPlaceSheetTopPullTarget(event,sheet){
  const target=event.target;
  return sheet.id==='placeSheet'
    && sheet.classList.contains('is-expanded')
    && sheet.scrollTop<=1
    && target instanceof Element
    && !target.closest('.place-sheet-grabber, [data-no-sheet-drag], button, a, input, select, textarea, label, [role="button"], [contenteditable="true"]');
}

function expandPlaceSheetOnWheel(event){
  const sheet=$('#placeSheet');
  if(!sheet.classList.contains('show')||sheet.classList.contains('is-expanded')||event.deltaY<=0)return;
  event.preventDefault();
  setPlaceSheetExpanded(true);
}

function beginPlaceSheetTopPull(event){
  const sheet=$('#placeSheet');
  const target=event.target;
  if(!sheet.classList.contains('show')||!sheet.classList.contains('is-expanded')||sheet.scrollTop>1||event.touches.length!==1){
    placeSheetTopPull=null;
    return;
  }
  if(!(target instanceof Element)||target.closest('.place-sheet-grabber, button, a, input, select, textarea, label, [role="button"], [contenteditable="true"]')){
    placeSheetTopPull=null;
    return;
  }
  const touch=event.touches[0];
  placeSheetTopPull={identifier:touch.identifier,startY:touch.clientY};
}

function movePlaceSheetTopPull(event){
  if(!placeSheetTopPull)return;
  const sheet=$('#placeSheet');
  const touch=Array.from(event.touches).find(item=>item.identifier===placeSheetTopPull.identifier);
  if(!touch||!sheet.classList.contains('is-expanded')||sheet.scrollTop>1){
    placeSheetTopPull=null;
    return;
  }
  const pullDistance=touch.clientY-placeSheetTopPull.startY;
  if(pullDistance<0){
    placeSheetTopPull=null;
    return;
  }
  if(pullDistance<=0)return;
  if(event.cancelable)event.preventDefault();
  if(pullDistance<10)return;
  placeSheetTopPull=null;
  setPlaceSheetExpanded(false);
}

function resetPlaceSheetTopPull(){
  placeSheetTopPull=null;
}

function beginPlaceSheetDrag(event){
  if(event.button!==undefined&&event.button!==0)return;
  if(placeSheetDrag)return;
  const sheet=$('#placeSheet');
  if(!sheet.classList.contains('show'))return;
  const topPullCandidate=isPlaceSheetTopPullTarget(event,sheet);
  if(!topPullCandidate&&!canStartSheetDrag(event,sheet,'.place-sheet-grabber'))return;
  setPlaceSheetHeights();
  const styles=getComputedStyle(sheet);
  placeSheetDrag={
    pointerId:event.pointerId,
    startY:event.clientY,
    startTime:performance.now(),
    startHeight:sheet.getBoundingClientRect().height,
    minHeight:Math.min(220,parseFloat(styles.getPropertyValue('--place-sheet-peek-height'))*.55),
    maxHeight:parseFloat(styles.getPropertyValue('--place-sheet-full-height')),
    expanded:sheet.classList.contains('is-expanded'),
    captureTarget:event.currentTarget,
    fromGrabber:Boolean(event.target instanceof Element&&event.target.closest('.place-sheet-grabber')),
    topPullCandidate,
    moved:false
  };
  if(!topPullCandidate)sheet.classList.add('is-dragging');
}

function movePlaceSheetDrag(event){
  if(!placeSheetDrag||event.pointerId!==placeSheetDrag.pointerId)return;
  const delta=placeSheetDrag.startY-event.clientY;
  if(placeSheetDrag.topPullCandidate){
    if(delta>0){
      placeSheetDrag=null;
      return;
    }
    if(delta>=-1)return;
    event.preventDefault();
    if(delta>-10)return;
    placeSheetDrag=null;
    suppressPlaceSheetGestureClick=true;
    window.setTimeout(()=>{suppressPlaceSheetGestureClick=false;},0);
    setPlaceSheetExpanded(false);
    return;
  }
  if(Math.abs(delta)>6&&!placeSheetDrag.moved){
    placeSheetDrag.moved=true;
    if(event.pointerId!==undefined)placeSheetDrag.captureTarget?.setPointerCapture?.(event.pointerId);
  }
  const nextHeight=dampGestureValue(placeSheetDrag.startHeight+delta,placeSheetDrag.minHeight,placeSheetDrag.maxHeight);
  $('#placeSheet').style.setProperty('--place-sheet-drag-height',`${nextHeight}px`);
  if(placeSheetDrag.moved)event.preventDefault();
}

function endPlaceSheetDrag(event){
  if(!placeSheetDrag||event.pointerId!==placeSheetDrag.pointerId)return;
  const drag=placeSheetDrag;
  const delta=drag.startY-event.clientY;
  const velocity=gestureVelocity(delta,drag.startTime);
  placeSheetDrag=null;
  if(!drag.moved&&drag.fromGrabber){
    suppressPlaceSheetGestureClick=true;
    window.setTimeout(()=>{suppressPlaceSheetGestureClick=false;},0);
    setPlaceSheetExpanded(!drag.expanded);
    return;
  }
  if(drag.moved){
    suppressPlaceSheetGestureClick=true;
    window.setTimeout(()=>{suppressPlaceSheetGestureClick=false;},0);
  }
  if(delta<-58||velocity<-GESTURE_VELOCITY_THRESHOLD){
    if(drag.expanded)setPlaceSheetExpanded(false);
    else resetMapFocus();
  }else if(!drag.expanded&&(delta>48||velocity>GESTURE_VELOCITY_THRESHOLD)){
    setPlaceSheetExpanded(true);
  }else{
    setPlaceSheetExpanded(drag.expanded);
  }
}

function resetPlannerSheetDrag(){
  window.clearTimeout(plannerDismissTimer);
  plannerDismissTimer=null;
  plannerSheetDrag=null;
  document.querySelectorAll('#plannerSheet, #parkingInfoSheet').forEach(sheet=>{
    sheet.classList.remove('is-dragging','is-dismissing');
    sheet.style.removeProperty('transform');
  });
}

function beginPlannerSheetDrag(event){
  if(event.button!==undefined&&event.button!==0)return;
  if(plannerSheetDrag)return;
  const sheet=event.currentTarget;
  if(!sheet.classList.contains('show'))return;
  if(!canStartSheetDrag(event,sheet,'.planner-sheet-grabber, .sheet-handle'))return;
  event.preventDefault();
  resetPlannerSheetDrag();
  plannerSheetDrag={pointerId:event.pointerId,startY:event.clientY,startTime:performance.now(),moved:false,sheet};
  sheet.classList.add('is-dragging');
  if(event.pointerId!==undefined){try{event.currentTarget.setPointerCapture?.(event.pointerId);}catch{/* Pointer capture is optional. */}}
}

function movePlannerSheetDrag(event){
  if(!plannerSheetDrag||event.pointerId!==plannerSheetDrag.pointerId)return;
  const sheet=plannerSheetDrag.sheet;
  const delta=Math.max(0,event.clientY-plannerSheetDrag.startY);
  if(delta>5)plannerSheetDrag.moved=true;
  sheet.style.transform=`translateY(${dampGestureValue(delta,0,sheet.offsetHeight)}px)`;
  if(plannerSheetDrag.moved)event.preventDefault();
}

function endPlannerSheetDrag(event){
  if(!plannerSheetDrag||event.pointerId!==plannerSheetDrag.pointerId)return;
  const drag=plannerSheetDrag;
  const sheet=drag.sheet;
  const delta=Math.max(0,event.clientY-drag.startY);
  const velocity=gestureVelocity(delta,drag.startTime);
  plannerSheetDrag=null;
  if(drag.moved){
    suppressPlannerSheetGestureClick=true;
    window.setTimeout(()=>{suppressPlannerSheetGestureClick=false;},0);
  }
  sheet.classList.remove('is-dragging');
  if(delta>64||velocity>GESTURE_VELOCITY_THRESHOLD){
    sheet.classList.add('is-dismissing');
    sheet.style.transform=`translateY(${Math.max(delta,Math.round(sheet.offsetHeight*.38))}px)`;
    plannerDismissTimer=window.setTimeout(()=>{
      plannerDismissTimer=null;
      sheet.classList.remove('is-dismissing');
      sheet.style.removeProperty('transform');
      closeSheets();
    },220);
    return;
  }
  sheet.style.removeProperty('transform');
}

function showSheet(selector){
  document.querySelectorAll('.bottom-sheet').forEach(sheet=>sheet.classList.remove('show'));
  $('#sheetBackdrop').classList.add('show');
  $(selector).classList.add('show');
}

function closeSheets(){
  const wasPlaceOpen=$('#placeSheet').classList.contains('show');
  const wasPlannerOpen=$('#plannerSheet').classList.contains('show');
  const wasParkingInfoOpen=$('#parkingInfoSheet').classList.contains('show');
  resetPlannerSheetDrag();
  document.querySelectorAll('.bottom-sheet').forEach(sheet=>sheet.classList.remove('show'));
  $('#sheetBackdrop').classList.remove('show');
  if(wasPlannerOpen&&isPlaceFocused){$('#placeSheet').classList.add('show');return;}
  if(wasParkingInfoOpen&&isPlaceFocused){$('#placeSheet').classList.add('show');return;}
  if(wasPlaceOpen)resetMapFocus();
}

function resetMapFocus(){
  drivingRouteRequestSequence++;
  isPlaceFocused=false;
  $('.app-shell').classList.remove('is-place-focused');
  setPlaceSheetExpanded(false);
  $('#placeSheet').classList.remove('show');
  $('#sheetBackdrop').classList.remove('show');
  renderMap();
  scheduleFestivalAutoplay();
  morphToOverview();
}

function minutes(time){const [h,m]=String(time||'').split(':').map(Number);return Number.isFinite(h)&&Number.isFinite(m)?h*60+m:null}
function scheduleForVisit(parking){
  const hours=parking.operatingHours;
  if(!hours)return {open:parking.open,close:parking.close};
  const day=new Date(`${$('#visitDate').value||'2026-01-01'}T12:00:00+09:00`).getUTCDay();
  return hours[day===6?'saturday':day===0?'holiday':'weekday']||hours.weekday||{};
}
function visitInterval(){
  const start=minutes($('#startTime').value),end=minutes($('#endTime').value);
  return {start,end,valid:start!==null&&end!==null&&end>start,duration:start!==null&&end!==null?end-start:0};
}
function isPublicParking(parking){return parking?.type==='공영';}
function parkingScheduleCheck(parking){
  const visit=visitInterval();
  const schedule=scheduleForVisit(parking);
  const open=minutes(schedule.open),close=minutes(schedule.close);
  if(!visit.valid)return {eligible:false,reason:'방문 시간을 다시 확인해 주세요.',code:'invalid-visit'};
  if(isPublicParking(parking))return {eligible:true,reason:'24시간 이용 가능하며 유료 시간대만 요금에 반영해요.',code:'public-always-open'};
  if(open===null||close===null)return {eligible:false,reason:'운영 시간이 확인되지 않았어요.',code:'unknown-hours'};
  if(visit.start<open||visit.end>close)return {eligible:false,reason:'선택한 방문 시간 전체에 운영하지 않아요.',code:'closed'};
  return {eligible:true,reason:'선택한 방문 시간에 운영해요.',code:'open'};
}
function parkingDataFreshness(parking){
  const updated=Date.parse(parking.updatedAt||parking.availabilityUpdatedAt||'');
  if(!Number.isFinite(updated))return {fresh:false,label:'업데이트 시각 확인 필요'};
  const days=Math.floor((Date.now()-updated)/86400000);
  return {fresh:days<=365,label:days<=365?dataUpdatedLabel(parking.updatedAt||parking.availabilityUpdatedAt):'오래된 정보 · 확인 필요'};
}
function costFor(parking){
  if(parking.unknownFee)return null;
  if(parking.free===true)return 0;
  const schedule=scheduleForVisit(parking);
  const start=minutes($('#startTime').value),end=minutes($('#endTime').value),open=minutes(schedule.open),close=minutes(schedule.close);
  if(start===null||end===null||open===null||close===null)return null;
  if(end<=start)return null;
  if(!isPublicParking(parking)&&(start<open||end>close))return null;
  const paid=Math.max(0,Math.min(end,close)-Math.max(start,open));
  if(paid<=0)return isPublicParking(parking)?0:null;
  if(!Number.isFinite(Number(parking.base))||!parking.addMin)return Number.isFinite(Number(parking.base))?Number(parking.base):null;
  return parking.base+Math.ceil(Math.max(0,paid-parking.baseMin)/parking.addMin)*parking.add;
}
function formatCost(parking){const cost=costFor(parking);return cost===null?'요금 확인 필요':`${cost.toLocaleString()}원`;}
function parkingHours(parking){
  const schedule=scheduleForVisit(parking);
  if(isPublicParking(parking))return schedule.open&&schedule.close?`24시간 이용 · 유료 ${schedule.open}–${schedule.close}`:'24시간 이용 · 유료시간 확인';
  return schedule.open&&schedule.close?`${schedule.open}–${schedule.close} 운영`:'운영시간 확인';
}
function parkingHoursLabel(parking){return isPublicParking(parking)?'이용·유료 시간':'운영 시간';}
function parkingFeeBasis(parking){
  const cost=costFor(parking);
  if(cost===null)return '공식 데이터에서 선택 시간의 요금을 계산할 수 없어요.';
  if(parking.free===true)return `${$('#startTime').value}~${$('#endTime').value} · 무료 운영으로 확인`;
  const rule=parking.baseMin?`기본 ${parking.baseMin}분 ${Number(parking.base).toLocaleString()}원`:'';
  const add=parking.addMin?`추가 ${parking.addMin}분당 ${Number(parking.add).toLocaleString()}원`:'';
  return [`${$('#startTime').value}~${$('#endTime').value}`,rule,add].filter(Boolean).join(' · ');
}

function weatherTemperatureCopy(){
  const temperature=Number(parkingWeather?.apparentTemperature);
  return parkingWeather?.available&&Number.isFinite(temperature)?`체감온도 ${temperature.toFixed(1)}℃`:'체감온도 정보 없음';
}

function currentParkingList(){
  return allParkingCandidates().slice(0,3).map((parking,index)=>({
    ...parking,
    recommendationRank:index+1,
    rankLabel:String(index+1)
  }));
}

function rankedSelectionReason(parking){
  if(parkingPriority==='price')return `계산 가능한 예상 요금이 ${formatCost(parking)}로 낮은 순서예요.`;
  if(parkingPriority==='large')return `총 ${Number(parking.capacity).toLocaleString()}면으로 규모가 큰 순서예요. 실시간 혼잡도는 알 수 없어요.`;
  return `목적지에서 도보 ${parking.walk}분으로 가까운 순서예요.`;
}

function allParkingCandidates(){
  if(parkingDataState==='loading')return [];
  const candidates=parkingTemplates
    .filter(parking=>!excludedParkings.includes(parking.name))
    .map(parking=>({...parking,scheduleCheck:parkingScheduleCheck(parking),freshness:parkingDataFreshness(parking)}))
    .filter(parking=>parking.scheduleCheck.eligible&&costFor(parking)!==null);
  if(parkingPriority==='large')return candidates.filter(parking=>Number.isFinite(Number(parking.capacity))&&Number(parking.capacity)>0).sort((a,b)=>Number(b.capacity)-Number(a.capacity)||a.walk-b.walk);
  if(parkingPriority==='price')return candidates.sort((a,b)=>costFor(a)-costFor(b)||a.walk-b.walk);
  return candidates.sort((a,b)=>a.walk-b.walk||costFor(a)-costFor(b));
}

function parkingValidationReport(){
  const visible=parkingTemplates.filter(parking=>!excludedParkings.includes(parking.name));
  const scheduleExcluded=visible.filter(parking=>!parkingScheduleCheck(parking).eligible).length;
  const feeExcluded=visible.filter(parking=>parkingScheduleCheck(parking).eligible&&costFor(parking)===null).length;
  const capacityExcluded=parkingPriority==='large'?visible.filter(parking=>parkingScheduleCheck(parking).eligible&&costFor(parking)!==null&&!Number.isFinite(Number(parking.capacity))).length:0;
  return {trusted:allParkingCandidates().length,scheduleExcluded,feeExcluded,capacityExcluded,totalExcluded:scheduleExcluded+feeExcluded+capacityExcluded};
}

function openParkingInfo(parking,rank){
  const planned=currentParkingList().find(candidate=>candidate.name===parking.name);
  const rankCopy=planned?`${planned.recommendationRank}위`:(rank?`${rank}위`:'주변 주차장');
  const capacity=Number.isFinite(Number(parking.capacity))?`${Number(parking.capacity).toLocaleString()}면`:'주차면수 확인 필요';
  $('#parkingInfoContent').innerHTML=`<div class="parking-info-kicker"><span>${escapeHtml(parking.type)} 주차장</span><b>${rankCopy}</b></div><h2>${escapeHtml(parking.name)}</h2><div class="parking-info-grid"><div><span>예상 요금</span><b>${formatCost(parking)}</b><small>${escapeHtml(parkingFeeBasis(parking))}</small></div><div><span>도보 거리</span><b>${parking.walk}분</b></div><div><span>${escapeHtml(parkingHoursLabel(parking))}</span><b>${escapeHtml(parkingHours(parking))}</b></div><div><span>주차 규모</span><b>${escapeHtml(capacity)}</b><small>실시간 혼잡도는 제공되지 않습니다.</small></div></div><p class="parking-info-reason">✓ ${escapeHtml(rankedSelectionReason({...parking,recommendationRank:planned?.recommendationRank||rank}))}</p><p class="data-source-note">${escapeHtml(parkingSourceAttribution||'주차장 정보 출처 확인 필요')} · ${escapeHtml(parkingDataFreshness(parking).label)}</p><div class="parking-info-actions"><button class="route-button" id="parkingInfoRoute">이곳으로 길안내</button><button class="parking-info-plan" id="parkingInfoPlan">주차 플랜에서 비교</button></div>`;
  showSheet('#parkingInfoSheet');
  $('#parkingInfoRoute').addEventListener('click',()=>selectNavigation(parking.name));
  $('#parkingInfoPlan').addEventListener('click',openPlanner);
}

window.showParkingInfo=(parkingId,rank)=>{
  const parking=allParkingCandidates().find(candidate=>(candidate.id||candidate.name)===parkingId)||parkingTemplates.find(candidate=>(candidate.id||candidate.name)===parkingId);
  if(parking)openParkingInfo(parking,rank);
};

function renderParkings(){
  const start=$('#startTime').value,end=$('#endTime').value;
  const duration=Math.max(0,(minutes(end)||0)-(minutes(start)||0));
  $('#parkingSummary').textContent=`${Math.floor(duration/60)}시간 ${duration%60?duration%60+'분 ':''}주차 기준`;
  $('.parking-summary b').textContent=weatherTemperatureCopy();
  if(parkingDataState==='loading'){
    $('#parkingTrustSummary').innerHTML='<b>이용 가능한 주차장을 확인하고 있어요</b><span>이용 가능 여부와 요금 규칙을 검증하는 중이에요.</span>';
    $('#parkingList').innerHTML='<div class="parking-loading" aria-hidden="true"><i></i><i></i><i></i></div>';
    return;
  }
  const list=currentParkingList();
  const report=parkingValidationReport();
  const excludedReasons=[report.scheduleExcluded&&`운영시간 ${report.scheduleExcluded}곳`,report.feeExcluded&&`요금 ${report.feeExcluded}곳`,report.capacityExcluded&&`주차면수 ${report.capacityExcluded}곳`].filter(Boolean).join(' · ');
  $('#parkingTrustSummary').innerHTML=`<b>신뢰 가능한 주차장 ${report.trusted}곳을 찾았어요.</b><span>${excludedReasons?`${excludedReasons}은 정보가 불확실해 제외했어요.`:'선택한 시간의 이용 가능 여부와 요금을 확인했어요.'}${parkingDataState==='demo'?' 현재는 샘플 데이터입니다.':''}</span>`;
  $('#parkingList').innerHTML=list.length?list.map(parking=>{const capacity=Number.isFinite(Number(parking.capacity))?`${Number(parking.capacity).toLocaleString()}면`:'주차면수 확인 필요';return `<article class="parking-item parking-plan-rank-${parking.recommendationRank}"><div class="parking-plan-head"><span class="parking-plan-option" aria-label="${parking.recommendationRank}위">${parking.recommendationRank}</span><span class="parking-plan-reason"><b>${parkingPriority==='distance'?'거리 우선':parkingPriority==='price'?'가격 우선':'대형 주차장 우선'}</b><small>${escapeHtml(rankedSelectionReason(parking))}</small></span></div><span class="parking-type">${escapeHtml(parking.type)} 주차장</span><h3>${escapeHtml(parking.name)}</h3><div class="parking-meta"><span>도보 ${parking.walk}분</span><span>${escapeHtml(parkingHours(parking))}</span><span>${escapeHtml(capacity)}</span></div><div class="parking-stats"><div class="criterion-stat"><span>예상 요금</span><b>${formatCost(parking)}</b><small>${escapeHtml(parkingFeeBasis(parking))}</small></div><div><span>혼잡도</span><b>제공 안 됨</b></div></div><div class="parking-actions"><button class="route-button" data-route="${escapeHtml(parking.name)}">이곳으로 길안내</button><button class="full-button" data-full="${escapeHtml(parking.name)}">이 주차장 제외</button></div></article>`;}).join(''):`<div class="parking-item parking-empty"><h3>확실하게 추천할 주차장이 없어요</h3><p class="place-description">선택한 시간에 이용 가능하며 요금을 계산할 수 있는 후보가 없습니다. 시간을 바꾸거나 공식 주차 정보를 확인해 주세요.</p><button class="primary-button" id="resetParking">제외한 후보 다시 보기</button></div>`;
  document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>selectNavigation(button.dataset.route)));
  document.querySelectorAll('[data-full]').forEach(button=>button.addEventListener('click',()=>markFull(button.dataset.full)));
  if($('#resetParking'))$('#resetParking').addEventListener('click',()=>{excludedParkings=[];renderParkings();toast('새로운 후보를 다시 계산했어요.');});
}

function openPlanner(){
  $('#plannerTitle').textContent=`${activePlace.name} 주차 플랜`;
  excludedParkings=[];
  parkingDataState='loading';
  renderParkings();
  resetPlannerSheetDrag();
  $('#plannerSheet').scrollTop=0;
  showSheet('#plannerSheet');
  loadParkingForActivePlace();
}

function markFull(name){
  excludedParkings.push(name);
  renderParkings();
  if(isPlaceFocused)renderMap();
  if(currentParkingList().length)toast(`${name}을 제외하고 종합 추천 순위를 다시 계산했어요.`);
  else toast('주변 후보를 다시 계산해 주세요.');
}

function selectNavigation(parkingName){
  pendingParking=parkingName;
  const saved=localStorage.getItem('daejeonMap.preferredNavigation');
  if(saved){toast(`${saved}로 ${parkingName} 안내를 시작해요.`);return}
  $('#navigationModal').classList.add('show');
}

function festivalDestination(place=activePlace){
  return window.NavigationLinks?.normalizeDestination({name:place?.name,lat:place?.lat,lng:place?.lng})||null;
}

function navigationConfig(){
  if(!navigationConfigPromise){
    navigationConfigPromise=fetch('/api/navigation-config',{headers:{Accept:'application/json'}})
      .then(response=>response.ok?response.json():Promise.reject(new Error(`navigation_config_${response.status}`)))
      .then(config=>({
        kakaoJavaScriptKey:String(config?.kakaoJavaScriptKey||'').trim()||null,
        tmapAvailable:Boolean(config?.tmapAvailable)
      }))
      .catch(()=>({kakaoJavaScriptKey:null,tmapAvailable:false}));
  }
  return navigationConfigPromise;
}

function festivalTravelProviders(mode){
  if(mode==='transit')return [
    {id:'naver-map',label:'네이버지도',iconUrl:'assets/navigation/naver-map-app-icon.png',tone:'naver'},
    {id:'kakao-map',label:'카카오맵',iconUrl:'assets/navigation/kakao-map-app-icon.png',tone:'kakao-map'}
  ];
  return [
    {id:'tmap',label:'티맵',iconUrl:'assets/navigation/tmap-app-icon.png',tone:'tmap'},
    {id:'naver-map',label:'네이버지도',iconUrl:'assets/navigation/naver-map-app-icon.png',tone:'naver'},
    {id:'kakao-navi',label:'카카오내비',iconUrl:'assets/navigation/kakao-navi-app-icon.png',tone:'kakao-navi'}
  ];
}

function renderFestivalTravelOptions(config=null){
  $('#festivalTravelOptions').classList.remove('festival-destination-options');
  const providers=festivalTravelProviders(festivalTravelMode);
  $('#festivalTravelOptions').innerHTML=providers.map(provider=>{
    const unavailable=festivalTravelMode==='navigation'&&config&&(
      (provider.id==='tmap'&&!config.tmapAvailable)
      ||(provider.id==='kakao-navi'&&!config.kakaoJavaScriptKey)
    );
    const reason=provider.id==='tmap'?'티맵 API 키 설정 필요':'카카오 JavaScript 키 설정 필요';
    const icon=provider.iconUrl
      ?`<i class="${provider.tone} app-icon"><img src="${escapeHtml(provider.iconUrl)}" alt="" /></i>`
      :`<i class="${provider.tone}">${provider.icon}</i>`;
    return `<button type="button" data-festival-provider="${provider.id}"${unavailable?` disabled aria-disabled="true" title="${reason}"`:''}>${icon}<span>${provider.label}</span>${unavailable?'<small>설정 필요</small>':''}</button>`;
  }).join('');
}

function regionalParkingMock(place=activePlace){
  const seed=[...String(place?.name||'')].reduce((sum,char)=>sum+char.charCodeAt(0),0);
  return {
    id:`regional-parking-mock-${place?.id||'festival'}`,
    name:'축제 인근 공영주차장 (예시)',
    type:'공영',
    walk:6+seed%7,
    dataStatus:'regional-mock'
  };
}

function festivalNavigationParkingChoice(){
  if(parkingDataState==='loading')return {status:'loading',parking:null};
  const parking=currentParkingList()[0]||null;
  if(parkingDataState==='live'){
    if(parking&&festivalDestination(parking))return {status:'available',parking};
    const algorithmTop=parkingTemplates.find(candidate=>festivalDestination(candidate));
    if(algorithmTop)return {status:'available',parking:algorithmTop,visitTimeFallback:true};
    return {status:'unavailable',parking:null};
  }
  return {
    status:'mock',
    reason:parkingDataState==='regional-unavailable'?'regional':'demo',
    parking:parking||regionalParkingMock(activePlace)
  };
}

function parkingChoiceMarkup(choice){
  if(choice.status==='loading')return '<button type="button" class="festival-destination-choice parking loading" disabled><span class="destination-choice-copy"><small>공영주차장</small><b>추천 주차장을 확인하고 있어요</b><em>이용 가능 여부와 요금을 반영해 선정 중이에요</em></span></button>';
  if(choice.status==='unavailable')return '<button type="button" class="festival-destination-choice parking unavailable" data-festival-destination="parking" data-destination-available="false" aria-disabled="true"><span class="destination-choice-copy"><small>공영주차장</small><b>추천할 수 있는 주차장이 없어요</b><em>현재 조건에 맞는 공영주차장을 찾지 못했어요</em></span></button>';
  const parking=choice.parking;
  const mock=choice.status==='mock';
  return `<button type="button" class="festival-destination-choice parking${mock?' mock':''}" data-festival-destination="parking" data-destination-available="${String(!mock)}"${mock?' aria-disabled="true"':''}><span class="destination-choice-copy"><small>공영주차장${mock?' · 목업 데이터':''}</small><b>${escapeHtml(parking.name)}</b><em>가장 추천하는 공영주차장이에요</em><strong>축제장까지 도보 ${Number(parking.walk)||0}분</strong>${choice.visitTimeFallback?`<u>${escapeHtml(parkingHours(parking))} · 요금 확인</u>`:''}</span><span class="destination-choice-arrow" aria-hidden="true">→</span></button>`;
}

function renderFestivalNavigationDestinations(){
  const destination=festivalDestination();
  const choice=festivalNavigationParkingChoice();
  festivalTravelStage='destination';
  pendingFestivalDestination=destination;
  $('#festivalTravelBack').hidden=true;
  $('#festivalTravelEyebrow').textContent='자동차 길찾기';
  $('#festivalTravelTitle').textContent='어디까지 안내할까요?';
  $('#festivalTravelDestination').textContent=activePlace.name;
  $('#festivalTravelNote').textContent=choice.status==='mock'
    ?choice.reason==='regional'
      ?'대전 외 지역의 주차장 정보는 화면 확인용 목업이며 실제 길안내를 제공하지 않아요.'
      :'현재 주차장 정보는 샘플 데이터라 실제 길안내를 제공하지 않아요.'
    :choice.visitTimeFallback
      ?'요금을 계산할 수 있는 후보가 없어 알고리즘 1위 주차장을 보여드려요. 유료 시간을 확인해 주세요.'
      :'주차장은 현재 방문 조건을 반영한 기존 추천 결과의 첫 번째 후보예요.';
  const options=$('#festivalTravelOptions');
  options.classList.add('festival-destination-options');
  options.innerHTML=`<button type="button" class="festival-destination-choice festival" data-festival-destination="festival" data-destination-available="true"><span class="destination-choice-copy"><small>축제 위치</small><b>${escapeHtml(destination.name)}</b><em>축제 위치로 바로 안내해요</em></span><span class="destination-choice-arrow" aria-hidden="true">→</span></button>${parkingChoiceMarkup(choice)}`;
}

function waitForParkingChoice(timeout=8000){
  if(parkingDataState!=='loading')return Promise.resolve();
  return new Promise(resolve=>{
    const started=Date.now();
    const check=()=>{
      if(parkingDataState!=='loading'||Date.now()-started>=timeout){resolve();return;}
      window.setTimeout(check,120);
    };
    check();
  });
}

function renderFestivalProviderStep(destination){
  if(!destination){toast('길안내 목적지의 정확한 위치를 확인하지 못했어요.');return;}
  festivalTravelStage='provider';
  pendingFestivalDestination=destination;
  $('#festivalTravelBack').hidden=festivalTravelMode!=='navigation';
  $('#festivalTravelEyebrow').textContent=festivalTravelMode==='transit'?'대중교통 앱 선택':'내비게이션 앱 선택';
  $('#festivalTravelTitle').textContent=festivalTravelMode==='transit'?'어떤 지도로 갈까요?':'어떤 내비로 갈까요?';
  $('#festivalTravelDestination').textContent=destination.name;
  $('#festivalTravelNote').textContent=festivalTravelMode==='transit'
    ?'현재 위치 권한을 허용하면 출발지까지 함께 전달해요.'
    :'선택한 앱에서 바로 자동차 길안내를 시작해요.';
  renderFestivalTravelOptions();
  if(festivalTravelMode==='navigation')navigationConfig().then(config=>{
    if($('#festivalTravelModal').classList.contains('show')&&festivalTravelMode==='navigation'&&festivalTravelStage==='provider')renderFestivalTravelOptions(config);
  });
}

function selectFestivalNavigationDestination(kind){
  if(kind==='festival'){renderFestivalProviderStep(festivalDestination());return;}
  const choice=festivalNavigationParkingChoice();
  if(choice.status!=='available'){
    toast(choice.status==='mock'?(choice.reason==='regional'?'대전 외 지역 주차장은 목업 정보라 실제 길안내를 제공하지 않아요.':'샘플 주차장 정보로는 실제 길안내를 제공하지 않아요.'):'현재 조건에서 안내할 공영주차장을 찾지 못했어요.');
    return;
  }
  renderFestivalProviderStep(festivalDestination(choice.parking));
}

function closeFestivalTravel(){
  $('#festivalTravelModal').classList.remove('show');
  festivalTravelStage='provider';
  $('#festivalTravelBack').hidden=true;
  const trigger=festivalTravelLastTrigger;
  festivalTravelLastTrigger=null;
  window.setTimeout(()=>trigger?.focus(),0);
}

function openFestivalTravel(mode,trigger){
  const destination=festivalDestination();
  if(!destination){toast('이 축제의 정확한 위치가 없어 길안내를 시작할 수 없어요.');return;}
  festivalTravelMode=mode;
  festivalTravelLastTrigger=trigger||document.activeElement;
  $('#festivalTravelModal').classList.add('show');
  $('#closeFestivalTravel').focus();
  if(mode==='navigation'){
    renderFestivalNavigationDestinations();
    waitForParkingChoice().then(()=>{
      if($('#festivalTravelModal').classList.contains('show')&&festivalTravelMode==='navigation'&&festivalTravelStage==='destination')renderFestivalNavigationDestinations();
    });
    return;
  }
  renderFestivalProviderStep(destination);
}

function guidanceCurrentPosition(){
  if(window.NavigationLinks?.normalizeOrigin(userPosition))return Promise.resolve(userPosition);
  if(!navigator.geolocation)return Promise.resolve(null);
  return new Promise(resolve=>navigator.geolocation.getCurrentPosition(position=>{
    userPosition={lat:position.coords.latitude,lng:position.coords.longitude};
    resolve(window.NavigationLinks?.normalizeOrigin(userPosition)||null);
  },()=>resolve(null),{enableHighAccuracy:true,timeout:6000,maximumAge:60000}));
}

function launchWithFallback(primaryUrl,fallbackUrl,delay=1600){
  if(!primaryUrl){if(fallbackUrl)window.location.assign(fallbackUrl);return;}
  let pageHidden=false;
  const visibilityHandler=()=>{if(document.visibilityState==='hidden')pageHidden=true;};
  document.addEventListener('visibilitychange',visibilityHandler);
  window.setTimeout(()=>{
    document.removeEventListener('visibilitychange',visibilityHandler);
    if(!pageHidden&&fallbackUrl)window.location.assign(fallbackUrl);
  },delay);
  window.location.assign(primaryUrl);
}

async function launchFestivalTravel(provider){
  const links=window.NavigationLinks;
  const destination=pendingFestivalDestination;
  const mode=festivalTravelMode;
  if(!links||!destination){toast('길안내 링크를 준비하지 못했어요. 잠시 후 다시 시도해 주세요.');return;}
  const platform=links.platformFromUserAgent(navigator.userAgent);
  const origin=mode==='transit'?await guidanceCurrentPosition():null;

  if(provider==='naver-map'){
    const naverUrl=links.buildNaverUrl(mode,destination,origin,window.location.origin);
    closeFestivalTravel();
    if(platform==='android')return window.location.assign(links.buildNaverAndroidIntent(naverUrl));
    if(platform==='ios')return launchWithFallback(naverUrl,'https://itunes.apple.com/app/id311867728?mt=8');
    return window.location.assign(links.buildNaverWebUrl(destination));
  }

  if(provider==='kakao-map'){
    const webUrl=links.buildKakaoMapWebUrl(destination,origin);
    closeFestivalTravel();
    if(!origin){
      toast('현재 위치를 확인하지 못했어요. 카카오맵에서 출발지를 설정해 주세요.');
      return window.location.assign(webUrl);
    }
    if(platform==='desktop')return window.location.assign(webUrl);
    return launchWithFallback(
      links.buildKakaoMapAppUrl(destination,origin),
      links.buildKakaoMapMobileUrl(destination,origin)
    );
  }

  if(provider==='tmap'){
    const config=await navigationConfig();
    if(!config.tmapAvailable){toast('티맵 연결 설정이 아직 완료되지 않았어요.');return;}
    closeFestivalTravel();
    return window.location.assign(links.buildTmapRedirectUrl(destination));
  }

  if(provider==='kakao-navi'){
    const config=await navigationConfig();
    if(!config.kakaoJavaScriptKey||!window.Kakao){toast('카카오내비 연결 설정이 아직 완료되지 않았어요.');return;}
    try{
      if(!links.initializeKakaoNavi(window.Kakao,config.kakaoJavaScriptKey)){
        toast('카카오내비 기능을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
        return;
      }
      closeFestivalTravel();
      window.Kakao.Navi.start({name:destination.name,x:destination.lng,y:destination.lat,coordType:'wgs84'});
    }catch{
      toast('카카오내비를 여는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
    }
  }
}

function setSurveyProgress(step){
  $('#questionStep').textContent=`${step} / ${totalSurveySteps}`;
  $('#progressBar').style.width=`${step/totalSurveySteps*100}%`;
}
function startTest(){
  $('.onboarding-card').classList.remove('showing-result');
  questionIndex=0;
  answers=[];
  visitConditions={companions:null,activity:null,mobility:null,venue:null};
  renderQuestion();
}
function renderQuestion(){
  const question=questions[questionIndex];
  setSurveyProgress(questionIndex+1);
  $('#questionArea').innerHTML=`<p class="test-kicker">오늘의 방문 조건 ${questionIndex+1}</p><h2>${question.q}</h2><p class="test-description">${escapeHtml(question.description)}</p><div class="answer-list">${question.answers.map(([text,type,value])=>`<button class="answer-button" data-type="${type}" data-value="${value}">${text}</button>`).join('')}</div>`;
  document.querySelectorAll('.answer-button').forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.type)answers.push(button.dataset.type);
    visitConditions[question.key]=button.dataset.value;
    questionIndex++;
    questionIndex<questions.length?renderQuestion():showResult();
  }));
}

function showResult(){
  tasteProfile=calculateTasteProfile(answers);
  localStorage.setItem('daejeonMap.personalityProfile',JSON.stringify(tasteProfile));
  localStorage.setItem('daejeonMap.personalityResult',tasteProfile.primary);
  localStorage.setItem('daejeonMap.onboardingCompleted','true');
  applyTasteProfileUI();
  refreshRecommendationScoreCache();
  renderFestivals();
  renderRankings();
  $('.onboarding-card').classList.add('showing-result');
  $('#questionStep').textContent='완료';
  $('#progressBar').style.width='100%';
  const labels={solo:'혼자',friends:'연인·친구',family:'가족',festival:'축제',experience:'체험',mood:'감성',rest:'휴식',near:'가까운 지역 위주',any:'전국 어디든',indoor:'실내 위주',both:'실내·야외 모두'};
  const selected=Object.values(visitConditions).map(value=>labels[value]).filter(Boolean);
  $('#questionArea').innerHTML=`<p class="test-kicker">방문 조건 설정 완료</p><h2>이제 나에게 맞는 축제를<br />만나볼 차례예요.</h2><div class="result-tags">${selected.map(label=>`<span>${escapeHtml(label)}</span>`).join('')}</div><div class="result-trust-copy"><b>이렇게 추천해요.</b><span>설정한 취향과 여행 날짜를 바탕으로 축제를 추천해요. 즐겨찾기할수록 추천이 더 내 취향에 가까워져요.</span></div><button class="primary-button" id="finishTest">맞춤 축제 둘러보기 <span>→</span></button>`;
  $('#finishTest').addEventListener('click',()=>closeOnboarding(true));
}

function closeOnboarding(useCurrentLocation=false){
  localStorage.setItem('daejeonMap.usageGuideSeen','true');
  localStorage.setItem('daejeonMap.onboardingCompleted','true');
  $('#onboardingModal').classList.remove('show');
  if(useCurrentLocation)moveToCurrentLocation();
}

function showOnboardingEntry(){
  $('#usageGuide').hidden=true;
  $('#entryIntro').hidden=false;
  $('.onboarding-card').classList.remove('showing-guide');
  $('#questionStep').textContent='START';
  $('#progressBar').style.width='0';
  $('#onboardingModal').setAttribute('aria-labelledby','entryTitle');
}

function completeUsageGuide(){
  localStorage.setItem('daejeonMap.usageGuideSeen','true');
  showOnboardingEntry();
}

function recommendationState(){
  const section=$('.recommend-section');
  if(section.classList.contains('is-collapsed'))return 'collapsed';
  if(section.classList.contains('is-expanded'))return 'expanded';
  return 'preview';
}

function setRecommendationsState(state){
  const section=$('.recommend-section');
  const collapsed=state==='collapsed';
  const expanded=state==='expanded';
  section.classList.toggle('is-collapsed',collapsed);
  section.classList.toggle('is-expanded',expanded);
  $('.app-shell').classList.toggle('recommend-collapsed',collapsed);
  $('.app-shell').classList.toggle('recommend-expanded',expanded);
  const handle=$('#recommendSheetHandle');
  handle.setAttribute('aria-expanded',String(expanded));
  handle.setAttribute('aria-label',collapsed?'추천 펼치기':expanded?'추천 기본 높이로 줄이기':'추천 순위까지 펼치기');
  if(!expanded){
    section.scrollTop=0;
    setFestivalDateFilterOpen(false);
  }
  if(collapsed)stopFestivalAutoplay();
  else scheduleFestivalAutoplay();
}

function suppressNextRecommendSheetClick(){
  suppressRecommendSheetGestureClick=true;
  clearTimeout(recommendGestureClickTimer);
  recommendGestureClickTimer=window.setTimeout(()=>{suppressRecommendSheetGestureClick=false;},300);
}

function blockRecommendSheetGestureClick(event){
  if(!suppressRecommendSheetGestureClick)return;
  suppressRecommendSheetGestureClick=false;
  clearTimeout(recommendGestureClickTimer);
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function isRecommendSheetInteractiveTarget(target){
  return target instanceof Element
    && Boolean(target.closest('button, a, input, select, textarea, [contenteditable="true"]'));
}

function isRecommendSheetTopPullTarget(event,section){
  const target=event.target;
  return section.classList.contains('is-expanded')
    && section.scrollTop<=1
    && target instanceof Element
    && !target.closest('.recommend-sheet-grabber')
    && !isRecommendSheetInteractiveTarget(target);
}

function collapseRecommendationsOnWheel(event){
  const section=$('.recommend-section');
  if(!section.classList.contains('is-expanded')||section.scrollTop>1||event.deltaY>=0)return;
  event.preventDefault();
  setRecommendationsState('preview');
}

function beginRecommendSheetTopPull(event){
  const section=$('.recommend-section');
  if(!section.classList.contains('is-expanded')||section.scrollTop>1||event.touches.length!==1){
    recommendSheetTopPull=null;
    return;
  }
  const target=event.target;
  if(!(target instanceof Element)||target.closest('.recommend-sheet-grabber')||isRecommendSheetInteractiveTarget(target)){
    recommendSheetTopPull=null;
    return;
  }
  const touch=event.touches[0];
  recommendSheetTopPull={identifier:touch.identifier,startY:touch.clientY};
}

function moveRecommendSheetTopPull(event){
  if(!recommendSheetTopPull)return;
  const section=$('.recommend-section');
  const touch=Array.from(event.touches).find(item=>item.identifier===recommendSheetTopPull.identifier);
  if(!touch||!section.classList.contains('is-expanded')||section.scrollTop>1){
    recommendSheetTopPull=null;
    return;
  }
  const pullDistance=touch.clientY-recommendSheetTopPull.startY;
  if(pullDistance<0){
    recommendSheetTopPull=null;
    return;
  }
  if(pullDistance<=0)return;
  if(event.cancelable)event.preventDefault();
  if(pullDistance<10)return;
  recommendSheetTopPull=null;
  suppressNextRecommendSheetClick();
  setRecommendationsState('preview');
}

function resetRecommendSheetTopPull(){
  recommendSheetTopPull=null;
}

function beginRecommendSheetDrag(event){
  if(event.button!==undefined&&event.button!==0)return;
  if(recommendSheetDrag)return;
  const section=$('.recommend-section');
  if($('.app-shell').classList.contains('is-place-focused'))return;
  const fromGrabber=Boolean(event.target instanceof Element&&event.target.closest('.recommend-sheet-grabber'));
  const topPullCandidate=isRecommendSheetTopPullTarget(event,section);
  if(!fromGrabber&&!topPullCandidate)return;
  const state=recommendationState();
  const expandedHeight=section.offsetHeight;
  const previewHeight=Math.min(260,Math.max(244,window.innerHeight*.31));
  const peekHeight=34;
  const previewOffset=Math.max(0,expandedHeight-previewHeight);
  const collapsedOffset=Math.max(0,expandedHeight-peekHeight);
  const startOffset=state==='expanded'?0:state==='collapsed'?collapsedOffset:previewOffset;
  recommendSheetDrag={
    pointerId:event.pointerId,
    startY:event.clientY,
    startTime:performance.now(),
    startOffset,
    state,
    moved:false,
    previewOffset,
    collapsedOffset,
    fromGrabber,
    topPullCandidate
  };
  if(!topPullCandidate){
    section.classList.add('is-dragging');
    section.style.transform=`translateY(${recommendSheetDrag.startOffset}px)`;
  }
  if(fromGrabber&&event.pointerId!==undefined){try{event.currentTarget.setPointerCapture?.(event.pointerId);}catch{/* Pointer capture is optional. */}}
}

function moveRecommendSheetDrag(event){
  if(!recommendSheetDrag||event.pointerId!==recommendSheetDrag.pointerId)return;
  const delta=event.clientY-recommendSheetDrag.startY;
  if(recommendSheetDrag.topPullCandidate){
    if(delta<0){
      recommendSheetDrag=null;
      return;
    }
    if(delta<=0)return;
    event.preventDefault();
    if(delta<10)return;
    recommendSheetDrag=null;
    suppressNextRecommendSheetClick();
    setRecommendationsState('preview');
    return;
  }
  if(Math.abs(delta)>5)recommendSheetDrag.moved=true;
  const offset=dampGestureValue(recommendSheetDrag.startOffset+delta,0,recommendSheetDrag.collapsedOffset);
  $('.recommend-section').style.transform=`translateY(${offset}px)`;
  if(recommendSheetDrag.moved)event.preventDefault();
}

function endRecommendSheetDrag(event){
  if(!recommendSheetDrag||event.pointerId!==recommendSheetDrag.pointerId)return;
  const drag=recommendSheetDrag;
  const delta=event.clientY-drag.startY;
  const velocity=gestureVelocity(delta,drag.startTime);
  const endOffset=Math.max(0,Math.min(drag.collapsedOffset,drag.startOffset+delta));
  recommendSheetDrag=null;
  suppressNextRecommendSheetClick();
  const isTap=Math.abs(delta)<10;
  let nextState=drag.state;
  if(isTap){
    nextState=drag.state==='collapsed'?'preview':drag.state==='preview'?'expanded':'preview';
  }else if(drag.state==='expanded'){
    nextState=delta>54||velocity>GESTURE_VELOCITY_THRESHOLD?'preview':'expanded';
  }else if(drag.state==='collapsed'){
    nextState=delta<-42||velocity<-GESTURE_VELOCITY_THRESHOLD?'preview':'collapsed';
  }else if(delta<-52||velocity<-GESTURE_VELOCITY_THRESHOLD){
    nextState='expanded';
  }else if(delta>52||velocity>GESTURE_VELOCITY_THRESHOLD){
    nextState='collapsed';
  }else{
    const snaps=[['expanded',0],['preview',drag.previewOffset],['collapsed',drag.collapsedOffset]];
    nextState=snaps.sort((a,b)=>Math.abs(endOffset-a[1])-Math.abs(endOffset-b[1]))[0][0];
  }
  setRecommendationsState(nextState);
  requestAnimationFrame(()=>{
    const section=$('.recommend-section');
    section.classList.remove('is-dragging');
    section.style.removeProperty('transform');
  });
}

function cancelRecommendSheetDrag(event){
  if(!recommendSheetDrag||event.pointerId!==recommendSheetDrag.pointerId)return;
  const state=recommendSheetDrag.state;
  recommendSheetDrag=null;
  setRecommendationsState(state);
  requestAnimationFrame(()=>{
    const section=$('.recommend-section');
    section.classList.remove('is-dragging');
    section.style.removeProperty('transform');
  });
}

function searchablePlaces(query=''){
  const terms=String(query||'').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const source=terms.length?places:[...places].sort((a,b)=>recommendationScoreFor(b)-recommendationScoreFor(a));
  return source.filter(place=>{
    if(!terms.length)return true;
    const experience=experienceFor(place);
    const searchPlace=behaviorPlaceFor(place);
    const corpus=[
      place.name,place.address,place.region,compactPlaceArea(place),place.summary,place.description,
      experience.venue,experience.audience,...(experience.tags||[]),
      ...(experience.highlights||[]).flatMap(item=>[item.title,item.description]),
      JSON.stringify(place.metadata||{})
    ].map(value=>String(value||'').toLowerCase().replace(/\s+/g,'')).join(' ');
    return terms.every(term=>{
      const normalized=term.replace(/\s+/g,'');
      const topicQuery=Boolean(festivalRecommender?.topicTokens({name:term}).size);
      if(topicQuery)return Boolean(festivalRecommender.matchesTopicQuery(searchPlace,term));
      return Boolean(festivalRecommender?.matchesRegionQuery(searchPlace,term))||corpus.includes(normalized);
    });
  }).slice(0,8);
}

function renderSearchResults(query=''){
  const results=searchablePlaces(query);
  $('#searchResults').innerHTML=results.length?results.map(place=>`<button class="search-result" data-search-place="${escapeHtml(place.id)}"><span>${searchResultMetaMarkup(place)}<b>${escapeHtml(place.name)}</b><em>${escapeHtml(place.address||experienceFor(place).venue||place.summary)}</em></span></button>`).join(''):`<p class="search-empty">검색 결과가 없어요. 다른 축제 이름이나 지역을 입력해 보세요.</p>`;
  document.querySelectorAll('[data-search-place]').forEach(button=>button.addEventListener('click',()=>{
    $('#searchModal').classList.remove('show');
    openPlace(button.dataset.searchPlace);
  }));
}

function openSearch(){
  $('#searchModal').classList.add('show');
  $('#placeSearchInput').value='';
  renderSearchResults();
  requestAnimationFrame(()=>$('#placeSearchInput').focus());
}

function toast(message){
  $('#toast').textContent=message;$('#toast').classList.add('show');
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2400);
}

applyTasteProfileUI();refreshRecommendationScoreCache();renderFestivals();renderRankings();initNaverMap();loadPlaces();startRecommendationRefreshSchedule();
$('#visitDate').value=new Date().toISOString().slice(0,10);
if(localStorage.getItem('daejeonMap.onboardingCompleted')==='true')$('#onboardingModal').classList.remove('show');
if(localStorage.getItem('daejeonMap.usageGuideSeen')==='true')showOnboardingEntry();
$('#continueToEntry').addEventListener('click',completeUsageGuide);
$('#startTest').addEventListener('click',startTest);
$('#skipTest').addEventListener('click',()=>closeOnboarding(false));
$('#destinationEntry').addEventListener('click',()=>{closeOnboarding(false);window.setTimeout(openSearch,180);});
$('#retestButton').addEventListener('click',()=>{localStorage.removeItem('daejeonMap.onboardingCompleted');localStorage.removeItem('daejeonMap.usageGuideSeen');localStorage.removeItem('daejeonMap.personalityProfile');localStorage.removeItem('daejeonMap.personalityResult');location.reload();});
$('.recommend-section').addEventListener('pointerdown',beginRecommendSheetDrag);
$('.recommend-section').addEventListener('wheel',collapseRecommendationsOnWheel,{passive:false});
$('.recommend-section').addEventListener('touchstart',beginRecommendSheetTopPull,{passive:true});
$('.recommend-section').addEventListener('touchmove',moveRecommendSheetTopPull,{passive:false});
$('.recommend-section').addEventListener('touchend',resetRecommendSheetTopPull,{passive:true});
$('.recommend-section').addEventListener('touchcancel',resetRecommendSheetTopPull,{passive:true});
$('.recommend-section').addEventListener('click',blockRecommendSheetGestureClick,true);
document.addEventListener('pointermove',moveRecommendSheetDrag,{passive:false});
document.addEventListener('pointerup',endRecommendSheetDrag);
document.addEventListener('pointercancel',cancelRecommendSheetDrag);
$('#recommendSheetHandle').addEventListener('click',()=>{
  if(suppressRecommendSheetGestureClick){suppressRecommendSheetGestureClick=false;return;}
  const state=recommendationState();
  setRecommendationsState(state==='collapsed'?'preview':state==='preview'?'expanded':'preview');
});
$('#festivalStartDate').addEventListener('change',()=>applyFestivalDateFilter('start'));
$('#festivalEndDate').addEventListener('change',()=>applyFestivalDateFilter('end'));
$('#clearFestivalDates').addEventListener('click',clearFestivalDateFilter);
$('#festivalDateTrigger').addEventListener('click',()=>setFestivalDateFilterOpen($('#festivalDateFilter').hidden));
document.querySelectorAll('[data-ranking-filter]').forEach(button=>button.addEventListener('click',()=>{
  rankingFilter=button.dataset.rankingFilter;
  document.querySelectorAll('[data-ranking-filter]').forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));});
  renderRankings();
}));
document.querySelectorAll('[data-parking-priority]').forEach(button=>button.addEventListener('click',()=>{
  parkingPriority=button.dataset.parkingPriority;
  document.querySelectorAll('[data-parking-priority]').forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));});
  renderParkings();
  if(isPlaceFocused)renderMap();
}));
$('#sheetBackdrop').addEventListener('click',closeSheets);
$('#recalculate').addEventListener('click',()=>{parkingWeather=null;renderParkings();loadParkingForActivePlace();toast('선택한 시간으로 요금을 다시 계산했어요.');});
$('#closeNav').addEventListener('click',()=>$('#navigationModal').classList.remove('show'));
document.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>{localStorage.setItem('daejeonMap.preferredNavigation',button.dataset.nav);$('#navigationModal').classList.remove('show');toast(`${button.dataset.nav}로 ${pendingParking} 안내를 시작해요.`);}));
$('#closeFestivalTravel').addEventListener('click',closeFestivalTravel);
$('#festivalTravelBack').addEventListener('click',()=>{
  if(festivalTravelMode==='navigation'&&festivalTravelStage==='provider')renderFestivalNavigationDestinations();
});
$('#festivalTravelModal').addEventListener('click',event=>{if(event.target===$('#festivalTravelModal'))closeFestivalTravel();});
$('#festivalTravelOptions').addEventListener('click',async event=>{
  const destinationButton=event.target.closest('[data-festival-destination]');
  if(destinationButton){
    selectFestivalNavigationDestination(destinationButton.dataset.festivalDestination);
    return;
  }
  const button=event.target.closest('[data-festival-provider]');
  if(!button||button.disabled)return;
  document.querySelectorAll('[data-festival-provider]').forEach(option=>{option.disabled=true;});
  await launchFestivalTravel(button.dataset.festivalProvider);
  if($('#festivalTravelModal').classList.contains('show')&&festivalTravelStage==='provider'){
    const config=festivalTravelMode==='navigation'?await navigationConfig():null;
    renderFestivalTravelOptions(config);
  }
});
$('#currentButton').addEventListener('click',moveToCurrentLocation);
$('#favoriteMapButton').addEventListener('click',toggleFavoriteMapFilter);
document.querySelectorAll('[data-map-topic]').forEach(button=>button.addEventListener('click',()=>toggleMapTopicFilter(button.dataset.mapTopic)));
$('#festivalSlider').addEventListener('pointerdown',()=>deferFestivalAutoplay());
$('#festivalSlider').addEventListener('wheel',()=>deferFestivalAutoplay(),{passive:true});
$('#festivalSlider').addEventListener('mouseenter',stopFestivalAutoplay);
$('#festivalSlider').addEventListener('mouseleave',()=>scheduleFestivalAutoplay());
$('#festivalSlider').addEventListener('focusin',stopFestivalAutoplay);
$('#festivalSlider').addEventListener('focusout',()=>deferFestivalAutoplay(FESTIVAL_AUTOPLAY_INTERVAL_MS));
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){stopFestivalAutoplay();return;}
  scheduleFestivalAutoplay();
  if(Date.now()-recommendationLastRefreshedAt>=RECOMMENDATION_REFRESH_INTERVAL_MS)refreshFestivalRecommendations();
});
festivalMotionPreference.addEventListener?.('change',event=>event.matches?stopFestivalAutoplay():scheduleFestivalAutoplay());
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  if($('#festivalTravelModal').classList.contains('show')){event.preventDefault();closeFestivalTravel();return;}
  if(isPlaceFocused){event.preventDefault();resetMapFocus();}
});
$('#searchButton').addEventListener('click',openSearch);
$('#closeSearch').addEventListener('click',()=>$('#searchModal').classList.remove('show'));
$('#searchModal').addEventListener('click',event=>{if(event.target===$('#searchModal'))$('#searchModal').classList.remove('show');});
$('#placeSearchForm').addEventListener('submit',event=>{event.preventDefault();renderSearchResults($('#placeSearchInput').value);});
$('#placeSearchInput').addEventListener('input',()=>renderSearchResults($('#placeSearchInput').value));
document.querySelectorAll('[data-search-query]').forEach(button=>button.addEventListener('click',()=>{$('#placeSearchInput').value=button.dataset.searchQuery;renderSearchResults(button.dataset.searchQuery);}));
$('#placeSheet').addEventListener('pointerdown',beginPlaceSheetDrag);
$('#placeSheet').addEventListener('wheel',expandPlaceSheetOnWheel,{passive:false});
$('#placeSheet').addEventListener('touchstart',beginPlaceSheetTopPull,{passive:true});
$('#placeSheet').addEventListener('touchmove',movePlaceSheetTopPull,{passive:false});
$('#placeSheet').addEventListener('touchend',resetPlaceSheetTopPull,{passive:true});
$('#placeSheet').addEventListener('touchcancel',resetPlaceSheetTopPull,{passive:true});
document.addEventListener('pointermove',movePlaceSheetDrag,{passive:false});
document.addEventListener('pointerup',endPlaceSheetDrag);
document.addEventListener('pointercancel',endPlaceSheetDrag);
$('#placeSheetHandle').addEventListener('click',()=>{
  if(suppressPlaceSheetGestureClick){suppressPlaceSheetGestureClick=false;return;}
  if($('#placeSheet').classList.contains('is-expanded'))setPlaceSheetExpanded(false);
  else setPlaceSheetExpanded(true);
});
$('#plannerSheet').addEventListener('pointerdown',beginPlannerSheetDrag);
$('#parkingInfoSheet').addEventListener('pointerdown',beginPlannerSheetDrag);
document.addEventListener('pointermove',movePlannerSheetDrag,{passive:false});
document.addEventListener('pointerup',endPlannerSheetDrag);
document.addEventListener('pointercancel',endPlannerSheetDrag);
$('#plannerSheetHandle').addEventListener('click',()=>{
  if(suppressPlannerSheetGestureClick){suppressPlannerSheetGestureClick=false;return;}
  closeSheets();
});
window.addEventListener('resize',()=>{if($('#placeSheet').classList.contains('show'))setPlaceSheetHeights();});
