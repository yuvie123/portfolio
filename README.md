# Yuvraj Randhawa · Portfolio

My personal website. The goal is a retro desk in 3D where the monitor runs a small desktop OS holding my projects, experience and resume. Phones, low-power devices and reduced-motion visitors get a fast 2D version with the same content.

The 2D site is live now; the 3D desk is in progress.

**Live:** https://yuvraj-randhawa.vercel.app

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4
- Three.js via React Three Fiber and drei (3D scene, in progress)
- Hosted on Vercel

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build
npm run preview   # serve the production build
npm run lint
```

## Editing content

All text lives in `src/content/resume.ts`. The 2D site, the SEO tags, and (soon) the 3D OS windows all read from that one file.

## Project layout

```
src/content/     resume data, SEO data, shared section components
src/fallback/    2D site layout
src/components/  small shared UI pieces
src/lib/         helpers and hooks
public/          static files (favicon, robots.txt, sitemap)
```
