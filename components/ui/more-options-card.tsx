"use client";

/**
 * MoreOptionsCard — the PLP results-grid end card ("Want more options?").
 *
 * The last tile in the results grid, after the final product on the last page.
 * It occupies a normal grid cell — same column rules, same width, `h-full` so
 * it matches the ProductCard height of its row — and offers the shopper the
 * wider "Stocked At" scopes instead of another product.
 *
 * ── Anatomy (all centered, vertically and horizontally) ──
 *   1. Icon           DS lucide `MapPin` in a soft circle.
 *   2. Headline       "Want more options?"
 *   3. Subline        "**N** in stock at {branchName}" — N and the label are
 *                     the page's currently selected "Stocked At" scope.
 *   4. Scope rows     one row per wider scope, fully clickable: a large bold
 *                     count (2x body size), a small label under it ("Nearby
 *                     branches") and a trailing arrow. Each one switches the
 *                     "Stocked At" filter to that scope.
 *
 * ── Framing (`variant`) ──
 * Two framings, one anatomy and one behaviour:
 *   - `solid`   — the original tile: filled `bg-primary` with white text, so
 *                 the offer reads as an action rather than as a product. Kept
 *                 for the pages reviewed before Nov 17.
 *   - `toast`   — the Nov 17 review treatment: the design system's yellow
 *                 messaging surface, the same one the warning toast and
 *                 `Alert variant="warning"` use — a light yellow fill
 *                 (`bg-yellow-400/20`) inside a brownish yellow edge
 *                 (`border-yellow-600/60`). The headline and the subline are
 *                 plain `text-foreground` black; only the scope rows carry
 *                 colour, as DS blue links (`Button variant="link"` — count
 *                 and label together are the link). The note surface is what
 *                 sets the tile apart from the products either side of it,
 *                 without a wall of blue shouting over the grid it closes.
 *
 * ── Counts ──
 * `shownCount` and every `scopes[].count` come from the page's "Stocked At"
 * facet, so the card and the facet rail can never disagree. Only pass scopes
 * that genuinely hold MORE products than the current one — when none do there
 * are no more options to offer and the caller should drop the card entirely.
 *
 * Tokens only: `bg-primary`/`bg-primary-foreground` for the solid framing, the
 * DS warning yellows (`yellow-400` / `yellow-600`) plus `text-foreground` and
 * `text-primary` for the toast framing, the small radius (`rounded-sm`) and
 * the DS type scale. Never a hand-picked yellow, grey or blue, and never a
 * second accent colour.
 */

import * as React from "react";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** How the end card is framed. See the component docblock. */
export type MoreOptionsCardVariant = "solid" | "toast";

export type MoreOptionsScope = {
  /** Scope label, worded exactly as the "Stocked At" facet writes it. */
  label: string;
  /** That scope's product count — the facet's own count. */
  count: number;
  /** Switches the "Stocked At" filter to this scope. */
  onSelect?: () => void;
};

/** "Nearby Branches" → "Nearby branches" for the small row label. */
function sentenceCase(label: string) {
  return label.charAt(0) + label.slice(1).toLowerCase();
}

export function MoreOptionsCard({
  branchName,
  shownCount,
  scopes,
  variant = "solid",
  className,
}: {
  /** The selected "Stocked At" scope — the branch name in the default scope. */
  branchName: string;
  /** How many products the grid is showing in that scope. */
  shownCount: number;
  /** Wider scopes to offer, in ascending count order. */
  scopes: MoreOptionsScope[];
  /** Framing: `solid` primary tile (default) or the Nov 17 `toast` note. */
  variant?: MoreOptionsCardVariant;
  className?: string;
}) {
  const headingId = React.useId();
  const toast = variant === "toast";
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        // Same shell metrics as ProductCard (rounded-md border, 15px padding,
        // h-full) so the tile lines up with the products either side of it.
        "flex h-full flex-col items-center justify-center gap-3 rounded-md p-[15px] text-center",
        toast
          ? // The DS yellow messaging surface — light yellow fill, brownish
            // edge, black copy. Same tokens as the warning toast / Alert.
            "border-2 border-yellow-600/60 bg-yellow-400/20 text-foreground"
          : "border border-primary bg-primary text-primary-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 place-items-center rounded-full",
          toast
            ? "bg-yellow-400/35 text-foreground ring-1 ring-yellow-600/30"
            : "bg-primary-foreground/15 ring-1 ring-primary-foreground/25",
        )}
      >
        <MapPin className="size-6" />
      </span>
      <div className="space-y-1">
        <h2 id={headingId} className="text-lg leading-7 font-bold">
          Want more options?
        </h2>
        <p
          className={cn(
            "text-sm leading-5",
            toast ? "text-foreground" : "text-primary-foreground/90",
          )}
        >
          <span
            className={cn(
              "font-bold",
              toast ? "text-foreground" : "text-primary-foreground",
            )}
          >
            {shownCount.toLocaleString()}
          </span>{" "}
          in stock at {branchName}
        </p>
      </div>
      {scopes.length ? (
        <ul className="flex w-full flex-col gap-2 pt-1">
          {scopes.map((scope) => (
            <li key={scope.label}>
              {/* The whole row is the DS Button: the blue `link` variant on the
                  toast framing — count and label are one blue link, nothing
                  else on the card is coloured — or the inverse-token tile when
                  it sits on the primary surface. */}
              <Button
                type="button"
                variant={toast ? "link" : "secondary"}
                onClick={scope.onSelect}
                aria-label={`Show ${scope.count.toLocaleString()} products stocked at ${scope.label}`}
                className={cn(
                  "group/scope h-auto w-full justify-between gap-3 rounded-sm text-left whitespace-normal",
                  toast
                    ? "px-0 py-1"
                    : "bg-primary-foreground px-3 py-2.5 text-primary shadow-xs transition-colors hover:bg-primary-foreground/90 focus-visible:ring-primary-foreground/70",
                )}
              >
                <span className="flex flex-col">
                  <span className="text-2xl leading-8 font-bold tabular-nums">
                    {scope.count.toLocaleString()}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-4 font-medium",
                      !toast && "text-foreground",
                    )}
                  >
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
