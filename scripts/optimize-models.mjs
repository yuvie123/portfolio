// Compresses raw GLBs from assets-src/models/raw into public/models/<name>.v1.glb and reports sizes.
// Run `npm run models:fetch` first.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const rawDir = join(root, 'assets-src/models/raw')
const outDir = join(root, 'public/models')
const cli = join(root, 'node_modules/.bin/gltf-transform')
const VERSION = 'v1'
const BUDGET_BYTES = 1_500_000

const inputs = readdirSync(rawDir).filter((file) => file.endsWith('.glb'))
if (inputs.length === 0) {
  throw new Error('No raw models found in assets-src/models/raw. Run `npm run models:fetch` first.')
}
mkdirSync(outDir, { recursive: true })

let total = 0
for (const file of inputs.sort()) {
  const name = basename(file, '.glb')
  const output = join(outDir, `${name}.${VERSION}.glb`)
  execFileSync(
    cli,
    [
      'optimize',
      join(rawDir, file),
      output,
      '--compress', 'meshopt',
      '--texture-compress', 'webp',
      '--texture-size', '512',
      // Low-poly models: simplifying would only damage their silhouettes.
      '--simplify', 'false',
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  )
  const bytes = statSync(output).size
  total += bytes
  console.log(`${name.padEnd(10)} ${(bytes / 1024).toFixed(1).padStart(7)} KB`)
}

console.log(`${'total'.padEnd(10)} ${(total / 1024).toFixed(1).padStart(7)} KB`)
if (total > BUDGET_BYTES) {
  console.error(`Models exceed the ${BUDGET_BYTES / 1_000_000} MB budget.`)
  process.exit(1)
}
