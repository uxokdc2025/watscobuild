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

/* ════════════════════════════════════════════════════════════════════════
   Quick Order — Multiple Search (recreated from the live Homans/Peirce
   quickorder page on our design system). The new piece is the expandable /
   collapsible "requires your review" replacement component that sits above
   the ready items: it holds a pasted item we couldn't match 1:1 and expands
   to let the buyer pick the right product from the matches.
   ════════════════════════════════════════════════════════════════════════ */

type Match = { id: string; brand: string; title: string; item: string; mfg: string; price: number | null };
type ReviewRow = { id: string; brand: string; title: string; item: string; mfg: string; matches: Match[] };
type ReadyRow = { id: string; brand: string; title: string; item: string; mfg: string; qty: number; availability: string };

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
    <span className={cn("grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted text-muted-foreground/50", className)}>
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

/* ── The collapsible review / replacement component ──────────────────── */
function ReviewCard({ row, onSelect, onRemove }: { row: ReviewRow; onSelect: (m: Match) => void; onRemove: () => void }) {
  const [open, setOpen] = React.useState(false);
  const panelId = `review-${row.id}`;
  return (
    <div className="overflow-hidden rounded-lg border border-yellow-500/40 bg-yellow-400/12">
      <p className="flex items-center gap-2 px-4 pt-3 text-sm font-semibold text-yellow-800 dark:text-yellow-300">
        <TriangleAlert className="size-4" aria-hidden />
        The following item requires your review
      </p>
      <div className="flex flex-wrap items-center gap-4 p-4">
        <Thumb />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{row.brand}</p>
          <p className="line-clamp-2 text-sm font-semibold">{row.title}</p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            Item: {row.item} · MFG: {row.mfg}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{row.matches.length} matching products found</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-foreground"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
          >
            Select Product
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
          </Button>
          <button
            type="button"
            aria-label="Remove item"
            onClick={onRemove}
            className="grid size-9 place-items-center rounded-md text-muted-foreground transition hover:bg-background hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {open ? (
        <div id={panelId} className="border-t border-yellow-500/30 bg-background p-3">
          <p className="px-1 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Choose the right product
          </p>
          <ul className="divide-y">
            {row.matches.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-4 py-3">
                <Thumb className="size-12" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">{m.brand}</p>
                  <p className="line-clamp-1 text-sm font-medium">{m.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">Item: {m.item} · MFG: {m.mfg}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold tabular-nums">
                    {m.price != null ? usd(m.price) : <span className="text-muted-foreground">Call for availability</span>}
                  </span>
                  <Button type="button" size="sm" onClick={() => onSelect(m)}>
                    Select
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ReadyRowItem({ row, onQty, onRemove }: { row: ReadyRow; onQty: (n: number) => void; onRemove: () => void }) {
  return (
    <li className="flex flex-wrap items-center gap-4 border-t py-4 first:border-t-0">
      <Thumb />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">{row.brand}</p>
        <p className="text-sm font-semibold">{row.title}</p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">Item: {row.item} · MFG: {row.mfg}</p>
      </div>
      <span className="text-sm text-muted-foreground">{row.availability}</span>
      <QtyStepper value={row.qty} onChange={onQty} label={row.mfg} />
      <button
        type="button"
        aria-label="Remove item"
        onClick={onRemove}
        className="grid size-9 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

function ActionBar({ ready, review }: { ready: number; review: number }) {
  const total = ready + review;
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <p className="text-lg font-bold tracking-tight">
        {ready} of {total} item{total === 1 ? "" : "s"} ready
      </p>
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-4">
          <Button disabled={ready === 0}>
            <ShoppingCart className="size-4" aria-hidden />
            Add to Cart
          </Button>
          <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Add to My List
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {ready > 0 ? `${ready} item${ready === 1 ? "" : "s"} without price will be skipped` : null}
        </p>
        {review > 0 ? (
          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
            {review} item{review === 1 ? "" : "s"} need{review === 1 ? "s" : ""} review before adding
          </p>
        ) : null}
      </div>
    </div>
  );
}

type Tab = "search" | "multiple" | "upload";

export function QuickOrderClient() {
  const [tab, setTab] = React.useState<Tab>("multiple");
  const [paste, setPaste] = React.useState("");
  const [review, setReview] = React.useState<ReviewRow[]>(INITIAL_REVIEW);
  const [ready, setReady] = React.useState<ReadyRow[]>(INITIAL_READY);

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

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          {/* ── Left: input panel ── */}
          <section className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
              {(["search", "multiple", "upload"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "search" ? "Search" : t === "multiple" ? "Multiple Search" : "Upload"}
                </button>
              ))}
            </div>

            {tab === "multiple" ? (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  You can type each search term on a new line, or copy and paste your search in from a spreadsheet
                </p>
                <textarea
                  value={paste}
                  onChange={(e) => setPaste(e.target.value)}
                  placeholder="Type or paste one per line"
                  rows={9}
                  className="mt-3 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button type="button" variant="outline" className="mt-3 w-full text-foreground" disabled={!paste.trim()}>
                  Add to the List
                </Button>
                <div className="mt-5 text-sm">
                  <p className="font-medium">Examples:</p>
                  <p className="mt-1 text-primary">Items only</p>
                  <p className="text-primary">Items + qty</p>
                </div>
              </div>
            ) : tab === "search" ? (
              <div className="mt-4">
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search item # or name" className="h-10 pl-9" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Search one item at a time and add it to your list.</p>
              </div>
            ) : (
              <div className="mt-4">
                <label className="grid cursor-pointer place-items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-10 text-center transition hover:bg-muted/50">
                  <UploadIcon className="size-6 text-muted-foreground" aria-hidden />
                  <span className="text-sm font-medium">Upload a .csv or .xlsx</span>
                  <span className="text-xs text-muted-foreground">Drag & drop or click to browse</span>
                  <input type="file" className="sr-only" accept=".csv,.xlsx" />
                </label>
              </div>
            )}
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
                {review.map((r) => (
                  <ReviewCard key={r.id} row={r} onSelect={(m) => resolve(r.id, m)} onRemove={() => setReview((p) => p.filter((x) => x.id !== r.id))} />
                ))}

                <div className="rounded-xl border bg-background p-5 shadow-sm">
                  <ActionBar ready={ready.length} review={review.length} />
                  <ul className="mt-4">
                    {ready.map((row) => (
                      <ReadyRowItem
                        key={row.id}
                        row={row}
                        onQty={(n) => setReady((p) => p.map((x) => (x.id === row.id ? { ...x, qty: n } : x)))}
                        onRemove={() => setReady((p) => p.filter((x) => x.id !== row.id))}
                      />
                    ))}
                  </ul>
                  <div className="mt-4 border-t pt-4">
                    <ActionBar ready={ready.length} review={review.length} />
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
