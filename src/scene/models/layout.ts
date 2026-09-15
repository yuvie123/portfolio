import { useGLTF } from '@react-three/drei'
import { DESK_TOP_Y, type Vec3 } from '../config'
import type { Fit } from './Prop'

// Optimized models live in public/models (see scripts/optimize-models.mjs).
const model = (name: string) => `/models/${name}.v1.glb`

export type PropPlacement = {
  name: string
  url: string
  fit: Fit
  position: Vec3
  rotation?: Vec3
}

export const PROPS: PropPlacement[] = [
  { name: 'desk', url: model('desk'), fit: { axis: 'y', size: DESK_TOP_Y }, position: [0, 0, 0] },
  { name: 'keyboard', url: model('keyboard'), fit: { axis: 'x', size: 0.42 }, position: [0, DESK_TOP_Y, 0.34] },
  { name: 'mouse', url: model('mouse'), fit: { axis: 'z', size: 0.1 }, position: [0.33, DESK_TOP_Y, 0.35], rotation: [0, -0.15, 0] },
  { name: 'lamp', url: model('lamp'), fit: { axis: 'y', size: 0.45 }, position: [-0.62, DESK_TOP_Y, -0.16], rotation: [0, 0.6, 0] },
  { name: 'mug', url: model('mug'), fit: { axis: 'y', size: 0.1 }, position: [-0.5, DESK_TOP_Y, 0.18] },
  { name: 'books', url: model('books'), fit: { axis: 'x', size: 0.24 }, position: [0.58, DESK_TOP_Y, -0.18], rotation: [0, -0.35, 0] },
  { name: 'plant', url: model('plant'), fit: { axis: 'y', size: 0.34 }, position: [0.66, DESK_TOP_Y, 0.14] },
]

export const ESP32 = {
  position: [-0.31, DESK_TOP_Y, 0.34] as Vec3,
  rotation: [0, 0.35, 0] as Vec3,
}

/** Warm point light at the lamp's bulb. */
export const LAMP_LIGHT_POSITION: Vec3 = [-0.52, DESK_TOP_Y + 0.38, -0.1]

for (const { url } of PROPS) useGLTF.preload(url)
