"use client";

import Link from "next/link";
import { ExternalLink, ListPlus, Minus, Plus, Search, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "anatomy", label: "Anatomy" },
  { id: "guidance", label: "Guidance" },
  { id: "api", label: "API" },
  { id: "in-production", label: "In production" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

/** The stepper + primary-CTA row that anchors the buy-box — drawn above the
 *  secondary actions so their alignment is honest. Same footprint the PDP
 *  buy-box uses. */
function QtyAndAdd() {
  const cell =
    "grid h-9 w-9 place-items-center text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground";
  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-md border" role="group" aria-label="Quantity">
        <button type="button" className={cn(cell, "rounded-l-md")} aria-label="Decrease">
          <Minus className="size-4" />
        </button>
        <span className="grid h-9 w-9 place-items-center border-x text-sm font-medium tabular-nums">
          1
        </span>
        <button type="button" className={cn(cell, "rounded-r-md")} aria-label="Increase">
          <Plus className="size-4" />
        </button>
      </div>
      <button
        type="button"
        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ShoppingCart className="size-4" />
        Add to Cart
      </button>
    </div>
  );
}

/** Canonical PDP secondary-actions row (locked 2026-08-18): Save stays a muted
 *  text link; Find AHRI is promoted to a small purple outline button so the
 *  discovery CTA reads as an action, not a footnote. */
function SaveAndAhri() {
  return (
    <div className="-ml-1 flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ListPlus className="size-4" />
        Save to List
      </button>
      <a
        href="#"
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-violet-500 px-3 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-950/40"
      >
        <Search className="size-3.5" />
        Find an AHRI Matched System
      </a>
    </div>
  );
}

const ANATOMY: { part: string; detail: string }[] = [
  { part: "Qty + Add", detail: "The primary buy-box row. Drawn here only so the secondary actions align to a real anchor." },
  { part: "Save to List", detail: "A muted text link with a ListPlus icon — low emphasis, never a solid button." },
  { part: "Find AHRI", detail: "A small violet outline button. Promoted from a footnote so the discovery CTA reads as an action." },
];

export default function SaveAhriReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Save + AHRI</h1>
          <p className="max-w-2xl text-muted-foreground">
            The canonical secondary-actions row that sits under Add to Cart on PDPs carrying an AHRI
            matchup. Two actions at different weights: Save stays a muted text link; Find an AHRI
            Matched System is a small violet outline button so the discovery CTA reads as an action,
            not a footnote.
          </p>
        </header>

        {/* ── Usage ── */}
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <p className="text-sm text-muted-foreground">
            The row in context: the Qty + Add buy-box row is drawn above so the secondary actions
            align to a real anchor, exactly as they do on the PDP.
          </p>
          <PreviewCode
            previewClassName="justify-center"
            code={`<div className="flex w-full max-w-sm flex-col gap-3">
  {/* Primary buy-box row */}
  <QtyAndAdd />

  {/* Secondary actions — Save link + Find AHRI outline button */}
  <div className="-ml-1 flex flex-wrap items-center gap-x-3 gap-y-1">
    <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
      <ListPlus className="size-4" />
      Save to List
    </button>
    <a href="#" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-violet-500 px-3 text-xs font-semibold text-violet-700 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-950/40">
      <Search className="size-3.5" />
      Find an AHRI Matched System
    </a>
  </div>
</div>`}
          >
            <div className="flex w-full max-w-sm flex-col gap-3">
              <QtyAndAdd />
              <SaveAndAhri />
            </div>
          </PreviewCode>
        </section>

        {/* ── Anatomy ── */}
        <section className="space-y-4">
          <H2 id="anatomy">Anatomy</H2>
          <p className="text-sm text-muted-foreground">
            Three parts, top to bottom. The weight hierarchy is the whole point — one primary, one
            muted link, one promoted-but-secondary outline button.
          </p>
          <ol className="overflow-hidden rounded-xl border">
            {ANATOMY.map((a, i) => (
              <li
                key={a.part}
                className="flex gap-4 border-b px-4 py-3 last:border-0 sm:items-baseline"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="w-28 shrink-0 text-sm font-medium">{a.part}</span>
                <span className="text-sm text-muted-foreground">{a.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Keep Save as a muted text link — it is the lowest-priority action in the buy box.</>,
              <>Style Find AHRI as a small violet outline button so discovery reads as an action.</>,
              <>Only show the AHRI action on products that actually carry a matchup.</>,
              <>Align the row to the Add-to-Cart above it; the shared footprint keeps them honest.</>,
            ]}
            donts={[
              <>Give Save a solid fill — that competes with Add to Cart.</>,
              <>Bury Find AHRI as plain muted text; it stops reading as a CTA.</>,
              <>Render the AHRI button on non-matchup SKUs where it goes nowhere.</>,
              <>Introduce a third primary-weight action into this row.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="Row actions"
            rows={[
              { name: "Save to List", type: "text link", description: "Muted ListPlus link; opens the Save-to-List flow. Always present." },
              { name: "Find AHRI", type: "violet outline", description: "Small violet outline button; links to the AHRI matched-system finder. Shown only on matchup SKUs." },
              { name: "Qty + Add", type: "buy-box row", description: "Not part of this row — drawn above for alignment reference only." },
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where this row ships. Compare against the reference above.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "PDP — Replacement Products", href: "/pdp/uc-replacement-products?signedin=1" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
                <ExternalLink className="size-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}
