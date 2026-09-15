import { Contact } from '../../content/sections/Contact'

export function ContactApp() {
  return (
    <div>
      <p className="mb-4 font-display text-5xl leading-none text-fg">Say hello</p>
      <Contact idPrefix="os-" showHeading={false} />
    </div>
  )
}
