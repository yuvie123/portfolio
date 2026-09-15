import { useEffect, useState } from 'react'

const LINES = [
  'YR-BIOS v2.6   (c) 2026 Yuvraj Randhawa',
  '',
  'CPU ........................ Waterloo CS',
  'Memory test ................ 640K OK',
  'Loading inventory-api.sys .. OK',
  'Loading balance-track.drv .. OK',
  'Loading portfolio.exe ...... OK',
  '',
  'Starting YR-OS...',
]
const LINE_DELAY_MS = 170
const HOLD_MS = 450

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const timeout =
      shown < LINES.length ? setTimeout(() => setShown((count) => count + 1), LINE_DELAY_MS) : setTimeout(onDone, HOLD_MS)
    return () => clearTimeout(timeout)
  }, [shown, onDone])

  useEffect(() => {
    function skip(event: KeyboardEvent) {
      if (event.key !== 'Escape') onDone()
    }
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [onDone])

  return (
    <div role="status" onPointerDown={onDone} className="absolute inset-0 z-40 bg-black p-16 font-display text-4xl leading-snug text-accent">
      {LINES.slice(0, shown).map((line, index) => (
        <p key={index} className="min-h-[1.375em] whitespace-pre">
          {line}
        </p>
      ))}
      <p className="animate-pulse">_</p>
      <p className="absolute bottom-12 left-16 text-2xl text-accent/60">Click or press any key to skip</p>
    </div>
  )
}
