import { resume } from '../content/resume'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line pt-8 pb-16 font-mono text-xs leading-relaxed text-muted">
      <p>
        Designed and built by {resume.profile.name}. Made with React, Three.js and Tailwind CSS, hosted on Vercel.
      </p>
    </footer>
  )
}
