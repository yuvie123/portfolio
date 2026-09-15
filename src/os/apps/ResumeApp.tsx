import { resume } from '../../content/resume'
import { Education } from '../../content/sections/Education'
import { Experience } from '../../content/sections/Experience'
import { Projects } from '../../content/sections/Projects'
import { Skills } from '../../content/sections/Skills'

const buttonClass =
  'rounded-sm bg-accent px-4 py-2 font-mono text-sm font-semibold text-ink transition-opacity hover:opacity-90'

export function ResumeApp() {
  const { email, resumePdf } = resume.profile

  return (
    <div>
      <div className="sticky -top-8 z-10 -mx-8 -mt-8 mb-10 flex items-center justify-between gap-4 border-b-2 border-line bg-panel px-8 py-4">
        <p className="font-mono text-sm text-muted">resume.txt</p>
        {resumePdf ? (
          <a href={resumePdf} download className={buttonClass}>
            Download PDF
          </a>
        ) : (
          <a href={`mailto:${email}?subject=Resume%20request`} className={buttonClass}>
            Request PDF by email
          </a>
        )}
      </div>
      <div className="space-y-20">
        <Experience idPrefix="resume-" />
        <Projects idPrefix="resume-" />
        <Education idPrefix="resume-" />
        <Skills idPrefix="resume-" />
      </div>
    </div>
  )
}
