// Web storage can throw (private mode, blocked site data), so every access is guarded.

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

/** Per-tab flag, e.g. "already watched the boot sequence this visit". */
export function readSessionFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

export function writeSessionFlag(key: string): void {
  try {
    sessionStorage.setItem(key, '1')
  } catch {
    // Storage unavailable; the boot sequence will just replay next time.
  }
}
