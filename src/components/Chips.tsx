type ChipsProps = {
  items: string[]
  label?: string
  className?: string
}

export function Chips({ items, label, className = '' }: ChipsProps) {
  if (items.length === 0) return null

  return (
    <ul aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-sm border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
