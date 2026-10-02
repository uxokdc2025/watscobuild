"use client";

import Link from "next/link";
import { ExternalLink, ImageOff, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
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

/* The one canonical storefront list row: [image] [capped description]
   [availability, its own centered column] [price + action]. Full width on
   mobile it stacks; at sm+ it's the 4-zone grid below. */
function CanonicalRow() {
  return (
    <article className="w-full rounded-md border p-4">
      <div className="hidden grid-cols-[96px_minmax(0,340px)_minmax(0,1fr)_auto] items-center gap-5 sm:grid">
        <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
          <ImageOff className="size-6 opacity-40" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-primary">TRADEPRO®</p>
          <p className="line-clamp-3 text-sm font-semibold leading-snug">
            TP-EC13-50 — Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230V, 1/2 HP
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">Item: 54510A · MFG: TP-EC13-50</p>
        </div>
        <div className="text-center text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            168 In Stock
          </span>
          <p className="text-muted-foreground">Durham NC #1</p>
        </div>
        <div className="justify-self-end text-right">
          <p className="text-base font-semibold text-price">
            $168.42
            <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
          </p>
          <Button size="sm" className="mt-2">
            <ShoppingCart className="size-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}

const USAGES: { name: string; grid: string; desc: string; href: string }[] = [
  {
    name: "Search / PLP — List view",
    grid: "[96px · minmax(0,340px) · minmax(0,1fr) · auto]",
    desc: "Full-width rows with availability as its own centered middle column; capped description.",
    href: "/search?q=blower%20motor&signedin=1",
  },
  {
    name: "AHRI matched systems",
    grid: "[96px · minmax(0,340px) · minmax(0,1fr) · auto]",
    desc: "Same grid; the detail column shows AHRI# + headline + component models + a spec line.",
    href: "/pdp/uc-ahri-matched-system?signedin=1#ahri-lookup",
  },
  {
    name: "AHRI system detail — components",
    grid: "[96px · minmax(0,340px) · minmax(0,1fr) · auto]",
    desc: "Outdoor / Indoor / Furnace component rows; availability its own centered column, specs flow down.",
    href: "/ahri/215217523",
  },
  {
    name: "Cart line rows",
    grid: "image · title · qty · price (stacked on mobile)",
    desc: "Same storefront row; Qty stepper + price in the actions zone.",
    href: "/cart?demo=1",
  },
  {
    name: "Checkout review rows",
    grid: "image · title · qty · price",
    desc: "The ReviewLine — a read-only variant of the row, shared across v1 / v2 / v3 review.",
    href: "/checkout/v3/review?demo=1",
  },
  {
    name: "Shopping list — column table",
    grid: "lead · Product Details · Label · Availability · Price · Qty · Actions",
    desc: "The widest variant (a true table w/ header row); columns distributed evenly, availability centered.",
    href: "/dashboard/shopping-lists/hvac-maintenance-kit",
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
        <section className="space-y-4">
          <H2 id="where">Where it&rsquo;s used</H2>
          <p className="text-sm text-muted-foreground">
            Every list in the app is this pattern. Open each to compare — they share the same grid
            and the same availability column.
          </p>
          <div className="overflow-hidden rounded-xl border">
            {USAGES.map((u, i) => (
              <div key={u.name} className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 ${i > 0 ? "border-t" : ""}`}>
                <div className="min-w-0 flex-1">
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
