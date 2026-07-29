"use client";

import * as React from "react";
import { Check, GitCompare } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Compare toggle — a low-emphasis (ghost) control that sits beneath the
 * primary CTA and secondary "Save to List". Reads "Compare" by default and
 * flips to "✓ Comparing" when active. Kept lighter than Save to List so the
 * Add-to-Cart hierarchy stays intact.
 */
export function CompareButton({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const [on, setOn] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={on ? "Remove from compare" : "Add to compare"}
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm",
        on ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {on ? (
        <Check className={size === "sm" ? "size-3.5" : "size-4"} />
      ) : (
        <GitCompare className={size === "sm" ? "size-3.5" : "size-4"} />
      )}
      {on ? "Comparing" : "Compare"}
    </button>
  );
}
