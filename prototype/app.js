const places = [
  {id:'zero',type:'festival',name:'대전 0시 축제',date:'D-3',period:'8.21 — 8.28',hours:'14:00 — 00:00',distance:2.4,eta:12,taste:94,emoji:'🎆',color:'#ff7657',tile:'#fff0eb',x:62,y:49,lat:36.3283,lon:127.4260,summary:'중앙로를 가득 채우는 음악과 퍼레이드, 야시장까지 즐기는 대전 대표 여름 축제예요.',reason:'공연·축제 취향과 94% 일치해요',gradient:'linear-gradient(135deg,#ff7657,#ed4e7a)'},
  {id:'science',type:'festival',name:'대전 사이언스 페스티벌',date:'D-12',period:'9.02 — 9.05',hours:'10:00 — 20:00',distance:3.1,eta:16,taste:88,emoji:'🚀',color:'#8d72e1',tile:'#f0edff',x:38,y:37,lat:36.3765,lon:127.3880,summary:'과학도시 대전에서 만나는 로봇, 우주, AI 체험 프로그램을 한자리에서 즐겨요.',reason:'가족·체험 취향에 딱 맞아요',gradient:'linear-gradient(135deg,#8d72e1,#5f78e9)'},
  {id:'wine',type:'festival',name:'대전 국제 와인 EXPO',date:'D-21',period:'9.11 — 9.13',hours:'11:00 — 21:00',distance:4.2,eta:19,taste:84,emoji:'🍇',color:'#a64f72',tile:'#faeaf1',x:30,y:63,lat:36.3751,lon:127.3877,summary:'와인과 미식, 음악을 함께 즐기는 감성 가득한 도심 속 축제예요.',reason:'감성·데이트 취향과 잘 맞아요',gradient:'linear-gradient(135deg,#a64f72,#e58580)'},
  {id:'arboretum',type:'landmark',name:'한밭수목원',date:'오늘 열림',period:'연중 운영',hours:'06:00 — 21:00',distance:1.2,eta:7,taste:91,emoji:'🌿',color:'#55b98a',tile:'#e8f8ef',x:47,y:43,lat:36.3689,lon:127.3888,summary:'도심 한가운데서 천천히 걷고 쉬어갈 수 있는 대전의 대표 녹색 공간이에요.',reason:'지금 가장 가깝고 산책하기 좋아요',gradient:'linear-gradient(135deg,#58bd8e,#90d19a)'},
  {id:'expo',type:'landmark',name:'엑스포과학공원',date:'오늘 열림',period:'연중 운영',hours:'10:00 — 22:00',distance:2.8,eta:13,taste:86,emoji:'🌙',color:'#6294f7',tile:'#eaf1ff',x:42,y:25,lat:36.3750,lon:127.3874,summary:'한빛탑과 엑스포다리를 따라 대전의 과학 감성과 야경을 함께 만날 수 있어요.',reason:'야경과 사진을 좋아한다면 추천해요',gradient:'linear-gradient(135deg,#4c8ef2,#77c8e9)'},
  {id:'history',type:'landmark',name:'대전근현대사전시관',date:'오늘 열림',period:'화—일 운영',hours:'10:00 — 18:00',distance:2.1,eta:11,taste:79,emoji:'🏛️',color:'#d08a45',tile:'#fff3e4',x:57,y:58,lat:36.3253,lon:127.4215,summary:'옛 충남도청 건축과 대전의 근현대 이야기를 차분하게 둘러볼 수 있어요.',reason:'역사·힐링 취향에 어울려요',gradient:'linear-gradient(135deg,#c27b3c,#e7b65e)'}
];

const fallbackParkingTemplates = [
  {name:'중앙로 공영주차장',type:'공영',distance:0.42,drive:4,walk:6,capacity:118,open:'09:00',close:'22:00',base:500,baseMin:30,add:200,addMin:10,reason:'목적지까지 가장 가까워요'},
  {name:'대흥동 제1노상주차장',type:'노상',distance:0.68,drive:6,walk:9,capacity:46,open:'09:00',close:'19:00',base:300,baseMin:30,add:200,addMin:10,reason:'19시 이후 무료라 저녁 방문에 유리해요'},
  {name:'중구청 부설 개방주차장',type:'공공기관',distance:0.91,drive:7,walk:12,capacity:82,open:'18:00',close:'23:30',base:0,baseMin:0,add:0,addMin:10,reason:'선택 시간에 무료로 이용할 수 있어요'},
  {name:'우리들공원 공영주차장',type:'공영',distance:1.18,drive:8,walk:15,capacity:156,open:'08:00',close:'23:00',base:600,baseMin:30,add:300,addMin:10,reason:'주차면이 넉넉한 대안이에요'}
];

let parkingRows = [];

const questions = [
  {q:'친구와 갑자기 3시간이 비었어요. 어디로 갈까요?',answers:[['사람 많은 축제에서 신나게 놀기','공연·축제형'],['예쁜 공간에서 사진 남기기','감성·데이트형'],['새로운 체험을 함께 해보기','가족·체험형'],['조용한 곳을 천천히 걷기','역사·힐링형']]},
  {q:'나들이에서 절대 포기할 수 없는 한 가지는?',answers:[['현장 분위기와 음악','공연·축제형'],['예쁜 풍경과 맛있는 음식','감성·데이트형'],['함께 즐길 재미있는 프로그램','가족·체험형'],['붐비지 않는 여유','역사·힐링형']]},
  {q:'사진첩에 가장 많이 남아 있는 장면은?',answers:[['공연과 사람들의 열기','공연·축제형'],['노을, 야경, 감성 카페','감성·데이트형'],['웃고 있는 가족과 친구','가족·체험형'],['건축, 자연, 오래된 골목','역사·힐링형']]},
  {q:'오늘의 에너지는 어느 쪽에 가까워요?',answers:[['뭐든 좋아! 신나게 놀 준비 완료','공연·축제형'],['설레는 분위기를 느끼고 싶어','감성·데이트형'],['새롭고 재미있는 걸 해보고 싶어','가족·체험형'],['조용히 충전하고 싶어','역사·힐링형']]},
  {q:'여행을 마치고 가장 듣고 싶은 말은?',answers:[['오늘 진짜 뜨거웠다!','공연·축제형'],['여기 분위기 정말 좋았다','감성·데이트형'],['우리 다음에 또 같이 오자','가족·체험형'],['오랜만에 제대로 쉬었다','역사·힐링형']]}
];

const $ = selector => document.querySelector(selector);
let activePlace = places[0];
let activeFilter = 'all';
let questionIndex = -1;
let answers = [];
let excludedParkings = [];
let pendingParking = null;

function renderFestivals(){
  const festivalPlaces = places.filter(place=>place.type==='festival');
  $('#festivalSlider').innerHTML = festivalPlaces.map(place=>`<button class="festival-card" data-place="${place.id}" style="--card-gradient:${place.gradient}"><span class="festival-visual"></span><span class="festival-shape">${place.emoji}</span><span class="festival-content"><span class="festival-badges"><span class="festival-badge hot">${place.date}</span><span class="festival-badge">취향 ${place.taste}%</span></span><h3>${place.name}</h3><p>${place.period} · ${place.hours}</p><span class="festival-meta"><span>⌖ ${place.distance}km</span><span>차로 ${place.eta}분</span></span></span></button>`).join('');
  document.querySelectorAll('.festival-card').forEach(card=>card.addEventListener('click',()=>openPlace(card.dataset.place)));
}

function renderMap(){
  const visible = places.filter(place=>activeFilter==='all'||place.type===activeFilter);
  $('#mapMarkers').innerHTML = visible.map(place=>`<button class="map-marker ${place.id===activePlace.id?'active':''}" data-place="${place.id}" style="left:${place.x}%;top:${place.y}%;--bubble:${place.color}"><span class="marker-bubble"><span class="marker-icon">${place.emoji}</span><span class="marker-text"><b>${place.name}</b><small>${place.date} · ${place.distance}km</small></span></span></button>`).join('');
  document.querySelectorAll('.map-marker').forEach(marker=>marker.addEventListener('click',()=>openPlace(marker.dataset.place)));
  const near = [...visible].sort((a,b)=>a.distance-b.distance).slice(0,4);
  $('#nearbyCount').textContent=`${near.length}곳`;
  $('#nearbyList').innerHTML=near.map(place=>`<button class="nearby-item" data-place="${place.id}" style="--tile:${place.tile};--accent:${place.color}"><span class="nearby-emoji">${place.emoji}</span><span class="nearby-info"><span>${place.type==='festival'?'진행 중인 축제':'추천 랜드마크'}</span><b>${place.name}</b><p>${place.distance}km · ${place.eta}분 · ${place.date}</p></span></button>`).join('');
  document.querySelectorAll('.nearby-item').forEach(item=>item.addEventListener('click',()=>openPlace(item.dataset.place)));
}

function openPlace(id){
  activePlace=places.find(place=>place.id===id)||places[0];
  renderMap();
  $('#placeSheetContent').innerHTML=`<div class="place-hero" style="--hero:${activePlace.gradient};--emoji:'${activePlace.emoji}'"><div class="place-hero-badges"><span>${activePlace.type==='festival'?'축제':'랜드마크'}</span><span>${activePlace.date}</span></div><h2>${activePlace.name}</h2></div><div class="place-info-grid"><div><span>운영 기간</span><b>${activePlace.period}</b></div><div><span>오늘 운영</span><b>${activePlace.hours}</b></div><div><span>현재 위치</span><b>${activePlace.distance}km · ${activePlace.eta}분</b></div></div><div class="recommend-reason"><i>★</i><span>꿈돌이의 추천 이유<b>${activePlace.reason}</b></span></div><p class="place-description">${activePlace.summary}</p><button class="primary-button" id="openPlanner">주차 플랜 보기 <span>→</span></button>`;
  showSheet('#placeSheet');
  $('#openPlanner').addEventListener('click',openPlanner);
}

function showSheet(selector){
  document.querySelectorAll('.bottom-sheet').forEach(sheet=>sheet.classList.remove('show'));
  $('#sheetBackdrop').classList.add('show');
  $(selector).classList.add('show');
}

function closeSheets(){
  document.querySelectorAll('.bottom-sheet').forEach(sheet=>sheet.classList.remove('show'));
  $('#sheetBackdrop').classList.remove('show');
}

function minutes(time){const [h,m]=time.split(':').map(Number);return h*60+m}
function costFor(parking){
  if(parking.base===0)return 0;
  const start=minutes($('#startTime').value),end=minutes($('#endTime').value),open=minutes(parking.open),close=minutes(parking.close);
  if(end<=start)return 0;
  const paid=Math.max(0,Math.min(end,close)-Math.max(start,open));
  if(paid===0)return 0;
  return parking.base+Math.ceil(Math.max(0,paid-parking.baseMin)/parking.addMin)*parking.add;
}

function distanceKm(lat1,lon1,lat2,lon2){
  const rad=value=>value*Math.PI/180;
  const dLat=rad(lat2-lat1),dLon=rad(lon2-lon1);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function toParkingTemplate(row){
  const distance=distanceKm(activePlace.lat,activePlace.lon,row.latitude,row.longitude);
  const available=Number.isFinite(row.available_spaces)?row.available_spaces:null;
  return {
    name:row.name,
    type:row.fee_type||'공영',
    distance,
    drive:Math.max(2,Math.round(distance*3.2)),
    walk:Math.max(3,Math.round(distance*12)),
    capacity:row.total_spaces||0,
    available,
    open:row.weekday_open||'00:00',
    close:row.weekday_close||'23:59',
    base:row.base_fee||0,
    baseMin:row.base_minutes||0,
    add:row.additional_fee||0,
    addMin:row.additional_minutes||10,
    reason:available>0?`현재 ${available}면 이용 가능해요`:'목적지와 가까운 순으로 추천했어요'
  };
}

function currentParkingList(){
  const candidates=parkingRows.length?parkingRows.map(toParkingTemplate):fallbackParkingTemplates;
  return candidates
    .filter(parking=>!excludedParkings.includes(parking.name))
    .map(parking=>({
      ...parking,
      recommendationScore: parking.distance*18 + costFor(parking)/500 + (parking.available===0?30:0) - Math.min((parking.available||0)/10,5)
    }))
    .sort((a,b)=>a.recommendationScore-b.recommendationScore)
    .slice(0,3);
}

function renderParkings(){
  const start=$('#startTime').value,end=$('#endTime').value;
  const duration=Math.max(0,minutes(end)-minutes(start));
  $('#parkingSummary').textContent=`${Math.floor(duration/60)}시간 ${duration%60?duration%60+'분 ':''}주차 기준`;
  const list=currentParkingList();
  $('#parkingList').innerHTML=list.length?list.map((parking,index)=>`<article class="parking-item ${index===0?'best':''}"><span class="rank-badge">${index+1}</span><span class="parking-type">${parking.type} 주차장</span><h3>${parking.name}</h3><div class="parking-meta"><span>차로 ${parking.drive}분</span><span>도보 ${parking.walk}분</span><span>총 ${parking.capacity}면</span></div><div class="parking-stats"><div><span>예상 요금</span><b>${costFor(parking).toLocaleString()}원</b></div><div><span>유료 운영</span><b>${parking.open}–${parking.close}</b></div><div><span>실시간 빈자리</span><b>${parking.available===null?'정보 없음':parking.available+'면'}</b></div></div><p class="parking-reason">✓ ${parking.reason}</p><div class="parking-actions"><button class="route-button" data-route="${parking.name}">${index===0?'길안내 시작':'이곳으로 안내'}</button>${index===0?`<button class="full-button" data-full="${parking.name}">만차예요</button>`:''}</div></article>`).join(''):`<div class="parking-item"><h3>준비한 후보를 모두 확인했어요</h3><p class="place-description">검색 반경을 넓혀 주변 주차장을 다시 찾아볼게요.</p><button class="primary-button" id="resetParking">주변 후보 다시 계산</button></div>`;
  document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>selectNavigation(button.dataset.route)));
  document.querySelectorAll('[data-full]').forEach(button=>button.addEventListener('click',()=>markFull(button.dataset.full)));
  if($('#resetParking'))$('#resetParking').addEventListener('click',()=>{excludedParkings=[];renderParkings();toast('새로운 후보를 다시 계산했어요.');});
}

function openPlanner(){
  $('#plannerTitle').textContent=`${activePlace.name} 주차 플랜`;
  excludedParkings=[];
  renderParkings();
  showSheet('#plannerSheet');
}

function markFull(name){
  excludedParkings.push(name);
  const next=currentParkingList()[0];
  renderParkings();
  if(next){
    toast(`${name}을 제외하고 ${next.name}을 1순위로 바꿨어요.`);
    setTimeout(()=>selectNavigation(next.name),800);
  }else toast('주변 후보를 다시 계산해 주세요.');
}

function selectNavigation(parkingName){
  pendingParking=parkingName;
  const saved=localStorage.getItem('daejeonMap.preferredNavigation');
  if(saved){toast(`${saved}로 ${parkingName} 안내를 시작해요.`);return}
  $('#navigationModal').classList.add('show');
}

function startTest(){questionIndex=0;answers=[];renderQuestion()}
function renderQuestion(){
  const question=questions[questionIndex];
  $('#questionStep').textContent=`${questionIndex+1} / ${questions.length}`;
  $('#progressBar').style.width=`${((questionIndex+1)/questions.length)*100}%`;
  $('#questionArea').innerHTML=`<p class="test-kicker">나들이 취향 질문 ${questionIndex+1}</p><h2>${question.q}</h2><div class="answer-list">${question.answers.map(([text,type])=>`<button class="answer-button" data-type="${type}">${text}</button>`).join('')}</div>`;
  document.querySelectorAll('.answer-button').forEach(button=>button.addEventListener('click',()=>{answers.push(button.dataset.type);questionIndex++;questionIndex<questions.length?renderQuestion():showResult();}));
}

function showResult(){
  const counts=answers.reduce((acc,type)=>(acc[type]=(acc[type]||0)+1,acc),{});
  const primary=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||'감성·데이트형';
  localStorage.setItem('daejeonMap.personalityResult',primary);
  localStorage.setItem('daejeonMap.onboardingCompleted','true');
  $('#profileLabel').textContent=primary.replace('형','');
  $('#questionStep').textContent='RESULT';
  $('#progressBar').style.width='100%';
  $('#questionArea').innerHTML=`<p class="test-kicker">꿈돌이의 취향 분석 완료</p><h2>당신은<br />‘${primary}’이에요!</h2><div class="result-tags"><span>#대전나들이</span><span>#취향저격</span><span>#오늘어디갈까</span></div><p class="test-description">분위기와 특별한 경험을 놓치지 않는 타입이에요.<br />취향과 가까운 장소부터 보여드릴게요.</p><button class="primary-button" id="finishTest">추천 장소 보러가기 <span>→</span></button>`;
  $('#finishTest').addEventListener('click',closeOnboarding);
}

function closeOnboarding(){
  localStorage.setItem('daejeonMap.onboardingCompleted','true');
  $('#onboardingModal').classList.remove('show');
}

function toast(message){
  $('#toast').textContent=message;$('#toast').classList.add('show');
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2400);
}

async function loadSupabaseParkings(){
  const config=window.SUPABASE_CONFIG;
  if(!config?.url||!config?.publishableKey)return;
  const fields='name,latitude,longitude,total_spaces,available_spaces,fee_type,base_minutes,base_fee,additional_minutes,additional_fee,weekday_open,weekday_close';
  try{
    const response=await fetch(`${config.url}/rest/v1/parking_lots?select=${fields}&source=eq.daejeon_realtime&limit=1000`,{
      headers:{apikey:config.publishableKey,Authorization:`Bearer ${config.publishableKey}`}
    });
    if(!response.ok)throw new Error(`Supabase ${response.status}`);
    parkingRows=(await response.json()).filter(row=>Number.isFinite(row.latitude)&&Number.isFinite(row.longitude));
    $('#parkingDataNote').textContent=`Supabase에서 대전 실시간 주차장 ${parkingRows.length}곳을 불러왔어요. 빈자리 정보는 제공기관 갱신 시각에 따라 달라질 수 있어요.`;
    if($('#plannerSheet').classList.contains('show'))renderParkings();
  }catch(error){
    console.error('주차장 데이터를 불러오지 못했습니다.',error);
    $('#parkingDataNote').textContent='실시간 데이터 연결에 실패해 데모 주차장 정보를 표시합니다.';
  }
}

renderFestivals();renderMap();
loadSupabaseParkings();
$('#visitDate').value=new Date().toISOString().slice(0,10);
const savedTaste=localStorage.getItem('daejeonMap.personalityResult');
if(savedTaste)$('#profileLabel').textContent=savedTaste.replace('형','');
if(localStorage.getItem('daejeonMap.onboardingCompleted')==='true')$('#onboardingModal').classList.remove('show');
$('#startTest').addEventListener('click',startTest);
$('#skipTest').addEventListener('click',closeOnboarding);
$('#retestButton').addEventListener('click',()=>{localStorage.removeItem('daejeonMap.onboardingCompleted');localStorage.removeItem('daejeonMap.personalityResult');location.reload();});
$('#mobileTaste').addEventListener('click',()=>$('#retestButton').click());
$('#slidePrev').addEventListener('click',()=>$('#festivalSlider').scrollBy({left:-320,behavior:'smooth'}));
$('#slideNext').addEventListener('click',()=>$('#festivalSlider').scrollBy({left:320,behavior:'smooth'}));
document.querySelectorAll('.map-tabs button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.map-tabs button').forEach(item=>item.classList.remove('active'));button.classList.add('active');activeFilter=button.dataset.filter;renderMap();}));
document.querySelectorAll('[data-close-sheet]').forEach(button=>button.addEventListener('click',closeSheets));
$('#sheetBackdrop').addEventListener('click',closeSheets);
$('#recalculate').addEventListener('click',()=>{renderParkings();toast('선택한 시간으로 요금을 다시 계산했어요.');});
$('#closeNav').addEventListener('click',()=>$('#navigationModal').classList.remove('show'));
document.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>{localStorage.setItem('daejeonMap.preferredNavigation',button.dataset.nav);$('#navigationModal').classList.remove('show');toast(`${button.dataset.nav}로 ${pendingParking} 안내를 시작해요.`);}));
$('#currentButton').addEventListener('click',()=>toast('현재 위치를 대전시청 주변으로 맞췄어요.'));
$('#locationButton').addEventListener('click',()=>toast('프로토타입에서는 대전시청을 현재 위치로 사용해요.'));
$('#searchButton').addEventListener('click',()=>toast('장소 검색은 다음 버전에서 API와 연결해요.'));
