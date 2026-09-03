"use client";

import { ChevronDown, Filter, Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Shared styling tokens for account dashboard tables so every table view
 * (Shopping Lists, Orders, Quotes, …) renders identically. Mirrors the
 * Shopping Lists reference exactly.
 */
export const accountTable = {
  /** Bordered card that wraps the toolbar + table. */
  card: "rounded-lg border bg-background shadow-sm",
  /** Horizontal-scroll container around the <table>. */
  scroll: "overflow-x-auto",
  /** The <table> element. Append a `min-w-[…]` per page. */
  table: "w-full text-left text-[13px]",
  /** Header <tr>. */
  headRow: "border-b bg-muted/30 text-muted-foreground",
  /** Header <th>. */
  headCell: "px-5 py-3 font-medium text-[11px]",
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
