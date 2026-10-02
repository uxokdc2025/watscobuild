# Watsco storefront prototype — handoff (week of 2026-09-24 → 10-02)

Prototype: `watscobuild` multi-brand HVAC storefront for client review (Ryan Dorschel / East Coast Metal Distributors [ecmdi.com]; Peirce-Phelps reference). Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · shadcn (New York). Dev: `npm run dev` → **http://localhost:3001**. Git repo `github.com/uxokdc2025/watscobuild`, branch **`review`**. Latest commit at handoff: **b73713d**.

Master index of everything shippable + review links: **`/pdp`** (the "Today's Changes" section). Use it as the living catalog.

## ⭐ First principle (most important)
**Everything we build comes from the design system.** Use the existing DS components, tokens, and canonical patterns — never bespoke/one-off UI. Before building, find the pattern we already have and reuse it:
- Product/results rows → the canonical **product-list-row** pattern (image · capped description · availability as its own centered column · price) shared by PLP / cart / checkout review / shopping-list / AHRI results.
- Cross-sell → the `ProductCard` / `CarouselStrip` rail.
- Buttons, Select, DropdownMenu, Badge, Tabs, Checkbox, QtyStepper, StockStatus, mega-menu, drawer → shadcn DS components. Brand chrome via `SiteHeader`/`SiteFooter` + `getBrand`.
- Tabs → the Style-2 "connected bar, soft blue" pattern (`/pdp/about-variants`).
- Colors as tokens (AA contrast), 8pt spacing, mobile-first, no magic values.
Recurring feedback all week was "use our patterns / this is bespoke" — reusing the DS is the acceptance bar, not a nicety.

## ‼️ Deploy / preview (read first)
- Repo deploys to Vercel under the **goseamless** scope. The ONLY live branch alias is:
  **`https://watscobuild-git-review-goseamless.vercel.app`**
- The `…-david-cervantes-projects-a2f97231.vercel.app` alias is **DEAD** (stuck on an old deployment). Never hand David that URL — he kept landing on it and thought nothing was fixed.
- Deploy loop: `git push origin review` → poll `gh api repos/uxokdc2025/watscobuild/commits/<sha>/status --jq '.state'` until ≠ `pending` → verify on the **goseamless** alias (browser or curl).
- Vercel MCP returns 403 for this project — use `gh` commit status + curl/browser instead.
- Do **not** run `next build` while the turbopack dev server (3001) is running — it corrupts `.next`. Validate with `npx tsc --noEmit` and `npx next lint --file <path>`; verify behavior in-browser on dev, then on the goseamless preview after push.
- Pattern every change: edit → tsc/lint → verify on dev in-browser → commit → push → poll build → verify on goseamless → give David the goseamless link.

---

## Full scope this week (by area)

### 1. AHRI System Builder (the big workstream — see detail below)
Rebuilt to live INSIDE the GLZS4B PDP's About tabs: progressive wizard, list/table results, system detail page. Many iterations 10-01.

### 2. Checkout
- **Mobile pass (v1 tabs + v2 accordion)**: sticky bottom CTA bars, removed inner-scroll boxes, slim saved-card tiles, responsive cart/review rows, step auto-scroll on advance, balanced sticky bar, fixed header/step-nav/payment panel.
- **Saved-card tiles**: compact left-aligned grid (6–7 tiles + "See all"/All-credit-cards drawer of 10), one-line masked number (dots + last4), Default badge, plain "Add new card".
- **Brand chrome**: minimal Homans-branded checkout header/footer; lock icon in header (removed in-page "Secure checkout" badge); contact phone width aligned to date field.
- **Delivery/payment**: required Contact Cell Phone on pickup/delivery; grounded "Ship complete" card; v2 accordion in-card Continue buttons gated grey→blue per step; Back row hidden in accordion.
- **v3 "everything open"**: all sections open on one page, Order-Summary CTA "Review Order" → standalone `/checkout/v3/review` (reuses v1 review layout, no progress bar).
- **Review Edit links (all versions)**: each collapsed summary box (Order details / Fulfillment / Payment) got an Edit link top-right → jumps back to that step (v1/v2) or anchors on the open page (v3).
- **v2 Review page (this session)**: v2 Review is now its own page like v3 → `/checkout/v2/review` (details below).

### 3. Homans "Contact Us" (out-of-stock use case)
3-line "Limited Availability / Let us help you find this product / Contact Us" on the v1 PDP + PLP cards. The earlier v2 "box" PDP was removed. Routes: `/pdp/homans-contact-us?signedin=1`, `/search/homans-contact-us?signedin=1`.

### 4. Search / PLP
- List view = **full-width horizontal product rows**; availability as its own centered middle column; capped description (wraps to 2–3 lines).
- **PLP v2** with a "Shop By Availability" checkbox sidebar (grey box): `/search/plp-v2?signedin=1`.
- Tightened sidebar availability-box spacing; widened the narrow-results gap.

### 5. Shopping list
Rebuilt to a **full column table** matching the live Shopware reference (header row: Product Details · Label · Availability · Price · Qty; select + drag on left, Add + remove on right), capped Product Details (340px), availability centered, bulk actions inline in the Select-all row. Route: `/dashboard/shopping-lists/<id>`.

### 6. Component / style showcases
- **Tab styles**: Style 2 = "connected bar, soft light-blue active" (AA icon/label); Specs icon → Gauge, Part List → Settings. `/pdp/about-variants`.
- **Mega-menu**: section name bold left, "View all" right, light rule under.
- **Account flyout**: stacked Change account (primary) / Change ship-to (outline), fixed small size.

### 7. Design index
`/pdp` has a dated **"Today's Changes"** section at the top with per-change plain-English descriptions + review links.

---

## AHRI System Builder — detail
Lives INSIDE the GLZS4B PDP's About tabs (NOT a standalone page).
- Entry PDP: `/pdp/uc-ahri-matched-system?signedin=1` (registry slug `uc-ahri-matched-system`, flag `ahriLookup: true`). Buy-box "Find an AHRI Matched System" → `#ahri-lookup` (scrolls to the tab). Index/discovery links load at the **top** (no anchor).
- Files:
  - `app/pdp/_lib/ahri-lookup.tsx` — AHRI Lookup tab: V1 progressive wizard + V2 all-open (`?ahri=all`); results list + table view; columns chooser.
  - `app/pdp/_lib/about-tabs.tsx` — Style-2 tabbed About (Description · Specifications · AHRI Lookup · Part List) when `product.ahriLookup`.
  - `app/ahri/_lib/data.ts` — `SYSTEM_TYPES`, `WIZARD_STEPS` (per type), `STEP_DEFS`, `SYSTEMS`, `ADD_ONS`, `wizardMatches`, operators.
  - `app/ahri/_lib/parts.tsx` — `ThumbTile`, `SpecPill`, `InventoryLine`.
  - `app/ahri/[ahri]/` — system detail page.

### Locked AHRI behavior (per David + Ryan — do not regress)
1. First row = **just the System Type dropdown** (hide Equals + attribute cells).
2. Step-row order = **Value (left) · Operator · Attribute label (right)**. Operator cell same width on every row.
3. Only **Furnace + Indoor Coil** has follow-up steps (**AFUE → BTU Input → Air Flow**). **Air Handler / Indoor Coil / Mortex Mobile Home** resolve immediately (0 wizard steps).
4. A numeric step advances ONLY when BOTH value AND operator are explicitly chosen. Operator default placeholder **"Choose"** (Equals / ≤ / ≥). Value prompt **"Choose filter <attr>"**. Categorical (Air Flow) = fixed Equals.
5. **No red "required"** during the flow. Completed flow with nothing → keep rows + red **"There are no results for the selected filter."** (Indoor Coil + Mortex always show this).
6. On completion with matches → collapse to removable **chips** + **Clear all** (full reset). Results = our **product-list-row** pattern (NOT a wide table) by default.
7. Results header controls on the **top-right** (every flow): **Add filter**, **Columns** (toggles spec columns in table view), **View in table ⇄ View as list**.
8. System-type order: Air Handler, Furnace + Indoor Coil, Indoor Coil, Mortex Mobile Home Coils.
9. Two versions share the SAME flow — V1 progressive (default), V2 all-open via `?ahri=all`. **No toggle UI.**

### AHRI data (matches ecmdi reference)
- Furnace+Coil 215217523 / 215217524 = AFUE 80 / BTU 100000 / Downflow: CAPTA4230C3 / CAPTA4230D3 coil ($1,169.57) + GD9S801005CN 100k furnace ($2,042.98) → **subtotal $7,332.39**.
- AFUE options: 80 / 92 / 93 / 96 / 96.1. Cross-sell (`ADD_ONS`) = real **TRADEPRO** install accessories.
- Detail page component rows = list pattern (image · capped description so specs flow down · availability own centered column · price). Fixed horizontal overflow (`min-w-0` on the content column). Ryan approved the detail LAYOUT ("style with our DS" — done).

## Checkout v2 review (this session)
- v2 (accordion) Review is now its **own page** like v3: `app/checkout/v2/review/page.tsx` reuses `ReviewPageClient` (now takes `basePath`; v3 default).
- Accordion Payment "Continue to review" + Order Summary + mobile CTA now read **"Review Order"** → route to `/checkout/v2/review`. Inline Review accordion section removed.

## Key review URLs (goseamless alias)
- AHRI Lookup: `/pdp/uc-ahri-matched-system?signedin=1` · V2 all-open: add `&ahri=all`
- AHRI system detail: `/ahri/215217523`
- Checkout: `/checkout?demo=1` (v1) · `/checkout/v2?demo=1` + `/checkout/v2/review?demo=1` · `/checkout/v3?demo=1` + `/checkout/v3/review?demo=1`
- Homans Contact-Us: `/pdp/homans-contact-us?signedin=1` · `/search/homans-contact-us?signedin=1`
- PLP list + v2: `/search?q=blower%20motor&signedin=1` · `/search/plp-v2?signedin=1`
- Shopping list: `/dashboard/shopping-lists/hvac-maintenance-kit`
- Tab styles: `/pdp/about-variants`
- Master index: `/pdp`

## Open / possible next
- Full **Specifications** block on the AHRI detail page like ecmdi (AHRI Type, Indoor Air Quantity, Phase, BTU Input, Indoor/Furnace Unit Model…). Ryan approved current layout → optional.
- Columns/View-in-Table is V1 only (after results collapse to chips); not wired into V2 all-open.
- PDP's own "Customers Also Purchased" (above the tabs) still uses the registry's Tutco/DiversiTech set — separate from the detail-page TRADEPRO cross-sell; left as-is.
