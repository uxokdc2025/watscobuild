# design-system-refs — screenshots

> Spec requires: per component group + per tab variant (6) + per accordion variant (3+) + per brand chrome (7 × header/footer) + per PDP composition pattern (§14) at **1280** (default) + **375** for responsive patterns.
> Naming: `<section>__<name>__<viewport>.png`
> Examples: `tab-styles__line__1280.png`, `brand-chrome__ecmdi-header__1280.png`, `pdp-composition__buy-box__1280.png`, `components__actions__1280.png`

## Status

`docs/design-system.md` landed (811 lines / 83 KB, all 18 sections, build green). Screenshot pass is **pending** — the sandbox blocks `listen` on any host/port (`EPERM: operation not permitted 0.0.0.0:3001` and `127.0.0.1:8787` both rejected) so a live `next start`/`next dev` server cannot be started inside the sandbox to capture screenshots. The doc itself describes every pattern with file-path citations so the rubric is usable now; screenshots are a mechanical add-on once a server is running outside the sandbox (local Mac, CI, or Vercel preview).

## How to capture

```bash
cd ~/Developer/ClaudeCode/watsco/watscobuild
npm run dev &  # port 3001 pinned — must be up for screenshots
# QA/Verifier role: open each route with Playwright (or browser) at 1280 and 375, screenshot per naming above.
# Routes to cover:
# /components, /typography, /product,
# /pdp, /pdp/[slug] ×17+ (include each brandKey and each useCase),
# /pdp/chrome/[brand] ×7, /pdp/tab-styles, /pdp/accordion-styles
```

## Checklist (paste into PR)

- [ ] `components__<group>__1280.png` ×8 groups (Actions, Badges, Forms, Feedback, Overlays, Data, Navigation, Media)
- [ ] `brand-chrome__<brand>-header__1280.png` + `brand-chrome__<brand>-footer__1280.png` ×7
- [ ] `tab-styles__<variant>__1280.png` + `__375.png` ×6
- [ ] `accordion-styles__<variant>__1280.png` + `__375.png` ×3+
- [ ] `pdp-composition__<pattern>__1280.png` + `__375.png` × all §14 patterns
- [ ] `type-scale__*__1280.png`, `product__card__1280.png` + `__375.png`
