import {
  CircleHelp,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Moon,
  Snowflake,
  Sun,
} from 'lucide-react'

// WMO weather interpretation codes -> label, icons (day/night) and visual category.
const CODES = {
  0: { label: 'Clear sky', day: Sun, night: Moon, category: 'clear' },
  1: { label: 'Mainly clear', day: Sun, night: Moon, category: 'clear' },
  2: { label: 'Partly cloudy', day: CloudSun, night: CloudMoon, category: 'clear' },
  3: { label: 'Overcast', day: Cloud, night: Cloud, category: 'cloudy' },
  45: { label: 'Fog', day: CloudFog, night: CloudFog, category: 'fog' },
  48: { label: 'Freezing fog', day: CloudFog, night: CloudFog, category: 'fog' },
  51: { label: 'Light drizzle', day: CloudDrizzle, night: CloudDrizzle, category: 'rain' },
  53: { label: 'Drizzle', day: CloudDrizzle, night: CloudDrizzle, category: 'rain' },
  55: { label: 'Dense drizzle', day: CloudDrizzle, night: CloudDrizzle, category: 'rain' },
  56: { label: 'Light freezing drizzle', day: CloudDrizzle, night: CloudDrizzle, category: 'rain' },
  57: { label: 'Freezing drizzle', day: CloudDrizzle, night: CloudDrizzle, category: 'rain' },
  61: { label: 'Light rain', day: CloudRain, night: CloudRain, category: 'rain' },
  63: { label: 'Rain', day: CloudRain, night: CloudRain, category: 'rain' },
  65: { label: 'Heavy rain', day: CloudRainWind, night: CloudRainWind, category: 'rain' },
  66: { label: 'Light freezing rain', day: CloudRain, night: CloudRain, category: 'rain' },
  67: { label: 'Freezing rain', day: CloudRainWind, night: CloudRainWind, category: 'rain' },
  71: { label: 'Light snow', day: CloudSnow, night: CloudSnow, category: 'snow' },
  73: { label: 'Snow', day: CloudSnow, night: CloudSnow, category: 'snow' },
  75: { label: 'Heavy snow', day: Snowflake, night: Snowflake, category: 'snow' },
  77: { label: 'Snow grains', day: Snowflake, night: Snowflake, category: 'snow' },
  80: { label: 'Light rain showers', day: CloudSunRain, night: CloudMoonRain, category: 'rain' },
  81: { label: 'Rain showers', day: CloudSunRain, night: CloudMoonRain, category: 'rain' },
  82: { label: 'Violent rain showers', day: CloudRainWind, night: CloudRainWind, category: 'rain' },
  85: { label: 'Light snow showers', day: CloudSnow, night: CloudSnow, category: 'snow' },
  86: { label: 'Heavy snow showers', day: CloudSnow, night: CloudSnow, category: 'snow' },
  95: { label: 'Thunderstorm', day: CloudLightning, night: CloudLightning, category: 'storm' },
  96: { label: 'Thunderstorm with hail', day: CloudHail, night: CloudHail, category: 'storm' },
  99: { label: 'Severe thunderstorm with hail', day: CloudHail, night: CloudHail, category: 'storm' },
}

const UNKNOWN = { label: 'Unknown', day: CircleHelp, night: CircleHelp, category: 'cloudy' }

/** @returns {{ label: string, Icon: import('react').ComponentType, category: string }} */
export function getWeatherInfo(code, isDay = true) {
  const entry = CODES[code] ?? UNKNOWN
  return { label: entry.label, Icon: isDay ? entry.day : entry.night, category: entry.category }
}

// Gradients are written out in full so Tailwind can detect the class names.
export const THEMES = {
  'clear-day': { gradient: 'bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700' },
  'clear-night': { gradient: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900' },
  'cloudy-day': { gradient: 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700' },
  'cloudy-night': { gradient: 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' },
  'rain-day': { gradient: 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800' },
  'rain-night': { gradient: 'bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950' },
  'snow-day': { gradient: 'bg-gradient-to-br from-sky-700 via-slate-600 to-slate-700' },
  'snow-night': { gradient: 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' },
  'storm-day': { gradient: 'bg-gradient-to-br from-slate-700 via-purple-900 to-slate-900' },
  'storm-night': { gradient: 'bg-gradient-to-br from-slate-900 via-purple-950 to-black' },
}

const CATEGORY_ALIASES = { clear: 'clear', cloudy: 'cloudy', fog: 'cloudy', rain: 'rain', snow: 'snow', storm: 'storm' }

export function getWeatherTheme(code, isDay = true) {
  const { category } = getWeatherInfo(code, isDay)
  const id = `${CATEGORY_ALIASES[category]}-${isDay ? 'day' : 'night'}`
  return { id, ...THEMES[id] }
}
