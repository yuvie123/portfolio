# Yuvraj Randhawa · Portfolio

My personal website: a retro desk in 3D where the monitor runs a small desktop OS holding my projects, experience and resume. Phones, low-power devices and reduced-motion visitors get a fast 2D version with the same content.

The desk currently uses stand-in shapes; detailed 3D models are next.

**Live:** https://yuvraj-randhawa.vercel.app

## Stack

- React 19 + TypeScript, built with Vite
- Three.js via React Three Fiber and drei
- Tailwind CSS v4
- Hosted on Vercel

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build (prerendered HTML)
npm run preview   # serve the production build
npm run lint
npm run test:e2e          # browser checks for 2D + 3D (with `npm run preview` running)

npm run models:fetch      # download the CC0 desk models (see assets-src/models/CREDITS.md)
npm run models:optimize   # compress them into public/models
npm run og                # regenerate public/og.png (with `npm run preview` running)
```

Add `?mode=2d` or `?mode=3d` to force a version, and `?view=monitor` to open straight into the computer.

## Editing content

All text lives in `src/content/resume.ts`. The 2D site, the SEO tags and the OS windows all read from that one file.

## Project layout

```
src/content/     resume data, SEO data, shared section components
src/fallback/    2D site layout
src/scene/       3D desk, camera and the screen the OS is drawn on
src/os/          the desktop OS: windows, taskbar, apps
src/components/  small shared UI pieces
src/lib/         helpers and hooks (2D/3D mode detection)
public/          static files (favicon, robots.txt, sitemap)
```
