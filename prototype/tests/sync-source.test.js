const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const syncSource = fs.readFileSync(path.resolve(__dirname, '../api/sync.js'), 'utf8');

test('sync no longer imports or writes landmark data', () => {
  assert.doesNotMatch(syncSource, /daejeon_tourspot|TOURSPOT_URL|TOUR_API_KEY/);
  assert.doesNotMatch(syncSource, /category:\s*['"]landmark['"]/);
  assert.doesNotMatch(syncSource, /['"]landmark['"]\s*:/);
  assert.match(syncSource, /\['festival', 'parking', 'sharenuri'\]/);
});

test('festival coordinates accept valid locations across Korea', () => {
  assert.match(syncSource, /normalizeKoreaCoordinates\(item\.mapy, item\.mapx\)/);
  assert.match(syncSource, /normalizeKoreaCoordinates\(address\?\.y, address\?\.x\)/);
});
