import { Droplets } from 'lucide-react'
import Card from './Card.jsx'
import { formatHourLabel, formatPercent, formatTemperature } from '../utils/formatters.js'
import { getWeatherInfo } from '../utils/weatherCodes.js'

function HourItem({ hour, isNow, unit }) {
  const { label, Icon } = getWeatherInfo(hour.weatherCode, hour.isDay)
  return (
    <li className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2 rounded-2xl bg-black/20 px-2 py-3">
      <time dateTime={hour.time} className="text-sm font-medium text-white/90">
        {formatHourLabel(hour.time, isNow)}
      </time>
      <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <span className="text-lg font-semibold">{formatTemperature(hour.temperature, unit)}</span>
      <span className="inline-flex items-center gap-1 text-xs text-sky-100">
        <Droplets size={12} aria-hidden="true" />
        <span className="sr-only">Chance of rain </span>
        {formatPercent(hour.precipitationProbability)}
      </span>
    </li>
  )
}

export default function HourlyForecast({ hours, unit }) {
  return (
    <Card aria-labelledby="hourly-heading" className="fade-in">
      <h2 id="hourly-heading" className="mb-3 text-lg font-semibold">
        Hourly forecast
      </h2>
      <div
        role="region"
        tabIndex={0}
        aria-label="Next 24 hours, scrolls horizontally"
        // `relative` keeps absolutely-positioned .sr-only text inside the scroller (else it widens the page)
        className="thin-scroll relative -mx-1 overflow-x-auto px-1 pb-3"
      >
        <ul className="flex w-max list-none gap-2 p-0">
          {hours.map((hour, index) => (
            <HourItem key={hour.time} hour={hour} isNow={index === 0} unit={unit} />
          ))}
        </ul>
      </div>
    </Card>
  )
}
