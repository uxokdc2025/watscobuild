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
 *   4. Scope tiles    one stacked sub-tile per wider scope, fully clickable:
 *                     a large bold count (2x body size), a small label under
 *                     it ("Nearby branches") and a trailing arrow. Each one
 *                     switches the "Stocked At" filter to that scope.
 *
 * ── Framing (`variant`) ──
 * Two framings, one anatomy and one behaviour:
 *   - `solid`   — the original tile: filled `bg-primary` with white text, so
 *                 the offer reads as an action rather than as a product. Kept
 *                 for the pages reviewed before Nov 17.
 *   - `outline` — the Nov 17 review treatment: a white/neutral surface inside
 *                 a THICK grey outline (3px `border-input`, three times the
 *                 product card's 1px edge), with no blue anywhere — no blue
 *                 fill, no blue outline, no blue count. The thick neutral
 *                 frame is what sets the tile apart from the products either
 *                 side of it; the counts stay emphasised in `text-foreground`.
 *                 Use this wherever a wall of solid blue would shout over the
 *                 grid it closes.
 *
 * ── Counts ──
 * `shownCount` and every `scopes[].count` come from the page's "Stocked At"
 * facet, so the card and the facet rail can never disagree. Only pass scopes
 * that genuinely hold MORE products than the current one — when none do there
 * are no more options to offer and the caller should drop the card entirely.
 *
 * Tokens only: `bg-primary`/`bg-primary-foreground` for the solid framing,
 * `border-input` + `bg-card` + `bg-muted` + `text-foreground` /
 * `text-muted-foreground` for the outline framing, the small radius
 * (`rounded-sm`) and the DS type scale. Never a hand-picked grey or blue, and
 * never a second accent colour.
 */

import * as React from "react";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** How the end card is framed. See the component docblock. */
export type MoreOptionsCardVariant = "solid" | "outline";

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
  variant = "solid",
  className,
}: {
  /** The selected "Stocked At" scope — the branch name in the default scope. */
  branchName: string;
  /** How many products the grid is showing in that scope. */
  shownCount: number;
  /** Wider scopes to offer, in ascending count order. */
  scopes: MoreOptionsScope[];
  /** Framing: `solid` primary tile (default) or the Nov 17 `outline` tile. */
  variant?: MoreOptionsCardVariant;
  className?: string;
}) {
  const headingId = React.useId();
  const outline = variant === "outline";
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        // Same shell metrics as ProductCard (rounded-md border, 15px padding,
        // h-full) so the tile lines up with the products either side of it.
        "flex h-full flex-col items-center justify-center gap-3 rounded-md p-[15px] text-center",
        outline
          ? // Thick grey outline on the white card surface — the whole signal,
            // with no blue fill and no blue edge.
            "border-[3px] border-input bg-card text-card-foreground"
          : "border border-primary bg-primary text-primary-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 place-items-center rounded-full",
          outline
            ? "bg-muted text-foreground ring-1 ring-border"
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
            outline ? "text-muted-foreground" : "text-primary-foreground/90",
          )}
        >
          <span
            className={cn(
              "font-bold",
              outline ? "text-foreground" : "text-primary-foreground",
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
              {/* The whole sub-tile is the DS Button: the outlined neutral
                  `secondary` tile on the outline framing, or the inverse
                  token pair when it sits on the primary surface. */}
              <Button
                type="button"
                variant="secondary"
                onClick={scope.onSelect}
                aria-label={`Show ${scope.count.toLocaleString()} products stocked at ${scope.label}`}
                className={cn(
                  "group/scope h-auto w-full justify-between gap-3 rounded-sm px-3 py-2.5 text-left whitespace-normal",
                  outline
                    ? "border-input bg-muted/40 text-foreground hover:bg-accent"
                    : "bg-primary-foreground text-primary shadow-xs transition-colors hover:bg-primary-foreground/90 focus-visible:ring-primary-foreground/70",
                )}
              >
                <span className="flex flex-col">
                  <span
                    className={cn(
                      "text-2xl leading-8 font-bold tabular-nums",
                      outline && "text-foreground",
                    )}
                  >
                    {scope.count.toLocaleString()}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-4 font-medium",
                      outline ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {sentenceCase(scope.label)}
                  </span>
                </span>
                <ArrowRight
                  className={cn(
                    "size-5 shrink-0 transition-transform group-hover/scope:translate-x-0.5",
                    outline && "text-muted-foreground",
                  )}
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
