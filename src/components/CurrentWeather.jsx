import { CloudRain, Droplets, Sunrise, Sunset, Thermometer, Wind } from 'lucide-react'
import Card from './Card.jsx'
import {
  UNITS,
  formatClock,
  formatLocalDateTime,
  formatLocationSubtitle,
  formatPercent,
  formatTemperature,
  formatWindSpeed,
} from '../utils/formatters.js'
import { getWeatherInfo } from '../utils/weatherCodes.js'

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 p-3">
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/90">
        <Icon size={14} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold">{value}</dd>
    </div>
  )
}

export default function CurrentWeather({ location, current, today, unit }) {
  const { label, Icon } = getWeatherInfo(current.weatherCode, current.isDay)
  const subtitle = formatLocationSubtitle(location)

  return (
    <Card aria-labelledby="current-heading" className="fade-in flex flex-col justify-between gap-6">
      <div>
        <h2 id="current-heading" className="break-words text-2xl font-semibold leading-tight">
          {location.name}
        </h2>
        {subtitle && <p className="text-white/90">{subtitle}</p>}
        <p className="mt-1 text-sm text-white/90">
          <time dateTime={current.time}>{formatLocalDateTime(current.time)}</time> local time
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="flex items-start text-7xl font-light leading-none sm:text-8xl">
          <span aria-label={`${formatTemperature(current.temperature, unit)} ${unit}`}>
            {formatTemperature(current.temperature, unit)}
          </span>
          <span aria-hidden="true" className="mt-2 text-3xl sm:text-4xl">
            {unit === UNITS.FAHRENHEIT ? 'F' : 'C'}
          </span>
        </p>
        <div className="flex flex-col items-center gap-1 text-center">
          <Icon size={64} strokeWidth={1.5} aria-hidden="true" />
          <p className="text-lg font-medium">{label}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Detail icon={Thermometer} label="Feels like" value={formatTemperature(current.feelsLike, unit)} />
        <Detail icon={Droplets} label="Humidity" value={formatPercent(current.humidity)} />
        <Detail icon={Wind} label="Wind" value={formatWindSpeed(current.windSpeed, unit)} />
        <Detail icon={Sunrise} label="Sunrise" value={formatClock(today?.sunrise)} />
        <Detail icon={Sunset} label="Sunset" value={formatClock(today?.sunset)} />
        <Detail icon={CloudRain} label="Rain today" value={formatPercent(today?.precipitationProbability)} />
      </dl>
    </Card>
  )
}
