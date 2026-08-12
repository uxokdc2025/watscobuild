# design-system-refs — screenshots

> Spec requires: per component group + per tab variant (6) + per accordion variant (3+) + per brand chrome (7 × header/footer) + per PDP composition pattern (§14) at **1280** (default) + **375** for responsive patterns.
> Naming: `<section>__<name>__<viewport>.png`
> Examples: `tab-styles__line__1280.png`, `brand-chrome__ecmdi__1280.png`, `pdp-composition__buy-box__1280.png`, `components__showcase__1280.png`

## Captured

**Backfill run: 2026-08-12 · 45 PNGs.** Playwright (chromium, deviceScaleFactor=2, `networkidle`, full-page). Signed-in state on PDP + brand-chrome pages driven by the `?signedin=1` query param (see `app/pdp/[slug]/page.tsx` — the auth context is initialized from that server prop; the earlier README note about `localStorage.setItem('signedIn', '1')` is superseded).

Coverage:
- Master + showcase (7 URLs × 2 viewports) — home, `/pdp`, `/components`, `/typography`, `/product`, `/pdp/tab-styles`, `/pdp/accordion-styles`
- Brand chrome (7 distributors × 1280 only) — carrier, gemaire, baker, peirce, ecmdi, dcne, homans
- PDP composition (12 patterns × 2 viewports) — buy-box, replacement-products, ahri-matched, pack-size, bundle-rebate, earning-points, non-sellable, requires-license, strike-thru, livo-mini-split, about-layout-carrier, ecmdi-flush

All URLs returned HTTP 200. Script: `.muse-runs/screenshot-backfill.mjs` · log: `.muse-runs/screenshot-backfill.log`.

## How to re-capture

```bash
cd ~/Developer/ClaudeCode/watsco/watscobuild
npm run dev &  # port 3001 pinned — must be up
node .muse-runs/screenshot-backfill.mjs
```

## Checklist (paste into PR)

- [x] `components__showcase__{1280,375}.png`
- [x] `brand-chrome__<brand>__1280.png` ×7
- [x] `tab-styles__all-variants__{1280,375}.png`
- [x] `accordion-styles__all-variants__{1280,375}.png`
- [x] `pdp-composition__<pattern>__{1280,375}.png` ×12
- [x] `typography__scale__{1280,375}.png`, `product__page__{1280,375}.png`, `home__root__{1280,375}.png`, `pdp-master__index__{1280,375}.png`
