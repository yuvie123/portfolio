import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useState } from 'react'
import { Euler, MathUtils, type PerspectiveCamera, Vector3 } from 'three'
import { IDLE, MONITOR_FIT_MARGIN, SCREEN } from './config'
import { useSceneStore } from './store'

const SMOOTH_TIME = 0.45
const ARRIVE_EPSILON = 0.002

// Scratch vectors reused every frame (one rig per page).
const idleLookAt = new Vector3(...IDLE.lookAt)
const screenCenter = new Vector3(...SCREEN.position)
const screenNormal = new Vector3(0, 0, 1).applyEuler(new Euler(...SCREEN.rotation))
const targetPosition = new Vector3()
const targetLookAt = new Vector3()
const currentLookAt = idleLookAt.clone()

export function CameraRig() {
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useFrame((state, delta) => {
    const { view, arrived, setArrived } = useSceneStore.getState()
    const camera = state.camera as PerspectiveCamera

    if (view === 'monitor') {
      // Back off along the screen normal until the whole screen fits the viewport.
      const tanHalfFov = Math.tan(MathUtils.degToRad(camera.fov) / 2)
      const fitHeight = SCREEN.height / 2 / tanHalfFov
      const fitWidth = SCREEN.width / 2 / (tanHalfFov * camera.aspect)
      targetPosition
        .copy(screenCenter)
        .addScaledVector(screenNormal, Math.max(fitHeight, fitWidth) * MONITOR_FIT_MARGIN)
      targetLookAt.copy(screenCenter)
    } else {
      const swing = reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * IDLE.speed) * IDLE.swing
      const azimuth = IDLE.baseAzimuth + swing + state.pointer.x * IDLE.parallax
      targetPosition.set(
        idleLookAt.x + Math.sin(azimuth) * IDLE.radius,
        IDLE.height + state.pointer.y * IDLE.parallax,
        idleLookAt.z + Math.cos(azimuth) * IDLE.radius,
      )
      targetLookAt.copy(idleLookAt)
    }

    if (reduceMotion) {
      camera.position.copy(targetPosition)
      currentLookAt.copy(targetLookAt)
    } else {
      easing.damp3(camera.position, targetPosition, SMOOTH_TIME, delta)
      easing.damp3(currentLookAt, targetLookAt, SMOOTH_TIME, delta)
    }
    camera.lookAt(currentLookAt)

    const hasArrived =
      view === 'monitor' &&
      camera.position.distanceTo(targetPosition) < ARRIVE_EPSILON &&
      currentLookAt.distanceTo(targetLookAt) < ARRIVE_EPSILON
    if (hasArrived !== arrived) setArrived(hasArrived)
  })

  return null
}
