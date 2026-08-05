"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Pack-size selector as pills. Scales gracefully from one option to many —
 * a better fit than a segmented control when a BU only stocks one or two
 * pack sizes (e.g. Each, 12-Pk). A single option renders as a static label.
 */
/** Total item count a pack label represents: the parenthetical when present
 * ("2 Packs (48)" → 48), else the leading number ("1 Item" → 1). */
function packQuantity(label: string): number {
  const paren = label.match(/\((\d+)\)/);
  if (paren) return Number(paren[1]);
  const lead = label.match(/\d+/);
  return lead ? Number(lead[0]) : 1;
}

export function PackSizePills({
  options,
  className,
  onSelect,
}: {
  options: string[];
  className?: string;
  /** Called with the total item count when a pill is selected. */
  onSelect?: (qty: number) => void;
}) {
  const [active, setActive] = React.useState(0);

  if (options.length === 1) {
    return (
      <span className="inline-flex w-fit rounded-full border bg-muted px-4 py-1.5 text-sm font-medium">
        {options[0]}
      </span>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={i === active}
          onClick={() => {
            setActive(i);
            onSelect?.(packQuantity(o));
          }}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            i === active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
