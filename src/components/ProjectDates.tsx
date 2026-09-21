import type { ProjectDates as ProjectDatesValue } from '../content/types'
import { DateRange } from './DateRange'

export function ProjectDates({ dates }: { dates: ProjectDatesValue }) {
  if ('label' in dates) return <>{dates.label}</>
  return <DateRange start={dates.start} end={dates.end} />
}
