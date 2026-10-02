import { useCallback, useState } from 'react'
import { createCoordinateLocation } from '../utils/locations.js'

const MESSAGES = {
  1: 'Location access was blocked. You can still search for a city or click anywhere on the map.',
  2: "Your position couldn't be determined right now. Try searching for a city instead.",
  3: 'Finding your location took too long. Try again or search for a city instead.',
}
const UNSUPPORTED = "Your browser doesn't support location lookup. Search for a city instead."
const FALLBACK = "Couldn't get your location. Search for a city or click the map instead."

/** Wraps the browser Geolocation API; failures become a friendly message, never an exception. */
export function useGeolocation(onLocate) {
  const [isLocating, setIsLocating] = useState(false)
  const [message, setMessage] = useState('')

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setMessage(UNSUPPORTED)
      return
    }
    setMessage('')
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLocating(false)
        onLocate(createCoordinateLocation(coords.latitude, coords.longitude, 'My location'))
      },
      (error) => {
        setIsLocating(false)
        setMessage(MESSAGES[error.code] ?? FALLBACK)
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }, [onLocate])

  const dismissMessage = useCallback(() => setMessage(''), [])

  return { locate, isLocating, message, dismissMessage }
}
