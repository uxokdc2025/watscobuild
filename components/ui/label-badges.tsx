import * as React from "react";
import { ImageOff, Star } from "lucide-react";

import { cn } from "@/lib/utils";

/* ─────────────── Flag badge (folded-corner accent) ───────────────
 * White fill, dark text, a colored corner notch — Direct Ship, No Returns,
 * Online Only, etc.
 */
const FLAG_CORNER: Record<string, string> = {
  red: "border-l-red-500 border-t-red-500",
  orange: "border-l-orange-500 border-t-orange-500",
  green: "border-l-green-600 border-t-green-600",
  blue: "border-l-blue-500 border-t-blue-500",
};

export function FlagBadge({
  tone = "red",
  className,
  children,
}: {
  tone?: keyof typeof FLAG_CORNER;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex w-fit items-center overflow-hidden rounded-md border bg-background py-1 pr-2.5 pl-3.5 text-xs font-semibold text-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0 left-0 border-[7px] border-r-transparent border-b-transparent",
          FLAG_CORNER[tone]
        )}
      />
      {children}
    </span>
  );
}

/* ─────────────── Highlighter badge (two-tone marker) ───────────────
 * Seasonal / promo look — PRO Essentials, FALL PROMO, Spring Preseason.
 */
export type HighlightSegment = {
  text: string;
  /** Tailwind bg + text classes for this segment, e.g. "bg-green-400 text-red-600". */
  className: string;
  italic?: boolean;
};

export function HighlightBadge({
  segments,
  className,
}: {
  segments: HighlightSegment[];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center overflow-hidden rounded-sm text-xs font-medium",
        className
      )}
    >
      {segments.map((s, i) => (
        <span key={i} className={cn("px-2 py-0.5", s.italic && "italic", s.className)}>
          {s.text}
        </span>
      ))}
    </span>
  );
}

/* ─────────────── Stock status (dot + label) ─────────────── */
const STOCK_TONES = {
  // Vibrant dots (decorative), AA-compliant darker text for the label.
  green: { dot: "bg-in-stock", text: "text-green-700 dark:text-green-400" },
  amber: { dot: "bg-low-stock", text: "text-amber-700 dark:text-amber-400" },
  red: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  slate: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
} as const;

/**
 * Design-system stock logic: a branch quantity is green when available and
 * red when it hits zero. Reuse everywhere stock qty is shown so the color
 * always follows the number.
 */
export function stockTone(qty: number): keyof typeof STOCK_TONES {
  return qty > 0 ? "green" : "red";
}

/** Text-color class for a stock quantity (green > 0, red when 0). */
export function stockTextClass(qty: number): string {
  return STOCK_TONES[stockTone(qty)].text;
}

/**
 * Branch availability row — a left-aligned quantity (colored by the stock
 * logic) followed by the branch name. Reused for your-branch and nearby lists.
 */
export function BranchRow({
  qty,
  name,
  className,
}: {
  qty: number;
  name: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <span className={cn("w-7 shrink-0 tabular-nums font-medium", stockTextClass(qty))}>
        {qty}
      </span>
      <span className="text-muted-foreground">{name}</span>
    </div>
  );
}

export function StockStatus({
  tone,
  qty,
  className,
  children,
}: {
  /** Explicit tone; ignored when `qty` is provided. */
  tone?: keyof typeof STOCK_TONES;
  /** When set, tone is derived from the quantity (green > 0, red when 0). */
  qty?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const resolved = qty != null ? stockTone(qty) : (tone ?? "slate");
  const t = STOCK_TONES[resolved];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", t.text, className)}>
      <span className={cn("size-2 shrink-0 rounded-full", t.dot)} aria-hidden />
      {children}
    </span>
  );
}

/* ─────────────── Certification chip (placeholder for real logos) ─────────────── */
export function CertBadge({
  className,
  children = "ENERGY STAR",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs font-semibold tracking-wide text-foreground",
        className
      )}
    >
      <Star className="size-3.5 fill-sky-500 text-sky-500" aria-hidden />
      {children}
    </span>
  );
}

/* ─────────────── No-image placeholder (gallery empty state) ─────────────── */
export function NoImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid aspect-square w-full place-items-center rounded-md border bg-muted/40",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
        <ImageOff className="size-8 opacity-40" aria-hidden />
        <span className="text-sm font-semibold tracking-wide">NO IMAGE AVAILABLE</span>
      </div>
    </div>
  );
}
