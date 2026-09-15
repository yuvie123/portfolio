import type { ReactNode } from 'react'

export type SectionOptions = {
  /** Hide the visible heading (it stays available to screen readers), e.g. inside an OS window. */
  showHeading?: boolean
  /** Prefix for element ids so the same section can render twice on a page without clashes. */
  idPrefix?: string
}

type SectionProps = SectionOptions & {
  id: string
  title: string
  children: ReactNode
}

export function Section({ id, title, showHeading = true, idPrefix = '', children }: SectionProps) {
  const sectionId = `${idPrefix}${id}`
  const headingId = `${sectionId}-heading`

  return (
    <section id={sectionId} aria-labelledby={headingId} className="scroll-mt-16">
      <h2
        id={headingId}
        className={
          showHeading
            ? 'mb-8 flex items-center gap-3 font-display text-3xl tracking-wide text-fg uppercase'
            : 'sr-only'
        }
      >
        {showHeading && (
          <span aria-hidden="true" className="text-accent">
            &gt;
          </span>
        )}
        {title}
      </h2>
      {children}
    </section>
  )
}
