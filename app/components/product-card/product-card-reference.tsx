"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { ProductCard, type ProductCardData } from "@/app/pdp/_lib/product-card";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "anatomy", label: "Anatomy" },
  { id: "states", label: "States" },
  { id: "guidance", label: "Guidance" },
  { id: "api", label: "API" },
  { id: "in-production", label: "In production" },
];

/** The canonical worst-case card. Every slot is populated so the anatomy is
 *  visible at a glance; empty variants still reserve the same height. */
const BASE: ProductCardData = {
  id: "ht4040-4",
  brand: "DiversiTech®",
  title: 'DiversiTech®- HT4040-4 Hurricane T Class Concrete Equipment Pad™ 40" x 40" x 4"',
  item: "EP-40X40X4-T",
  mfg: "HT4040-4",
  image: "/uc-tabs-accordions/ht4040-4.avif",
  price: 193.2,
  points: 3,
  yourBranchQty: 2,
  branchName: "Miami",
  nearbyBranchQty: 123,
  badges: [
    { label: "PRO Essentials", tone: "outline-color", color: "red" },
    { label: "Substitute", tone: "outline-color", color: "blue" },
  ],
};

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

const ANATOMY: { part: string; detail: string }[] = [
  { part: "Image", detail: "Square, object-contain. Real Scene7 product photo; hatched fallback when missing." },
  { part: "Brand", detail: "Muted 12px line above the title (DiversiTech®, Carrier, …)." },
  { part: "Title", detail: "Primary-blue link, 3-line clamp. Reserves 3 lines so every card in a row aligns." },
  { part: "Item / MFG", detail: "Stacked muted labels with foreground values — matches the PDP summary." },
  { part: "Badges", detail: "PRO Essentials / Substitute / merchandising chips. Use <Badge>, never a hand-styled span." },
  { part: "Stock", detail: "Green “N in {branch}” + blue “N Nearby Branch” link. Signed-in only." },
  { part: "Price + / EACH", detail: "Bold foreground price, muted “/ EACH” suffix, optional was-price strike. Gated to signed-in." },
  { part: "Qty + Add", detail: "Inline stepper + primary Add. Collapses to “Sign in to view pricing” when signed out." },
  { part: "Save", detail: "Muted icon + label link below the Add row." },
];

export default function ProductCardReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Product Card</h1>
          <p className="max-w-2xl text-muted-foreground">
            The canonical merchandising card. One component renders every product tile — the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/search</code> PLP grid, Frequently
            Bought Together, and Customers Also Purchased. If you are about to write another
            &ldquo;product card&rdquo; anywhere, use this one instead so pricing, badges, and stock stay
            identical across the storefront.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ ProductCard }"} from &quot;@/app/pdp/_lib/product-card&quot;
            </code>
          </div>
        </header>

        {/* ── Usage ── */}
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <p className="text-sm text-muted-foreground">
            A signed-in card at its canonical 247px width — the richest state, with points, badges,
            branch stock, price, and the quantity + Add row. The preview renders the live component.
          </p>
          <PreviewCode
            previewClassName="justify-center"
            code={`<div className="w-[247px]">
  <ProductCard
    signedIn
    data={{
      id: "ht4040-4",
      brand: "DiversiTech®",
      title: 'DiversiTech®- HT4040-4 Hurricane T Class Concrete Equipment Pad™ 40" x 40" x 4"',
      item: "EP-40X40X4-T",
      mfg: "HT4040-4",
      image: "/uc-tabs-accordions/ht4040-4.avif",
      price: 193.2,
      points: 3,
      yourBranchQty: 2,
      branchName: "Miami",
      nearbyBranchQty: 123,
      badges: [
        { label: "PRO Essentials", tone: "outline-color", color: "red" },
        { label: "Substitute", tone: "outline-color", color: "blue" },
      ],
    }}
  />
</div>`}
          >
            <div className="w-[247px]">
              <ProductCard signedIn data={{ ...BASE, pct: 42 }} />
            </div>
          </PreviewCode>
        </section>

        {/* ── Anatomy ── */}
        <section className="space-y-4">
          <H2 id="anatomy">Anatomy</H2>
          <p className="text-sm text-muted-foreground">
            Nine slots, top to bottom. Every optional slot reserves its rendered height even when
            empty, so two cards in a row are always the same height regardless of which fields a SKU
            carries.
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
                <span className="w-32 shrink-0 text-sm font-medium">{a.part}</span>
                <span className="text-sm text-muted-foreground">{a.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── States ── */}
        <section className="space-y-4">
          <H2 id="states">States</H2>
          <p className="text-sm text-muted-foreground">
            Signed-in vs signed-out, and the same card with and without badges. Note how the cards
            keep an identical height across every state — the fixed-height slots do the work.
          </p>
          <PreviewCode
            previewClassName="items-stretch justify-center gap-6"
            code={`{/* Signed in — full commerce */}
<ProductCard signedIn data={product} />

{/* Signed out — price + Add collapse to a Sign-in link */}
<ProductCard signedIn={false} data={product} />

{/* No badges — badge slot still reserves its height */}
<ProductCard signedIn data={{ ...product, badges: undefined }} />`}
          >
            <div className="w-[247px]">
              <ProductCard signedIn data={BASE} />
            </div>
            <div className="w-[247px]">
              <ProductCard signedIn={false} data={BASE} />
            </div>
            <div className="w-[247px]">
              <ProductCard signedIn data={{ ...BASE, badges: undefined }} />
            </div>
          </PreviewCode>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Let the fixed-height slots align cards — wrap the card in a{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">w-[247px]</code> cell and a grid, never a per-card height.</>,
              <>Gate price, branch stock, and the Add row to signed-in via the{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">signedIn</code> prop.</>,
              <>Render every status/merchandising chip with{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Badge&gt;</code> through the{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">badges</code> data.</>,
              <>Reuse this one component for PLP, FBT, and Customers-Also-Purchased alike.</>,
            ]}
            donts={[
              <>Hand-roll a second &ldquo;product card&rdquo; with copied classes — it drifts immediately.</>,
              <>Show price or the Add button in the signed-out state.</>,
              <>Set a fixed height on the card to force alignment; use a parent grid.</>,
              <>Style status as a bare colored <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;span&gt;</code> instead of <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Badge&gt;</code>.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="ProductCard props"
            rows={[
              { name: "data", type: "ProductCardData", description: "The product to render (see fields below)." },
              { name: "signedIn", type: "boolean", description: "Gates price, branch stock, and the qty + Add row." },
            ]}
          />
          <PropsTable
            caption="ProductCardData"
            rows={[
              { name: "title", type: "string", description: "Required. 3-line clamped product title + title link." },
              { name: "item / mfg", type: "string", description: "Required. Watsco item # and manufacturer #." },
              { name: "brand", type: "string?", description: "Muted line above the title." },
              { name: "image", type: "string?", description: "Scene7 product image; hatched fallback when absent." },
              { name: "price / wasPrice", type: "number?", description: "Bold price + optional strike. Signed-in only." },
              { name: "points", type: "number?", description: "Loyalty PointsBadge pinned to the top." },
              { name: "badges", type: "PdpBadge[]?", description: "PRO Essentials / Substitute / merchandising chips." },
              { name: "yourBranchQty / branchName", type: "number / string", description: "Green “N in {branch}” stock line." },
              { name: "nearbyBranchQty", type: "number?", description: "Blue “N Nearby Branch” inventory link." },
              { name: "pct", type: "number?", description: "“N% Also Purchased” affinity line (CAP rows)." },
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where this component ships. Compare against the reference above.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "PLP — Search results", href: "/search?q=blower%20motor&signedin=1" },
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
