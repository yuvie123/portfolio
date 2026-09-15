import { resume } from '../../content/resume'
import { About } from '../../content/sections/About'
import { Education } from '../../content/sections/Education'
import { Skills } from '../../content/sections/Skills'

export function AboutApp() {
  const { name, initials, headline, location } = resume.profile

  return (
    <div className="space-y-14">
      <header className="flex items-center gap-6">
        <div
          aria-hidden="true"
          className="grid size-20 shrink-0 place-items-center rounded-sm border-2 border-accent bg-accent/10 font-display text-5xl text-accent"
        >
          {initials}
        </div>
        <div>
          <p className="font-display text-5xl leading-none text-fg">{name}</p>
          <p className="mt-2 text-accent">{headline}</p>
          <p className="font-mono text-sm text-muted">{location}</p>
        </div>
      </header>
      <About idPrefix="os-" showHeading={false} />
      <Education idPrefix="os-" />
      <Skills idPrefix="os-" />
    </div>
  )
}
