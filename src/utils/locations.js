import { formatCoordinates } from './formatters.js'

export const DEFAULT_LOCATION = Object.freeze({
  name: 'Jakarta',
  region: 'Jakarta',
  country: 'Indonesia',
  latitude: -6.2146,
  longitude: 106.8451,
})

export const STORAGE_KEYS = Object.freeze({
  unit: 'vmweather:unit',
  location: 'vmweather:last-location',
  recent: 'vmweather:recent-searches',
})

export const MAX_RECENT = 5

export function isValidLocation(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.name === 'string' &&
    Number.isFinite(value.latitude) &&
    Math.abs(value.latitude) <= 90 &&
    Number.isFinite(value.longitude) &&
    Math.abs(value.longitude) <= 180
  )
}

/** Open-Meteo has no reverse geocoding, so unnamed places are labelled by coordinates. */
export function createCoordinateLocation(latitude, longitude, prefix = 'Selected location') {
  return {
    name: `${prefix} (${formatCoordinates(latitude, longitude)})`,
    region: '',
    country: '',
    latitude,
    longitude,
  }
}

/** Identity used to de-duplicate recent searches (~1 km precision). */
export const locationKey = ({ latitude, longitude }) => `${latitude.toFixed(2)},${longitude.toFixed(2)}`

export function toStoredLocation({ name, region, country, latitude, longitude }) {
  return { name, region: region ?? '', country: country ?? '', latitude, longitude }
}

/** Leaflet reports longitudes beyond ±180 when the world is panned; fold them back. */
export function wrapLongitude(longitude) {
  if (longitude >= -180 && longitude <= 180) return longitude
  return ((((longitude + 180) % 360) + 360) % 360) - 180
}
