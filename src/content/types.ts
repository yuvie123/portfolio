/** Dates are "YYYY-MM" strings; `end: null` means ongoing. */
export type YearMonth = `${number}-${string}`

export type Profile = {
  name: string
  initials: string
  headline: string
  location: string
  email: string
  links: {
    linkedin: string
    github: string
  }
  summary: string[]
  /** Path under /public, or null until a phone-free export is provided. */
  resumePdf: string | null
}

export type Course = {
  code: string
  name: string
}

export type Education = {
  school: string
  degree: string
  location: string
  start: YearMonth
  end: YearMonth | null
  courses: Course[]
}

export type Job = {
  id: string
  role: string
  company: string
  location: string
  start: YearMonth
  end: YearMonth | null
  summary: string
  bullets: string[]
  tech: string[]
}

export type Metric = {
  value: string
  label: string
}

export type CaseStudy = {
  problem: string
  approach: string[]
  results: string[]
}

export type Project = {
  slug: string
  name: string
  tagline: string
  start: YearMonth
  end: YearMonth | null
  tech: string[]
  metrics: Metric[]
  caseStudy: CaseStudy
}

export type SkillGroup = {
  label: string
  items: string[]
}

export type Resume = {
  profile: Profile
  education: Education[]
  experience: Job[]
  projects: Project[]
  skills: SkillGroup[]
}
