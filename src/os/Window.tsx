import type { ReactNode, PointerEvent } from 'react'
import { APPS, DESKTOP, type AppId } from './apps'
import { AppIcon } from './icons'
import { useOSStore } from './store'
import { useDrag } from './useDrag'

type WindowButtonProps = {
  label: string
  onClick: () => void
  children: ReactNode
}

// Stop pointerdown so pressing a title-bar button doesn't start a drag (pointer capture would eat the click).
const stopDrag = (event: PointerEvent) => event.stopPropagation()

function WindowButton({ label, onClick, children }: WindowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onPointerDown={stopDrag}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-sm border-2 border-current font-display text-2xl leading-none transition-colors hover:bg-accent hover:text-ink"
    >
      {children}
    </button>
  )
}

export function Window({ id, children }: { id: AppId; children: ReactNode }) {
  const win = useOSStore((state) => state.windows[id])
  const focused = useOSStore((state) => state.focused === id)
  const focus = useOSStore((state) => state.focus)
  const close = useOSStore((state) => state.close)
  const minimize = useOSStore((state) => state.minimize)
  const toggleMaximize = useOSStore((state) => state.toggleMaximize)
  const move = useOSStore((state) => state.move)
  const resize = useOSStore((state) => state.resize)

  const titleDrag = useDrag(
    () => ({ x: win.x, y: win.y }),
    (x, y) => move(id, x, y),
  )
  const resizeDrag = useDrag(
    () => ({ x: win.w, y: win.h }),
    (w, h) => resize(id, w, h),
  )

  if (!win.open) return null

  const rect = win.maximized ? { x: 0, y: 0, w: DESKTOP.width, h: DESKTOP.height } : win
  const titleId = `os-window-${id}-title`

  return (
    <section
      role="dialog"
      aria-labelledby={titleId}
      hidden={win.minimized}
      data-window={id}
      onPointerDown={() => focus(id)}
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: win.z }}
      className={`os-window absolute flex flex-col overflow-hidden rounded-md border-2 bg-panel shadow-[0_16px_48px_rgb(0_0_0/0.6)] ${
        focused ? 'border-accent' : 'border-line'
      }`}
    >
      <header
        {...(win.maximized ? {} : titleDrag)}
        onDoubleClick={() => toggleMaximize(id)}
        className={`flex h-12 shrink-0 touch-none items-center gap-3 border-b-2 px-3 select-none ${
          focused ? 'border-accent bg-accent/15 text-accent' : 'border-line bg-ink text-muted'
        } ${win.maximized ? '' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <AppIcon id={id} className="size-6 shrink-0" />
        <h2 id={titleId} className="min-w-0 flex-1 truncate font-display text-3xl leading-none">
          {APPS[id].title}
        </h2>
        <WindowButton label="Minimize" onClick={() => minimize(id)}>
          _
        </WindowButton>
        <WindowButton label={win.maximized ? 'Restore' : 'Maximize'} onClick={() => toggleMaximize(id)}>
          {win.maximized ? '▫' : '□'}
        </WindowButton>
        <WindowButton label="Close" onClick={() => close(id)}>
          ×
        </WindowButton>
      </header>

      <div data-window-content className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-8 [zoom:1.15]">
        {children}
      </div>

      {!win.maximized && (
        <div
          aria-hidden="true"
          {...resizeDrag}
          className="absolute right-0 bottom-0 size-6 cursor-nwse-resize touch-none bg-[linear-gradient(135deg,transparent_50%,var(--color-accent)_50%)] opacity-60 hover:opacity-100"
        />
      )}
    </section>
  )
}
