import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useSceneStore } from './store'

// EffectComposer switches the renderer's own tone mapping off, so ToneMapping must stay the last effect
// in both branches or the scene's colours shift.
export function Effects() {
  const fx = useSceneStore((state) => state.fx)

  if (!fx) {
    return (
      <EffectComposer multisampling={0}>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    )
  }

  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.7} radius={0.7} />
      <Vignette offset={0.3} darkness={0.6} />
      <Noise opacity={0.025} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
