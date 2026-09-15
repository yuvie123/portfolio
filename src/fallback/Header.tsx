import { SocialLinks } from '../components/SocialLinks'
import { resume } from '../content/resume'
import { useActiveSection } from '../lib/useActiveSection'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]
const NAV_IDS = NAV.map((item) => item.id)

export function Header() {
  const active = useActiveSection(NAV_IDS)
  const { name, initials, headline } = resume.profile

  return (
    <header className="pt-16 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-5/12 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <div
          aria-hidden="true"
          className="grid size-16 place-items-center rounded-sm border-2 border-accent bg-accent/10 font-display text-4xl text-accent shadow-[0_0_28px_-6px] shadow-accent/60"
        >
          {initials}
        </div>
        <h1 className="mt-6 font-display text-5xl leading-none text-fg sm:text-6xl">{name}</h1>
        <p className="mt-3 text-lg text-accent">{headline}</p>
        <p className="mt-4 max-w-xs leading-relaxed text-muted">
          Backend APIs, embedded hardware, and the occasional neural network.
        </p>

        <nav aria-label="Sections" className="mt-16 hidden lg:block">
          <ul className="space-y-3">
            {NAV.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex w-fit items-center gap-4 py-1 font-mono text-xs tracking-widest uppercase"
                  >
                    <span
                      className={`h-px transition-all ${
                        isActive ? 'w-16 bg-accent' : 'w-8 bg-muted group-hover:w-16 group-hover:bg-fg'
                      }`}
                    />
                    <span className={isActive ? 'text-fg' : 'text-muted group-hover:text-fg'}>{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <SocialLinks className="mt-8" />
    </header>
  )
}
