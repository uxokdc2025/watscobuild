# Watsco PDP Prototype — CLAUDE.md

Data-driven **Next.js PDP (product-detail-page) prototype** for Watsco. One template renders any
product from a registry, faithfully reproducing the storefront "chrome" of **7 Watsco distributor
sub-companies** and demonstrating **8 commerce edge-case use cases.** Also a shadcn component
registry + component/tab/accordion style showcases.

## Seamless brain (read first)
- Project: Watsco Design System. Agent OS board: `watsco` (https://agentos.goseamless.ai/agent-kanban). Repo: uxokdc2025/watscobuild, work branch `review`. Live: https://watscobuild-git-review-goseamless.vercel.app.
- The Brain is the repo uxokdc2025/claudecode-global. Locally it is `~/Developer/ClaudeCode/_global/`; on the fleet it is `/opt/company-os/state/`; inside fleet lane containers it is `/home/sbx/_global/` (read-only). Read `how-we-work.md` first, then standards on demand (`tech-and-quality.md`, `accessibility.md`, `design-system-os.md`, `production-standard.md`). Never @import the folder.
- Team roadmap (where everything is, access, lanes, card format): `_global/team/seamless-team-roadmap.md`.
- Work comes from cards: user story + numbered acceptance criteria. Build on `wt/<card>` only; never merge to production or deploy. Review = a different agent QAs the preview; then a person does a final live test; ships go one at a time with a rollback tag.
- Lanes: Jam = `claude_ja`, Robin = `claude_rc`; assignee `claude` = project lane or any free lane; `muse` = Muse pool.
- Talk in Agent OS Messages with @mentions; card decisions go in card comments. Output David sees is in English. Never put secrets in code, cards or chat.

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
