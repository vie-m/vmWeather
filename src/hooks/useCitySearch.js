import { useCallback, useEffect, useState } from 'react'
import { WeatherApiError, isAbortError, searchCities } from '../services/weatherApi.js'
import { useDebounce } from './useDebounce.js'

export const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 400
const IDLE = { status: 'idle', results: [], error: null }

/** Debounced geocoding search. Stale requests are aborted as the user keeps typing. */
export function useCitySearch(query) {
  const trimmed = query.trim()
  const debounced = useDebounce(trimmed, DEBOUNCE_MS)
  const [state, setState] = useState(IDLE)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (debounced.length < MIN_QUERY_LENGTH) {
      setState(IDLE)
      return undefined
    }

    const controller = new AbortController()
    setState((previous) => ({ ...previous, status: 'loading', error: null }))

    searchCities(debounced, controller.signal)
      .then((results) => setState({ status: 'success', results, error: null }))
      .catch((error) => {
        if (isAbortError(error)) return
        const message =
          error instanceof WeatherApiError ? error.message : 'Search failed. Please try again.'
        setState({ status: 'error', results: [], error: message })
      })

    return () => controller.abort()
  }, [debounced, attempt])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  return {
    ...state,
    debouncedQuery: debounced,
    // True while the user is still typing (debounce not elapsed) or a request is running.
    isBusy: trimmed !== debounced || state.status === 'loading',
    isSearchable: trimmed.length >= MIN_QUERY_LENGTH,
    retry,
  }
}
