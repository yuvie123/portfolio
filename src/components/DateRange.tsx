import type { YearMonth } from '../content/types'
import { formatYearMonth } from '../lib/format'

export function DateRange({ start, end }: { start: YearMonth; end: YearMonth | null }) {
  return (
    <>
      <time dateTime={start}>{formatYearMonth(start)}</time>
      {' – '}
      {end ? <time dateTime={end}>{formatYearMonth(end)}</time> : 'Present'}
    </>
  )
}
