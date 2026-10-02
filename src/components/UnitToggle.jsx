import { UNITS, temperatureUnitLabel } from '../utils/formatters.js'

const OPTIONS = [
  { value: UNITS.CELSIUS, name: 'Celsius' },
  { value: UNITS.FAHRENHEIT, name: 'Fahrenheit' },
]

export default function UnitToggle({ unit, onChange }) {
  return (
    <div role="group" aria-label="Temperature unit" className="inline-flex rounded-full bg-black/25 p-1">
      {OPTIONS.map(({ value, name }) => {
        const isActive = unit === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            aria-label={name}
            onClick={() => onChange(value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              isActive ? 'bg-white text-slate-900' : 'text-white hover:bg-white/20'
            }`}
          >
            {temperatureUnitLabel(value)}
          </button>
        )
      })}
    </div>
  )
}
