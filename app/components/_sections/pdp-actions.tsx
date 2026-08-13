"use client";

import { ListPlus, Minus, Plus, Search, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Category, Demo } from "../_showcase";

/** The two side-by-side stepper + primary-CTA rows that anchor these three
 *  variants — same footprint the PDP buy-box uses, so alignment is honest. */
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

/** V1 — current PDP row: two text links, muted Save + violet AHRI. */
function VariantOneLinks() {
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
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-violet-700 underline-offset-4 transition-colors hover:underline dark:text-violet-300"
      >
        <Search className="size-4" />
        Find an AHRI Matched System
      </a>
    </div>
  );
}

/** V2 — Save stays a text link; Find AHRI becomes a small purple outline button. */
function VariantTwoAhriButton() {
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

/** V3 — BOTH become small outline buttons. Widths mirror the row above:
 *  Save to List matches the qty stepper (108px = 3×36 + 2 borders);
 *  Find AHRI stretches to fill the remaining track, so it lines up under
 *  the Add-to-Cart button. */
function VariantThreeBothButtons() {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="inline-flex h-8 w-[108px] shrink-0 items-center justify-center gap-1.5 rounded-md border border-border px-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ListPlus className="size-3.5" />
        Save to List
      </button>
      <a
        href="#"
        className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-violet-500 px-3 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-950/40"
      >
        <Search className="size-3.5" />
        Find an AHRI Matched System
      </a>
    </div>
  );
}

/** Three-variant showcase for the "Save + Find AHRI" row that sits under the
 *  Add-to-Cart on PDPs where the product carries an AHRI matchup. The Add /
 *  Qty row is shown above each variant so alignment claims (V3) are honest. */
export function PdpActionsSection() {
  return (
    <Category
      id="pdp-actions"
      title="Save + Find AHRI actions"
      description="Three variants of the secondary-actions row that sits under the Add-to-Cart button on PDPs with an AHRI matchup. The Qty + Add row is drawn above each so alignment is honest."
    >
      <Demo
        name="V1 — Text links (current)"
        slug="pdp-actions-v1"
        description="Muted Save link + violet AHRI link. Lowest visual weight."
      >
        <div className="flex flex-col gap-3">
          <QtyAndAdd />
          <VariantOneLinks />
        </div>
      </Demo>

      <Demo
        name="V2 — AHRI as small outline button"
        slug="pdp-actions-v2"
        description="Save stays a link; Find AHRI is promoted to a small purple outline button so the discovery CTA reads as an action, not a footnote."
      >
        <div className="flex flex-col gap-3">
          <QtyAndAdd />
          <VariantTwoAhriButton />
        </div>
      </Demo>

      <Demo
        name="V3 — Both as small outline buttons, aligned"
        slug="pdp-actions-v3"
        description="Save (neutral) matches the qty-stepper width; Find AHRI (purple) matches the Add-to-Cart width. Reads as a symmetrical secondary row."
      >
        <div className="flex flex-col gap-3">
          <QtyAndAdd />
          <VariantThreeBothButtons />
        </div>
      </Demo>
    </Category>
  );
}
