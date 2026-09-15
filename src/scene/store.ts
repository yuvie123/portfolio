import { create } from 'zustand'

export type View = 'idle' | 'monitor'

type SceneState = {
  view: View
  /** True once the camera has settled in front of the screen; the OS only takes input then. */
  arrived: boolean
  /** Post-processing on. Turned off automatically if the device can't keep up. */
  fx: boolean
  /** The device still struggled after lowering quality; the HUD offers the 2D site. */
  lowPerf: boolean
  setView: (view: View) => void
  setArrived: (arrived: boolean) => void
  setFx: (fx: boolean) => void
  setLowPerf: (lowPerf: boolean) => void
}

export const useSceneStore = create<SceneState>()((set) => ({
  view: 'idle',
  arrived: false,
  fx: true,
  lowPerf: false,
  setView: (view) => set((state) => (state.view === view ? state : { view, arrived: false })),
  setArrived: (arrived) => set((state) => (state.arrived === arrived ? state : { arrived })),
  setFx: (fx) => set({ fx }),
  setLowPerf: (lowPerf) => set({ lowPerf }),
}))
