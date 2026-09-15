import { Chips } from '../../components/Chips'
import { resume } from '../resume'
import { Section, type SectionOptions } from './Section'

export function Skills(options: SectionOptions) {
  return (
    <Section id="skills" title="Skills" {...options}>
      <dl className="grid gap-8 sm:grid-cols-2">
        {resume.skills.map((group) => (
          <div key={group.label}>
            <dt className="mb-3 font-mono text-xs tracking-wider text-muted uppercase">{group.label}</dt>
            <dd>
              <Chips items={group.items} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
