import { useState } from 'react'
import { Loader2, Search, X } from 'lucide-react'
import SuggestionList, { LISTBOX_ID, optionId } from './SuggestionList.jsx'
import { useCitySearch } from '../hooks/useCitySearch.js'

/** Accessible combobox: debounced city search with keyboard navigation. */
export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const search = useCitySearch(query)

  const hasQuery = query.trim().length > 0
  const showPanel = isOpen && hasQuery
  const hasResults = search.results.length > 0
  const isListVisible = showPanel && hasResults && search.isSearchable

  const close = () => {
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const choose = (location) => {
    onSelect(location)
    setQuery('')
    close()
  }

  const handleChange = (event) => {
    setQuery(event.target.value)
    setActiveIndex(-1)
    setIsOpen(true)
  }

  const handleKeyDown = (event) => {
    const count = isListVisible ? search.results.length : 0
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) return setIsOpen(true)
        if (count) setActiveIndex((index) => (index + 1) % count)
        break
      case 'ArrowUp':
        event.preventDefault()
        if (count) setActiveIndex((index) => (index <= 0 ? count - 1 : index - 1))
        break
      case 'Enter':
        if (!count || search.isBusy) return
        event.preventDefault()
        choose(search.results[activeIndex >= 0 ? activeIndex : 0])
        break
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          close()
        }
        break
      default:
    }
  }

  // Close when focus leaves the whole widget (input, panel, retry button).
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) close()
  }

  return (
    <div className="relative min-w-0 flex-1" onBlur={handleBlur}>
      <label htmlFor="city-search" className="sr-only">
        Search for a city
      </label>
      <Search
        size={20}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        id="city-search"
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck="false"
        placeholder="Search for a city…"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        aria-expanded={showPanel}
        aria-controls={isListVisible ? LISTBOX_ID : undefined}
        aria-autocomplete="list"
        aria-activedescendant={isListVisible && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        className="h-12 w-full rounded-2xl border-0 bg-white pl-12 pr-11 text-base text-slate-900 shadow-card placeholder:text-slate-500"
      />
      {hasQuery && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setQuery('')
            close()
            document.getElementById('city-search')?.focus()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
        >
          {search.isBusy ? (
            <Loader2 size={18} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
          ) : (
            <X size={18} aria-hidden="true" />
          )}
        </button>
      )}

      {/* z-index well above Leaflet's panes (up to 1000) and controls */}
      {showPanel && (
        <div className="absolute inset-x-0 top-full z-[2000] mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
          <SuggestionList
            search={search}
            query={query}
            activeIndex={activeIndex}
            onSelect={choose}
            onHover={setActiveIndex}
          />
        </div>
      )}
    </div>
  )
}
