import { useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage.js'

/**
 * useState that persists to localStorage (safely: blocked storage just means no persistence).
 * `validate` guards against corrupted or outdated stored data.
 */
export function useLocalStorage(key, initialValue, validate = () => true) {
  const [value, setValue] = useState(() => {
    const stored = readStorage(key)
    return stored !== undefined && validate(stored) ? stored : initialValue
  })

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue]
}
