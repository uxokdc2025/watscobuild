"use client";

/**
 * ProductCard — the canonical product card.
 *
 * ONE component, used everywhere a product renders as a card: /search PLP
 * grid, Frequently Bought Together, Customers Also Purchased. If you're
 * about to write another "product card" anywhere, use this one instead.
 *
 * ── Layout structure (worst case — every slot filled, top to bottom) ──
 *
 *   1. Image                     square, muted background, `object-contain`
 *                                mix-blend-multiply so white-background
 *                                product photos drop into the card cleanly.
 *   2. Brand                     small blue-primary underline-on-hover link.
 *   3. Title                     3-line clamp with ellipsis. Reserves 3 lines
 *                                of vertical space (`min-h-[3lh]`) so cards
 *                                align across a row regardless of title
 *                                length.
 *   4. Badges row                horizontal flex-wrap of Badge chips —
 *                                canonical badge slot per docs/design-system.md
 *                                §Badges. Renders in this order when present:
 *                                  · `badges` (New, Sale, PRO Essentials, …)
 *                                  · `PointsBadge` when `points` is set
 *                                Kept as a single row so intent chips (Sale)
 *                                and reward chips (Points) share one visual
 *                                cluster; never split across cards.
 *   5. Item / MFG                muted stacked labels: `Item: {item}` /
 *                                `MFG: {mfg}` — matches the /search PLP + PDP
 *                                summary treatment.
 *   6. Price + / EACH            `text-price` (foreground black), muted
 *                                `/ EACH` suffix. Optional muted was-price
 *                                strikethrough when `wasPrice` is set — Sale
 *                                signal lives in the badges row, price stays
 *                                neutral. See PDP price-cluster rule.
 *   7. Stock                     single green line: `In stock · N All Branches`.
 *                                Uses `allBranchesQty` when present, otherwise
 *                                `nearbyQty`.
 *   8. Qty stepper + Add to Cart inline row, qty stepper on the left, primary
 *                                Add to Cart button flex-1 on the right.
 *   9. + Add to List             self-start muted link below the row.
 *
 * ── Fixed height guarantee ──
 * `flex h-full flex-col` on the outer container + `mt-auto` on the pinned
 * bottom block + `min-h-[3lh]` on the title link keeps every card in a row
 * the same height, regardless of title length or badge count. If a caller
 * needs to override the height, use a parent grid, not a card-level prop.
 *
 * ── Signed-out state ──
 * Steps 6–9 collapse to a single "Sign in to view pricing" primary-color
 * link. Badges + Item/MFG still render.
 */

import * as React from "react";
import { ImageOff, ListPlus, Minus, Plus, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatUSD, type PdpBadge } from "./types";

export type ProductCardData = {
  id: string;
  brand?: string;
  title: string;
  item: string;
  mfg: string;
  image?: string;
  /** Merchandising / attribute badges (outline-color style). Rendered under Item/MFG. */
  badges?: PdpBadge[];
  /** "N% Also Purchased" affinity indicator (Customers Also Purchased rows). */
  pct?: number;
  /** Commerce fields — omit / null on signed-out or gated state. */
  price?: number | null;
  wasPrice?: number;
  points?: number;
  /** "N Your Branch" line (green). */
  yourBranchQty?: number;
  /** "N Nearby Branch" line (blue link). */
  nearbyBranchQty?: number;
  /** Optional per-item unit-of-measure. Defaults to "EACH". */
  uom?: string;
  /** Link target for the title + brand. */
  href?: string;
};

/** Card image with graceful fallback to a hatched "no image" tile. */
function CardImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <div className="grid aspect-square place-items-center overflow-hidden rounded-md bg-muted/40 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className="grid aspect-square place-items-center rounded-md text-xs text-muted-foreground"
      style={{
        backgroundColor: "var(--muted)",
        backgroundImage:
          "repeating-linear-gradient(45deg, color-mix(in oklch, var(--muted-foreground) 12%, transparent) 0 6px, transparent 6px 12px)",
      }}
    >
      <ImageOff className="size-6 opacity-40" />
    </div>
  );
}

/** Qty stepper + Add button INLINE — per Figma node 3:2172. Qty stepper
 *  is 113×34px with per-cell borders; Add button is 109×32px. Row uses
 *  space-between so both stay pinned to their edges. Matches the exact
 *  visual spec — do not switch to stacked. */
function QtyPlusAdd() {
  const [qty, setQty] = React.useState(1);
  return (
    <div className="flex items-center justify-between">
      <div
        className="inline-flex h-[34px] w-[113px] items-stretch overflow-hidden rounded-[4px] border border-[#e1e1e5]"
        role="group"
        aria-label="Quantity"
      >
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
          className="grid w-[33px] shrink-0 place-items-center text-foreground opacity-40 transition-opacity hover:opacity-70 disabled:cursor-not-allowed"
        >
          <Minus className="size-3.5" />
        </button>
        <span
          aria-live="polite"
          className="grid w-[45px] shrink-0 place-items-center border-x border-[#e1e1e5] text-sm font-medium tabular-nums text-foreground"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Increase quantity"
          className="grid w-[33px] shrink-0 place-items-center text-foreground transition-opacity hover:opacity-70"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      <button
        type="button"
        className="inline-flex h-[32px] w-[109px] shrink-0 items-center justify-center gap-1.5 rounded-[4px] bg-[#2280df] text-sm font-medium text-white transition-colors hover:bg-[#1a6cc7] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ShoppingCart className="size-4 shrink-0" />
        Add
      </button>
    </div>
  );
}

export function ProductCard({
  data,
  signedIn,
}: {
  data: ProductCardData;
  signedIn: boolean;
}) {
  const href = data.href ?? "#";
  const hasCommerce = signedIn && data.price != null;

  // Every optional slot below reserves its rendered height even when empty,
  // so cards NEVER resize based on which fields a given SKU carries. Two
  // cards in the same row — one with badges, one without — are the same
  // height, always.
  return (
    <article className="flex h-full flex-col gap-2 rounded-[4px] border border-[#e1e1e5] bg-white p-4">
      {/* 1. Image */}
      <CardImage src={data.image} alt={data.title} />

      {/* 2. Points chip — pink #FCC1FA background per Figma node 3:2202.
              Slot reserves 1 badge row of height when absent. */}
      <div className="flex min-h-[1.5rem] items-start">
        {signedIn && data.points ? (
          <span className="inline-flex items-center bg-[#fcc1fa] px-1.5 py-0.5 text-xs font-medium leading-4 text-foreground">
            Earn {data.points} {data.points === 1 ? "point" : "points"}
          </span>
        ) : null}
      </div>

      {/* 3. Title — Curious Blue #2280DF, Roboto SemiBold 14px/18px,
              3-line clamp. Slot reserves 3 lines. */}
      <a
        href={href}
        className="line-clamp-3 min-h-[54px] text-sm font-semibold leading-[18px] text-[#2280df] hover:underline"
      >
        {data.title}
      </a>

      {/* 4. Item / MFG — 12px/16px per Figma. Labels grey, values dark. */}
      <div className="min-h-[32px] text-xs leading-4 text-[#71717b]">
        <p>
          Item: <span className="text-foreground">{data.item}</span>
        </p>
        <p>
          MFG: <span className="text-foreground">{data.mfg}</span>
        </p>
      </div>

      {/* 5. Attribute badges (PRO Essentials, SUBSTITUTE, etc.) — outline
              color chips. Reserves 1 badge-row of height even when empty. */}
      <div className="flex min-h-[1.5rem] flex-wrap gap-1.5">
        {data.badges?.map((b) => (
          <Badge key={b.label} variant={b.tone} color={b.color}>
            {b.label}
          </Badge>
        ))}
      </div>

      {/* 6. "N% Also Purchased" affinity — italic muted, reserves 1 line */}
      <p className="min-h-[1lh] text-xs italic leading-tight text-muted-foreground">
        {data.pct != null ? `${data.pct}% Also Purchased` : null}
      </p>

      {/* Pinned bottom — every subsequent slot reserves fixed height. */}
      <div className="mt-auto flex flex-col gap-1 pt-1">
        {/* 7. Your Branch stock — black, Roboto Medium 12px/16px per Figma. */}
        <p className="min-h-4 truncate text-xs font-medium leading-4 text-black">
          {hasCommerce && data.yourBranchQty != null
            ? `${data.yourBranchQty.toLocaleString()} Your Branch`
            : null}
        </p>

        {/* 8. Nearby Branch link — Curious Blue #2280DF per Figma. */}
        <p className="min-h-4 truncate text-xs font-medium leading-4">
          {hasCommerce && data.nearbyBranchQty != null ? (
            <a
              href="#"
              className="text-[#2280df] underline-offset-4 hover:underline"
            >
              {data.nearbyBranchQty.toLocaleString()} Nearby Branch
            </a>
          ) : null}
        </p>

        {/* 9. Price — Roboto Bold 16px/24px #18181B, "/ EACH" muted 12px. */}
        <p className="flex min-h-6 flex-wrap items-baseline gap-1.5 pt-1">
          {hasCommerce ? (
            <>
              <span className="text-base font-bold leading-6 text-[#18181b]">
                {formatUSD(data.price!)}
              </span>
              <span className="text-xs leading-4 text-[#71717b]">
                / {data.uom ?? "EACH"}
              </span>
              {data.wasPrice != null ? (
                <span className="text-xs leading-4 text-[#71717b] line-through">
                  {formatUSD(data.wasPrice)}
                </span>
              ) : null}
            </>
          ) : null}
        </p>

        {/* 10. Qty stepper + Add — INLINE row per Figma node 3:2178. */}
        <div className="min-h-[34px] pt-1">
          {hasCommerce ? (
            <QtyPlusAdd />
          ) : (
            <a
              href="#"
              className="inline-flex h-[34px] items-center text-sm font-medium text-[#2280df] underline-offset-4 hover:underline"
            >
              Sign in to view pricing
            </a>
          )}
        </div>

        {/* 11. Save to List — Roboto Medium 14px/20px #71717B per Figma. */}
        <div className="min-h-5 pt-1">
          {hasCommerce ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 self-start text-sm font-medium leading-5 text-[#71717b] transition-colors hover:text-foreground"
            >
              <ListPlus className="size-4" />
              Save to List
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
