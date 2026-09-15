export function BulletList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2 leading-relaxed ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-5 before:absolute before:left-0 before:font-mono before:text-accent before:content-['▹']"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
