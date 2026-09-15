// End-to-end checks for both versions of the site, using headless Chrome over the DevTools Protocol.
// Usage: `npm run build && npx vite preview --port 4173` in one terminal, then `npm run test:e2e`.
// Screenshots are saved to test-results/e2e. Override the browser with CHROME_PATH.
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = process.env.E2E_URL ?? 'http://localhost:4173'
const PORT = 9333
const outDir = process.argv[2] ?? fileURLToPath(new URL('../test-results/e2e', import.meta.url))
const profile = mkdtempSync(join(tmpdir(), 'e2e-chrome-'))
await mkdir(outDir, { recursive: true })

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--enable-gpu',
    '--ignore-gpu-blocklist',
    '--hide-scrollbars',
    ...(process.platform === 'darwin' ? ['--use-angle=metal'] : []),
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let failures = 0
const logs = []
const responses = []
const check = (label, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`)
}

async function getJson(path) {
  for (let i = 0; i < 100; i++) {
    try {
      return await (await fetch(`http://127.0.0.1:${PORT}${path}`)).json()
    } catch {
      await delay(100)
    }
  }
  throw new Error(`Could not start Chrome at ${CHROME}`)
}

const page = (await getJson('/json/list')).find((target) => target.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  ws.onopen = resolve
  ws.onerror = reject
})

let nextId = 0
const pending = new Map()
const waiters = []
ws.onmessage = (message) => {
  const data = JSON.parse(message.data)
  if (data.id && pending.has(data.id)) {
    const { resolve, reject } = pending.get(data.id)
    pending.delete(data.id)
    if (data.error) reject(new Error(data.error.message))
    else resolve(data.result)
    return
  }
  if (data.method === 'Runtime.consoleAPICalled') {
    logs.push(`[console.${data.params.type}] ${data.params.args.map((a) => a.value ?? a.description).join(' ')}`)
  } else if (data.method === 'Runtime.exceptionThrown') {
    const details = data.params.exceptionDetails
    logs.push(`[exception] ${details.exception?.description ?? details.text}`)
  } else if (data.method === 'Network.responseReceived') {
    responses.push({ url: data.params.response.url, status: data.params.response.status })
  } else if (data.method === 'Network.requestWillBeSent') {
    responses.push({ url: data.params.request.url, status: 'requested' })
  }
  for (let i = waiters.length - 1; i >= 0; i--) {
    if (waiters[i].method === data.method) {
      waiters[i].resolve(data.params)
      waiters.splice(i, 1)
    }
  }
}

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })

const waitForEvent = (method, timeout = 20000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeout)
    waiters.push({ method, resolve: (params) => (clearTimeout(timer), resolve(params)) })
  })

async function evaluate(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (exceptionDetails) throw new Error(`evaluate failed: ${expression.slice(0, 120)}`)
  return result.value
}

async function waitFor(expression, timeout = 10000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      if (await evaluate(expression)) return true
    } catch {
      // The element may not exist yet.
    }
    await delay(100)
  }
  return false
}

async function setViewport(width, height, mobile) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile })
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 })
}

async function go(url) {
  const loaded = waitForEvent('Page.loadEventFired')
  await send('Page.navigate', { url })
  await loaded
  await delay(800)
}

async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  await writeFile(join(outDir, `${name}.png`), Buffer.from(data, 'base64'))
  console.log(`      saved ${name}.png`)
}

async function click(x, y) {
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 })
}

async function drag(from, to, steps = 8) {
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: from.x, y: from.y })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: from.x, y: from.y, button: 'left', buttons: 1, clickCount: 1 })
  for (let i = 1; i <= steps; i++) {
    const x = from.x + ((to.x - from.x) * i) / steps
    const y = from.y + ((to.y - from.y) * i) / steps
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'left', buttons: 1 })
  }
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: to.x, y: to.y, button: 'left', buttons: 0, clickCount: 1 })
}

async function wheel(x, y, deltaY) {
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY })
}

async function pressKey(key, code, keyCode, text) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: keyCode, ...(text && { text }) })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: keyCode })
}

async function centerOf(expression) {
  return evaluate(
    `(() => { const el = ${expression}; if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })()`,
  )
}

const inOS = (selector) => `document.querySelector('[data-os-root]')?.querySelector(${JSON.stringify(selector)})`
const buttonWithText = (scope, text) =>
  `[...document.querySelectorAll(${JSON.stringify(`${scope} button`)})].find((b) => b.textContent.trim().includes(${JSON.stringify(text)}))`
const osInteractive = `document.querySelector('[data-os-root]')?.inert === false`
const osInert = `document.querySelector('[data-os-root]')?.inert === true`
const frameloop = `document.querySelector('canvas')?.dataset.frameloop`

await send('Page.enable')
await send('Runtime.enable')
await send('Network.enable')
// Count AudioContext creation to prove nothing audio-related starts while sound is off.
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `(() => { const Original = window.AudioContext; if (!Original) return; window.__audioContexts = 0; window.AudioContext = class extends Original { constructor(...args) { super(...args); window.__audioContexts++ } } })()`,
})

try {
  // ---------- Mobile: automatic 2D ----------
  console.log('\n== Mobile 390x844 (touch) ==')
  await setViewport(390, 844, true)
  await go(`${BASE}/`)
  check('auto-detects 2D on a phone', (await evaluate('document.documentElement.dataset.mode')) === '2d')
  const overflow = await evaluate('({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth })')
  check('no horizontal overflow', overflow.scroll <= overflow.inner, `scrollWidth ${overflow.scroll}, innerWidth ${overflow.inner}`)
  check(
    '2D path makes no 3D chunk or model requests',
    !responses.some((r) => r.url.includes('Experience3D') || r.url.endsWith('.glb')),
  )
  await shot('mobile-2d')

  // ---------- Desktop: 3D + OS ----------
  console.log('\n== Desktop 1440x900, ?mode=3d ==')
  await setViewport(1440, 900, false)
  responses.length = 0
  await go(`${BASE}/?mode=3d`)
  check('3D mode active', (await evaluate('document.documentElement.dataset.mode')) === '3d')
  check('canvas mounted', await waitFor(`!!document.querySelector('canvas') && document.documentElement.dataset.scene === 'mounted'`))
  check('loader finishes and hides', await waitFor(`![...document.querySelectorAll('[role=status]')].some((el) => el.textContent.includes('LOADING'))`, 15000))
  const models = responses.filter((r) => r.url.includes('/models/') && r.status !== 'requested')
  check('all models load with HTTP 200', models.length > 0 && models.every((r) => r.status === 200), `${models.length} responses`)
  check('no Draco decoder fetched from gstatic', !responses.some((r) => r.url.includes('gstatic.com')))
  check('lock screen shown before entering', await waitFor(`${inOS('p')}?.textContent === 'YR-OS'`, 3000))
  check('frameloop runs continuously at the desk', (await evaluate(frameloop)) === 'always')
  await delay(1500)
  await shot('3d-idle')

  await click(720, 450)
  check('click flies into the monitor', await waitFor(osInteractive, 8000))
  check('frameloop switches to on-demand once parked', await waitFor(`${frameloop} === 'demand'`, 3000))
  check('boot sequence plays on first visit', await waitFor(`!!${inOS('[role=status]')}`, 2000))
  await pressKey('Enter', 'Enter', 13)
  check('any key skips boot; About window opens', await waitFor(`!!${inOS('[data-window="about"]')}`, 3000))
  check('no AudioContext created while sound is off', (await evaluate('window.__audioContexts')) === 0)
  await delay(300)
  await shot('os-about')

  const soundToggle = await centerOf(inOS('button[aria-label="Turn sounds on"]'))
  await click(soundToggle.x, soundToggle.y)
  check(
    'sound toggle turns sound on and saves the choice',
    await waitFor(`localStorage.getItem('yr-sound') === 'on' && !!${inOS('button[aria-label="Mute sounds"]')} && window.__audioContexts === 1`, 2000),
  )
  const muteToggle = await centerOf(inOS('button[aria-label="Mute sounds"]'))
  await click(muteToggle.x, muteToggle.y)
  check('sound toggle mutes again', await waitFor(`localStorage.getItem('yr-sound') === 'off'`, 2000))

  check(
    'Credits has no desktop icon',
    !(await evaluate(`!!${buttonWithText('[data-os-root] ul[aria-label="Desktop"]', 'Credits')}`)),
  )

  const projectsIcon = await centerOf(buttonWithText('[data-os-root] ul[aria-label="Desktop"]', 'Projects'))
  await click(projectsIcon.x, projectsIcon.y)
  check('desktop icon opens Projects', await waitFor(`!!${inOS('[data-window="projects"]')}`, 2000))

  const openCase = await centerOf(buttonWithText('[data-window="projects"]', 'Open case study'))
  await click(openCase.x, openCase.y)
  check('case study view opens', await waitFor(`!!document.getElementById('os-project-title')`, 2000))
  await delay(200)
  await shot('os-case-study')

  const before = await evaluate(`parseFloat(${inOS('[data-window="projects"]')}.style.left)`)
  const scale = await evaluate(`(() => { const r = document.querySelector('[data-os-root]'); return r.getBoundingClientRect().width / r.offsetWidth })()`)
  const title = await centerOf(inOS('[data-window="projects"] header h2'))
  await drag(title, { x: title.x - 100, y: title.y + 40 })
  const after = await evaluate(`parseFloat(${inOS('[data-window="projects"]')}.style.left)`)
  const expected = before - 100 / scale
  check('dragged window tracks the cursor', Math.abs(after - expected) < 3, `left ${before.toFixed(1)} -> ${after.toFixed(1)}, expected ${expected.toFixed(1)}`)

  const start = await centerOf(inOS('[data-start-button]'))
  await click(start.x, start.y)
  check('Start menu opens', await waitFor(`!!${inOS('[role=menu]')}`, 2000))
  const creditsItem = await centerOf(buttonWithText('[data-os-root] [role=menu]', 'Credits'))
  await click(creditsItem.x, creditsItem.y)
  check('Start menu opens Credits', await waitFor(`!!${inOS('[data-window="credits"]')}`, 2000))
  await delay(300)
  await shot('os-credits')

  await click(start.x, start.y)
  check('Start menu reopens', await waitFor(`!!${inOS('[role=menu]')}`, 2000))
  await pressKey('Escape', 'Escape', 27)
  await delay(300)
  check('Escape closes the menu but stays on the monitor', !(await evaluate(`!!${inOS('[role=menu]')}`)) && (await evaluate(osInteractive)))

  const terminalIcon = await centerOf(buttonWithText('[data-os-root] ul[aria-label="Desktop"]', 'Terminal'))
  await click(terminalIcon.x, terminalIcon.y)
  check('Terminal opens', await waitFor(`!!${inOS('[data-window="terminal"] input')}`, 2000))
  const input = await centerOf(inOS('[data-window="terminal"] input'))
  await click(input.x, input.y)
  await send('Input.insertText', { text: 'whoami' })
  await pressKey('Enter', 'Enter', 13, '\r')
  check(
    'terminal runs whoami',
    await waitFor(`${inOS('[data-window="terminal"]')}.textContent.includes('$ whoami') && ${inOS('[data-window="terminal"]')}.querySelectorAll('p').length >= 4`, 2000),
  )

  const duplicates = await evaluate(`(() => { const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); return ids.filter((id, i) => ids.indexOf(id) !== i) })()`)
  check('no duplicate element ids with several apps open', duplicates.length === 0, duplicates.join(', '))

  const closeTerminal = await centerOf(inOS('[data-window="terminal"] button[aria-label="Close"]'))
  await click(closeTerminal.x, closeTerminal.y)
  check('Close button closes the window', await waitFor(`!${inOS('[data-window="terminal"]')}`, 2000))

  await pressKey('Escape', 'Escape', 27)
  check('Escape returns to the desk', await waitFor(osInert, 3000))
  check('frameloop resumes when leaving the monitor', await waitFor(`${frameloop} === 'always'`, 2000))
  await delay(1500)

  await wheel(720, 450, 120)
  check('scroll down enters the monitor', await waitFor(osInteractive, 8000))
  check('no second boot in the same session', !(await evaluate(`!!${inOS('[role=status]')}`)))
  await wheel(720, 450, -150)
  await delay(800)
  check('scroll up over the OS does not leave', await evaluate(osInteractive))
  await wheel(8, 450, -150)
  check('scroll up outside the OS leaves', await waitFor(osInert, 3000))

  const skip = await centerOf(`[...document.querySelectorAll('button')].find((b) => b.textContent === 'Skip 3D')`)
  await click(skip.x, skip.y)
  check('Skip 3D switches to 2D and unmounts canvas', await waitFor(`document.documentElement.dataset.mode === '2d' && !document.querySelector('canvas')`, 3000))
  await go(`${BASE}/`)
  check('saved 2D choice survives reload', (await evaluate('document.documentElement.dataset.mode')) === '2d')
  await shot('desktop-2d')

  // ---------- Deep link ----------
  console.log('\n== Deep link ?mode=3d&view=monitor ==')
  await evaluate(`localStorage.clear()`)
  await go(`${BASE}/?mode=3d&view=monitor`)
  check('opens straight into the monitor desktop', await waitFor(`${osInteractive} && !!${inOS('ul[aria-label="Desktop"]')}`, 10000))

  // ---------- Slow device ----------
  console.log('\n== CPU throttled 6x, ?mode=3d ==')
  await evaluate(`localStorage.clear()`)
  await send('Emulation.setCPUThrottlingRate', { rate: 6 })
  await go(`${BASE}/?mode=3d`)
  await delay(10000)
  const exceptions = logs.filter((line) => line.startsWith('[exception]'))
  check('scene keeps running under heavy throttling', (await evaluate(`!!document.querySelector('canvas')`)) && exceptions.length === 0)
  console.log(`      quality=${await evaluate(`document.querySelector('canvas')?.dataset.quality`)}`)
  await send('Emulation.setCPUThrottlingRate', { rate: 1 })
} catch (error) {
  failures++
  console.log(`FAIL  script error: ${error.message}`)
} finally {
  // three.js logs a known deprecation for THREE.Clock from inside React Three Fiber.
  const relevant = logs.filter((line) => !line.includes('THREE.Clock'))
  console.log(`\n== Console (${relevant.length} relevant of ${logs.length}) ==`)
  relevant.slice(0, 20).forEach((line) => console.log(`  ${line.slice(0, 300)}`))
  console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`)
  ws.close()
  chrome.kill()
  await Promise.race([new Promise((resolve) => chrome.once('exit', resolve)), delay(3000)])
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
  process.exit(failures === 0 ? 0 : 1)
}
