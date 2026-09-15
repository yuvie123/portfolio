import type { MouseEvent } from 'react'
import { resume } from '../content/resume'
import { setMode } from '../lib/mode'
import { useSceneStore } from './store'

// HUD buttons live inside the scene wrapper, whose click enters the monitor; keep their clicks to themselves.
const own = (action: () => void) => (event: MouseEvent) => {
  event.stopPropagation()
  action()
}

export function Hud() {
  const view = useSceneStore((state) => state.view)
  const setView = useSceneStore((state) => state.setView)
  const lowPerf = useSceneStore((state) => state.lowPerf)
  const setLowPerf = useSceneStore((state) => state.setLowPerf)
  const { name, headline } = resume.profile
  const idle = view === 'idle'

  return (
    <>
      {!idle && (
        <button
          type="button"
          onClick={own(() => setView('idle'))}
          className="fixed top-4 left-4 z-30 rounded-sm border border-accent/40 bg-ink/80 px-3 py-2 font-mono text-xs tracking-wider text-accent uppercase backdrop-blur transition-colors hover:bg-accent hover:text-ink"
        >
          ← Back to desk
        </button>
      )}

      {lowPerf && (
        <div
          role="status"
          className="fixed top-16 right-4 z-30 flex max-w-xs items-start gap-3 rounded-sm border border-accent/40 bg-ink/90 p-3 font-mono text-xs text-muted backdrop-blur"
        >
          <p>
            Running slowly?{' '}
            <button type="button" onClick={own(() => setMode('2d'))} className="text-accent underline underline-offset-2">
              View the 2D site
            </button>
          </p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={own(() => setLowPerf(false))}
            className="leading-none text-muted hover:text-fg"
          >
            ×
          </button>
        </div>
      )}

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-wrap items-end justify-between gap-4 p-6 font-mono text-xs text-muted transition-opacity duration-500 ${
          idle ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div>
          <h1 className="font-display text-3xl leading-none text-fg">{name}</h1>
          <p className="mt-1">{headline}</p>
        </div>
        <p className="animate-pulse tracking-widest text-accent uppercase">Click or scroll to start</p>
      </div>
    </>
  )
}
