// Captures public/og.png (1200x630 social preview) from the 3D desk using a local Chrome.
// Usage: `npm run build && npx vite preview --port 4173` in one terminal, then `npm run og`.
// Override the browser with CHROME_PATH and the page with OG_URL.
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PAGE_URL = process.env.OG_URL ?? 'http://localhost:4173/?mode=3d'
const PORT = 9334
const WIDTH = 1200
const HEIGHT = 630

const root = fileURLToPath(new URL('..', import.meta.url))
const output = join(root, 'public/og.png')
const profile = mkdtempSync(join(tmpdir(), 'og-chrome-'))

const flags = [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  '--enable-gpu',
  '--ignore-gpu-blocklist',
  ...(process.platform === 'darwin' ? ['--use-angle=metal'] : []),
  'about:blank',
]
const chrome = spawn(CHROME, flags, { stdio: 'ignore' })

async function connect() {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const page = targets.find((target) => target.type === 'page')
      if (page) return new WebSocket(page.webSocketDebuggerUrl)
    } catch {
      // Chrome is still starting.
    }
    await delay(100)
  }
  throw new Error(`Could not start Chrome at ${CHROME}`)
}

try {
  const ws = await connect()
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  let nextId = 0
  const pending = new Map()
  let onLoad = null
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data)
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data)
      pending.delete(data.id)
    } else if (data.method === 'Page.loadEventFired') {
      onLoad?.()
    }
  }
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId
      pending.set(id, (data) => (data.error ? reject(new Error(data.error.message)) : resolve(data.result)))
      ws.send(JSON.stringify({ id, method, params }))
    })
  const evaluate = async (expression) =>
    (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value

  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false })
  const loaded = new Promise((resolve) => (onLoad = resolve))
  await send('Page.navigate', { url: PAGE_URL })
  await loaded

  // Wait for the scene to mount and every model to finish loading.
  for (let attempt = 0; attempt < 150; attempt++) {
    const ready = await evaluate(
      `document.documentElement.dataset.scene === 'mounted' && ![...document.querySelectorAll('[role=status]')].some((el) => el.textContent.includes('LOADING'))`,
    )
    if (ready) break
    await delay(100)
  }
  await delay(3000)

  // Keep the name in the preview, but hide controls that make no sense in a still image.
  await evaluate(`(() => {
    for (const el of document.querySelectorAll('p, button')) {
      if (/Click or scroll to start|Skip 3D/i.test(el.textContent)) el.style.visibility = 'hidden'
    }
  })()`)
  await delay(300)

  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(output, Buffer.from(data, 'base64'))
  console.log(`Saved ${output} (${WIDTH}x${HEIGHT})`)
  ws.close()
} finally {
  chrome.kill()
  // Chrome keeps writing to its profile for a moment after being killed.
  await Promise.race([new Promise((resolve) => chrome.once('exit', resolve)), delay(3000)])
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
