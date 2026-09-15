import { setMode, useModeInfo } from '../lib/mode'

export function ModeToggle() {
  const info = useModeInfo()
  if (!info?.webgl) return null

  const is3d = info.mode === '3d'
  const label = is3d ? 'Skip 3D' : info.auto === '3d' ? 'View in 3D' : 'Try 3D anyway'

  return (
    <button
      type="button"
      onClick={() => setMode(is3d ? '2d' : '3d')}
      className="fixed top-4 right-4 z-[60] rounded-sm border border-accent/40 bg-ink/80 px-3 py-2 font-mono text-xs tracking-wider text-accent uppercase backdrop-blur transition-colors hover:bg-accent hover:text-ink"
    >
      {label}
    </button>
  )
}
