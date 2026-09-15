// localStorage can throw (private mode, blocked site data), so every access is guarded.

export function readPref(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage unavailable; the choice just won't persist across visits.
  }
}
