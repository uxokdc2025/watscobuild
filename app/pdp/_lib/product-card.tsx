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
import { Button } from "@/components/ui/button";
import { PointsBadge } from "@/components/ui/label-badges";
import { cn } from "@/lib/utils";
import { formatUSD, type PdpBadge } from "./types";

export type ProductCardData = {
  id: string;
  brand?: string;
  title: string;
  item: string;
  mfg: string;
  image?: string;
  /** Badges row — same shape as `PdpProduct.badges`. Renders before `PointsBadge`. */
  badges?: PdpBadge[];
  /** "N% Also Purchased" affinity indicator (Customers Also Purchased rows). */
  pct?: number;
  /** Commerce fields — omit / null on signed-out or gated state. */
  price?: number | null;
  wasPrice?: number;
  points?: number;
  /** Displayed stock number. Prefer `allBranchesQty`; falls back to `nearbyQty`. */
  allBranchesQty?: number;
  nearbyQty?: number;
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

/** Qty stepper on top, Add-to-Cart below — stacked so the CTA gets the
 *  full card width and never gets clipped at narrow column sizes. */
function QtyPlusAdd() {
  const [qty, setQty] = React.useState(1);
  const step =
    "grid h-9 w-8 place-items-center text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div className="flex flex-col gap-2">
      <div
        className="inline-flex h-9 items-center self-start rounded-md border"
        role="group"
        aria-label="Quantity"
      >
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
          className={cn(step, "rounded-l-md")}
        >
          <Minus className="size-3.5" />
        </button>
        <span
          aria-live="polite"
          className="w-8 text-center text-sm font-medium tabular-nums"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Increase quantity"
          className={cn(step, "rounded-r-md")}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      <Button size="sm" className="h-9 w-full">
        <ShoppingCart className="size-4" />
        Add to Cart
      </Button>
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
  const allBranches = data.allBranchesQty ?? data.nearbyQty;
  const hasCommerce = signedIn && data.price != null;

  // Every optional slot below reserves its rendered height even when empty,
  // so cards NEVER resize based on which fields a given SKU carries. Two
  // cards in the same row — one with badges, one without — are the same
  // height, always. This is the David-approved worst-case guarantee.
  return (
    <article className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4">
      {/* 1. Image — fixed aspect-square */}
      <CardImage src={data.image} alt={data.title} />

      {/* 2. Brand — reserves 1 line even when absent */}
      <div className="min-h-[1lh]">
        {data.brand ? (
          <a
            href={href}
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            {data.brand}
          </a>
        ) : null}
      </div>

      {/* 3. Title — 4-line clamp; slot reserves 4 lines even for short titles */}
      <a
        href={href}
        className="line-clamp-4 min-h-[4lh] text-sm font-semibold leading-snug text-foreground hover:text-primary"
      >
        {data.title}
      </a>

      {/* 4. Badges row — reserves one badge-row of height even when empty */}
      <div className="flex min-h-[1.5rem] flex-wrap gap-1.5">
        {data.badges?.map((b) => (
          <Badge key={b.label} variant={b.tone} color={b.color}>
            {b.label}
          </Badge>
        ))}
        {signedIn && data.points ? <PointsBadge points={data.points} /> : null}
      </div>

      {/* 5. "N% Also Purchased" affinity — italic muted, reserves 1 line */}
      <p className="min-h-[1lh] text-xs italic leading-tight text-muted-foreground">
        {data.pct != null ? `${data.pct}% Also Purchased` : null}
      </p>

      {/* Pinned bottom — every subsequent slot reserves fixed height so cards
          in a row are the same height regardless of state. */}
      <div className="mt-auto flex flex-col gap-2 pt-1">
        {/* 6. Item / MFG — always 2 lines */}
        <div className="min-h-[2lh] text-xs leading-tight text-muted-foreground">
          <p>
            Item: <span className="text-foreground">{data.item}</span>
          </p>
          <p>
            MFG: <span className="text-foreground">{data.mfg}</span>
          </p>
        </div>

        {/* 7. Price + / EACH + optional was-price — reserves 1 line */}
        <p className="flex min-h-[1lh] flex-wrap items-baseline gap-1.5 leading-tight">
          {hasCommerce ? (
            <>
              <span className="text-base font-bold text-price">
                {formatUSD(data.price!)}
              </span>
              <span className="text-xs text-muted-foreground">
                / {data.uom ?? "EACH"}
              </span>
              {data.wasPrice != null ? (
                <span className="text-xs text-muted-foreground line-through">
                  {formatUSD(data.wasPrice)}
                </span>
              ) : null}
            </>
          ) : null}
        </p>

        {/* 8. Stock — reserves 1 line */}
        <p className="min-h-[1lh] text-xs font-medium leading-tight text-in-stock">
          {hasCommerce && allBranches != null
            ? `In stock · ${allBranches.toLocaleString()} All Branches`
            : null}
        </p>

        {/* 9. Qty stepper + Add-to-Cart — stacked so the CTA never clips at
              narrow card widths. Slot reserves h-[calc(2*2.25rem+0.5rem)]
              (two h-9 rows + gap-2) whether the control or the signed-out
              "Sign in to view pricing" link is showing. */}
        <div className="min-h-[calc(2*2.25rem+0.5rem)]">
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

        {/* 10. + Add to List — reserves 1 line even signed-out */}
        <div className="min-h-[1lh]">
          {hasCommerce ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ListPlus className="size-3.5" />
              Add to List
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
