import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_LOCATION,
  createCoordinateLocation,
  isValidLocation,
  locationKey,
  wrapLongitude,
} from './locations.js'

test('default location is Jakarta, Indonesia', () => {
  assert.equal(DEFAULT_LOCATION.name, 'Jakarta')
  assert.equal(DEFAULT_LOCATION.country, 'Indonesia')
  assert.ok(isValidLocation(DEFAULT_LOCATION))
})

test('validates stored locations', () => {
  assert.equal(isValidLocation(null), false)
  assert.equal(isValidLocation({ name: 'x', latitude: 91, longitude: 0 }), false)
  assert.equal(isValidLocation({ name: 'x', latitude: 10, longitude: '5' }), false)
  assert.equal(isValidLocation({ name: 'x', latitude: 10, longitude: 5 }), true)
})

test('labels map clicks with rounded coordinates', () => {
  const place = createCoordinateLocation(-6.21462, 106.84513)
  assert.equal(place.name, 'Selected location (-6.21, 106.85)')
  assert.equal(createCoordinateLocation(1, 2, 'My location').name, 'My location (1.00, 2.00)')
})

test('locationKey groups nearby points', () => {
  assert.equal(locationKey({ latitude: 1.001, longitude: 2.002 }), locationKey({ latitude: 1.0, longitude: 2.0 }))
})

test('wrapLongitude folds values into [-180, 180)', () => {
  assert.equal(wrapLongitude(190), -170)
  assert.equal(wrapLongitude(-190), 170)
  assert.equal(wrapLongitude(106.8), 106.8)
})
