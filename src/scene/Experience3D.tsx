import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas, type RootState } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { setMode } from '../lib/mode'
import { CameraRig } from './CameraRig'
import { CAMERA, IDLE_START } from './config'
import { Hud } from './Hud'
import { Loader } from './Loader'
import { PlaceholderScene } from './models/PlaceholderScene'
import { Screen } from './Screen'
import { useSceneStore } from './store'
import { useSceneInput } from './useSceneInput'

const BACKGROUND = '#0a0c0f'

function handleCreated({ gl }: RootState) {
  gl.domElement.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault()
      setMode('2d')
    },
    { once: true },
  )
}

export default function Experience3D() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const previousView = useRef<string | null>(null)
  const { view, handlers } = useSceneInput()

  // Hides the "BOOTING..." screen from index.css once the scene is on the page.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.scene = 'mounted'
    return () => {
      delete root.dataset.scene
    }
  }, [])

  // ?view=monitor opens straight into the screen.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('view') === 'monitor') {
      useSceneStore.getState().setView('monitor')
    }
  }, [])

  // Return keyboard focus to the scene after leaving the monitor.
  useEffect(() => {
    if (previousView.current === 'monitor' && view === 'idle') {
      wrapperRef.current?.focus({ preventScroll: true })
    }
    previousView.current = view
  }, [view])

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      aria-label="3D desk. Press Enter to use the computer, Escape to step back."
      className={`fixed inset-0 z-10 outline-none ${view === 'idle' ? 'cursor-pointer' : ''}`}
      {...handlers}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: CAMERA.fov, near: CAMERA.near, far: CAMERA.far, position: IDLE_START }}
        onCreated={handleCreated}
      >
        <color attach="background" args={[BACKGROUND]} />
        <fog attach="fog" args={[BACKGROUND, 5, 12]} />

        <ambientLight intensity={0.35} />
        <directionalLight position={[2.5, 3, 2]} intensity={1.2} />
        <pointLight position={[0, 1.06, 0.6]} color="#7ee787" intensity={0.25} distance={1.5} />
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={1.5} position={[0, 3, 3]} scale={[4, 1, 1]} />
          <Lightformer intensity={0.6} position={[-3, 1, 0]} rotation-y={Math.PI / 2} scale={[2, 2, 1]} color="#ffcf8a" />
        </Environment>

        <Suspense fallback={null}>
          <PlaceholderScene />
          <ContactShadows position={[0, 0.001, 0]} scale={4} blur={2.4} far={1.2} opacity={0.65} resolution={512} frames={1} />
        </Suspense>

        <Screen />
        <CameraRig />
      </Canvas>

      <Hud />
      <Loader />
    </div>
  )
}
