"use client";

/**
 * MoreOptionsCard — the PLP results-grid end card ("Want more options?").
 *
 * The last tile in the results grid, after the final product on the last page.
 * It occupies a normal grid cell — same column rules, same width, `h-full` so
 * it matches the ProductCard height of its row — but is filled with the design
 * system's primary blue (the one accent colour) with white text, so the
 * widen-your-search offer reads as an action rather than as another product.
 *
 * ── Anatomy (all centered, vertically and horizontally) ──
 *   1. Icon           DS lucide `MapPin` in a soft translucent-white circle.
 *   2. Headline       "Want more options?"
 *   3. Subline        "**N** in stock at {branchName}" — N and the label are
 *                     the page's currently selected "Stocked At" scope.
 *   4. Scope tiles    one stacked white sub-tile per wider scope, fully
 *                     clickable: a large bold count in the primary accent
 *                     (2x body size), a small label under it ("Nearby
 *                     branches") and a trailing arrow. Each one switches the
 *                     "Stocked At" filter to that scope.
 *
 * ── Counts ──
 * `shownCount` and every `scopes[].count` come from the page's "Stocked At"
 * facet, so the card and the facet rail can never disagree. Only pass scopes
 * that genuinely hold MORE products than the current one — when none do there
 * are no more options to offer and the caller should drop the card entirely.
 *
 * Tokens only: `bg-primary` + `text-primary-foreground` for the card, the
 * inverse pair (`bg-primary-foreground` + `text-primary`) for the sub-tiles,
 * the small radius (`rounded-sm`) and the DS type scale. Never a hand-picked
 * blue, and never a second accent colour.
 */

import * as React from "react";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MoreOptionsScope = {
  /** Scope label, worded exactly as the "Stocked At" facet writes it. */
  label: string;
  /** That scope's product count — the facet's own count. */
  count: number;
  /** Switches the "Stocked At" filter to this scope. */
  onSelect?: () => void;
};

/** "Nearby Branches" → "Nearby branches" for the small tile label. */
function sentenceCase(label: string) {
  return label.charAt(0) + label.slice(1).toLowerCase();
}

export function MoreOptionsCard({
  branchName,
  shownCount,
  scopes,
  className,
}: {
  /** The selected "Stocked At" scope — the branch name in the default scope. */
  branchName: string;
  /** How many products the grid is showing in that scope. */
  shownCount: number;
  /** Wider scopes to offer, in ascending count order. */
  scopes: MoreOptionsScope[];
  className?: string;
}) {
  const headingId = React.useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        // Same shell metrics as ProductCard (rounded-md border, 15px padding,
        // h-full) so the tile lines up with the products either side of it.
        "flex h-full flex-col items-center justify-center gap-3 rounded-md border border-primary bg-primary p-[15px] text-center text-primary-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full bg-primary-foreground/15 ring-1 ring-primary-foreground/25"
      >
        <MapPin className="size-6" />
      </span>
      <div className="space-y-1">
        <h2 id={headingId} className="text-lg leading-7 font-bold">
          Want more options?
        </h2>
        <p className="text-sm leading-5 text-primary-foreground/90">
          <span className="font-bold text-primary-foreground">{shownCount.toLocaleString()}</span> in
          stock at {branchName}
        </p>
      </div>
      {scopes.length ? (
        <ul className="flex w-full flex-col gap-2 pt-1">
          {scopes.map((scope) => (
            <li key={scope.label}>
              {/* The whole sub-tile is the DS Button, recoloured to the
                  inverse token pair because it sits on the primary surface. */}
              <Button
                type="button"
                variant="secondary"
                onClick={scope.onSelect}
                aria-label={`Show ${scope.count.toLocaleString()} products stocked at ${scope.label}`}
                className="group/scope h-auto w-full justify-between gap-3 rounded-sm bg-primary-foreground px-3 py-2.5 text-left whitespace-normal text-primary shadow-xs transition-colors hover:bg-primary-foreground/90 focus-visible:ring-primary-foreground/70"
              >
                <span className="flex flex-col">
                  <span className="text-2xl leading-8 font-bold tabular-nums">
                    {scope.count.toLocaleString()}
                  </span>
                  <span className="text-xs leading-4 font-medium text-foreground">
                    {sentenceCase(scope.label)}
                  </span>
                </span>
                <ArrowRight
                  className="size-5 shrink-0 transition-transform group-hover/scope:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
