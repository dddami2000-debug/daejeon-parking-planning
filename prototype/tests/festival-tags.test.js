const test = require('node:test');
const assert = require('node:assert/strict');

const festivalTags = require('../festival-tags');
const recommender = require('../festival-recommender');

const topicGroups = recommender.topicGroups;

test('derives grounded short tags from summary and program text, not a hardcoded list', () => {
  const tags = festivalTags.deriveFestivalTags({
    name: '대전 0시 축제',
    summary: '대전의 한여름 밤을 거대한 무대로 바꾸는, 도심 한복판의 대표 축제예요.',
    category: '야간축제',
    programs: [
      {title: '도심 한복판 라이브', description: '중앙로 곳곳의 무대와 거리 공연을 따라 걸으며 축제 분위기를 즐겨요.'},
      {title: '야시장 한 바퀴', description: '은행동 먹거리와 축제 부스를 함께 둘러보며 늦은 밤까지 즐겨요.'}
    ],
    topicGroups
  });
  assert.deepEqual(tags, ['먹거리', '공연', '야간']);
});

test('caps tags at three even when more topics match', () => {
  const tags = festivalTags.deriveFestivalTags({
    name: '대전 국제 와인 EXPO',
    summary: '와인과 미식, 음악이 한자리에 모이는 대전의 특별한 가을 미식 축제예요.',
    programs: [
      {title: '국내외 와인 시음', description: '여러 산지와 품종을 비교하며 내 취향의 와인을 발견해 보세요.'},
      {title: '푸드 페어링', description: '와인과 어울리는 음식 부스를 함께 둘러보며 조합을 즐겨요.'},
      {title: '공연과 클래스', description: '문화 공연과 소믈리에 프로그램을 일정에 맞춰 골라보세요.'}
    ],
    topicGroups
  });
  assert.equal(tags.length, 3);
  assert.deepEqual(tags, ['술', '먹거리', '공연']);
});

test('returns an empty list instead of a generic filler when the source text has no signal', () => {
  const generic = festivalTags.deriveFestivalTags({
    name: '대전 벼룩시장 나눔 한마당',
    summary: '축제 상세 정보를 준비하고 있어요.',
    category: '지역축제',
    programs: [],
    topicGroups
  });
  assert.deepEqual(generic, []);

  const noTopicGroups = festivalTags.deriveFestivalTags({
    name: '대전 0시 축제',
    summary: '대전의 한여름 밤을 거대한 무대로 바꾸는 축제예요.'
  });
  assert.deepEqual(noTopicGroups, []);
});

test('ignores single-syllable aliases so mid-word matches like 기술→술 or 짧게→게 do not fire', () => {
  const tags = festivalTags.deriveFestivalTags({
    name: '대전 사이언스 페스티벌',
    summary: '과학도시 대전의 상상력을 직접 만지고 즐기는 대표 체험 축제예요.',
    programs: [
      {title: '로봇·AI 체험', description: '직접 조작하고 결과를 확인하는 참여형 과학 프로그램을 골라 즐겨요.'},
      {title: '우주 테마 탐험', description: '전시와 체험 부스를 돌며 우주와 미래 기술 이야기를 만나보세요.'},
      {title: '과학 실험 미션', description: '가족이나 친구와 함께 짧게 참여할 수 있는 실험 프로그램에 도전해요.'}
    ],
    topicGroups
  });
  assert.ok(tags.includes('과학'));
  assert.ok(!tags.includes('술'), '기술 in the program text must not be read as alcohol evidence');
  assert.ok(!tags.includes('수산물'), '짧게 in the program text must not be read as seafood evidence');
});

test('reuses the exact topic vocabulary and labels the map/search topic filters use', () => {
  const filterLabels = ['술', '농산물', '먹거리', '수산물', '과학', '공연', '야간', '가족', '자연', '문화'];
  filterLabels.forEach(label => assert.ok(Object.values(festivalTags.topicLabels).includes(label)));
  const wineTags = festivalTags.deriveFestivalTags({
    name: '대전 국제 와인 EXPO',
    summary: '와인과 미식, 음악이 한자리에 모이는 대전의 특별한 가을 미식 축제예요.',
    topicGroups
  });
  wineTags.forEach(tag => assert.ok(
    recommender.matchesTopicQuery({name: '대전 국제 와인 EXPO', summary: '와인과 미식, 음악이 한자리에 모이는 대전의 특별한 가을 미식 축제예요.'}, tag),
    `detail tag "${tag}" should also match the same festival under the ${tag} topic filter/search`
  ));
});
