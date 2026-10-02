import test from 'node:test'
import assert from 'node:assert/strict'
import {
  UNITS,
  convertTemperature,
  formatClock,
  formatCoordinates,
  formatDayName,
  formatHourLabel,
  formatLocalDateTime,
  formatLocationLabel,
  formatLocationSubtitle,
  formatTemperature,
  formatWindSpeed,
} from './formatters.js'

test('converts celsius to fahrenheit', () => {
  assert.equal(convertTemperature(0, UNITS.FAHRENHEIT), 32)
  assert.equal(convertTemperature(100, UNITS.FAHRENHEIT), 212)
  assert.equal(convertTemperature(21, UNITS.CELSIUS), 21)
  assert.equal(convertTemperature(undefined, UNITS.CELSIUS), null)
})

test('formats temperature and handles missing values', () => {
  assert.equal(formatTemperature(21.6, UNITS.CELSIUS), '22°')
  assert.equal(formatTemperature(20, UNITS.FAHRENHEIT), '68°')
  assert.equal(formatTemperature(null, UNITS.CELSIUS), '–')
})

test('wind uses km/h for celsius and mph for fahrenheit', () => {
  assert.equal(formatWindSpeed(10, UNITS.CELSIUS), '10 km/h')
  assert.equal(formatWindSpeed(100, UNITS.FAHRENHEIT), '62 mph')
})

test('formats local ISO times without timezone shifts', () => {
  assert.equal(formatClock('2026-10-02T05:47'), '05:47')
  assert.equal(formatHourLabel('2026-10-02T14:00'), '14:00')
  assert.equal(formatHourLabel('2026-10-02T14:00', true), 'Now')
  assert.equal(formatLocalDateTime('2026-10-02T14:05'), 'Friday, Oct 2 · 14:05')
  assert.equal(formatDayName('2026-10-02', 0), 'Today')
  assert.equal(formatDayName('2026-10-03', 1), 'Sat')
})

test('formats locations', () => {
  assert.equal(formatCoordinates(-6.2146, 106.8451), '-6.21, 106.85')
  assert.equal(
    formatLocationLabel({ name: 'Paris', region: 'Île-de-France', country: 'France' }),
    'Paris, Île-de-France, France',
  )
  assert.equal(
    formatLocationLabel({ name: 'Jakarta', region: 'Jakarta', country: 'Indonesia' }),
    'Jakarta, Indonesia',
  )
  assert.equal(formatLocationSubtitle({ name: 'Paris', region: '', country: 'France' }), 'France')
})
