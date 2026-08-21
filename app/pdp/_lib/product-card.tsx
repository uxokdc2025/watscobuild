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
import {
  PointsBadge,
  ProEssentialsBadge,
  SubstituteBadge,
} from "@/components/ui/label-badges";
import { cn } from "@/lib/utils";
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
  /** "N in {branchName}" line (green). */
  yourBranchQty?: number;
  /** Human-readable branch label rendered next to yourBranchQty (e.g. "Miami"). */
  branchName?: string;
  /** "N Nearby Branch" line (blue link). */
  nearbyBranchQty?: number;
  /** Optional per-item unit-of-measure. Defaults to "EACH". */
  uom?: string;
  /** Link target for the title + brand. */
  href?: string;
};

/** Card image with graceful fallback to a hatched "no image" tile.
 *  No wrapping background — PNGs / transparent images drop straight into
 *  the card. `object-contain` sizes without distortion; the aspect-square
 *  keeps the slot height stable across cards. */
function CardImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <div className="grid aspect-square place-items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
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

/** Qty stepper + Add button INLINE. Qty stepper reuses the buy-box
 *  pattern (grid place-items-center cells with border-x on the middle)
 *  scaled to h-9 for card context. Add button uses the primary token. */
function QtyPlusAdd() {
  const [qty, setQty] = React.useState(1);
  const cell =
    "grid h-full w-8 cursor-pointer place-items-center text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
  return (
    <div className="flex items-center gap-2">
      <div
        className="inline-flex h-[34px] shrink-0 items-center rounded-md border"
        role="group"
        aria-label="Quantity"
      >
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
          className={cn(cell, "rounded-l-md")}
        >
          <Minus className="size-4" />
        </button>
        <span
          aria-live="polite"
          className="grid h-full w-8 place-items-center border-x text-sm font-medium tabular-nums"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Increase quantity"
          className={cn(cell, "rounded-r-md")}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <button
        type="button"
        className="inline-flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        style={{ flex: "1 1 0%", minWidth: 0 }}
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
    <article className="flex h-full flex-col gap-[7px] rounded-md border bg-card p-[15px]">
      {/* 1. Points — pinned to the very top of the card. Slot reserves 1
              badge row of height so cards stay aligned when points are
              absent. */}
      <div className="flex min-h-[1.5rem] items-start">
        {signedIn && data.points ? <PointsBadge points={data.points} /> : null}
      </div>

      {/* 2. Image */}
      <CardImage src={data.image} alt={data.title} />

      {/* 3. Brand — muted 12px, sits directly above the title. Slot reserves
              its line even when brand is absent so cards stay aligned. */}
      <p className="min-h-4 text-xs leading-4 text-muted-foreground">
        {data.brand ?? null}
      </p>

      {/* 4. Title — primary blue, 14px/18px semibold, 3-line clamp. Hover
              underlines the ENTIRE clamped title (all lines). We force the
              underline via a nested span (line-clamp on the <a> uses
              -webkit-box which can drop the last-line underline in some
              browsers). */}
      <a
        href={href}
        className="group block min-h-[54px] text-primary underline-offset-2 decoration-1 hover:underline"
      >
        <span className="line-clamp-3 text-sm font-semibold leading-[18px] text-primary group-hover:underline">
          {data.title}
        </span>
      </a>

      {/* 4. Item / MFG — 12px/16px. Labels muted, values foreground. */}
      <div className="min-h-[32px] text-xs leading-4 text-muted-foreground">
        <p>
          Item: <span className="text-foreground">{data.item}</span>
        </p>
        <p>
          MFG: <span className="text-foreground">{data.mfg}</span>
        </p>
      </div>

      {/* 5. Attribute badges — canonical Pro Essentials / Substitute
              components; anything else falls through to generic Badge. */}
      <div className="flex min-h-[1.5rem] flex-wrap gap-1.5">
        {data.badges?.map((b) => {
          const label = b.label.toLowerCase();
          if (label === "pro essentials") return <ProEssentialsBadge key={b.label} />;
          if (label === "substitute") return <SubstituteBadge key={b.label} />;
          return (
            <Badge key={b.label} variant={b.tone} color={b.color}>
              {b.label}
            </Badge>
          );
        })}
      </div>

      {/* 6. "N% Also Purchased" affinity — italic muted, reserves 1 line */}
      <p className="min-h-[1lh] text-xs italic leading-tight text-muted-foreground">
        {data.pct != null ? `${data.pct}% Also Purchased` : null}
      </p>

      {/* Pinned bottom — every subsequent slot reserves fixed height. */}
      <div className="mt-auto flex flex-col gap-1 pt-1">
        {/* 7. Your Branch stock — green, 12px/16px medium, real branch name. */}
        <p className="min-h-4 truncate text-xs font-medium leading-4 text-emerald-600">
          {hasCommerce && data.yourBranchQty != null
            ? `${data.yourBranchQty.toLocaleString()} in ${data.branchName ?? "Your Branch"}`
            : null}
        </p>

        {/* 8. Nearby Branch link — primary blue, 12px/16px medium. Opens the
              shared inventory drawer (Direction C) overlaid on the PLP. */}
        <p className="min-h-4 truncate text-xs font-medium leading-4">
          {hasCommerce && data.nearbyBranchQty != null ? (
            <a
              href="/store-locator/in-plp?v=c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 transition-colors hover:text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {data.nearbyBranchQty.toLocaleString()} Nearby Branch
            </a>
          ) : null}
        </p>

        {/* 9. Price — 16px/24px bold foreground, "/ EACH" 12px muted. */}
        <p className="flex min-h-6 flex-wrap items-baseline gap-1.5 pt-1">
          {hasCommerce ? (
            <>
              <span className="text-base font-bold leading-6 text-foreground">
                {formatUSD(data.price!)}
              </span>
              <span className="text-xs leading-4 text-muted-foreground">
                / {data.uom ?? "EACH"}
              </span>
              {data.wasPrice != null ? (
                <span className="text-xs leading-4 text-muted-foreground line-through">
                  {formatUSD(data.wasPrice)}
                </span>
              ) : null}
            </>
          ) : null}
        </p>

        {/* 10. Qty stepper + Add — inline row. */}
        <div className="min-h-[34px] pt-1">
          {hasCommerce ? (
            <QtyPlusAdd />
          ) : (
            <a
              href="#"
              className="inline-flex h-9 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in to view pricing
            </a>
          )}
        </div>

        {/* 11. Save — icon + short label, muted. */}
        <div className="min-h-5 pt-2">
          {hasCommerce ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 self-start text-sm font-medium leading-5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ListPlus className="size-4" />
              Save
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
