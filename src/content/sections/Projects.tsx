import { Chips } from '../../components/Chips'
import { DateRange } from '../../components/DateRange'
import { resume } from '../resume'
import { ProjectCaseStudy } from './ProjectCaseStudy'
import { Section, type SectionOptions } from './Section'

export function Projects(options: SectionOptions) {
  const idPrefix = options.idPrefix ?? ''

  return (
    <Section id="projects" title="Projects" {...options}>
      <ul className="space-y-10">
        {resume.projects.map((project) => {
          const titleId = `${idPrefix}project-${project.slug}`
          return (
            <li key={project.slug}>
              <article aria-labelledby={titleId} className="rounded-md border border-line bg-panel p-6">
                <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 id={titleId} className="text-lg font-semibold text-fg">
                    {project.name}
                  </h3>
                  <p className="font-mono text-xs tracking-wider text-muted uppercase">
                    <DateRange start={project.start} end={project.end} />
                  </p>
                </header>
                <p className="mt-2 text-muted">{project.tagline}</p>

                <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex flex-col-reverse rounded-sm border border-line px-3 py-2"
                    >
                      <dt className="text-xs leading-snug text-muted">{metric.label}</dt>
                      <dd className="font-display text-3xl leading-none text-accent">{metric.value}</dd>
                    </div>
                  ))}
                </dl>

                <Chips items={project.tech} label={`Technologies used in ${project.name}`} className="mt-5" />

                <details className="group mt-6 border-t border-line pt-4">
                  <summary className="w-fit cursor-pointer list-none font-mono text-sm text-accent hover:underline [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">Read the case study ▸</span>
                    <span className="hidden group-open:inline">Hide case study ▾</span>
                  </summary>
                  <div className="mt-5">
                    <ProjectCaseStudy project={project} />
                  </div>
                </details>
              </article>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
