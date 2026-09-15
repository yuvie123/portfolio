# 3D asset credits

Every third-party model in the 3D scene. Keep in sync with `src/scene/models/credits.ts`.

| Asset | Author | License | Source |
|---|---|---|---|
| Desk, keyboard, mouse, books, potted plant (Furniture Kit) | Kenney | CC0 1.0 | https://kenney.nl/assets/furniture-kit |
| Mug | Kenney | CC0 1.0 | https://poly.pizza/m/fis2ugeLbn |
| Desk lamp ("Light Desk") | Quaternius | CC0 1.0 | https://poly.pizza/m/uJDWrSJGVH |
| Retro computer, ESP32 board | Modeled in code (`src/scene/models/`) | Part of this project | – |

## Reproducing the models

```bash
npm run models:fetch      # downloads into assets-src/models/raw (gitignored)
npm run models:optimize   # meshopt + WebP into public/models/<name>.v1.glb
```

Bump the `v1` suffix in `scripts/optimize-models.mjs` and `src/scene/models/layout.ts` whenever a model changes, because `/models/*` is served with immutable cache headers.
