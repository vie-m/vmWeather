import test from 'node:test'
import assert from 'node:assert/strict'
import { WeatherApiError, fetchForecast, normalizeForecast, searchCities } from './weatherApi.js'

const hours = Array.from({ length: 48 }, (_, i) => `2026-10-0${2 + Math.floor(i / 24)}T${String(i % 24).padStart(2, '0')}:00`)

const rawForecast = {
  timezone: 'Asia/Jakarta',
  current: {
    time: '2026-10-02T14:15',
    temperature_2m: 31.2,
    relative_humidity_2m: 70,
    apparent_temperature: 36,
    weather_code: 3,
    wind_speed_10m: 9.5,
    is_day: 1,
  },
  hourly: {
    time: hours,
    temperature_2m: hours.map((_, i) => 20 + i),
    weather_code: hours.map(() => 1),
    precipitation_probability: hours.map((_, i) => i),
  },
  daily: {
    time: ['2026-10-02', '2026-10-03'],
    weather_code: [3, 61],
    temperature_2m_max: [32, 30],
    temperature_2m_min: [25, 24],
    precipitation_probability_max: [20, 80],
    sunrise: ['2026-10-02T05:47', '2026-10-03T05:46'],
    sunset: ['2026-10-02T17:52', '2026-10-03T17:52'],
  },
}

function mockFetch(handler) {
  const original = globalThis.fetch
  globalThis.fetch = handler
  return () => {
    globalThis.fetch = original
  }
}

test('normalizeForecast starts at the current hour and returns 24 hours', () => {
  const result = normalizeForecast(rawForecast)
  assert.equal(result.hourly.length, 24)
  assert.equal(result.hourly[0].time, '2026-10-02T14:00')
  assert.equal(result.hourly[0].temperature, 34)
  assert.equal(result.current.isDay, true)
  assert.equal(result.daily[1].precipitationProbability, 80)
})

test('normalizeForecast flags night hours using sunrise and sunset', () => {
  const result = normalizeForecast(rawForecast)
  const byTime = Object.fromEntries(result.hourly.map((h) => [h.time, h.isDay]))
  assert.equal(byTime['2026-10-02T14:00'], true)
  assert.equal(byTime['2026-10-02T17:00'], true)
  assert.equal(byTime['2026-10-02T18:00'], false)
  assert.equal(byTime['2026-10-03T05:00'], false)
  assert.equal(byTime['2026-10-03T06:00'], true)
})

test('normalizeForecast rejects incomplete payloads', () => {
  assert.throws(() => normalizeForecast({}), WeatherApiError)
})

test('searchCities maps geocoding results and builds the URL', async () => {
  let requested
  const restore = mockFetch(async (url) => {
    requested = url
    return {
      ok: true,
      json: async () => ({
        results: [{ name: 'Paris', admin1: 'Île-de-France', country: 'France', latitude: 48.85, longitude: 2.35 }],
      }),
    }
  })
  try {
    const results = await searchCities(' Paris ')
    assert.match(requested, /name=Paris&count=5&language=en&format=json/)
    assert.deepEqual(results, [
      { name: 'Paris', region: 'Île-de-France', country: 'France', latitude: 48.85, longitude: 2.35 },
    ])
  } finally {
    restore()
  }
})

test('searchCities returns [] when the API has no results key', async () => {
  const restore = mockFetch(async () => ({ ok: true, json: async () => ({ generationtime_ms: 1 }) }))
  try {
    assert.deepEqual(await searchCities('zzzzzz'), [])
  } finally {
    restore()
  }
})

test('non-OK responses become WeatherApiError', async () => {
  const restore = mockFetch(async () => ({ ok: false, status: 503 }))
  try {
    await assert.rejects(searchCities('Paris'), /HTTP 503/)
  } finally {
    restore()
  }
})

test('network failures become WeatherApiError, aborts pass through', async () => {
  let restore = mockFetch(async () => {
    throw new TypeError('Failed to fetch')
  })
  try {
    await assert.rejects(fetchForecast(1, 2), WeatherApiError)
  } finally {
    restore()
  }

  restore = mockFetch(async () => {
    throw new DOMException('Aborted', 'AbortError')
  })
  try {
    await assert.rejects(fetchForecast(1, 2), (error) => error.name === 'AbortError')
  } finally {
    restore()
  }
})

test('fetchForecast requests metric data with auto timezone', async () => {
  let requested
  const restore = mockFetch(async (url) => {
    requested = url
    return { ok: true, json: async () => rawForecast }
  })
  try {
    await fetchForecast(-6.2, 106.8)
    assert.match(requested, /latitude=-6\.2&longitude=106\.8/)
    assert.match(requested, /timezone=auto&forecast_days=7/)
  } finally {
    restore()
  }
})
