import { Environment, Lightformer } from '@react-three/drei'
import { SCREEN } from './config'

const BACKGROUND = '#0a0c0f'

export function Lighting() {
  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, 5, 12]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[2.5, 3, 2]} intensity={0.9} />
      {/* Faint green spill from the screen onto the keyboard and desk */}
      <pointLight
        position={[SCREEN.position[0], SCREEN.position[1], SCREEN.position[2] + 0.5]}
        color="#7ee787"
        intensity={0.3}
        distance={1.5}
      />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={1.5} position={[0, 3, 3]} scale={[4, 1, 1]} />
        <Lightformer intensity={0.6} position={[-3, 1, 0]} rotation-y={Math.PI / 2} scale={[2, 2, 1]} color="#ffcf8a" />
      </Environment>
    </>
  )
}
