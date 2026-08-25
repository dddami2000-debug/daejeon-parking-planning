const test = require('node:test');
const assert = require('node:assert/strict');

test('returns weather-aware rankings without parking-space fields', async () => {
  const lib = require('../api/_lib');
  const weatherModule = require('../api/_weather');
  const originalSupabaseRequest = lib.supabaseRequest;
  const originalGetWeatherContext = weatherModule.getWeatherContext;
  lib.supabaseRequest = async () => [{
    id: 'parking-1',
    source: 'daejeon_parking',
    name: '중앙로 공영주차장',
    parking_type: 'public',
    address: '대전광역시 중구',
    latitude: 36.3302,
    longitude: 127.431,
    total_spaces: 999,
    available_spaces: 999,
    operating_hours: { weekday: { open: '09:00', close: '22:00' } },
    fee_rules: { baseRate: 500, baseTime: 30, addRate: 200, addTime: 10 },
    metadata: {}
  }];
  weatherModule.getWeatherContext = async () => ({
    available: true,
    source: 'kma',
    sourceLabel: '기상청 단기예보',
    apparentTemperature: 34,
    forecastAt: '2026-08-25T09:00:00.000Z',
    fallbackUsed: false
  });
  delete require.cache[require.resolve('../api/parking')];
  const handler = require('../api/parking');
  let body;
  const response = {
    setHeader() {},
    status(statusCode) { this.statusCode = statusCode; return this; },
    json(payload) { body = payload; return payload; }
  };

  try {
    await handler({
      method: 'GET',
      query: {
        lat: '36.3298',
        lng: '127.4307',
        date: '2026-08-25',
        startTime: '18:00',
        endTime: '22:00'
      }
    }, response);
  } finally {
    lib.supabaseRequest = originalSupabaseRequest;
    weatherModule.getWeatherContext = originalGetWeatherContext;
    delete require.cache[require.resolve('../api/parking')];
  }

  assert.equal(response.statusCode, 200);
  assert.equal(body.weather.source, 'kma');
  assert.equal(body.parkingLots.length, 1);
  assert.equal(body.parkingLots[0].scoreBreakdown.walkWeight, 0.8);
  assert.equal('capacity' in body.parkingLots[0], false);
  assert.equal('available' in body.parkingLots[0], false);
  assert.match(body.parkingLots[0].reason, /체감온도 34\.0℃/);
});
