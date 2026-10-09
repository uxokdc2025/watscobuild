"use client";

import Link from "next/link";
import { ChevronDown, Filter, Search, Settings2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * The one table-row / list action control. Every account table uses this so
 * actions stay consistent: icon + label, ghost button. Color is the single
 * rule — normal actions (View, Edit, Share, …) are primary blue; Remove /
 * Delete is the one exception and renders in foreground black (`remove`).
 * Change it here and every row action across the app changes with it.
 */
export function RowAction({
  icon: Icon,
  label,
  href,
  onClick,
  remove,
  className,
  "aria-label": ariaLabel,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  /** Remove / Delete / trash — the one action kept black, not blue. */
  remove?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const tone = remove
    ? "text-foreground hover:text-foreground"
    : "text-primary hover:text-primary";
  const body = (
    <>
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </>
  );
  if (href) {
    return (
      <Button asChild variant="ghost" size="sm" className={cn("min-h-9 gap-1.5", tone, className)}>
        <Link href={href} aria-label={ariaLabel ?? label}>
          {body}
        </Link>
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={ariaLabel ?? label}
      className={cn("min-h-9 gap-1.5", tone, className)}
      onClick={onClick}
    >
      {body}
    </Button>
  );
}

/**
 * Shared styling tokens for account dashboard tables so every table view
 * (Shopping Lists, Orders, Quotes, …) renders identically. Mirrors the
 * Shopping Lists reference exactly.
 */
/** Deterministic color for a shopping-list label chip, so EVERY label reads as
 *  its own category instead of a flat grey — known labels get a fixed color,
 *  anything else is hashed to a palette color (never grey). */
type LabelColor = "blue" | "amber" | "violet" | "teal" | "green" | "orange";
const LABEL_PALETTE: LabelColor[] = ["blue", "violet", "green", "amber", "orange", "teal"];
export function labelColor(label: string): LabelColor {
  const key = label.toLowerCase();
  if (key.includes("prevent")) return "blue";
  if (key.includes("job")) return "amber";
  if (key.includes("project")) return "violet";
  if (key.includes("consum") || key.includes("supply") || key.includes("supplies")) return "teal";
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return LABEL_PALETTE[h % LABEL_PALETTE.length];
}

export const accountTable = {
  /** Bordered card that wraps the toolbar + table. */
  card: "rounded-lg border bg-background shadow-sm",
  /** Horizontal-scroll container around the <table>. */
  scroll: "overflow-x-auto",
  /** The <table> element. Append a `min-w-[…]` per page. */
  table: "w-full text-left text-[13px]",
  /** Header <tr>. Grey fill + dark foreground text so headers read as a header
   *  bar and clear WCAG AA (muted-grey text on near-white failed ~4.4:1). */
  headRow: "border-b bg-secondary text-foreground",
  /** Header <th>. 12px semibold (up from 11px medium) for legibility. */
  headCell: "px-5 py-3 font-semibold text-xs",
  /** Body <tr>. */
  row: "border-b last:border-0",
  /** Body <td>. */
  cell: "px-5 py-3",
  /** Centered footer row ("No more … to load"). */
  footer:
    "flex items-center justify-center gap-2 p-5 text-sm text-muted-foreground",
} as const;

/**
 * The compact, slim search field used across the account section — a
 * full-width Input with a leading search icon and no separate Search/Reset
 * buttons. Used both inside AccountTableToolbar and standalone above the
 * Dashboard summary tables.
 */
export function AccountSearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={`relative block ${className ?? ""}`}>
      <Search
        size={16}
        className="absolute left-3 top-3.5 text-muted-foreground"
      />
      <Input
        className="h-11 pl-9"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/**
 * The toolbar row shared by every account table: a full-width search input
 * on the left, then Filter / Sort buttons on the right. Pass extra controls
 * (e.g. Shopping Lists' "Group by label") as children — they render between
 * Filter and Sort. Matches the Shopping Lists reference.
 */
export function AccountTableToolbar({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b p-4">
      <AccountSearchInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-w-[240px] flex-1"
      />
      <Button variant="outline" className="min-h-11">
        <Filter size={16} />
        Filter
        <ChevronDown size={15} />
      </Button>
      {children}
      <Button variant="outline" className="min-h-11">
        <Settings2 size={16} />
        Sort
      </Button>
    </div>
  );
}
