import { useCallback, useState } from 'react'
import { readSessionFlag, writeSessionFlag } from '../lib/prefs'
import { APP_IDS } from './apps'
import { AboutApp } from './apps/AboutApp'
import { ContactApp } from './apps/ContactApp'
import { CreditsApp } from './apps/CreditsApp'
import { ExperienceApp } from './apps/ExperienceApp'
import { ProjectsApp } from './apps/ProjectsApp'
import { ResumeApp } from './apps/ResumeApp'
import { TerminalApp } from './apps/TerminalApp'
import { BootSequence } from './BootSequence'
import { Desktop } from './Desktop'
import { useOSStore } from './store'
import { Taskbar } from './Taskbar'
import { Window } from './Window'

const BOOTED_KEY = 'yr-booted'

const APP_COMPONENTS = {
  about: AboutApp,
  experience: ExperienceApp,
  projects: ProjectsApp,
  resume: ResumeApp,
  contact: ContactApp,
  terminal: TerminalApp,
  credits: CreditsApp,
}

type OSProps = {
  /** Whether the visitor can interact (the camera has arrived at the screen). */
  active: boolean
  onShutdown?: () => void
}

export function OS({ active, onShutdown }: OSProps) {
  const [booted, setBooted] = useState(() => readSessionFlag(BOOTED_KEY))
  const open = useOSStore((state) => state.open)

  const finishBoot = useCallback(() => {
    writeSessionFlag(BOOTED_KEY)
    setBooted(true)
    open('about')
  }, [open])

  if (!booted) {
    return active ? <BootSequence onDone={finishBoot} /> : <LockScreen />
  }

  return (
    <>
      <div className="absolute inset-0 isolate">
        <Desktop />
        {APP_IDS.map((id) => {
          const App = APP_COMPONENTS[id]
          return (
            <Window key={id} id={id}>
              <App />
            </Window>
          )
        })}
      </div>
      <Taskbar onShutdown={onShutdown} />
    </>
  )
}

function LockScreen() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#0f2a17_0%,#06120a_75%)]">
      <div className="text-center">
        <p className="font-display text-[11rem] leading-none text-accent [text-shadow:0_0_32px_rgb(126_231_135/0.55)]">YR-OS</p>
        <p className="mt-6 animate-pulse font-display text-5xl text-accent/80">Click to start</p>
      </div>
    </div>
  )
}
