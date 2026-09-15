import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { setMode } from '../lib/mode'

const SLOW_AFTER_MS = 15_000

export function Loader() {
  const { active, progress } = useProgress()
  const [visible, setVisible] = useState(true)
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setSlow(true), SLOW_AFTER_MS)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (active) return
    const timeout = setTimeout(() => setVisible(false), 400)
    return () => clearTimeout(timeout)
  }, [active])

  if (!visible) return null

  return (
    <div
      role="status"
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-ink transition-opacity duration-300 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <p className="font-display text-3xl tracking-widest text-accent">LOADING {Math.round(progress)}%</p>
      {slow && active && (
        <button
          type="button"
          onClick={() => setMode('2d')}
          className="rounded-sm border border-line px-4 py-2 font-mono text-sm text-muted hover:border-accent hover:text-accent"
        >
          Taking a while? Continue in 2D
        </button>
      )}
    </div>
  )
}
