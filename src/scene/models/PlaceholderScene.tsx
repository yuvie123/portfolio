import { RoundedBox } from '@react-three/drei'
import { SCREEN } from '../config'

// Stand-in desk built from primitives, replaced by CC0 models later.
const DESK_TOP_Y = 0.77
const LEGS: [number, number][] = [
  [-0.85, -0.35],
  [0.85, -0.35],
  [-0.85, 0.35],
  [0.85, 0.35],
]
const BEIGE = '#d8d0bf'

export function PlaceholderScene() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0d1014" roughness={1} />
      </mesh>

      {/* Desk */}
      <RoundedBox args={[1.8, 0.06, 0.8]} radius={0.01} position={[0, 0.74, 0]}>
        <meshStandardMaterial color="#5a3d2b" roughness={0.7} />
      </RoundedBox>
      {LEGS.map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0.355, z]}>
          <boxGeometry args={[0.05, 0.71, 0.05]} />
          <meshStandardMaterial color="#2a2a2e" roughness={0.6} metalness={0.4} />
        </mesh>
      ))}

      {/* CRT monitor */}
      <mesh position={[0, DESK_TOP_Y + 0.02, -0.05]}>
        <boxGeometry args={[0.26, 0.04, 0.22]} />
        <meshStandardMaterial color={BEIGE} roughness={0.6} />
      </mesh>
      <RoundedBox args={[0.56, 0.46, 0.5]} radius={0.03} position={[0, 1.04, -0.05]}>
        <meshStandardMaterial color={BEIGE} roughness={0.55} />
      </RoundedBox>
      <mesh position={SCREEN.position} rotation={SCREEN.rotation}>
        <planeGeometry args={[SCREEN.width, SCREEN.height]} />
        <meshStandardMaterial color="#06120a" emissive="#7ee787" emissiveIntensity={0.08} roughness={0.9} />
      </mesh>
      <mesh position={[0.22, 0.85, 0.201]}>
        <circleGeometry args={[0.006, 12]} />
        <meshBasicMaterial color="#7ee787" toneMapped={false} />
      </mesh>

      {/* Keyboard and mouse */}
      <RoundedBox args={[0.44, 0.025, 0.14]} radius={0.005} position={[0, DESK_TOP_Y + 0.0125, 0.28]}>
        <meshStandardMaterial color={BEIGE} roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.055, 0.03, 0.09]} radius={0.012} position={[0.33, DESK_TOP_Y + 0.015, 0.29]}>
        <meshStandardMaterial color={BEIGE} roughness={0.6} />
      </RoundedBox>

      {/* Mug */}
      <mesh position={[-0.55, DESK_TOP_Y + 0.05, 0.18]}>
        <cylinderGeometry args={[0.04, 0.036, 0.1, 24]} />
        <meshStandardMaterial color="#1f262e" roughness={0.4} />
      </mesh>

      {/* Desk lamp */}
      <group position={[-0.68, DESK_TOP_Y, -0.22]}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.02, 24]} />
          <meshStandardMaterial color="#2a2a2e" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.42, 12]} />
          <meshStandardMaterial color="#2a2a2e" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.06, 0.43, 0.04]} rotation={[0.3, 0, -0.5]}>
          <coneGeometry args={[0.08, 0.12, 24, 1, true]} />
          <meshStandardMaterial color="#2a2a2e" metalness={0.5} roughness={0.4} side={2} />
        </mesh>
        <mesh position={[0.07, 0.39, 0.05]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
        </mesh>
        <pointLight position={[0.07, 0.36, 0.05]} color="#ffcf8a" intensity={1.5} distance={2.5} decay={2} />
      </group>
    </group>
  )
}
