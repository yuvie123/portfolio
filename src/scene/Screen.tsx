import { Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { OS_RESOLUTION, SCREEN, SCREEN_DISTANCE_FACTOR } from './config'
import { useSceneStore } from './store'

/** DOM layer mapped onto the monitor glass. Only takes input once the camera has arrived. */
export function Screen() {
  const interactive = useSceneStore((state) => state.view === 'monitor' && state.arrived)
  const rootRef = useRef<HTMLDivElement>(null)
  const [clicks, setClicks] = useState(0)

  useEffect(() => {
    if (interactive) rootRef.current?.focus({ preventScroll: true })
  }, [interactive])

  return (
    <Html
      transform
      position={SCREEN.position}
      rotation={SCREEN.rotation}
      distanceFactor={SCREEN_DISTANCE_FACTOR}
      pointerEvents={interactive ? 'auto' : 'none'}
      zIndexRange={[20, 0]}
    >
      <div
        ref={rootRef}
        data-os-root
        tabIndex={-1}
        inert={!interactive}
        style={{ width: OS_RESOLUTION.width, height: OS_RESOLUTION.height }}
        className="flex flex-col bg-[#06120a] p-16 font-display text-accent outline-none"
      >
        <p className="text-8xl">YR-OS</p>
        <p className="mt-6 text-4xl text-accent/70">Screen test: the desktop OS goes here.</p>
        <button
          type="button"
          onClick={() => setClicks((count) => count + 1)}
          className="mt-12 w-fit border-4 border-accent px-8 py-4 text-4xl transition-colors hover:bg-accent hover:text-ink"
        >
          Clicked {clicks} {clicks === 1 ? 'time' : 'times'}
        </button>
      </div>
    </Html>
  )
}
