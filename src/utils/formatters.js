// Temperature, wind, date and label formatting helpers.
// The API is always queried in metric units; conversion happens here so
// toggling units never triggers a new request.

export const UNITS = Object.freeze({ CELSIUS: 'celsius', FAHRENHEIT: 'fahrenheit' })

export const isValidUnit = (value) => value === UNITS.CELSIUS || value === UNITS.FAHRENHEIT

const KMH_TO_MPH = 0.621371
const MISSING = '–'

export function convertTemperature(celsius, unit) {
  if (typeof celsius !== 'number' || Number.isNaN(celsius)) return null
  return unit === UNITS.FAHRENHEIT ? (celsius * 9) / 5 + 32 : celsius
}

export function formatTemperature(celsius, unit) {
  const value = convertTemperature(celsius, unit)
  return value === null ? MISSING : `${Math.round(value)}°`
}

export const temperatureUnitLabel = (unit) => (unit === UNITS.FAHRENHEIT ? '°F' : '°C')

export function formatWindSpeed(kmh, unit) {
  if (typeof kmh !== 'number' || Number.isNaN(kmh)) return MISSING
  if (unit === UNITS.FAHRENHEIT) return `${Math.round(kmh * KMH_TO_MPH)} mph`
  return `${Math.round(kmh)} km/h`
}

export function formatPercent(value) {
  return typeof value === 'number' && !Number.isNaN(value) ? `${Math.round(value)}%` : MISSING
}

// ---- Dates -----------------------------------------------------------------
// Open-Meteo (timezone=auto) returns local times without an offset, e.g.
// "2026-10-02T14:00". We read the parts directly instead of using the browser's
// timezone so the times shown always belong to the forecast location.

const weekdayLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' })
const weekdayShort = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' })

const pad = (number) => String(number).padStart(2, '0')

export function parseLocalIso(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(iso ?? '')
  if (!match) return null
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? 0),
    minute: Number(match[5] ?? 0),
  }
}

const toUtcDate = ({ year, month, day }) => new Date(Date.UTC(year, month - 1, day))

export function formatClock(iso) {
  const parts = parseLocalIso(iso)
  return parts ? `${pad(parts.hour)}:${pad(parts.minute)}` : MISSING
}

export function formatHourLabel(iso, isNow = false) {
  if (isNow) return 'Now'
  const parts = parseLocalIso(iso)
  return parts ? `${pad(parts.hour)}:00` : MISSING
}

export function formatLocalDateTime(iso) {
  const parts = parseLocalIso(iso)
  if (!parts) return ''
  return `${weekdayLong.format(toUtcDate(parts))} · ${pad(parts.hour)}:${pad(parts.minute)}`
}

export function formatDayName(dateIso, index) {
  if (index === 0) return 'Today'
  const parts = parseLocalIso(dateIso)
  return parts ? weekdayShort.format(toUtcDate(parts)) : MISSING
}

// ---- Locations -------------------------------------------------------------

const roundCoordinate = (value) => (Math.round(value * 100) / 100).toFixed(2)

export const formatCoordinates = (latitude, longitude) =>
  `${roundCoordinate(latitude)}, ${roundCoordinate(longitude)}`

const withoutDuplicates = (name, parts) => parts.filter((part) => part && part !== name)

/** "City, Region, Country" (region skipped when it repeats the city name). */
export function formatLocationLabel({ name, region, country }) {
  return [name, ...withoutDuplicates(name, [region, country])].join(', ')
}

/** "Region, Country" for use under a heading that already shows the name. */
export function formatLocationSubtitle({ name, region, country }) {
  return withoutDuplicates(name, [region, country]).join(', ')
}
