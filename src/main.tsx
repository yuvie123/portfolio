import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/vt323/latin-400.css'
import App from './App.tsx'
import { getInitialMode } from './lib/mode.ts'
import './index.css'

// Start downloading the 3D chunk right away instead of waiting for hydration to reach it.
if (getInitialMode() === '3d') {
  void import('./scene/Experience3D.tsx')
}

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production builds ship prerendered HTML; the dev server starts with an empty #root.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
