import { useEffect, useRef, useState, type FormEvent } from 'react'
import { resume } from '../../content/resume'
import { setMode } from '../../lib/mode'
import { APP_IDS, isAppId } from '../apps'
import { useOSStore } from '../store'

type Line = { id: number; kind: 'input' | 'output'; text: string }

const HELP = [
  'help          show this list',
  'whoami        who built this',
  'ls            list apps',
  'open <app>    open an app, e.g. open projects',
  'contact       how to reach me',
  '2d            switch to the 2D site',
  'clear         clear the screen',
]

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([{ id: 0, kind: 'output', text: "YR-OS terminal. Type 'help' to see commands." }])
  const [value, setValue] = useState('')
  const nextId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const open = useOSStore((state) => state.open)

  // Keep the newest line in view.
  useEffect(() => {
    const scroller = endRef.current?.closest('[data-window-content]')
    if (scroller) scroller.scrollTop = scroller.scrollHeight
  }, [lines])

  function run(raw: string): string[] | null {
    const [command = '', ...args] = raw.trim().split(/\s+/)
    const { name, headline, email, links } = resume.profile

    switch (command.toLowerCase()) {
      case '':
        return []
      case 'help':
        return HELP
      case 'whoami':
        return [name, headline]
      case 'ls':
        return [APP_IDS.join('  ')]
      case 'open': {
        const target = args[0]?.toLowerCase() ?? ''
        if (!isAppId(target)) return [`usage: open <${APP_IDS.join('|')}>`]
        open(target)
        return [`opening ${target}...`]
      }
      case 'contact':
        return [email, links.linkedin, links.github]
      case '2d':
        setMode('2d')
        return ['switching to 2D...']
      case 'sudo':
        return ['nice try.']
      case 'clear':
        return null
      default:
        return [`command not found: ${command}. Try 'help'.`]
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const output = run(value)
    setValue('')

    if (output === null) {
      setLines([])
      return
    }
    const next: Line[] = [{ id: nextId.current++, kind: 'input', text: value }]
    for (const text of output) next.push({ id: nextId.current++, kind: 'output', text })
    setLines((previous) => [...previous, ...next])
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="-m-8 min-h-[calc(100%+4rem)] bg-black p-6 font-mono text-base leading-relaxed text-accent"
    >
      {lines.map((line) => (
        <p key={line.id} className={`whitespace-pre-wrap ${line.kind === 'input' ? 'text-fg' : ''}`}>
          {line.kind === 'input' ? `$ ${line.text}` : line.text}
        </p>
      ))}
      <form onSubmit={submit} className="flex gap-2">
        <span aria-hidden="true" className="text-fg">
          $
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Terminal command"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none"
        />
      </form>
      <div ref={endRef} />
    </div>
  )
}
