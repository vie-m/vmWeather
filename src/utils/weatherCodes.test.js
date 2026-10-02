import test from 'node:test'
import assert from 'node:assert/strict'
import { getWeatherInfo, getWeatherTheme } from './weatherCodes.js'

test('maps WMO codes to labels', () => {
  assert.equal(getWeatherInfo(0).label, 'Clear sky')
  assert.equal(getWeatherInfo(45).label, 'Fog')
  assert.equal(getWeatherInfo(63).label, 'Rain')
  assert.equal(getWeatherInfo(95).label, 'Thunderstorm')
})

test('uses different icons for day and night where it makes sense', () => {
  assert.notEqual(getWeatherInfo(0, true).Icon, getWeatherInfo(0, false).Icon)
  assert.notEqual(getWeatherInfo(2, true).Icon, getWeatherInfo(2, false).Icon)
  assert.equal(getWeatherInfo(63, true).Icon, getWeatherInfo(63, false).Icon)
})

test('every documented WMO code range resolves to a known entry', () => {
  const codes = [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]
  for (const code of codes) assert.notEqual(getWeatherInfo(code).label, 'Unknown', `code ${code}`)
})

test('falls back safely for unknown codes', () => {
  assert.equal(getWeatherInfo(1234).label, 'Unknown')
  assert.equal(getWeatherInfo(undefined).label, 'Unknown')
})

test('theme depends on condition and daylight', () => {
  assert.equal(getWeatherTheme(0, true).id, 'clear-day')
  assert.equal(getWeatherTheme(0, false).id, 'clear-night')
  assert.equal(getWeatherTheme(63, true).id, 'rain-day')
  assert.equal(getWeatherTheme(45, true).id, 'cloudy-day')
})
