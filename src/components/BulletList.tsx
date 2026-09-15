export function BulletList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2 leading-relaxed ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-5 before:absolute before:top-[0.6em] before:left-0.5 before:size-1.5 before:rotate-45 before:border-t-2 before:border-r-2 before:border-accent before:content-['']"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
