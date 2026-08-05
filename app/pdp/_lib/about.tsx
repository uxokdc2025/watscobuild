import { ChevronDown, FileText, Search, Share2, ShoppingCart } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatUSD,
  type PartItem,
  type PdpDocument,
  type PdpProduct,
  type SpecGroup,
} from "./types";

function ProductThumb({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="size-full rounded bg-white object-contain" />
    );
  }
  return (
    <div
      className="size-full rounded"
      style={{
        backgroundColor: "var(--muted)",
        backgroundImage:
          "repeating-linear-gradient(45deg, color-mix(in oklch, var(--muted-foreground) 12%, transparent) 0 6px, transparent 6px 12px)",
      }}
      aria-hidden
    />
  );
}

/* ── Product Info: Description (left) + Specifications (right) ── */
function SpecGroupTable({ group }: { group: SpecGroup }) {
  return (
    <div>
      <div className="bg-muted px-4 py-2.5 text-sm font-bold">{group.title}</div>
      <div>
        {group.rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-2 gap-4 border-b px-4 py-3 text-sm"
          >
            <span className="font-semibold">{r.label}</span>
            <span className="text-muted-foreground">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductInfo({ product }: { product: PdpProduct }) {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
      <div>
        <h3 className="text-lg font-bold">Description</h3>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          {product.description.intro}
        </p>
        {product.description.bullets?.length ? (
          <ul className="mt-3 flex flex-col gap-1.5">
            {product.description.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                <span aria-hidden className="text-primary">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {product.description.prop65 ? (
          <div className="mt-4 flex items-start gap-3 text-sm text-muted-foreground">
            <span className="grid shrink-0 place-items-center rounded border border-amber-500 px-1.5 py-1 text-[10px] leading-tight font-bold text-amber-600">
              PROP
              <br />
              65
            </span>
            <p>
              <span className="font-semibold text-foreground">Warning:</span> this
              product contains a chemical known to the State of California to cause
              cancer.{" "}
              <a
                href="https://www.p65warnings.ca.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                P65Warnings.ca.gov
              </a>
            </p>
          </div>
        ) : null}
      </div>
      <div>
        <h3 className="text-lg font-bold">Specifications</h3>
        <div className="relative mt-3">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Filter specifications"
            placeholder="Filter by name or value..."
            className="h-11 w-full rounded-md border bg-background pr-3 pl-9 text-sm outline-none"
          />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border">
          {(product.productSpecs ?? []).map((g) => (
            <SpecGroupTable key={g.title} group={g} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Documents tab: filter + collapsible groups ── */
function Documents({ documents }: { documents: PdpDocument[] }) {
  const groups = new Map<string, PdpDocument[]>();
  for (const d of documents) {
    const key = d.category ?? d.label;
    groups.set(key, [...(groups.get(key) ?? []), d]);
  }
  return (
    <div>
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          aria-label="Filter documents"
          placeholder="Filter by name, family, or file type..."
          className="h-11 w-full rounded-md border bg-background pr-3 pl-9 text-sm outline-none"
        />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {[...groups.entries()].map(([cat, docs]) => (
          <div key={cat} className="overflow-hidden rounded-md border">
            <div className="flex items-center justify-between gap-4 bg-muted px-4 py-2.5 text-sm font-semibold">
              <span>
                {cat} <span className="font-normal text-muted-foreground">({docs.length})</span>
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </div>
            <ul>
              {docs.map((d) => (
                <li
                  key={d.label}
                  className="flex items-center justify-between gap-4 border-t px-4 py-3"
                >
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    <FileText className="size-5 shrink-0" />
                    {d.label}
                  </a>
                  <button
                    type="button"
                    aria-label={`Share ${d.label}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Share2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-md border px-6 py-5 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function AboutThisProduct({ product }: { product: PdpProduct }) {
  const hasDocs = Boolean(product.documents?.length);
  // A bundle swaps the Part List / Where Used tabs for a Bundle Components tab.
  const isBundle = Boolean(product.bundleItems?.length);
  return (
    <section aria-label="About this product" className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">About This Product</h2>
      <Tabs defaultValue="info">
        <TabsList variant="line">
          <TabsTrigger value="info">Product Info</TabsTrigger>
          {hasDocs ? <TabsTrigger value="docs">Documents</TabsTrigger> : null}
          {isBundle ? (
            <TabsTrigger value="bundle">Bundle Components</TabsTrigger>
          ) : (
            <>
              <TabsTrigger value="parts">Part List</TabsTrigger>
              <TabsTrigger value="where">Where Used</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="info" className="pt-6">
          <ProductInfo product={product} />
        </TabsContent>
        {hasDocs ? (
          <TabsContent value="docs" className="pt-6">
            <Documents documents={product.documents!} />
          </TabsContent>
        ) : null}
        {isBundle ? (
          <TabsContent value="bundle" className="pt-6">
            <div className="overflow-hidden rounded-lg border">
              {product.bundleItems!.map((s, i) => (
                <div
                  key={s.id}
                  className={`grid grid-cols-[1.5rem_3.5rem_1fr] items-center gap-4 px-4 py-4 ${i > 0 ? "border-t" : ""}`}
                >
                  <span className="text-sm font-semibold text-muted-foreground">
                    1 &times;
                  </span>
                  <div className="size-14">
                    <ProductThumb src={s.image} alt={s.title} />
                  </div>
                  <div>
                    <a href="#" className="text-sm font-semibold text-primary hover:underline">
                      {s.title}
                    </a>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Item: {s.item} &nbsp; MFG: {s.mfg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ) : (
          <>
            <TabsContent value="parts" className="pt-6">
              <EmptyState label="No models found." />
            </TabsContent>
            <TabsContent value="where" className="pt-6">
              <EmptyState label="No results found." />
            </TabsContent>
          </>
        )}
      </Tabs>
    </section>
  );
}

/* ── Substitutes ── */
export function Substitutes({ product }: { product: PdpProduct }) {
  if (!product.substitutes?.length) return null;
  return (
    <section aria-label="Substitutes" className="flex flex-col gap-3">
      <h2 className="text-lg font-bold tracking-tight">
        Substitutes{" "}
        <span className="text-sm font-normal text-muted-foreground">
          — May not be covered by warranty.
        </span>
      </h2>
      <div className="overflow-hidden rounded-lg border bg-muted/30">
        {product.substitutes.map((s, i) => (
          <div
            key={s.id}
            className={`grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-4 py-4 ${i > 0 ? "border-t" : ""}`}
          >
            <div className="size-14">
              <ProductThumb src={s.image} alt={s.title} />
            </div>
            <div>
              <a href="#" className="text-sm font-semibold text-primary hover:underline">
                {s.title}
              </a>
              <p className="mt-1 text-xs text-muted-foreground">
                Item: {s.item} &nbsp; MFG: {s.mfg}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <div>
                {s.price != null ? (
                  <p className="text-sm">
                    <span className="font-bold">{formatUSD(s.price)}</span>{" "}
                    <span className="text-xs text-muted-foreground">/ EACH</span>
                  </p>
                ) : null}
                {s.points ? (
                  <p className="text-xs font-medium text-in-stock">Earn {s.points} points</p>
                ) : null}
              </div>
              <a
                href="#"
                className="rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                View Product
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Replacement Products (for a discontinued / superseded item) ── */
export function Replacements({ product }: { product: PdpProduct }) {
  if (!product.replacements?.length) return null;
  return (
    <section aria-label="Replacement products" className="flex flex-col gap-3">
      <h2 className="text-lg font-bold tracking-tight">Replacement Products</h2>
      <div className="overflow-hidden rounded-lg border bg-muted/30">
        {product.replacements.map((s, i) => (
          <div
            key={s.id}
            className={`grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-4 py-4 ${i > 0 ? "border-t" : ""}`}
          >
            <div className="size-14">
              <ProductThumb src={s.image} alt={s.title} />
            </div>
            <div>
              <a href="#" className="text-sm font-semibold text-primary hover:underline">
                {s.title}
              </a>
              <p className="mt-1 text-xs text-muted-foreground">
                Item: {s.item} &nbsp; MFG: {s.mfg}
              </p>
            </div>
            <a
              href="#"
              className="rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Bundle components ("Included In Bundle") ── */
export function BundleComponents({ product }: { product: PdpProduct }) {
  if (!product.bundleItems?.length) return null;
  return (
    <section aria-label="Included in bundle" className="flex flex-col gap-3">
      <h2 className="text-lg font-bold tracking-tight">Included In Bundle</h2>
      <div className="overflow-hidden rounded-lg border bg-muted/30">
        {product.bundleItems.map((s, i) => (
          <div
            key={s.id}
            className={`grid grid-cols-[1.5rem_3.5rem_1fr_auto] items-center gap-4 px-4 py-4 ${i > 0 ? "border-t" : ""}`}
          >
            <span className="text-sm font-semibold text-muted-foreground">1 &times;</span>
            <div className="size-14">
              <ProductThumb src={s.image} alt={s.title} />
            </div>
            <div>
              <a href="#" className="text-sm font-semibold text-primary hover:underline">
                {s.title}
              </a>
              <p className="mt-1 text-xs text-muted-foreground">
                Item: {s.item} &nbsp; MFG: {s.mfg}
              </p>
            </div>
            <a
              href="#"
              className="rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── PRO Picks (matched components with price + Add to Cart) ── */
export function ProPicks({ product }: { product: PdpProduct }) {
  if (!product.proPicks?.length) return null;
  return (
    <section aria-label="PRO Picks" className="rounded-lg border">
      <h2 className="border-b px-4 py-3 text-sm font-bold tracking-tight">PRO Picks</h2>
      <div>
        {product.proPicks.map((p, i) => (
          <div
            key={p.id}
            className={`flex flex-wrap items-center gap-3 px-4 py-4 ${i > 0 ? "border-t" : ""}`}
          >
            <span className="grid h-10 w-14 shrink-0 place-items-center rounded-md border text-sm tabular-nums">
              1
            </span>
            <div className="min-w-40 flex-1">
              <a href="#" className="text-sm font-semibold text-primary hover:underline">
                {p.title}
              </a>
              <p className="mt-1 flex flex-wrap items-baseline gap-1.5">
                <span className="text-base font-bold">{formatUSD(p.price)}</span>
                {p.wasPrice != null ? (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatUSD(p.wasPrice)}
                  </span>
                ) : null}
              </p>
              {p.availabilityNote ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{p.availabilityNote}</p>
              ) : null}
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <ShoppingCart className="size-4" />
              Add to Cart
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Recently Viewed ── */
function RvCard({ item }: { item: PartItem }) {
  return (
    <div className="w-56 shrink-0 rounded-lg border p-4">
      <div className="aspect-square w-full">
        <ProductThumb src={item.image} alt={item.title} />
      </div>
      <a href="#" className="mt-3 line-clamp-3 block text-sm font-semibold text-primary hover:underline">
        {item.title}
      </a>
      <p className="mt-1 text-xs text-muted-foreground">
        Item: {item.item}
        <br />
        MFG: {item.mfg}
      </p>
    </div>
  );
}

export function RecentlyViewed({ product }: { product: PdpProduct }) {
  if (!product.recentlyViewed?.length) return null;
  return (
    <section aria-label="Recently viewed" className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {product.recentlyViewed.map((it) => (
          <RvCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
