import type { AppId } from './apps'

// 16x16 pixel-art glyphs; inner shapes punch holes via the even-odd fill rule.
const PATHS: Record<AppId, string> = {
  about: 'M6 1h4v4H6z M3 7h10v8H3z',
  experience: 'M5 2h6v3H5z M6 3h4v2H6z M1 5h14v9H1z M1 8h14v1H1z',
  projects: 'M1 3h5v1h9v10H1z M2 6h12v1H2z',
  resume: 'M3 1h7l3 3v11H3z M5 7h6v1H5z M5 9h6v1H5z M5 11h4v1H5z',
  contact: 'M1 3h14v10H1z M2 4h12v8H2z M3 5h2v1H3z M5 6h2v1H5z M7 7h2v1H7z M9 6h2v1H9z M11 5h2v1h-2z',
  terminal: 'M1 2h14v12H1z M2 4h12v9H2z M4 6h1v1H4z M5 7h1v1H5z M4 8h1v1H4z M7 9h4v1H7z',
}

export function AppIcon({ id, className }: { id: AppId; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      <path fillRule="evenodd" d={PATHS[id]} />
    </svg>
  )
}
