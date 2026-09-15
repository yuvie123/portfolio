// Injects the server-rendered app into dist/index.html, then removes the temporary SSR build.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const indexPath = `${root}dist/index.html`
const ssrDir = `${root}dist-ssr`
const marker = '<div id="root"></div>'

const { render } = await import(pathToFileURL(`${ssrDir}/prerender.js`).href)
const template = await readFile(indexPath, 'utf-8')

if (!template.includes(marker)) {
  throw new Error(`Could not find ${marker} in dist/index.html`)
}

// A replacer function avoids "$&"-style patterns in the HTML being interpreted.
await writeFile(indexPath, template.replace(marker, () => `<div id="root">${render()}</div>`))
await rm(ssrDir, { recursive: true, force: true })

console.log('Prerendered dist/index.html')
