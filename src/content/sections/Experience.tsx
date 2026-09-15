import { BulletList } from '../../components/BulletList'
import { Chips } from '../../components/Chips'
import { DateRange } from '../../components/DateRange'
import { resume } from '../resume'
import { Section, type SectionOptions } from './Section'

export function Experience(options: SectionOptions) {
  return (
    <Section id="experience" title="Experience" {...options}>
      <ol className="space-y-12">
        {resume.experience.map((job) => (
          <li key={job.id}>
            <article className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <p className="pt-1 font-mono text-xs tracking-wider text-muted uppercase">
                <DateRange start={job.start} end={job.end} />
              </p>
              <div>
                <h3 className="text-lg font-semibold text-fg">
                  {job.role} <span className="text-accent">· {job.company}</span>
                </h3>
                <p className="font-mono text-sm text-muted">{job.location}</p>
                <p className="mt-3 text-fg/90">{job.summary}</p>
                <BulletList items={job.bullets} className="mt-3 text-sm text-muted" />
                <Chips items={job.tech} label={`Technologies used at ${job.company}`} className="mt-4" />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  )
}
