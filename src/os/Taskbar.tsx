import { useCallback, useState } from 'react'
import { APP_IDS, APPS, TASKBAR_HEIGHT } from './apps'
import { Clock } from './Clock'
import { AppIcon, SpeakerIcon } from './icons'
import { playSound, setSoundEnabled, useSoundEnabled } from './sound'
import { StartMenu } from './StartMenu'
import { useOSStore } from './store'

export function Taskbar({ onShutdown }: { onShutdown?: () => void }) {
  const windows = useOSStore((state) => state.windows)
  const focused = useOSStore((state) => state.focused)
  const focus = useOSStore((state) => state.focus)
  const minimize = useOSStore((state) => state.minimize)
  const soundOn = useSoundEnabled()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const openIds = APP_IDS.filter((id) => windows[id].open)

  return (
    <div
      style={{ height: TASKBAR_HEIGHT }}
      className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 border-t-2 border-line bg-ink/95 px-3"
    >
      <button
        type="button"
        data-start-button
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => {
          playSound('click')
          setMenuOpen((isOpen) => !isOpen)
        }}
        className={`flex h-10 items-center gap-2 rounded-sm border-2 px-3 font-display text-3xl leading-none transition-colors ${
          menuOpen ? 'border-accent bg-accent text-ink' : 'border-accent/60 text-accent hover:bg-accent/15'
        }`}
      >
        <span className="grid size-7 place-items-center bg-accent font-display text-lg leading-none text-ink">YR</span>
        Start
      </button>

      <div className="mx-1 h-8 w-0.5 bg-line" />

      <ul aria-label="Open windows" className="flex min-w-0 flex-1 gap-2">
        {openIds.map((id) => {
          const active = focused === id && !windows[id].minimized
          return (
            <li key={id} className="min-w-0">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => (active ? minimize(id) : focus(id))}
                className={`flex h-10 max-w-52 min-w-0 items-center gap-2 rounded-sm border-2 px-3 text-base transition-colors ${
                  active ? 'border-accent bg-accent/15 text-fg' : 'border-line text-muted hover:text-fg'
                }`}
              >
                <AppIcon id={id} className="size-5 shrink-0 text-accent" />
                <span className="truncate">{APPS[id].title}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Mute sounds' : 'Turn sounds on'}
        title={soundOn ? 'Mute sounds' : 'Turn sounds on'}
        onClick={() => {
          setSoundEnabled(!soundOn)
          if (!soundOn) playSound('click')
        }}
        className={`grid size-10 place-items-center rounded-sm border-2 transition-colors ${
          soundOn ? 'border-accent/60 text-accent' : 'border-line text-muted hover:text-fg'
        }`}
      >
        <SpeakerIcon on={soundOn} className="size-6" />
      </button>

      <Clock />

      {menuOpen && <StartMenu onClose={closeMenu} onShutdown={onShutdown} />}
    </div>
  )
}
