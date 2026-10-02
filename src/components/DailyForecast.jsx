import { Droplets } from 'lucide-react'
import Card from './Card.jsx'
import { formatDayName, formatPercent, formatTemperature } from '../utils/formatters.js'
import { getWeatherInfo } from '../utils/weatherCodes.js'

/** Position of a day's min-max span inside the week's overall range (percentages). */
function rangeBar(day, weekMin, weekMax) {
  const span = weekMax - weekMin || 1
  const left = ((day.min - weekMin) / span) * 100
  const width = Math.max(((day.max - day.min) / span) * 100, 8)
  return { left: `${Math.min(left, 92)}%`, width: `${Math.min(width, 100 - Math.min(left, 92))}%` }
}

function DayRow({ day, index, unit, weekMin, weekMax }) {
  const { label, Icon } = getWeatherInfo(day.weatherCode, true)
  return (
    <li className="grid grid-cols-[3rem_1.5rem_3rem_2.25rem_1fr_2.25rem] items-center gap-2 rounded-2xl bg-black/20 px-3 py-2.5 text-sm sm:grid-cols-[4.5rem_1.75rem_3.5rem_2.75rem_1fr_2.75rem] sm:gap-3 sm:text-base">
      <time dateTime={day.date} className="font-medium">
        {formatDayName(day.date, index)}
      </time>
      <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <span className="inline-flex items-center gap-1 text-xs text-sky-100 sm:text-sm">
        <Droplets size={12} aria-hidden="true" />
        <span className="sr-only">Chance of rain </span>
        {formatPercent(day.precipitationProbability)}
      </span>
      <span className="text-right text-white/90">
        <span className="sr-only">Low </span>
        {formatTemperature(day.min, unit)}
      </span>
      <div aria-hidden="true" className="relative h-1.5 rounded-full bg-white/20">
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-sky-300 to-amber-300"
          style={rangeBar(day, weekMin, weekMax)}
        />
      </div>
      <span className="font-semibold">
        <span className="sr-only">High </span>
        {formatTemperature(day.max, unit)}
      </span>
    </li>
  )
}

export default function DailyForecast({ days, unit }) {
  const weekMin = Math.min(...days.map((day) => day.min))
  const weekMax = Math.max(...days.map((day) => day.max))

  return (
    <Card aria-labelledby="daily-heading" className="fade-in">
      <h2 id="daily-heading" className="mb-3 text-lg font-semibold">
        7-day forecast
      </h2>
      <ul className="flex list-none flex-col gap-2 p-0">
        {days.map((day, index) => (
          <DayRow key={day.date} day={day} index={index} unit={unit} weekMin={weekMin} weekMax={weekMax} />
        ))}
      </ul>
    </Card>
  )
}
