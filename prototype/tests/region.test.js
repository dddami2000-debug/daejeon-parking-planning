const test = require('node:test');
const assert = require('node:assert/strict');

const { festivalRegionLabel } = require('../region');

test('shows the real province and municipality for regional festivals', () => {
  assert.equal(
    festivalRegionLabel('충청남도 계룡시 신도안면 정장리 16'),
    '충청남도 계룡시'
  );
  assert.equal(
    festivalRegionLabel('충남 보령시 웅천읍 관당리 805-4'),
    '충청남도 보령시'
  );
  assert.equal(
    festivalRegionLabel('전북특별자치도 진안군 진안읍 외사양길 16-19'),
    '전북특별자치도 진안군'
  );
  assert.equal(
    festivalRegionLabel('충청북도 청주시 청원구 오창읍 미래지로 99'),
    '충청북도 청주시'
  );
});

test('keeps Daejeon district labels and never invents a region', () => {
  assert.equal(
    festivalRegionLabel('대전광역시 유성구 어은로 27'),
    '대전광역시 유성구'
  );
  assert.equal(festivalRegionLabel(''), '지역 정보 확인');
  assert.equal(festivalRegionLabel('주소 미정'), '지역 정보 확인');
});
