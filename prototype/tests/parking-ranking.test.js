const test = require('node:test');
const assert = require('node:assert/strict');

const {
  heatSeverityFor,
  recommendationReason,
  scoreParkingCandidate,
  weatherWeights
} = require('../api/_parking-ranking');

test('increases the walking weight continuously as apparent temperature rises', () => {
  assert.equal(heatSeverityFor(25), 0);
  assert.equal(heatSeverityFor(29.5), 0.5);
  assert.equal(heatSeverityFor(34), 1);
  assert.deepEqual(weatherWeights(25), { heatSeverity: 0, walk: 0.35, cost: 0.5 });
  assert.deepEqual(weatherWeights(34), { heatSeverity: 1, walk: 0.8, cost: 0.25 });
});

test('prefers a cheaper distant lot in comfortable weather and a closer lot in hot weather', () => {
  const closePaid = { walk: 5, estimatedCost: 4000 };
  const distantFree = { walk: 18, estimatedCost: 0 };
  const comfortable = { available: true, apparentTemperature: 24 };
  const hot = { available: true, apparentTemperature: 34 };

  assert.ok(
    scoreParkingCandidate(distantFree, comfortable).score
      < scoreParkingCandidate(closePaid, comfortable).score
  );
  assert.ok(
    scoreParkingCandidate(closePaid, hot).score
      < scoreParkingCandidate(distantFree, hot).score
  );
});

test('uses a neutral weather weight and uncertainty penalty when data is missing', () => {
  const ranking = scoreParkingCandidate({ walk: 10, estimatedCost: null }, { available: false });
  assert.equal(ranking.breakdown.heatSeverity, 0);
  assert.equal(ranking.breakdown.walkWeight, 0.35);
  assert.equal(ranking.breakdown.costScore, null);
  assert.equal(ranking.breakdown.uncertaintyPenalty, 0.12);
});

test('explains a recommendation with the weather, walk and expected cost', () => {
  const reason = recommendationReason(
    { walk: 5, estimatedCost: 4000 },
    { available: true, apparentTemperature: 34 }
  );
  assert.match(reason, /체감온도 34\.0℃/);
  assert.match(reason, /도보 5분/);
  assert.match(reason, /4,000원/);
});
