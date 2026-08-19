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

import {
  ArrowDownUp,
  Building2,
  Check,
  MapPin,
  Navigation,
  Phone,
  Search,
  Truck,
  X,
} from "lucide-react";

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
  return (
    <div className={SHELL}>
      <header className="flex shrink-0 items-center justify-between border-b px-5 py-3">
        <p className="text-base font-bold">Product Availability</p>
      </header>
      <ProductHeader />
      <div className="shrink-0 border-b px-4 pt-3 pb-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Current Branch
        </p>
        <div className="mt-1.5 flex items-center gap-3 rounded-md border bg-card px-3 py-2">
          <span className={`w-8 shrink-0 text-sm font-bold tabular-nums ${stockColor(current.qty)}`}>
            {current.qty}
          </span>
          <span className="flex-1 text-sm font-medium">{current.name}</span>
        </div>
      </div>
      {/* Filter + sort — filter chip is preset ON (In stock), sort exposes
          Miles vs Qty as the two useful axes for an inventory drawer. */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <button
          type="button"
          aria-pressed="true"
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
        >
          <Check className="size-3" />
          In stock
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowDownUp className="size-3.5" />
          Sort: Miles
        </button>
      </div>
      <ul className="flex flex-1 flex-col divide-y overflow-y-auto">
        {rest.map((b) => (
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
      <ul className="flex flex-1 flex-col overflow-y-auto text-sm">
        {BRANCHES.map((b, i) => (
          <li
            key={b.name}
            className={`grid grid-cols-[64px_1fr] items-center gap-2 border-b px-4 py-2 transition-colors hover:bg-muted/40 ${
              i === 0 ? "bg-emerald-50 dark:bg-emerald-950/20" : ""
            }`}
          >
            <span className={`text-sm font-bold tabular-nums ${stockColor(b.qty)}`}>
              {b.qty}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{b.name}</p>
              {b.tag === "current" ? (
                <p className="text-[11px] font-semibold text-emerald-700">
                  Currently shopping
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <div className="shrink-0 border-t p-3">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-foreground bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Set as my branch
        </button>
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
