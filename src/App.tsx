import { lazy, Suspense } from 'react'
import { ModeToggle } from './components/ModeToggle'
import { SkipLink } from './components/SkipLink'
import { FallbackSite } from './fallback/FallbackSite'
import { useMode } from './lib/mode'

const Experience3D = lazy(() => import('./scene/Experience3D'))

export default function App() {
  const is3d = useMode() === '3d'

  return (
    <>
      {!is3d && <SkipLink />}
      <ModeToggle />

      {/* The 2D site stays in the DOM in 3D mode (for crawlers), hidden and inert. */}
      <div id="site" inert={is3d}>
        <FallbackSite />
      </div>

      {is3d && (
        <Suspense fallback={null}>
          <Experience3D />
        </Suspense>
      )}
    </>
  )
}
