import { useEffect, useState } from 'react'

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

export function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <time dateTime={now.toISOString()} className="px-3 font-mono text-lg text-fg">
      {timeFormat.format(now)}
    </time>
  )
}
