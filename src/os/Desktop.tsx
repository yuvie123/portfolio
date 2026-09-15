import { APP_IDS, APPS } from './apps'
import { AppIcon } from './icons'
import { useOSStore } from './store'

export function Desktop() {
  const open = useOSStore((state) => state.open)

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,#0f2a17_0%,#06120a_75%)]">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute right-12 bottom-6 font-display text-[10rem] leading-none text-accent/10 select-none"
      >
        YR-OS
      </p>

      <ul aria-label="Desktop" className="relative grid w-fit gap-3 p-5">
        {APP_IDS.filter((id) => APPS[id].showOnDesktop).map((id) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => open(id)}
              className="group flex w-28 flex-col items-center gap-2 rounded-sm p-3 text-center transition-colors hover:bg-accent/15 focus-visible:bg-accent/15"
            >
              <AppIcon id={id} className="size-14 text-accent drop-shadow-[0_0_10px_rgb(126_231_135/0.45)]" />
              <span className="font-mono text-base text-fg group-hover:text-accent">{APPS[id].title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
