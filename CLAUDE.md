# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check with `tsc -b` then bundle with Vite (outputs to `dist/`)
- `npm run lint` — Run ESLint on all .ts/.tsx files
- `npm run preview` — Serve production build locally

No test framework is configured yet.

## Tech Stack

- **React 19** with TypeScript 5.9, built with **Vite 7**
- ESM-only (`"type": "module"` in package.json)
- ESLint flat config with typescript-eslint, react-hooks, and react-refresh plugins

## Architecture

This is currently a minimal React+Vite starter. Entry flow: `index.html` → `src/main.tsx` (creates React root in StrictMode) → `src/App.tsx`.

Static assets go in `public/`; imported assets go in `src/assets/`.

## TypeScript

- Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- `verbatimModuleSyntax` is on — use `import type` for type-only imports
- JSX transform is `react-jsx` (automatic — no need to `import React`)
- Target: ES2022, module resolution: `bundler`
