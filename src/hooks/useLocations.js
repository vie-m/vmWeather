import { useCallback, useState } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import {
  DEFAULT_LOCATION,
  MAX_RECENT,
  STORAGE_KEYS,
  isValidLocation,
  locationKey,
  toStoredLocation,
} from '../utils/locations.js'

const isValidRecentList = (value) => Array.isArray(value) && value.every(isValidLocation)

/**
 * Owns the selected location (persisted) and the recent-searches list (persisted).
 * `origin` records who changed the location ('map' clicks shouldn't move the map).
 */
export function useLocations() {
  const [location, setLocation] = useLocalStorage(STORAGE_KEYS.location, DEFAULT_LOCATION, isValidLocation)
  const [recent, setRecent] = useLocalStorage(STORAGE_KEYS.recent, [], isValidRecentList)
  const [origin, setOrigin] = useState('initial')

  const select = useCallback(
    (next, source = 'search') => {
      const stored = toStoredLocation(next)
      setOrigin(source)
      setLocation(stored)
      setRecent((previous) =>
        [stored, ...previous.filter((item) => locationKey(item) !== locationKey(stored))].slice(0, MAX_RECENT),
      )
    },
    [setLocation, setRecent],
  )

  const selectFromMap = useCallback((next) => select(next, 'map'), [select])
  const clearRecent = useCallback(() => setRecent([]), [setRecent])

  return { location, origin, recent: recent.slice(0, MAX_RECENT), select, selectFromMap, clearRecent }
}
