# Watsco PDP Prototype — CLAUDE.md

Data-driven **Next.js PDP (product-detail-page) prototype** for Watsco. One template renders any
product from a registry, faithfully reproducing the storefront "chrome" of **7 Watsco distributor
sub-companies** and demonstrating **8 commerce edge-case use cases.** Also a shadcn component
registry + component/tab/accordion style showcases.

## Run
```bash
npm run dev   # → http://localhost:3001  (port 3001 is pinned in package.json + launch.json — do not change)
```

## Connections
- Git: `github.com/uxokdc2025/watscobuild`
- Vercel: project `watscobuild` (`.vercel/project.json`)

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn (New York; this repo IS a
shadcn registry — `registry.json`, `npm run registry:build`). Dev is run with **npm**.

## Where things are
- `app/pdp/_lib/types.ts` — the `PdpProduct` domain model. **Read first.**
- `app/pdp/_lib/registry.ts` — all product data.
- `app/pdp/_lib/brands.ts` + `chrome.tsx` — the 7 distributors' faithful header/footer chrome.
- `app/pdp/_lib/summary.tsx` — buy-box / value hierarchy.
- `app/pdp/[slug]` — the template. `/pdp` — master index of PDPs + use cases.
- Style showcases: `/pdp/tab-styles`, `/pdp/accordion-styles`, `/components`, `/typography`.

## Full state / decisions / learnings
Canonical handoff: `~/Developer/ClaudeCode/watsco/docs/handoff/state-2026-08-09.md`
and FC Brain → `brain_read watsco/handoff/state-2026-08-09.md`.

## Conventions
- Price is gated to logged-in; signed-out shows a gated state.
- Statuses render inline (not badges); UoM shows as `/ EACH` (space after slash).
- Product images are real, wired from Watsco Scene7 CDN article IDs.
- Accessibility gate applies (low-stock orange is at AA). Mobile-first.
