import type { Metric } from '../content/types'

export function MetricList({ metrics, className = '' }: { metrics: Metric[]; className?: string }) {
  return (
    <dl className={`grid gap-3 sm:grid-cols-3 ${className}`}>
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col-reverse rounded-sm border border-line px-3 py-2">
          <dt className="text-xs leading-snug text-muted">{metric.label}</dt>
          <dd className="font-display text-3xl leading-none text-accent">{metric.value}</dd>
        </div>
      ))}
    </dl>
  )
}
