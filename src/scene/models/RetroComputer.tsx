import { Instance, Instances, RoundedBox } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { Color, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import { MONITOR_GLASS } from '../config'

// A beige 90s desktop PC: horizontal system unit with a CRT monitor on a swivel base.
// Origin is the bottom-centre of the case; the monitor faces +z.

const shell = new MeshStandardMaterial({ color: '#dcd3be', roughness: 0.6 })
const shellShade = new MeshStandardMaterial({ color: '#c6bca5', roughness: 0.7 })
const bezel = new MeshStandardMaterial({ color: '#1d1f1d', roughness: 0.85 })
const recess = new MeshStandardMaterial({ color: '#151515', roughness: 0.9 })
const glass = new MeshStandardMaterial({ color: '#06120a', roughness: 0.3 })
// Colours above 1 (with tone mapping off) are what bloom picks up.
const phosphorHalo = new MeshBasicMaterial({ color: new Color(0.2, 1.4, 0.35), toneMapped: false })
const powerLed = new MeshBasicMaterial({ color: new Color(0.4, 3, 0.6), toneMapped: false })
const driveLed = new MeshBasicMaterial({ color: new Color(3, 1.5, 0.15), toneMapped: false })

const [glassX, glassY, glassZ] = MONITOR_GLASS.center
const CASE_FRONT_Z = 0.23
const SHELL_FRONT_Z = 0.1
/** Width of the glowing edge visible around the OS screen, in metres. */
const HALO_BORDER = 0.0025

const FRONT_VENT_Y = [0.04, 0.052, 0.064, 0.076, 0.088]
const SIDE_VENT_Y = [0.28, 0.31, 0.34, 0.37, 0.4, 0.43, 0.46]

export function RetroComputer(props: ThreeElements['group']) {
  return (
    <group {...props}>
      {/* System unit */}
      <RoundedBox args={[0.56, 0.13, 0.46]} radius={0.012} smoothness={3} position={[0, 0.065, 0]} material={shell} />
      <mesh position={[-0.15, 0.07, CASE_FRONT_Z + 0.002]} material={shellShade}>
        <boxGeometry args={[0.2, 0.05, 0.004]} />
      </mesh>
      <mesh position={[-0.15, 0.078, CASE_FRONT_Z + 0.0045]} material={recess}>
        <boxGeometry args={[0.14, 0.008, 0.002]} />
      </mesh>
      <mesh position={[-0.2, 0.058, CASE_FRONT_Z + 0.0045]} material={shell}>
        <boxGeometry args={[0.022, 0.008, 0.003]} />
      </mesh>
      <mesh position={[-0.07, 0.058, CASE_FRONT_Z + 0.0045]} material={driveLed}>
        <boxGeometry args={[0.012, 0.005, 0.002]} />
      </mesh>
      <mesh position={[0.21, 0.065, CASE_FRONT_Z + 0.003]} rotation-x={Math.PI / 2} material={shellShade}>
        <cylinderGeometry args={[0.013, 0.013, 0.006, 20]} />
      </mesh>
      <mesh position={[0.17, 0.065, CASE_FRONT_Z + 0.002]} material={powerLed}>
        <boxGeometry args={[0.009, 0.004, 0.002]} />
      </mesh>
      <Instances material={recess} limit={FRONT_VENT_Y.length}>
        <boxGeometry args={[0.09, 0.003, 0.002]} />
        {FRONT_VENT_Y.map((y) => (
          <Instance key={y} position={[0.05, y, CASE_FRONT_Z + 0.001]} />
        ))}
      </Instances>

      {/* Swivel base */}
      <mesh position={[0, 0.14, -0.02]} material={shellShade}>
        <cylinderGeometry args={[0.13, 0.14, 0.02, 32]} />
      </mesh>
      <mesh position={[0, 0.165, -0.02]} material={shellShade}>
        <boxGeometry args={[0.14, 0.03, 0.12]} />
      </mesh>

      {/* Monitor housing: front shell with a stepped, tapering back */}
      <RoundedBox args={[0.5, 0.42, 0.1]} radius={0.02} smoothness={3} position={[0, 0.38, 0.05]} material={shell} />
      <RoundedBox args={[0.42, 0.34, 0.22]} radius={0.03} smoothness={3} position={[0, 0.37, -0.11]} material={shell} />
      <RoundedBox args={[0.3, 0.24, 0.12]} radius={0.03} smoothness={3} position={[0, 0.36, -0.27]} material={shellShade} />
      <Instances material={recess} limit={SIDE_VENT_Y.length * 2}>
        <boxGeometry args={[0.003, 0.012, 0.1]} />
        {SIDE_VENT_Y.flatMap((y) => [
          <Instance key={`l${y}`} position={[-0.2115, y, -0.11]} />,
          <Instance key={`r${y}`} position={[0.2115, y, -0.11]} />,
        ])}
      </Instances>

      {/* Screen: dark bezel, glowing phosphor edge, glass (the OS is drawn on top of the glass) */}
      <mesh position={[glassX, glassY, SHELL_FRONT_Z + 0.0008]} material={bezel}>
        <planeGeometry args={[0.4, 0.31]} />
      </mesh>
      <mesh position={[glassX, glassY, SHELL_FRONT_Z + 0.0016]} material={phosphorHalo}>
        <planeGeometry args={[MONITOR_GLASS.width + HALO_BORDER * 2, MONITOR_GLASS.height + HALO_BORDER * 2]} />
      </mesh>
      <mesh position={[glassX, glassY, glassZ]} material={glass}>
        <planeGeometry args={[MONITOR_GLASS.width, MONITOR_GLASS.height]} />
      </mesh>

      {/* Monitor chin: badge, power LED and button */}
      <mesh position={[-0.17, 0.2, SHELL_FRONT_Z + 0.0015]} material={bezel}>
        <boxGeometry args={[0.07, 0.014, 0.003]} />
      </mesh>
      <mesh position={[0.18, 0.2, SHELL_FRONT_Z + 0.0015]} material={powerLed}>
        <boxGeometry args={[0.01, 0.005, 0.003]} />
      </mesh>
      <mesh position={[0.21, 0.2, SHELL_FRONT_Z + 0.002]} rotation-x={Math.PI / 2} material={shellShade}>
        <cylinderGeometry args={[0.009, 0.009, 0.005, 16]} />
      </mesh>
    </group>
  )
}
