"use client";

/**
 * INVENTORY DRAWERS — right-side, product-scoped.
 *
 * Sibling to `_drawers.tsx` (which handles STORE LOCATOR — left-side, branch
 * selection). These drawers open on the PDP or PLP when the user wants to
 * know "how many of THIS thing does each branch have?" — never for changing
 * their default branch (that's the left drawer's job).
 *
 * Three directions, three anchor points on the spectrum:
 *  1 — Reference literal: East Coast pattern — Current Branch + All Branches
 *      table, qty on the left rail, info icon per row.
 *  2 — Tabbed with fulfilment: Branch pickup / Delivery tabs; "currently
 *      shopping" pill; per-row Select store CTA.
 *  3 — Dense picker: search + condensed rows, qty badge inline with branch
 *      name; hover = row-scoped Select action.
 *
 * All three slide in from the RIGHT (`inset-y-0 right-0`) — mirror of the
 * left-side store locators — and all three carry the product context header
 * so the buyer never loses what they're looking at.
 */

import * as React from "react";
import {
  ArrowDownUp,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Search,
  Truck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/** Same 10-branch mock the left drawers use so the two experiences can be
 *  compared side by side without noise. */
type Branch = { name: string; qty: number; miles: number; tag?: "current" };
const BRANCHES: Branch[] = [
  { name: "Durham NC #1", qty: 0, miles: 0, tag: "current" },
  { name: "Raleigh NC #5", qty: 8, miles: 24 },
  { name: "Garner NC #45", qty: 2, miles: 31 },
  { name: "Sanford NC #46", qty: 11, miles: 48 },
  { name: "Greensboro NC #6", qty: 9, miles: 55 },
  { name: "Fayetteville NC #38", qty: 1, miles: 79 },
  { name: "Aberdeen NC #39", qty: 15, miles: 82 },
  { name: "Winterville NC #25", qty: 9, miles: 96 },
  { name: "Roanoke VA #10", qty: 4, miles: 118 },
  { name: "Charlotte NC #3", qty: 2, miles: 141 },
  { name: "South Charlotte NC #19", qty: 2, miles: 148 },
  { name: "Wilmington NC #9", qty: 6, miles: 172 },
  { name: "Richmond VA #2", qty: 9, miles: 176 },
  { name: "Hickory NC #11", qty: 6, miles: 187 },
  { name: "Conway SC #47", qty: 6, miles: 214 },
  { name: "Newport News VA #37", qty: 2, miles: 216 },
  { name: "Myrtle Beach SC #27", qty: 7, miles: 235 },
  { name: "Boone NC #40", qty: 5, miles: 241 },
  { name: "Virginia Beach VA #7", qty: 7, miles: 246 },
  { name: "Fredericksburg VA #18", qty: 3, miles: 264 },
  { name: "Columbia SC #8", qty: 11, miles: 269 },
  { name: "Blountville TN #24", qty: 15, miles: 271 },
  { name: "Orangeburg SC #34", qty: 21, miles: 314 },
  { name: "Greenville SC #4", qty: 10, miles: 323 },
  { name: "Charleston SC #12", qty: 1, miles: 340 },
  { name: "Morristown TN #22", qty: 14, miles: 345 },
  { name: "Beaufort SC #33", qty: 4, miles: 375 },
  { name: "Knoxville TN #21", qty: 3, miles: 383 },
  { name: "Savannah GA #31", qty: 14, miles: 405 },
  { name: "Gainesville GA #28", qty: 2, miles: 411 },
];

const PRODUCT = {
  brand: "TradePro®",
  title: "1/3 HP Evaporator Motor — 1075/3 RPM · 208/230V",
  item: "54510A",
  mfg: "TP-E33-3SP2",
};

/** Right-side shell — mirrors the left-side DRAWER_SHELL but slides in from
 *  the right edge. */
const SHELL =
  "flex h-full w-[404px] flex-col overflow-hidden border bg-background shadow-xl";

function ProductHeader() {
  return (
    <div className="flex shrink-0 items-start gap-3 border-b bg-muted/40 px-4 py-3">
      <div className="grid size-12 shrink-0 place-items-center rounded-md border bg-background text-xs font-semibold text-muted-foreground">
        IMG
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {PRODUCT.brand}
        </p>
        <p className="mt-0.5 text-sm leading-tight font-semibold">
          {PRODUCT.title}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Item {PRODUCT.item} · MFG {PRODUCT.mfg}
        </p>
      </div>
    </div>
  );
}

function stockColor(qty: number) {
  if (qty === 0) return "text-red-600";
  if (qty < 3) return "text-amber-600";
  return "text-emerald-700";
}

/* ────────────────── Inventory Direction 1 — East Coast literal ─────────── */

export function InventoryDirection1() {
  const current = BRANCHES.find((b) => b.tag === "current")!;
  const rest = BRANCHES.filter((b) => b.tag !== "current");

  const [inStockOnly, setInStockOnly] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<"miles" | "availability">("miles");
  const [sortOpen, setSortOpen] = React.useState(false);

  const displayed = React.useMemo(() => {
    const filtered = inStockOnly ? rest.filter((b) => b.qty > 0) : rest;
    return [...filtered].sort((a, b) =>
      sortBy === "miles" ? a.miles - b.miles : b.qty - a.qty,
    );
  }, [rest, inStockOnly, sortBy]);

  return (
    <div className={SHELL}>
      <header className="flex shrink-0 items-center justify-between border-b px-5 py-3">
        <p className="text-base font-bold">Product Availability</p>
      </header>
      <ProductHeader />
      {/* Current branch — inline row, no wrapper box (no nested chrome). */}
      <div className="flex shrink-0 items-center gap-3 border-b px-5 py-2.5">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Current
        </p>
        <span
          className={`text-sm font-bold tabular-nums ${stockColor(current.qty)}`}
        >
          {current.qty}
        </span>
        <span className="text-sm font-medium">{current.name}</span>
      </div>
      {/* Filter + sort — filter chip is a real toggle; sort dropdown swaps
          between Miles and Availability. State drives the list below. */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <button
          type="button"
          aria-pressed={inStockOnly}
          onClick={() => setInStockOnly((v) => !v)}
          className={
            inStockOnly
              ? "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              : "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {inStockOnly ? <Check className="size-3" /> : null}
          In stock
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            aria-expanded={sortOpen}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowDownUp className="size-3.5" />
            Sort: {sortBy === "miles" ? "Miles" : "Availability"}
            <ChevronDown
              className={`size-3 transition-transform ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>
          {sortOpen ? (
            <div className="absolute right-0 z-10 mt-1 flex w-40 flex-col overflow-hidden rounded-md border bg-background text-sm shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setSortBy("miles");
                  setSortOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-muted ${
                  sortBy === "miles" ? "font-medium text-primary" : "text-foreground"
                }`}
              >
                Miles
                {sortBy === "miles" ? <Check className="size-3.5" /> : null}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy("availability");
                  setSortOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-muted ${
                  sortBy === "availability" ? "font-medium text-primary" : "text-foreground"
                }`}
              >
                Availability
                {sortBy === "availability" ? <Check className="size-3.5" /> : null}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <ul className="flex flex-1 flex-col divide-y overflow-y-auto">
        {displayed.map((b) => (
          <li
            key={b.name}
            className="group flex items-start gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
          >
            <span
              className={`w-6 shrink-0 pt-0.5 text-sm font-semibold tabular-nums ${stockColor(b.qty)}`}
            >
              {b.qty}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm">{b.name}</p>
              {/* Sub-row: miles + map / directions / phone icons — opens up
                  the cell vertically so metadata reads cleanly under the
                  name instead of crowding the right edge. */}
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="tabular-nums">{b.miles} mi</span>
                <a
                  href="#"
                  aria-label={`Map for ${b.name}`}
                  className="grid size-5 place-items-center rounded-md text-primary transition-colors hover:bg-primary/10"
                >
                  <MapPin className="size-3.5" />
                </a>
                <a
                  href="#"
                  aria-label={`Directions to ${b.name}`}
                  className="grid size-5 place-items-center rounded-md text-primary transition-colors hover:bg-primary/10"
                >
                  <Navigation className="size-3.5" />
                </a>
                <a
                  href="#"
                  aria-label={`Call ${b.name}`}
                  className="grid size-5 place-items-center rounded-md text-primary transition-colors hover:bg-primary/10"
                >
                  <Phone className="size-3.5" />
                </a>
              </div>
            </div>
            {/* Select store — hidden by default so Direction 1 stays super
                light; row hover reveals it (per-row commit without extra
                chrome on rest state). */}
            <button
              type="button"
              className="mt-0.5 hidden shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 group-hover:inline-flex"
            >
              Select store
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ────────────────── Inventory Direction 2 — Tabbed, per-row commit ─────── */

export function InventoryDirection2() {
  return (
    <div className={SHELL}>
      <ProductHeader />
      <div className="flex shrink-0 border-b">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 border-b-2 border-primary py-3 text-sm font-semibold text-primary"
        >
          <Building2 className="size-4" />
          Branch pickup
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Truck className="size-4" />
          Delivery
        </button>
      </div>
      <div className="shrink-0 border-b px-4 pt-3 pb-2.5">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <Search className="size-4 text-muted-foreground" />
          <span className="flex-1 text-foreground">Search branches</span>
        </div>
      </div>
      <ul className="flex flex-1 flex-col divide-y overflow-y-auto">
        {BRANCHES.map((b) => (
          <li
            key={b.name}
            className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
          >
            <span className={`w-8 shrink-0 text-sm font-bold tabular-nums ${stockColor(b.qty)}`}>
              {b.qty}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{b.name}</p>
              {b.tag === "current" ? (
                <span className="mt-0.5 inline-flex items-center rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                  Currently shopping
                </span>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {b.qty === 0
                    ? "Out of stock"
                    : b.qty < 3
                    ? "Low stock"
                    : "In stock"}
                </p>
              )}
            </div>
            {b.tag === "current" ? null : (
              <button
                type="button"
                className="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Select
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ────────────────── Inventory Direction 3 — Dense picker ─────────────── */

export function InventoryDirection3() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const selectedBranch = BRANCHES.find((b) => b.name === selected);
  const canCommit =
    selectedBranch != null && selectedBranch.tag !== "current";

  return (
    <div className={SHELL}>
      <ProductHeader />
      <div className="shrink-0 border-b px-4 pt-3 pb-2.5">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm">
          <Search className="size-4 text-muted-foreground" />
          <span className="flex-1 text-foreground">City, state, or ZIP</span>
        </div>
      </div>
      <div className="grid shrink-0 grid-cols-[64px_1fr] items-center gap-2 border-b bg-muted/30 px-4 py-2 text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
        <span>Qty</span>
        <span>Branch</span>
      </div>
      <ul
        role="listbox"
        aria-label="Branches"
        className="flex flex-1 flex-col overflow-y-auto text-sm"
      >
        {BRANCHES.map((b, i) => {
          const isSelected = selected === b.name;
          const isCurrent = b.tag === "current";
          return (
            <li key={b.name}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => setSelected(b.name)}
                className={`grid w-full grid-cols-[64px_1fr] items-center gap-2 border-b px-4 py-2 text-left transition-colors ${
                  isSelected
                    ? "bg-primary/10 ring-1 ring-inset ring-primary"
                    : isCurrent
                    ? "bg-emerald-50 dark:bg-emerald-950/20"
                    : i % 2 === 0
                    ? "hover:bg-muted/40"
                    : "hover:bg-muted/40"
                }`}
              >
                <span
                  className={`text-sm font-bold tabular-nums ${stockColor(b.qty)}`}
                >
                  {b.qty}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{b.name}</p>
                  {isCurrent ? (
                    <p className="text-[11px] font-semibold text-emerald-700">
                      Currently shopping
                    </p>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="shrink-0 border-t p-3">
        <button
          type="button"
          disabled={!canCommit}
          className={
            canCommit
              ? "inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              : "inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground"
          }
        >
          {canCommit
            ? `Set ${selectedBranch!.name} as my branch`
            : "Select a branch"}
        </button>
      </div>
    </div>
  );
}

/** Store-locator-first inventory drawer: product context sits above the
 * branch-finder pattern, with inventory filter and sort controls preserved. */
export function InventoryStoreLocatorDrawer() {
  const [inStockOnly, setInStockOnly] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<"miles" | "availability">("miles");
  const [sortOpen, setSortOpen] = React.useState(false);

  const displayed = React.useMemo(() => {
    const filtered = inStockOnly ? BRANCHES.filter((b) => b.qty > 0) : BRANCHES;
    return [...filtered].sort((a, b) =>
      sortBy === "miles" ? a.miles - b.miles : b.qty - a.qty,
    );
  }, [inStockOnly, sortBy]);

  return (
    <div className={SHELL}>
      <ProductHeader />
      <div className="shrink-0 border-b px-4 pt-3.5 pb-2.5">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <Search className="size-4 text-muted-foreground" />
          <span className="flex-1 text-foreground">33605</span>
        </div>
        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Navigation className="size-4" />
          Use my current location
        </a>
      </div>
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <button
          type="button"
          aria-pressed={inStockOnly}
          onClick={() => setInStockOnly((value) => !value)}
          className={
            inStockOnly
              ? "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              : "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {inStockOnly ? <Check className="size-3" /> : null}
          In Stock
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((value) => !value)}
            aria-expanded={sortOpen}
            className="inline-flex translate-y-px items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowDownUp className="size-3.5" />
            Sort: {sortBy === "miles" ? "Miles" : "Availability"}
            <ChevronDown className={`size-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen ? (
            <div className="absolute right-0 z-10 mt-1 flex w-40 flex-col overflow-hidden rounded-md border bg-background text-sm shadow-lg">
              {(["miles", "availability"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSortBy(option);
                    setSortOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-muted ${sortBy === option ? "font-medium text-primary" : "text-foreground"}`}
                >
                  {option === "miles" ? "Miles" : "Availability"}
                  {sortBy === option ? <Check className="size-3.5" /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <ul className="flex flex-1 flex-col divide-y overflow-y-auto">
        {displayed.map((branch) => (
          <li key={branch.name} className="flex flex-col gap-2 px-5 py-3 transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{branch.name}</p>
              <span className={`text-xs font-semibold tabular-nums ${stockColor(branch.qty)}`}>
                {branch.qty} available
              </span>
            </div>
            <details className="group text-xs">
              <summary className="flex w-fit cursor-pointer list-none items-center gap-1 font-medium text-black/70 outline-none focus-visible:underline [&::-webkit-details-marker]:hidden">
                Store Hours
                <ChevronDown className="size-3.5 text-black/70 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-1 text-muted-foreground">Mon–Fri 7am–6pm · Sat 8am–12pm · Sun Closed</p>
            </details>
            <div className="flex items-center text-xs">
              <span className="text-muted-foreground tabular-nums">{branch.miles} mi</span>
              <span className="mx-1.5 text-muted-foreground/40">·</span>
              <a href="#" className="inline-flex items-center gap-1 font-medium text-primary">
                <Navigation className="size-3.5" />
                Get Directions
              </a>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-xs">
                <a href={`tel:${branch.name}`} className="inline-flex items-center gap-1 font-medium text-primary">
                  <Phone className="size-3.5" />
                  (919) 555-0100
                </a>
                <a href="#" className="inline-flex items-center gap-1 font-medium text-primary">
                  <MessageSquare className="size-3.5" />
                  Chat
                </a>
              </span>
              <Button size="sm" className="h-7 -translate-y-px px-3 text-xs">Select Store</Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="shrink-0 border-t p-3">
        <Button variant="secondary" className="h-10 w-full">
          Find Other Branches
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/** Shared close-X for the /in-plp overlay — matches the store-locator scrim. */
export function InventoryCloseX() {
  return (
    <button
      type="button"
      aria-label="Close"
      className="grid size-10 place-items-center rounded-full bg-background text-foreground shadow-lg transition-colors hover:bg-accent"
    >
      <X className="size-5" />
    </button>
  );
}
