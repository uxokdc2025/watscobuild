"use client";

import { ListPlus, Minus, Plus, Search, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Category, Demo } from "../_showcase";

/** The stepper + primary-CTA row that anchors the variant — same footprint
 *  the PDP buy-box uses, so alignment is honest. */
function QtyAndAdd() {
  const cell =
    "grid h-9 w-9 place-items-center text-foreground disabled:opacity-40 disabled:hover:bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors";
  return (
    <div className="flex items-center gap-3">
      <div
        className="inline-flex items-center rounded-md border"
        role="group"
        aria-label="Quantity"
      >
        <button type="button" className={cn(cell, "rounded-l-md")} aria-label="Decrease">
          <Minus className="size-4" />
        </button>
        <span className="grid h-9 w-9 place-items-center border-x text-sm font-medium tabular-nums">
          1
        </span>
        <button type="button" className={cn(cell, "rounded-r-md")} aria-label="Increase">
          <Plus className="size-4" />
        </button>
      </div>
      <button
        type="button"
        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ShoppingCart className="size-4" />
        Add to Cart
      </button>
    </div>
  );
}

/** Canonical PDP secondary-actions row (locked 2026-08-18): Save stays a
 *  muted text link; Find AHRI is promoted to a small purple outline button
 *  so the discovery CTA reads as an action, not a footnote. */
function AhriButtonVariant() {
  return (
    <div className="-ml-1 flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ListPlus className="size-4" />
        Save to List
      </button>
      <a
        href="#"
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-violet-500 px-3 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-950/40"
      >
        <Search className="size-3.5" />
        Find an AHRI Matched System
      </a>
    </div>
  );
}

/** Showcase for the canonical "Save + Find AHRI" row that sits under the
 *  Add-to-Cart on PDPs where the product carries an AHRI matchup. The Add /
 *  Qty row is drawn above so real alignment is visible. */
export function PdpActionsSection() {
  return (
    <Category
      id="pdp-actions"
      title="Save + Find AHRI actions"
      description="Canonical secondary-actions row that sits under the Add-to-Cart on PDPs with an AHRI matchup. The Qty + Add row is drawn above so alignment is honest."
    >
      <Demo
        name="Save link + Find AHRI outline button"
        slug="pdp-actions"
        description="Save stays a muted text link; Find AHRI is promoted to a small purple outline button so the discovery CTA reads as an action, not a footnote."
      >
        <div className="flex flex-col gap-3">
          <QtyAndAdd />
          <AhriButtonVariant />
        </div>
      </Demo>
    </Category>
  );
}
