import { create } from 'zustand'
import { APP_IDS, APPS, DESKTOP, type AppId, type Rect } from './apps'

export type WindowState = Rect & {
  open: boolean
  minimized: boolean
  maximized: boolean
  z: number
}

type OSState = {
  windows: Record<AppId, WindowState>
  topZ: number
  focused: AppId | null
  open: (id: AppId) => void
  close: (id: AppId) => void
  minimize: (id: AppId) => void
  toggleMaximize: (id: AppId) => void
  focus: (id: AppId) => void
  move: (id: AppId, x: number, y: number) => void
  resize: (id: AppId, w: number, h: number) => void
}

const MIN_WIDTH = 420
const MIN_HEIGHT = 280
/** Always leave this much of a window's title bar on the desktop so it can be dragged back. */
const GRAB_MARGIN = 120
const TITLE_BAR_HEIGHT = 48

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function initialWindows() {
  return Object.fromEntries(
    APP_IDS.map((id) => [id, { ...APPS[id].defaultRect, open: false, minimized: false, maximized: false, z: 0 }]),
  ) as Record<AppId, WindowState>
}

function topmostVisible(windows: Record<AppId, WindowState>): AppId | null {
  let best: AppId | null = null
  for (const id of APP_IDS) {
    const win = windows[id]
    if (win.open && !win.minimized && (best === null || win.z > windows[best].z)) best = id
  }
  return best
}

function raise(state: OSState, id: AppId, changes: Partial<WindowState> = {}) {
  const topZ = state.topZ + 1
  return {
    topZ,
    focused: id,
    windows: { ...state.windows, [id]: { ...state.windows[id], ...changes, minimized: false, z: topZ } },
  }
}

function update(state: OSState, id: AppId, changes: Partial<WindowState>) {
  return { ...state.windows, [id]: { ...state.windows[id], ...changes } }
}

export const useOSStore = create<OSState>()((set) => ({
  windows: initialWindows(),
  topZ: 0,
  focused: null,

  open: (id) => set((state) => raise(state, id, { open: true })),

  focus: (id) => set((state) => (state.focused === id && !state.windows[id].minimized ? state : raise(state, id))),

  close: (id) =>
    set((state) => {
      const windows = update(state, id, { open: false, maximized: false })
      return { windows, focused: topmostVisible(windows) }
    }),

  minimize: (id) =>
    set((state) => {
      const windows = update(state, id, { minimized: true })
      return { windows, focused: topmostVisible(windows) }
    }),

  toggleMaximize: (id) => set((state) => raise(state, id, { maximized: !state.windows[id].maximized })),

  move: (id, x, y) =>
    set((state) => {
      const win = state.windows[id]
      return {
        windows: update(state, id, {
          x: clamp(x, GRAB_MARGIN - win.w, DESKTOP.width - GRAB_MARGIN),
          y: clamp(y, 0, DESKTOP.height - TITLE_BAR_HEIGHT),
        }),
      }
    }),

  resize: (id, w, h) =>
    set((state) => {
      const win = state.windows[id]
      return {
        windows: update(state, id, {
          w: clamp(w, MIN_WIDTH, Math.max(MIN_WIDTH, DESKTOP.width - win.x)),
          h: clamp(h, MIN_HEIGHT, Math.max(MIN_HEIGHT, DESKTOP.height - win.y)),
        }),
      }
    }),
}))
