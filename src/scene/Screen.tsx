import { Html } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { OS } from '../os/OS'
import { OS_RESOLUTION, SCREEN, SCREEN_DISTANCE_FACTOR } from './config'
import { useSceneStore } from './store'

/** DOM layer mapped onto the monitor glass. Only takes input once the camera has arrived. */
export function Screen() {
  const interactive = useSceneStore((state) => state.view === 'monitor' && state.arrived)
  const setView = useSceneStore((state) => state.setView)
  const rootRef = useRef<HTMLDivElement>(null)

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
        className="crt relative overflow-hidden bg-[#06120a] text-fg outline-none"
      >
        <OS active={interactive} onShutdown={() => setView('idle')} />
      </div>
    </Html>
  )
}
