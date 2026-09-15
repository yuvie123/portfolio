// Downloads the CC0 models used in the 3D scene into assets-src/models/raw (gitignored).
// Sources and licenses: assets-src/models/CREDITS.md. Then run `npm run models:optimize`.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const rawDir = join(root, 'assets-src/models/raw')

const KENNEY_ZIP_URL =
  'https://kenney.nl/media/pages/assets/furniture-kit/440e0608a4-1677580847/kenney_furniture-kit.zip'

/** Kenney Furniture Kit entries (in "Models/GLTF format/") mapped to local names. */
const KENNEY_MODELS = {
  desk: 'desk',
  computerKeyboard: 'keyboard',
  computerMouse: 'mouse',
  books: 'books',
  pottedPlant: 'plant',
}

/** Single CC0 models from Poly Pizza's file host. */
const DIRECT_MODELS = {
  mug: 'https://static.poly.pizza/5600ffdc-21d2-4e62-93e2-1b255738e43d.glb',
  lamp: 'https://static.poly.pizza/2e1ab34a-eab6-4751-930f-6e3b4f5319a8.glb',
}

async function download(url, destination) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed: ${url} (HTTP ${response.status})`)
  writeFileSync(destination, Buffer.from(await response.arrayBuffer()))
}

function checkGlb(path) {
  const magic = readFileSync(path).subarray(0, 4).toString('latin1')
  if (magic !== 'glTF') throw new Error(`Not a GLB file: ${path}`)
  console.log(`  ok  ${path.slice(root.length)}`)
}

mkdirSync(rawDir, { recursive: true })

const zipPath = join(rawDir, 'kenney_furniture-kit.zip')
if (!existsSync(zipPath)) {
  console.log('Downloading Kenney Furniture Kit...')
  await download(KENNEY_ZIP_URL, zipPath)
}

// unzip exits non-zero if any listed entry is missing, which stops the script.
const entries = Object.keys(KENNEY_MODELS).map((entry) => `Models/GLTF format/${entry}.glb`)
execFileSync('unzip', ['-j', '-o', zipPath, ...entries, 'License.txt', '-d', rawDir], { stdio: 'ignore' })
renameSync(join(rawDir, 'License.txt'), join(rawDir, 'kenney-license.txt'))

console.log('Kenney Furniture Kit (CC0):')
for (const [entry, name] of Object.entries(KENNEY_MODELS)) {
  const destination = join(rawDir, `${name}.glb`)
  renameSync(join(rawDir, `${entry}.glb`), destination)
  checkGlb(destination)
}

console.log('Poly Pizza (CC0):')
for (const [name, url] of Object.entries(DIRECT_MODELS)) {
  const destination = join(rawDir, `${name}.glb`)
  await download(url, destination)
  checkGlb(destination)
}
