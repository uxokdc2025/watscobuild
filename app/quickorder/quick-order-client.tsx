"use client";

import * as React from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  ImageIcon,
  TriangleAlert,
  Upload as UploadIcon,
  Search as SearchIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/* ════════════════════════════════════════════════════════════════════════
   Quick Order — Multiple Search (recreated from the live Homans/Peirce
   quickorder page on our design system). Two interactions:
   · the "requires your review" banner is our Alert (warning) with a top-level
     Show (N) collapse — exactly like the shopping-list "Replacements available"
     banner — holding the items we couldn't match 1:1;
   · each review item expands inline to pick the right product from its matches.
   The ready list is our real product-list table (Product Details · Availability
   · Price · Qty · actions), the same grid used on the shopping-list detail.
   ════════════════════════════════════════════════════════════════════════ */

type Match = { id: string; brand: string; title: string; item: string; mfg: string; price: number | null };
type ReviewRow = { id: string; brand: string; title: string; item: string; mfg: string; matches: Match[] };
type ReadyRow = { id: string; brand: string; title: string; item: string; mfg: string; qty: number; availability: string };

// Ready-list columns: Product Details · Availability · Price · Qty · actions.
const READY_GRID_COLS =
  "grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)_minmax(0,0.8fr)_7.5rem_5.5rem]";

const INITIAL_REVIEW: ReviewRow[] = [
  {
    id: "gapcccar2025",
    brand: "Factory Authorized Parts",
    title: 'Carrier® Infinity — GAPCCCAR2025 20" x 25" High Efficiency GAPA Replacement Filters for Furnaces',
    item: "GAPCCCAR2025",
    mfg: "GAPCCCAR2025-A05",
    matches: [
      { id: "m1", brand: "Factory Authorized Parts", title: 'GAPCCCAR2025 20" x 25" x 5" MERV 15 GAPA Filter (single)', item: "GAPCCCAR2025A", mfg: "GAPCCCAR2025-A05", price: 48.9 },
      { id: "m2", brand: "Factory Authorized Parts", title: 'GAPCCCAR2025 20" x 25" x 5" MERV 15 GAPA Filter (3-pack)', item: "GAPCCCAR2025B", mfg: "GAPCCCAR2025-B03", price: 132.0 },
      { id: "m3", brand: "Carrier®", title: 'Infinity Air Purifier Filter 20" x 25", MERV 15', item: "GAPCCCAR2025C", mfg: "GAPCCCAR2025-C", price: null },
      { id: "m4", brand: "Bryant®", title: 'Evolution Air Purifier Filter 20" x 25", cross-reference', item: "GAPBBCAR2025", mfg: "GAPBBCAR2025", price: 46.75 },
    ],
  },
  {
    id: "txv410",
    brand: "Emerson®",
    title: "TXV-R410A — Thermostatic Expansion Valve, R-410A (tonnage not specified)",
    item: "TXV-R410A",
    mfg: "TXVR410A",
    matches: [
      { id: "t1", brand: "Emerson®", title: "TXV-R410A-2T — Thermostatic Expansion Valve, R-410A, 2 Ton", item: "TXVR410A2T", mfg: "TXV-R410A-2T", price: 82.0 },
      { id: "t2", brand: "Emerson®", title: "TXV-R410A-3T — Thermostatic Expansion Valve, R-410A, 3 Ton", item: "TXVR410A3T", mfg: "TXV-R410A-3T", price: 96.0 },
      { id: "t3", brand: "Sporlan®", title: "EBF-3-CP100 — Balanced-Port TXV, R-410A, 3 Ton, cross-reference", item: "SPEBF3CP100", mfg: "EBF-3-CP100", price: 104.5 },
    ],
  },
];

const INITIAL_READY: ReadyRow[] = [
  { id: "25942", brand: "GB®", title: "GB-3 Orange Wire Connector", item: "25942", mfg: "25942", qty: 1, availability: "Call for availability" },
  { id: "1200ag", brand: "Aquaguard®", title: "Magnetic Float Switch System for Metal & Plastic Secondary Drain Pans", item: "1200AG", mfg: "96106", qty: 3, availability: "Call for availability" },
];

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function Thumb({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-14 shrink-0 place-items-center overflow-hidden rounded-md bg-muted/40 p-1 text-muted-foreground/50", className)}>
      <ImageIcon className="size-6" aria-hidden />
    </span>
  );
}

function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex h-9 items-center rounded-md border" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className="grid size-9 place-items-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="size-3.5" />
      </button>
      <span className="grid h-full w-9 place-items-center border-x text-sm tabular-nums">{value}</span>
      <button type="button" className="grid size-9 place-items-center text-muted-foreground transition-colors hover:bg-muted" onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

/* ── One review item inside the banner: expands inline to pick a match ──── */
function ReviewItem({ row, onSelect, onRemove }: { row: ReviewRow; onSelect: (m: Match) => void; onRemove: () => void }) {
  const [open, setOpen] = React.useState(false);
  const panelId = `review-${row.id}`;
  return (
    <div className="overflow-hidden rounded-md border border-border bg-background">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <Thumb className="size-12" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-primary">{row.brand}</p>
          <p className="truncate text-sm font-semibold text-foreground">{row.title}</p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">Item: {row.item} · MFG: {row.mfg}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">{row.matches.length} matches</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 text-foreground"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
          >
            Select Product
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${row.item}`}
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div id={panelId} className={cn("border-t bg-muted/30 p-3", !open && "hidden")}>
        <p className="px-1 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Choose the right product
        </p>
        <ul className="space-y-2">
          {row.matches.map((m) => (
            <li key={m.id} className="flex flex-col gap-3 rounded-md border bg-background p-3 sm:flex-row sm:items-center">
              <Thumb className="size-11" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-primary">{m.brand}</p>
                <p className="line-clamp-1 text-sm font-medium">{m.title}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">Item: {m.item} · MFG: {m.mfg}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="text-sm font-semibold tabular-nums">
                  {m.price != null ? usd(m.price) : <span className="font-normal text-muted-foreground">Call for availability</span>}
                </span>
                <Button type="button" size="sm" className="min-h-11" onClick={() => onSelect(m)}>
                  Select
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── One ready product row — our list-detail product-table layout ──────── */
function ReadyRowItem({ row, onQty, onRemove }: { row: ReadyRow; onQty: (n: number) => void; onRemove: () => void }) {
  const title = (
    <>
      <p className="text-xs font-medium text-primary">{row.brand}</p>
      <p className="text-sm font-semibold leading-snug text-foreground">{row.title}</p>
      <p className="mt-0.5 font-mono text-xs text-muted-foreground">Item: {row.item} · MFG: {row.mfg}</p>
    </>
  );
  return (
    <div className="border-b last:border-b-0">
      {/* Desktop: aligned to the column header grid */}
      <div className={cn("hidden sm:grid", READY_GRID_COLS, "items-center gap-x-4 px-4 py-4")}>
        <div className="flex min-w-0 items-start gap-3">
          <Thumb />
          <div className="min-w-0 space-y-1">{title}</div>
        </div>
        <div className="text-center text-sm text-muted-foreground">{row.availability}</div>
        <div className="text-sm font-semibold leading-snug text-muted-foreground">
          Call for price
        </div>
        <div>
          <QtyStepper value={row.qty} onChange={onQty} label={row.mfg} />
        </div>
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-destructive hover:text-destructive/80"
            aria-label={`Remove ${row.mfg}`}
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Mobile: stacked card */}
      <div className="p-4 sm:hidden">
        <div className="flex gap-3">
          <Thumb className="size-16" />
          <div className="min-w-0 flex-1 space-y-1">{title}</div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>{row.availability}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <QtyStepper value={row.qty} onChange={onQty} label={row.mfg} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 text-destructive hover:text-destructive/80"
            aria-label={`Remove ${row.mfg}`}
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActionBar({ ready, review }: { ready: number; review: number }) {
  const total = ready + review;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-lg font-bold tracking-tight">
        {ready} of {total} item{total === 1 ? "" : "s"} ready
      </p>
      <div className="flex items-center gap-3">
        {/* Secondary on the LEFT, primary on the RIGHT. */}
        <Button type="button" variant="secondary">
          Add to My List
        </Button>
        <Button disabled={ready === 0}>
          <ShoppingCart className="size-4" aria-hidden />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export function QuickOrderClient() {
  const [tab, setTab] = React.useState("multiple");
  const [paste, setPaste] = React.useState("");
  const [review, setReview] = React.useState<ReviewRow[]>(INITIAL_REVIEW);
  const [ready, setReady] = React.useState<ReadyRow[]>(INITIAL_READY);
  const [bannerOpen, setBannerOpen] = React.useState(true);

  const resolve = (rowId: string, m: Match) => {
    setReview((p) => p.filter((r) => r.id !== rowId));
    setReady((p) => [
      ...p,
      { id: m.id, brand: m.brand, title: m.title, item: m.item, mfg: m.mfg, qty: 1, availability: m.price != null ? usd(m.price) : "Call for availability" },
    ]);
  };

  const empty = !review.length && !ready.length;

  return (
    <main className="min-h-svh bg-muted/20 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">Home</Link>
          <ChevronRight className="size-3.5 opacity-60" />
          <span>Quick Order</span>
        </nav>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Quick Order</h1>
          <button type="button" className="text-sm font-medium text-primary hover:underline">How it works</button>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
          {/* ── Left: input panel ── */}
          <section className="rounded-xl border bg-background p-5 shadow-sm">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList
                variant="segmented"
                className="h-11 w-full items-center gap-0 divide-x divide-border overflow-hidden rounded-md border border-border bg-white p-0"
              >
                {(
                  [
                    { value: "search", label: "Search" },
                    { value: "multiple", label: "Multiple Search" },
                    { value: "upload", label: "Upload" },
                  ] as const
                ).map((t) => (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="h-full rounded-none border-0 px-4 text-sm font-medium text-muted-foreground after:hidden data-[state=active]:bg-[var(--tab-active-bg)]! data-[state=active]:font-semibold data-[state=active]:text-[var(--tab-active-fg)]! data-[state=active]:hover:bg-[var(--tab-active-bg)] data-[state=active]:hover:text-[var(--tab-active-fg)] data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="search" className="mt-4">
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search item # or name" className="h-10 pl-9" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Search one item at a time and add it to your list.</p>
              </TabsContent>

              <TabsContent value="multiple" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  You can type each search term on a new line, or copy and paste your search in from a spreadsheet
                </p>
                <Textarea
                  value={paste}
                  onChange={(e) => setPaste(e.target.value)}
                  placeholder="Type or paste one per line"
                  rows={9}
                  className="mt-3 resize-y"
                />
                <Button type="button" variant="outline" className="mt-3 w-full text-foreground" disabled={!paste.trim()}>
                  Add to the List
                </Button>
                <div className="mt-5 text-sm">
                  <p className="font-medium">Examples:</p>
                  <p className="mt-1 text-primary">Items only</p>
                  <p className="text-primary">Items + qty</p>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <label className="grid cursor-pointer place-items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-10 text-center transition hover:bg-muted/50">
                  <UploadIcon className="size-6 text-muted-foreground" aria-hidden />
                  <span className="text-sm font-medium">Upload a .csv or .xlsx</span>
                  <span className="text-xs text-muted-foreground">Drag &amp; drop or click to browse</span>
                  <input type="file" className="sr-only" accept=".csv,.xlsx" />
                </label>
              </TabsContent>
            </Tabs>
          </section>

          {/* ── Right: review + list ── */}
          <section className="min-w-0 space-y-5">
            {empty ? (
              <div className="grid min-h-[40svh] place-items-center rounded-xl border border-dashed bg-background p-8 text-center">
                <div>
                  <p className="font-medium">Your list is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">Search to add items.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Review banner — our Alert (warning) with a Show (N) collapse */}
                {review.length > 0 ? (
                  <Alert variant="warning">
                    <TriangleAlert />
                    <AlertTitle>
                      {review.length} item{review.length === 1 ? "" : "s"} require{review.length === 1 ? "s" : ""} your review
                    </AlertTitle>
                    <AlertDescription>
                      <div className="flex w-full items-center justify-between gap-3">
                        <p className="m-0">Pick the right product for each item we couldn&apos;t match exactly.</p>
                        <button
                          type="button"
                          onClick={() => setBannerOpen((o) => !o)}
                          aria-expanded={bannerOpen}
                          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground"
                        >
                          {bannerOpen ? "Hide" : `Show (${review.length})`}
                          <ChevronDown className={cn("size-4 transition-transform", bannerOpen && "rotate-180")} />
                        </button>
                      </div>
                      <div className={cn("mt-3 w-full space-y-3", !bannerOpen && "hidden")}>
                        {review.map((r) => (
                          <ReviewItem
                            key={r.id}
                            row={r}
                            onSelect={(m) => resolve(r.id, m)}
                            onRemove={() => setReview((p) => p.filter((x) => x.id !== r.id))}
                          />
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : null}

                <section className="rounded-lg border bg-background shadow-sm">
                  <div className="border-b p-5">
                    <ActionBar ready={ready.length} review={review.length} />
                  </div>

                  {/* Column header — desktop only, aligned to the row grid */}
                  {ready.length > 0 ? (
                    <div className={cn("hidden sm:grid", READY_GRID_COLS, "items-center gap-x-4 border-b bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground")}>
                      <span>Product Details</span>
                      <span className="text-center">Availability</span>
                      <span>Price</span>
                      <span>Qty</span>
                      <span aria-hidden="true" />
                    </div>
                  ) : null}

                  <div>
                    {ready.map((row) => (
                      <ReadyRowItem
                        key={row.id}
                        row={row}
                        onQty={(n) => setReady((p) => p.map((x) => (x.id === row.id ? { ...x, qty: n } : x)))}
                        onRemove={() => setReady((p) => p.filter((x) => x.id !== row.id))}
                      />
                    ))}
                  </div>

                  <div className="border-t p-5">
                    <ActionBar ready={ready.length} review={review.length} />
                  </div>
                </section>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
