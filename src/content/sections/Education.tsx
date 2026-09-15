import { DateRange } from '../../components/DateRange'
import { resume } from '../resume'
import { Section, type SectionOptions } from './Section'

export function Education(options: SectionOptions) {
  return (
    <Section id="education" title="Education" {...options}>
      <ol className="space-y-12">
        {resume.education.map((entry) => (
          <li key={entry.school}>
            <article className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <p className="pt-1 font-mono text-xs tracking-wider text-muted uppercase">
                <DateRange start={entry.start} end={entry.end} />
              </p>
              <div>
                <h3 className="text-lg font-semibold text-fg">{entry.degree}</h3>
                <p className="text-accent">{entry.school}</p>
                <p className="font-mono text-sm text-muted">{entry.location}</p>

                <h4 className="mt-5 mb-2 font-mono text-xs tracking-wider text-muted uppercase">
                  Relevant coursework
                </h4>
                <ul className="flex flex-wrap gap-2">
                  {entry.courses.map((course) => (
                    <li key={course.code} className="rounded-sm border border-line px-2 py-1 text-xs">
                      <span className="font-mono text-fg">{course.code}</span>{' '}
                      <span className="text-muted">{course.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  )
}
