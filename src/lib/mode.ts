import { useSyncExternalStore } from 'react'
import { writePref } from './prefs'

export type Mode = '2d' | '3d'

export type ModeInfo = {
  mode: Mode
  /** What automatic detection chose, ignoring saved or requested overrides. */
  auto: Mode
  /** Why detection chose 2D (empty when 3D was chosen). */
  reasons: string[]
  webgl: boolean
}

declare global {
  interface Window {
    /** Set by the inline detection script in index.html before the app loads. */
    __YR_MODE__?: ModeInfo
  }
}

const STORAGE_KEY = 'yr-mode'
const FALLBACK_INFO: ModeInfo = { mode: '2d', auto: '2d', reasons: ['unknown'], webgl: false }
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getInfo(): ModeInfo {
  return window.__YR_MODE__ ?? FALLBACK_INFO
}

/** The mode chosen before React loaded. Client-only. */
export function getInitialMode(): Mode {
  return getInfo().mode
}

export function setMode(mode: Mode): void {
  const current = getInfo()
  if (mode === '3d' && !current.webgl) return

  window.__YR_MODE__ = { ...current, mode }
  document.documentElement.dataset.mode = mode
  writePref(STORAGE_KEY, mode)
  listeners.forEach((listener) => listener())
}

/** Prerendering and hydration always use 2D, so server and client markup match. */
export function useMode(): Mode {
  return useSyncExternalStore(subscribe, () => getInfo().mode, () => '2d')
}

/** Full detection details, or null while prerendering and hydrating. */
export function useModeInfo(): ModeInfo | null {
  return useSyncExternalStore(subscribe, getInfo, () => null)
}
