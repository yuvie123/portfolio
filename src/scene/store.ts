import { create } from 'zustand'

export type View = 'idle' | 'monitor'

type SceneState = {
  view: View
  /** True once the camera has settled in front of the screen; the OS only takes input then. */
  arrived: boolean
  setView: (view: View) => void
  setArrived: (arrived: boolean) => void
}

export const useSceneStore = create<SceneState>()((set) => ({
  view: 'idle',
  arrived: false,
  setView: (view) => set((state) => (state.view === view ? state : { view, arrived: false })),
  setArrived: (arrived) => set((state) => (state.arrived === arrived ? state : { arrived })),
}))
