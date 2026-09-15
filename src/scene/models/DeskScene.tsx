import { COMPUTER_POSITION } from '../config'
import { Esp32Board } from './Esp32Board'
import { ESP32, LAMP_LIGHT_POSITION, PROPS } from './layout'
import { Prop } from './Prop'
import { RetroComputer } from './RetroComputer'

export function DeskScene() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0d1014" roughness={1} />
      </mesh>

      {PROPS.map(({ name, ...placement }) => (
        <Prop key={name} {...placement} />
      ))}

      <RetroComputer position={COMPUTER_POSITION} />
      <Esp32Board position={ESP32.position} rotation={ESP32.rotation} />

      <pointLight position={LAMP_LIGHT_POSITION} color="#ffcf8a" intensity={1.2} distance={2.2} decay={2} />
    </group>
  )
}
