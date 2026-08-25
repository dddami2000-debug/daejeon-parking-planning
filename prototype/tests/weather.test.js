const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateApparentTemperature,
  coordinatesToKmaGrid,
  getWeatherContext,
  latestKmaBase
} = require('../api/_weather');

test('converts a Daejeon festival coordinate to the KMA village grid', () => {
  assert.deepEqual(coordinatesToKmaGrid(36.3298, 127.4307), { nx: 68, ny: 100 });
});

test('selects the latest published KMA base time with a publication delay', () => {
  assert.deepEqual(latestKmaBase(new Date('2026-08-25T01:20:00Z')), {
    baseDate: '20260825',
    baseTime: '0800'
  });
  assert.deepEqual(latestKmaBase(new Date('2026-08-24T17:05:00Z')), {
    baseDate: '20260824',
    baseTime: '2300'
  });
});

test('calculates the KMA summer apparent temperature from temperature and humidity', () => {
  assert.equal(calculateApparentTemperature(33, 70, 2), 34.3);
});

test('uses KMA first and selects the hotter of arrival and departure', async () => {
  const categories = (time, temperature, humidity, windSpeed) => [
    { fcstDate: '20260825', fcstTime: time, category: 'TMP', fcstValue: temperature },
    { fcstDate: '20260825', fcstTime: time, category: 'REH', fcstValue: humidity },
    { fcstDate: '20260825', fcstTime: time, category: 'WSD', fcstValue: windSpeed }
  ];
  const weather = await getWeatherContext({
    lat: 36.3298,
    lng: 127.4307,
    visitDate: '2026-08-25',
    startTime: '18:00',
    endTime: '22:00',
    kmaApiKey: 'test-key'
  }, {
    now: new Date('2026-08-25T01:20:00Z'),
    fetchJson: async (url) => {
      assert.equal(url.hostname, 'apis.data.go.kr');
      return {
        response: {
          header: { resultCode: '00' },
          body: { items: { item: [...categories('1800', 33, 70, 2), ...categories('2200', 29, 60, 1)] } }
        }
      };
    }
  });
  assert.equal(weather.source, 'kma');
  assert.equal(weather.apparentTemperature, 34.3);
  assert.equal(weather.fallbackUsed, false);
});

test('falls back to Open-Meteo when the KMA request fails', async () => {
  const weather = await getWeatherContext({
    lat: 36.3298,
    lng: 127.4307,
    visitDate: '2026-08-25',
    startTime: '18:00',
    endTime: '22:00',
    kmaApiKey: 'test-key'
  }, {
    now: new Date('2026-08-25T01:20:00Z'),
    fetchJson: async (url) => {
      if (url.hostname === 'apis.data.go.kr') throw new Error('upstream_timeout');
      return {
        hourly: {
          time: ['2026-08-25T18:00', '2026-08-25T22:00'],
          apparent_temperature: [31.4, 27.2]
        }
      };
    }
  });
  assert.equal(weather.source, 'open_meteo');
  assert.equal(weather.apparentTemperature, 31.4);
  assert.equal(weather.fallbackUsed, true);
});

test('does not apply current weather to a visit outside the forecast range', async () => {
  let called = false;
  const weather = await getWeatherContext({
    lat: 36.3298,
    lng: 127.4307,
    visitDate: '2026-09-30',
    startTime: '18:00',
    endTime: '22:00',
    kmaApiKey: 'test-key'
  }, {
    now: new Date('2026-08-25T01:20:00Z'),
    fetchJson: async () => { called = true; }
  });
  assert.equal(weather.available, false);
  assert.equal(weather.reason, 'forecast_out_of_range');
  assert.equal(called, false);
});
