"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Pack-size selector as pills. Scales gracefully from one option to many —
 * a better fit than a segmented control when a BU only stocks one or two
 * pack sizes (e.g. Each, 12-Pk). A single option renders as a static label.
 */
export function PackSizePills({
  options,
  className,
}: {
  options: string[];
  className?: string;
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
          onClick={() => setActive(i)}
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
