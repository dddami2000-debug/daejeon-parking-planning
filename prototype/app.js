const fallbackPlaces = [
  {id:'zero',type:'festival',name:'대전 0시 축제',date:'축제',startDate:'2026-08-21',endDate:'2026-08-28',period:'8.21 — 8.28',hours:'14:00 — 00:00',distance:2.4,eta:12,taste:94,emoji:'🎆',imageUrl:'https://www.daejeon.go.kr/plugins/crosseditor4/binary/images/000396/20250822142519537_QFJ4O0PY.jpg',color:'#ff7657',tile:'#fff0eb',lat:36.3298,lng:127.4307,summary:'중앙로를 가득 채우는 음악과 퍼레이드, 야시장까지 즐기는 대전 대표 여름 축제예요.',reason:'공연·축제 취향과 94% 일치해요',gradient:'linear-gradient(135deg,#ff7657,#ed4e7a)'},
  {id:'science',type:'festival',name:'대전 사이언스 페스티벌',date:'축제',startDate:'2026-09-02',endDate:'2026-09-05',period:'9.02 — 9.05',hours:'10:00 — 20:00',distance:3.1,eta:16,taste:88,emoji:'🚀',imageUrl:'https://www.daejeon.go.kr/plugins/crosseditor4/binary/images/000326/20241016174536107_AEQ50TLH.png',color:'#8d72e1',tile:'#f0edff',lat:36.3746,lng:127.3869,summary:'과학도시 대전에서 만나는 로봇, 우주, AI 체험 프로그램을 한자리에서 즐겨요.',reason:'가족·체험 취향에 딱 맞아요',gradient:'linear-gradient(135deg,#8d72e1,#5f78e9)'},
  {id:'wine',type:'festival',name:'대전 국제 와인 EXPO',date:'축제',startDate:'2026-09-11',endDate:'2026-09-13',period:'9.11 — 9.13',hours:'11:00 — 21:00',distance:4.2,eta:19,taste:84,emoji:'🍇',imageUrl:'https://www.djwinefair.com/images/korean/new_202208/main/msection02/mp_tab04/mp_tab04_img02.JPG',color:'#a64f72',tile:'#faeaf1',lat:36.3741,lng:127.3860,summary:'와인과 미식, 음악을 함께 즐기는 감성 가득한 도심 속 축제예요.',reason:'감성·데이트 취향과 잘 맞아요',gradient:'linear-gradient(135deg,#a64f72,#e58580)'},
  {id:'arboretum',type:'landmark',name:'한밭수목원',date:'오늘 열림',period:'연중 운영',hours:'06:00 — 21:00',distance:1.2,eta:7,taste:91,emoji:'🌿',imageUrl:'https://daejeontour.co.kr/data/file/sights_djt/3068043556_6890dd6f8ab93_1______-_________-_________________2021_.jpg',color:'#55b98a',tile:'#e8f8ef',lat:36.3676,lng:127.3886,summary:'도심 한가운데서 천천히 걷고 쉬어갈 수 있는 대전의 대표 녹색 공간이에요.',reason:'지금 가장 가깝고 산책하기 좋아요',gradient:'linear-gradient(135deg,#58bd8e,#90d19a)'},
  {id:'expo',type:'landmark',name:'엑스포과학공원',date:'오늘 열림',period:'연중 운영',hours:'10:00 — 22:00',distance:2.8,eta:13,taste:86,emoji:'🌙',imageUrl:'https://daejeontour.co.kr/data/file/sights_djt/3068043556_6890dd1e8e472_13-____________________________2022_.jpg',color:'#6294f7',tile:'#eaf1ff',lat:36.3760,lng:127.3887,summary:'한빛탑과 엑스포다리를 따라 대전의 과학 감성과 야경을 함께 만날 수 있어요.',reason:'야경과 사진을 좋아한다면 추천해요',gradient:'linear-gradient(135deg,#4c8ef2,#77c8e9)'},
  {id:'history',type:'landmark',name:'대전근현대사전시관',date:'오늘 열림',period:'화—일 운영',hours:'10:00 — 18:00',distance:2.1,eta:11,taste:79,emoji:'🏛️',imageUrl:'https://daejeontour.co.kr/data/file/sights_djt/3068043556_6890db2c06474_________________.jpg',color:'#d08a45',tile:'#fff3e4',lat:36.3264,lng:127.4206,summary:'옛 충남도청 건축과 대전의 근현대 이야기를 차분하게 둘러볼 수 있어요.',reason:'역사·힐링 취향에 어울려요',gradient:'linear-gradient(135deg,#c27b3c,#e7b65e)'},
  {id:'cityhall',type:'landmark',name:'대전시청',address:'대전 서구 둔산로 100',date:'오늘 추천',period:'상시 방문',hours:'주변 시설별 확인',distance:0,eta:0,taste:78,emoji:'🏢',imageUrl:'https://cdn.irobotnews.com/news/photo/202504/38177_79807_174.jpg',color:'#5c83c6',tile:'#edf3ff',lat:36.3504,lng:127.3845,summary:'한밭수목원과 둔산동 상권을 함께 둘러보기 좋은 대전 도심의 기준점이에요.',reason:'둔산동 주변을 찾을 때 편리해요',gradient:'linear-gradient(135deg,#5c83c6,#82abd9)'},
  {id:'cnu',type:'landmark',name:'충남대학교',address:'대전 유성구 대학로 99',date:'오늘 추천',period:'상시 방문',hours:'시설별 확인',distance:0,eta:0,taste:80,emoji:'🎓',imageUrl:'https://plus.cnu.ac.kr/Upl/_board/sub07_0703/sub07_0703_0_1619134485.jpg',color:'#3f8a68',tile:'#e8f6ee',lat:36.3668,lng:127.3447,summary:'궁동과 유성의 식당, 카페, 산책 코스를 함께 찾기 좋은 대학가예요.',reason:'유성·궁동 나들이의 출발점으로 좋아요',gradient:'linear-gradient(135deg,#3f8a68,#7ab98f)'},
  {id:'sungsimdang',type:'landmark',name:'성심당 본점',address:'대전 중구 대종로480번길 15',date:'오늘 추천',period:'연중 운영',hours:'매장 운영시간 확인',distance:0,eta:0,taste:92,emoji:'🥐',imageUrl:'https://daejeontour.co.kr/data/editor/2508/1754106290_b7912a409f72cfea_clipboard_image_1754106288205.png',color:'#bd6f3f',tile:'#fff1e8',lat:36.3277,lng:127.4274,summary:'대전역과 은행동을 함께 둘러보며 대표 빵과 도심 분위기를 즐길 수 있어요.',reason:'대전다운 먹거리 코스로 추천해요',gradient:'linear-gradient(135deg,#bd6f3f,#e3a06f)'}
];

const landmarkPhotoOverrides = [
  {match:['한밭수목원'], imageUrl:'https://daejeontour.co.kr/data/file/sights_djt/3068043556_6890dd6f8ab93_1______-_________-_________________2021_.jpg'},
  {match:['엑스포과학공원','엑스포 과학공원'], imageUrl:'https://daejeontour.co.kr/data/file/sights_djt/3068043556_6890dd1e8e472_13-____________________________2022_.jpg'},
  {match:['대전근현대사전시관','근현대사전시관'], imageUrl:'https://daejeontour.co.kr/data/file/sights_djt/3068043556_6890db2c06474_________________.jpg'},
  {match:['대전시청'], imageUrl:'https://cdn.irobotnews.com/news/photo/202504/38177_79807_174.jpg'},
  {match:['충남대학교'], imageUrl:'https://plus.cnu.ac.kr/Upl/_board/sub07_0703/sub07_0703_0_1619134485.jpg'},
  {match:['성심당'], imageUrl:'https://daejeontour.co.kr/data/editor/2508/1754106290_b7912a409f72cfea_clipboard_image_1754106288205.png'}
];

const curatedExperiences = [
  {
    match:['0시 축제'],venue:'중앙로·은행동 일대',admission:'무료 프로그램 중심',audience:'친구 · 연인 · 가족',
    tags:['야간 축제','거리 공연','먹거리'],
    highlights:[
      {icon:'🎤',title:'도심 한복판 라이브',description:'중앙로 곳곳의 무대와 거리 공연을 따라 걸으며 축제 분위기를 즐겨요.'},
      {icon:'🎭',title:'퍼레이드 구경',description:'시간대별 행렬과 퍼포먼스를 가까이서 보고 사진도 남겨보세요.'},
      {icon:'🍢',title:'야시장 한 바퀴',description:'은행동 먹거리와 축제 부스를 함께 둘러보며 늦은 밤까지 즐겨요.'}
    ],
    tip:'저녁에는 중앙로 주변이 붐빌 수 있어요. 보고 싶은 공연 시간을 먼저 확인하고 대중교통이나 외곽 주차장을 이용하면 편해요.'
  },
  {
    match:['사이언스','과학축제'],venue:'대전컨벤션센터·엑스포과학공원 일대',admission:'무료·유료 체험 혼합',audience:'가족 · 학생 · 과학 팬',
    tags:['로봇·AI','우주 체험','가족 나들이'],
    highlights:[
      {icon:'🤖',title:'로봇·AI 체험',description:'직접 조작하고 결과를 확인하는 참여형 과학 프로그램을 골라 즐겨요.'},
      {icon:'🚀',title:'우주 테마 탐험',description:'전시와 체험 부스를 돌며 우주와 미래 기술 이야기를 만나보세요.'},
      {icon:'🧪',title:'과학 실험 미션',description:'가족이나 친구와 함께 짧게 참여할 수 있는 실험 프로그램에 도전해요.'}
    ],
    tip:'인기 체험은 현장 접수가 일찍 마감될 수 있어요. 방문 전 공식 시간표와 사전 예약 여부를 확인해 주세요.'
  },
  {
    match:['와인','Wine'],venue:'대전컨벤션센터 일대',admission:'프로그램별 이용권 확인',audience:'연인 · 친구 · 미식가',
    tags:['와인 시음','푸드 페어링','문화 공연'],
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
  {match:['와인 EXPO','와인엑스포'],category:'와인축제',area:'대전광역시 유성구 도룡동'},
  {match:['한밭수목원'],category:'수목원',area:'대전광역시 서구 만년동'},
  {match:['엑스포과학공원'],category:'과학공원',area:'대전광역시 유성구 도룡동'},
  {match:['근현대사전시관'],category:'전시관',area:'대전광역시 중구 선화동'},
  {match:['대전시청'],category:'공공기관',area:'대전광역시 서구 둔산동'},
  {match:['충남대학교'],category:'대학교',area:'대전광역시 유성구 궁동'},
  {match:['성심당'],category:'빵집',area:'대전광역시 중구 은행동'}
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
  {q:'친구와 갑자기 3시간이 비었어요. 어디로 갈까요?',answers:[['사람 많은 축제에서 신나게 놀기','공연·축제형'],['예쁜 공간에서 사진 남기기','감성·데이트형'],['새로운 체험을 함께 해보기','가족·체험형'],['조용한 곳을 천천히 걷기','역사·힐링형']]},
  {q:'나들이에서 절대 포기할 수 없는 한 가지는?',answers:[['현장 분위기와 음악','공연·축제형'],['예쁜 풍경과 맛있는 음식','감성·데이트형'],['함께 즐길 재미있는 프로그램','가족·체험형'],['붐비지 않는 여유','역사·힐링형']]},
  {q:'사진첩에 가장 많이 남아 있는 장면은?',answers:[['공연과 사람들의 열기','공연·축제형'],['노을, 야경, 감성 카페','감성·데이트형'],['웃고 있는 가족과 친구','가족·체험형'],['건축, 자연, 오래된 골목','역사·힐링형']]},
  {q:'오늘의 에너지는 어느 쪽에 가까워요?',answers:[['뭐든 좋아! 신나게 놀 준비 완료','공연·축제형'],['설레는 분위기를 느끼고 싶어','감성·데이트형'],['새롭고 재미있는 걸 해보고 싶어','가족·체험형'],['조용히 충전하고 싶어','역사·힐링형']]}
];

const tasteTypes = ['공연·축제형','감성·데이트형','가족·체험형','역사·힐링형'];
const ageBands = ['10대','20대','30대','40대','50대','60대 이상'];
const totalSurveySteps = questions.length+2;
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
  wine:{'공연·축제형':72,'감성·데이트형':97,'가족·체험형':42,'역사·힐링형':55},
  arboretum:{'공연·축제형':25,'감성·데이트형':82,'가족·체험형':65,'역사·힐링형':98},
  expo:{'공연·축제형':55,'감성·데이트형':88,'가족·체험형':85,'역사·힐링형':65},
  history:{'공연·축제형':22,'감성·데이트형':70,'가족·체험형':58,'역사·힐링형':97}
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
let parkingTemplates = fallbackParkingTemplates.map((parking,index)=>({...parking,id:`demo-parking-${index}`}));
const $ = selector => document.querySelector(selector);
let activePlace = places[0];
let questionIndex = -1;
let answers = [];
let demographicAnswers = {gender:null,ageBand:null};
let excludedParkings = [];
let pendingParking = null;
let naverMap = null;
let placePanorama = null;
let placePanoramaFallbackTimer = null;
let placePanoramaModuleTimer = null;
let placeMarkers = [];
let parkingMarkers = [];
let currentLocationMarker = null;
let userPosition = null;
let isPlaceFocused = false;
let rankingFilter = 'festival';
const overviewPosition = {lat:36.3515,lng:127.4050,zoom:13};
let previousMapView = {...overviewPosition};
let placeSourceAttribution = '';
let parkingSourceAttribution = '';
let parkingWeather = null;
const parkingCache = new Map();
let placeSheetDrag = null;
let suppressPlaceSheetGestureClick = false;
let plannerSheetDrag = null;
let suppressPlannerSheetGestureClick = false;
let plannerDismissTimer = null;
let recommendSheetDrag = null;
let suppressRecommendSheetGestureClick = false;
let tasteProfile = readTasteProfile();

function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
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
    if(tasteTypes.includes(saved?.primary)&&validTasteScores(saved.scores))return saved;
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
  const highest=Math.max(...tasteTypes.map(type=>counts[type]));
  const tied=tasteTypes.filter(type=>counts[type]===highest);
  const finalPreference=selectedAnswers[selectedAnswers.length-1];
  const primary=tied.includes(finalPreference)?finalPreference:tied[0];
  return {
    version:3,
    primary,
    scores,
    counts,
    demographics:{
      gender:Object.hasOwn(genderLabels,demographics.gender)?demographics.gender:null,
      ageBand:ageBands.includes(demographics.ageBand)?demographics.ageBand:null
    },
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
function todayInKorea(){return Date.parse(`${new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'})}T00:00:00+09:00`);}
function festivalTimingScore(place){
  if(place.type!=='festival')return 70;
  const start=place.startDate&&Date.parse(`${place.startDate}T00:00:00+09:00`);
  const end=place.endDate&&Date.parse(`${place.endDate}T23:59:59+09:00`);
  if(!Number.isFinite(start)||!Number.isFinite(end))return 60;
  const today=todayInKorea();
  if(today>end)return 0;
  if(today>=start)return 100;
  const days=Math.ceil((start-today)/86400000);
  return days<=7?90:days<=30?75:60;
}
function distanceRecommendationScore(place){
  const distance=Number(place.distance);
  if(!Number.isFinite(distance)||distance<0)return 50;
  return Math.max(0,Math.round(100-Math.min(distance,20)*5));
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
function recommendationScoreFor(place){
  const signals=[
    [tasteMatchFor(place),60],
    [distanceRecommendationScore(place),18],
    [festivalTimingScore(place),12],
    [ageSuitabilityFor(place),8],
    [genderSuitabilityFor(place),2]
  ].filter(([score])=>Number.isFinite(score));
  const weightTotal=signals.reduce((sum,[,weight])=>sum+weight,0);
  return weightTotal?Math.round(signals.reduce((sum,[score,weight])=>sum+score*weight,0)/weightTotal):0;
}
function recommendationReasonFor(place){
  const match=tasteMatchFor(place);
  const total=recommendationScoreFor(place);
  if(match===null)return `거리와 행사 일정을 반영한 종합 추천 ${total}점이에요.`;
  const extra=[];
  if(Number.isFinite(ageSuitabilityFor(place)))extra.push('연령대 적합도');
  if(Number.isFinite(genderSuitabilityFor(place)))extra.push('행사 공식 대상 정보');
  const extraCopy=extra.length?`, ${extra.join('·')}`:'';
  return `${tasteMeta[tasteProfile.primary].short} 취향과 ${match}% 일치해요. 거리·일정${extraCopy}을 반영한 종합 추천 ${total}점이에요.`;
}
function applyTasteProfileUI(){
  if(!tasteProfile)return;
  const label=tasteMeta[tasteProfile.primary].short;
  $('#profileLabel').textContent=label;
  $('#retestButton').setAttribute('title',`${tasteProfile.primary} · 다시 검사하기`);
  $('#recommendTitle').textContent=`${label} 맞춤 추천`;
  $('.dream-copy').innerHTML='<span class="mini-dream">★</span> 테스트 결과로 골라봤어요';
}
function hasCoordinates(place){return Number.isFinite(Number(place?.lat))&&Number.isFinite(Number(place?.lng));}
function hasNaverMapApi(){return Boolean(window.naver?.maps?.Map&&window.naver?.maps?.LatLng&&window.naver?.maps?.Marker);}
function hasNaverPanoramaApi(){return Boolean(window.naver?.maps?.Panorama&&window.naver?.maps?.LatLng&&window.naver?.maps?.Event);}
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
  if(day>0)return `시작 D-${day}`;
  if(today<=end){
    const remaining=Math.max(0,Math.ceil((end-today)/86400000));
    return remaining===0?'오늘 종료':`진행 중 · 종료 D-${remaining}`;
  }
  return '종료된 축제';
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
function landmarkCategoryFor(name,details=''){
  const text=`${name||''} ${details||''}`.replace(/\s+/g,'').toLowerCase();
  const categories=[
    {key:'market',keywords:['시장','장터','오일장','5일장','상점','상가'],emoji:'🧺',color:'#d7793b',tile:'#fff0e4',gradient:'linear-gradient(135deg,#d7793b,#efb65b)'},
    {key:'food',keywords:['성심당','빵','베이커리','카페','음식','맛집'],emoji:'🥐',color:'#bd6f3f',tile:'#fff1e8',gradient:'linear-gradient(135deg,#bd6f3f,#e3a06f)'},
    {key:'science',keywords:['과학','엑스포','천문','우주','로봇','기술'],emoji:'🔭',color:'#5d8ee8',tile:'#eaf1ff',gradient:'linear-gradient(135deg,#4c8ef2,#77c8e9)'},
    {key:'art',keywords:['미술','예술','공연','극장','문화예술','갤러리'],emoji:'🎨',color:'#9b6bd6',tile:'#f4edff',gradient:'linear-gradient(135deg,#9b6bd6,#d28ddb)'},
    {key:'history',keywords:['박물관','전시관','역사','기념관','문화재','고택','사적'],emoji:'🏛️',color:'#c27b3c',tile:'#fff3e4',gradient:'linear-gradient(135deg,#c27b3c,#e7b65e)'},
    {key:'education',keywords:['대학교','대학','학교','도서관','교육'],emoji:'🎓',color:'#3f8a68',tile:'#e8f6ee',gradient:'linear-gradient(135deg,#3f8a68,#7ab98f)'},
    {key:'nature',keywords:['수목원','공원','호수','산','숲','둘레길','휴양림','생태','정원','온천'],emoji:'🌿',color:'#55b98a',tile:'#e8f8ef',gradient:'linear-gradient(135deg,#58bd8e,#90d19a)'},
    {key:'city',keywords:['시청','구청','청사','시민','도시'],emoji:'🏢',color:'#5c83c6',tile:'#edf3ff',gradient:'linear-gradient(135deg,#5c83c6,#82abd9)'}
  ];
  return categories.find(category=>category.keywords.some(keyword=>text.includes(keyword)))||null;
}

function landmarkPhotoFor(name){
  const label=String(name||'').replace(/\s+/g,'');
  return landmarkPhotoOverrides.find(item=>item.match.some(keyword=>label.includes(keyword.replace(/\s+/g,''))))?.imageUrl||null;
}

function placeVisual(type,name,details=''){
  const landmarkCategory=type==='landmark'?landmarkCategoryFor(name,details):null;
  if(landmarkCategory)return landmarkCategory;
  const seed=[...String(name)].reduce((sum,char)=>sum+char.charCodeAt(0),0);
  const palettes=type==='festival'
    ? [['🎆','#ff7657','#fff0eb','linear-gradient(135deg,#ff7657,#ed4e7a)'],['🎪','#8d72e1','#f0edff','linear-gradient(135deg,#8d72e1,#5f78e9)'],['🎵','#a64f72','#faeaf1','linear-gradient(135deg,#a64f72,#e58580)']]
    : [['🌿','#55b98a','#e8f8ef','linear-gradient(135deg,#58bd8e,#90d19a)'],['🏛️','#d08a45','#fff3e4','linear-gradient(135deg,#c27b3c,#e7b65e)'],['🌙','#6294f7','#eaf1ff','linear-gradient(135deg,#4c8ef2,#77c8e9)']];
  const [emoji,color,tile,gradient]=palettes[seed%palettes.length];
  return {emoji,color,tile,gradient};
}
function distanceFromOverview(lat,lng){
  return Number(haversineDistance(overviewPosition.lat,overviewPosition.lng,lat,lng).toFixed(1));
}
function normalizeApiPlace(place){
  const visual=placeVisual(place.type,place.name,[place.summary,place.address,place.metadata?.ancillary_facilities,place.metadata?.convenience_facilities].filter(Boolean).join(' '));
  const distance=hasCoordinates(place)?distanceFromOverview(Number(place.lat),Number(place.lng)):null;
  const curatedImage=place.type==='landmark'?landmarkPhotoFor(place.name):null;
  return {...place,...visual,imageUrl:place.imageUrl||place.metadata?.image_url||curatedImage||null,lat:Number(place.lat),lng:Number(place.lng),distance:distance??0,eta:distance===null?0:Math.max(2,Math.round(distance*5))};
}

function updateDistancesFromCurrentLocation(lat,lng){
  places=places.map(place=>{
    if(!hasCoordinates(place))return place;
    const distance=Number(haversineDistance(lat,lng,Number(place.lat),Number(place.lng)).toFixed(1));
    return {...place,distance,eta:Math.max(2,Math.round(distance*5))};
  });
  activePlace=places.find(place=>place.id===activePlace.id)||places[0];
  renderFestivals();
  renderRankings();
  renderMap();
}

function landmarkEnrichmentFor(place){
  const enrichment=place?.metadata?.landmark_enrichment;
  return enrichment&&typeof enrichment==='object'?enrichment:null;
}
function clearPlacePanorama(){
  if(placePanoramaFallbackTimer){window.clearTimeout(placePanoramaFallbackTimer);placePanoramaFallbackTimer=null;}
  if(placePanoramaModuleTimer){window.clearTimeout(placePanoramaModuleTimer);placePanoramaModuleTimer=null;}
  placePanorama=null;
}
function fallbackFromStreetView(container){
  if(!container?.isConnected)return;
  const hero=container.closest('.place-hero-rich');
  hero?.classList.remove('has-streetview');
  container.remove();
  clearPlacePanorama();
}
function activatePlaceStreetView(){
  const container=$('#placeStreetView');
  if(!container||!activePlace||activePlace.type!=='landmark'||!hasCoordinates(activePlace)||!hasNaverPanoramaApi())return;
  clearPlacePanorama();
  const hero=container.closest('.place-hero-rich');
  hero?.classList.remove('has-photo');
  hero?.classList.add('has-streetview');
  container.hidden=false;
  try{
    placePanorama=new naver.maps.Panorama(container,{
      position:new naver.maps.LatLng(activePlace.lat,activePlace.lng),
      pov:{pan:-15,tilt:0,fov:100}
    });
    naver.maps.Event.addListener(placePanorama,'pano_status',()=>{
      const panoId=typeof placePanorama?.getPanoId==='function'?placePanorama.getPanoId():null;
      if(panoId){
        container.classList.add('is-ready');
        if(placePanoramaFallbackTimer){window.clearTimeout(placePanoramaFallbackTimer);placePanoramaFallbackTimer=null;}
      }
    });
    placePanoramaFallbackTimer=window.setTimeout(()=>{
      const panoId=typeof placePanorama?.getPanoId==='function'?placePanorama.getPanoId():null;
      if(!panoId)fallbackFromStreetView(container);
    },6000);
  }catch(error){fallbackFromStreetView(container);}
}
function startPlaceStreetView(waited=0){
  const container=$('#placeStreetView');
  if(!container||!activePlace||activePlace.type!=='landmark'||!hasCoordinates(activePlace))return;
  if(hasNaverPanoramaApi()){activatePlaceStreetView();return;}
  // The panorama submodule is loaded asynchronously after the main map
  // library. Wait briefly instead of prematurely falling back to illustration.
  if(waited>=5000)return;
  placePanoramaModuleTimer=window.setTimeout(()=>startPlaceStreetView(waited+200),200);
}
window.startPlaceStreetView=startPlaceStreetView;
function highlightIcon(index){return ['📍','✨','📸'][index%3];}
function experienceFor(place){
  const curated=curatedExperiences.find(item=>item.match.some(keyword=>String(place.name).toLowerCase().includes(keyword.toLowerCase())));
  const isFestival=place.type==='festival';
  const fallback={
    venue:place.metadata?.place_name||place.address||(isFestival?'행사장 정보 확인':'대전 시내'),
    admission:place.metadata?.usage_fee||'이용 정보 확인',
    audience:isFestival?'친구 · 연인 · 가족':'가벼운 나들이',
    tags:isFestival?['현장 프로그램','지역 문화','주말 나들이']:['산책','사진','대전 명소'],
    highlights:isFestival?[
      {icon:'🎪',title:'현장 프로그램',description:'행사 시간표에서 관심 있는 체험과 공연을 골라 즐겨보세요.'},
      {icon:'📸',title:'기념 사진',description:'행사장 포토존과 주변 풍경에서 오늘의 장면을 남겨보세요.'},
      {icon:'🥤',title:'주변 함께 보기',description:'행사장 주변의 먹거리와 대전 명소를 한 코스로 둘러보세요.'}
    ]:[
      {icon:'🚶',title:'천천히 산책',description:'주변 동선을 따라 여유롭게 걸으며 공간을 둘러보세요.'},
      {icon:'📸',title:'사진 남기기',description:'장소의 대표 풍경과 건축을 배경으로 기억을 남겨보세요.'},
      {icon:'☕',title:'주변 코스',description:'가까운 카페와 명소를 연결해 반나절 코스로 즐겨보세요.'}
    ],
    tip:'운영 시간과 현장 프로그램은 바뀔 수 있으니 출발 전에 공식 안내를 한 번 확인해 주세요.'
  };
  const base=curated||fallback;
  const enrichment=place.type==='landmark'?landmarkEnrichmentFor(place):null;
  if(!enrichment)return {...base,officialUrl:base.officialUrl||place.homepageUrl};
  const enrichedHighlights=Array.isArray(enrichment.highlights)
    ?enrichment.highlights.filter(item=>item?.title&&item?.description).slice(0,3).map((item,index)=>({icon:highlightIcon(index),title:item.title,description:item.description}))
    :[];
  return {
    ...base,
    venue:enrichment.venue||base.venue,
    admission:enrichment.admission||base.admission,
    audience:enrichment.audience||base.audience,
    tags:Array.isArray(enrichment.tags)&&enrichment.tags.length?enrichment.tags:base.tags,
    highlights:enrichedHighlights.length?enrichedHighlights:base.highlights,
    tip:enrichment.visit_tip||enrichment.visitTip||base.tip,
    officialUrl:place.homepageUrl||base.officialUrl||enrichment.source_urls?.[0]||null
  };
}

function compactLabelFor(place){
  const name=String(place?.name||'').replace(/\s+/g,'').toLowerCase();
  return compactPlaceLabels.find(item=>item.match.some(keyword=>name.includes(keyword.replace(/\s+/g,'').toLowerCase())))||null;
}

function compactPlaceCategory(place){
  const curated=compactLabelFor(place);
  if(curated)return curated.category;
  if(place.type==='festival')return '지역축제';
  const name=String(place.name||'');
  if(/빵|베이커리/.test(name))return '빵집';
  if(/수목원/.test(name))return '수목원';
  if(/공원/.test(name))return '공원';
  if(/대학교|대학/.test(name))return '대학교';
  if(/전시관|박물관/.test(name))return '전시관';
  if(/시청|구청/.test(name))return '공공기관';
  return '대전명소';
}

function compactPlaceArea(place){
  const curated=compactLabelFor(place);
  if(curated)return curated.area;
  const address=String(place.address||place.metadata?.address||place.metadata?.road_address||'').trim();
  const area=address.match(/(?:대전광역시|대전시|대전)\s+([가-힣]+구)(?:\s+([가-힣0-9]+동))?/);
  if(area)return `대전광역시 ${area[1]}${area[2]?` ${area[2]}`:''}`;
  return '대전광역시';
}

async function loadPlaces(){
  try{
    const response=await fetch('/api/places');
    if(!response.ok)throw new Error('places_unavailable');
    const payload=await response.json();
    if(!Array.isArray(payload.places)||!payload.places.length)return;
    const apiPlaces=payload.places.map(normalizeApiPlace);
    const featured=fallbackPlaces.filter(place=>['cityhall','cnu','sungsimdang'].includes(place.id));
    const apiNames=new Set(apiPlaces.map(place=>place.name.replace(/\s+/g,'')));
    places=[...apiPlaces,...featured.filter(place=>!apiNames.has(place.name.replace(/\s+/g,'')))];
    if(userPosition)updateDistancesFromCurrentLocation(userPosition.lat,userPosition.lng);
    activePlace=places.find(hasCoordinates)||places[0];
    placeSourceAttribution=payload.sourceAttribution||'';
    renderFestivals();renderRankings();renderMap();
    toast('대전 공공데이터를 불러왔어요.');
  }catch{ /* 동기화 전에는 현재 데모 데이터를 그대로 보여준다. */ }
}

async function loadParkingForActivePlace(){
  if(!hasCoordinates(activePlace))return;
  const date=$('#visitDate').value||new Date().toISOString().slice(0,10);
  const cacheKey=`${activePlace.id}|${date}|${$('#startTime').value}|${$('#endTime').value}`;
  try{
    let payload=parkingCache.get(cacheKey);
    if(!payload){
      parkingWeather=null;
      const query=new URLSearchParams({lat:String(activePlace.lat),lng:String(activePlace.lng),radius:'4',date,startTime:$('#startTime').value,endTime:$('#endTime').value});
      const response=await fetch(`/api/parking?${query}`);
      if(!response.ok)throw new Error('parking_unavailable');
      payload=await response.json();parkingCache.set(cacheKey,payload);
    }
    parkingWeather=payload.weather||null;
    if(Array.isArray(payload.parkingLots)&&payload.parkingLots.length){
      parkingTemplates=payload.parkingLots;
      parkingSourceAttribution=payload.sourceAttribution||'';
      renderParkings();renderMap();
    }
  }catch{ /* 실제 데이터가 없을 땐 데모 주차장 후보로 작동한다. */ }
}

function renderFestivals(){
  const festivalPlaces = places
    .filter(place=>place.type==='festival'&&festivalTimingScore(place)>0)
    .sort((a,b)=>recommendationScoreFor(b)-recommendationScoreFor(a)||a.distance-b.distance);
  $('#festivalSlider').innerHTML = festivalPlaces.length?festivalPlaces.map(place=>{
    const match=tasteMatchFor(place);
    const total=recommendationScoreFor(place);
    const matchBadge=match===null?`추천 ${total}점`:`취향 ${match}% · 추천 ${total}점`;
    const category=compactPlaceCategory(place);
    const area=compactPlaceArea(place);
    return `<button class="festival-card" data-place="${escapeHtml(place.id)}" aria-label="${escapeHtml(`${place.name}, ${category}, ${matchBadge}, ${area} 상세 보기`)}" style="--card-gradient:${place.gradient};--festival-accent:${place.color}"><span class="festival-visual"></span><span class="festival-shape festival-photo">${photoVisual(place)}</span><span class="festival-content festival-content-compact"><span class="compact-place-kind">${escapeHtml(category)}</span><h3>${escapeHtml(place.name)}</h3><span class="compact-place-score">${escapeHtml(matchBadge)}</span><span class="compact-place-location">${escapeHtml(area)}</span></span></button>`;
  }).join(''):'<p class="map-status">불러온 축제 정보가 아직 없어요.</p>';
  document.querySelectorAll('.festival-card').forEach(card=>card.addEventListener('click',()=>openPlace(card.dataset.place)));
}

function renderRankings(){
  const ranked=places
    .filter(place=>place.type===rankingFilter)
    .filter(place=>festivalTimingScore(place)>0)
    .sort((a,b)=>recommendationScoreFor(b)-recommendationScoreFor(a)||(Number(a.distance)||99)-(Number(b.distance)||99))
    .slice(0,6);
  $('#rankingList').innerHTML=ranked.length?ranked.map((place,index)=>{
    const category=compactPlaceCategory(place);
    const area=compactPlaceArea(place);
    const match=tasteMatchFor(place);
    const total=recommendationScoreFor(place);
    const scoreCopy=match===null?`추천 ${total}점`:`취향 ${match}% · 추천 ${total}점`;
    return `<button class="ranking-item" type="button" data-ranking-place="${escapeHtml(place.id)}" aria-label="${escapeHtml(`${index+1}위 ${place.name}, ${category}, ${scoreCopy}, ${area} 상세 보기`)}"><strong class="ranking-number">${index+1}</strong><span class="ranking-copy"><small>${escapeHtml(`${category} · ${scoreCopy}`)}</small><b>${escapeHtml(place.name)}</b><span>${escapeHtml(area)}</span></span><span class="ranking-photo" style="--ranking-tile:${place.tile||'#f2f4f3'}">${photoVisual(place)}</span></button>`;
  }).join(''):'<p class="ranking-empty">표시할 순위 정보가 아직 없어요.</p>';
  document.querySelectorAll('[data-ranking-place]').forEach(button=>button.addEventListener('click',()=>openPlace(button.dataset.rankingPlace)));
}

function groupPlacesForZoom(visible,zoom){
  const threshold=zoom<=12?2.4:zoom===13?1.35:zoom===14?.55:0;
  if(!threshold)return visible.map(place=>({places:[place],lat:Number(place.lat),lng:Number(place.lng)}));
  const groups=[];
  visible.forEach(place=>{
    const group=groups.find(candidate=>candidate.places.some(item=>haversineDistance(Number(item.lat),Number(item.lng),Number(place.lat),Number(place.lng))<=threshold));
    if(group)group.places.push(place);
    else groups.push({places:[place]});
  });
  return groups.map(group=>({
    ...group,
    lat:group.places.reduce((sum,place)=>sum+Number(place.lat),0)/group.places.length,
    lng:group.places.reduce((sum,place)=>sum+Number(place.lng),0)/group.places.length
  }));
}

function renderMap(){
  const visible = places.filter(hasCoordinates);
  renderNearbyPanel(visible);
  if(!naverMap)return;
  placeMarkers.forEach(marker=>marker.setMap(null));
  parkingMarkers.forEach(marker=>marker.setMap(null));
  parkingMarkers=[];
  if(isPlaceFocused){
    if(!hasCoordinates(activePlace))return;
    const targetPosition=new naver.maps.LatLng(activePlace.lat,activePlace.lng);
    placeMarkers=[new naver.maps.Marker({map:naverMap,position:targetPosition,title:activePlace.name,zIndex:30,icon:{content:`<span class="map-marker selected-map-marker" style="--pin:${activePlace.color}" aria-label="선택한 장소"><span class="marker-bubble"><span class="marker-icon">${markerVisual(activePlace)}</span></span></span>`,anchor:new naver.maps.Point(24,46)}})];
    const recommendedParkings=currentParkingList();
    const otherParkings=allParkingCandidates().filter(parking=>!recommendedParkings.some(recommended=>recommended.name===parking.name));
    parkingMarkers=recommendedParkings.map((parking,index)=>{
      const position=parkingPosition(index,parking);
      const parkingId=encodeURIComponent(parking.id||parking.name);
      return new naver.maps.Marker({map:naverMap,position,title:parking.name,zIndex:20-index,icon:{content:`<button class="parking-map-marker rank-${index+1}" aria-label="${escapeHtml(parking.planOption)} ${escapeHtml(parking.planCriterion)} ${escapeHtml(parking.name)}" onclick="event.stopPropagation();window.showParkingInfo(decodeURIComponent('${parkingId}'),${index+1})"><span>${escapeHtml(parking.planOption)}</span><b>${escapeHtml(parking.name)}</b><small>${escapeHtml(parking.planCriterion)} · ${formatCost(parking)} · 도보 ${parking.walk}분</small></button>`,anchor:new naver.maps.Point(74,54)}});
    });
    parkingMarkers.push(...otherParkings.map((parking,index)=>{
      const parkingId=encodeURIComponent(parking.id||parking.name);
      return new naver.maps.Marker({map:naverMap,position:parkingPosition(index+3,parking),title:parking.name,zIndex:10-index,icon:{content:`<button class="parking-map-marker parking-dot" aria-label="${escapeHtml(parking.name)} 주차장 정보" onclick="event.stopPropagation();window.showParkingInfo(decodeURIComponent('${parkingId}'))"><span>●</span></button>`,anchor:new naver.maps.Point(13,13)}});
    }));
    return;
  }
  const zoom=naverMap.getZoom();
  placeMarkers=groupPlacesForZoom(visible,zoom).map(group=>{
    if(group.places.length>1){
      const label=group.places.some(place=>place.type==='festival')?'축제·명소':'대전 명소';
      const marker=new naver.maps.Marker({map:naverMap,position:new naver.maps.LatLng(group.lat,group.lng),title:`${label} ${group.places.length}곳`,zIndex:24,icon:{content:`<button class="place-cluster-marker" aria-label="${escapeHtml(label)} ${group.places.length}곳 확대해서 보기"><b>${group.places.length}</b><span>${escapeHtml(label)}</span></button>`,anchor:new naver.maps.Point(38,28)}});
      naver.maps.Event.addListener(marker,'click',()=>focusMapOn(new naver.maps.LatLng(group.lat,group.lng),Math.min(15,zoom+2),'overview',600));
      return marker;
    }
    const place=group.places[0];
    const marker=new naver.maps.Marker({
      map:naverMap,
      position:new naver.maps.LatLng(place.lat,place.lng),
      title:place.name,
      zIndex:place.id===activePlace.id?20:10,
      icon:{
        content:`<button class="map-marker ${place.id===activePlace.id?'active':''}" style="--pin:${place.color}" aria-label="${escapeHtml(place.name)} 상세 보기"><span class="marker-bubble"><span class="marker-icon">${markerVisual(place)}</span></span></button>`,
        anchor:new naver.maps.Point(24,46)
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
    $('#nearbyList').innerHTML=parkings.map((parking,index)=>`<button class="nearby-item nearby-parking" data-parking="${escapeHtml(parking.id||parking.name)}" style="--tile:#eff7ef;--accent:#3d7657"><span class="nearby-emoji">${index+1}</span><span class="nearby-info"><span>${escapeHtml(parking.type)} 주차장</span><b>${escapeHtml(parking.name)}</b><p>${formatCost(parking)} · 도보 ${parking.walk}분</p></span></button>`).join('');
    document.querySelectorAll('[data-parking]').forEach(item=>item.addEventListener('click',openPlanner));
    return;
  }
  const near=[...visible].sort((a,b)=>a.distance-b.distance).slice(0,4);
  eyebrow.textContent='내 주변';
  title.textContent='가까운 장소';
  $('#nearbyCount').textContent=`${near.length}곳`;
  $('#nearbyList').innerHTML=near.map(place=>`<button class="nearby-item" data-place="${escapeHtml(place.id)}" style="--tile:${place.tile};--accent:${place.color}"><span class="nearby-emoji">${escapeHtml(place.emoji)}</span><span class="nearby-info"><span>${place.type==='festival'?'대전 축제':'추천 랜드마크'}</span><b>${escapeHtml(place.name)}</b><p>${place.distance}km · ${place.eta}분 · ${escapeHtml(festivalDateBadge(place))}</p></span></button>`).join('');
  document.querySelectorAll('.nearby-item').forEach(item=>item.addEventListener('click',()=>openPlace(item.dataset.place)));
}

function parkingPosition(index,selectedParking){
  const parking=selectedParking||allParkingCandidates()[index];
  if(hasCoordinates(parking))return new naver.maps.LatLng(parking.lat,parking.lng);
  const offsets=[[0.0020,0.0028],[-0.0016,0.0032],[0.0026,-0.0026],[-0.0050,-0.0048],[0.0050,0.0048],[-0.0050,0.0048],[0.0050,-0.0048]];
  const [latOffset,lngOffset]=offsets[index%offsets.length];
  return new naver.maps.LatLng(activePlace.lat+latOffset,activePlace.lng+lngOffset);
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
  naverMap=new naver.maps.Map('map',{center:new naver.maps.LatLng(overviewPosition.lat,overviewPosition.lng),zoom:overviewPosition.zoom,minZoom:10,maxZoom:18});
  naver.maps.Event.addListener(naverMap,'zoom_changed',()=>{if(!isPlaceFocused)renderMap();});
  renderMap();
  fitAllPlaces();
}

function moveToCurrentLocation(){
  if(!navigator.geolocation){toast('이 브라우저에서는 현재 위치를 사용할 수 없어요.');return;}
  navigator.geolocation.getCurrentPosition(({coords})=>{
    if(!naverMap){toast('지도가 준비된 뒤 다시 시도해 주세요.');return;}
    userPosition={lat:coords.latitude,lng:coords.longitude};
    updateDistancesFromCurrentLocation(userPosition.lat,userPosition.lng);
    const position=new naver.maps.LatLng(coords.latitude,coords.longitude);
    if(currentLocationMarker)currentLocationMarker.setPosition(position);
    else currentLocationMarker=new naver.maps.Marker({map:naverMap,position,icon:{content:'<span class="current-location-marker" aria-label="현재 위치"><b aria-hidden="true"></b></span>',anchor:new naver.maps.Point(20,20)},zIndex:30});
    const fromDaejeon=haversineDistance(coords.latitude,coords.longitude,overviewPosition.lat,overviewPosition.lng);
    if(fromDaejeon<=25)focusMapOn(position,14,'overview',650);
    else fitAllPlaces();
    toast(fromDaejeon<=25?'현재 위치에서 거리와 이동 시간을 다시 계산했어요.':'현재 위치에서 거리를 계산하고 지도는 대전 중심으로 유지했어요.');
  },()=>toast('위치 권한을 허용하면 현재 위치를 기준으로 거리를 계산해요.'),{enableHighAccuracy:true,timeout:7000,maximumAge:60000});
}

function openPlace(id){
  clearPlacePanorama();
  if(naverMap&&!isPlaceFocused){
    const center=naverMap.getCenter();
    previousMapView={lat:center.lat(),lng:center.lng(),zoom:naverMap.getZoom()};
  }
  activePlace=places.find(place=>place.id===id)||places[0];
  isPlaceFocused=true;
  excludedParkings=[];
  parkingWeather=null;
  $('.app-shell').classList.add('is-place-focused');
  renderMap();
  if(naverMap&&hasCoordinates(activePlace)){
    const targetPosition=new naver.maps.LatLng(activePlace.lat,activePlace.lng);
    focusMapOn(targetPosition,15,'place',750);
  }
  if(!hasCoordinates(activePlace))toast('이 축제의 지도 좌표는 확인 중이에요. 상세 정보는 먼저 볼 수 있어요.');
  const placeLabel=activePlace.type==='festival'?'축제':'랜드마크';
  const locationCopy=hasCoordinates(activePlace)?`${activePlace.distance}km · 차로 ${activePlace.eta}분`:'지도 좌표 확인 중';
  const experience=experienceFor(activePlace);
  const sourceCopy=placeSourceAttribution?`<p class="data-source-note">${escapeHtml(placeSourceAttribution)}</p>`:'';
  const officialLink=experience.officialUrl?`<a class="official-link" href="${escapeHtml(experience.officialUrl)}" target="_blank" rel="noopener">${activePlace.type==='festival'?'공식 일정 확인':'공식 안내 보기'} <span>↗</span></a>`:'';
  const enrichment=landmarkEnrichmentFor(activePlace);
  const imageSourceLink=enrichment?.image_source_url?`<p class="landmark-image-source">대표 사진 출처 <a href="${escapeHtml(enrichment.image_source_url)}" target="_blank" rel="noopener">공식 페이지 ↗</a></p>`:'';
  const hasHeroImage=Boolean(activePlace.imageUrl);
  const canShowStreetView=activePlace.type==='landmark'&&!hasHeroImage&&hasCoordinates(activePlace);
  const heroImage=hasHeroImage?`<img class="place-hero-photo" src="${escapeHtml(activePlace.imageUrl)}" alt="${escapeHtml(activePlace.name)} 대표 이미지" referrerpolicy="no-referrer" onerror="this.parentElement.classList.remove('has-photo');this.remove();window.startPlaceStreetView&&window.startPlaceStreetView()" />`:'';
  const streetView=activePlace.type==='landmark'&&hasCoordinates(activePlace)?`<div class="place-streetview" id="placeStreetView" aria-label="${escapeHtml(activePlace.name)} 주변 네이버 거리뷰"${canShowStreetView?'':' hidden'}></div>`:'';
  $('#placeSheet').classList.toggle('festival-detail',activePlace.type==='festival');
  $('#placeSheetContent').innerHTML=`<div class="place-hero place-hero-rich${hasHeroImage?' has-photo':''}" style="--hero:${activePlace.gradient};--emoji:'${escapeHtml(activePlace.emoji)}'">${heroImage}${streetView}<div class="place-hero-badges"><span>${placeLabel}</span><span>${escapeHtml(festivalDateBadge(activePlace))}</span></div><div class="place-hero-copy"><span class="place-hero-kicker">${canShowStreetView?'NAVER STREET VIEW':'DAEJEON WEEKEND'}</span><h2>${escapeHtml(activePlace.name)}</h2><p>${escapeHtml(activePlace.summary)}</p></div></div>${imageSourceLink}<div class="festival-chip-row">${experience.tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div><section class="place-intro"><span>${placeLabel.toUpperCase()} GUIDE</span><h3>한눈에 보는 방문 정보</h3></section><div class="festival-facts"><div><span>일정</span><b>${escapeHtml(activePlace.period)}</b></div><div><span>운영 시간</span><b>${escapeHtml(activePlace.hours)}</b></div><div><span>장소</span><b>${escapeHtml(experience.venue)}</b></div><div><span>입장</span><b>${escapeHtml(experience.admission)}</b></div><div><span>추천 대상</span><b>${escapeHtml(experience.audience)}</b></div><div><span>현재 위치에서</span><b>${escapeHtml(locationCopy)}</b></div></div><div class="recommend-reason"><i>★</i><span>꿈돌이의 추천 이유<b>${escapeHtml(recommendationReasonFor(activePlace))}</b></span></div><section class="festival-enjoy"><div class="festival-section-title"><span>ENJOY</span><h3>${activePlace.type==='festival'?'이렇게 즐겨보세요':'이렇게 둘러보세요'}</h3></div><div class="festival-activity-grid">${experience.highlights.map(item=>`<article><span class="activity-icon">${escapeHtml(item.icon)}</span><div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.description)}</p></div></article>`).join('')}</div></section><aside class="festival-tip"><span class="festival-tip-icon">💡</span><div><b>방문 전에 잠깐</b><p>${escapeHtml(experience.tip)}</p></div></aside><div class="festival-actions">${officialLink}<button class="primary-button" id="openPlanner">주차 플랜 보기 <span>→</span></button></div>${sourceCopy}`;
  document.querySelectorAll('.bottom-sheet').forEach(sheet=>sheet.classList.remove('show'));
  $('#sheetBackdrop').classList.remove('show');
  suppressPlaceSheetGestureClick=false;
  setPlaceSheetExpanded(false);
  setPlaceSheetHeights();
  $('#placeSheet').classList.add('show');
  if(canShowStreetView)startPlaceStreetView();
  $('#openPlanner').addEventListener('click',openPlanner);
  loadParkingForActivePlace();
}

function setPlaceSheetHeights(){
  const screenHeight=$('.map-card')?.getBoundingClientRect().height||window.innerHeight;
  const sheet=$('#placeSheet');
  sheet.style.setProperty('--place-sheet-peek-height',`${Math.round(screenHeight*.6)}px`);
  sheet.style.setProperty('--place-sheet-full-height',`${Math.max(320,Math.round(screenHeight))}px`);
}

function setPlaceSheetExpanded(expanded){
  const sheet=$('#placeSheet');
  sheet.classList.toggle('is-expanded',expanded);
  sheet.classList.remove('is-dragging');
  sheet.style.removeProperty('--place-sheet-drag-height');
  const handle=$('#placeSheetHandle');
  handle.setAttribute('aria-expanded',String(expanded));
  handle.setAttribute('aria-label',expanded?'상세창 60% 높이로 줄이기':'상세창 전체 화면으로 펼치기');
  if(!expanded)sheet.scrollTop=0;
}

function beginPlaceSheetDrag(event){
  if(event.button!==undefined&&event.button!==0)return;
  const sheet=$('#placeSheet');
  if(!sheet.classList.contains('show'))return;
  setPlaceSheetHeights();
  const styles=getComputedStyle(sheet);
  placeSheetDrag={
    pointerId:event.pointerId,
    startY:event.clientY,
    startHeight:sheet.getBoundingClientRect().height,
    minHeight:Math.min(220,parseFloat(styles.getPropertyValue('--place-sheet-peek-height'))*.55),
    maxHeight:parseFloat(styles.getPropertyValue('--place-sheet-full-height')),
    expanded:sheet.classList.contains('is-expanded'),
    moved:false
  };
  sheet.classList.add('is-dragging');
  if(event.pointerId!==undefined)event.currentTarget.setPointerCapture?.(event.pointerId);
}

function movePlaceSheetDrag(event){
  if(!placeSheetDrag||event.pointerId!==placeSheetDrag.pointerId)return;
  const delta=placeSheetDrag.startY-event.clientY;
  if(Math.abs(delta)>6)placeSheetDrag.moved=true;
  const nextHeight=Math.max(placeSheetDrag.minHeight,Math.min(placeSheetDrag.maxHeight,placeSheetDrag.startHeight+delta));
  $('#placeSheet').style.setProperty('--place-sheet-drag-height',`${nextHeight}px`);
  if(placeSheetDrag.moved)event.preventDefault();
}

function endPlaceSheetDrag(event){
  if(!placeSheetDrag||event.pointerId!==placeSheetDrag.pointerId)return;
  const drag=placeSheetDrag;
  const delta=drag.startY-event.clientY;
  placeSheetDrag=null;
  if(drag.moved){
    suppressPlaceSheetGestureClick=true;
    window.setTimeout(()=>{suppressPlaceSheetGestureClick=false;},0);
  }
  if(delta<-58){
    if(drag.expanded)setPlaceSheetExpanded(false);
    else resetMapFocus();
  }else if(!drag.expanded&&delta>48){
    setPlaceSheetExpanded(true);
  }else{
    setPlaceSheetExpanded(drag.expanded);
  }
}

function resetPlannerSheetDrag(){
  window.clearTimeout(plannerDismissTimer);
  plannerDismissTimer=null;
  plannerSheetDrag=null;
  const sheet=$('#plannerSheet');
  sheet.classList.remove('is-dragging','is-dismissing');
  sheet.style.removeProperty('--planner-drag-y');
}

function beginPlannerSheetDrag(event){
  if(event.button!==undefined&&event.button!==0)return;
  const sheet=$('#plannerSheet');
  if(!sheet.classList.contains('show'))return;
  resetPlannerSheetDrag();
  plannerSheetDrag={pointerId:event.pointerId,startY:event.clientY,moved:false};
  sheet.classList.add('is-dragging');
  if(event.pointerId!==undefined){try{event.currentTarget.setPointerCapture?.(event.pointerId);}catch{/* Pointer capture is optional. */}}
}

function movePlannerSheetDrag(event){
  if(!plannerSheetDrag||event.pointerId!==plannerSheetDrag.pointerId)return;
  const delta=Math.max(0,event.clientY-plannerSheetDrag.startY);
  if(delta>5)plannerSheetDrag.moved=true;
  $('#plannerSheet').style.setProperty('--planner-drag-y',`${Math.min(delta,$('#plannerSheet').offsetHeight)}px`);
  if(plannerSheetDrag.moved)event.preventDefault();
}

function endPlannerSheetDrag(event){
  if(!plannerSheetDrag||event.pointerId!==plannerSheetDrag.pointerId)return;
  const drag=plannerSheetDrag;
  const sheet=$('#plannerSheet');
  const delta=Math.max(0,event.clientY-drag.startY);
  plannerSheetDrag=null;
  if(drag.moved){
    suppressPlannerSheetGestureClick=true;
    window.setTimeout(()=>{suppressPlannerSheetGestureClick=false;},0);
  }
  sheet.classList.remove('is-dragging');
  if(delta>64){
    sheet.classList.add('is-dismissing');
    sheet.style.setProperty('--planner-drag-y',`${Math.max(delta,Math.round(sheet.offsetHeight*.38))}px`);
    plannerDismissTimer=window.setTimeout(()=>{
      plannerDismissTimer=null;
      sheet.classList.remove('is-dismissing');
      sheet.style.removeProperty('--planner-drag-y');
      closeSheets();
    },220);
    return;
  }
  sheet.style.removeProperty('--planner-drag-y');
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
  if(wasPlaceOpen)clearPlacePanorama();
  document.querySelectorAll('.bottom-sheet').forEach(sheet=>sheet.classList.remove('show'));
  $('#sheetBackdrop').classList.remove('show');
  if(wasPlannerOpen&&isPlaceFocused){$('#placeSheet').classList.add('show');return;}
  if(wasParkingInfoOpen&&isPlaceFocused){$('#placeSheet').classList.add('show');return;}
  if(wasPlaceOpen)resetMapFocus();
}

function resetMapFocus(){
  clearPlacePanorama();
  isPlaceFocused=false;
  $('.app-shell').classList.remove('is-place-focused');
  setPlaceSheetExpanded(false);
  $('#placeSheet').classList.remove('show');
  $('#sheetBackdrop').classList.remove('show');
  renderMap();
  morphToOverview();
}

function minutes(time){const [h,m]=String(time||'').split(':').map(Number);return Number.isFinite(h)&&Number.isFinite(m)?h*60+m:null}
function scheduleForVisit(parking){
  const hours=parking.operatingHours;
  if(!hours)return {open:parking.open,close:parking.close};
  const day=new Date(`${$('#visitDate').value||'2026-01-01'}T12:00:00+09:00`).getUTCDay();
  return hours[day===6?'saturday':day===0?'holiday':'weekday']||hours.weekday||{};
}
function costFor(parking){
  if(parking.unknownFee)return null;
  if(parking.free||parking.base===0)return 0;
  const schedule=scheduleForVisit(parking);
  const start=minutes($('#startTime').value),end=minutes($('#endTime').value),open=minutes(schedule.open),close=minutes(schedule.close);
  if(start===null||end===null||open===null||close===null)return null;
  if(end<=start)return 0;
  const paid=Math.max(0,Math.min(end,close)-Math.max(start,open));
  if(paid===0)return 0;
  if(!parking.addMin)return parking.base;
  return parking.base+Math.ceil(Math.max(0,paid-parking.baseMin)/parking.addMin)*parking.add;
}
function formatCost(parking){const cost=costFor(parking);return cost===null?'요금 확인 필요':`${cost.toLocaleString()}원`;}
function parkingHours(parking){const schedule=scheduleForVisit(parking);return schedule.open&&schedule.close?`${schedule.open}–${schedule.close}`:'운영시간 확인';}

const parkingPlanCriteria = [
  {
    key:'distance',option:'1안',label:'거리 우선',description:'목적지까지 가장 적게 걷는 곳',icon:'⌖',
    compare:(a,b)=>a.walk-b.walk||a.distance-b.distance
  },
  {
    key:'price',option:'2안',label:'가격 우선',description:'선택 시간의 예상 요금이 낮은 곳',icon:'₩',
    compare:(a,b)=>(costFor(a)??Number.POSITIVE_INFINITY)-(costFor(b)??Number.POSITIVE_INFINITY)||a.walk-b.walk
  },
  {
    key:'space',option:'3안',label:'여유 우선',description:'주차면 규모가 커서 여유를 기대할 수 있는 곳',icon:'P',
    compare:(a,b)=>(b.capacity??-1)-(a.capacity??-1)||a.walk-b.walk
  }
];

function currentParkingList(){
  const candidates=allParkingCandidates();
  const selected=[];
  const usedNames=new Set();
  parkingPlanCriteria.forEach(criterion=>{
    const parking=[...candidates].filter(candidate=>!usedNames.has(candidate.name)).sort(criterion.compare)[0];
    if(!parking)return;
    usedNames.add(parking.name);
    selected.push({...parking,planKey:criterion.key,planOption:criterion.option,planCriterion:criterion.label,planDescription:criterion.description,planIcon:criterion.icon});
  });
  return selected;
}

function parkingPlanMetric(parking){
  if(parking.planKey==='distance')return `도보 ${parking.walk}분`;
  if(parking.planKey==='price')return formatCost(parking);
  return parking.capacity?`${parking.capacity}면 규모`:'규모 확인 필요';
}

function allParkingCandidates(){
  return parkingTemplates
    .filter(parking=>!excludedParkings.includes(parking.name))
    .map(parking=>({
      ...parking,
      recommendationScore:parking.recommendationScore??((costFor(parking)??8000)/100 + parking.drive*2 + parking.walk - Math.min((parking.capacity||0)/50,3))
    }))
    .sort((a,b)=>a.recommendationScore-b.recommendationScore);
}

function openParkingInfo(parking,rank){
  const planned=currentParkingList().find(candidate=>candidate.name===parking.name);
  const rankCopy=planned?`${planned.planOption} · ${planned.planCriterion}`:rank?`${rank}안 비교 후보`:'주변 주차장';
  $('#parkingInfoContent').innerHTML=`<div class="parking-info-kicker"><span>${escapeHtml(parking.type)} 주차장</span><b>${rankCopy}</b></div><h2>${escapeHtml(parking.name)}</h2><div class="parking-info-grid"><div><span>예상 요금</span><b>${formatCost(parking)}</b></div><div><span>도보 거리</span><b>${parking.walk}분</b></div><div><span>운영 시간</span><b>${escapeHtml(parkingHours(parking))}</b></div><div><span>주차 면수</span><b>${parking.capacity??'정보 없음'}${parking.capacity?'면':''}</b></div></div><p class="parking-info-reason">✓ ${escapeHtml(parking.reason)}</p><p class="data-source-note">${escapeHtml(parkingSourceAttribution||'주차장 정보는 제공 데이터 기준이에요.')}</p><div class="parking-info-actions"><button class="route-button" id="parkingInfoRoute">이곳으로 길안내</button><button class="parking-info-plan" id="parkingInfoPlan">주차 플랜에서 비교</button></div>`;
  showSheet('#parkingInfoSheet');
  $('#parkingInfoRoute').addEventListener('click',()=>selectNavigation(parking.name));
  $('#parkingInfoPlan').addEventListener('click',openPlanner);
}

window.showParkingInfo=(parkingId,rank)=>{
  const parking=allParkingCandidates().find(candidate=>(candidate.id||candidate.name)===parkingId)||parkingTemplates.find(candidate=>(candidate.id||candidate.name)===parkingId);
  if(parking)openParkingInfo(parking,rank);
};

function weatherRecommendationFor(weather){
  const temperature=Number(weather?.apparentTemperature);
  if(!weather?.available||!Number.isFinite(temperature))return null;
  const rounded=Math.round(temperature);
  if(rounded>=31)return {icon:'☀️',title:`체감 ${rounded}°C · 가까운 주차장을 더 높게 추천했어요`,description:'더운 시간대에는 주차장부터 목적지까지의 도보 거리를 크게 반영했어요.'};
  if(rounded>=26)return {icon:'🌤️',title:`체감 ${rounded}°C · 도보 거리도 함께 비교했어요`,description:'더위 영향을 고려해 주차비와 이동 편의의 균형을 맞췄어요.'};
  return {icon:'🌿',title:`체감 ${rounded}°C · 거리와 주차비를 균형 있게 비교했어요`,description:'걷기 좋은 날씨라 예상 주차비와 도보 거리를 함께 반영했어요.'};
}

function renderWeatherRecommendation(){
  const recommendation=weatherRecommendationFor(parkingWeather);
  const panel=$('#weatherRecommendation');
  const badge=$('#parkingWeatherBadge');
  if(!recommendation){
    panel.hidden=true;
    panel.innerHTML='';
    badge.innerHTML='<span>★</span> 3가지 기준';
    return;
  }
  const source=parkingWeather.sourceLabel?` · ${parkingWeather.sourceLabel}`:'';
  panel.hidden=false;
  panel.innerHTML=`<span class="weather-recommendation-icon" aria-hidden="true">${recommendation.icon}</span><span><b>${escapeHtml(recommendation.title)}</b><small>${escapeHtml(recommendation.description)}${escapeHtml(source)}</small></span>`;
  badge.innerHTML=`<span>${recommendation.icon}</span> 체감 ${Math.round(Number(parkingWeather.apparentTemperature))}°C`;
}

function renderParkings(){
  const start=$('#startTime').value,end=$('#endTime').value;
  const duration=Math.max(0,(minutes(end)||0)-(minutes(start)||0));
  $('#parkingSummary').textContent=`${Math.floor(duration/60)}시간 ${duration%60?duration%60+'분 ':''}주차 기준`;
  renderWeatherRecommendation();
  const list=currentParkingList();
  $('#parkingList').innerHTML=list.length?list.map(parking=>`<article class="parking-item parking-plan-${escapeHtml(parking.planKey)}"><div class="parking-plan-head"><span class="parking-plan-option">${escapeHtml(parking.planOption)}</span><span class="parking-plan-icon">${escapeHtml(parking.planIcon)}</span><span><b>${escapeHtml(parking.planCriterion)}</b><small>${escapeHtml(parking.planDescription)}</small></span></div><span class="parking-type">${escapeHtml(parking.type)} 주차장</span><h3>${escapeHtml(parking.name)}</h3><div class="parking-meta"><span>차로 ${parking.drive}분</span><span>도보 ${parking.walk}분</span><span>${escapeHtml(parkingHours(parking))} 운영</span></div><div class="parking-stats"><div class="criterion-stat"><span>선택 기준</span><b>${escapeHtml(parkingPlanMetric(parking))}</b></div><div><span>예상 요금</span><b>${formatCost(parking)}</b></div><div><span>주차 규모</span><b>${parking.capacity?`${parking.capacity}면`:'정보 확인'}</b></div></div><p class="parking-reason">✓ ${escapeHtml(parking.planDescription)}</p><div class="parking-actions"><button class="route-button" data-route="${escapeHtml(parking.name)}">이곳으로 길안내</button><button class="full-button" data-full="${escapeHtml(parking.name)}">만차로 제외</button></div></article>`).join(''):`<div class="parking-item"><h3>준비한 후보를 모두 확인했어요</h3><p class="place-description">검색 반경을 넓혀 주변 주차장을 다시 찾아볼게요.</p><button class="primary-button" id="resetParking">주변 후보 다시 계산</button></div>`;
  document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>selectNavigation(button.dataset.route)));
  document.querySelectorAll('[data-full]').forEach(button=>button.addEventListener('click',()=>markFull(button.dataset.full)));
  if($('#resetParking'))$('#resetParking').addEventListener('click',()=>{excludedParkings=[];renderParkings();toast('새로운 후보를 다시 계산했어요.');});
}

function openPlanner(){
  $('#plannerTitle').textContent=`${activePlace.name} 주차 플랜`;
  excludedParkings=[];
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
  if(currentParkingList().length)toast(`${name}을 제외하고 거리·가격·여유 기준을 다시 계산했어요.`);
  else toast('주변 후보를 다시 계산해 주세요.');
}

function selectNavigation(parkingName){
  pendingParking=parkingName;
  const saved=localStorage.getItem('daejeonMap.preferredNavigation');
  if(saved){toast(`${saved}로 ${parkingName} 안내를 시작해요.`);return}
  $('#navigationModal').classList.add('show');
}

function setSurveyProgress(step){
  $('#questionStep').textContent=`${step} / ${totalSurveySteps}`;
  $('#progressBar').style.width=`${step/totalSurveySteps*100}%`;
}
function startTest(){
  $('.onboarding-card').classList.remove('showing-result');
  questionIndex=0;
  answers=[];
  demographicAnswers={gender:null,ageBand:null};
  renderQuestion();
}
function renderQuestion(){
  const question=questions[questionIndex];
  setSurveyProgress(questionIndex+1);
  $('#questionArea').innerHTML=`<p class="test-kicker">나들이 취향 질문 ${questionIndex+1}</p><h2>${question.q}</h2><div class="answer-list">${question.answers.map(([text,type])=>`<button class="answer-button" data-type="${type}">${text}</button>`).join('')}</div>`;
  document.querySelectorAll('.answer-button').forEach(button=>button.addEventListener('click',()=>{
    answers.push(button.dataset.type);
    questionIndex++;
    questionIndex<questions.length?renderQuestion():renderGenderQuestion();
  }));
}
function renderGenderQuestion(){
  setSurveyProgress(questions.length+1);
  $('#questionArea').innerHTML=`<p class="test-kicker">맞춤 추천 기본 정보</p><h2>성별을 알려주세요</h2><p class="test-description">행사에서 공식 대상을 안내한 경우에만 가볍게 반영해요.</p><div class="demographic-choice-grid gender-choice-grid"><button class="demographic-button" data-gender="male"><span>남성</span></button><button class="demographic-button" data-gender="female"><span>여성</span></button><button class="demographic-button demographic-skip" data-gender=""><span>응답하지 않음</span></button></div><p class="local-data-note">선택 정보는 이 브라우저에만 저장되며 서버로 전송되지 않아요.</p>`;
  document.querySelectorAll('[data-gender]').forEach(button=>button.addEventListener('click',()=>{
    demographicAnswers.gender=button.dataset.gender||null;
    renderAgeQuestion();
  }));
}
function renderAgeQuestion(){
  setSurveyProgress(totalSurveySteps);
  const ageButtons=ageBands.map(ageBand=>`<button class="demographic-button" data-age="${escapeHtml(ageBand)}"><span>${escapeHtml(ageBand)}</span></button>`).join('');
  $('#questionArea').innerHTML=`<p class="test-kicker">맞춤 추천 기본 정보</p><h2>연령대를 알려주세요</h2><p class="test-description">성인 프로그램과 공식 추천 대상을 확인하는 데 사용해요.</p><div class="demographic-choice-grid age-choice-grid">${ageButtons}<button class="demographic-button demographic-skip" data-age=""><span>응답하지 않음</span></button></div><p class="local-data-note">선택 정보는 이 브라우저에만 저장되며 서버로 전송되지 않아요.</p>`;
  document.querySelectorAll('[data-age]').forEach(button=>button.addEventListener('click',()=>{
    demographicAnswers.ageBand=button.dataset.age||null;
    showResult();
  }));
}

function showResult(){
  tasteProfile=calculateTasteProfile(answers,demographicAnswers);
  const {primary,scores}=tasteProfile;
  const meta=tasteMeta[primary];
  localStorage.setItem('daejeonMap.personalityProfile',JSON.stringify(tasteProfile));
  localStorage.setItem('daejeonMap.personalityResult',primary);
  localStorage.setItem('daejeonMap.onboardingCompleted','true');
  applyTasteProfileUI();
  renderFestivals();
  renderRankings();
  $('.onboarding-card').classList.add('showing-result');
  $('#questionStep').textContent='RESULT';
  $('#progressBar').style.width='100%';
  const scoreRows=tasteTypes.map(type=>`<div class="taste-score-row ${type===primary?'primary':''}"><span>${escapeHtml(tasteMeta[type].short)}</span><i><b style="width:${scores[type]}%"></b></i><strong>${scores[type]}%</strong></div>`).join('');
  const demographicLabels=[tasteProfile.demographics.ageBand,genderLabels[tasteProfile.demographics.gender]].filter(Boolean);
  const demographicSummary=demographicLabels.length?`<p class="demographic-summary"><span>추천에 반영</span><b>${demographicLabels.map(escapeHtml).join(' · ')}</b></p>`:'<p class="demographic-summary"><span>기본 정보</span><b>응답하지 않음</b></p>';
  $('#questionArea').innerHTML=`<p class="test-kicker">꿈돌이의 취향 분석 완료</p><h2>당신은<br />‘${escapeHtml(primary)}’이에요!</h2><div class="result-tags">${meta.tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div><p class="test-description">${escapeHtml(meta.description)}<br />취향·거리·일정과 선택 정보를 함께 계산할게요.</p>${demographicSummary}<div class="taste-score-list" aria-label="네 가지 나들이 취향 비율">${scoreRows}</div><button class="primary-button" id="finishTest">맞춤 추천 보러가기 <span>→</span></button>`;
  $('#finishTest').addEventListener('click',()=>closeOnboarding(true));
}

function closeOnboarding(useCurrentLocation=false){
  localStorage.setItem('daejeonMap.onboardingCompleted','true');
  $('#onboardingModal').classList.remove('show');
  if(useCurrentLocation)moveToCurrentLocation();
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
  if(!expanded)section.scrollTop=0;
}

function beginRecommendSheetDrag(event){
  if(event.button!==undefined&&event.button!==0)return;
  const section=$('.recommend-section');
  if($('.app-shell').classList.contains('is-place-focused'))return;
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
    startOffset,
    state,
    moved:false,
    previewOffset,
    collapsedOffset
  };
  section.classList.add('is-dragging');
  section.style.setProperty('--recommend-drag-y',`${recommendSheetDrag.startOffset}px`);
  if(event.pointerId!==undefined){try{event.currentTarget.setPointerCapture?.(event.pointerId);}catch{/* Pointer capture is optional. */}}
}

function moveRecommendSheetDrag(event){
  if(!recommendSheetDrag||event.pointerId!==recommendSheetDrag.pointerId)return;
  const delta=event.clientY-recommendSheetDrag.startY;
  if(Math.abs(delta)>5)recommendSheetDrag.moved=true;
  const offset=Math.max(0,Math.min(recommendSheetDrag.collapsedOffset,recommendSheetDrag.startOffset+delta));
  $('.recommend-section').style.setProperty('--recommend-drag-y',`${offset}px`);
  if(recommendSheetDrag.moved)event.preventDefault();
}

function endRecommendSheetDrag(event){
  if(!recommendSheetDrag||event.pointerId!==recommendSheetDrag.pointerId)return;
  const drag=recommendSheetDrag;
  const delta=event.clientY-drag.startY;
  const endOffset=Math.max(0,Math.min(drag.collapsedOffset,drag.startOffset+delta));
  recommendSheetDrag=null;
  suppressRecommendSheetGestureClick=true;
  window.setTimeout(()=>{suppressRecommendSheetGestureClick=false;},0);
  const isTap=Math.abs(delta)<10;
  let nextState=drag.state;
  if(isTap){
    nextState=drag.state==='collapsed'?'preview':drag.state==='preview'?'expanded':'preview';
  }else if(drag.state==='expanded'){
    nextState=delta>54?'preview':'expanded';
  }else if(drag.state==='collapsed'){
    nextState=delta<-42?'preview':'collapsed';
  }else if(delta<-52){
    nextState='expanded';
  }else if(delta>52){
    nextState='collapsed';
  }else{
    const snaps=[['expanded',0],['preview',drag.previewOffset],['collapsed',drag.collapsedOffset]];
    nextState=snaps.sort((a,b)=>Math.abs(endOffset-a[1])-Math.abs(endOffset-b[1]))[0][0];
  }
  setRecommendationsState(nextState);
  requestAnimationFrame(()=>{
    const section=$('.recommend-section');
    section.classList.remove('is-dragging');
    section.style.removeProperty('--recommend-drag-y');
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
    section.style.removeProperty('--recommend-drag-y');
  });
}

function searchablePlaces(query=''){
  const keyword=query.trim().toLowerCase().replace(/\s+/g,'');
  const featuredIds=['sungsimdang','cnu','cityhall'];
  const featuredRank=id=>{const index=featuredIds.indexOf(id);return index===-1?99:index;};
  const source=keyword?places:[...places].sort((a,b)=>featuredRank(a.id)-featuredRank(b.id));
  return source.filter(place=>{
    if(!keyword)return featuredIds.includes(place.id)||place.type==='festival';
    return [place.name,place.address,place.summary,experienceFor(place).venue].some(value=>String(value||'').toLowerCase().replace(/\s+/g,'').includes(keyword));
  }).slice(0,8);
}

function renderSearchResults(query=''){
  const results=searchablePlaces(query);
  $('#searchResults').innerHTML=results.length?results.map(place=>`<button class="search-result" data-search-place="${escapeHtml(place.id)}"><span class="search-result-icon">${escapeHtml(place.emoji)}</span><span><small>${place.type==='festival'?escapeHtml(festivalDateBadge(place)):'대전 장소'}</small><b>${escapeHtml(place.name)}</b><em>${escapeHtml(place.address||experienceFor(place).venue||place.summary)}</em></span><i>→</i></button>`).join(''):`<p class="search-empty">검색 결과가 없어요. 다른 장소 이름을 입력해 보세요.</p>`;
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

applyTasteProfileUI();renderFestivals();renderRankings();initNaverMap();loadPlaces();
$('#visitDate').value=new Date().toISOString().slice(0,10);
if(localStorage.getItem('daejeonMap.onboardingCompleted')==='true')$('#onboardingModal').classList.remove('show');
$('#startTest').addEventListener('click',startTest);
$('#skipTest').addEventListener('click',()=>closeOnboarding(false));
$('#retestButton').addEventListener('click',()=>{localStorage.removeItem('daejeonMap.onboardingCompleted');localStorage.removeItem('daejeonMap.personalityProfile');localStorage.removeItem('daejeonMap.personalityResult');location.reload();});
$('#recommendSheetGrabber').addEventListener('pointerdown',beginRecommendSheetDrag);
document.addEventListener('pointermove',moveRecommendSheetDrag,{passive:false});
document.addEventListener('pointerup',endRecommendSheetDrag);
document.addEventListener('pointercancel',cancelRecommendSheetDrag);
$('#recommendSheetHandle').addEventListener('click',()=>{
  if(suppressRecommendSheetGestureClick){suppressRecommendSheetGestureClick=false;return;}
  const state=recommendationState();
  setRecommendationsState(state==='collapsed'?'preview':state==='preview'?'expanded':'preview');
});
document.querySelectorAll('[data-ranking-filter]').forEach(button=>button.addEventListener('click',()=>{
  rankingFilter=button.dataset.rankingFilter;
  document.querySelectorAll('[data-ranking-filter]').forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));});
  renderRankings();
}));
document.querySelectorAll('[data-close-sheet]').forEach(button=>button.addEventListener('click',closeSheets));
$('#sheetBackdrop').addEventListener('click',closeSheets);
$('#recalculate').addEventListener('click',()=>{parkingWeather=null;renderParkings();loadParkingForActivePlace();toast('선택한 시간으로 요금을 다시 계산했어요.');});
$('#closeNav').addEventListener('click',()=>$('#navigationModal').classList.remove('show'));
document.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>{localStorage.setItem('daejeonMap.preferredNavigation',button.dataset.nav);$('#navigationModal').classList.remove('show');toast(`${button.dataset.nav}로 ${pendingParking} 안내를 시작해요.`);}));
$('#currentButton').addEventListener('click',moveToCurrentLocation);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&isPlaceFocused){event.preventDefault();resetMapFocus();}});
$('#searchButton').addEventListener('click',openSearch);
$('#closeSearch').addEventListener('click',()=>$('#searchModal').classList.remove('show'));
$('#searchModal').addEventListener('click',event=>{if(event.target===$('#searchModal'))$('#searchModal').classList.remove('show');});
$('#placeSearchForm').addEventListener('submit',event=>{event.preventDefault();renderSearchResults($('#placeSearchInput').value);});
$('#placeSearchInput').addEventListener('input',()=>renderSearchResults($('#placeSearchInput').value));
document.querySelectorAll('[data-search-query]').forEach(button=>button.addEventListener('click',()=>{$('#placeSearchInput').value=button.dataset.searchQuery;renderSearchResults(button.dataset.searchQuery);}));
$('#placeSheetGrabber').addEventListener('pointerdown',beginPlaceSheetDrag);
document.addEventListener('pointermove',movePlaceSheetDrag,{passive:false});
document.addEventListener('pointerup',endPlaceSheetDrag);
document.addEventListener('pointercancel',endPlaceSheetDrag);
$('#placeSheetHandle').addEventListener('click',()=>{
  if(suppressPlaceSheetGestureClick){suppressPlaceSheetGestureClick=false;return;}
  if($('#placeSheet').classList.contains('is-expanded'))setPlaceSheetExpanded(false);
  else setPlaceSheetExpanded(true);
});
$('#plannerSheetGrabber').addEventListener('pointerdown',beginPlannerSheetDrag);
document.addEventListener('pointermove',movePlannerSheetDrag,{passive:false});
document.addEventListener('pointerup',endPlannerSheetDrag);
document.addEventListener('pointercancel',endPlannerSheetDrag);
$('#plannerSheetHandle').addEventListener('click',()=>{
  if(suppressPlannerSheetGestureClick){suppressPlannerSheetGestureClick=false;return;}
  closeSheets();
});
window.addEventListener('resize',()=>{if($('#placeSheet').classList.contains('show'))setPlaceSheetHeights();});
