import { resume } from '../content/resume'
import { useSceneStore } from './store'

export function Hud() {
  const view = useSceneStore((state) => state.view)
  const setView = useSceneStore((state) => state.setView)
  const { name, headline } = resume.profile
  const idle = view === 'idle'

  return (
    <>
      {!idle && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setView('idle')
          }}
          className="fixed top-4 left-4 z-30 rounded-sm border border-accent/40 bg-ink/80 px-3 py-2 font-mono text-xs tracking-wider text-accent uppercase backdrop-blur transition-colors hover:bg-accent hover:text-ink"
        >
          ← Back to desk
        </button>
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
