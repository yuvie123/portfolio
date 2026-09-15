import { OS_SIZE } from '../os/apps'

export type Vec3 = [number, number, number]

export const CAMERA = {
  fov: 35,
  near: 0.05,
  far: 50,
}

/** Height of the desk surface; everything on the desk is placed relative to it. */
export const DESK_TOP_Y = 0.75

/** Slow orbit in front of the desk. Keep baseAzimuth ± (swing + parallax) within about ±0.44 rad (25°). */
export const IDLE = {
  lookAt: [0, 1.0, 0] as Vec3,
  radius: 2.75,
  height: 1.55,
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

/** Where the retro computer stands (bottom-centre of its case). It always faces +z. */
export const COMPUTER_POSITION: Vec3 = [0, DESK_TOP_Y, -0.06]

/** The monitor glass, relative to the computer's origin. Must stay 4:3 to match OS_SIZE. */
export const MONITOR_GLASS = {
  center: [0, 0.39, 0.1024] as Vec3,
  width: 0.36,
  height: 0.27,
}

/** Where the OS is drawn in world space: derived from the computer so it always sits on the glass. */
export const SCREEN = {
  position: [
    COMPUTER_POSITION[0] + MONITOR_GLASS.center[0],
    COMPUTER_POSITION[1] + MONITOR_GLASS.center[1],
    COMPUTER_POSITION[2] + MONITOR_GLASS.center[2],
  ] as Vec3,
  rotation: [0, 0, 0] as Vec3,
  width: MONITOR_GLASS.width,
  height: MONITOR_GLASS.height,
}

/** Logical CSS size the OS is laid out at (4:3, matching SCREEN). */
export const OS_RESOLUTION = OS_SIZE

/** drei <Html transform> maps 1 CSS px to distanceFactor / 400 world units. */
export const SCREEN_DISTANCE_FACTOR = (400 * SCREEN.width) / OS_RESOLUTION.width

/** How far past a tight fit the camera sits in monitor view (1 = screen edges touch the viewport). */
export const MONITOR_FIT_MARGIN = 1.12
