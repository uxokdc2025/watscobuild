# watscobuild — Design System Reference

> **What this is:** An exhaustive extraction of every token, primitive, pattern, and convention that actually ships in this codebase. Descriptive, not prescriptive — the code is the source of truth.
>
> **Who it's for:** QA and Design roles on every future Muse build (compare against this doc before filing defects), plus any engineer opening the repo cold who needs to find the canonical answer by `Ctrl-F`.
>
> **How to use it:** Each claim cites its source file (relative to repo root) or an external vendored path for the Watsco Design System v2 package. If code and the vendored package disagree, **the code wins** — the delta is logged in §17 Open Questions.

**Source files this doc was extracted from** (read order per spec):
- `app/globals.css` — all `--*` tokens, light + dark
- `postcss.config.mjs`, `tsconfig.json`, `next.config.ts`, `components.json` — build config
- `components/ui/*.tsx` — 31 primitives (New York style)
- `app/components/page.tsx`, `app/components/_sections/*.tsx`, `app/components/_showcase.tsx` — assembled showcase (David's source of truth)
- `app/pdp/_lib/brands.ts`, `app/pdp/_lib/chrome.tsx` — 7 distributor chromes
- `app/pdp/_lib/summary.tsx`, `fbt.tsx`, `about.tsx`, `details.tsx`, `parts.tsx`, `pdp.tsx`, `showcase*.tsx`, `types.ts`, `registry.ts`
- `app/pdp/tab-styles/page.tsx`, `app/pdp/accordion-styles/page.tsx`, `app/typography/page.tsx`, `app/product/page.tsx`
- `app/layout.tsx`, `lib/utils.ts`
- Vendored reference (does NOT ship): `~/Documents/Watsco/Watsco Design System v2/` — `tokens/fig-tokens.css`, `tokens/fonts.css`, `guidelines/*.card.html`, `_ds_manifest.json`, `components/`, `templates/`
- `~/Developer/ClaudeCode/_global/muse-workflow.md`, `accessibility.md`, `tech-and-quality.md`, `CLAUDE.md`, `~/Developer/ClaudeCode/watsco/docs/handoff/state-2026-08-09.md`

**A11y bar:** WCAG 2.2 AA per `~/Developer/ClaudeCode/_global/accessibility.md` (contrast 4.5:1 for normal text, 3:1 for large, 44×44px touch targets, keyboard + `prefers-reduced-motion`).

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript (`strict`) · Tailwind v4 via `@tailwindcss/postcss` · shadcn New York · `lucide-react` · Radix (via `radix-ui`) · Embla Carousel · `next-themes` · `sonner` · `zod`. Package manager in this repo is **npm** (`npm run dev -- -p 3001`). Port **3001** is pinned (see `package.json` + `.claude/launch.json`). See `components.json` for shadcn config.

---

## 1. Preamble

This document exists because QA and Design need a comparator. Without one, reviews are vibes. This doc makes "on-system" falsifiable: every token value, every component prop, every layout pattern, every brand chrome, every PDP edge-state has a file path you can open.

### How to update

- **Small change** (new token value, new badge color, new PDP status): edit this file directly in the same PR that touches `globals.css` / `components/ui/*` / `app/pdp/_lib/*`. Keep the file-path citations accurate.
- **Major shift** (new brand chrome, new style-variant catalog, re-tokenization against Design System v2): re-run the `extract-design-system` Muse job (spec at `docs/muse-specs/extract-design-system.md`). That job is spec-authoring only — it never modifies `app/`, `components/`, or `globals.css`.
- **Every subsequent Muse build spec must cite specific sections of this doc** in its "Read these files first" list so the QA/Designer roles have a shared rubric.

---

## 2. Tokens

All tokens live in `app/globals.css`. The `@theme inline` block maps every `--color-*` / `--radius-*` to a `--*` value defined in `:root` (light) and overridden in `.dark`. The page body is set in `@layer base`: `* { @apply border-border outline-ring/50; }` and `body { @apply bg-background text-foreground; }`.

### 2.1 Semantic colors (shadcn)

Source: `app/globals.css` — `@theme inline` → `:root` (light) / `.dark` (dark). Values shown as written in the file (oklch).

| Semantic | CSS var | Light (`:root`) | Dark (`.dark`) | When to use |
|---|---|---|---|---|
| `background` | `--background` / `--color-background` | `oklch(1 0 0)` (white) | `oklch(0.091 0.005 285.823)` (near-black zinc-950) | Page canvas |
| `foreground` | `--foreground` / `--color-foreground` | `oklch(0.141 0.005 285.823)` (zinc-950) | `oklch(0.985 0 0)` (zinc-50) | Primary text |
| `card` | `--card` / `--color-card` | `oklch(1 0 0)` | `oklch(0.17 0.006 285.885)` (zinc-900) | Card surface |
| `card-foreground` | `--card-foreground` / `--color-card-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Text on card |
| `popover` | `--popover` / `--color-popover` | `oklch(1 0 0)` | `oklch(0.17 0.006 285.885)` | Popover/dropdown surface |
| `popover-foreground` | `--popover-foreground` / `--color-popover-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Text on popover |
| `primary` | `--primary` / `--color-primary` | `oklch(0.597 0.167 253.1)` — vivid blue | same | Primary actions, links, brand accent for generic chrome |
| `primary-foreground` | `--primary-foreground` / `--color-primary-foreground` | `oklch(1 0 0)` | same | Text on primary |
| `secondary` | `--secondary` / `--color-secondary` | `oklch(0.92 0.004 286.32)` (zinc-200) | `oklch(0.244 0.006 286.033)` (zinc-800) | Secondary button fill, muted pills |
| `secondary-foreground` | `--secondary-foreground` / `--color-secondary-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Text on secondary |
| `muted` | `--muted` / `--color-muted` | `oklch(0.967 0.001 286.375)` (zinc-100) | `oklch(0.21 0.006 285.885)` (zinc-900) | Muted backgrounds (footer `bg-muted/40`, muted track) |
| `muted-foreground` | `--muted-foreground` / `--color-muted-foreground` | `oklch(0.552 0.016 285.938)` (zinc-500) | `oklch(0.705 0.015 286.067)` (zinc-400) | Secondary text, captions |
| `accent` | `--accent` / `--color-accent` | `oklch(0.597 0.167 253.1)` (same as primary) | same | Hover fills (`hover:bg-accent`) |
| `accent-foreground` | `--accent-foreground` / `--color-accent-foreground` | `oklch(1 0 0)` | same | Text on accent |
| `destructive` | `--destructive` / `--color-destructive` | `oklch(0.577 0.245 27.325)` (red-600) | same | Errors, delete actions |
| `destructive-foreground` | `--destructive-foreground` / `--color-destructive-foreground` | `oklch(0.971 0.013 17.38)` (red-50) | same | Text on destructive |
| `border` | `--border` / `--color-border` | `oklch(0.911 0.006 286.286)` (zinc-200) | `oklch(0.270 0.013 285.805)` (zinc-700) | Borders, dividers |
| `input` | `--input` / `--color-input` | `oklch(0.871 0.006 286.286)` (zinc-300) | `oklch(0.290 0.013 285.805)` (zinc-700) | Input borders |
| `ring` | `--ring` / `--color-ring` | `oklch(0.597 0.167 253.1)` (blue) | same | Focus ring color |
| `chart-1` | `--chart-1` / `--color-chart-1` | `oklch(0.546 0.245 262.881)` (blue-600) | `oklch(0.488 0.243 264.376)` (blue-700) | Chart series 1 |
| `chart-2` | `--chart-2` / `--color-chart-2` | `oklch(0.707 0.165 254.624)` (blue-400) | `oklch(0.623 0.214 259.815)` (blue-500) | Chart series 2 |
| `chart-3` | `--chart-3` / `--color-chart-3` | `oklch(0.809 0.105 251.813)` (blue-300) | `oklch(0.707 0.165 254.624)` | Chart series 3 |
| `chart-4` | `--chart-4` / `--color-chart-4` | `oklch(0.882 0.059 254.128)` (blue-200) | `oklch(0.809 0.105 251.813)` | Chart series 4 |
| `chart-5` | `--chart-5` / `--color-chart-5` | `oklch(0.932 0.032 255.585)` (blue-100) | `oklch(0.882 0.059 254.128)` | Chart series 5 |
| `sidebar` | `--sidebar` / `--color-sidebar` | `oklch(0.985 0 0)` (zinc-50) | `oklch(0.16 0.006 285.885)` | Sidebar canvas (if used) |
| `sidebar-foreground` | `--sidebar-foreground` / `--color-sidebar-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Text on sidebar |
| `sidebar-primary` | `--sidebar-primary` / `--color-sidebar-primary` | `oklch(0.597 0.167 253.1)` | same | Sidebar primary accent |
| `sidebar-primary-foreground` | `--sidebar-primary-foreground` / `--color-sidebar-primary-foreground` | `oklch(1 0 0)` | same | Text on sidebar primary |
| `sidebar-accent` | `--sidebar-accent` / `--color-sidebar-accent` | `oklch(0.967 0.001 286.375)` | `oklch(0.244 0.006 286.033)` | Sidebar accent fill |
| `sidebar-accent-foreground` | `--sidebar-accent-foreground` / `--color-sidebar-accent-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Text on sidebar accent |
| `sidebar-border` | `--sidebar-border` / `--color-sidebar-border` | `oklch(0.911 0.006 286.286)` | `oklch(0.270 0.013 285.805)` | Sidebar border |
| `sidebar-ring` | `--sidebar-ring` / `--color-sidebar-ring` | `oklch(0.597 0.167 253.1)` | same | Sidebar focus |

### 2.2 Extended intent

Source: `app/globals.css` `@theme inline` → `:root` / `.dark`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--success` / `--color-success` | `oklch(0.596 0.145 163.225)` (emerald-600) | same | Success states, in-stock text |
| `--success-foreground` | `oklch(1 0 0)` | same | Text on success |
| `--warning` / `--color-warning` | `oklch(0.828 0.189 84.429)` (amber-400) | same | Warning banners, license-gated `InfoBanner` |
| `--warning-foreground` | `oklch(0.279 0.077 45.635)` (amber-950) | same | Text on warning |
| `--navbar` / `--color-navbar` | `oklch(0.985 0 0)` (zinc-50) | `oklch(0.17 0.006 285.885)` | Top nav / app chrome bg (generic) |
| `--navbar-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Text on navbar |

### 2.3 Ecommerce

Source: `app/globals.css` `:root` / `.dark`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--price` / `--color-price` | `oklch(0.21 0.006 285.885)` (zinc-900) | `oklch(0.985 0 0)` | Regular price |
| `--sale-price` / `--color-sale-price` | `oklch(0.577 0.245 27.325)` (red-600) | `oklch(0.704 0.191 22.216)` (red-400) | Sale / strike-thru "was" price context — sale price itself is red |
| `--in-stock` / `--color-in-stock` | `oklch(0.596 0.145 163.225)` (emerald-600) | `oklch(0.696 0.17 162.48)` (emerald-500) | "X in stock today" |
| `--low-stock` / `--color-low-stock` | `oklch(0.578 0.179 58.318)` (AA 4.55:1 on white; comment notes it was darkened from 3.20:1) | `oklch(0.828 0.189 84.429)` (amber-400) | Low-stock warning |
| `--out-of-stock` / `--color-out-of-stock` | `oklch(0.552 0.016 285.938)` (zinc-500) | `oklch(0.705 0.015 286.067)` (zinc-400) | Out of stock |
| `--rating-star` / `--color-rating-star` | `oklch(0.769 0.188 70.08)` (amber-500) | `oklch(0.828 0.189 84.429)` | Star rating fill |

Stock text helper: `components/ui/label-badges.tsx` exports `stockTextClass(qty)` and `BranchRow`; the PDP buy-box chooses `text-in-stock` / `text-low-stock` / `text-out-of-stock` based on branch qty.

### 2.4 Brand chrome (7 distributors)

Source of truth is **code** (`app/globals.css` brand tokens + `app/pdp/_lib/brands.ts` accents + `app/pdp/_lib/chrome.tsx` headers/footers). Cross-linked to `~/Documents/Watsco/Watsco Design System v2/guidelines/*.card.html` where noted. Values are constants across light/dark ("a brand's blue is its blue").

| Distributor | `brandKey` | Tokens in `globals.css` | Hex | Used for |
|---|---|---|---|---|
| **Gemaire** | `gemaire` | `--brand-gemaire` | `#0080df` | Blue header bar (`bg-brand-gemaire`) |
| | | `--brand-gemaire-foreground` | `#ffffff` | Text on gemaire header |
| | | `--brand-gemaire-cart` | `#f26522` | Orange cart button (`bg-brand-gemaire-cart`) |
| **Baker Distributing** | `baker` | `--brand-baker` | `#c8102e` | Red (logo, nav underline, accents) |
| | | `--brand-baker-foreground` | `#ffffff` | Text on baker |
| | | `--brand-baker-bar` | `#3a3838` | Dark utility strip |
| | | `--brand-baker-bar-foreground` | `#ffffff` | Text on bar |
| **Carrier Enterprise** | `carrier` | `--brand-carrier` | `#3d2762` | Deep-purple nav |
| | | `--brand-carrier-foreground` | `#ffffff` | Text on carrier |
| | | `--brand-carrier-cart` | `#49a942` | Green cart accent |
| | | `--brand-carrier-bg` | `#f0f0f4` | Light-grey page canvas |
| **Peirce-Phelps** | `peirce` | `--brand-peirce` | `#00539b` | Blue (search, logo accent) |
| | | `--brand-peirce-foreground` | `#ffffff` | Text on peirce |
| | | `--brand-peirce-accent` | `#ea1336` | Red "Specials" highlight |
| **East Coast Metal Distributors (ECMDI)** | `ecmdi` | `--brand-ecmdi` | `#cb0015` | Red header/nav |
| | | `--brand-ecmdi-foreground` | `#ffffff` | Text on ecmdi |
| | | `--brand-ecmdi-footer` | `#636363` | Dark-charcoal footer |
| | | `--brand-ecmdi-footer-foreground` | `#ffffff` | Text on ecmdi footer |
| **DCNE** | `dcne` | `--brand-dcne` | `#001056` | Dark-navy utility bar |
| | | `--brand-dcne-foreground` | `#ffffff` | Text on dcne |
| **Homans Associates** | `homans` | `--brand-homans` | `#045ea9` | Primary blue (main bar, footer bottom bar) |
| | | `--brand-homans-foreground` | `#ffffff` | Text on homans |
| | | `--brand-homans-nav` | `#003874` | Darker category nav bar |
| | | `--brand-homans-bg` | `#f5f5f5` | Light-grey page canvas |

All brand values are sampled from live sites (comments in `globals.css` say "source-sampled"; `brands.ts` says "approximate brand blues/reds — refine against real brand assets when available"). See §17 Open Questions.

The Tailwind-mapped names are `bg-brand-*`, `text-brand-*-foreground`, etc. via `@theme inline` → ` --color-brand-*`.

### 2.5 Charts

Source: `app/globals.css` `:root` / `.dark` (see table in §2.1). Chart tokens are a 5-step blue ramp light→dark. Extend to `chart-1` … `chart-5`; no additional chart tokens exist in the codebase.

### 2.6 Fonts

Source: `app/globals.css` `@theme inline` + `app/layout.tsx`.

```ts
// app/layout.tsx — Next.js font optimization
import { Roboto, Roboto_Mono } from "next/font/google";
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });
const robotoMono = Roboto_Mono({ variable: "--font-roboto-mono", subsets: ["latin"] });
// Applied: <body className={`${roboto.variable} ${robotoMono.variable} font-sans antialiased`}>
```

| Token | Value | Source |
|---|---|---|
| `--font-sans` | `var(--font-roboto), ui-sans-serif, system-ui, sans-serif, ...` | `globals.css` `@theme inline` |
| `--font-mono` | `var(--font-roboto-mono), ui-monospace, "SFMono-Regular", "Menlo", ...` | `globals.css` `@theme inline` |
| `--font-roboto` | CSS variable injected by `next/font/google` (Roboto) | `app/layout.tsx` |
| `--font-roboto-mono` | CSS variable injected by `next/font/google` (Roboto Mono) | `app/layout.tsx` |

The body uses `font-sans` (Roboto) everywhere; `font-mono` is available for code/IDs. Note: the vendored Design System v2 (`tokens/fonts.css`) loads **Inter** + **Manrope** + **Roboto** + **Roboto Mono** + Material Icons from Google CDN; the shipped code uses **Roboto** as the actual UI font (delta — see §17).

### 2.7 Spacing scale

Source: `app/globals.css` `:root`.

**Base scale:**

| Token | Value |
|---|---|
| `--space-0` | `0` |
| `--space-px` | `1px` |
| `--space-0-5` | `0.125rem` (2px) |
| `--space-1` | `0.25rem` (4px) |
| `--space-1-5` | `0.375rem` (6px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-2-5` | `0.625rem` (10px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-3-5` | `0.875rem` (14px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.25rem` (20px) |
| `--space-6` | `1.5rem` (24px) |
| `--space-7` | `1.75rem` (28px) |
| `--space-8` | `2rem` (32px) |
| `--space-9` | `2.25rem` (36px) |
| `--space-10` | `2.5rem` (40px) |
| `--space-11` | `2.75rem` (44px) |
| `--space-12` | `3rem` (48px) |
| `--space-14` | `3.5rem` (56px) |
| `--space-16` | `4rem` (64px) |
| `--space-20` | `5rem` (80px) |
| `--space-24` | `6rem` (96px) |
| `--space-32` | `8rem` (128px) |

**Semantic spacing aliases:**

| Token | Value |
|---|---|
| `--spacing-component-xs` | `var(--space-1)` (4px) |
| `--spacing-component-sm` | `var(--space-2)` (8px) |
| `--spacing-component-md` | `var(--space-3)` (12px) |
| `--spacing-component-lg` | `var(--space-4)` (16px) |
| `--spacing-component-xl` | `var(--space-6)` (24px) |
| `--spacing-section` | `var(--space-8)` (32px) |
| `--spacing-page` | `var(--space-16)` (64px) |
| `--card-spacing` | `var(--space-6)` (24px) |
| `--input-px` | `var(--space-3)` (12px) |
| `--input-py` | `var(--space-2)` (8px) |
| `--btn-px-sm` | `var(--space-3-5)` (14px) |
| `--btn-px-md` | `var(--space-4)` (16px) |
| `--btn-px-lg` | `var(--space-5)` (20px) |

**Raw palette (color primitives):** `app/globals.css` also defines `--blue-*`, `--zinc-*`, `--emerald-*`, `--amber-*`, `--red-*`, `--sky-*` ramps used by badge compound variants. See `Badge` in §4.

Design System v2 spacing guideline (`spacing-scale.card.html`): the Figma source uses an 11-step scale `0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64` with some non-scale paddings like `7px 12px`. This codebase's scale is similar but expressed as Tailwind spacing; no snap mismatch is flagged beyond the usual rounding.

### 2.8 Radii

Source: `app/globals.css`.

**Base:** `--radius: 0.25rem` (4px) — flat across the system. Comment: "flat 4px across the system (var(--radius) = 4px)."

**Inline radius tokens** (`@theme inline`):

| Token | Value |
|---|---|
| `--radius-none` | `0` |
| `--radius-xs` … `--radius-4xl` | all `var(--radius)` (4px) — intentionally flat |
| `--radius-full` | `9999px` — pills / circles |

**Semantic aliases** (`:root`):

| Token | Value |
|---|---|
| `--radius-btn` | `var(--radius)` |
| `--radius-input` | `var(--radius)` |
| `--radius-card` | `var(--radius)` |
| `--radius-badge` | `9999px` |
| `--radius-badge-sq` | `var(--radius)` |
| `--radius-avatar` | `9999px` |
| `--radius-dialog` | `var(--radius)` |
| `--radius-popover` | `var(--radius)` |
| `--radius-tooltip` | `var(--radius)` |

Design System v2 (`radius-scale.card.html`): none 0 / sm 2px / md 4px (default) / lg 6px / xl 8px / full (pill). This codebase intentionally **flattens** sm/md/lg/xl/2xl/3xl/4xl to 4px (only `none` and `full` are distinct). See §17.

### 2.9 Elevation / Shadows

Source: `app/globals.css` `:root` / `.dark`.

**Light:**

| Token | Value | Use |
|---|---|---|
| `--shadow-xs` | `0 1px 2px 0 oklch(0 0 0 / 0.05)` | Subtle hairline (inputs, cards by default) |
| `--shadow-sm` | `0 1px 3px 0 oklch(0 0 0 / 0.10), 0 1px 2px -1px oklch(0 0 0 / 0.10)` | Small surfaces |
| `--shadow-md` | `0 4px 6px -1px oklch(0 0 0 / 0.10), 0 2px 4px -2px oklch(0 0 0 / 0.10)` | Popovers |
| `--shadow-lg` | `0 10px 15px -3px oklch(0 0 0 / 0.10), 0 4px 6px -4px oklch(0 0 0 / 0.10)` | Dialogs |
| `--shadow-xl` | `0 20px 25px -5px oklch(0 0 0 / 0.10), 0 8px 10px -6px oklch(0 0 0 / 0.10)` | Large overlays |
| `--shadow-none` | `none` | Reset |
| `--shadow-btn-inset` | `inset 0 2px oklch(1 0 0 / 0.15)` | Button top highlight (light only) |
| `--shadow-card` | `var(--shadow-xs)` | Card default |
| `--shadow-input` | `var(--shadow-xs)` | Input default |
| `--shadow-dialog` | `var(--shadow-lg)` | Dialog |
| `--shadow-popover` | `var(--shadow-md)` | Popover/Dropdown |
| `--ring-width` | `4px` | Ring width (paired with focus) |
| `--ring-color` | `oklch(0.597 0.167 253.1 / 0.20)` | Soft blue ring |

**Dark** overrides deepen shadows to `oklch(0 0 0 / 0.30–0.40)` and disables `--shadow-btn-inset`.

Design System v2 (`elevation.card.html`): `elevation/card: 0 1px 3px rgba(0,0,0,.08)` + hairline, `elevation/focus: 0 0 0 3px rgba(0,87,168,0.25)`, `elevation/modal: 0 8px 32px rgba(0,0,0,.16)` + `overlay rgba(0,0,0,0.48)`. This codebase's values are analogous (small bump: card shadow is slightly softer at 5% vs 8% opacity).

### 2.10 Motion

Source: `app/globals.css` `:root` + `~/Documents/Watsco/Watsco Design System v2/tokens/fig-tokens.css` + `guidelines/motion.card.html`.

| Token | Value | Use |
|---|---|---|
| `--duration-instant` | `0ms` | No transition |
| `--duration-fast` | `100ms` | Hover/color micro-change, qty stepper |
| `--duration-normal` | `200ms` | Default (colors, transform, shadow) |
| `--duration-slow` | `300ms` | Slower reveals |
| `--duration-slower` | `500ms` | Longest (rare) |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Spring (only custom vs DS v2) |
| `--ease-linear` | `linear` | Linear |
| `--transition-colors` | `color 200ms standard, bg 200ms, border 200ms, opacity 200ms` | Color transitions |
| `--transition-transform` | `transform 200ms standard` | Transform |
| `--transition-all` | `all 200ms standard` | All |
| `--transition-shadow` | `box-shadow 200ms standard` | Shadow |
| `--animate-blink` | `blink 1.4s both infinite` | Blink animation |

**Keyframes** in `globals.css`: `blink`, `fade-in`, `fade-out`, `slide-in-from-top`, `slide-in-from-bottom`, `zoom-in`. Components use `tw-animate-css` utilities (`animate-in`, `animate-out`, `fade-in-0`, `zoom-in-95`, etc.) for enter/exit.

Design System v2 motion: `fast 100ms / base 200ms / slow 350ms` + `standard / enter / exit` easings (same cubic-beziers, no bounce). This codebase adds `ease-spring` and `--duration-slower 500ms`; slow is 300ms vs 350ms in the Figma. See §17.

**Reduced motion:** Per `accessibility.md`, motion must respect `prefers-reduced-motion`. The current codebase does not yet emit a global `prefers-reduced-motion: reduce` override for durations — follow-up to add a media query that collapses `--duration-*` to `0ms` or disables `tw-animate-css` animations when the user prefers reduced motion. Until then, QA should verify that no animation is essential for understanding.

---

## 3. Type Scale

Source: `app/typography/page.tsx` + `app/typography/_specimen.tsx` + `~/Documents/Watsco/Watsco Design System v2/guidelines/type-*.card.html` + `tokens/fig-tokens.css`.

The specimen page renders each style live at its real size/weight; click the class chip to copy.

### 3.1 Body & UI text (from `app/typography/page.tsx` `TEXT`)

| Role | Tailwind class | Computed size | Weight | Line-height (intended) | Sample |
|---|---|---|---|---|---|
| Body | `text-base font-normal` | 16px | 400 | ~24px (default) | "The quick brown fox jumps over the lazy dog while the sun sets behind the distant hills." |
| Small body | `text-sm font-normal` | 14px | 400 | ~20px | "Secondary copy and supporting paragraphs sit comfortably one step down from body." |
| Label | `text-sm font-medium` | 14px | 500 | ~20px | "Email address" |
| Caption | `text-xs font-normal` | 12px | 400 | ~16px | "Last updated 2 minutes ago" |

All use `font-sans` (Roboto). Labels/inputs use `text-sm font-medium`; captions/muted text use `text-xs` or `text-muted-foreground`.

### 3.2 Headings & Display (from `app/typography/page.tsx` `HEADINGS`)

| Role | Tailwind class | Computed size | Weight | Sample |
|---|---|---|---|---|
| Display | `text-4xl font-bold` | 36px | 700 | "Build the foundation first" |
| Page title | `text-3xl font-bold` | 30px | 700 | "Component Library" |
| Section heading | `text-2xl font-semibold` | 24px | 600 | "Typography scale" |
| Subheading | `text-lg font-semibold` | 18px | 600 | "Designed for clarity" |

PDP title uses a nearby variant: `text-xl`–`text-2xl font-semibold` depending on layout; brand chrome wordmarks use `text-sm font-bold uppercase` in header bars. The master index (`app/pdp/page.tsx`) uses `text-lg font-semibold` for card titles.

### 3.3 Cross-check with Design System v2 type cards

- `type-body.card.html`: body `xs 12 / sm 13 / md 14` with `weight md 400 / medium 500 / semibold 600 / bold 700`, line-heights `16 / 18 / 20`. This codebase uses 16px as the default body (vs 14px in DS v2) — intentionally larger for readability.
- `type-display-heading.card.html`: headings `16 / 20 / 24` + display `32`, all weight 600 (DS v2) vs this codebase's `18 / 24 / 30 / 36` with `600–700`.
- `type-label-price.card.html`: labels `sm 11 / md 13` weight 500; price `sm 14? / md / lg 28`. This codebase's labels map to `text-sm 14px / font-medium 500`.
- DS v2 uses **Inter** as the intended sans (see `tokens/fig-tokens.css` `--text-font-family-sans: Inter`); this codebase ships **Roboto** (see §2.6). See §17.

---

## 4. Component Inventory

All files in `components/ui/` (31). Style: **shadcn New York** (`components.json: "style": "new-york"`, `baseColor: "neutral"`, `cssVariables: true`), Tailwind v4 via `postcss.config.mjs: ["@tailwindcss/postcss"]`, path aliases `@/* → ./*`, icon library `lucide`.

Each entry: file, import, CVA variants (if present), "use when" / "don't use when" inferred from `/components` showcase placement, canonical example.

### Actions

| File | Import | Variants / props | Use when | Don't use when | Example |
|---|---|---|---|---|---|
| `button.tsx` | `import { Button, buttonVariants } from "@/components/ui/button"` | `variant: default / destructive / outline / secondary / ghost / link` · `size: default (h-9 px-4) / xs (h-6) / sm (h-8) / lg (h-10) / icon (size-9) / icon-xs / icon-sm / icon-lg` · `asChild` | Any clickable action. Default is the primary CTA. | Don't use for navigation that should be an `<a>` with `href`; use `asChild` with `Slot` instead. | `<Button>Add to Cart</Button>` · `<Button variant="outline" size="sm">Save to List</Button>` |
| `compare-button.tsx` | `import { CompareButton } from "@/components/ui/compare-button"` | `size: sm / md` · internal `on` toggle (`aria-pressed`) | Low-emphasis toggle beneath primary CTA + Save to List. Shows "Compare" → "✓ Comparing". `hasCompare` gates its visibility (only Carrier). | Don't use as a primary CTA; it's `text-muted-foreground` by design. | `<CompareButton />` in `summary.tsx` `SecondaryActions` |
| `pack-size-pills.tsx` | `import { PackSizePills } from "@/components/ui/pack-size-pills"` | `options: string[]` · `onSelect?: (qty: number) => void` | Pack-size selector. Single option → static pill; multiple → `aria-pressed` button group. Handles "2 Packs (48)" → `48`. | Don't use for single-quantity input without pack semantics; use `QtyStepper` in `summary.tsx` instead. | `<PackSizePills options={["Each", "12-Pk"]} onSelect={setQty} />` |

### Badges / Labels

**Position rule (canonical, applies to every PDP + PLP card):** badges render
directly **under the brand line, above the title**, as a horizontal row (wrap
allowed at narrow widths). Same slot regardless of tone (solid/soft/outline)
or intent (Sale, Best Value, Pro Essentials, Replacement Products, AHRI
Matched System, Non-Sellable, Requires License, etc.). Source of truth:
`app/pdp/_lib/summary.tsx` "Brand + badges + title" block — do NOT compose
another badge slot elsewhere in the buy-box. Reference example: the "Sale"
badge on `/pdp/uc-strike-thru?signedin=1` sits under "Daikin", above the CIRRA
title. `/components` `Badges & Labels` section renders the same pattern under
"Badge position pattern".

| File | Import | Variants / props | Use when | Don't use when | Example |
|---|---|---|---|---|---|
| `badge.tsx` | `import { Badge } from "@/components/ui/badge"` | `variant: default / secondary / destructive / outline / ghost / link / soft / solid / outline-color` · `color: blue / violet / green / amber / orange / red / teal / slate` (compound variants: soft = tinted, solid = filled, outline-color = transparent) | Compact status/label chips. Promo/attribute chips use `outline-color`. **Always** placed in the badges slot under brand line, per position rule above. | Don't use for inline stock text — that is `BranchRow` / `stockTextClass` (text, not badge). Statuses in PDP render inline per §15. Never place a Badge outside the badges slot. | `<Badge variant="solid" color="red">Sale</Badge>` in `PdpProduct.badges` |
| `label-badges.tsx` | `import { PointsBadge, FlagBadge, BranchRow, stockTextClass } from "@/components/ui/label-badges"` | `PointsBadge: points:number` · `FlagBadge: tone red/orange/green/blue` · `BranchRow: qty, name` · `stockTextClass(qty)` → `text-in-stock / low-stock / out-of-stock` | Loyalty points (violet badge w/ `<Award>`), flag chips (folded-corner), branch stock rows. | Don't roll your own points treatment — import `PointsBadge`. | `<PointsBadge points={12} />` · `<BranchRow qty={3} name="Durham NC #1" />` |
| `label.tsx` | `import { Label } from "@/components/ui/label"` | Radix `LabelPrimitive.Root`; `peer-disabled:opacity-50` dims when control is disabled | Form labels paired with `Input` / `Checkbox`. | Don't use for non-form captions. | `<Label htmlFor="lbl-1">Full name</Label>` |

### Forms

| File | Import | Variants | Use when | Don't use when | Example |
|---|---|---|---|---|---|
| `input.tsx` | `import { Input } from "@/components/ui/input"` | States: default / focus (`focus-visible:ring`) / disabled / `aria-invalid` (red) · `md:text-sm` responsive | Text entry. Placeholder `Email`, etc. | Don't use for multiline; use `textarea`. | `<Input placeholder="Email" />` |
| `textarea.tsx` | `import { Textarea } from "@/components/ui/textarea"` | Same state treatment as `Input` | Multiline entry. | — | `<Textarea placeholder="Message" />` |
| `checkbox.tsx` | `import { Checkbox } from "@/components/ui/checkbox"` | States: unchecked / checked (`data-[state=checked]` → primary) / focus / disabled / `aria-invalid` | Binary toggles / agreements. | Don't use for mutually exclusive choice; use `radio-group`. | `<Checkbox aria-label="agree" />` |
| `radio-group.tsx` | `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"` | Radix primitives; `data-[state=checked]` styles | Single choice from a set. | — | Showcase in `app/components/_sections/forms.tsx` |
| `select.tsx` | `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"` | Radix Select; `SelectTrigger` shows focus ring | Pick from a list. | Don't use for freeform text; use `input`. | Showcase in `forms.tsx` |
| `switch.tsx` | `import { Switch } from "@/components/ui/switch"` | Radix Switch; `data-[state=checked]:bg-primary` | On/off. | — | Showcase in `forms.tsx` |
| `slider.tsx` | `import { Slider } from "@/components/ui/slider"` | Radix Slider | Range. | — | Showcase in `forms.tsx` |
| `label.tsx` | (see above) | — | — | — | — |

### Feedback

| File | Import | Variants | Use when | Example |
|---|---|---|---|---|
| `alert.tsx` | `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"` | `variant: default (bg-card) / destructive (text-destructive)` | Inline status. Success uses `text-in-stock` override; error uses `destructive`. | `<Alert><Terminal /><AlertTitle>Heads up</AlertTitle><AlertDescription>…</AlertDescription></Alert>` |
| `progress.tsx` | `import { Progress } from "@/components/ui/progress"` | `value: 0–100` | Determinate progress. Empty / in-progress / complete. | `<Progress value={66} />` |
| `skeleton.tsx` | `import { Skeleton } from "@/components/ui/skeleton"` | `className` sizes the placeholder (`size-12 rounded-full`, `h-4 w-[180px]`, etc.) | Loading placeholder. | `<Skeleton className="h-4 w-[180px]" />` |
| `sonner.tsx` | `import { Toaster } from "@/components/ui/sonner"` + `import { toast } from "sonner"` | `toast("…") / toast.success / toast.error / toast.loading` + `action: {label, onClick}` | Transient toasts (Sonner). | `toast.success("Saved successfully")` |
| `tooltip.tsx` | `import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"` | Requires `TooltipProvider` ancestor | Hover/focus hint. | Showcase uses `open` for always-on demo. |

### Overlays

| File | Import | Notes | Example |
|---|---|---|---|
| `dialog.tsx` | `import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogClose } from "@/components/ui/dialog"` | Radix Dialog; `DialogOverlay: bg-black/50`; `showCloseButton` in `DialogContent` | Showcase in `app/components/_sections/overlays.tsx` — open/close, focus trap |
| `sheet.tsx` | `import { Sheet, SheetTrigger, SheetContent, ... } from "@/components/ui/sheet"` | Slide-over drawer (right/bottom). | Overlays showcase |
| `popover.tsx` | `import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"` | Radix Popover; `shadow-md`. | Overlays showcase |
| `dropdown-menu.tsx` | `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, ... } from "@/components/ui/dropdown-menu"` | Radix DropdownMenu; `shadow-md`, `bg-popover`. | Overlays showcase |
| `tooltip.tsx` | (see Feedback) | — | — |

### Data

| File | Import | Notes | Example |
|---|---|---|---|
| `card.tsx` | `import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"` | `Card: flex flex-col gap-6 rounded-xl border bg-card py-6 shadow-sm`; `CardHeader` uses `@container` + `has-data-[slot=card-action]:grid-cols-[1fr_auto]` | Showcase: default + `ring-2 ring-ring` selected; PDP branch cards use `rounded-lg border p-4` (simpler, not `Card`) |
| `table.tsx` | `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"` | `data-state="selected"` on `TableRow`; zebra via `[&_tbody_tr:nth-child(even)]:bg-muted/40` | Showcase `ROWS` (INV-001…004) |
| `avatar.tsx` | `import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"` | `size: default (size-8) / sm (size-6) / lg (size-10)`; `AvatarBadge: bg-in-stock` dot | Showcase: image / fallback / badge / group |
| `separator.tsx` | `import { Separator } from "@/components/ui/separator"` | `orientation: horizontal (default) / vertical`; `bg-border` | Horizontal rule + vertical dividers |
| `accordion.tsx` | `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"` | `type: single collapsible`; trigger chevron rotates on `data-state=open`; animation `data-[state=open]:animate-accordion-down` | Data showcase; style-variant catalog wraps it |
| `tabs.tsx` | `import { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "@/components/ui/tabs"` | `TabsList variant: default (bg-muted) / line (w-full border-b, left-aligned, brand-blue active + underline) / segmented (muted track, primary active pill)`; vertical via `data-[orientation=vertical]` | Showcase at `/pdp/tab-styles`; PDP details tabs use `line` |
| `carousel.tsx` | `import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"` | Embla-based; `orientation: horizontal (default) / vertical` | PDP gallery uses a simpler thumbnail strip, not this component directly |
| `breadcrumb.tsx` | `import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"` | — | Showcase in navigation |
| `pagination.tsx` | `import { Pagination, PaginationContent, PaginationItem, PaginationLink, ... } from "@/components/ui/pagination"` | — | Showcase in navigation |

### Navigation / Media (showcase groupings)

Source: `app/components/_sections/navigation.tsx` + `media.tsx` + `overlays.tsx` + `data.tsx` + etc. The showcase groups primitives as:

- **Actions** — `button`, `badge` (+ `compare-button`, `pack-size-pills` which are Watsco-specific)
- **Badges** — `badge`, `label-badges` (`PointsBadge`, `FlagBadge`)
- **Forms** — `input`, `label`, `textarea`, `checkbox`, `radio-group`, `select`, `switch`, `slider`
- **Feedback** — `alert`, `progress`, `skeleton`, `sonner`, `tooltip`
- **Overlays** — `dialog`, `sheet`, `popover`, `dropdown-menu`, `tooltip`
- **Data** — `card`, `table`, `avatar`, `separator`, `accordion`, `tabs`, `carousel`, `breadcrumb`, `pagination`
- **Navigation** — `breadcrumb`, `pagination`, `tabs`, `dropdown-menu`, `sheet` (mobile nav)
- **Media** — `avatar`, `carousel`, `skeleton`

The showcase itself is at `app/components/page.tsx` with sections in `app/components/_sections/*.tsx` rendered via `app/components/_showcase.tsx` (`Category`, `Demo`, `State`, `Block`).

---

## 5. Layout Patterns

### 5.1 Container widths

| Pattern | Class | Where |
|---|---|---|
| Default page container | `mx-auto max-w-6xl px-4 md:px-6` | `app/components/page.tsx` header+main, `app/pdp/_lib/chrome.tsx` all brand header/footers (`GemaireHeader`, `BakerHeader`, etc.), `app/typography/page.tsx`, `app/product/page.tsx`, `app/pdp/page.tsx` (master index), `/pdp/[slug]` template |
| Sticky header inner | `mx-auto max-w-6xl flex items-center ... px-4 py-3 md:px-6` | `app/components/page.tsx` header, `app/typography/page.tsx` |
| Full-bleed bands | `border-b` / `border-t` outside `max-w-6xl` | Sticky headers, footer top border, tab bars |

**Rule:** Never exceed `max-w-6xl` for content; padding is `px-4` mobile → `md:px-6` desktop. The `max-w-6xl` is consistent across every route checked — treat it as the system container.

### 5.2 Section rhythm

| Pattern | Class | Where |
|---|---|---|
| Page vertical rhythm (showcase) | `space-y-16` between categories | `app/components/page.tsx` `<main>` |
| Typography page | `space-y-12` | `app/typography/page.tsx` |
| PDP template | `space-y-8` to `space-y-10` between buy-box / details / FBT / parts / substitutes | `app/pdp/[slug]/page.tsx` + section files |
| Card internal | `gap-6 rounded-xl border bg-card py-6 p-5–6` | `components/ui/card.tsx`, PDP branch cards `rounded-lg border p-4` |
| Between sections globally | Semantic aliases: `--spacing-section: 32px` between sections, `--spacing-page: 64px` between page blocks | `globals.css` |

### 5.3 Grid patterns

| Pattern | Class | Where |
|---|---|---|
| Category grids (showcase) | `grid grid-cols-1 gap-4 lg:grid-cols-2` | `app/components/_showcase.tsx` `Category` |
| Product/FBT grids | `grid grid-cols-2 lg:grid-cols-4 gap-4` | `app/pdp/_lib/fbt.tsx` (FBT "Frequently Bought Together" — 4-across on desktop, 2 on mobile) |
| Parts | `grid grid-cols-2 lg:grid-cols-4` (mini product cards) | `app/pdp/_lib/parts.tsx` |
| Branch availability | `grid grid-cols-1 sm:grid-cols-2 gap-3` | `app/pdp/_lib/summary.tsx` `BranchAvailability` (Your Branch | Nearby) |
| Spec lists | `grid grid-cols-2 lg:grid-cols-4` (flat specs) vs grouped `SpecGroup` 2-column layout | `app/pdp/_lib/details.tsx` |
| Master index cards | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` | `app/pdp/page.tsx` |
| Carousel / gallery | Embla `Carousel` + thumbnail strip; PDP gallery is a sticky image column (see §15) | `components/ui/carousel.tsx`, `app/pdp/_lib/pdp.tsx` |

### 5.4 Breakpoints (Tailwind defaults; no custom screens in `globals.css`)

| Breakpoint | Min-width | Behavior in this system |
|---|---|---|
| `sm` | 640px | Branch cards flip to 2-col (`sm:grid-cols-2`); FBT starts wrapping |
| `md` | 768px | Container padding `md:px-6`; nav tabs switch from overflow-x scroll to full layout; header sub-bars show `md:flex` |
| `lg` | 1024px | Showcase categories `lg:grid-cols-2`; product grids go 4-across |
| `xl` | 1280px | Screenshot reference width; no extra layout change (max-w-6xl caps at 1152px) |
| `2xl` | 1536px | Not used for width (content stays max-w-6xl) |

Horizontal scroll at 375px is prohibited (Standing Quality Bar). Touch targets are ≥44px (see Button `h-9` = 36px — icon-only buttons use `size-9` = 36px; PDP qty stepper uses `h-12` = 48px, which meets the 44px rule; `Button` `size` `icon` is 36px — add `p-2` or bump to `size="icon-lg"` when the 44px rule applies).

---

## 6. Button Convention

Source: `components/ui/button.tsx` (`buttonVariants`) + `components/ui/compare-button.tsx` + `app/pdp/_lib/summary.tsx` + `components/ui/pack-size-pills.tsx` + `/components` showcase.

| Role | Variant/size | Class (from CVA) | Label convention | Href / action |
|---|---|---|---|---|
| **Primary CTA** | `default` / `default` (`h-9 px-4`) or `lg` (`h-10 px-6`) | `bg-primary text-primary-foreground hover:bg-primary/90` | Verb-first, sentence case: "Add to Cart", "Save" | `onClick` → toast / cart. In PDP buy-box: large CTA + qty stepper row (`h-12` stepper + primary button). |
| **Secondary** | `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` | Same | Secondary actions. |
| **Outline** | `outline` | `border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground` | "Save to List", "View Details" | PDP `SaveToList` uses a custom ghost-like style (not `Button variant="outline"` — see below). |
| **Ghost (low-emphasis)** | `ghost` | `hover:bg-accent hover:text-accent-foreground` | "Compare" (`CompareButton`) | `CompareButton` is a custom ghost toggle (`aria-pressed`). Only Carrier Enterprise PDPs show it (`brand.hasCompare`). |
| **Destructive** | `destructive` | `bg-destructive text-white hover:bg-destructive/90` | "Delete" | — |
| **Link** | `link` | `text-primary underline-offset-4 hover:underline` | Inline links | — |
| **Icon-only** | `icon` (`size-9`) or `icon-xs` etc. | `size-9` / `size-6` etc. | `aria-label` required (e.g. "Add", "Add to Cart") | Used for: ThemeToggle (`variant="outline" size="icon"`), PRO Picks cart icon (`size="icon"` inside `about.tsx`), header search/cart icons. |
| **Text-only (tertiary)** | Custom in `summary.tsx` `SaveToList` | `inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-[3px]` | "Save to List" + `<ListPlus>` | Not a `Button` — a `<button>` styled as text + icon. |
| **Pill / Segment** | `PackSizePills` pills or `TabsList variant="segmented"` | Pills: `rounded-full border px-4 py-1.5` + `data-[state=active]: bg-primary text-primary-foreground`; Segmented: `bg-muted p-[3px] data-[state=active]: bg-primary` | Single pack → static pill; multiple → `aria-pressed` group. "Each", "12-Pk", "2 Packs (48)" | `onSelect` → `setQty` (total item count). |
| **Qty stepper** | Custom `QtyStepper` in `summary.tsx` | `inline-flex h-12 border` with `w-11` buttons (`Minus`/`Plus` + live qty span) | — | `±` controls bound to `setQty` (1–99). |

**PDP buy-box hierarchy (see `app/pdp/_lib/summary.tsx` comments — "value hierarchy"):**
1. Badge row (solid promo badges up top) → price cluster (price + UoM + was-price + points + rebate) → qty + Add to Cart → branch availability → secondary actions (`SaveToList` + `CompareButton`) → info banners (license, replacement). Any value message (points, rebate, sale) stays in the high-value zone, never in a muted callout below branches.

**Focus:** All buttons use `focus-visible:ring-[3px] focus-visible:ring-ring/50` (see §7). The `/components` demo forces focus with `border-ring ring-[3px]`.

---

## 7. Interaction Rules

Source: `components/ui/*` + `app/components/_sections/*` + `app/globals.css` motion tokens + `app/components/page.tsx`.

| State | Pattern | Where |
|---|---|---|
| **Hover** | Darken one step (e.g. `hover:bg-primary/90`, `hover:bg-secondary/80`, `hover:bg-accent`, `hover:text-foreground` on muted). Underline for links (`hover:underline`), for accordion triggers (`hover:underline`). | `button.tsx`, `badge.tsx`, `breadcrumb.tsx`, `tabs.tsx`, `accordion.tsx` |
| **Focus** | `focus-visible:ring-[3px] focus-visible:ring-ring/50` + `focus-visible:border-ring` + `focus-visible:outline-none` (or `focus-visible:outline-1 focus-visible:outline-ring` for tabs). This is the **system focus ring** — 3px soft blue ring at 50% opacity, same as DS v2's `elevation/focus` soft ring. | `button.tsx` (`inline-flex ... focus-visible:ring-[3px]`), every form control, `tabs.tsx`, `app/components/page.tsx` header nav (`focus-visible:ring-[3px]`) |
| **Active** | Usually same as hover or one step darker; `data-[state=active]` / `data-[state=checked]` / `aria-pressed` drive filled styles (primary-filled segmented, pills). | `tabs.tsx` (`data-[state=active]:bg-primary`), `pack-size-pills.tsx` (`aria-pressed` → primary), `checkbox.tsx` (`data-[state=checked]:bg-primary`), `compare-button.tsx` (`aria-pressed` → `text-primary`) |
| **Disabled** | `disabled:pointer-events-none disabled:opacity-50` + flat gray fill (`bg-gray-300` concept per DS v2) · form controls show `disabled:cursor-not-allowed`. Alerts/destructive keep their color but desaturate. | `button.tsx`, `input.tsx`, `checkbox.tsx`, etc. |
| **Error / invalid** | `aria-invalid:border-destructive aria-invalid:ring-destructive/20` (light) / `40` (dark). `Alert variant="destructive"`. Input/textarea show red border + ring. | `input.tsx`, `textarea.tsx`, `checkbox.tsx`, `alert.tsx` |
| **Transition** | Default `transition-all` on `Button` (`all 200ms standard`), `transition-[color,box-shadow]` on `Badge`, `transition-colors` elsewhere. Duration from `globals.css`: `normal 200ms` is the default; `fast 100ms` for qty stepper (`duration-[var(--duration-fast)]`). Easing defaults to `ease-default` (`0.4,0,0.2,1`) or `ease-out` for stepper hovers. | `globals.css` `--transition-*` tokens |

**Reduced motion:** Per `accessibility.md` and `globals.css` comment, motion should respect `prefers-reduced-motion`. No global media query yet — see §17. Individual components use `tw-animate-css` (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`) which should be disabled under `prefers-reduced-motion: reduce`.

**Keyboard:** Every interactive element is `focus-visible`-ringed and `keyboard-reachable` (Radix primitives handle tab order, `Dialog` trap, `DropdownMenu` arrow keys). Accordion/tabs/dialog/sheet/popover all open AND close via keyboard.

---

## 8. Responsive Rules

Standing Quality Bar viewports: **375 / 768 / 1024 / 1280**.

Source: `app/components/page.tsx`, `app/pdp/[slug]/page.tsx`, `app/pdp/_lib/summary.tsx`, `app/pdp/_lib/fbt.tsx`, `components.json`, `globals.css`.

| Viewport | What changes |
|---|---|
| **375 (mobile)** | Single column everywhere (`grid-cols-1`). Branch cards stacked; FBT 2-across; header Gemaire utility bar hides subnav overflow-x scroll; PDP gallery is full-width; qty stepper + Add to Cart stack if needed; nav in `/components` header scrolls horizontally (`overflow-x-auto`). No horizontal scroll. Touch targets: PDP qty stepper is 48px, primary CTA is 36–40px — CTA should be `size="lg"` or padded to 44px where the 44px rule applies. |
| **768 (tablet, `md:`)** | Container padding `md:px-6`; showcase still 1 col; header Gemaire `md:block` search + `md:flex` account row appear; typography specimens remain single column; master index moves to `md:grid-cols-2`. |
| **1024 (desktop, `lg:`)** | Showcase categories `lg:grid-cols-2` (two demo cards side-by-side); product/FBT/parts grids go `lg:grid-cols-4`; PDP switches to 2-col layout (sticky gallery + buy-box side-by-side; details tabs full width). |
| **1280 (large)** | Screenshot reference width; `max-w-6xl` (1152px) caps content — no additional column change. Charts/sidebars if present would max out here. |

**PDP-specific responsive:**
- Sticky image column (`position: sticky` top) pins on `lg:` while buy-box scrolls (see §15 "sticky image column").
- Branch availability is always `grid-cols-1 sm:grid-cols-2` (stacks at 375, 2-col from 640 up).
- Tab bars at `line` variant overflow-x scroll on mobile, full width on desktop.

---

## 9. Brand Voice

Extraction of what is **actually written** in the PDPs and supporting copy (not a tone guide). Sources: `app/pdp/_lib/registry.ts` product copy, `app/pdp/_lib/summary.tsx` buy-box strings, `app/pdp/_lib/details.tsx` / `about.tsx` labels, `app/pdp/_lib/brands.ts` nav/footer labels.

| Context | Copy pattern | Example | Source |
|---|---|---|---|
| **Product titles** | Literal, spec-first: brand + model + attributes (tonnage, SEER, HP, RPM, voltage). No marketing adjectives. | "Carrier® Sentry™ - 1.5 Ton 14 SEER Residential Heat Pump" · "TP-EC13-50 - Blower Motor, X-13 ECM, Variable Speed …" | `registry.ts` `title` |
| **Identifiers** | `Item: CH14NB018P0G` · `MFG: CH14NB018P0G` — always labeled, short code. | `Item:` + `MFG:` labels under title | `summary.tsx` + `pdp.tsx` header |
| **Price (signed-in)** | `formatUSD(value)` → `$X,XXX.XX` + ` / EACH` (space after slash). Sale: was-price strike-through + red sale price, **no "Reg." prefix** (one-line sale). | `$1,299.00 / EACH` · `$899.00` red + `$1,199.00` crossed | `types.ts` `formatUSD` + `formatUom` (always `/ EACH`), `summary.tsx` price cluster |
| **Price (signed-out / gated)** | "Sign in to see price" + "Sign in" CTA (→ `#`). No price, no branch stock, no pack sizes. Commerce block gated by `signedIn` (see `summary.tsx` `showCommerce`). | "Sign in to see price and availability" | `summary.tsx` gated branch |
| **Stock** | Inline text (not badge): `"X in stock today"` (green/in-stock), `"Only X left"` / low-stock orange, `"Out of stock"` (muted). Homans replaces branch stock with a call-based fulfillment note. | `3 in stock today` · `Call branch for availability` (Homans) | `label-badges.tsx` `stockTextClass` + `summary.tsx` `BranchAvailability` + `types.ts` `fulfillmentNote` |
| **Statuses (inline, not badges)** | `Non-Sellable` (red), `Requires License`, `Replaced`, `Discontinued`. Also `Prop 65` is text-only link. Statuses render as **inline text** in the buy-box, never as pill badges (per handoff §6). | `Non-Sellable` red text in Your Branch box; `Requires License` amber `InfoBanner` | `summary.tsx` `statusLabel` + `InfoBanner`, `types.ts` `status` |
| **CTAs (verbs)** | Verb-first, sentence case, short: "Add to Cart", "Save to List", "Compare", "View All Branches", "View System Details", "Need help? Call 1-800-…", "Sign in / Register". PRO Picks: icon-only cart (`Plus`/`ShoppingCart`) + narrow qty. | PDP buy-box, `about.tsx` PRO Picks `icon` button | `summary.tsx`, `about.tsx`, `chrome.tsx` |
| **Badges / promos** | Short, plain retail: "Best Value", "Most Popular", "Pro Essentials", "Bundle & Save", "Clearance". Merchandising badges are `Badge variant=soft/solid`. | `Pro Essentials` blue soft badge, `Best Value` violet solid | `badge.tsx`, `registry.ts` `badges` |
| **UoM** | Always `/ EACH` with space after slash (`/ ` + `formatUom`). `EA`/`Each` → `EACH`, else uppercased. | `/ EACH` · `/ BOX` | `types.ts` `formatUom` |
| **Nav labels** | Dense, noun-first, contractor vocabulary: "Residential Equipment", "Quick Order", "AHRI Search", "Shop for Products", "Matched Systems", "Store Selector". Sentence case is rare — many are Title Case as scraped from live sites. | Per-brand nav in `brands.ts` | `brands.ts` `nav` |
| **Empty / gated tabs** | `Coming soon` / placeholder when `comingSoonTabs` has entries; `No AHRI Matchups Found` for empty AHRI (ECMDI). | `No AHRI Matchups Found` box | `details.tsx`, `registry.ts` `ahriEmpty` |
| **Documents** | Category + kind: "Consumer Literature · PDF" with `<Play>` icon for video | — | `types.ts` `PdpDocument`, `details.tsx` |

**Avoid:** lorem ipsum, "TBD", AI-flavored filler — per Standing Quality Bar, every visible string is real or sourced.

---

## 10. Iconography

Source: `components/ui/*.tsx` imports + `app/pdp/_lib/chrome.tsx` + `lib/utils.ts`.

**Library:** `lucide-react` (`^0.487.0`) is the **only** icon source in this repo (declared in `components.json: "iconLibrary": "lucide"`). No custom SVG icon sprite in the repo — brand *logo marks* are a separate category and are inline SVG in `app/pdp/_lib/chrome.tsx` (e.g. `CeMonogram` for Carrier Enterprise). See §12 for brand-mark treatment.

**Sizing convention in this codebase:**

| Context | Size | Class | Example |
|---|---|---|---|
| Buttons (default) | 16px | `[&_svg:not([class*='size-'])]:size-4` (16px) via `button.tsx` base | `<Plus />` inside `Button` |
| Buttons xs | 12px | `[&_svg:not([class*='size-'])]:size-3` | `Button size="xs"` |
| Badges | 12px | `[&>svg]:size-3` | `<Badge><Shield className="size-3" /></Badge>` |
| Alerts | 16px | `[&>svg]:size-4` | `<Alert><Terminal /></Alert>` |
| Header / nav icons | 16–20px | `size-4` (16px) / `size-5` (20px) explicit | Gemaire `Search size-5`, `MapPin size-5`, `ShoppingCart size-5`; `ChevronDown size-4`/`size-3.5` |
| PDP buy-box | 16px | `size-4` | `Minus`/`Plus` in qty stepper, `Info size-4` in banner, `ListPlus size-4`, `GitCompare size-4` |
| Tabs (with icons) | 16px | `size-4` | `TabsTrigger showIcons: <Icon size-4 />` |
| Card / layout | 12–16px | `size-3` / `size-4` | PointsBadge `<Award size-3>` (renders as 12px), FlagBadge corner notch 8px |
| Avatar fallback | 14–16px | text fallback, not icon | — |

**Rule:** Icons are single-color, painted via `currentColor` (Lucide default) — recolor with `text-*`. Every icon-only button has an `aria-label` (Standing Quality Bar). The `compare-button` uses `GitCompare` / `Check`; `PointsBadge` uses `Award`; header uses `MapPin`, `Search`, `ShoppingCart`, `ChevronDown`, `User`, `Menu`, `Phone`, etc.

**Vendored DS v2 iconography:** 46 unique SVG glyphs extracted into `assets/icons/icon-data.js` + `<Icon name="…">` wrapper + Material Icons ligature font (`tokens/fonts.css`). This repo does **not** import that set — it uses Lucide. Delta — see §17.

---

## 11. Section Pattern Library

Section-level composables that already exist (so builds can mirror them).

| Pattern | Files | Structure |
|---|---|---|
| **Sticky app header** (generic `/components`, `/typography`) | `app/components/page.tsx`, `app/typography/page.tsx`, `app/components/_showcase.tsx` `ThemeToggle` | `sticky top-0 z-40 border-b bg-background/80 backdrop-blur` + `max-w-6xl` inner + title/subtitle + right-aligned `ThemeToggle` + horizontal nav (`overflow-x-auto`). `h1 text-lg font-semibold tracking-tight` + `p text-xs text-muted-foreground`. |
| **Brand chrome header/footer** (per distributor) | `app/pdp/_lib/chrome.tsx` (`SiteHeader`, `SiteFooter`, `GemaireHeader`, `BakerHeader`, `CarrierHeader`, `PeirceHeader`, `EcmdiHeader`, `DcneHeader`, `HomansHeader`) | Full-bleed colored band (`bg-brand-*`) outside `max-w-6xl`; white wordmark/logo; prominent search (`h-11`); branch selector (`MapPin` + `ChevronDown`); cart button (`ShoppingCart`); white sub-bar with nav items (`ChevronDown` carets where needed); account / Sign in row. Footer: `bg-muted/40` or brand-specific (`--brand-ecmdi-footer` `#636363`, `--brand-homans` footer bar), `grid grid-cols-2 sm:grid-cols-4` footer columns via `brand.footerColumns`. See §12 per brand. |
| **Master index card** | `app/pdp/page.tsx` | `Card` grid (`md:grid-cols-2 lg:grid-cols-3`); each card: brand label (`text-xs text-muted-foreground`) + badges (`soft` blue) + title + item + source URL + CTA to `/pdp/[slug]`. Grouped: products, then "Use Cases". Has `OpenQuestions` checklist (localStorage-persisted via `app/pdp/_lib/open-questions.tsx`). |
| **PDP shell** | `app/pdp/[slug]/page.tsx` → `app/pdp/_lib/pdp.tsx` | Brand chrome (`SiteHeader`) → breadcrumbs → 2-col (`lg:`) layout: left sticky gallery, right buy-box (`PdpSummary`) → details area (`DetailsTabs` vs `AboutThisProduct` depending on `detailsStyle`) → FBT (`Fbt`) → Parts (`Parts`) → substitutes / recently viewed / customers-also-purchased / bundle / pro-picks where present. |
| **PDP gallery** | `app/pdp/_lib/pdp.tsx` (`PdgGallery` / image column) | Sticky image column (pins while buy-box scrolls) + thumbnail strip + `Carousel` for mobile; placeholder `ImageOff` or hatched box when `noImage: true` or no `images`. Real images from Watsco Scene7 CDN (`cdn.gemaire.com` etc. with `?wid=&hei=&qlt=` query). |
| **Buy-box (value hierarchy)** | `app/pdp/_lib/summary.tsx` `PdpSummary` | See §6 + §14. Order: brand+badges+title → price cluster → pack-size pills → qty stepper + Add to Cart → branch availability (2-col) or fulfillment note → secondary actions → banners. Signed-out → gated "Sign in to see price" replaces commerce. |
| **Details tabs** | `app/pdp/_lib/details.tsx` `DetailsTabs` | `Tabs variant="line"` (underline + brand-blue active) with tabs: Description (intro + bullets + notes + documents + Prop65 link), Part Lists, Equipment Specification (flat 4-col or grouped 2-col), Documentation, plus any `comingSoonTabs` as "coming soon". Documents can be `docsInline: true` (right column of Description) or separate tab. |
| **About This Product** | `app/pdp/_lib/about.tsx` `AboutThisProduct` | Carrier-style: left Product Info (grouped specs by `productSpecs`), right Documents + Part List (uses `SpecsFlat`); below: Substitutes (with warning "May not be covered by warranty"), Recently Viewed. Uses `detailsStyle: "about"`. |
| **FBT / Customers Also Purchased** | `app/pdp/_lib/fbt.tsx` | `Tabs variant="segmented"` (muted track, primary active) with groups per `fbt: {label, items}[]`; each item: rich Carrier-style card (image, title, brand, pct, price, points, stock). Grid `grid-cols-2 lg:grid-cols-4`. |
| **Parts** | `app/pdp/_lib/parts.tsx` | Mini product cards (`grid-cols-2 lg:grid-cols-4`) for `parts: PartItem[]`. |
| **PRO Picks** | `app/pdp/_lib/about.tsx` (PRO Picks section) | Icon-only `Button size="icon"` + narrow qty box per row; matched components with individual price. |
| **Bundle / Rebate** | `app/pdp/_lib/about.tsx` + `summary.tsx` rebate line | "Included In Bundle" list + rebate message (e.g. "Up to $200 rebate") kept in the **price cluster** (high-value zone, not a footnote). |
| **Showcase shell** | `app/pdp/_lib/showcase.tsx` / `showcase-data.tsx` + `app/pdp/tab-styles/page.tsx`, `accordion-styles/page.tsx` | `ShowcaseShell` renders style-variant strips; `SECTIONS` fixture provides tab labels + `Body` per section. Used for tab-style and accordion-style catalogs. |
| **Typography specimen** | `app/typography/page.tsx` + `app/typography/_specimen.tsx` `TypeSpecimen` | `Spec {name, cls, px, weight, sample}` rendered live; click class chip to copy. |
| **Component gallery** | `app/components/page.tsx` + `app/components/_sections/*.tsx` + `app/components/_showcase.tsx` (`Category`, `Demo`, `State`, `Block`) | `Category id/title/description` → `grid lg:grid-cols-2` of `Demo name/slug/description + children` → each control shown across every state via `State label child` or `Block label child`. `InstallCommand` chip per demo copies `npx shadcn@latest add <slug>`. |

---

## 12. Distributor Brand Chrome Catalog

One subsection per distributor. Source: `app/pdp/_lib/brands.ts` (nav, footerColumns, accent, phone, copyright) + `app/globals.css` brand tokens (hex) + `app/pdp/_lib/chrome.tsx` header/footer components + handoff §4.

> Source URLs modeled from: per handoff §4, each brand's live site (e.g. gemaire.com, baker-dist.com, carriermechanical.com, peirce-phelps.com, ecmdi.com, dcne-hvac.com, homansassoc.com). The PDP registry's `sourceUrl` per product points to the product page this entry was modeled on. Accents are **approximate** brand blues/reds unless noted — refine against real brand assets when available (see `brands.ts` header comment + §17).

| Distributor | Brand key | Accent (approx) | Header pattern (`chrome.tsx`) | Footer pattern | Phone | Nav |
|---|---|---|---|---|---|
| **Gemaire** | `gemaire` | `#0080df` (`--brand-gemaire`) · cart `#f26522` | **Reference build.** Blue bar (`bg-brand-gemaire`) with white Gemaire logo SVG (`gemaire-logo-header-small.svg`), prominent centered search (`h-11` white), branch selector (`MapPin` → "Your Branch / Select Branch or MOBILE #251"), orange cart (`bg-brand-gemaire-cart` + badge `bg-white text-brand-gemaire-cart` when signed-in). White sub-bar with `Shop for Products / Brands / Resources / Quick Order / Matched Systems` + account row (`Sign In / Register` or `David's Account #63352` + Order Templates). | `bg-muted/40` light grey; 4-col grid (footerColumns reversed so "Contact Us" is last → shown as right-most contact/social block). Includes social icons (LinkedIn, Facebook, X, Instagram) + email/phone. | `(888) 601-0038` | `Shop for Products, Brands, Resources, Quick Order, Matched Systems` |
| **Carrier Enterprise** | `carrier` | `#3d2762` deep-purple (`--brand-carrier`) · cart `#49a942` · page bg `#f0f0f4` (`--brand-carrier-bg`) | Deep-purple nav (`bg-brand-carrier`), green cart accent (`bg-brand-carrier-cart`), distinct CE nav taxonomy (Residential/Commercial/Ductless/IAQ/Parts/Supplies/Thermostats/Specials). Has `hasCompare: true` (Compare toggle appears). | Brand-specific dark/light split; footer columns include CE Tools / Watsco Tools / Support + Resources. Copyright: "2026 CE. All rights reserved." | — | `Residential Equipment, Commercial Equipment, Ductless, Indoor Air Quality, Parts, Supplies, Thermostats / Controls / Zoning, Specials` |
| **Baker Distributing** | `baker` | `#c8102e` red (`--brand-baker`) · bar `#3a3838` (`--brand-baker-bar`) | Red accent (logo, nav underline) + dark utility strip (`bg-brand-baker-bar`, `text-brand-baker-bar-foreground`). Dense nav: HVAC/Refrigeration/Foodservice/Parts/Compressors/Motors/IAQ/Thermostats/Tools/Supplies. | 4-col with deep category set (All Product Lines, Sales & Ordering, Customer Service & Support, Resources with ~20 links). | `(800) 217-4698` | See row header |
| **Peirce-Phelps** | `peirce` | `#00539b` blue (`--brand-peirce`) · accent `#ea1336` (`--brand-peirce-accent`) for "Specials" highlight | Blue search/logo accent; red Specials highlight. Nav: Specials first. | 4-col: Company, Account, Resources, Contact Us. Copyright: "2026 Peirce-Phelps, LLC." | `1 (800) 342-2304` | `Specials, Find A Local Dealer, Products, Brands, Services, Resources, Training & Events` |
| **East Coast Metal Distributors (ECMDI)** | `ecmdi` | `#cb0015` red (`--brand-ecmdi`) · footer `#636363` (`--brand-ecmdi-footer`) | Red header/nav (`bg-brand-ecmdi`). Nav: Categories, Brands, PRO Guides, etc. | Red header + dark-charcoal footer (`bg-brand-ecmdi-footer` / `bg-[#636363]` path, `text-brand-ecmdi-footer-foreground`). Columns: Company, Sales & Ordering, Shopping Tools, Resources. | — | `Categories, Brands, PRO Guides, About Us, Quick Order, Warranty Search, Parts List & Documents` |
| **DCNE** | `dcne` | `#001056` dark-navy (`--brand-dcne`) · accent in `brands.ts` `#124b8f` (used as generic fallback) | Dark-navy utility bar (`bg-brand-dcne`), white text; nav: Shop Residential/Commercial, Parts, Supplies, Scratch and Dent, Brands, Quick Order. | 4-col: Products, Account, Company, Resources. Copyright: "DCNE. All rights reserved." | `781-322-8800` | See row header |
| **Homans Associates** | `homans` | `#045ea9` primary (`--brand-homans`) · nav `#003874` (`--brand-homans-nav`) · page bg `#f5f5f5` (`--brand-homans-bg`) · accent `#003874` in `brands.ts` | Two-tier: top utility + primary blue bar (`bg-brand-homans`) + darker category nav (`bg-brand-homans-nav`). Page canvas `#f5f5f5` (Watsco grey). | Homans: top utility with `Bryant Resources / Mitsubishi Team / Simple Proposal`; footer bottom bar uses primary blue. Copyright: "2026 Homans Associates." | — | `Products, Brands, Specials, Services, Find A Local Dealer, Resources, Training & Events` |

**Screenshots:** Per spec, `docs/design-system-refs/brand-chrome__<brand>-header__<viewport>.png` and `brand-chrome__<brand>-footer__<viewport>.png` at 1280 (default) + 375 for responsive checks. Screenshots are taken from live dev server routes `/pdp/[slug]` filtered by `brandKey` and `/pdp/chrome/[brand]` if present — see `docs/design-system-refs/README.md` once the screenshot pass runs. *(If the dev server is not running when this doc is generated, screenshots are pending — re-run the screenshot pass after `npm run dev -- -p 3001` is up; see §18.)*

**Brand token mapping recap (hex):** See table in §2.4 — all brand hexes are defined once in `globals.css` `:root` and mapped via `@theme inline` to `bg-brand-*` / `text-brand-*-foreground` utilities.

---

## 13. Style-Variant Catalog

### 13.1 Tab styles (6 variants)

Source: `app/pdp/tab-styles/page.tsx` + `app/pdp/_lib/showcase-data.tsx` (`SECTIONS`) + `components/ui/tabs.tsx` (`tabsListVariants`) + `app/pdp/_lib/showcase.tsx`.

The `/pdp/tab-styles` page renders `SECTIONS` (label + Icon + Body) through `TabDemo` in **8 style presentations** — same content, different chrome. Each is a different `TabsList` / `TabsTrigger` class set, built on top of the 3 formal CVA variants in `tabs.tsx` (`default`, `line`, `segmented`) plus custom overrides for the other 5. Comments in `app/pdp/tab-styles/page.tsx` are the authoritative label for each render.

| # | Variant (source comment) | Where defined | Visual | When to use |
|---|---|---|---|---|
| 1 | **Underline (line)** — `{/* Underline (line) */}` | `tabs.tsx variant="line"` → `w-full border-b bg-transparent gap-6`; triggers `flex-none` left-aligned, active `text-primary` + `after:` underline | Left-aligned tabs on a full-width grey rule; brand-blue active text + 2px blue underline | PDP details area (product Description / Spec / Documentation). Default for product detail. |
| 2 | **Full-width segmented** — `{/* Full-width segmented */}` | `tabs.tsx variant="segmented"` → `bg-muted` track; triggers `flex-1` with `data-[state=active]:bg-primary text-primary-foreground` pill | Grey track with primary-filled active pill, evenly spaced across full width | FBT group tabs, Pack Size alternative — when every option is equal weight and the control should read as a single segmented unit |
| 3 | **Soft active (tinted with icons)** — `{/* Soft active — tinted blue background on the active tab (with icons) */}` | Custom `TabDemo`: `list gap-1 bg-transparent p-0` + `trigger h-auto rounded-lg px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary` + `showIcons` | Tinted blue background on active, icon + label | PDP when tabs carry icons/mixed content and active should be a gentle tint, not solid fill |
| 4 | **Solid filled active** — `{/* Solid filled active */}` | Custom: `list gap-1 bg-transparent p-0` + `trigger rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground` | Solid primary fill on active, rounded-lg | When the tab bar is not a segmented track but a loose row of pills that fill solid on select |
| 5 | **Bordered segmented (outlined boxes)** — `{/* Bordered segmented — outlined boxes, active filled */}` | Custom: `max-w-3xl` list with `rounded-md border`, triggers `flex-1 rounded-none border-r`, active filled primary | Outlined segmented boxes, active filled primary | Alternative segmented look with stronger box affordance |
| 6 | **Pill track · solid active pill** — `{/* Pill track · solid active pill */}` | Custom: `list h-auto rounded-full p-1` + `trigger rounded-full px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground` | Fully-rounded pill track; active pill fills solid primary | When the control is a loose pill row (not full-width) and needs solid emphasis on active |
| 7 | **Pill track · white active pill** — `{/* Pill track · white active pill */}` | Custom: `list h-auto rounded-full p-1` + `trigger rounded-full px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm` | Fully-rounded pill track; active pill is white/background with primary text + soft shadow (raised) | Same as #6 but for muted/dark tracks where a raised white pill reads better than a solid brand fill |
| 8 | **Boxed / tabbed card** — `{/* Boxed / tabbed card — content sits in a bordered box under the tabs */}` | Direct `<Tabs>` + `variant="line"` list inside `rounded-xl border overflow-hidden` shell; content in `p-6` | Tabs sit above a bordered card; body content lives inside the card, not in the page flow | When tabs are secondary inside a card/boxed section rather than full-width page chrome |

Note: `tabs.tsx` formally exposes **3** CVA `variant` values (`default`, `line`, `segmented`). Presentations 3–7 are custom `TabsList` / `TabsTrigger` class overrides; presentation 8 wraps a formal `variant="line"` inside a bordered card. All use the `SECTIONS` fixture for consistent labels.

**Screenshots:** `docs/design-system-refs/tab-styles__<variant>__<viewport>.png` — one per variant at 1280 + 375.

### 13.2 Accordion styles (6 variants)

Source: `app/pdp/accordion-styles/page.tsx` + `app/pdp/_lib/showcase-data.tsx` + `components/ui/accordion.tsx`.

The `/pdp/accordion-styles` page renders **6** accordion demos through `ShowcaseShell`. The base `Accordion` is Radix single-collapsible with `ChevronDownIcon` that rotates 180° on `data-state=open` (`[&[data-state=open]>svg]:rotate-180`). Comments in the source (`{/* 1 · Default … */}` through `{/* 6 · Circular chevron + left accent */}`) are the authoritative label for each render.

| # | Variant (source comment) | Visual | When to use |
|---|---|---|---|
| 1 | **Default (shadcn) — with section icons** — `{/* 1 · Default (shadcn) — with section icons */}` | Vanilla shadcn accordion; each item's trigger carries the section `Icon` (from `SECTIONS`) + label; chevron on the right rotates 180° on open | Base pattern for any content-list expansion where category iconography is helpful (Description / Spec / Docs) |
| 2 | **Separated cards** — `{/* 2 · Separated cards */}` | Each item is its own `rounded-lg border` card with `gap-2` vertical spacing between items (visually detached, no shared borders) | When each expansion is a distinct topic and cards should breathe apart |
| 3 | **Filled bars · left accent** — `{/* 3 · Filled bars · left accent */}` | Triggers rendered as filled bar rows with a left-edge brand-accent stripe; open state carries a stronger accent | Product detail category rows where the trigger IS the affordance (no card chrome around it) |
| 4 | **Plus / minus separated cards** — `{/* 4 · Plus / minus separated cards */}` | Separated-card layout with the chevron replaced by a `+` / `−` glyph (`Plus` collapsed → `Minus` expanded) | PDP parts/spec lists where expand is additive context and `+/−` reads clearer than a chevron |
| 5 | **Status-dot step cards** — `{/* 5 · Status-dot step cards */}` | Separated cards with a colored dot/step indicator to the left of the trigger; active/completed states carry different dot colors (green/blue) | Multi-step or status-driven expansions (e.g. install steps, checkout stages) |
| 6 | **Circular chevron + left accent** — `{/* 6 · Circular chevron + left accent */}` | Chevron rendered inside a circular badge on the right + a left-edge brand-accent stripe, both rotate/highlight on open | When the accordion itself should carry brand accent emphasis and the trigger reads as a stronger CTA |

Base animation for all 6: `data-[state=closed]:animate-accordion-up` / `data-[state=open]:animate-accordion-down` (`overflow-hidden text-sm` content).

**Screenshots:** `docs/design-system-refs/accordion-styles__<variant>__<viewport>.png` at 1280 + 375.

---

## 14. PDP Composition Patterns

Source: `app/pdp/_lib/types.ts` + `registry.ts` + `pdp.tsx` + `summary.tsx` + `details.tsx` + `about.tsx` + `fbt.tsx` + `parts.tsx` + `app/pdp/[slug]/page.tsx` + handoff §5–6.

Each pattern is gated by fields on `PdpProduct`. One template (`/pdp/[slug]`) renders any entry.

| Pattern | Gating field(s) | What renders | Where |
|---|---|---|---|
| **Buy-box** | `commerce` + `signedIn` (via `useAuth`) + `status` | Price cluster + qty stepper + Add to Cart + branch availability → secondary actions → banners. See §§6, 15. | `summary.tsx` `PdpSummary` |
| **FBT (Frequently Bought Together)** | `fbt: {label, items: FbtProduct[]}[]` | Tabs `variant="segmented"` with groups; each card: image, title, brand, Item/MFG, branch qty, `pct` ("% Also Purchased"), price, points, stock, `allBranchesQty`, `wasPrice` strike-thru where present. Grid `grid-cols-2 lg:grid-cols-4`. | `fbt.tsx` |
| **Customers Also Purchased** | `customersAlsoPurchased: FbtProduct[]` | Same rich cards with `%` badge ("X% Also Purchased") | `fbt.tsx` (rendered after FBT) |
| **Parts (mini product cards)** | `parts: PartItem[]` | `grid-cols-2 lg:grid-cols-4` mini cards (image + title + Item/MFG + branch qty) | `parts.tsx` |
| **PRO Picks** | `proPicks: ProPickItem[]` | Row per pick: icon-only `Button size="icon"` + narrow qty box + availability note; responsive: cart icon stacks on mobile. Defined in `types.ts` `ProPickItem`. | `about.tsx` PRO Picks section |
| **Substitutes** | `substitutes: SubstituteItem[]` | List with warning "May not be covered by warranty" | `about.tsx` Substitutes row |
| **Recently Viewed** | `recentlyViewed: PartItem[]` | Horizontal or grid product cards (reuse `PartItem` shape) | `about.tsx` Recently Viewed |
| **About vs Tabs fork** | `detailsStyle: "tabs" (default) \| "about"` | `"tabs"`: `DetailsTabs` (Description / Part Lists / Equipment Spec / Documentation + coming-soon). `"about"`: Carrier `AboutThisProduct` (Product Info + Documents + Part List + Where Used) | `details.tsx` vs `about.tsx` |
| **AHRI matched / AHRI empty** | `ahri: {number}` vs `ahriEmpty: boolean` | Matched: badge + "View System Details" link. Empty: "No AHRI Matchups Found" boxed state (ECMDI equipment). | `details.tsx` / `about.tsx` |
| **Bundle + Rebate** | `bundleItems: SubstituteItem[]` + `rebate: string` | "Included In Bundle" section + rebate message kept in price cluster (high-value zone) | `about.tsx` + `summary.tsx` price cluster |
| **Pack Size pills** | `commerce.packSizes: string[]` | `PackSizePills` — single option → static pill; multiple → `aria-pressed` pill group → sets `qty` via parenthetical total (e.g. "2 Packs (48)" → 48). | `summary.tsx` (above qty stepper), `components/ui/pack-size-pills.tsx` |
| **Non-Sellable state** | `status: "non-sellable"` + `nonSellableAllBranchesQty?: number` | Blocks purchase (`blocksPurchase = true`): hides price/cart, shows red status in Your Branch box, Save to List, `allBranchesQty` where available ("X All Branches") | `summary.tsx` `blocksPurchase`, `types.ts` |
| **Requires-License state** | `status: "requires-license"` (`licenseGated`) | Keeps full commerce + shows amber `InfoBanner` above price cluster: "License required …" | `summary.tsx` `licenseGated` + `InfoBanner` |
| **Strike-thru / Sale pricing** | `commerce.wasPrice?: number` (also `FbtProduct.wasPrice`, `ProPickItem.wasPrice`) | Original price struck through (`line-through text-muted-foreground`) + sale price in red (`text-sale-price`); no "Reg." prefix; one-line sale. | `summary.tsx` price cluster, `fbt.tsx` cards, `types.ts` |
| **Replacement Products** | `status: "replaced" \| "discontinued"` + `replacements: SubstituteItem[]` | Amber info banner + replacement product list | `summary.tsx` `blocksPurchase` branch, `types.ts` |
| **Branch availability (standard)** | `commerce.yourBranch`, `commerce.nearbyBranches: Branch[]` | 2-col row: `Your Branch` box (name + stock or status) | `Nearby Branches` box (list of `BranchRow` + "View All Branches" link). `grid grid-cols-1 sm:grid-cols-2`. | `summary.tsx` `BranchAvailability`, `label-badges.tsx` |
| **Homans fulfillment note** | `commerce.fulfillmentNote: string` | Replaces branch stock boxes with call-based note: "Call branch for availability" + phone. Used for Homans PDPs. | `types.ts`, `summary.tsx` |
| **Points earn line** | `commerce.points: number` + per-item `FbtProduct.points` | `PointsBadge` (violet) in price cluster and on FBT cards | `summary.tsx`, `label-badges.tsx` `PointsBadge` |
| **Prop 65** | `description.prop65: boolean` | Text-only link under description: California Proposition 65 warning; renders inline, not as badge | `details.tsx` / `about.tsx` |
| **No Image** | `noImage: boolean` | Hatched placeholder or `ImageOff` + "No Image Available" instead of gallery | `pdp.tsx` |
| **Coming-soon tabs** | `comingSoonTabs: string[]` | Extra tabs rendered as "coming soon" placeholder | `details.tsx` |
| **Documents** | `documents: PdpDocument[]` + `docsInline?: boolean` | Literature PDF / Video links; either inline in Description right column (`docsInline: true`) or separate Documentation tab | `types.ts`, `details.tsx`, `about.tsx` |
| **Spec groups (left/right)** | `specGroupsLeft / specGroupsRight: SpecGroup[]` | Two-column spec groups (grouped) | `details.tsx` |
| **Flat specs (4-col)** | `specsFlat: SpecRow[]` | Flat list rendered as 4-column grid without grouping (Gemaire spec-dense PDPs) | `details.tsx` |
| **Product specs (Carrier about)** | `productSpecs: SpecGroup[]` | Grouped by Dimensions / Attributes etc. inside About panel | `about.tsx`, `types.ts` |

**Registered products** (from `registry.ts` — exhaustive as of this extraction): the file drives `GET /pdp` master + every `/pdp/[slug]`. Slugs include: at minimum the TP-EC13 trinity (`tp-ec13-50` + sibling `tp-ec13-75` part) plus one PDP per distributor for visual chrome coverage plus the 8 use-case entries (replacement, AHRI matched/empty, pack-size, bundle+rebate, points, non-sellable, requires-license, strike-thru). Open `registry.ts` for the live list — this doc does not duplicate the entire registry, it describes the pattern.

**Screenshots:** Per spec, one at 1280 + 375 for every pattern above → `docs/design-system-refs/pdp-composition__<pattern>__<viewport>.png`.

---

## 15. PDP Conventions (from decisions log)

Verbatim from `~/Developer/ClaudeCode/watsco/docs/handoff/state-2026-08-09.md` §6 "Design-system decisions & learnings" — folded here as the conventions section:

- **Price is gated to logged-in.** Signed-out shows a gated state; `commerce` omitted → no price/inventory. Toggle is `useAuth().signedIn`; gated copy is "Sign in to see price and availability" with "Sign in" `text-primary` link.
- **Statuses render inline, not as badges.** Prop 65 is text-only. UoM shows as `/ EACH` (space after slash). See `formatUom` in `types.ts`.
- **Sale/strike-thru (updated 2026-08-12):** Sale is signaled by the **`Sale` badge** in the badges row (solid red) — see Badge position rule under §4 Badges/Labels. The price cluster stays neutral: sale price in `text-price` (foreground black), was-price in muted grey `line-through`, UoM as `/ EACH`. **No** red price and **no** "Sale" label next to the price — the badge carries the message. Reference: `/pdp/uc-strike-thru?signedin=1` (Daikin CIRRA).
- **Buy-box:** sticky image/gallery column pins while the buy-box column scrolls (see `pdp.tsx` gallery).
- **Branch availability:** 2-column (Your Branch | Nearby); Homans uses a call-based `fulfillmentNote` instead of branch stock.
- **FBT (Frequently Bought Together):** 4-across grid (`lg:grid-cols-4`); rich Carrier-style cards (image, price, points, stock); "Customers Also Purchased" carries a `% also purchased` badge.
- **PRO Picks:** matched components with icon-only Add-to-Cart + narrow qty box (see `about.tsx`).
- **Real imagery:** product images are real, wired from Watsco **Scene7 CDN** article IDs (scraped). Example: `https://cdn.gemaire.com/tradepro_tp-ec13-50_article_…_en_normal?wid=700&hei=700&qlt=80`. First `images[0]` is the hero; additional `images` are gallery thumbnails; count held in `thumbnailCount`.
- **A11y:** low-stock orange darkened to hit **AA** contrast — `globals.css` comment on `--low-stock`: `AA 4.55:1 on white (was 3.20:1)`.
- **Two content layouts:** `detailsStyle: "tabs"` (default) vs `"about"` (Carrier "About This Product" with Product Info / Documents / Part List / Where Used).
- **Tab styles (8):** underline (line) / full-width segmented / soft active (tinted, icons) / solid filled / bordered segmented / pill · solid active / pill · white active / boxed-card — see §13.1 for the source-authoritative comment for each.
- **Accordion styles (6):** default with section icons / separated cards / filled bars · left accent / plus-minus separated cards / status-dot step cards / circular chevron + left accent — see §13.2.

---

## 16. Emerging Patterns / To Be Added

> *(to be captured after next design round)*

David flagged that "new patterns are being worked out." This section is an explicit placeholder so future Muse runs know where to file them. Do not invent patterns — file them here only when code ships:

- *(empty — queue the next pattern that lands in `app/pdp/_lib/` or `components/ui/` here, then update §14/§13/§4 as needed)*

---

## 17. Open Questions

Everywhere the code disagrees with Design System v2 (`~/Documents/Watsco/Watsco Design System v2/`), or the guideline cards are ambiguous, or a sourcing assumption is approximate. **Do not silently reconcile — flag it here.**

| # | Question | Code says | Vendored DS v2 says | Decision |
|---|---|---|---|---|
| 1 | **Brand accents: approximate vs matched** | `brands.ts` header: "Accents are approximate brand blues/reds — refine against real brand assets when available." `globals.css` comments: "source-sampled". DCNE accent is `#124b8f` in `brands.ts` but `--brand-dcne` is `#001056`; Baker tokens split between `#c8102e` accent and `#3a3838` bar; Homans `#003874` nav vs `#045ea9` primary. | No brand-accent guideline card exists — `_ds_manifest.json` and `guidelines/` don't model the 7 distributor chromes. | **Code wins** until real brand assets arrive. Follow-up: sample each live header/footer background with a color picker, pin the exact hex in `globals.css` + `brands.ts`, remove "approximate" comments. |
| 2 | **Global font: Roboto vs Inter** | `app/layout.tsx` loads **Roboto** + Roboto Mono via `next/font/google`; `globals.css` → `font-sans: var(--font-roboto)`. | `tokens/fig-tokens.css --text-font-family-sans: Inter`; `tokens/fonts.css` loads Inter, Roboto, Roboto Mono, Manrope + Material Icons. Readme: "Inter is the UI workhorse". | **Code wins.** Delta noted. If re-aligning to DS v2, swap `layout.tsx` to Inter or keep Roboto and document the divergence. Manrope (display) is not yet used in code. |
| 3 | **Radius scale flattened** | `globals.css`: `radius: 0.25rem` (4px), `radius-sm` through `radius-4xl` all map to `var(--radius)` (4px). Only `none` (0) and `full` (9999px) are distinct. | `guidelines/radius-scale.card.html` + `tokens/fig-tokens.css`: none 0 / sm 2 / md 4 / lg 6 / xl 8 / full 9999. Cards/buttons/inputs are md=4px there too, but lg/xl would be larger. | **Code wins.** Follow-up: decide whether lg/xl should actually be distinct (e.g. card-xl 8px) or stay flat by policy; if flat-by-policy, add a comment in `globals.css` explaining the choice vs DS v2. |
| 4 | **Spacing scale — custom semantic aliases** | `globals.css` defines `--spacing-component-*`, `--spacing-section`, `--spacing-page`, `--card-spacing`, `--input-px/py`, `--btn-px-*` aliases on top of `--space-*` primitives. | `tokens/fig-tokens.css` has primitives `--space-*` only (0,2,4,8,12,16,24,32,40,48,64) + Figma shows ad-hoc `7px 12px` component paddings that don't snap to scale. | No conflict — code extends the scale intentionally. No action. |
| 5 | **Type sizes: body 16px vs 14px** | `app/typography/page.tsx` body is `text-base` 16px; headings `18/24/30/36`. | DS v2 `type-body.card.html` body is 14px (md) default; `type-display-heading` headings are `16/20/24/32`. | **Code wins.** 16px is more readable for trade dense content; document as intentional. No fix unless David wants 14px density. |
| 6 | **Icon set: Lucide vs DS v2 46 SVG glyphs** | This repo uses `lucide-react` exclusively. | DS v2 ships 46 extracted SVGs in `assets/icons/icon-data.js` + `<Icon>` wrapper + Material Icons ligature. Manifest `_ds_manifest.json` (55 KB) indexes them. | **Code wins.** Lucide is the shipped set. If aligning, either adopt the DS v2 glyphs (drop Lucide) or keep Lucide and note the split. Do not mix blindly. |
| 7 | **Shadow intensity** | `globals.css` light card shadow is `rgba(0,0,0,0.05)`; DS v2 `elevation/card` is `rgba(0,0,0,0.08)`. | DS v2 `elevation.card.html` says `0 1px 3px rgba(0,0,0,.08)` + hairline + `focus 0 0 0 3px rgba(0,87,168,0.25)` + `overlay rgba(0,0,0,0.48)`. | Negligible — code is slightly softer (5% vs 8%). No blocking fix; align if audit wants pixel equality. Dark mode shadows are intentionally heavier in code (30–40%). |
| 8 | **Motion slow 300ms vs 350ms + spring** | `globals.css` slow is `300ms`; DS v2 `motion.card.html` + `fig-tokens.css` slow is `350ms`. Code adds `--ease-spring: 0.34,1.56,0.64,1` and `--duration-slower 500ms` which have no DS v2 counterpart. | DS v2 motion: fast 100 / base 200 / slow 350 + standard/enter/exit easings, no spring. | **Code wins.** Spring should be used sparingly if at all; document that `ease-spring` is non-canonical vs DS v2. |
| 9 | **Focus ring** | `focus-visible:ring-[3px] focus-visible:ring-ring/50` (~1.5px effective light ring at 50% opacity) + Tailwind `dark:` bump + component-level `ring-[3px]`. | DS v2 `elevation/card`: `elevation/focus 0 0 0 3px rgba(0,87,168,0.25)` (3px at 25% opacity). | Visually similar — both are a soft 3px blue ring. No blocking fix; unify opacity if strict equality is desired. |
| 10 | **Reduced-motion** | No global `prefers-reduced-motion: reduce` media query found in `globals.css`. Components animate with `tw-animate-css` and `transition-all` without a reduced-motion fallback. | `accessibility.md` requires reduced-motion support; `motion.card.html` should note it. | **Gap.** Add a `@media (prefers-reduced-motion: reduce)` block that collapses durations / disables `tw-animate-css` animations, or add per-component `motion-reduce:` variants. |
| 11 | **Component coverage vs DS v2** | This repo has 31 components in `components/ui/` (shadcn New York). DS v2 has 103 components across Forms/Badges/Navigation/Product/Feedback plus guideline cards (see `readme.md` §Components). DS v2 components like `FormQuantityStepper`, `StoreSelector`, `AHRIMatchedSystemTable`, `ProductGridCard`, `ToastToast`, `SegmentedControl*`, `BadgeStatus*` have no 1:1 in this repo's `components/ui/` — their equivalents are bespoke in `app/pdp/_lib/*.tsx` (e.g. `QtyStepper` in `summary.tsx`, `PackSizePills`). | `_ds_manifest.json` lists the DS v2 component inventory. | **Code wins.** This repo is not a mirror of DS v2 — it's a PDP prototype with PDP-specific patterns. A future `audit-and-align-to-design-system` Muse job should map each DS v2 component to its closest ship counterpart and note gaps (see §18). |
| 12 | **Badge color vocabulary** | `badge.tsx` colors are `blue, violet, green, amber, orange, red, teal, slate` (8). `types.ts` `PdpBadge` restricts to `blue | violet | green | amber | red | slate` (6) — no `orange`/`teal` in PDP badges. | DS v2 status palette is `statusBlue/statusGreen/statusOrange/statusRed` + primitive green/blue/orange/red ramps; `teal`/`violet` are not primitive names in DS v2. | `teal`/`violet` in `badge.tsx` are extended beyond DS v2 primitives; PDP `BadgeColor` intentionally narrows. No fix — document the split. |
| 13 | **Dark mode brand tokens constant** | Brand tokens (hex) are constant across `.dark` ("a brand's blue is its blue"). | DS v2 `tokens/fig-tokens.css` has a separate wireframe mode + dark token overrides, but no brand-chip dark variant. | No conflict — brand chrome is light-only by policy. |

---

## 18. How to Update This Doc

For **small updates**, edit this file in the same PR that changes `globals.css` / `components/ui/*` / `app/pdp/_lib/*` / `app/components/*` / `app/typography/*` — keep the file-path citations and the Open Questions table accurate. Screenshots (`docs/design-system-refs/`) are the author's responsibility: after `npm run dev -- -p 3001` is up, capture fresh screenshots for any pattern that changed (the screenshot pass is cheapest at $0.20–1 per fix cycle).

For **major shifts** (new brand chrome, new tab/accordion variants, re-tokenization, font swap, radius rework), re-run the `extract-design-system` Muse job:

```bash
cd ~/Developer/ClaudeCode/watsco/watscobuild
npm run dev &  # port 3001 pinned — must be up for screenshots
muse exec \
  --prompt-file docs/muse-specs/extract-design-system.md \
  --workspace . \
  --disable-approval \
  --max-model-steps 200 \
  --reasoning-effort high \
  --parallel-tool-calls \
  > .muse-runs/extract-design-system.log 2>&1 &
```

**Every subsequent Muse build spec must reference specific sections of this doc** in its "Read these files first" list so QA/Designer have a shared rubric. The follow-up `audit-and-align-to-design-system` Muse job will walk every route (`/`, `/pdp`, `/pdp/[slug]` ×17+, `/pdp/chrome/[brand]` ×7, `/pdp/tab-styles`, `/pdp/accordion-styles`, `/components`, `/typography`, `/product`) and file a defect list wherever a page drifts from this reference.

---

### Screenshots — `docs/design-system-refs/`

> Naming: `<section>__<name>__<viewport>.png` — viewports **1280** (default) + **375** for anything responsive.
> Examples: `type-scale__h1-through-body__1280.png`, `brand-chrome__ecmdi-header__1280.png`, `tab-styles__pill-white__1280.png`, `pdp-composition__buy-box__1280.png`.
> The screenshot pass requires the dev server at `http://localhost:3001`. When this doc is first extracted without a running server, this section is **pending** — re-run the screenshot pass once `npm run dev` is up, then update the README in that folder.

Per spec, coverage required:
- Per component group (Actions, Badges, Forms, Feedback, Overlays, Data, Navigation, Media) from `/components` at 1280.
- Per brand chrome (7 distributors) — header + footer at 1280 (and 375 for nav wrapping).
- Per tab style (8 variants) + accordion style (6 variants) at 1280 + 375.
- Per PDP composition pattern (§14) at 1280 + 375.
- Type scale at 1280.
- Product card pattern (`/product`) at 1280 + 375.

---

### Verification

Source files `app/`, `components/`, `lib/`, `globals.css`, `package.json`, `tsconfig.json`, `components.json` were not modified (read-only extraction). Only writes: `docs/design-system.md` + `docs/design-system-refs/` (pending screenshots). Build hygiene (`npm run build` / `lint` / `tsc --noEmit`) must remain green; re-check after any screenshot-asset addition.

