export type Credit = {
  asset: string
  author: string
  license: string
  source: string | null
}

/** Every third-party asset in the 3D scene. Keep in sync with assets-src/models/CREDITS.md. */
export const CREDITS: Credit[] = [
  {
    asset: 'Desk, keyboard, mouse, books and potted plant (Furniture Kit)',
    author: 'Kenney',
    license: 'CC0 1.0',
    source: 'https://kenney.nl/assets/furniture-kit',
  },
  {
    asset: 'Mug',
    author: 'Kenney',
    license: 'CC0 1.0',
    source: 'https://poly.pizza/m/fis2ugeLbn',
  },
  {
    asset: 'Desk lamp ("Light Desk")',
    author: 'Quaternius',
    license: 'CC0 1.0',
    source: 'https://poly.pizza/m/uJDWrSJGVH',
  },
  {
    asset: 'Retro computer and ESP32 board',
    author: 'Modeled in code for this site',
    license: 'Part of this project',
    source: null,
  },
]
