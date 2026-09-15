import { OS_SIZE } from '../os/apps'

export type Vec3 = [number, number, number]

export const CAMERA = {
  fov: 35,
  near: 0.05,
  far: 50,
}

/** Slow orbit in front of the desk. Keep baseAzimuth ± (swing + parallax) within about ±0.44 rad (25°). */
export const IDLE = {
  lookAt: [0, 0.95, 0] as Vec3,
  radius: 2.4,
  height: 1.45,
  baseAzimuth: 0,
  swing: 0.3,
  speed: 0.08,
  parallax: 0.06,
}

export const IDLE_START: Vec3 = [
  IDLE.lookAt[0] + Math.sin(IDLE.baseAzimuth) * IDLE.radius,
  IDLE.height,
  IDLE.lookAt[2] + Math.cos(IDLE.baseAzimuth) * IDLE.radius,
]

/**
 * Where the OS is drawn: the monitor's glass, in world units.
 * Independent of any model so the CRT can be swapped by retuning these numbers.
 */
export const SCREEN = {
  position: [0, 1.06, 0.201] as Vec3,
  rotation: [0, 0, 0] as Vec3,
  width: 0.44,
  height: 0.33,
}

/** Logical CSS size the OS is laid out at (4:3, matching SCREEN). */
export const OS_RESOLUTION = OS_SIZE

/** drei <Html transform> maps 1 CSS px to distanceFactor / 400 world units. */
export const SCREEN_DISTANCE_FACTOR = (400 * SCREEN.width) / OS_RESOLUTION.width

/** How far past a tight fit the camera sits in monitor view (1 = screen edges touch the viewport). */
export const MONITOR_FIT_MARGIN = 1.12
