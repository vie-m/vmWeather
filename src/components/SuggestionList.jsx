import { Loader2, MapPin, RotateCw, SearchX } from 'lucide-react'
import { MIN_QUERY_LENGTH } from '../hooks/useCitySearch.js'
import { formatLocationLabel } from '../utils/formatters.js'
import { locationKey } from '../utils/locations.js'

export const LISTBOX_ID = 'city-suggestions'
export const optionId = (index) => `${LISTBOX_ID}-option-${index}`

function Message({ icon: Icon, spin = false, children }) {
  return (
    <p role="status" className="flex items-start gap-2 px-4 py-3 text-sm text-slate-700">
      <Icon
        size={18}
        aria-hidden="true"
        className={`mt-0.5 shrink-0 text-slate-500 ${spin ? 'animate-spin motion-reduce:animate-none' : ''}`}
      />
      <span>{children}</span>
    </p>
  )
}

/** The dropdown body: suggestions, or a loading / hint / empty / error message. */
export default function SuggestionList({ search, query, activeIndex, onSelect, onHover }) {
  const { results, status, error, isBusy, isSearchable, debouncedQuery, retry } = search
  const hasResults = results.length > 0

  if (!isSearchable) {
    return <Message icon={MapPin}>Keep typing: enter at least {MIN_QUERY_LENGTH} characters.</Message>
  }
  if (status === 'error' && !isBusy) {
    return (
      <div className="flex flex-col items-start gap-2 px-4 py-3 text-sm text-slate-700">
        <p role="alert">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 font-semibold text-white hover:bg-slate-700"
        >
          <RotateCw size={14} aria-hidden="true" />
          Try again
        </button>
      </div>
    )
  }
  if (!hasResults) {
    if (isBusy) return <Message icon={Loader2} spin>Searching…</Message>
    if (debouncedQuery === query.trim()) {
      return (
        <Message icon={SearchX}>
          No cities found for “{query.trim()}”. Check the spelling, try a nearby city, or click the map to pick a spot.
        </Message>
      )
    }
    return null
  }

  return (
    <ul id={LISTBOX_ID} role="listbox" aria-label="City suggestions" className="m-0 list-none p-1">
      {results.map((item, index) => (
        <li
          key={locationKey(item)}
          id={optionId(index)}
          role="option"
          aria-selected={index === activeIndex}
          // Keep focus in the input while clicking an option.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(item)}
          onMouseEnter={() => onHover(index)}
          className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-slate-900 ${
            index === activeIndex ? 'bg-sky-100' : ''
          }`}
        >
          <MapPin size={18} aria-hidden="true" className="shrink-0 text-sky-700" />
          <span className="min-w-0 truncate">{formatLocationLabel(item)}</span>
        </li>
      ))}
    </ul>
  )
}
