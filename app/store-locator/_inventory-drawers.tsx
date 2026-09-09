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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerCloseButton } from "@/components/ui/drawer";
import { closeDrawer } from "./_drawer-overlay";

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

function ProductHeader({ product = PRODUCT }: { product?: typeof PRODUCT }) {
  return (
    <div className="flex shrink-0 items-start gap-3 border-b bg-muted/40 px-4 py-3">
      <div className="grid size-12 shrink-0 place-items-center rounded-md border bg-background text-xs font-semibold text-muted-foreground">
        IMG
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {product.brand}
        </p>
        <p className="mt-0.5 text-sm leading-tight font-semibold">
          {product.title}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Item {product.item} · MFG {product.mfg}
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

/* ────────────────── Shared store-hours schedule + disclosure ───────────── */

/** One weekly-hours dataset shared by every branch/availability card, so the
 *  branch finder and the Product Availability drawer read identically. Each day
 *  carries its display label plus open/close as minutes-from-midnight, so the
 *  "open now / opens at" status is derived from data instead of re-parsing the
 *  string. Sunday has no open/close — it is closed. */
type DayHours = { day: string; label: string; open?: number; close?: number };
const WEEKLY_HOURS: DayHours[] = [
  { day: "Monday", label: "7:00 AM – 5:00 PM", open: 7 * 60, close: 17 * 60 },
  { day: "Tuesday", label: "7:00 AM – 5:00 PM", open: 7 * 60, close: 17 * 60 },
  { day: "Wednesday", label: "7:00 AM – 5:00 PM", open: 7 * 60, close: 17 * 60 },
  { day: "Thursday", label: "7:00 AM – 5:00 PM", open: 7 * 60, close: 17 * 60 },
  { day: "Friday", label: "7:00 AM – 5:00 PM", open: 7 * 60, close: 17 * 60 },
  { day: "Saturday", label: "7:30 AM – 11:30 AM", open: 7 * 60 + 30, close: 11 * 60 + 30 },
  { day: "Sunday", label: "Closed" },
];

function formatMinutes(total: number): string {
  const period = total >= 720 ? "PM" : "AM";
  const hour = Math.floor(total / 60);
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(total % 60).padStart(2, "0")} ${period}`;
}

/** Derive the open/closed line shown on the disclosure trigger from the shared
 *  weekly schedule. `now === null` (pre-mount) keeps SSR and the first client
 *  render identical — no hydration mismatch — and the live status lands after
 *  mount. */
function openStatus(now: Date | null): { open: boolean; label: string } {
  if (!now) return { open: false, label: "Store Hours" };
  const today = WEEKLY_HOURS[(now.getDay() + 6) % 7]; // JS Sun=0 → Monday-first index
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (today.open != null && today.close != null) {
    if (minutes >= today.open && minutes < today.close) return { open: true, label: "Open Now" };
    if (minutes < today.open) return { open: false, label: `Opens at ${formatMinutes(today.open)}` };
  }
  return { open: false, label: "Closed" };
}

/** Store Hours disclosure shared by every branch/availability card. The trigger
 *  shows the live open status (green "Open Now" when open, muted "Opens at …" /
 *  "Closed" otherwise) beside a chevron; the expanded panel lists each weekday
 *  on its own two-column line (day left, hours right, tabular-aligned). */
function StoreHours() {
  const [open, setOpen] = React.useState(false);
  const [now, setNow] = React.useState<Date | null>(null);
  const panelId = React.useId();
  React.useEffect(() => setNow(new Date()), []);
  const status = openStatus(now);

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-fit items-center gap-1 py-2 font-medium outline-none focus-visible:underline"
      >
        <span className={status.open ? "text-emerald-700" : "text-muted-foreground"}>
          {status.label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <dl id={panelId} className="mt-1 space-y-1">
          {WEEKLY_HOURS.map((entry) => (
            <div key={entry.day} className="flex items-baseline justify-between gap-6">
              <dt className="text-muted-foreground">{entry.day}</dt>
              <dd className="tabular-nums text-foreground">{entry.label}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

/* ────────────────── Product Availability drawer — card pattern ─────────── */

/** Product-scoped availability drawer. Same account-style cards as the branch
 *  finder (`BranchCard`): the ROW list was replaced with bordered cards, each
 *  keeping its "X available" count, the shared Store Hours disclosure, Get
 *  Directions / Chat, and a primary "Select Store" button. No check mark — a
 *  card with an action button never carries one; the current store is shown by
 *  the highlighted card + disabled "Current Store". Product header, search,
 *  In-Stock filter, Sort, and the Find Other Branches footer are retained. */
export function InventoryDirection1() {
  const [inStockOnly, setInStockOnly] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<"miles" | "availability">("miles");
  const [sortOpen, setSortOpen] = React.useState(false);
  const [selectedStore, setSelectedStore] = React.useState(
    BRANCHES.find((b) => b.tag === "current")?.name ?? BRANCHES[0]?.name ?? "",
  );

  const displayed = React.useMemo(() => {
    const filtered = inStockOnly ? BRANCHES.filter((b) => b.qty > 0) : BRANCHES;
    return [...filtered].sort((a, b) =>
      sortBy === "availability" ? b.qty - a.qty : a.miles - b.miles,
    );
  }, [inStockOnly, sortBy]);

  return (
    <div className={SHELL}>
      <header className="flex shrink-0 items-center justify-between border-b px-5 py-3.5">
        <p className="text-base font-bold">Product Availability</p>
        <DrawerCloseButton label="Close" onClick={closeDrawer} />
      </header>
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
      {/* Filter + sort — filter chip is a real toggle; sort dropdown swaps
          between Miles and Availability. State drives the card list below. */}
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
      <ul aria-label="Branches" className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {displayed.map((branch) => (
          <BranchCard
            key={branch.name}
            branch={branch}
            selected={selectedStore === branch.name}
            showStock
            onSelect={() => setSelectedStore(branch.name)}
          />
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
                <Badge className="mt-0.5 rounded bg-in-stock px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                  Currently shopping
                </Badge>
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
              <Button size="sm" className="h-7 shrink-0 px-3 text-xs">
                Select
              </Button>
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
        <Button disabled={!canCommit} className="w-full">
          {canCommit
            ? `Set ${selectedBranch!.name} as my branch`
            : "Select a branch"}
        </Button>
      </div>
    </div>
  );
}

/** A branch as consumed by the store-locator drawer. `qty` is optional so the
 *  same component can serve availability-scoped inventory (with counts) OR a
 *  plain branch picker (checkout pickup) that carries no per-item stock. */
export type LocatorBranch = {
  name: string;
  qty?: number;
  miles: number;
  tag?: "current";
  address?: string;
  hours?: string;
  phone?: string;
};

/** One branch rendered as a selectable CARD — the same treatment the PDP
 *  account-selector uses for "Select account" (bordered rounded card, building/
 *  location icon + bold name + muted subtitle; the current one gets the blue
 *  tint + primary border). Selection commits through the "Select Store" button;
 *  the current store shows a disabled "Current Store".
 *
 *  No check mark: David's rule is that a card carrying an action button never
 *  shows a check. The current branch is indicated by the highlighted card
 *  (border-primary + bg-primary/5) and the disabled "Current Store" button.
 *
 *  a11y: the current card carries `aria-current` (the valid equivalent of a
 *  checked radio here — a `role="radio"` container would flag axe's
 *  nested-interactive rule because the card keeps its Directions/Chat/phone
 *  links). The primary action is a real 44px-tall button, keyboard-operable and
 *  labelled with the branch name. */
function BranchCard({
  branch,
  selected,
  showStock,
  onSelect,
}: {
  branch: LocatorBranch;
  selected: boolean;
  showStock: boolean;
  onSelect: () => void;
}) {
  return (
    <li
      aria-current={selected ? "true" : undefined}
      className={`rounded-md border p-4 transition-colors ${
        selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
      }`}
    >
      {/* Header row — icon + name + subtitle. No check mark: the card carries an
          action button, so the current branch is shown by the highlight + the
          disabled "Current Store" button instead. */}
      <div className="flex min-w-0 items-start gap-3">
        <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <span className="block text-sm font-semibold">{branch.name}</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            <span className="tabular-nums">{branch.miles} mi</span> away
            {showStock && branch.qty != null ? (
              <>
                {" · "}
                <span className={`font-semibold tabular-nums ${stockColor(branch.qty)}`}>
                  {branch.qty} available
                </span>
              </>
            ) : null}
          </span>
        </div>
      </div>
      {/* Preserved branch detail — Store Hours disclosure, Get Directions, phone,
          Chat — aligned under the name (icon width + gap = pl-7). */}
      <div className="mt-3 space-y-2 pl-7">
        <StoreHours />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <a href="#" className="inline-flex items-center gap-1 py-1 font-medium text-primary">
            <Navigation className="size-3.5" />
            Get Directions
          </a>
          <a
            href={`tel:${branch.phone ?? "(919) 555-0100"}`}
            className="inline-flex items-center gap-1 py-1 font-medium text-primary"
          >
            <Phone className="size-3.5" />
            {branch.phone ?? "(919) 555-0100"}
          </a>
          <a href="#" className="inline-flex items-center gap-1 py-1 font-medium text-primary">
            <MessageSquare className="size-3.5" />
            Chat
          </a>
        </div>
      </div>
      {/* Selection action — the current store maps to the account card's checked
          state (disabled "Current Store"); every other card commits via
          "Select Store". 44px-tall, full-width, labelled with the branch name. */}
      <div className="mt-3 pl-7">
        {selected ? (
          <Button
            size="lg"
            disabled
            aria-label={`${branch.name}, current store`}
            className="h-11 w-full"
          >
            Current Store
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={onSelect}
            aria-label={`Select ${branch.name} as your store`}
            className="h-11 w-full"
          >
            Select Store
          </Button>
        )}
      </div>
    </li>
  );
}

/** Store-locator-first inventory drawer: product context sits above the
 * branch-finder pattern, with inventory filter and sort controls preserved.
 *
 * Reusable: every piece of demo data is a prop with a default, so the same
 * component backs the inventory galleries AND the checkout pickup "Change"
 * picker (seeded with the brand's own branches, product header off, no stock
 * counts). Nothing is a parallel mock — this IS the store-locator picker. */
export function InventoryStoreLocatorDrawer({
  branches = BRANCHES,
  product = PRODUCT,
  heading = "Product Availability",
  zip = "33605",
  showProductHeader = true,
  showStock = true,
  selectedStore: selectedStoreProp,
  onSelectStore,
  onClose = closeDrawer,
}: {
  branches?: LocatorBranch[];
  product?: { brand: string; title: string; item: string; mfg: string };
  heading?: string;
  zip?: string;
  showProductHeader?: boolean;
  showStock?: boolean;
  /** Controlled selection (checkout). Falls back to the first branch. */
  selectedStore?: string;
  /** When provided, "Select Store" commits through this instead of local state. */
  onSelectStore?: (name: string) => void;
  onClose?: () => void;
} = {}) {
  const [inStockOnly, setInStockOnly] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<"miles" | "availability">("miles");
  const [sortOpen, setSortOpen] = React.useState(false);
  const [selectedLocal, setSelectedLocal] = React.useState(branches[0]?.name ?? "");
  const selectedStore = selectedStoreProp ?? selectedLocal;

  const displayed = React.useMemo(() => {
    const filtered = showStock && inStockOnly ? branches.filter((b) => (b.qty ?? 0) > 0) : branches;
    return [...filtered].sort((a, b) =>
      showStock && sortBy === "availability" ? (b.qty ?? 0) - (a.qty ?? 0) : a.miles - b.miles,
    );
  }, [branches, inStockOnly, sortBy, showStock]);

  const selectStore = (name: string) => {
    if (onSelectStore) onSelectStore(name);
    else setSelectedLocal(name);
  };

  return (
    <div className={SHELL}>
      {/* Title header — matches the Branch Selector ("Find a branch" + X). */}
      <header className="flex shrink-0 items-center justify-between border-b px-5 py-3.5">
        <p className="text-base font-bold">{heading}</p>
        <DrawerCloseButton label="Close" onClick={onClose} />
      </header>
      {showProductHeader ? <ProductHeader product={product} /> : null}
      <div className="shrink-0 border-b px-4 pt-3.5 pb-2.5">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <Search className="size-4 text-muted-foreground" />
          <span className="flex-1 text-foreground">{zip}</span>
        </div>
        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Navigation className="size-4" />
          Use my current location
        </a>
      </div>
      {showStock ? (
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
      ) : (
        <p className="shrink-0 border-b px-5 py-2 text-xs font-medium text-muted-foreground">
          Sorted by distance
        </p>
      )}
      <ul aria-label="Branches" className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {displayed.map((branch) => (
          <BranchCard
            key={branch.name}
            branch={branch}
            selected={selectedStore === branch.name}
            showStock={showStock}
            onSelect={() => selectStore(branch.name)}
          />
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

/** Shared close control for the inventory overlays — the DS DrawerCloseButton,
 *  same X pattern the account flyout and cart drawer use. Rounded + shadowed so
 *  it still reads as a floating control over the scrim. */
export function InventoryCloseX() {
  return (
    <DrawerCloseButton
      label="Close"
      onClick={closeDrawer}
      className="rounded-full shadow-md"
    />
  );
}
