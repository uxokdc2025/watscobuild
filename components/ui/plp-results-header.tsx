"use client";

import * as React from "react";
import { LayoutGrid, List as ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Search / category results header
 *
 * ONE row above the filters: the category (or query) title, the result
 * count beside it in a smaller font, and the view controls pushed to the
 * right end of that same row. It sits above the pinned top filter bar, so
 * the page reads title → count → controls → filters → results.
 *
 * Composition:
 *   <ResultsHeader title="Residential" count={348}
 *                  actions={<ResultsViewToggle … />} />
 * ------------------------------------------------------------------ */

export type ResultsView = "grid" | "list";

/** Grid / List — mutually exclusive, on the shared DS Button. The selected
 *  side uses the design-system active-nav tokens (light blue tint + darkened
 *  link blue), the same pair the tabs use. */
export function ResultsViewToggle({
  value,
  onChange,
  className,
}: {
  value: ResultsView;
  onChange: (view: ResultsView) => void;
  className?: string;
}) {
  const options: { view: ResultsView; label: string; Icon: typeof LayoutGrid }[] = [
    { view: "grid", label: "Grid", Icon: LayoutGrid },
    { view: "list", label: "List", Icon: ListIcon },
  ];
  return (
    <div
      role="group"
      aria-label="Result view"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border bg-background p-0.5",
        className,
      )}
    >
      {options.map(({ view, label, Icon }) => (
        <Button
          key={view}
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={value === view}
          onClick={() => onChange(view)}
          className={cn(
            "rounded-sm",
            value === view
              ? "bg-[var(--tab-active-bg)] font-semibold text-[var(--tab-active-fg)] hover:bg-[var(--tab-active-bg)] hover:text-[var(--tab-active-fg)]"
              : "text-muted-foreground",
          )}
        >
          <Icon />
          {label}
        </Button>
      ))}
    </div>
  );
}

export function ResultsHeader({
  title,
  count,
  /** Reads as "348 results" by default. */
  countLabel = "results",
  /** Right end of the row — the view toggle, and nothing that needs width. */
  actions,
  /** `h1` on a page whose title this is, `h2` where an H1 already exists. */
  as: level = "h1",
  className,
}: {
  title: React.ReactNode;
  count?: number;
  countLabel?: string;
  actions?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  const titleClass = "min-w-0 text-2xl font-bold tracking-tight md:text-3xl";
  return (
    <div
      className={cn(
        // One row on desktop; the actions drop to their own right-aligned
        // line on small screens rather than forcing the row to overflow.
        "flex flex-wrap items-center gap-x-3 gap-y-2",
        className,
      )}
    >
      {level === "h2" ? (
        <h2 className={titleClass}>{title}</h2>
      ) : (
        <h1 className={titleClass}>{title}</h1>
      )}
      {count == null ? null : (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold tabular-nums text-foreground">
            {count.toLocaleString()}
          </span>{" "}
          {countLabel}
        </p>
      )}
      {actions ? <div className="ml-auto shrink-0">{actions}</div> : null}
    </div>
  );
}
