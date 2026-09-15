import { resume } from '../content/resume'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'

export function SocialLinks({ className = '' }: { className?: string }) {
  const { email, links } = resume.profile
  const items = [
    { label: 'GitHub', href: links.github, Icon: GitHubIcon, external: true },
    { label: 'LinkedIn', href: links.linkedin, Icon: LinkedInIcon, external: true },
    { label: 'Email', href: `mailto:${email}`, Icon: MailIcon, external: false },
  ]

  return (
    <ul className={`flex items-center gap-5 ${className}`}>
      {items.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={external ? `${label} (opens in a new tab)` : label}
            {...(external && { target: '_blank', rel: 'noreferrer' })}
            className="block text-muted transition-colors hover:text-accent"
          >
            <Icon className="size-6" />
          </a>
        </li>
      ))}
    </ul>
  )
}
