# Muse Spec — Extract Design System (watscobuild)

**Type:** spec-authoring (not a build). Produces `docs/design-system.md` + `docs/design-system-refs/` screenshots.
**Owner:** Claude (WatscoReborn session). **Executor:** Muse.
**Authored:** 2026-08-11. **Fire when:** David greenlights in morning shift.
**Prereq:** dev server running on `http://localhost:3001` (started before fire, since QA role screenshots live pages).

## 1. Objective

Produce **one** authoritative, exhaustive document at `docs/design-system.md` that captures every token, primitive, pattern, and convention this codebase already uses — so every future Muse build spec has a comparator, and so QA/Design roles have a rubric other than "vibes."

This is **not** a rewrite of the design system. It is an **extraction** of what is already true in the code + the vendored Design System v2 package, made legible in one file. Where the code disagrees with the vendored package, the code wins (it's what ships); flag the delta in an "Open questions" section.

## 2. Read these files FIRST (in this order)

**Fleet operating rules — non-negotiable:**
- `~/Developer/ClaudeCode/_global/muse-workflow.md` — the Design System Reference contract (§"Design System Reference — REQUIRED per project"). Your output must satisfy the 10-section list there.
- `~/Developer/ClaudeCode/_global/accessibility.md` — WCAG 2.2 AA is the a11y bar. Note it in the doc.
- `~/Developer/ClaudeCode/_global/tech-and-quality.md` — stack defaults, DoD framing.

**Code — source of truth for tokens & primitives (this repo):**
- `app/globals.css` — semantic shadcn tokens + extended intent (success/warning/navbar) + ecommerce (price/sale-price/stock states/rating-star) + brand-chrome tokens for 7 distributors + charts. **Both light + dark values.** Extract every `--*` custom property.
- `postcss.config.mjs`, `tsconfig.json`, `next.config.ts`, `components.json` — build config that affects the system (shadcn New York style, Tailwind v4 via PostCSS, path aliases).
- `components/ui/*.tsx` (30 files) — the shadcn New York primitive layer. For each: name, imported name, variant/size props (from CVA where present), and one canonical example usage.
- `app/components/page.tsx` + `app/components/_sections/*.tsx` + `app/components/_showcase.tsx` — **David's stated source of truth for what the system looks like assembled.** Every primitive shown here across "every state." Extract categories: Actions, Badges (labels), Forms, Feedback, Overlays, Data, Navigation, Media.

**Code — Watsco-specific patterns (this repo):**
- `app/pdp/_lib/brands.ts` + `app/pdp/_lib/chrome.tsx` — the 7 distributor brand-chrome patterns (Carrier Enterprise, Gemaire, Baker, Peirce, ECMDI, DCNE, Homans). Each has: brand accent hex, header pattern, footer pattern, and any brand-specific interaction (e.g. Gemaire cart badge color).
- `app/pdp/_lib/pdp.tsx`, `summary.tsx`, `fbt.tsx`, `about.tsx`, `details.tsx`, `parts.tsx`, `open-questions.tsx`, `showcase*.tsx` — buy-box / FBT / parts patterns.
- `app/pdp/tab-styles/page.tsx` — **6 tab-style variants** (soft, solid, bordered, pill-solid, pill-white, boxed-card). Screenshot each.
- `app/pdp/accordion-styles/page.tsx` — **3+ accordion variants** (plus-minus, status-dot, circular-chevron). Screenshot each.
- `app/typography/page.tsx` — type scale + role → class → computed size mapping.
- `app/product/page.tsx` — product-card pattern.

**Vendored Design System v2 (external reference, does NOT ship in this repo):**
- `~/Documents/Watsco/Watsco Design System v2/readme.md` — overview
- `~/Documents/Watsco/Watsco Design System v2/tokens/fig-tokens.css` — Figma-exported design tokens (color, spacing, radii)
- `~/Documents/Watsco/Watsco Design System v2/tokens/fonts.css` — font stacks
- `~/Documents/Watsco/Watsco Design System v2/guidelines/*.card.html` — 14 guideline cards (color families, spacing scale, radius scale, elevation, motion, type body/display/label). Read all; distill their rules into the doc.
- `~/Documents/Watsco/Watsco Design System v2/_ds_manifest.json` — machine-readable manifest of the system's components/tokens (55 KB — the structural index).
- `~/Documents/Watsco/Watsco Design System v2/components/`, `templates/`, `ui_kits/` — reference components.

**Context (the handoff — read for framing, not extraction):**
- `CLAUDE.md` (repo root) — what this project is + conventions.
- FC Brain: `watsco/handoff/state-2026-08-09.md` — architecture, decisions, learnings. Fold the "Design-system decisions & learnings" bullet into the doc's Conventions section verbatim (Price gated to logged-in, statuses inline not badges, UoM `/ EACH`, sticky image column, sale-price treatment, low-stock AA-darkened orange, etc.).

## 3. Output — what to produce

### 3a. `docs/design-system.md` — the canonical doc

Structure per `_global/muse-workflow.md` §"Design System Reference," extended with Watsco-specific sections. Every section must be **exhaustive** (list every item, not "e.g."), and every claim must be **verifiable** (name the file the pattern lives in).

1. **Preamble** — what this doc is, who it's for (QA + Design roles compare against it before every fix cycle), and how to update it when patterns evolve.
2. **Tokens**
   - **Semantic colors** (shadcn): every `--color-*` from `globals.css`, with hex, CSS variable, semantic name, light + dark values, and 1-line "when to use."
   - **Extended intent**: success, warning, navbar — same treatment.
   - **Ecommerce**: price, sale-price, in-stock, low-stock (note the AA-darkened orange), out-of-stock, rating-star.
   - **Brand chrome (7 distributors)**: each brand's accent + secondary tokens, sourced from `app/pdp/_lib/brands.ts` (authoritative in code) with the `.card.html` guideline cross-linked. Flag any delta between code and Design System v2 as an Open Question — do **not** silently reconcile.
   - **Charts**: chart-1, chart-2 (extend if more exist).
   - **Fonts**: Roboto + Roboto Mono stacks per `globals.css` `@theme` block.
   - **Spacing scale**: pull from the Design System v2 guideline card + Tailwind defaults; note any custom values in `globals.css`.
   - **Radii**: pull from `radius-scale.card.html`; verify against `--radius-*` in `globals.css`.
   - **Elevation / shadow**: from `elevation.card.html`.
   - **Motion**: durations + easings from `motion.card.html`; note that reduced-motion must be respected (per accessibility.md).
3. **Type scale** — every H tag + body role: class + computed size + weight + line-height. Cross-check `app/typography/page.tsx` with `type-*.card.html` cards.
4. **Component inventory** — every file in `components/ui/`. For each: name, import path, variant/size props (from CVA), 1-line "use when" + 1-line "don't use when" if the /components showcase implies it.
5. **Layout patterns**
   - Container widths (e.g. `max-w-6xl` in `/components` header; check other pages for consistency).
   - Section rhythm (padding/margin patterns between sections).
   - Grid patterns (product grids, FBT 4-across, branch availability 2-col, etc.).
   - Breakpoints (Tailwind defaults; note where responsive behavior kicks in per component).
6. **Button convention** — every button role in the app. Concrete: primary CTA, secondary, ghost, destructive, icon-only (PRO Picks Add-to-Cart), text-only. For each: class, label convention (verb-first, sentence case), href pattern where applicable.
7. **Interaction rules** — hover / focus / active state patterns. Transition timing (from motion.card.html). Reduced-motion behavior. Focus ring: `focus-visible:ring-[3px] focus-visible:ring-ring/50` (from `/components/page.tsx`).
8. **Responsive rules** — 375 / 768 / 1024 / 1280 (per the fleet's Standing Quality Bar). Document what visibly changes at each break.
9. **Brand voice** — copy patterns from the existing PDPs (buy-box copy, gated-signin copy, statuses like "Non-Sellable" vs "Requires License", CTA verbs). Not a marketing tone guide — extraction of what is currently written.
10. **Iconography** — lucide-react is the source; note the sizing conventions used across the app.
11. **Section pattern library** — hero patterns? PDP header? Brand chrome variants? Master-index card? Enumerate the section-level patterns already in use so builds can mirror them.

### Watsco-specific sections (extend beyond the fleet template):

12. **Distributor brand chrome catalog** — one subsection per distributor (Carrier Enterprise, Gemaire, Baker, Peirce-Phelps, ECMDI, DCNE, Homans). Screenshot header + footer at 1280 width. Callout: real hex, source URL modeled from (per handoff §4), and whether accents are approximate or matched.
13. **Style-variant catalog**
    - **Tab styles** — 6 variants from `/pdp/tab-styles`. Screenshot each. Name + when-to-use.
    - **Accordion styles** — 3+ variants from `/pdp/accordion-styles`. Same treatment.
14. **PDP composition patterns** — buy-box, FBT (4-across, "Customers Also Purchased" with %), Parts, PRO Picks (icon-only Add-to-Cart + narrow qty), Substitutes, Recently Viewed, About-vs-Tabs `detailsStyle` fork, AHRI matched / AHRI empty, Bundle + Rebate, Pack Size pills, Non-Sellable state, Requires-License state, Strike-thru pricing, Replacement Products list.
15. **PDP conventions (from decisions log)** — verbatim from FC handoff §6: price gated to logged-in, statuses inline (not badges), Prop 65 text-only, UoM `/ EACH` (space after slash), sale/strike-thru red no-"Reg."-prefix, sticky image column, branch availability 2-col + Homans call-based note, low-stock orange AA-darkened, Scene7 CDN image wiring.
16. **Emerging patterns / to be added** — placeholder section. David flagged that "new patterns are being worked out." Muse leaves this section with an explicit "*(to be captured after next design round)*" note. Do not invent patterns.
17. **Open questions** — anywhere the code disagrees with Design System v2, or the guideline cards are ambiguous, list here. Do not silently reconcile.
18. **How to update this doc** — 1 paragraph: for small updates, edit directly; for major shifts, re-run this Muse job. Every subsequent Muse build spec must reference specific sections here.

### 3b. `docs/design-system-refs/` — screenshots

Per component group + per pattern + per brand + per style variant, screenshot from the live dev server at 1280 width (default) plus 375 width for anything responsive. Naming: `<section>__<name>__<viewport>.png`. E.g. `type-scale__h1-through-body__1280.png`, `brand-chrome__ecmdi-header__1280.png`, `tab-styles__pill-white__1280.png`, `pdp-composition__buy-box__1280.png`, `pdp-composition__buy-box__375.png`.

Screenshots are Muse's own reference for future QA runs; David does not need to review them.

## 4. Design-system constraints (for the doc itself)

- **Format:** plain Markdown. No fancy diagrams. Fenced code blocks for tokens and class strings.
- **Length ceiling:** none. Exhaustiveness is the point.
- **Verifiability:** every claim cites a file path (relative to repo root) or an external file path (for the Design System v2 package).
- **Tone:** operational, not marketing. Written for another engineer or designer to open, ctrl-F, and find the exact answer.

## 5. Internal team (Muse spawns)

- **Frontend / Extractor** — reads code, produces the Markdown. Does not modify any source files.
- **QA / Verifier** — for every claim in the doc, opens the cited file and confirms the claim is true. Files "unverified" markers back to Extractor. Also runs the screenshot pass at 1280 + 375 for every listed pattern.
- **Designer / Cross-checker** — reads the vendored Design System v2 guideline cards and cross-references them against the extracted doc. Files delta notes for the "Open questions" section.

Iterate until: every section has content, no "unverified" markers remain, every screenshot exists, and the doc's Open questions section captures every unresolved delta between code and vendored guidelines.

## 6. Definition of Done

- [ ] `docs/design-system.md` exists and covers all 18 sections above.
- [ ] Every token in `globals.css` (semantic, extended, ecommerce, brand-chrome × 7, charts) appears in the doc with hex + variable + semantic name + light + dark values.
- [ ] Every file in `components/ui/` appears in the Component inventory.
- [ ] Every distributor (7) has a chrome subsection with header + footer screenshot.
- [ ] Every tab style (6) and accordion style (3+) has a screenshot in `design-system-refs/`.
- [ ] Every PDP composition pattern from §14 has a screenshot at 1280 AND 375.
- [ ] Open Questions section contains at minimum: (a) brand-accent approximate-vs-matched status per handoff §4, (b) any delta between `globals.css` and `Watsco Design System v2/tokens/fig-tokens.css`, (c) any delta between `components/ui/*` and Design System v2's `components/` folder.
- [ ] No source files modified (this is spec-authoring, not a build). Only writes: `docs/design-system.md` + files under `docs/design-system-refs/`.
- [ ] Muse's own build hygiene checks (`pnpm build` / `pnpm lint` / `npx tsc --noEmit`) pass — since no source changed, these must remain green.

## 7. What NOT to do

- **Do not** modify any file in `app/`, `components/`, `lib/`, `registry/`, `public/`, `globals.css`, `package.json`, `tsconfig.json`. Read-only against source.
- **Do not** invent tokens or patterns not present in the code. If a section has no source, write "*(none in codebase yet)*" — do not fabricate.
- **Do not** silently reconcile deltas between the code and the vendored guidelines. Flag them in Open Questions.
- **Do not** produce a "here's what your system SHOULD be" doc. This is descriptive, not prescriptive.
- **Do not** run any Muse build jobs. This is spec-authoring only.
- **Do not** commit or push. Claude commits after review.

## 8. Followup (out of scope for this spec — separate Muse job later)

After `docs/design-system.md` lands and Claude reviews it:
- **`audit-and-align-to-design-system`** Muse job — walks every page (`/`, `/pdp`, `/pdp/[slug]` for each of the 17+ slugs, `/pdp/chrome/[brand]` × 7, `/pdp/tab-styles`, `/pdp/accordion-styles`, `/components`, `/typography`, `/product`) and files a defect list wherever a page is drifting from the extracted design system. That's the "make sure all pages are connected to the design system" ask from David. Do NOT bundle into this run.

## 9. How to fire

```bash
cd ~/Developer/ClaudeCode/watsco/watscobuild
# Ensure dev server is up so QA role can screenshot live pages:
npm run dev &   # port 3001 is pinned
# Then fire Muse:
muse exec \
  --prompt-file docs/muse-specs/extract-design-system.md \
  --workspace . \
  --disable-approval \
  --max-model-steps 200 \
  --reasoning-effort high \
  --parallel-tool-calls \
  > .muse-runs/extract-design-system.log 2>&1 &
```

Expected cost per `_global/muse-workflow.md` "Cost expectations": **$1–5** (spec-authoring + screenshot pass, no source edits). If Muse's log shows spend approaching $20, kill and escalate.

## 10. Post-Muse (Claude does, not Muse)

1. `judge-qa` agent pass against `docs/design-system.md` — does the doc actually satisfy §6 DoD? Any missed sections, hallucinated tokens, unflagged deltas?
2. If clean: commit + push (`docs: add design-system.md (extract-design-system Muse run)`).
3. Notify David with the on-disk path + a link to the committed file on GitHub. Mention the "Emerging patterns" and "Open questions" sections need his attention before the next Muse job fires.
