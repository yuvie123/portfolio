import { CREDITS } from '../../scene/models/credits'

export function CreditsApp() {
  return (
    <div className="space-y-6">
      <p className="text-muted">Assets used in the 3D desk scene.</p>
      <ul className="space-y-4">
        {CREDITS.map((credit) => (
          <li key={credit.asset} className="rounded-md border-2 border-line p-5">
            <p className="font-semibold text-fg">{credit.asset}</p>
            <p className="mt-1 font-mono text-sm text-muted">
              {credit.author} · {credit.license}
            </p>
            {credit.source && (
              <a
                href={credit.source}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-mono text-sm text-accent hover:underline"
              >
                {credit.source.replace(/^https:\/\//, '')} ↗
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="font-mono text-sm text-muted">Fonts: IBM Plex Sans, IBM Plex Mono and VT323 (SIL Open Font License).</p>
    </div>
  )
}
