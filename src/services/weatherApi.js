// All network access lives here. Components and hooks never call fetch directly.

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const HOURS_AHEAD = 24

export class WeatherApiError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'WeatherApiError'
  }
}

export const isAbortError = (error) => error?.name === 'AbortError'

async function getJson(url, signal) {
  let response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new WeatherApiError("Can't reach the weather service. Check your connection and try again.", {
      cause: error,
    })
  }
  if (!response.ok) {
    throw new WeatherApiError(`The weather service returned an error (HTTP ${response.status}). Please try again.`)
  }
  try {
    return await response.json()
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new WeatherApiError('The weather service sent an unexpected response. Please try again.', {
      cause: error,
    })
  }
}

// ---- Geocoding ---------------------------------------------------------------

export async function searchCities(query, signal) {
  const name = query.trim()
  if (!name) return []
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=5&language=en&format=json`
  const data = await getJson(url, signal)
  return (data.results ?? [])
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .map((item) => ({
      name: item.name,
      region: item.admin1 ?? '',
      country: item.country ?? '',
      latitude: item.latitude,
      longitude: item.longitude,
    }))
}

// ---- Forecast ----------------------------------------------------------------

const CURRENT_FIELDS = 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day'
const HOURLY_FIELDS = 'temperature_2m,weather_code,precipitation_probability'
const DAILY_FIELDS =
  'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset'

export async function fetchForecast(latitude, longitude, signal) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new WeatherApiError('That location has invalid coordinates.')
  }
  const url =
    `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=${CURRENT_FIELDS}&hourly=${HOURLY_FIELDS}&daily=${DAILY_FIELDS}` +
    '&timezone=auto&forecast_days=7'
  return normalizeForecast(await getJson(url, signal))
}

// Local-time ISO strings compare correctly as plain strings. An hour counts as
// daytime when its midpoint (HH:30) falls between sunrise and sunset.
function isDaylight(hourIso, daily) {
  const index = daily.time.indexOf(hourIso.slice(0, 10))
  const sunrise = daily.sunrise?.[index]
  const sunset = daily.sunset?.[index]
  if (sunrise && sunset) {
    const midpoint = `${hourIso.slice(0, 13)}:30`
    return midpoint >= sunrise && midpoint < sunset
  }
  const hour = Number(hourIso.slice(11, 13))
  return hour >= 6 && hour < 18
}

/** Turns Open-Meteo's column-oriented response into plain objects (metric units). */
export function normalizeForecast(raw) {
  const { current, hourly, daily } = raw ?? {}
  if (!current || !hourly?.time || !daily?.time) {
    throw new WeatherApiError('The weather service sent incomplete data. Please try again.')
  }

  const currentHour = `${current.time.slice(0, 13)}:00`
  const start = Math.max(0, hourly.time.findIndex((time) => time >= currentHour))

  return {
    timezone: raw.timezone,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
    },
    hourly: hourly.time.slice(start, start + HOURS_AHEAD).map((time, offset) => ({
      time,
      temperature: hourly.temperature_2m[start + offset],
      weatherCode: hourly.weather_code[start + offset],
      precipitationProbability: hourly.precipitation_probability?.[start + offset] ?? null,
      isDay: isDaylight(time, daily),
    })),
    daily: daily.time.map((date, index) => ({
      date,
      weatherCode: daily.weather_code[index],
      max: daily.temperature_2m_max[index],
      min: daily.temperature_2m_min[index],
      precipitationProbability: daily.precipitation_probability_max?.[index] ?? null,
      sunrise: daily.sunrise?.[index] ?? null,
      sunset: daily.sunset?.[index] ?? null,
    })),
  }
}
