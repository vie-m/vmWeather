// localStorage wrapper. Every access is wrapped in try/catch so the app keeps
// working when storage is blocked (private mode, disabled cookies, quota...).

export function readStorage(key) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? undefined : JSON.parse(raw)
  } catch {
    return undefined
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: persistence is a nicety, not a requirement.
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore.
  }
}
