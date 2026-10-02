import { useCallback, useEffect, useState } from 'react'
import { WeatherApiError, fetchForecast, isAbortError } from '../services/weatherApi.js'

const INITIAL = { status: 'loading', data: null, error: null, lastData: null }
const GENERIC_ERROR = 'Something went wrong while loading the weather. Please try again.'

/**
 * Loads the forecast for a location, aborting the request when the location changes.
 * `data` belongs to the current location only; `lastData` keeps the previous successful
 * result so the page background doesn't flash while a new location loads.
 * Unit changes never reach this hook, so toggling °C/°F doesn't refetch.
 */
export function useWeather({ latitude, longitude }) {
  const [state, setState] = useState(INITIAL)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((previous) => ({ ...previous, status: 'loading', data: null, error: null }))

    fetchForecast(latitude, longitude, controller.signal)
      .then((data) => setState({ status: 'success', data, error: null, lastData: data }))
      .catch((error) => {
        if (isAbortError(error)) return
        const message = error instanceof WeatherApiError ? error.message : GENERIC_ERROR
        setState((previous) => ({ ...previous, status: 'error', data: null, error: message }))
      })

    return () => controller.abort()
  }, [latitude, longitude, attempt])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  return { ...state, retry }
}
