"use client";

/**
 * Expandable product row — the accordion panel a family-table row opens into.
 *
 * The compact table row carries only the comparison columns; everything a
 * contractor needs to actually buy lives here, one row at a time, without
 * leaving the comparison. Three zones at lg+, stacked below:
 *
 *   [ image 112px ] [ identity + specs ]            [ commerce ]
 *                    brand                            price / EACH
 *                    product name (link)              availability by branch
 *                    Item / MFG numbers               qty + Add to Cart
 *                    View product details →           Add to List
 *                    Compare checkbox
 *                    spec list (every column, incl.
 *                    the ones the table dropped)
 *
 * The `commerce` slot is caller-supplied: price gating, cart wiring and
 * branch inventory are app concerns, not DS concerns. The panel owns the
 * layout, the identity block and the availability presentation.
 */

import * as React from "react";
import { ExternalLink, ImageOff } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type BranchStock = {
  name: string;
  qty: number;
  /** Replaces the qty line, e.g. "Available to order". */
  note?: string;
};

export function ExpandableProductRowDetail({
  image,
  brand,
  title,
  href,
  item,
  mfg,
  compareId,
  specs,
  commerce,
  className,
}: {
  image?: string;
  brand?: string;
  title: string;
  /** PDP link — also the "View product details" target. */
  href: string;
  item: string;
  mfg: string;
  /** Unique id for the Compare checkbox + its label. */
  compareId: string;
  /** Spec rows — pass every configured column, including hidden ones. */
  specs?: React.ReactNode;
  /** Price, availability and the add actions. */
  commerce: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-5 lg:grid-cols-[112px_minmax(0,1fr)_minmax(0,16rem)]",
        className,
      )}
    >
      {/* Image */}
      <div className="grid size-24 place-items-center rounded-md border bg-background p-1.5 text-muted-foreground lg:size-28">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
          />
        ) : (
          <ImageOff className="size-6 opacity-40" aria-hidden="true" />
        )}
      </div>

      {/* Identity */}
      <div className="min-w-0 space-y-2">
        {brand ? (
          <p className="text-xs font-medium text-muted-foreground">{brand}</p>
        ) : null}
        <a
          href={href}
          className="block text-sm font-semibold leading-snug text-primary underline-offset-2 hover:underline"
        >
          {title}
        </a>
        <p className="text-xs text-muted-foreground">
          Item: <span className="text-foreground">{item}</span>
          {" · "}
          MFG: <span className="text-foreground">{mfg}</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View product details
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
          <label
            htmlFor={compareId}
            className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Checkbox id={compareId} aria-label={`Compare ${title}`} />
            Compare
          </label>
        </div>
        {specs ? <div className="pt-1">{specs}</div> : null}
      </div>

      {/* Commerce */}
      <div className="space-y-3 lg:border-l lg:pl-5">{commerce}</div>
    </div>
  );
}

/**
 * Availability by branch — the stacked branch list the expanded row shows
 * instead of the single aggregate stock line a card has. Zero-stock branches
 * read "Available to order" in the friendly low-stock token, never red: a
 * transfer is still a sale.
 */
export function BranchAvailabilityList({
  branches,
  moreHref = "/store-locator/inventory/in-plp?v=c",
  moreLabel = "Check all branches",
  className,
}: {
  branches: BranchStock[];
  moreHref?: string;
  moreLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Availability
      </p>
      <ul className="space-y-0.5 text-xs">
        {branches.map((branch) => {
          const stocked = branch.note === undefined && branch.qty > 0;
          return (
            <li key={branch.name} className="flex items-baseline justify-between gap-3">
              <span className="truncate text-muted-foreground">{branch.name}</span>
              <span
                className={cn("shrink-0 font-medium", stocked ? "text-in-stock" : "text-low-stock")}
              >
                {branch.note ?? (stocked ? `${branch.qty.toLocaleString()} in stock` : "Available to order")}
              </span>
            </li>
          );
        })}
      </ul>
      <a
        href={moreHref}
        className="inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {moreLabel}
      </a>
    </div>
  );
}
