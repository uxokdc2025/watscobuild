# Handoff — AHRI System Builder + Checkout v2 review (2026-10-02)

Prototype: `watscobuild` multi-brand HVAC storefront for client review (Ryan Dorschel / East Coast [ecmdi.com], Peirce-Phelps). Next.js 15 App Router · React 19 · TS · Tailwind v4 · shadcn. Dev: `npm run dev` → **http://localhost:3001**.

## ‼️ Deploy / preview (read first)
- Repo deploys to Vercel under the **goseamless** scope. The ONLY live branch alias is:
  **`https://watscobuild-git-review-goseamless.vercel.app`**
- The `…-david-cervantes-projects-a2f97231.vercel.app` alias is **DEAD** (stuck on an old deployment). Never hand David that URL — he kept landing on it and thought nothing was fixed.
- Deploy loop: `git push origin review` → poll `gh api repos/uxokdc2025/watscobuild/commits/<sha>/status --jq '.state'` until ≠ `pending` → verify on the **goseamless** alias (browser or curl).
- Vercel MCP returns 403 for this project (personal/goseamless scope) — use `gh` commit status + curl/browser instead.
- Do **not** run `next build` while the turbopack dev server (3001) is running — it corrupts `.next`. Validate with `npx tsc --noEmit` and `npx next lint --file <path>`; verify behavior in-browser on dev.
- Branch: `review`. Latest commit at handoff: **b73713d**.

## AHRI System Builder (main work)
Lives INSIDE the GLZS4B PDP's About tabs (not a standalone page).
- Entry PDP: `/pdp/uc-ahri-matched-system?signedin=1` (registry slug `uc-ahri-matched-system`, flag `ahriLookup: true`). Buy-box "Find an AHRI Matched System" → `#ahri-lookup` (scrolls to the tab). Index/discovery links load at the **top** (no anchor).
- Files:
  - `app/pdp/_lib/ahri-lookup.tsx` — the AHRI Lookup tab. V1 progressive wizard + V2 all-open (`?ahri=all`); results list + table view; columns chooser.
  - `app/pdp/_lib/about-tabs.tsx` — Style-2 tabbed About (Description · Specifications · AHRI Lookup · Part List), used when `product.ahriLookup`.
  - `app/ahri/_lib/data.ts` — `SYSTEM_TYPES`, `WIZARD_STEPS` (per type), `STEP_DEFS`, `SYSTEMS`, `ADD_ONS`, `wizardMatches`, operators.
  - `app/ahri/_lib/parts.tsx` — `ThumbTile`, `SpecPill`, `InventoryLine`.
  - `app/ahri/[ahri]/` — system detail page (component rows in list pattern, right-rail summary, cross-sell).

### Locked AHRI behavior (per David + Ryan, do not regress)
1. First row = **just the System Type dropdown** (hide the Equals + attribute cells).
2. Row order on step rows = **Value (left) · Operator · Attribute label (right)**. Operator cell is the SAME width on every row.
3. Progressive wizard: ONLY **Furnace + Indoor Coil** has follow-up steps (**AFUE → BTU Input → Air Flow**). **Air Handler / Indoor Coil / Mortex Mobile Home** resolve immediately (0 wizard steps).
4. A numeric step advances ONLY when BOTH value AND operator are explicitly chosen. Operator default = placeholder **"Choose"** (options Equals / ≤ / ≥). Value prompt = **"Choose filter <attr>"**. Categorical steps (Air Flow) have a fixed Equals.
5. **No red "required" error** during the flow. When a completed flow yields nothing → keep the rows + red **"There are no results for the selected filter."** (Indoor Coil + Mortex always show this — no systems for this heat pump).
6. On completion with matches → collapse to removable **chips** + **Clear all** (full reset). Results use our **product-list-row** pattern (NOT a wide table) by default.
7. Results header controls on the **top-right** (every flow): **Add filter**, **Columns** (toggles spec columns in table view), **View in table ⇄ View as list**.
8. System-type order: Air Handler, Furnace + Indoor Coil, Indoor Coil, Mortex Mobile Home Coils.
9. Two versions share the SAME flow — V1 progressive (default), V2 all-open via `?ahri=all`. **No toggle UI.**

### AHRI data (matches ecmdi reference)
- Furnace+Coil 215217523 / 215217524 = AFUE 80 / BTU 100000 / Downflow: CAPTA4230C3 / CAPTA4230D3 coil ($1,169.57) + GD9S801005CN 100k furnace ($2,042.98) → **system subtotal $7,332.39**.
- AFUE options: 80 / 92 / 93 / 96 / 96.1. Cross-sell (`ADD_ONS`) = real **TRADEPRO** install accessories.
- Detail page component rows = list pattern (image · capped description so specs flow down · availability as own centered column · price). Fixed horizontal-overflow (added `min-w-0` to the content column). Ryan approved the detail LAYOUT — "just style with our DS" (already done).

## Checkout v2 review (also this session)
- v2 (accordion) Review is now its **own page** like v3: `app/checkout/v2/review/page.tsx` reuses `ReviewPageClient` (now takes a `basePath` prop; v3 default).
- Accordion Payment "Continue to review" + Order Summary + mobile CTA now read **"Review Order"** → route to `/checkout/v2/review`. Inline Review accordion section removed.

## Key review URLs (goseamless)
- AHRI Lookup: `/pdp/uc-ahri-matched-system?signedin=1` · V2 all-open: add `&ahri=all`
- AHRI system detail: `/ahri/215217523`
- Checkout v2: `/checkout/v2?demo=1` · v2 review: `/checkout/v2/review?demo=1`
- Master index of all changes: `/pdp`

## Open / possible next
- Full **Specifications** block on the AHRI detail page like ecmdi (AHRI Type, Indoor Air Quantity, Phase, BTU Input, Indoor/Furnace Unit Model…). Ryan approved current layout → optional.
- Columns/View-in-Table is V1 only (shown once results collapse to chips); not wired into V2 all-open.
- PDP's own "Customers Also Purchased" (above the tabs) still uses the registry's Tutco/DiversiTech set — separate from the detail-page TRADEPRO cross-sell; left as-is.
