import { History, X } from 'lucide-react'
import { formatLocationLabel } from '../utils/formatters.js'
import { locationKey } from '../utils/locations.js'

export default function RecentSearches({ items, onSelect, onClear }) {
  if (items.length === 0) return null
  return (
    <nav aria-label="Recent searches" className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-sm text-white/90">
        <History size={16} aria-hidden="true" />
        Recent
      </span>
      <ul className="flex list-none flex-wrap gap-2 p-0">
        {items.map((item) => (
          <li key={locationKey(item)}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              title={formatLocationLabel(item)}
              className="max-w-[16rem] truncate rounded-full bg-black/25 px-3 py-1 text-sm text-white transition-colors hover:bg-black/40"
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear recent searches"
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-white/90 underline-offset-2 transition-colors hover:bg-white/15 hover:underline"
      >
        <X size={14} aria-hidden="true" />
        Clear
      </button>
    </nav>
  )
}
