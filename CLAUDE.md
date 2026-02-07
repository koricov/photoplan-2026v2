# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check with `tsc -b` then bundle with Vite (outputs to `dist/`)
- `npm run lint` — Run ESLint on all .ts/.tsx files
- `npm run preview` — Serve production build locally
- `node scripts/optimize-photos.mjs` — Batch convert source JPGs to WebP thumbs (640px) and full-res (1920px)

No test framework is configured yet.

## Tech Stack

- **React 19** with TypeScript 5.9, built with **Vite 7**
- ESM-only (`"type": "module"` in package.json)
- ESLint flat config with typescript-eslint, react-hooks, and react-refresh plugins
- Deployed on **Vercel** with a serverless function in `api/`

## Architecture

Single-page property photo gallery with fullscreen viewer and virtual staging.

**Entry flow:** `index.html` → `src/main.tsx` (StrictMode) → `src/App.tsx`

**App.tsx** orchestrates four top-level components:
- `Header` — property address, stats (beds/baths/sqft), 3D Tour link
- `PhotoGrid` — responsive grid with `PhotoCard` buttons and a `MapCard` slot
- `Lightbox` — fullscreen viewer with swipe/keyboard navigation and virtual staging UI
- `Footer` — PlanOmatic branding

**Data flow:** `src/data/photos.ts` exports a static array of 15 `Photo` objects. `useLightbox` hook manages viewer open/close/navigation state and returns it to `App`, which passes it down to `PhotoGrid` and `Lightbox`.

**CSS:** CSS Modules per component. Global design tokens (colors, spacing, typography, shadows, transitions) defined in `src/index.css`. Accent color is `--color-accent: #2c5530`.

## Virtual Staging

The Lightbox includes a "Virtual Stage" button that calls the Virtual Staging AI API through a Vercel serverless proxy:

- `src/services/virtualStaging.ts` — client service with `stagePhoto()`, room/style constants, `detectRoomType()` (auto-detects from photo alt text)
- `api/stage.ts` — Vercel serverless function that proxies to `api.virtualstagingai.app` with server-side API key (`VSAI_API_KEY` env var, 60s timeout)

The Original/Staged toggle swaps the center image via direct DOM manipulation on `stripRef` to avoid conflicts with the strip's synchronous DOM swap in `completeSlide`.

## Lightbox DOM Pattern

The Lightbox uses a 3-image strip with direct DOM manipulation for flicker-free slide transitions. `completeSlide` synchronously resets transform + swaps image sources in one microtask, then syncs React state as a visual no-op. New UI added to the Lightbox must respect `isAnimating` and `stripRef` — avoid React re-renders that would conflict with in-flight DOM swaps.

## Photos

- Source JPGs in `public/photos/`
- Optimized WebP in `public/photos/thumb/` (640px) and `public/photos/full/` (1920px)
- Photo metadata in `src/data/photos.ts`: `{ id, thumbUrl, fullUrl, alt, aspectRatio }`

## TypeScript

- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- `verbatimModuleSyntax` — use `import type` for type-only imports
- JSX transform is `react-jsx` (automatic — no `import React` needed)
- Target: ES2022 (app), ES2023 (api/build tooling)
- `tsconfig.node.json` includes both `vite.config.ts` and `api/` directory

## Environment Variables

- `VSAI_API_KEY` — Virtual Staging AI API key. Set in `.env.local` locally and in Vercel dashboard for production. No `VITE_` prefix (server-only).

## Important: v1 vs v2

This is `photoplan-2026v2`. There is a sibling `photoplan-2026v1` that should not be modified. All development happens here in v2.
