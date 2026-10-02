"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink, ImageOff, Minus, Plus, Replace, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StockStatus } from "@/components/ui/label-badges";
import { InventoryLine } from "@/app/ahri/_lib/parts";
import { PreviewCode, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "pattern", label: "The pattern" },
  { id: "anatomy", label: "Anatomy" },
  { id: "where", label: "Where it's used" },
  { id: "guidance", label: "Guidance" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

/* Sample rows for the pattern preview — a few real-looking parts so the row
   reads as a list, one after another, with both in-stock and to-order states. */
type RowItem = {
  brand: string;
  title: string;
  meta: string;
  branchQty: number;
  branch: string;
  allBranches: number;
  price: string;
};
const SAMPLE_ROWS: RowItem[] = [
  {
    brand: "TRADEPRO®",
    title: "TP-EC13-50 — Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230V, 1/2 HP",
    meta: "Item: 54510A · MFG: TP-EC13-50",
    branchQty: 18,
    branch: "Durham NC #1",
    allBranches: 168,
    price: "$168.42",
  },
  {
    brand: "TRADEPRO®",
    title: "TP-CAP-370-455 — Run Capacitor, 45/5 MFD, 370V, Round Dual",
    meta: "Item: 11822 · MFG: TP-CAP-370-455",
    branchQty: 240,
    branch: "Durham NC #1",
    allBranches: 1240,
    price: "$12.87",
  },
  {
    brand: "TRADEPRO®",
    title: "TP-CONT-2P30 — Contactor, 2-Pole, 30 Amp, 24V Coil",
    meta: "Item: 90313 · MFG: TP-CONT-2P30",
    branchQty: 6,
    branch: "Durham NC #1",
    allBranches: 54,
    price: "$19.95",
  },
  {
    brand: "TRADEPRO®",
    title: "TP-TXV-R410-3 — Thermostatic Expansion Valve, R-410A, 3 Ton, Bi-Flow",
    meta: "Item: 66145 · MFG: TP-TXV-R410-3",
    branchQty: 0,
    branch: "Durham NC #1",
    allBranches: 12,
    price: "$78.30",
  },
];

/* The one canonical storefront list row: [image] [capped description]
   [availability, its own centered column] [price + action]. Full width on
   mobile it stacks; at sm+ it's the 4-zone grid. Availability uses the DS
   InventoryLine — never hand-rolled stock text. */
function Row({ item }: { item: RowItem }) {
  const availability = (
    <InventoryLine branchQty={item.branchQty} branchName={item.branch} allBranchesQty={item.allBranches} />
  );
  const price = (
    <p className="text-base font-semibold text-price">
      {item.price}
      <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
    </p>
  );
  const details = (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-primary">{item.brand}</p>
      <p className="line-clamp-3 text-sm font-semibold leading-snug">{item.title}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{item.meta}</p>
    </div>
  );
  return (
    <article className="p-4">
      {/* Desktop — [image] [capped description] [availability, centered] [price + action] */}
      <div className="hidden grid-cols-[96px_minmax(0,340px)_minmax(0,1fr)_auto] items-center gap-5 sm:grid">
        <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
          <ImageOff className="size-6 opacity-40" aria-hidden />
        </div>
        {details}
        <div className="flex justify-center">{availability}</div>
        <div className="justify-self-end text-right">
          {price}
          <Button size="sm" className="mt-2">
            <ShoppingCart className="size-4" />
            Add
          </Button>
        </div>
      </div>
      {/* Mobile — image + details stacked, availability beneath, action full width */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-start gap-3">
          <div className="grid size-20 shrink-0 place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
            <ImageOff className="size-6 opacity-40" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            {details}
            <div className="mt-1.5">{availability}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {price}
          <Button size="sm">
            <ShoppingCart className="size-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}

/* The pattern as it actually appears — rows stacked one after another. */
function CanonicalRow() {
  return (
    <ul className="w-full divide-y rounded-md border">
      {SAMPLE_ROWS.map((item) => (
        <li key={item.meta}>
          <Row item={item} />
        </li>
      ))}
    </ul>
  );
}

/* ── Shared bits reused across the variant examples ── */
function Thumb({ className = "size-24" }: { className?: string }) {
  return (
    <div className={`grid shrink-0 place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground ${className}`}>
      <ImageOff className="size-6 opacity-40" aria-hidden />
    </div>
  );
}

/* Display-only quantity stepper (no handlers — examples are static). */
function StaticQty({ value }: { value: number }) {
  return (
    <div className="inline-flex h-9 items-center rounded-md border" aria-hidden>
      <span className="grid size-9 place-items-center text-muted-foreground">
        <Minus className="size-3.5" />
      </span>
      <span className="grid h-full w-9 place-items-center border-x text-sm tabular-nums">{value}</span>
      <span className="grid size-9 place-items-center text-muted-foreground">
        <Plus className="size-3.5" />
      </span>
    </div>
  );
}

/* 2 — AHRI matched systems: same 4-zone grid, detail column carries AHRI# +
   headline + component models + spec line; action is "View System". */
type AhriItem = { ahri: string; headline: string; models: string; spec: string; branchQty: number; branch: string; allBranches: number; price: string };
const AHRI_ROWS: AhriItem[] = [
  { ahri: "215217523", headline: "80% AFUE Gas Furnace + 14.3 SEER2 AC — 3 Ton, Downflow", models: "CAPTA4230C3 · GD9S801005CN", spec: "14.3 SEER2 · 80% AFUE · 3 Ton · Single-stage · Downflow", branchQty: 4, branch: "Durham NC #1", allBranches: 12, price: "$7,332.39" },
  { ahri: "215217524", headline: "96% AFUE Gas Furnace + 15.2 SEER2 AC — 3.5 Ton, Upflow", models: "CAPTA4230D3 · GD9S960805CN", spec: "15.2 SEER2 · 96% AFUE · 3.5 Ton · Two-stage · Upflow", branchQty: 0, branch: "Durham NC #1", allBranches: 7, price: "$8,104.57" },
];
function AhriMatchedRow({ s }: { s: AhriItem }) {
  const detail = (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-primary">AHRI #{s.ahri}</p>
      <p className="line-clamp-2 text-sm font-semibold leading-snug">{s.headline}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{s.models}</p>
      <p className="mt-1 text-xs font-medium text-foreground">{s.spec}</p>
    </div>
  );
  const price = (
    <p className="text-base font-semibold text-price">
      {s.price}
      <span className="ml-1 text-xs font-normal text-muted-foreground">/ system</span>
    </p>
  );
  return (
    <article className="p-4">
      <div className="hidden grid-cols-[96px_minmax(0,340px)_minmax(0,1fr)_auto] items-center gap-5 sm:grid">
        <Thumb />
        {detail}
        <div className="flex justify-center">
          <InventoryLine branchQty={s.branchQty} branchName={s.branch} allBranchesQty={s.allBranches} />
        </div>
        <div className="justify-self-end text-right">
          {price}
          <Button size="sm" className="mt-2">
            View System
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-start gap-3">
          <Thumb className="size-20" />
          <div className="min-w-0 flex-1">
            {detail}
            <div className="mt-1.5">
              <InventoryLine branchQty={s.branchQty} branchName={s.branch} allBranchesQty={s.allBranches} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {price}
          <Button size="sm">
            View System
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

/* 3 — AHRI system detail components: Outdoor / Indoor / Furnace rows; a role
   eyebrow, model as title, specs flow down; availability centered; Add. */
type CompItem = { role: string; model: string; title: string; spec: string; branchQty: number; branch: string; allBranches: number; price: string };
const COMP_ROWS: CompItem[] = [
  { role: "Outdoor", model: "GSXH503610", title: "14.3 SEER2 Air Conditioner Condenser — 3 Ton, R-410A", spec: "14.3 SEER2 · 3 Ton · R-410A", branchQty: 9, branch: "Durham NC #1", allBranches: 46, price: "$2,119.84" },
  { role: "Indoor coil", model: "CAPTA4230C3", title: "Cased Evaporator Coil — 2.5–3 Ton, Upflow/Downflow", spec: "3 Ton · TXV included", branchQty: 23, branch: "Durham NC #1", allBranches: 118, price: "$1,169.57" },
  { role: "Furnace", model: "GD9S801005CN", title: "80% AFUE Single-Stage Gas Furnace — 100,000 BTU", spec: "80% AFUE · 100,000 BTU · Multi-position", branchQty: 0, branch: "Durham NC #1", allBranches: 15, price: "$2,042.98" },
];
function ComponentRow({ c }: { c: CompItem }) {
  const detail = (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-primary">{c.role}</p>
      <p className="line-clamp-2 text-sm font-semibold leading-snug">{c.title}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">MFG: {c.model}</p>
      <p className="mt-1 text-xs font-medium text-foreground">{c.spec}</p>
    </div>
  );
  const price = (
    <p className="text-base font-semibold text-price">
      {c.price}
      <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
    </p>
  );
  return (
    <article className="p-4">
      <div className="hidden grid-cols-[96px_minmax(0,340px)_minmax(0,1fr)_auto] items-center gap-5 sm:grid">
        <Thumb />
        {detail}
        <div className="flex justify-center">
          <InventoryLine branchQty={c.branchQty} branchName={c.branch} allBranchesQty={c.allBranches} />
        </div>
        <div className="justify-self-end text-right">
          {price}
          <Button size="sm" className="mt-2">
            <ShoppingCart className="size-4" />
            Add
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-start gap-3">
          <Thumb className="size-20" />
          <div className="min-w-0 flex-1">
            {detail}
            <div className="mt-1.5">
              <InventoryLine branchQty={c.branchQty} branchName={c.branch} allBranchesQty={c.allBranches} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {price}
          <Button size="sm">
            <ShoppingCart className="size-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}

/* 4 — Cart line row: Qty stepper + line total + Remove in the actions zone. */
type CartItemEx = { brand: string; title: string; item: string; mfg: string; qty: number; each: string; total: string };
const CART_ROWS: CartItemEx[] = [
  { brand: "TRADEPRO®", title: "TP-EC13-50 — Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230V, 1/2 HP", item: "54510A", mfg: "TP-EC13-50", qty: 2, each: "$168.42", total: "$336.84" },
  { brand: "Goodman", title: "GSXH503610 — 14.3 SEER2 Air Conditioner, 3 Ton, R-410A", item: "66201A", mfg: "GSXH503610", qty: 1, each: "$2,119.84", total: "$2,119.84" },
];
function CartRow({ c }: { c: CartItemEx }) {
  const titleBlock = (
    <>
      <p className="truncate text-xs font-medium text-primary">{c.brand}</p>
      <p className="line-clamp-2 text-sm font-semibold leading-snug">{c.title}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">Item: {c.item} · MFG: {c.mfg}</p>
    </>
  );
  const removeBtn = (
    <Button type="button" variant="link" size="sm" className="h-auto px-0">
      Remove
    </Button>
  );
  return (
    <div className="p-4">
      <div className="hidden grid-cols-[64px_minmax(0,340px)_minmax(max-content,1fr)_minmax(max-content,1fr)] items-center gap-x-6 sm:grid">
        <Thumb className="size-16" />
        <div className="min-w-0">{titleBlock}</div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Qty</span>
          <StaticQty value={c.qty} />
        </div>
        <div className="flex flex-col items-end gap-0.5 text-right">
          <span className="text-base font-semibold">{c.total}</span>
          <span className="text-xs text-muted-foreground">{c.each} / each</span>
          <span className="mt-1">{removeBtn}</span>
        </div>
      </div>
      <div className="flex items-start gap-3 sm:hidden">
        <Thumb className="size-14" />
        <div className="min-w-0 flex-1">
          {titleBlock}
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Qty</span>
              <StaticQty value={c.qty} />
            </div>
            <div className="flex flex-col items-end gap-0.5 text-right">
              <span className="text-sm font-semibold text-foreground">{c.total}</span>
              <span className="text-xs text-muted-foreground">{c.each} / each</span>
              {removeBtn}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 5 — Checkout review row (ReviewLine): read-only Qty + line total. */
function ReviewRow({ c }: { c: CartItemEx }) {
  const titleBlock = (
    <>
      <p className="truncate text-xs font-medium text-primary">{c.brand}</p>
      <p className="line-clamp-2 text-sm font-semibold leading-snug">{c.title}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">Item: {c.item} · MFG: {c.mfg}</p>
    </>
  );
  return (
    <div className="p-4">
      <div className="hidden grid-cols-[64px_minmax(0,340px)_minmax(max-content,1fr)_minmax(max-content,1fr)] items-center gap-x-6 sm:grid">
        <Thumb className="size-16" />
        <div className="min-w-0">{titleBlock}</div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground">Qty</span>
          <span className="text-sm font-medium">{c.qty}</span>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-base font-semibold">{c.total}</span>
          <span className="text-xs text-muted-foreground">{c.each} / each</span>
        </div>
      </div>
      <div className="flex items-start gap-3 sm:hidden">
        <Thumb className="size-14" />
        <div className="min-w-0 flex-1">
          {titleBlock}
          <div className="mt-2 flex items-end justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              Qty <span className="font-medium text-foreground">{c.qty}</span>
            </span>
            <span className="flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-foreground">{c.total}</span>
              <span className="text-xs text-muted-foreground">{c.each} / each</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 6 — Shopping list column table: a true table with a header row aligned to
   the data rows via one shared column template. */
const LIST_GRID_COLS =
  "grid-cols-[2.75rem_minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.8fr)_7.5rem_9rem]";
type ShopItem = { model: string; title: string; item: string; label: string; qty: number; onHand: number; price: string; replacement?: boolean };
const SHOP_ROWS: ShopItem[] = [
  { model: "TP-EC13-50", title: "TP-EC13-50 — Blower Motor, X-13 ECM, Variable Speed, 1/2 HP", item: "54510A", label: "Preventative", qty: 4, onHand: 168, price: "$168.42" },
  { model: "TP-CAP-370-455", title: "TP-CAP-370-455 — Run Capacitor, 45/5 MFD, 370V, Round Dual", item: "11822", label: "Consumable", qty: 12, onHand: 0, price: "$12.87", replacement: true },
];
function ShoppingTable() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[860px]">
        {/* Column header */}
        <div className={`grid ${LIST_GRID_COLS} items-center gap-x-4 border-b bg-muted/40 px-4 py-3 text-xs font-semibold text-muted-foreground`}>
          <span />
          <span>Product Details</span>
          <span>Label</span>
          <span className="text-center">Availability</span>
          <span>Price</span>
          <span>Qty</span>
          <span className="text-right">Actions</span>
        </div>
        {/* Data rows */}
        {SHOP_ROWS.map((r, i) => (
          <div
            key={r.item}
            className={`grid ${LIST_GRID_COLS} items-center gap-x-4 px-4 py-4 ${i > 0 ? "border-t" : ""}`}
          >
            <div className="flex items-center gap-2">
              <span aria-hidden className="cursor-grab text-base leading-none text-muted-foreground">
                ⠿
              </span>
              <Checkbox aria-label={`Select ${r.model}`} />
            </div>
            <div className="flex min-w-0 items-start gap-3">
              <Thumb className="size-14" />
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold leading-snug">{r.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">Item: {r.item} · MFG: {r.model}</p>
              </div>
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 text-xs font-medium">
                {r.label}
                <ChevronRight className="size-3 rotate-90 text-muted-foreground" />
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-xs text-muted-foreground">Inventory</span>
              <StockStatus qty={r.onHand}>
                {r.onHand > 0 ? `${r.onHand} In Stock` : "Out of stock"}
              </StockStatus>
              {r.replacement ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                  <Replace className="size-3" />
                  Replacement
                </span>
              ) : null}
            </div>
            <div className="text-sm font-semibold leading-snug">
              {r.price}
              <span className="block text-xs font-normal text-muted-foreground">/ EACH</span>
            </div>
            <div>
              <StaticQty value={r.qty} />
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button size="sm">
                <ShoppingCart className="size-4" />
                Add
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 text-destructive hover:text-destructive/80" aria-label={`Remove ${r.model}`}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Variant catalog — label, where it lives, and the live example to render. */
const USAGES: { name: string; grid: string; desc: string; href: string; example: React.ReactNode }[] = [
  {
    name: "Search / PLP — List view",
    grid: "[96px · minmax(0,340px) · minmax(0,1fr) · auto]",
    desc: "Full-width rows with availability as its own centered middle column; capped description.",
    href: "/search?q=blower%20motor&signedin=1",
    example: (
      <div className="divide-y">
        {SAMPLE_ROWS.slice(0, 2).map((item) => (
          <Row key={item.meta} item={item} />
        ))}
      </div>
    ),
  },
  {
    name: "AHRI matched systems",
    grid: "[96px · minmax(0,340px) · minmax(0,1fr) · auto]",
    desc: "Same grid; the detail column shows AHRI# + headline + component models + a spec line.",
    href: "/pdp/uc-ahri-matched-system?signedin=1#ahri-lookup",
    example: (
      <div className="divide-y">
        {AHRI_ROWS.map((s) => (
          <AhriMatchedRow key={s.ahri} s={s} />
        ))}
      </div>
    ),
  },
  {
    name: "AHRI system detail — components",
    grid: "[96px · minmax(0,340px) · minmax(0,1fr) · auto]",
    desc: "Outdoor / Indoor / Furnace component rows; availability its own centered column, specs flow down.",
    href: "/ahri/215217523",
    example: (
      <div className="divide-y">
        {COMP_ROWS.map((c) => (
          <ComponentRow key={c.model} c={c} />
        ))}
      </div>
    ),
  },
  {
    name: "Cart line rows",
    grid: "image · title · qty · price (stacked on mobile)",
    desc: "Same storefront row; Qty stepper + price in the actions zone.",
    href: "/cart?demo=1",
    example: (
      <div className="divide-y">
        {CART_ROWS.map((c) => (
          <CartRow key={c.item} c={c} />
        ))}
      </div>
    ),
  },
  {
    name: "Checkout review rows",
    grid: "image · title · qty · price",
    desc: "The ReviewLine — a read-only variant of the row, shared across v1 / v2 / v3 review.",
    href: "/checkout/v3/review?demo=1",
    example: (
      <div className="divide-y">
        {CART_ROWS.map((c) => (
          <ReviewRow key={c.item} c={c} />
        ))}
      </div>
    ),
  },
  {
    name: "Shopping list — column table",
    grid: "lead · Product Details · Label · Availability · Price · Qty · Actions",
    desc: "The widest variant (a true table w/ header row); columns distributed evenly, availability centered.",
    href: "/dashboard/shopping-lists/hvac-maintenance-kit",
    example: <ShoppingTable />,
  },
];

export default function ListViewsReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Patterns
          </p>
          <h1 className="text-3xl font-bold tracking-tight">List Views</h1>
          <p className="max-w-2xl text-muted-foreground">
            One canonical storefront list row underlies every product list in the app —
            search/PLP, cart, checkout review, the shopping list, and AHRI matched systems.
            Four zones: <strong>image</strong>, a <strong>capped description</strong> (so the
            title wraps instead of sprawling), <strong>availability as its own centered column</strong>,
            and <strong>price + action</strong>. Build new lists from this — never a one-off.
          </p>
        </header>

        {/* ── The pattern ── */}
        <section className="space-y-4">
          <H2 id="pattern">The pattern</H2>
          <p className="text-sm text-muted-foreground">
            The 4-zone grid at <code className="rounded bg-muted px-1 py-0.5 text-xs">sm+</code>; it
            stacks (image + details, availability beneath, action full width) below sm.
          </p>
          <PreviewCode
            code={`<article className="rounded-md border p-4">
  {/* Desktop — [image] [capped description] [availability, centered] [price + action] */}
  <div className="hidden grid-cols-[96px_minmax(0,340px)_minmax(0,1fr)_auto] items-center gap-5 sm:grid">
    <Thumb />
    <Details />                 {/* brand · title (line-clamp) · item/MFG */}
    <div className="text-center">{availability}</div>
    <div className="justify-self-end text-right">{price}{addButton}</div>
  </div>
  {/* Mobile — image+details stacked, availability beneath, action full width */}
  <div className="flex flex-col gap-3 sm:hidden">…</div>
</article>`}
          >
            <CanonicalRow />
          </PreviewCode>
        </section>

        {/* ── Anatomy ── */}
        <section className="space-y-4">
          <H2 id="anatomy">Anatomy</H2>
          <ol className="overflow-hidden rounded-xl border">
            {[
              { part: "Image", detail: "96px square tile (size-20 on mobile). DS placeholder when missing — never a broken image." },
              { part: "Description", detail: "Capped at minmax(0,340px) so the title clamps (2–3 lines) and specs flow down, not across." },
              { part: "Availability", detail: "Its own centered column (minmax(0,1fr)) — StockStatus / InventoryLine, never stacked under the title." },
              { part: "Price + action", detail: "Right-aligned (justify-self-end): price + the DS Add button (and Qty stepper where the list is editable)." },
            ].map((a, i) => (
              <li key={a.part} className="flex gap-4 border-b px-4 py-3 last:border-0 sm:items-baseline">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="w-32 shrink-0 text-sm font-medium">{a.part}</span>
                <span className="text-sm text-muted-foreground">{a.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Where it's used ── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <H2 id="where">Where it&rsquo;s used</H2>
            <p className="text-sm text-muted-foreground">
              Every list in the app is this one pattern. Each variant is shown live below — same grid,
              same availability column — so you can compare them side by side. Open any to see it in context.
            </p>
          </div>
          <div className="space-y-8">
            {USAGES.map((u) => (
              <div key={u.name} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <div className="min-w-0">
                    <Link
                      href={u.href}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      {u.name}
                      <ExternalLink className="size-3.5" />
                    </Link>
                    <p className="text-xs text-muted-foreground">{u.desc}</p>
                  </div>
                  <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    {u.grid}
                  </code>
                </div>
                <div className="overflow-hidden rounded-xl border bg-background">{u.example}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Reuse this grid for any new product list — same zones, same order.</>,
              <>Give availability its own centered column; use StockStatus / InventoryLine.</>,
              <>Cap the description so the title clamps and specs flow down.</>,
              <>Use a shared column constant so the header row aligns to the data rows.</>,
            ]}
            donts={[
              <>Stack availability under the title (it loses its column).</>,
              <>Let the description sprawl full-width on wide screens.</>,
              <>Invent a new row layout per surface — there is one canonical row.</>,
              <>Hand-roll inventory text instead of the DS inventory component.</>,
            ]}
          />
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}
