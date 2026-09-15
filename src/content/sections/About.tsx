import { resume } from '../resume'
import { Section, type SectionOptions } from './Section'

export function About(options: SectionOptions) {
  return (
    <Section id="about" title="About" {...options}>
      <div className="max-w-prose space-y-4 leading-relaxed text-muted">
        {resume.profile.summary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Section>
  )
}
