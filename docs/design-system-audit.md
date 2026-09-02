# Watsco Design System — Consistency Audit

_Generated 2026-09-02. The design system (`/components`) is the single source of truth.
Every style / component / color / type on any page must point to it. This audit lists where
pages drift, so we can reconcile them to the real components._

## Executive summary

- **~70 discrepancies across 18 files.** The library `<Button>`, `<Badge>`, `<Input>` primitives
  are bypassed pervasively; hover/focus/disabled states drift because ad-hoc elements hard-code
  `hover:bg-primary/90`, `hover:bg-accent`, and inconsistent focus rings
  (`ring-[3px] ring-ring/50` vs `ring-2 ring-ring`).
- **Worst offenders:** `app/pdp/page.tsx` (11 hand-rolled link-buttons), the `app/dashboard/*`
  tree (almost nothing uses `<Button>`), `app/store-locator/_drawers.tsx` +
  `_inventory-drawers.tsx` (same actions built two ways), `app/pdp/_lib/about.tsx` +
  `product-card.tsx`.
- **Header/footer brand-color separation is clean** — all `--brand-*` tokens live in
  `chrome.tsx`/`brands.ts` as intended — **except** the account/checkout bodies leak
  `bg-brand-homans*` into page content (Category 4). That is the only brand-boundary violation,
  and it needs a design decision (intended "default brand" theming vs. violation).

Good in-repo examples that already do it right: `app/dashboard/addresses/_components/address-card.tsx`,
`app/checkout/_components/checkout-client.tsx`, `app/pdp/_lib/parts.tsx`, `app/pdp/_lib/summary.tsx`.

## Category 1 — Elements styled as buttons → must become `<Button>` (top priority)

- `app/pdp/_lib/about.tsx:667, 706, 743` — "View Product" `<a>` → `<Button asChild variant="outline" size="sm">`. **[FIXED 2026-09-02]**
- `app/pdp/_lib/about.tsx:271` "View Supersedes", `:347` "Add To Cart" (off-palette green), `:357` "Save To List".
- `app/pdp/_lib/product-card.tsx:166` — "Add" hand-rolls the entire default variant. High impact (most-reused card).
- `app/pdp/page.tsx:86, 95, 170, 180, 250, 259, 268, 436, 495` — link-buttons re-declaring outline/default; `:273` off-palette `bg-neutral-900`.
- `app/store-locator/_drawers.tsx:131, 142` and `_inventory-drawers.tsx:258, 325, 404` — Select / See More Branches built by hand (siblings already use `<Button>`).
- `app/store-locator/page.tsx:29`, `inventory/page.tsx:34` — "See in PLP".
- `app/dashboard/*` — `page.tsx:66,69,104`; `orders/page.tsx:30`; `card-management/page.tsx:128,165,176,375`; `shopping-lists/page.tsx:190,212,217,221,390,400,406,480,486`; `saved-carts/page.tsx:8`; `_components/dashboard-shell.tsx:49`.
- `app/pdp/_lib/fbt.tsx:161` (off-palette slate); `account-flyout.tsx:86,87,92` (also drifted focus ring); `app/search/_lib/search-body.tsx:649,657,671` (use `pagination.tsx`); `app/pdp/_components/gallery.tsx:46`; `app/typography/page.tsx:98`.

## Category 2 — Re-declaring variant classes the library already provides

Hand-typed `hover:bg-accent hover:text-accent-foreground` (outline/ghost hover),
`bg-primary … hover:bg-primary/90` (default), and `focus-visible:ring-[3px] ring-ring/50` on
non-library elements — they will silently diverge on any token change. **Focus-ring drift is the
client's exact complaint:** dashboard + account-flyout use `ring-2 ring-ring (+ring-offset-2)`
instead of the library's `ring-[3px] ring-ring/50`. Fix by routing through `<Button>`/`<Input>`.

## Category 3 — Same action, inconsistent build

- **"Add to Cart" built 5 ways** — `summary.tsx:332` (lg), `parts.tsx:61` (sm), `search-body.tsx:589` (sm),
  `about.tsx:773` (sm) are correct; `product-card.tsx:166` (hand-rolled blue) and `about.tsx:347`
  (hand-rolled **green**) are not. Normalize to `<Button size="sm">`.
- Store-locator Select/See-More built both ways across sibling drawers.
- "Current Store" tag: span vs Button, off-palette `emerald-600`.
- Price color: `text-price` in summary/search but `text-foreground` in `product-card.tsx:281`.

## Category 4 — Brand color outside header/footer (needs a decision)

Homans BU color bleeds into page bodies: `dashboard-shell.tsx:20` (`bg-brand-homans-bg`),
`dashboard/page.tsx:78`, `orders/page.tsx:35` (`bg-brand-homans` banner),
`checkout-client.tsx:30,32,37` (`bg-brand-homans-bg`). If a signed-in "default brand" theme is
intended, make it an explicit token, not `--brand-*` in content; otherwise it violates one-theme.
Minor: `pdp/page.tsx:67,140` raw `b.accent` legend dots (internal page).

## Category 5 — Badges / inputs / pagination hand-rolled

- **Badges as raw spans** instead of `<Badge>`: `dashboard/page.tsx:89,90,118`; `orders/page.tsx:36`;
  `quotes/page.tsx:30`; `shopping-lists/page.tsx:300`; `saved-carts/page.tsx:8`;
  `pdp/page.tsx:73,147,155,301,326,360`; `card-management/page.tsx:91` (off-palette chips).
- **Inputs as raw `<input>`** instead of `<Input>`/`<Textarea>` (focus drift): `about.tsx:137,189,445`;
  `open-questions.tsx:125,141`; `checkout-client.tsx:62`; `dashboard/page.tsx:63,103`;
  `orders/page.tsx:29`; `card-management/page.tsx:202,232,244,262…`; `shopping-lists/page.tsx:206,363,373,446`.
- **Pagination** hand-rolled in `search-body.tsx:630-678` though `pagination.tsx` exists.

## Non-issues
- `chrome.tsx` brand buttons/tokens = legitimate chrome.
- `shopping-lists` `COLORS` array = user-selectable label colors (data), not brand color.
- `summary.tsx:109` violet "AHRI Matched System" = semantic feature accent, not a distributor color.
