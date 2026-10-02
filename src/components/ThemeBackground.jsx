import { THEMES } from '../utils/weatherCodes.js'

/** Full-page gradients stacked on top of each other; only the active one is visible (cross-fade). */
export default function ThemeBackground({ themeId }) {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-slate-900">
      {Object.entries(THEMES).map(([id, { gradient }]) => (
        <div
          key={id}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${gradient} ${
            id === themeId ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
