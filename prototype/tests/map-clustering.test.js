const test = require('node:test');
const assert = require('node:assert/strict');

const clustering = require('../map-clustering');

const item = (id, x, y = 0) => ({ place: { id }, x, y });
const ids = clusters => clusters.map(cluster => cluster.map(entry => entry.place.id));

test('clusters only festival pins whose circular marker areas meaningfully overlap', () => {
  const clusters = clustering.clusterProjectedPlaces([
    item('overlap-a', 0),
    item('overlap-b', 47),
    item('separate', 100)
  ]);

  assert.deepEqual(ids(clusters), [['overlap-a', 'overlap-b'], ['separate']]);
  assert.equal(clustering.DEFAULT_CLUSTER_DISTANCE, 48);
});

test('uses circular distance instead of the wider diagonal of a square hit box', () => {
  const clusters = clustering.clusterProjectedPlaces([
    item('top-left', 0, 0),
    item('bottom-right', 40, 40)
  ]);

  assert.deepEqual(ids(clusters), [['top-left'], ['bottom-right']]);
});

test('does not merge a distant pin through a chain of nearby pins', () => {
  const clusters = clustering.clusterProjectedPlaces([
    item('a', 0),
    item('b', 40),
    item('c', 80)
  ]);

  assert.deepEqual(ids(clusters), [['a', 'b'], ['c']]);
});

test('accepts a custom collision distance for deterministic boundary checks', () => {
  const clusters = clustering.clusterProjectedPlaces([
    item('a', 0),
    item('b', 30),
    item('c', 31)
  ], 30);

  assert.deepEqual(ids(clusters), [['a', 'b'], ['c']]);
});

test('keeps an invalid projected pin visible as its own marker', () => {
  const clusters = clustering.clusterProjectedPlaces([
    item('valid', 0),
    item('invalid', Number.NaN)
  ]);

  assert.deepEqual(ids(clusters), [['valid'], ['invalid']]);
});
