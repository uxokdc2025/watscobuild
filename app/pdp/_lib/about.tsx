"use client";

import * as React from "react";
import {
  BookOpen,
  Boxes,
  ClipboardList,
  Fan,
  FileText,
  Hammer,
  Minus,
  Package,
  Plus,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PointsBadge } from "@/components/ui/label-badges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  formatUSD,
  type PartRow,
  type PartsCatalog,
  type PartItem,
  type PdpDocument,
  type PdpProduct,
  type SpecGroup,
} from "./types";

/* ─────────────── Shared accordion header pattern ─────────────── *
 * Every accordion trigger on the PDP (top-level About sections, Documents
 * groups, Part List groups) uses these constants — update once and the
 * whole page follows. 16px title, icon on the left, primary blue when
 * the panel is open. */
const ACCORDION_TRIGGER =
  "items-center px-2 py-3 hover:no-underline data-[state=open]:text-primary [&_svg]:transition-colors data-[state=open]:[&_svg]:text-primary";
const ACCORDION_TITLE = "text-base font-semibold";
const ACCORDION_ICON = "size-4 shrink-0 text-muted-foreground";

function AccordionHeader({ icon: Icon, title, suffix }: { icon: LucideIcon; title: React.ReactNode; suffix?: React.ReactNode }) {
  return (
    <span className="flex items-center gap-4">
      <Icon className={ACCORDION_ICON} />
      <span className={ACCORDION_TITLE}>
        {title}
        {suffix ? <span className="ml-1 text-sm font-normal text-muted-foreground">{suffix}</span> : null}
      </span>
    </span>
  );
}

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

function Description({ product }: { product: PdpProduct }) {
  return (
    <div className="w-3/4">
      <p className="text-sm text-muted-foreground">{product.description.intro}</p>
      {product.description.bullets?.length ? (
        <ul className="mt-4 flex flex-col gap-1.5">
          {product.description.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-muted-foreground">
              <span aria-hidden className="text-primary">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {product.description.prop65 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          California residents: see{" "}
          <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
            Proposition 65 Warning
          </a>
        </p>
      ) : null}
    </div>
  );
}

function Specifications({ product }: { product: PdpProduct }) {
  return (
    <div>
      <div className="relative max-w-lg">
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
  );
}

/* ── Icon lookup — assigns a Lucide icon to a known category label. ── */
const DOC_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Accessory and Kit Data": Package,
  "Application Guide": BookOpen,
  Installation: Hammer,
  "Owner's Manual": BookOpen,
  "Product Data": FileText,
  "Warranty Card - Date Specific": ShieldCheck,
  Literature: FileText,
};

/* ── Documents tab — flat accordion (icon + title, no per-item box). ── */
function Documents({ documents }: { documents: PdpDocument[] }) {
  const [filter, setFilter] = React.useState("");
  const groups = React.useMemo(() => {
    const map = new Map<string, PdpDocument[]>();
    for (const d of documents) {
      const key = d.category ?? d.label;
      const matches =
        !filter ||
        d.label.toLowerCase().includes(filter.toLowerCase()) ||
        key.toLowerCase().includes(filter.toLowerCase());
      if (!matches) continue;
      map.set(key, [...(map.get(key) ?? []), d]);
    }
    return [...map.entries()];
  }, [documents, filter]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          aria-label="Filter documents"
          placeholder="Filter by name, family, or file type..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-11 w-full rounded-md border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>
      {groups.length === 0 ? (
        <p className="mt-4 rounded-md border px-4 py-3 text-sm text-muted-foreground">
          No documents match &ldquo;{filter}&rdquo;.
        </p>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={groups.map(([cat]) => cat)}
          className="mt-4 w-full"
        >
          {groups.map(([cat, docs]) => {
            const Icon = DOC_CATEGORY_ICONS[cat] ?? FileText;
            return (
              <AccordionItem key={cat} value={cat}>
                <AccordionTrigger className={ACCORDION_TRIGGER}>
                  <span className="flex items-center gap-4">
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span>
                      {cat}{" "}
                      <span className="font-normal text-muted-foreground">
                        ({docs.length})
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-10">
                  <ul className="flex flex-col divide-y">
                    {docs.map((d) => (
                      <li
                        key={d.label}
                        className="flex items-start gap-3 py-3 first:pt-0"
                      >
                        <span
                          aria-hidden
                          className="grid size-9 shrink-0 place-items-center rounded bg-red-600 text-[10px] font-bold text-white"
                        >
                          PDF
                        </span>
                        <div className="min-w-0 flex-1">
                          <a
                            href={d.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm font-medium text-primary underline-offset-4 hover:underline"
                          >
                            {d.label}
                          </a>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {d.category ?? d.label}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Share ${d.label}`}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Share2 className="size-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

/* ── Part List tab: matching-model radio → filter → grouped tables ── */
function PartRowSchema({ row }: { row: PartRow }) {
  const gated = !row.price && !row.name;
  return (
    <tr className="border-t">
      <td className="px-4 py-4 align-top">
        <p className="text-sm font-medium">{row.item}</p>
        {row.hasSupersedes ? (
          <button
            type="button"
            className="mt-1 rounded border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-accent"
          >
            View Supersedes
          </button>
        ) : null}
      </td>
      <td className="px-4 py-4 align-top">
        {row.name ? (
          <a href="#" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            {row.name}
          </a>
        ) : (
          <span className="text-sm font-medium">{row.category}</span>
        )}
        {row.name && row.category ? (
          <p className="mt-1 text-xs tracking-wide text-muted-foreground">{row.category}</p>
        ) : null}
      </td>
      <td className="px-4 py-4 align-top text-sm">
        {row.inventory?.state === "in-stock" ? (
          <>
            <p className="font-medium text-in-stock">IN STOCK</p>
            <p className="text-xs text-muted-foreground">{row.inventory.branch}</p>
          </>
        ) : row.inventory?.state === "available" ? (
          <>
            <p className="font-medium text-in-stock">AVAILABLE</p>
            <p className="text-xs text-muted-foreground">{row.inventory.note}</p>
          </>
        ) : (
          <>
            <p className="font-medium">Inventory</p>
            <p className="text-xs text-muted-foreground">Not Available Online</p>
          </>
        )}
      </td>
      <td className="px-4 py-4 text-center align-top text-sm">{row.qtyInUnit ?? 1}</td>
      <td className="px-4 py-4 align-top text-sm">
        {row.price != null ? (
          <>
            <p>
              <span className="font-bold">{formatUSD(row.price)}</span>{" "}
              <span className="text-xs text-muted-foreground">/ EACH</span>
            </p>
            {row.points ? (
              <p className="mt-1 text-xs font-medium text-in-stock">
                Earn {row.points} {row.points === 1 ? "point" : "points"}
              </p>
            ) : null}
          </>
        ) : (
          <div>
            <p className="font-semibold">What&rsquo;s the price?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                Contact
              </a>{" "}
              for pricing and availability
            </p>
          </div>
        )}
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor={`qty-${row.item}`}>
            Quantity for {row.item}
          </label>
          <input
            id={`qty-${row.item}`}
            defaultValue={1}
            disabled={gated || row.price == null}
            aria-label="Quantity"
            className="h-9 w-14 rounded-md border bg-background px-2 text-center text-sm disabled:bg-muted/30 disabled:text-muted-foreground"
          />
          <button
            type="button"
            disabled={gated || row.price == null}
            className="h-9 rounded-md bg-green-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground"
          >
            Add To Cart
          </button>
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <button
          type="button"
          disabled={gated || row.price == null}
          className="h-9 rounded-md border bg-muted/50 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:text-muted-foreground"
        >
          Save To List
        </button>
      </td>
    </tr>
  );
}

function PartList({ catalog }: { catalog: PartsCatalog }) {
  const [selectedModel, setSelectedModel] = React.useState(catalog.selectedModelId);
  const [filter, setFilter] = React.useState("");

  const filteredGroups = React.useMemo(() => {
    if (!filter.trim()) return catalog.groups;
    const f = filter.toLowerCase();
    return catalog.groups
      .map((g) => ({
        ...g,
        parts: g.parts.filter(
          (p) =>
            p.item.toLowerCase().includes(f) ||
            p.name?.toLowerCase().includes(f) ||
            p.category?.toLowerCase().includes(f),
        ),
      }))
      .filter((g) => g.parts.length > 0);
  }, [catalog.groups, filter]);

  const selected = catalog.models.find((m) => m.id === selectedModel) ?? catalog.models[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-bold tracking-tight">
          Matching Models ({catalog.models.length})
        </h3>
        <div className="mt-3 overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="w-10 px-4 py-2.5"></th>
                <th className="px-4 py-2.5 font-semibold">Model</th>
                <th className="px-4 py-2.5 font-semibold">Brand</th>
                <th className="px-4 py-2.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {catalog.models.map((m) => (
                <tr
                  key={m.id}
                  className="cursor-pointer border-t hover:bg-muted/30"
                  onClick={() => setSelectedModel(m.id)}
                >
                  <td className="px-4 py-3">
                    <input
                      type="radio"
                      name="matching-model"
                      value={m.id}
                      checked={selectedModel === m.id}
                      onChange={() => setSelectedModel(m.id)}
                      aria-label={`Select ${m.id}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{m.id}</td>
                  <td className="px-4 py-3">{m.brand}</td>
                  <td className="px-4 py-3">{m.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold tracking-tight">
          Selected Model: {selected.id}
        </h3>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Filter parts"
            placeholder="Filter by name or item number..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-11 w-full rounded-md border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <p className="rounded-md border px-4 py-3 text-sm text-muted-foreground">
          No parts match &ldquo;{filter}&rdquo;.
        </p>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={filteredGroups.map((g) => g.id)}
          className="w-full"
        >
          {filteredGroups.map((g) => {
            const Icon = PART_GROUP_ICONS[g.id] ?? Wrench;
            return (
            <AccordionItem key={g.id} value={g.id}>
              <AccordionTrigger className={ACCORDION_TRIGGER}>
                <span className="flex items-center gap-4">
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-base font-semibold">
                    {g.label}{" "}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {g.parts.length} {g.parts.length === 1 ? "part" : "parts"}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-sm">
                    <thead className="bg-background text-left">
                      <tr>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Item</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Name</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Inventory</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">Qty In Unit</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Price</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Buy</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Save</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.parts.map((row) => (
                        <PartRowSchema key={row.item + (row.name ?? "")} row={row} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

const PART_GROUP_ICONS: Record<string, LucideIcon> = {
  critical: Star,
  "fan-motor": Fan,
  casing: Boxes,
  compressor: Settings2,
  electrical: Zap,
  "coil-piping": Wrench,
  accessory: Package,
  instructions: ClipboardList,
};

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-md border px-6 py-5 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function AboutThisProduct({ product }: { product: PdpProduct }) {
  const hasDocs = Boolean(product.documents?.length);
  const hasSpecs = Boolean(product.productSpecs?.length);
  const hasParts = Boolean(product.partsCatalog?.groups?.length);
  // A bundle swaps the Part List / Where Used tabs for a Bundle Components tab.
  const isBundle = Boolean(product.bundleItems?.length);
  return (
    <section aria-label="About this product" className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">About This Product</h2>
      {/* Sections are top-level accordion panels — only one open at a time
          (collapsible), icon + title on each trigger, Description default-open. */}
      <Accordion type="single" collapsible defaultValue="info" className="w-full">
        <AccordionItem value="info">
          <AccordionTrigger className={ACCORDION_TRIGGER}>
            <AccordionHeader icon={FileText} title="Description" />
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-10">
            <Description product={product} />
          </AccordionContent>
        </AccordionItem>

        {hasSpecs ? (
          <AccordionItem value="specs">
            <AccordionTrigger className={ACCORDION_TRIGGER}>
              <AccordionHeader icon={ClipboardList} title="Specifications" />
            </AccordionTrigger>
            <AccordionContent className="pt-4 pl-10">
              <Specifications product={product} />
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {hasDocs ? (
          <AccordionItem value="docs">
            <AccordionTrigger className={ACCORDION_TRIGGER}>
              <AccordionHeader icon={BookOpen} title="Documents" />
            </AccordionTrigger>
            <AccordionContent className="pt-4 pl-10">
              <Documents documents={product.documents!} />
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {isBundle ? (
          <AccordionItem value="bundle">
            <AccordionTrigger className={ACCORDION_TRIGGER}>
              <AccordionHeader icon={Package} title="Bundle Components" />
            </AccordionTrigger>
            <AccordionContent className="pt-4 pl-10">
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
            </AccordionContent>
          </AccordionItem>
        ) : (
          <>
            <AccordionItem value="parts">
              <AccordionTrigger className={ACCORDION_TRIGGER}>
                <AccordionHeader icon={Wrench} title="Part List" />
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-10">
                {hasParts ? (
                  <PartList catalog={product.partsCatalog!} />
                ) : (
                  <EmptyState label="No models found." />
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="where">
              <AccordionTrigger className={ACCORDION_TRIGGER}>
                <AccordionHeader icon={Boxes} title="Where Used" />
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-10">
                <EmptyState label="No results found." />
              </AccordionContent>
            </AccordionItem>
          </>
        )}
      </Accordion>
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
                {s.points ? <PointsBadge points={s.points} /> : null}
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
            <div className="min-w-0">
              <a href="#" className={CARD_TITLE_CLS}>
                {s.title}
              </a>
              <p className={CARD_DESC_CLS}>
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

/* ── PRO Picks (matched components with price + Add to Cart) ──
   Same shell as Included In Bundle / Substitutes: heading above a
   `rounded-lg border bg-muted/30` list with border-t between rows. */
/** Mini quantity stepper + icon-only Add-to-Cart, grouped as one compact control. */
function QtyAdd() {
  const [qty, setQty] = React.useState(1);
  const step =
    "grid h-8 w-7 place-items-center text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div className="flex w-20 shrink-0 flex-col gap-3">
      <div className="inline-flex h-8 items-center justify-between rounded-md border" role="group" aria-label="Quantity">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity" className={cn(step, "rounded-l-md")}>
          <Minus className="size-3.5" />
        </button>
        <span aria-live="polite" className="text-sm font-medium tabular-nums">{qty}</span>
        <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity" className={cn(step, "rounded-r-md")}>
          <Plus className="size-3.5" />
        </button>
      </div>
      <Button size="sm" className="h-8 w-full px-2">
        <ShoppingCart className="size-4" />
        Add
      </Button>
    </div>
  );
}

// Shared title link — reserves 2 lines of height so 1-line titles align
// vertically with 2-line titles across cards in the same section (and across
// sections: Bundle / PRO Picks / AHRI Matchup all now share the same anchor).
const CARD_TITLE_CLS =
  "block text-sm font-semibold text-primary line-clamp-2 min-h-[2lh] leading-snug hover:underline";
// Shared "description" block below the title — tight leading so multi-line
// item/mfg or price/availability doesn't push the card taller than needed.
const CARD_DESC_CLS = "mt-1 text-xs text-muted-foreground leading-tight";

/** AHRI Matchup — mirrors the PRO Picks shape: H2 heading + single-row card,
 *  no wrapping "box within a box". Reference: ecmdi.com LIVO outdoor (matched
 *  LIVO indoor). Only renders when `product.ahri?.matchedProduct` is present. */
export function AhriMatchup({ product }: { product: PdpProduct }) {
  const match = product.ahri?.matchedProduct;
  if (!product.ahri || !match) return null;
  return (
    <section aria-label="AHRI Matchup" className="flex flex-col gap-3">
      <h2 className="text-lg font-bold tracking-tight">
        AHRI Matchup: {product.ahri.number}
      </h2>
      <div className="overflow-hidden rounded-lg border bg-muted/30">
        <div className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-4 py-4">
          <div className="size-14">
            <ProductThumb src={match.image} alt={match.title} />
          </div>
          <div className="min-w-0">
            <a href="#" className={CARD_TITLE_CLS}>
              {match.title}
            </a>
            <p className="mt-1 flex flex-wrap items-baseline gap-1.5 leading-tight">
              <span className="text-base font-bold">{formatUSD(match.price)}</span>
              {match.wasPrice != null ? (
                <span className="text-xs text-muted-foreground line-through">
                  {formatUSD(match.wasPrice)}
                </span>
              ) : null}
            </p>
            {match.availabilityNote ? (
              <p className={CARD_DESC_CLS}>{match.availabilityNote}</p>
            ) : null}
          </div>
          <QtyAdd />
        </div>
      </div>
    </section>
  );
}

/** PRO Picks — thumbnail-left rows (like Substitutes) + a grouped qty/cart control. */
export function ProPicks({ product }: { product: PdpProduct }) {
  if (!product.proPicks?.length) return null;
  return (
    <section aria-label="PRO Picks" className="flex flex-col gap-3">
      <h2 className="text-lg font-bold tracking-tight">PRO Picks</h2>
      <div className="overflow-hidden rounded-lg border bg-muted/30">
        {product.proPicks.map((p, i) => (
          <div
            key={p.id}
            className={`grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-4 py-4 ${i > 0 ? "border-t" : ""}`}
          >
            <div className="size-14">
              <ProductThumb src={p.image} alt={p.title} />
            </div>
            <div className="min-w-0">
              <a href="#" className={CARD_TITLE_CLS}>
                {p.title}
              </a>
              <p className="mt-1 flex flex-wrap items-baseline gap-1.5 leading-tight">
                <span className="text-base font-bold">{formatUSD(p.price)}</span>
                {p.wasPrice != null ? (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatUSD(p.wasPrice)}
                  </span>
                ) : null}
              </p>
              {p.availabilityNote ? (
                <p className={CARD_DESC_CLS}>{p.availabilityNote}</p>
              ) : null}
            </div>
            <QtyAdd />
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
      <h2 className="text-xl font-bold tracking-tight">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {product.recentlyViewed.map((it) => (
          <RvCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
