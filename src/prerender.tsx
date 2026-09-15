import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * Server entry, built with `vite build --ssr` and run by scripts/prerender.mjs.
 * Returns the app's HTML so crawlers and link previews see the full page without JavaScript.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
