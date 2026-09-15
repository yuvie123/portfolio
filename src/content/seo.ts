import { resume } from './resume.ts'

/** Canonical site URL. Update here, in public/robots.txt, and in public/sitemap.xml if a custom domain is added. */
export const SITE_URL = 'https://yuvraj-randhawa.vercel.app'

const { profile } = resume

export const seo = {
  title: `${profile.name} | Software Engineer, Waterloo CS`,
  description: `${profile.name} is a Computer Science student at the University of Waterloo who builds backend APIs, embedded hardware, and machine learning projects.`,
  url: `${SITE_URL}/`,
  themeColor: '#0a0c0f',
}

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: `${SITE_URL}/`,
  email: `mailto:${profile.email}`,
  jobTitle: 'Computer Science Student',
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Waterloo',
  },
  sameAs: [profile.links.linkedin, profile.links.github],
}
