import { useEffect, useRef } from 'react'
import { resume } from '../content/resume'
import { setMode } from '../lib/mode'
import { APP_IDS, APPS } from './apps'
import { AppIcon } from './icons'
import { useOSStore } from './store'

type StartMenuProps = {
  onClose: () => void
  onShutdown?: () => void
}

const itemClass =
  'group flex w-full items-center gap-3 px-4 py-3 text-left text-lg text-fg transition-colors hover:bg-accent hover:text-ink focus-visible:bg-accent focus-visible:text-ink'

export function StartMenu({ onClose, onShutdown }: StartMenuProps) {
  const open = useOSStore((state) => state.open)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Element
      if (menuRef.current?.contains(target) || target.closest('[data-start-button]')) return
      onClose()
    }
    // Capture phase so Escape closes the menu without also leaving the monitor.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onClose()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Start"
      className="absolute bottom-16 left-3 w-80 overflow-hidden rounded-sm border-2 border-accent bg-panel shadow-[0_16px_48px_rgb(0_0_0/0.6)]"
    >
      <p className="border-b-2 border-line bg-accent/10 px-4 py-3 font-display text-3xl leading-none text-accent">
        {resume.profile.name}
      </p>
      {APP_IDS.map((id) => (
        <button
          key={id}
          type="button"
          role="menuitem"
          onClick={() => {
            open(id)
            onClose()
          }}
          className={itemClass}
        >
          <AppIcon id={id} className="size-6 text-accent group-hover:text-ink group-focus-visible:text-ink" />
          {APPS[id].title}
        </button>
      ))}
      <div className="h-0.5 bg-line" />
      <button type="button" role="menuitem" onClick={() => setMode('2d')} className={itemClass}>
        View the 2D site
      </button>
      {onShutdown && (
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            onClose()
            onShutdown()
          }}
          className={itemClass}
        >
          Shut down
        </button>
      )}
    </div>
  )
}
