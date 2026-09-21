import { useState } from 'react'
import { Chips } from '../../components/Chips'
import { ProjectDates } from '../../components/ProjectDates'
import { MetricList } from '../../components/MetricList'
import { resume } from '../../content/resume'
import { ProjectCaseStudy } from '../../content/sections/ProjectCaseStudy'

export function ProjectsApp() {
  const [slug, setSlug] = useState<string | null>(null)
  const project = resume.projects.find((item) => item.slug === slug)

  if (project) {
    return (
      <article aria-labelledby="os-project-title">
        <button
          type="button"
          onClick={() => setSlug(null)}
          className="mb-6 font-mono text-sm text-accent hover:underline"
        >
          ← All projects
        </button>
        <h3 id="os-project-title" className="font-display text-5xl leading-none text-fg">
          {project.name}
        </h3>
        <p className="mt-2 font-mono text-xs tracking-wider text-muted uppercase">
          <ProjectDates dates={project.dates} />
        </p>
        <p className="mt-4 text-muted">{project.tagline}</p>
        <MetricList metrics={project.metrics} className="mt-6" />
        <Chips items={project.tech} label={`Technologies used in ${project.name}`} className="mt-6" />
        <div className="mt-10">
          <ProjectCaseStudy project={project} />
        </div>
      </article>
    )
  }

  return (
    <ul className="grid gap-6">
      {resume.projects.map((item) => (
        <li key={item.slug}>
          <div
            onClick={() => setSlug(item.slug)}
            className="group cursor-pointer rounded-md border-2 border-line bg-ink/40 p-6 transition-colors hover:border-accent"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-xl font-semibold text-fg">{item.name}</h3>
              <p className="font-mono text-xs tracking-wider text-muted uppercase">
                <ProjectDates dates={item.dates} />
              </p>
            </div>
            <p className="mt-2 text-muted">{item.tagline}</p>
            <Chips items={item.tech} className="mt-4" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setSlug(item.slug)
              }}
              className="mt-5 font-mono text-sm text-accent group-hover:underline"
            >
              Open case study →
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
