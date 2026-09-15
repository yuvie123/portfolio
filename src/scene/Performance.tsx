import { PerformanceMonitor } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef, type ReactNode } from 'react'
import { useSceneStore } from './store'

/** Exposes scene state on the canvas element for debugging and automated checks. */
function markCanvas(key: string, value: string) {
  const canvas = document.querySelector('canvas')
  if (canvas) canvas.dataset[key] = value
}

/**
 * Lowers quality step by step when the frame rate drops: resolution first, then post-processing.
 * If it keeps flip-flopping, the HUD offers the 2D site instead (never forced).
 */
export function AdaptiveQuality({ children }: { children: ReactNode }) {
  const setDpr = useThree((state) => state.setDpr)
  const fx = useSceneStore((state) => state.fx)
  const declines = useRef(0)

  useEffect(() => {
    markCanvas('quality', fx ? 'high' : 'low')
  }, [fx])

  return (
    <PerformanceMonitor
      flipflops={3}
      onDecline={() => {
        declines.current += 1
        if (declines.current === 1) setDpr(1)
        else useSceneStore.getState().setFx(false)
      }}
      onFallback={() => {
        setDpr(1)
        const { setFx, setLowPerf } = useSceneStore.getState()
        setFx(false)
        setLowPerf(true)
      }}
    >
      {children}
    </PerformanceMonitor>
  )
}

/** While the visitor uses the OS the camera is parked, so the canvas only redraws on demand. */
export function FrameloopController() {
  const setFrameloop = useThree((state) => state.setFrameloop)
  const parked = useSceneStore((state) => state.view === 'monitor' && state.arrived)

  useEffect(() => {
    const mode = parked ? 'demand' : 'always'
    setFrameloop(mode)
    markCanvas('frameloop', mode)
  }, [parked, setFrameloop])

  return null
}
