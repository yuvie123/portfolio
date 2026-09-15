import { BulletList } from '../../components/BulletList'
import type { Project } from '../types'

const labelClass = 'mb-2 font-mono text-xs tracking-wider text-accent uppercase'

export function ProjectCaseStudy({ project }: { project: Project }) {
  const { problem, approach, results } = project.caseStudy

  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <div>
        <h4 className={labelClass}>Problem</h4>
        <p className="text-muted">{problem}</p>
      </div>
      <div>
        <h4 className={labelClass}>Approach</h4>
        <BulletList items={approach} className="text-muted" />
      </div>
      <div>
        <h4 className={labelClass}>Results</h4>
        <BulletList items={results} className="text-muted" />
      </div>
    </div>
  )
}
