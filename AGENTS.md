# Agent playbook

Short reference for AI agents working in this repo. Cursor also loads everything under `.cursor/rules/` — this file mirrors the highlights so other tools (Codex, Claude Code, etc.) see the same guidance.

## Tech stack

Vite + React 18 + TypeScript (strict) · Tailwind · React Router v6 · Vitest · Playwright · Vercel (SPA) · Vercel Blob for media (manifest: `src/utils/mediaManifest.json`).

## Golden rules

1. Never hard‑code `/products`, `/slider`, or `/videos` paths in JSX or data — wrap with `getAssetPath()` from `src/utils/images.ts`.
2. Never commit unless the user explicitly asks. Never push to `main` directly.
3. Before committing, run `yarn verify` (typecheck + lint + test + build). If it fails, fix the cause; do not silence it.
4. Use Context7 for library APIs you're not certain about — see `.cursor/rules/context7.mdc`.
5. Don't introduce a Node server; this is a static SPA.

## Scripts

```
yarn dev · yarn build · yarn typecheck · yarn lint · yarn test · yarn e2e · yarn verify
yarn upload:media (requires BLOB_READ_WRITE_TOKEN from .env.local)
```

## Detailed rules

- `.cursor/rules/project-conventions.mdc` — stack, structure, do/don't
- `.cursor/rules/code-generation.mdc` — TS/React standards
- `.cursor/rules/testing.mdc` — what to test and where
- `.cursor/rules/vitest.mdc` — unit/component tests
- `.cursor/rules/playwright.mdc` — e2e tests
- `.cursor/rules/commits-and-pushing.mdc` — git workflow
- `.cursor/rules/context7.mdc` — when to consult library docs
