import { CopyEmailButton } from '../../components/CopyEmailButton'
import { resume } from '../resume'
import { Section, type SectionOptions } from './Section'

const linkClass = 'text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent'

export function Contact(options: SectionOptions) {
  const { email, links, resumePdf } = resume.profile

  return (
    <Section id="contact" title="Contact" {...options}>
      <p className="max-w-prose leading-relaxed text-muted">
        Want to work together, or have a question about something here? Email is the fastest way to reach me.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${email}`}
          className="rounded-sm bg-accent px-4 py-2 font-mono text-sm font-semibold text-ink transition-opacity hover:opacity-90"
        >
          {email}
        </a>
        <CopyEmailButton email={email} />
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
        <li>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className={linkClass}>
            LinkedIn ↗
          </a>
        </li>
        <li>
          <a href={links.github} target="_blank" rel="noreferrer" className={linkClass}>
            GitHub ↗
          </a>
        </li>
        <li>
          {resumePdf ? (
            <a href={resumePdf} download className={linkClass}>
              Resume (PDF) ↓
            </a>
          ) : (
            <a href={`mailto:${email}?subject=Resume%20request`} className={linkClass}>
              Request my resume (PDF)
            </a>
          )}
        </li>
      </ul>
    </Section>
  )
}
