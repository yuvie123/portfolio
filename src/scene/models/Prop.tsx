import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { useMemo } from 'react'
import { Box3, Vector3 } from 'three'

export type Fit = {
  /** Axis whose measured size should match `size` (the model scales uniformly). */
  axis: 'x' | 'y' | 'z'
  /** Target size in metres along that axis. */
  size: number
}

type PropProps = Omit<ThreeElements['group'], 'children'> & {
  url: string
  fit: Fit
}

/** A GLB model scaled to a real-world size, centred on x/z and resting on y = 0 of its group. */
export function Prop({ url, fit, ...groupProps }: PropProps) {
  const { scene } = useGLTF(url)

  const { object, scale, offset } = useMemo(() => {
    const object = scene.clone(true)
    object.updateWorldMatrix(true, true)
    const box = new Box3().setFromObject(object)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    return {
      object,
      scale: fit.size / size[fit.axis],
      offset: [-center.x, -box.min.y, -center.z] as [number, number, number],
    }
  }, [scene, fit.axis, fit.size])

  return (
    <group {...groupProps}>
      <group scale={scale}>
        <primitive object={object} position={offset} />
      </group>
    </group>
  )
}
