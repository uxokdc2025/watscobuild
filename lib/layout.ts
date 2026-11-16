/**
 * Layout tokens — breakpoints, page container, product grid.
 *
 * This file is the TypeScript mirror of the layout block in
 * `app/globals.css` (`--breakpoint-*`, `--layout-max-width`,
 * `--layout-margin`, `--layout-gutter`, `--layout-columns`). CSS media
 * queries can't read custom properties, so the widths live in exactly two
 * places: that CSS block (what the browser renders) and this table (what the
 * docs page and any JS-driven demo reads). Change one, change the other —
 * both are commented to say so.
 *
 * Consumers:
 *   · `components/ui/page-container.tsx` — the one page container.
 *   · `components/ui/product-grid.tsx`   — the one search / PLP product grid.
 *   · `/components/grid`                 — Foundations · Grid & Breakpoints.
 *
 * Rule: content stretches fluidly to 1920px, then stops and centers. No page
 * stretches past the canvas — that was the Nov 10 search-results finding.
 */

/** Content canvas, px. Mirrors `--layout-max-width`. */
export const LAYOUT_MAX_WIDTH = 1920;

/** PLP filter sidebar, px (lg and up). Mirrors `--layout-sidebar`. */
export const LAYOUT_SIDEBAR = 256;
/** Gap between the filter sidebar and the results column, px (`gap-6`). */
export const LAYOUT_SIDEBAR_GAP = 24;
/** Sidebar sits beside the results from this width up (Tailwind `lg`). */
export const LAYOUT_SIDEBAR_FROM = 1024;
/** Narrowest legible product card from lg up, px. Mirrors `--layout-card-min`. */
export const LAYOUT_CARD_MIN = 200;

export type LayoutBreakpointKey =
  | "base"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "wide"
  | "xwide"
  | "canvas";

export type LayoutBreakpoint = {
  key: LayoutBreakpointKey;
  /** Tailwind variant prefix (`lg:`). `null` for the mobile-first base band. */
  variant: string | null;
  label: string;
  /** Inclusive lower bound, px. */
  min: number;
  /** Inclusive upper bound, px. `null` = no upper bound. */
  max: number | null;
  /** MAXIMUM product-grid columns on /search and every PLP. The grid shows
   *  fewer when that many cards can't each be `cardMin` wide. */
  columns: number;
  /** Narrowest card the grid allows in this band, px. Mirrors `--layout-card-min`. */
  cardMin: number;
  /** Gap between grid cells, px. Mirrors `--layout-gutter`. */
  gutter: number;
  /** Page side margin (container inline padding), px. Mirrors `--layout-margin`. */
  margin: number;
  /** What the content width does in this band. */
  container: string;
};

/**
 * The layout scale. One row per band where something actually changes —
 * columns, gutter, margin, or the container cap.
 *
 * `sm`, `md`, `lg` and `xl` are Tailwind's own breakpoints. `wide`, `xwide`
 * and `canvas` are ours, added in `globals.css` because the product grid has
 * to step at 1440 / 1728 / 1920 and Tailwind's scale has nothing between
 * 1280 and 1536. Tailwind's `2xl` (1536px) is still available but triggers no
 * layout change — it sits inside the `wide` band, so never use it for width.
 */
export const LAYOUT_BREAKPOINTS: LayoutBreakpoint[] = [
  {
    key: "base",
    variant: null,
    label: "Base (mobile)",
    min: 0,
    max: 639,
    columns: 2,
    cardMin: 0,
    gutter: 16,
    margin: 16,
    container: "Fluid",
  },
  {
    key: "sm",
    variant: "sm:",
    label: "Small",
    min: 640,
    max: 767,
    columns: 3,
    cardMin: 0,
    gutter: 16,
    margin: 16,
    container: "Fluid",
  },
  {
    key: "md",
    variant: "md:",
    label: "Medium (tablet)",
    min: 768,
    max: 1023,
    columns: 3,
    cardMin: 0,
    gutter: 24,
    margin: 24,
    container: "Fluid",
  },
  {
    key: "lg",
    variant: "lg:",
    label: "Large (laptop)",
    min: 1024,
    max: 1279,
    columns: 4,
    cardMin: LAYOUT_CARD_MIN,
    gutter: 24,
    margin: 32,
    container: "Fluid",
  },
  {
    key: "xl",
    variant: "xl:",
    label: "Extra large",
    min: 1280,
    max: 1439,
    columns: 4,
    cardMin: LAYOUT_CARD_MIN,
    gutter: 24,
    margin: 32,
    container: "Fluid",
  },
  {
    key: "wide",
    variant: "wide:",
    label: "Wide",
    min: 1440,
    max: 1727,
    columns: 5,
    cardMin: LAYOUT_CARD_MIN,
    gutter: 24,
    margin: 40,
    container: "Fluid",
  },
  {
    key: "xwide",
    variant: "xwide:",
    label: "Extra wide",
    min: 1728,
    max: 1919,
    columns: 6,
    cardMin: LAYOUT_CARD_MIN,
    gutter: 24,
    margin: 48,
    container: "Fluid",
  },
  {
    key: "canvas",
    variant: "canvas:",
    label: "Canvas (cap)",
    min: LAYOUT_MAX_WIDTH,
    max: null,
    columns: 6,
    cardMin: LAYOUT_CARD_MIN,
    gutter: 24,
    margin: 48,
    container: "Capped at 1920px, centered",
  },
];

/** The band a given viewport width falls in. */
export function layoutBreakpointAt(width: number): LayoutBreakpoint {
  let match = LAYOUT_BREAKPOINTS[0];
  for (const bp of LAYOUT_BREAKPOINTS) {
    if (width >= bp.min) match = bp;
  }
  return match;
}

/** Product-grid columns at a given viewport width. */
export function productGridColumnsAt(width: number): number {
  return layoutBreakpointAt(width).columns;
}

/**
 * Columns the auto-fill grid actually renders in a content column `content`
 * px wide — mirrors the CSS track max(card-min, 1/N share) in
 * `components/ui/product-grid.tsx`.
 */
export function fitColumns(content: number, bp: LayoutBreakpoint): number {
  if (bp.cardMin <= 0) return bp.columns;
  const fit = Math.floor((content + bp.gutter) / (bp.cardMin + bp.gutter));
  return Math.max(1, Math.min(bp.columns, fit));
}

/** Width of the PLP results column (viewport − margins − filter sidebar). */
export function plpResultsWidthAt(width: number): number {
  const bp = layoutBreakpointAt(width);
  const content = contentWidthAt(width) - 2 * bp.margin;
  return width >= LAYOUT_SIDEBAR_FROM ? content - LAYOUT_SIDEBAR - LAYOUT_SIDEBAR_GAP : content;
}

/** Columns a search / PLP page (with its filter sidebar) shows at a viewport width. */
export function plpColumnsAt(width: number): number {
  return fitColumns(plpResultsWidthAt(width), layoutBreakpointAt(width));
}

/** Content width at a given viewport width — fluid, then capped at the canvas. */
export function contentWidthAt(width: number): number {
  return Math.min(width, LAYOUT_MAX_WIDTH);
}

/**
 * CMS layout rules — the maximum number of items a CMS block may place
 * across, per Shopware block (names match
 * `app/components/cms-blocks/cms-catalog.tsx` and the examples page).
 *
 * Why a cap at all: a CMS editor can drop any number of items into a row.
 * Past these counts the item is narrower than the design system's smallest
 * legible card, which is exactly how a page ends up looking stretched.
 */
export type CmsLayoutRule = {
  /** Shopware block name(s), as shown in the Shopping Experiences editor. */
  blocks: string;
  /** Shopware category tab. */
  category: string;
  /** Max items across at the canvas width. */
  maxPerRow: number;
  /** How it steps down on smaller screens. */
  steps: string;
};

export const CMS_LAYOUT_RULES: CmsLayoutRule[] = [
  {
    blocks: "Image, boxed · Image, full-sized · Hero image",
    category: "Images / Text & images",
    maxPerRow: 1,
    steps: "1 at every width. Full-sized may bleed, its text still sits in the container.",
  },
  {
    blocks: "Two columns, boxed · Two columns, boxed image & text",
    category: "Images / Text & images",
    maxPerRow: 2,
    steps: "2 from md up, 1 below md.",
  },
  {
    blocks: "Image grid (bento) · Three columns, boxed · Three columns, rounded",
    category: "Images",
    maxPerRow: 3,
    steps: "3 from lg up, 2 at sm–md, 1 below sm. Never 4 across — a 4th item breaks the measure.",
  },
  {
    blocks: "Three columns, image/text cards · Three columns, captioned images",
    category: "Text & images",
    maxPerRow: 3,
    steps: "3 from lg up, 2 at sm–md, 1 below sm.",
  },
  {
    blocks: "Four columns, boxed",
    category: "Images",
    maxPerRow: 4,
    steps: "4 from lg up, 2 at sm–md, 1 below sm. The only 4-across image block.",
  },
  {
    blocks: "Two columns, text · Three columns, text · Teaser text",
    category: "Text",
    maxPerRow: 3,
    steps: "3 from lg up, 1 below lg. Body copy stays ≤ 75 characters per line.",
  },
  {
    blocks: "Product slider · Cross Selling",
    category: "Commerce",
    maxPerRow: 6,
    steps: "Exactly what the PLP allows — 6 / 5 / 4 / 3 / 2 per the table above.",
  },
  {
    blocks: "Three columns, product boxes",
    category: "Commerce",
    maxPerRow: 3,
    steps: "3 from lg up, 2 below. Use the product slider when you need more than 3.",
  },
  {
    blocks: "YouTube video · Vimeo video · Form · HTML",
    category: "Video / Form / HTML",
    maxPerRow: 1,
    steps: "1 at every width, inside the container.",
  },
];
