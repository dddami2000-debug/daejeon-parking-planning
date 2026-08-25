const fallbackPlaces = [
  {id:'zero',type:'festival',name:'대전 0시 축제',address:'대전광역시 중구 중앙로 일대',date:'축제',startDate:'2026-08-21',endDate:'2026-08-28',period:'8.21 — 8.28',hours:'14:00 — 00:00',distance:2.4,eta:12,taste:94,emoji:'🎆',imageUrl:'https://www.daejeon.go.kr/plugins/crosseditor4/binary/images/000396/20250822142519537_QFJ4O0PY.jpg',color:'#ff7657',tile:'#fff0eb',lat:36.3298,lng:127.4307,summary:'대전의 한여름 밤을 거대한 무대로 바꾸는, 도심 한복판의 대표 축제예요.',reason:'공연·축제 취향과 94% 일치해요',gradient:'linear-gradient(135deg,#ff7657,#ed4e7a)'},
  {id:'science',type:'festival',name:'대전 사이언스 페스티벌',address:'대전광역시 유성구 엑스포로 일대',date:'축제',startDate:'2026-09-02',endDate:'2026-09-05',period:'9.02 — 9.05',hours:'10:00 — 20:00',distance:3.1,eta:16,taste:88,emoji:'🚀',imageUrl:'https://www.daejeon.go.kr/plugins/crosseditor4/binary/images/000326/20241016174536107_AEQ50TLH.png',color:'#8d72e1',tile:'#f0edff',lat:36.3746,lng:127.3869,summary:'과학도시 대전의 상상력을 직접 만지고 즐기는 대표 체험 축제예요.',reason:'가족·체험 취향에 딱 맞아요',gradient:'linear-gradient(135deg,#8d72e1,#5f78e9)'},
  {id:'wine',type:'festival',name:'대전 국제 와인 EXPO',address:'대전광역시 유성구 엑스포로 일대',date:'축제',startDate:'2026-09-11',endDate:'2026-09-13',period:'9.11 — 9.13',hours:'11:00 — 21:00',distance:4.2,eta:19,taste:84,emoji:'🍇',imageUrl:'https://www.djwinefair.com/images/korean/new_202208/main/msection02/mp_tab04/mp_tab04_img02.JPG',color:'#a64f72',tile:'#faeaf1',lat:36.3741,lng:127.3860,summary:'와인과 미식, 음악이 한자리에 모이는 대전의 특별한 가을 미식 축제예요.',reason:'감성·데이트 취향과 잘 맞아요',gradient:'linear-gradient(135deg,#a64f72,#e58580)'}
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
  {key:'mobility',q:'이동 조건은 어떤가요?',description:'지금 갈 수 있는 거리와 환경을 추천에 반영해요.',answers:[['가까운 곳','역사·힐링형','near'],['상관없음','공연·축제형','any'],['실내 우선','가족·체험형','indoor']]}
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
let visitConditions = {companions:null,activity:null,mobility:null};
let demographicAnswers = {gender:null,ageBand:null};
let excludedParkings = [];
let pendingParking = null;
let naverMap = null;
let placeMarkers = [];
let parkingMarkers = [];
let currentLocationMarker = null;
let userPosition = null;
let isPlaceFocused = false;
let rankingFilter = 'popular';
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
const parkingCache = new Map();
let placeSheetDrag = null;
let suppressPlaceSheetGestureClick = false;
let plannerSheetDrag = null;
let suppressPlannerSheetGestureClick = false;
let plannerDismissTimer = null;
let recommendSheetDrag = null;
let suppressRecommendSheetGestureClick = false;
let tasteProfile = readTasteProfile();
const GESTURE_VELOCITY_THRESHOLD = .11;

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
      if(saved.conditions)visitConditions={...visitConditions,...saved.conditions};
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
  if(place.type!=='festival'||festivalTimingScore(place)<=0)return false;
  if(!range)return true;
  const festivalStart=koreaDateTime(place.startDate);
  const festivalEnd=koreaDateTime(place.endDate,true);
  if(!Number.isFinite(festivalStart)||!Number.isFinite(festivalEnd))return false;
  return festivalStart<=range.end&&festivalEnd>=range.start;
}
function filteredFestivals(){return places.filter(place=>festivalMatchesDateFilter(place));}
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
  if(days===0)return '오늘 마감';
  if(days<=7)return `마감 D-${days}`;
  return `${shortKoreanDate(place.endDate)} 마감`;
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
    [tasteMatchFor(place),62],
    [distanceRecommendationScore(place),23],
    [festivalTimingScore(place),15]
  ].filter(([score])=>Number.isFinite(score));
  const weightTotal=signals.reduce((sum,[,weight])=>sum+weight,0);
  return weightTotal?Math.round(signals.reduce((sum,[score,weight])=>sum+score*weight,0)/weightTotal):0;
}
function recommendationFitLabel(place){
  const score=recommendationScoreFor(place);
  return score>=82?'매우 잘 맞아요':score>=68?'잘 맞아요':'방문 조건에 맞아요';
}
function recommendationSignalsFor(place){
  const signals=[];
  if(place.type==='festival')signals.push(festivalTimingScore(place)>=90?'✓ 선택한 날짜에 열리는 행사':'✓ 일정이 확인된 행사');
  if(Number.isFinite(Number(place.distance)))signals.push(`✓ 현재 위치에서 차로 약 ${place.eta}분`);
  const activityLabels={festival:'축제',experience:'체험',mood:'감성',rest:'휴식'};
  if(visitConditions.activity)signals.push(`✓ ${activityLabels[visitConditions.activity]} 활동 조건과 일치`);
  if(visitConditions.mobility==='near'&&Number(place.distance)>3)signals.push('△ 가까운 곳을 원한다면 이동 거리를 확인하세요');
  if(visitConditions.mobility==='indoor'&&!/실내|전시|박물관|컨벤션|과학/.test(audienceTextFor(place)))signals.push('△ 야외 일정이 포함될 수 있어요');
  return signals.slice(0,4);
}
function recommendationReasonFor(place){
  return recommendationSignalsFor(place).join(' · ')||'✓ 일정과 이동 거리를 확인한 추천이에요.';
}
function applyTasteProfileUI(){
  if(!tasteProfile)return;
  const activityLabels={festival:'축제',experience:'체험',mood:'감성',rest:'휴식'};
  const activity=activityLabels[tasteProfile.conditions?.activity];
  $('#profileLabel').textContent='방문 조건';
  $('#retestButton').setAttribute('title','방문 조건 다시 설정');
  $('#recommendTitle').textContent=activity?`${activity} 중심 추천`:'이번 주말, 대전 어디로 갈까요?';
  $('.dream-copy').innerHTML='<span class="mini-dream">★</span> 오늘 갈 수 있는 곳을 골랐어요';
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
  renderFestivals();
  renderRankings();
  renderMap();
}

function experienceFor(place){
  const curated=curatedExperiences.find(item=>item.match.some(keyword=>String(place.name).toLowerCase().includes(keyword.toLowerCase())));
  if(curated)return curated;
  return {
    venue:place.metadata?.place_name||place.address||'행사장 정보 확인',
    admission:place.metadata?.usage_fee||'공식 데이터에 요금 정보가 없어요',
    audience:'친구 · 연인 · 가족',
    tags:['공식 일정 확인 필요'],
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

function compactPlaceArea(place){
  const curated=compactLabelFor(place);
  if(curated)return curated.area;
  if(place.region)return String(place.region);
  const address=String(place.address||place.metadata?.address||place.metadata?.road_address||'').trim();
  return window.FestivalRegion?.festivalRegionLabel(address)||'지역 정보 확인';
}

function placeValueLine(place){
  const name=String(place?.name||'').replace(/\s+/g,'').toLowerCase();
  const curated=curatedPlaceValueLines.find(item=>item.match.some(keyword=>name.includes(keyword.replace(/\s+/g,'').toLowerCase())));
  if(curated)return curated.copy;
  const source=String(place?.summary||'').replace(/\s+/g,' ').trim();
  if(source)return source.replace(/[.!?。]+$/,'');
  return '평범한 하루를 여행의 한 장면으로 바꿔 줄 지역 축제';
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

async function loadPlaces(){
  try{
    const response=await fetch('/api/places');
    if(!response.ok)throw new Error('places_unavailable');
    const payload=await response.json();
    if(!Array.isArray(payload.places)||!payload.places.length)throw new Error('empty_places');
    places=payload.places.filter(place=>place.type==='festival').map(normalizeApiPlace);
    if(userPosition)updateDistancesFromCurrentLocation(userPosition.lat,userPosition.lng);
    activePlace=places.find(hasCoordinates)||places[0];
    placeSourceAttribution=payload.sourceAttribution||'';
    placeDataState='live';
    placeDataUpdatedAt=payload.generatedAt||new Date().toISOString();
    renderFestivals();renderRankings();renderMap();
    toast('대전 공공데이터를 불러왔어요.');
  }catch{
    places=[...fallbackPlaces];
    activePlace=places[0];
    placeDataState='demo';
    placeDataUpdatedAt=null;
    placeSourceAttribution='샘플 데이터 · 공식 운영 정보는 출발 전 확인 필요';
    renderFestivals();renderRankings();renderMap();
    toast('공공데이터 연결이 어려워 샘플 화면을 표시해요.');
  }
}

async function loadParkingForActivePlace(){
  if(!hasCoordinates(activePlace))return;
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
    parkingWeather=payload.weather||null;
    if(!Array.isArray(payload.parkingLots)||!payload.parkingLots.length)throw new Error('empty_parking');
    parkingTemplates=payload.parkingLots.map(parking=>({...parking,dataStatus:'live'}));
    parkingSourceAttribution=payload.sourceAttribution||'';
    parkingDataUpdatedAt=payload.generatedAt||new Date().toISOString();
    parkingDataState='live';
    renderParkings();renderMap();
  }catch{
    parkingTemplates=fallbackParkingTemplates.map((parking,index)=>({...parking,id:`demo-parking-${index}`,free:parking.base===0&&parking.add===0,unknownFee:false,scheduleVerified:true,feeVerified:true,availabilityKnown:false,updatedAt:'2026-08-25T00:00:00+09:00',dataStatus:'demo'}));
    parkingSourceAttribution='샘플 주차장 데이터 · 실제 운영·요금은 출발 전 확인 필요';
    parkingDataUpdatedAt=null;
    parkingDataState='demo';
    renderParkings();renderMap();
  }
}

function renderFestivals(){
  if(placeDataState==='loading'){
    $('#festivalFilterStatus').textContent='확인 중';
    $('#placeDataStatus').innerHTML='';
    $('#festivalSlider').innerHTML=placeLoadingMarkup();
    return;
  }
  const festivalPlaces = filteredFestivals()
    .sort((a,b)=>recommendationScoreFor(b)-recommendationScoreFor(a)||a.distance-b.distance);
  $('#festivalFilterStatus').textContent=festivalFilterLabel(festivalPlaces.length);
  $('#festivalDateTrigger').classList.toggle('has-value',Boolean(festivalDateFilter.start||festivalDateFilter.end));
  $('#placeDataStatus').innerHTML=placeDataNotice();
  $('#festivalSlider').innerHTML = festivalPlaces.length?festivalPlaces.map(place=>{
    const category=compactPlaceCategory(place);
    const area=compactPlaceArea(place);
    const valueLine=placeValueLine(place);
    return `<button class="festival-card" data-place="${escapeHtml(place.id)}" aria-label="${escapeHtml(`${place.name}, ${category}, ${valueLine}, ${recommendationFitLabel(place)}, ${area} 상세 보기`)}" style="--card-gradient:${place.gradient};--festival-accent:${place.color}"><span class="festival-visual"></span><span class="festival-shape festival-photo">${photoVisual(place)}</span><span class="festival-content festival-content-compact"><span class="compact-place-kind">${escapeHtml(category)}</span><h3>${escapeHtml(place.name)}</h3><span class="compact-place-value">${escapeHtml(valueLine)}</span><span class="compact-place-location">${escapeHtml(area)}</span></span></button>`;
  }).join(''):`<div class="festival-filter-empty"><b>선택한 날짜에 열리는 축제가 없어요.</b><span>기간을 넓히거나 ‘전체’를 눌러보세요.</span></div>`;
  document.querySelectorAll('.festival-card').forEach(card=>card.addEventListener('click',()=>openPlace(card.dataset.place)));
}

function renderRankings(){
  if(placeDataState==='loading'){
    $('#rankingList').innerHTML='<div class="ranking-loading" aria-hidden="true"><i></i><i></i><i></i></div>';
    return;
  }
  const isDeadline=rankingFilter==='deadline';
  $('#rankingTitle').textContent=isDeadline?'마감 임박 순위':'축제 인기 순위';
  $('#rankingMetric').textContent=isDeadline?'종료일 가까운 순':'방문 조건·거리 반영';
  const ranked=filteredFestivals()
    .sort((a,b)=>isDeadline
      ? festivalDeadlineValue(a)-festivalDeadlineValue(b)||recommendationScoreFor(b)-recommendationScoreFor(a)
      : recommendationScoreFor(b)-recommendationScoreFor(a)||(Number(a.distance)||99)-(Number(b.distance)||99))
    .slice(0,6);
  $('#rankingList').innerHTML=ranked.length?ranked.map((place,index)=>{
    const category=compactPlaceCategory(place);
    const area=compactPlaceArea(place);
    const scoreCopy=recommendationFitLabel(place);
    const deadline=isDeadline?`<em>${escapeHtml(festivalDeadlineLabel(place))}</em>`:'';
    return `<button class="ranking-item" type="button" data-ranking-place="${escapeHtml(place.id)}" aria-label="${escapeHtml(`${index+1}위 ${place.name}, ${category}, ${scoreCopy}, ${area}${isDeadline?`, ${festivalDeadlineLabel(place)}`:''} 상세 보기`)}"><strong class="ranking-number">${index+1}</strong><span class="ranking-copy"><small>${escapeHtml(`${category} · ${scoreCopy}`)}</small><b>${escapeHtml(place.name)}</b><span>${escapeHtml(area)}</span>${deadline}</span><span class="ranking-photo" style="--ranking-tile:${place.tile||'#f2f4f3'}">${photoVisual(place)}</span></button>`;
  }).join(''):'<p class="ranking-empty">선택한 날짜에 순위를 표시할 축제가 없어요.</p>';
  document.querySelectorAll('[data-ranking-place]').forEach(button=>button.addEventListener('click',()=>openPlace(button.dataset.rankingPlace)));
}

function applyFestivalDateFilter(changedField){
  const startInput=$('#festivalStartDate');
  const endInput=$('#festivalEndDate');
  if(startInput.value&&endInput.value&&startInput.value>endInput.value){
    if(changedField==='start')endInput.value=startInput.value;
    else startInput.value=endInput.value;
  }
  festivalDateFilter={start:startInput.value||null,end:endInput.value||null};
  renderFestivals();
  renderRankings();
  renderMap();
}

function clearFestivalDateFilter(){
  $('#festivalStartDate').value='';
  $('#festivalEndDate').value='';
  festivalDateFilter={start:null,end:null};
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

function groupPlacesForZoom(visible,zoom){
  const withCenter=places=>({
    places,
    lat:places.reduce((sum,place)=>sum+Number(place.lat),0)/places.length,
    lng:places.reduce((sum,place)=>sum+Number(place.lng),0)/places.length
  });
  let groups=visible.map(place=>withCenter([place]));
  if(!naverMap?.getProjection||!groups.length)return groups;
  const minGap=zoom<=12?78:68;
  const projection=naverMap.getProjection();

  for(let pass=0;pass<visible.length;pass++){
    let offsets;
    try{
      offsets=groups.map(group=>projection.fromCoordToOffset(new naver.maps.LatLng(group.lat,group.lng)));
    }catch{return groups;}
    const parent=groups.map((_,index)=>index);
    const find=index=>{while(parent[index]!==index){parent[index]=parent[parent[index]];index=parent[index];}return index;};
    const unite=(left,right)=>{const leftRoot=find(left),rightRoot=find(right);if(leftRoot!==rightRoot)parent[rightRoot]=leftRoot;};
    for(let left=0;left<offsets.length;left++){
      for(let right=left+1;right<offsets.length;right++){
        if(Math.abs(offsets[left].x-offsets[right].x)<minGap&&Math.abs(offsets[left].y-offsets[right].y)<minGap)unite(left,right);
      }
    }
    const merged=new Map();
    groups.forEach((group,index)=>{
      const root=find(index);
      merged.set(root,[...(merged.get(root)||[]),...group.places]);
    });
    if(merged.size===groups.length)break;
    groups=[...merged.values()].map(withCenter);
  }
  return groups;
}

function renderMap(){
  const visible = placeDataState==='loading'?[]:places.filter(place=>hasCoordinates(place)&&festivalMatchesDateFilter(place));
  renderNearbyPanel(visible);
  if(!naverMap)return;
  placeMarkers.forEach(marker=>marker.setMap(null));
  parkingMarkers.forEach(marker=>marker.setMap(null));
  parkingMarkers=[];
  if(isPlaceFocused){
    if(!hasCoordinates(activePlace))return;
    const targetPosition=new naver.maps.LatLng(activePlace.lat,activePlace.lng);
    placeMarkers=[new naver.maps.Marker({map:naverMap,position:targetPosition,title:activePlace.name,zIndex:30,icon:{content:`<span class="map-marker selected-map-marker place-pin-festival" style="--pin:${activePlace.color}" aria-label="선택한 축제"><span class="marker-bubble"><span class="marker-icon">${markerVisual(activePlace)}</span></span></span>`,anchor:new naver.maps.Point(24,46)}})];
    const recommendedParkings=currentParkingList();
    const otherParkings=allParkingCandidates().filter(parking=>!recommendedParkings.some(recommended=>recommended.name===parking.name));
    parkingMarkers=recommendedParkings.map((parking,index)=>{
      const position=parkingPosition(index,parking);
      const parkingId=encodeURIComponent(parking.id||parking.name);
      return new naver.maps.Marker({map:naverMap,position,title:parking.name,zIndex:20-index,icon:{content:`<button class="parking-map-marker parking-rank-dot rank-${index+1}" aria-label="${escapeHtml(parking.rankLabel)} ${escapeHtml(parking.name)}" onclick="event.stopPropagation();window.showParkingInfo(decodeURIComponent('${parkingId}'),${index+1})"><span>${index+1}</span></button>`,anchor:new naver.maps.Point(18,18)}});
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
      const marker=new naver.maps.Marker({map:naverMap,position:new naver.maps.LatLng(group.lat,group.lng),title:`축제 ${group.places.length}곳`,zIndex:24,icon:{content:`<button class="place-cluster-marker" style="--cluster-color:#ff4f64" aria-label="축제 ${group.places.length}곳 확대해서 보기"><span>축제</span><b>${group.places.length}</b></button>`,anchor:new naver.maps.Point(31,31)}});
      naver.maps.Event.addListener(marker,'click',()=>focusMapOn(new naver.maps.LatLng(group.lat,group.lng),Math.min(18,zoom+2),'overview',600));
      return marker;
    }
    const place=group.places[0];
    const marker=new naver.maps.Marker({
      map:naverMap,
      position:new naver.maps.LatLng(place.lat,place.lng),
      title:place.name,
      zIndex:place.id===activePlace.id?20:10,
      icon:{
        content:`<button class="map-marker place-pin-festival ${place.id===activePlace.id?'active':''}" style="--pin:${place.color}" aria-label="${escapeHtml(place.name)} 상세 보기"><span class="marker-bubble"><span class="marker-icon">${markerVisual(place)}</span></span></button>`,
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
  naver.maps.Event.addListener(naverMap,'idle',()=>{if(!isPlaceFocused)renderMap();});
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
function placeRainNotice(place){
  return place.metadata?.rain_info||place.metadata?.cancellation_info||place.metadata?.cancel_info||'공식 데이터에 우천·취소 정보가 제공되지 않았어요.';
}
function placeHoursNotice(place){
  const hours=String(place.hours||'').trim();
  return hours&&!/확인/.test(hours)?hours:'공식 데이터에 운영 시간이 제공되지 않았어요. 출발 전에 공식 홈페이지에서 확인해 주세요.';
}

function openPlace(id){
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
  const placeLabel='축제';
  const locationCopy=hasCoordinates(activePlace)?`${activePlace.distance}km · 차로 ${activePlace.eta}분`:'지도 좌표 확인 중';
  const experience=experienceFor(activePlace);
  const sourceCopy=`<p class="data-source-note">${escapeHtml(placeSourceAttribution||'공식 출처 확인 필요')} · ${escapeHtml(dataUpdatedLabel(activePlace.updatedAt||placeDataUpdatedAt))}</p>`;
  const officialUrl=activePlace.homepageUrl||experience.officialUrl||null;
  const officialLink=officialUrl?`<a class="official-link" href="${escapeHtml(officialUrl)}" target="_blank" rel="noopener">공식 홈페이지 <span>↗</span></a>`:'<span class="official-link unavailable" aria-disabled="true">공식 홈페이지 정보 없음</span>';
  const status=placeOperationStatus(activePlace);
  const programs=experience.highlights.slice(0,3);
  const programsMarkup=programs.length?`<ol class="place-program-list">${programs.map(item=>`<li><span>${escapeHtml(item.icon)}</span><b>${escapeHtml(item.title)}</b></li>`).join('')}</ol>`:'<p class="missing-data-copy">공식 데이터에 세부 프로그램이 제공되지 않았어요.</p>';
  const hasHeroImage=Boolean(activePlace.imageUrl);
  const heroImage=hasHeroImage?`<img class="place-hero-photo" src="${escapeHtml(activePlace.imageUrl)}" alt="${escapeHtml(activePlace.name)} 대표 이미지" referrerpolicy="no-referrer" onerror="this.parentElement.classList.remove('has-photo');this.remove()" />`:'';
  $('#placeSheet').classList.add('festival-detail');
  $('#placeSheetContent').innerHTML=`<div class="place-hero place-hero-rich${hasHeroImage?' has-photo':''}" style="--hero:${activePlace.gradient};--emoji:'${escapeHtml(activePlace.emoji)}'">${heroImage}<div class="place-hero-badges"><span>${placeLabel}</span><span class="status-badge ${status.tone}">${escapeHtml(status.label)}</span></div><div class="place-hero-copy"><h2>${escapeHtml(activePlace.name)}</h2><p>${escapeHtml(placeValueLine(activePlace))}</p></div></div><div class="festival-chip-row">${experience.tags.slice(0,3).map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div><section class="place-intro"><h3>방문 전에 확인하세요</h3></section><div class="festival-facts"><div><span>행사 일정</span><b>${escapeHtml(activePlace.period||'일정 확인 필요')}</b></div><div><span>현재 상태</span><b>${escapeHtml(status.label)}</b></div><div><span>운영 시간</span><b>${escapeHtml(placeHoursNotice(activePlace))}</b></div><div><span>장소</span><b>${escapeHtml(experience.venue)}</b></div><div><span>입장·예약</span><b>${escapeHtml(experience.admission)}</b></div><div><span>현재 위치에서</span><b>${escapeHtml(locationCopy)}</b></div></div><section class="place-programs"><div class="place-section-heading"><h3>핵심 프로그램</h3><span>최대 3개</span></div>${programsMarkup}</section><div class="recommend-reason"><i>✓</i><span><strong>${escapeHtml(recommendationFitLabel(activePlace))}</strong><b>${escapeHtml(recommendationReasonFor(activePlace))}</b></span></div><section class="visit-verification"><div><span>우천·취소</span><b>${escapeHtml(placeRainNotice(activePlace))}</b></div><div><span>정보 기준</span><b>${escapeHtml(dataUpdatedLabel(activePlace.updatedAt||placeDataUpdatedAt))}</b></div></section><div class="festival-actions">${officialLink}<button class="primary-button" id="openPlanner">주차 플랜 보기 <span>→</span></button></div>${sourceCopy}`;
  document.querySelectorAll('.bottom-sheet').forEach(sheet=>sheet.classList.remove('show'));
  $('#sheetBackdrop').classList.remove('show');
  suppressPlaceSheetGestureClick=false;
  setPlaceSheetExpanded(false);
  setPlaceSheetHeights();
  $('#placeSheet').classList.add('show');
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

function canStartSheetDrag(event,sheet,grabberSelector){
  const target=event.target;
  if(!(target instanceof Element)||!sheet.contains(target))return false;
  if(target.closest('[data-no-sheet-drag]'))return false;
  if(target.closest(grabberSelector))return true;
  if(target.closest('button, a, input, select, textarea, label, [role="button"], [contenteditable="true"]'))return false;
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

function beginPlaceSheetDrag(event){
  if(event.button!==undefined&&event.button!==0)return;
  if(placeSheetDrag)return;
  const sheet=$('#placeSheet');
  if(!sheet.classList.contains('show'))return;
  if(!canStartSheetDrag(event,sheet,'.place-sheet-grabber'))return;
  event.preventDefault();
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
    moved:false
  };
  sheet.classList.add('is-dragging');
  if(event.pointerId!==undefined)event.currentTarget.setPointerCapture?.(event.pointerId);
}

function movePlaceSheetDrag(event){
  if(!placeSheetDrag||event.pointerId!==placeSheetDrag.pointerId)return;
  const delta=placeSheetDrag.startY-event.clientY;
  if(Math.abs(delta)>6)placeSheetDrag.moved=true;
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
function visitInterval(){
  const start=minutes($('#startTime').value),end=minutes($('#endTime').value);
  return {start,end,valid:start!==null&&end!==null&&end>start,duration:start!==null&&end!==null?end-start:0};
}
function parkingScheduleCheck(parking){
  const visit=visitInterval();
  const schedule=scheduleForVisit(parking);
  const open=minutes(schedule.open),close=minutes(schedule.close);
  if(!visit.valid)return {eligible:false,reason:'방문 시간을 다시 확인해 주세요.',code:'invalid-visit'};
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
  if(end<=start||start<open||end>close)return null;
  const paid=Math.max(0,Math.min(end,close)-Math.max(start,open));
  if(paid<=0)return null;
  if(!Number.isFinite(Number(parking.base))||!parking.addMin)return Number.isFinite(Number(parking.base))?Number(parking.base):null;
  return parking.base+Math.ceil(Math.max(0,paid-parking.baseMin)/parking.addMin)*parking.add;
}
function formatCost(parking){const cost=costFor(parking);return cost===null?'요금 확인 필요':`${cost.toLocaleString()}원`;}
function parkingHours(parking){const schedule=scheduleForVisit(parking);return schedule.open&&schedule.close?`${schedule.open}–${schedule.close}`:'운영시간 확인';}
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
  $('#parkingInfoContent').innerHTML=`<div class="parking-info-kicker"><span>${escapeHtml(parking.type)} 주차장</span><b>${rankCopy}</b></div><h2>${escapeHtml(parking.name)}</h2><div class="parking-info-grid"><div><span>예상 요금</span><b>${formatCost(parking)}</b><small>${escapeHtml(parkingFeeBasis(parking))}</small></div><div><span>도보 거리</span><b>${parking.walk}분</b></div><div><span>운영 시간</span><b>${escapeHtml(parkingHours(parking))}</b></div><div><span>주차 규모</span><b>${escapeHtml(capacity)}</b><small>실시간 혼잡도는 제공되지 않습니다.</small></div></div><p class="parking-info-reason">✓ ${escapeHtml(rankedSelectionReason({...parking,recommendationRank:planned?.recommendationRank||rank}))}</p><p class="data-source-note">${escapeHtml(parkingSourceAttribution||'주차장 정보 출처 확인 필요')} · ${escapeHtml(parkingDataFreshness(parking).label)}</p><div class="parking-info-actions"><button class="route-button" id="parkingInfoRoute">이곳으로 길안내</button><button class="parking-info-plan" id="parkingInfoPlan">주차 플랜에서 비교</button></div>`;
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
    $('#parkingTrustSummary').innerHTML='<b>이용 가능한 주차장을 확인하고 있어요</b><span>운영시간과 요금 규칙을 검증하는 중이에요.</span>';
    $('#parkingList').innerHTML='<div class="parking-loading" aria-hidden="true"><i></i><i></i><i></i></div>';
    return;
  }
  const list=currentParkingList();
  const report=parkingValidationReport();
  const excludedReasons=[report.scheduleExcluded&&`운영시간 ${report.scheduleExcluded}곳`,report.feeExcluded&&`요금 ${report.feeExcluded}곳`,report.capacityExcluded&&`주차면수 ${report.capacityExcluded}곳`].filter(Boolean).join(' · ');
  $('#parkingTrustSummary').innerHTML=`<b>신뢰 가능한 주차장 ${report.trusted}곳을 찾았어요.</b><span>${excludedReasons?`${excludedReasons}은 정보가 불확실해 제외했어요.`:'선택한 시간의 운영·요금을 확인했어요.'}${parkingDataState==='demo'?' 현재는 샘플 데이터입니다.':''}</span>`;
  $('#parkingList').innerHTML=list.length?list.map(parking=>{const capacity=Number.isFinite(Number(parking.capacity))?`${Number(parking.capacity).toLocaleString()}면`:'주차면수 확인 필요';return `<article class="parking-item parking-plan-rank-${parking.recommendationRank}"><div class="parking-plan-head"><span class="parking-plan-option" aria-label="${parking.recommendationRank}위">${parking.recommendationRank}</span><span class="parking-plan-reason"><b>${parkingPriority==='distance'?'거리 우선':parkingPriority==='price'?'가격 우선':'대형 주차장 우선'}</b><small>${escapeHtml(rankedSelectionReason(parking))}</small></span></div><span class="parking-type">${escapeHtml(parking.type)} 주차장</span><h3>${escapeHtml(parking.name)}</h3><div class="parking-meta"><span>도보 ${parking.walk}분</span><span>${escapeHtml(parkingHours(parking))} 운영</span><span>${escapeHtml(capacity)}</span></div><div class="parking-stats"><div class="criterion-stat"><span>예상 요금</span><b>${formatCost(parking)}</b><small>${escapeHtml(parkingFeeBasis(parking))}</small></div><div><span>혼잡도</span><b>제공 안 됨</b></div></div><div class="parking-actions"><button class="route-button" data-route="${escapeHtml(parking.name)}">이곳으로 길안내</button><button class="full-button" data-full="${escapeHtml(parking.name)}">이 주차장 제외</button></div></article>`;}).join(''):`<div class="parking-item parking-empty"><h3>확실하게 추천할 주차장이 없어요</h3><p class="place-description">선택한 시간에 운영하며 요금을 계산할 수 있는 후보가 없습니다. 시간을 바꾸거나 공식 주차 정보를 확인해 주세요.</p><button class="primary-button" id="resetParking">제외한 후보 다시 보기</button></div>`;
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

function setSurveyProgress(step){
  $('#questionStep').textContent=`${step} / ${totalSurveySteps}`;
  $('#progressBar').style.width=`${step/totalSurveySteps*100}%`;
}
function startTest(){
  $('.onboarding-card').classList.remove('showing-result');
  questionIndex=0;
  answers=[];
  visitConditions={companions:null,activity:null,mobility:null};
  renderQuestion();
}
function renderQuestion(){
  const question=questions[questionIndex];
  setSurveyProgress(questionIndex+1);
  $('#questionArea').innerHTML=`<p class="test-kicker">오늘의 방문 조건 ${questionIndex+1}</p><h2>${question.q}</h2><p class="test-description">${escapeHtml(question.description)}</p><div class="answer-list">${question.answers.map(([text,type,value])=>`<button class="answer-button" data-type="${type}" data-value="${value}">${text}</button>`).join('')}</div>`;
  document.querySelectorAll('.answer-button').forEach(button=>button.addEventListener('click',()=>{
    answers.push(button.dataset.type);
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
  renderFestivals();
  renderRankings();
  $('.onboarding-card').classList.add('showing-result');
  $('#questionStep').textContent='완료';
  $('#progressBar').style.width='100%';
  const labels={solo:'혼자',friends:'연인·친구',family:'가족',festival:'축제',experience:'체험',mood:'감성',rest:'휴식',near:'가까운 곳',any:'거리 상관없음',indoor:'실내 우선'};
  const selected=Object.values(visitConditions).map(value=>labels[value]).filter(Boolean);
  $('#questionArea').innerHTML=`<p class="test-kicker">방문 조건 설정 완료</p><h2>오늘 갈 수 있는 곳만<br />차분히 골라볼게요.</h2><div class="result-tags">${selected.map(label=>`<span>${escapeHtml(label)}</span>`).join('')}</div><div class="result-trust-copy"><b>퍼센트 대신 이유를 보여드려요.</b><span>운영 일정, 이동 거리, 선택한 활동을 근거로 추천하고 확인할 수 없는 정보는 따로 표시해요.</span></div><button class="primary-button" id="finishTest">추천과 주차 플랜 보기 <span>→</span></button>`;
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
  if(!expanded){
    section.scrollTop=0;
    setFestivalDateFilterOpen(false);
  }
}

function beginRecommendSheetDrag(event){
  if(event.button!==undefined&&event.button!==0)return;
  if(recommendSheetDrag)return;
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
    startTime:performance.now(),
    startOffset,
    state,
    moved:false,
    previewOffset,
    collapsedOffset
  };
  section.classList.add('is-dragging');
  section.style.transform=`translateY(${recommendSheetDrag.startOffset}px)`;
  if(event.pointerId!==undefined){try{event.currentTarget.setPointerCapture?.(event.pointerId);}catch{/* Pointer capture is optional. */}}
}

function moveRecommendSheetDrag(event){
  if(!recommendSheetDrag||event.pointerId!==recommendSheetDrag.pointerId)return;
  const delta=event.clientY-recommendSheetDrag.startY;
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
  suppressRecommendSheetGestureClick=true;
  window.setTimeout(()=>{suppressRecommendSheetGestureClick=false;},0);
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
  const keyword=query.trim().toLowerCase().replace(/\s+/g,'');
  const source=keyword?places:[...places].sort((a,b)=>recommendationScoreFor(b)-recommendationScoreFor(a));
  return source.filter(place=>{
    if(!keyword)return true;
    return [place.name,place.address,place.region,compactPlaceArea(place),place.summary,experienceFor(place).venue].some(value=>String(value||'').toLowerCase().replace(/\s+/g,'').includes(keyword));
  }).slice(0,8);
}

function renderSearchResults(query=''){
  const results=searchablePlaces(query);
  $('#searchResults').innerHTML=results.length?results.map(place=>`<button class="search-result" data-search-place="${escapeHtml(place.id)}"><span class="search-result-icon">${escapeHtml(place.emoji)}</span><span><small>${escapeHtml(`${festivalDateBadge(place)} · ${compactPlaceArea(place)}`)}</small><b>${escapeHtml(place.name)}</b><em>${escapeHtml(place.address||experienceFor(place).venue||place.summary)}</em></span><i>→</i></button>`).join(''):`<p class="search-empty">검색 결과가 없어요. 다른 축제 이름이나 지역을 입력해 보세요.</p>`;
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
$('#destinationEntry').addEventListener('click',()=>{closeOnboarding(false);window.setTimeout(openSearch,180);});
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
$('#currentButton').addEventListener('click',moveToCurrentLocation);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&isPlaceFocused){event.preventDefault();resetMapFocus();}});
$('#searchButton').addEventListener('click',openSearch);
$('#closeSearch').addEventListener('click',()=>$('#searchModal').classList.remove('show'));
$('#searchModal').addEventListener('click',event=>{if(event.target===$('#searchModal'))$('#searchModal').classList.remove('show');});
$('#placeSearchForm').addEventListener('submit',event=>{event.preventDefault();renderSearchResults($('#placeSearchInput').value);});
$('#placeSearchInput').addEventListener('input',()=>renderSearchResults($('#placeSearchInput').value));
document.querySelectorAll('[data-search-query]').forEach(button=>button.addEventListener('click',()=>{$('#placeSearchInput').value=button.dataset.searchQuery;renderSearchResults(button.dataset.searchQuery);}));
$('#placeSheet').addEventListener('pointerdown',beginPlaceSheetDrag);
document.addEventListener('pointermove',movePlaceSheetDrag,{passive:false});
document.addEventListener('pointerup',endPlaceSheetDrag);
document.addEventListener('pointercancel',endPlaceSheetDrag);
$('#placeSheetHandle').addEventListener('click',()=>{
  if(suppressPlaceSheetGestureClick){suppressPlaceSheetGestureClick=false;return;}
  if($('#placeSheet').classList.contains('is-expanded'))setPlaceSheetExpanded(false);
  else setPlaceSheetExpanded(true);
});
$('#placeSheetBack').addEventListener('click',()=>setPlaceSheetExpanded(false));
$('#placeSheetDismiss').addEventListener('click',resetMapFocus);
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
