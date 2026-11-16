"use client";

/**
 * MoreOptionsCard — the PLP results-grid end card ("Want to see more options?").
 *
 * The last tile in the results grid, after the final product on the last page.
 * It occupies a normal grid cell — same column rules, same width, `h-full` so
 * it matches the ProductCard height of its row — but is filled with the design
 * system's primary blue (the one accent colour) with white text, so the
 * widen-your-search offer reads as an action rather than as another product.
 *
 * ── Anatomy (top to bottom) ──
 *   1. Heading        "Want to see more options?"
 *   2. Current scope  "We are showing N products stocked at {branchName}" —
 *                     N and the label are the page's currently selected
 *                     "Stocked At" scope.
 *   3. Scope links    one per wider scope: "N products stocked at {label}".
 *                     Each one switches the "Stocked At" filter to that scope.
 *
 * ── Counts ──
 * `shownCount` and every `scopes[].count` come from the page's "Stocked At"
 * facet, so the card and the facet rail can never disagree. Only pass scopes
 * that genuinely hold MORE products than the current one — when none do there
 * are no more options to offer and the caller should drop the card entirely.
 *
 * Colour: `bg-primary` + `text-primary-foreground`, the same token pair every
 * primary Button and FilterPill uses. Never a hand-picked blue, and never a
 * second accent colour.
 */

import * as React from "react";
import { ArrowRight } from "lucide-react";

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
        "flex h-full flex-col justify-center gap-3 rounded-md border border-primary bg-primary p-[15px] text-primary-foreground",
        className,
      )}
    >
      <h2 id={headingId} className="text-base leading-6 font-bold">
        Want to see more options?
      </h2>
      <p className="text-sm leading-5">
        We are showing <span className="font-semibold">{shownCount.toLocaleString()}</span>{" "}
        products stocked at {branchName}
      </p>
      {scopes.length ? (
        <ul className="flex flex-col gap-1 border-t border-primary-foreground/30 pt-3">
          {scopes.map((scope) => (
            <li key={scope.label}>
              {/* The DS link Button is the only underlining variant; the colour
                  is overridden to the inverse token because the surface is
                  primary, not the page background. */}
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={scope.onSelect}
                className="h-auto w-full justify-start p-0 text-left text-sm font-semibold whitespace-normal text-primary-foreground underline hover:text-primary-foreground focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/70"
              >
                {/* The arrow sits INSIDE the text run so it trails the last
                    word when the link wraps — and so the button keeps zero
                    padding (a direct svg child would re-add it). */}
                <span>
                  {scope.count.toLocaleString()} products stocked at {scope.label}
                  <ArrowRight className="ml-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
                </span>
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
