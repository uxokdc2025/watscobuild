"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { ProductCard, type ProductCardData } from "@/app/pdp/_lib/product-card";
import {
  MoreOptionsCard,
  type MoreOptionsCardVariant,
} from "@/components/ui/more-options-card";
import { Button } from "@/components/ui/button";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "anatomy", label: "Anatomy" },
  { id: "states", label: "States" },
  { id: "end-card", label: "End card" },
  { id: "guidance", label: "Guidance" },
  { id: "api", label: "API" },
  { id: "in-production", label: "In Production" },
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

/** The target page's real "Stocked At" scopes, ascending by count. */
const END_CARD_SCOPES = [
  { value: "your-branch", label: "Manchester, NH - Homans", count: 16 },
  { value: "nearby", label: "Nearby Branches", count: 96 },
  { value: "all", label: "All Branches", count: 348 },
] as const;

/** Live end-card demo — each link switches the "Stocked At" scope exactly as it
 *  does on the PLP. Selecting the widest scope leaves nothing wider to offer,
 *  which is precisely when the real grid drops the card. */
function EndCardDemo({ variant = "solid" }: { variant?: MoreOptionsCardVariant }) {
  const [scope, setScope] = React.useState<string>("your-branch");
  const current = END_CARD_SCOPES.find((s) => s.value === scope) ?? END_CARD_SCOPES[0];
  const wider = END_CARD_SCOPES.filter((s) => s.count > current.count);
  return (
    <div className="flex w-[247px] flex-col gap-3">
      <div className="flex-1">
        {wider.length ? (
          <MoreOptionsCard
            variant={variant}
            branchName={current.label}
            shownCount={current.count}
            scopes={wider.map((s) => ({
              label: s.label,
              count: s.count,
              onSelect: () => setScope(s.value),
            }))}
          />
        ) : (
          <div className="grid h-full min-h-40 place-items-center rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            All Branches selected — nothing wider to offer, so the grid drops the card.
          </div>
        )}
      </div>
      {scope === "your-branch" ? null : (
        <Button type="button" variant="secondary" size="sm" onClick={() => setScope("your-branch")}>
          Reset to branch scope
        </Button>
      )}
    </div>
  );
}

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

        {/* ── End card variant ── */}
        <section className="space-y-4">
          <H2 id="end-card">End card — &ldquo;Want more options?&rdquo;</H2>
          <p className="text-sm text-muted-foreground">
            The grid&rsquo;s end card: one extra tile after the final product on the last page, in a
            normal grid cell (same column rules, same width, same row height), offering the wider
            stock scopes instead of another product. Everything is centered: a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">MapPin</code> icon in a soft
            circle, the headline, the &ldquo;<span className="font-medium text-foreground">N</span>{" "}
            in stock at {"{branch}"}&rdquo; subline, then one stacked sub-tile per wider scope —
            fully clickable, with a large bold count, a small label and a trailing arrow. Every
            count comes from the page&rsquo;s{" "}
            <span className="font-medium text-foreground">Stocked At</span> facet, and each sub-tile
            switches that filter. Only scopes holding strictly more products are offered; when none
            do, the card is dropped. Click the sub-tiles below to switch scope.
          </p>
          <p className="text-sm text-muted-foreground">
            Two framings, one anatomy and one behaviour.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;outline&quot;</code>{" "}
            is the <span className="font-medium text-foreground">Nov 17 review treatment</span> and
            the one to reach for: a white card surface inside a{" "}
            <span className="font-medium text-foreground">thick grey outline</span> — 3px on the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">border-input</code> token, three
            times the product card&rsquo;s 1px edge — with the icon chip and sub-tiles on{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">muted</code> and the counts
            emphasised in <code className="rounded bg-muted px-1 py-0.5 text-xs">foreground</code>.
            No blue at all: no blue fill, no blue outline, no blue count. The thick neutral frame is
            the whole signal, so the tile sets itself apart from the products either side of it
            without shouting over the grid it closes.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;solid&quot;</code>{" "}
            is the original primary-blue tile, kept for the pages reviewed before Nov 17.
          </p>
          <PreviewCode
            previewClassName="items-stretch justify-center gap-6"
            code={`import { MoreOptionsCard } from "@/components/ui/more-options-card";

{/* Last tile in the results grid, after the final product on the last page.
    Counts come straight from the "Stocked At" facet, so the card and the
    facet rail can never disagree. */}
<li>
  {/* variant="outline" — Nov 17: white surface, thick grey outline, no blue. */}
  <MoreOptionsCard
    variant="outline"
    branchName="Manchester, NH - Homans"
    shownCount={16}
    scopes={[
      { label: "Nearby Branches", count: 96, onSelect: () => setStockLocation("nearby") },
      { label: "All Branches", count: 348, onSelect: () => setStockLocation("all") },
    ]}
  />
</li>

{/* The pre-Nov-17 framing — the filled primary-blue tile. */}
<MoreOptionsCard variant="solid" branchName="Manchester, NH - Homans" shownCount={16} scopes={scopes} />`}
          >
            <div className="w-[247px]">
              <ProductCard signedIn data={BASE} />
            </div>
            <EndCardDemo variant="outline" />
            <EndCardDemo />
          </PreviewCode>
          <PropsTable
            caption="MoreOptionsCard props"
            rows={[
              { name: "branchName", type: "string", description: "The selected Stocked At scope — the branch name in the default scope." },
              { name: "shownCount", type: "number", description: "How many products the grid is showing in that scope." },
              { name: "scopes", type: "MoreOptionsScope[]", description: "Wider scopes to offer, ascending by count: { label, count, onSelect }. Pass only scopes with MORE products; empty means drop the card." },
              { name: "variant", type: '"solid" | "outline"', description: 'Framing. "outline" (Nov 17) is a white surface in a thick 3px border-input grey outline, counts in foreground, no blue anywhere. "solid" (default) is the original primary-blue tile. Anatomy and behaviour are identical.' },
              { name: "className", type: "string?", description: "Cell-level overrides only — never a fixed height." },
            ]}
          />
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
              <>Close the grid with{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;MoreOptionsCard&gt;</code>{" "}
                and feed it the <strong>Stocked At</strong> counts the facet rail already shows.</>,
              <>Reach for{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;outline&quot;</code>{" "}
                on new work — the thick grey outline on white is the Nov 17 treatment, and it keeps
                the icon, the centered layout and the emphasised counts exactly as they were.</>,
              <><strong>Unit of measure is always ALL-CAPS</strong> — render it through{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">formatUom()</code> as{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">/ EACH</code> (leading slash + space, &quot;EA&quot;/&quot;Each&quot; → &quot;EACH&quot;). Never print a lowercase &quot;each&quot;.</>,
            ]}
            donts={[
              <>Hand-roll a second &ldquo;product card&rdquo; with copied classes — it drifts immediately.</>,
              <>Show price or the Add button in the signed-out state.</>,
              <>Set a fixed height on the card to force alignment; use a parent grid.</>,
              <>Style status as a bare colored <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;span&gt;</code> instead of <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Badge&gt;</code>.</>,
              <>Recolour a product card to make an end card, give the end card a second accent
                colour, or hand it counts the Stocked At facet does not show.</>,
              <>Put blue back on the outline end card — no blue fill, no blue edge, no blue count.
                The outline is a grey token (<code className="rounded bg-muted px-1 py-0.5 text-xs">border-input</code>),
                and a hand-picked grey or a thin 1px edge loses the signal that separates it from a
                product tile.</>,
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
              { label: "PLP — Search Results", href: "/search?q=blower%20motor&signedin=1" },
              { label: "PLP — End card, outline (Nov 17)", href: "/search?brand=homans&category=residential&signedin=1&rev=nov17" },
              { label: "PLP — End card, solid (Nov 10)", href: "/search?brand=homans&category=residential&signedin=1" },
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
