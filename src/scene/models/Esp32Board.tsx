import { Instance, Instances } from '@react-three/drei'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { useRef } from 'react'
import { Color, MeshBasicMaterial, MeshStandardMaterial } from 'three'

// An ESP32 dev board (the heart of Balance Track), drawn about 1.6x real size so it reads from the camera.

const pcb = new MeshStandardMaterial({ color: '#15181d', roughness: 0.6 })
const metal = new MeshStandardMaterial({ color: '#c9ccd1', metalness: 0.9, roughness: 0.3 })
const gold = new MeshStandardMaterial({ color: '#d4b55a', metalness: 0.8, roughness: 0.35 })
const LED_ON = new Color(0.5, 1.6, 3.2)
const LED_OFF = new Color(0.02, 0.04, 0.08)

const PIN_X = Array.from({ length: 15 }, (_, i) => -0.0378 + i * 0.0054)
const PIN_ROWS_Z = [-0.019, 0.019]

export function Esp32Board(props: ThreeElements['group']) {
  const led = useRef<MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    if (!led.current) return
    const on = Math.floor(clock.elapsedTime * 1.5) % 2 === 0
    led.current.color.copy(on ? LED_ON : LED_OFF)
  })

  return (
    <group {...props}>
      <mesh position={[0, 0.0016, 0]} material={pcb}>
        <boxGeometry args={[0.085, 0.0032, 0.046]} />
      </mesh>
      {/* RF shield and antenna trace */}
      <mesh position={[0.014, 0.0055, 0]} material={metal}>
        <boxGeometry args={[0.03, 0.0045, 0.026]} />
      </mesh>
      <mesh position={[0.037, 0.0034, 0]} material={gold}>
        <boxGeometry args={[0.006, 0.0005, 0.022]} />
      </mesh>
      {/* Micro-USB port */}
      <mesh position={[-0.04, 0.0055, 0]} material={metal}>
        <boxGeometry args={[0.008, 0.0035, 0.011]} />
      </mesh>
      {/* Boot / reset buttons */}
      <mesh position={[-0.033, 0.0042, 0.011]} material={metal}>
        <boxGeometry args={[0.004, 0.002, 0.004]} />
      </mesh>
      <mesh position={[-0.033, 0.0042, -0.011]} material={metal}>
        <boxGeometry args={[0.004, 0.002, 0.004]} />
      </mesh>
      {/* Header pins */}
      <Instances material={gold} limit={PIN_X.length * PIN_ROWS_Z.length}>
        <boxGeometry args={[0.0022, 0.006, 0.0022]} />
        {PIN_ROWS_Z.flatMap((z) => PIN_X.map((x) => <Instance key={`${x}:${z}`} position={[x, 0.0062, z]} />))}
      </Instances>
      {/* Status LED */}
      <mesh position={[-0.024, 0.0036, 0.013]}>
        <boxGeometry args={[0.003, 0.0012, 0.002]} />
        <meshBasicMaterial ref={led} color={LED_ON} toneMapped={false} />
      </mesh>
    </group>
  )
}
