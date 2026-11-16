"use client";

/**
 * Qty stepper — the one quantity control.
 *
 * Extracted from the canonical ProductCard so the grid card, the family
 * table's expanded row and anything else that sells a quantity share one
 * control (same 34px height, same 28px cells, same disabled-at-1 behavior).
 * If you're about to write another − / N / + widget, use this.
 */

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  label = "Quantity",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  /** Accessible group name — override when a page has several steppers. */
  label?: string;
}) {
  const cell =
    "grid h-full w-7 cursor-pointer place-items-center text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
  return (
    <div
      className={cn("inline-flex h-[34px] shrink-0 items-center rounded-md border", className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(cell, "rounded-l-md")}
      >
        <Minus className="size-4" />
      </button>
      <span
        aria-live="polite"
        className="grid h-full w-7 place-items-center border-x text-sm font-medium tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(cell, "rounded-r-md")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
