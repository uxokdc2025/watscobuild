"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  BookOpen,
  Leaf,
  Ruler,
  Truck,
  BadgePercent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ProductCard as CanonicalProductCard,
  type ProductCardData,
} from "@/app/pdp/_lib/product-card";
import { CATEGORY_RESULTS } from "@/app/search/_lib/category-data";
import { formatUSD } from "@/app/pdp/_lib/types";
import type { SearchResult } from "@/app/search/_lib/mock-data";

/* ════════════════════════════════════════════════════════════════════════
   Category "jump" page (Ryan's term) — the page a top-level category links to.
   The ONE job, per the client goal: do NOT drop the user into a product grid.
   Make them choose a subcategory first. So the page leads with a banner and a
   grid of visual category tiles (the "jump" targets), then light merchandising
   below — top sellers, buyer's guides, brands — never a filterable results grid.
   Modeled on walmart.com/cp/electronics and bakerdist product-lines.
   ════════════════════════════════════════════════════════════════════════ */

const NAVY = "#003874";
const PRODUCTS = CATEGORY_RESULTS.residential;

function toCard(r: SearchResult): ProductCardData {
  const inStock = r.stockStatus !== "out-of-stock";
  return {
    id: r.id,
    brand: r.brand,
    title: r.title,
    item: r.item,
    mfg: r.mfg,
    image: r.image,
    price: r.price ?? null,
    points: r.points,
    yourBranchQty: inStock ? 2 : 0,
    branchName: "Wilmington",
    nearbyBranchQty: r.allBranchesQty ?? 0,
    href: `/pdp/tradepro-${r.item.toLowerCase()}?signedin=1`,
  };
}

/* ── The jump targets: subcategory tiles (image + label + count). ── */
type Tile = { label: string; count: number; image: string; href: string };
const TILES: Tile[] = [
  { label: "Air Conditioners", count: 268, image: "/category-tiles/air-conditioner.webp", href: "/category/air-conditioners?signedin=1" },
  { label: "Heat Pumps", count: 192, image: "/category-tiles/heat-pump.webp", href: "/category/heat-pumps?signedin=1" },
  { label: "Gas Furnaces", count: 154, image: "/category-tiles/gas-furnace.webp", href: "/category/gas-furnaces?signedin=1" },
  { label: "Air Handlers", count: 131, image: "/category-tiles/air-handler.webp", href: "/category/air-handlers?signedin=1" },
  { label: "Evaporator Coils", count: 146, image: "/category-tiles/evaporator-coil.webp", href: "/category/evaporator-coils?signedin=1" },
  { label: "Ductless & Mini-Splits", count: 203, image: "/category-tiles/ductless.webp", href: "/category/ductless?signedin=1" },
  { label: "Packaged Units", count: 64, image: "/category-tiles/small-packaged.webp", href: "/category/packaged-units?signedin=1" },
  { label: "Oil Furnaces", count: 38, image: "/category-tiles/oil-furnace.webp", href: "/category/oil-furnaces?signedin=1" },
  { label: "Parts & Accessories", count: 512, image: "/category-tiles/accessories.webp", href: "/category/accessories?signedin=1" },
];

function CategoryBanner() {
  return (
    <section aria-label="Residential equipment" className="overflow-hidden rounded-xl" style={{ backgroundColor: NAVY }}>
      <div className="mx-auto grid min-h-[200px] max-w-[68rem] items-center gap-6 px-6 py-8 text-white sm:grid-cols-[1.4fr_1fr] sm:px-10 sm:py-10">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            <Leaf className="size-3.5 text-yellow-300" aria-hidden /> R-454B ready
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Residential Equipment</h1>
          <p className="mt-3 max-w-md text-sm text-white/85 sm:text-base">
            Condensers, furnaces, coils, and complete systems — in stock at your branch. Pick a category to start.
          </p>
        </div>
        <div className="hidden items-center justify-center justify-self-center sm:flex">
          <span className="grid size-48 place-items-center overflow-hidden rounded-full bg-white shadow-2xl ring-4 ring-white/20 md:size-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/category-tiles/air-conditioner.webp" alt="" className="max-h-[70%] max-w-[70%] object-contain" />
          </span>
        </div>
      </div>
    </section>
  );
}

/* The primary element: a grid of category tiles. Selecting one is the only way
   into a product grid — exactly the goal. */
function TileGrid() {
  return (
    <section aria-label="Shop by category">
      <h2 className="mb-1 text-xl font-bold tracking-tight">Shop by Category</h2>
      <p className="mb-4 text-sm text-muted-foreground">Choose a category to see products.</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TILES.map((t) => (
          <li key={t.label}>
            <Link
              href={t.href}
              className="group flex h-full items-center gap-4 rounded-xl border bg-background p-4 transition hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-border sm:size-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt="" className="max-h-[78%] max-w-[78%] object-contain" loading="lazy" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight text-foreground group-hover:text-primary sm:text-base">{t.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{t.count} products</span>
              </span>
              <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Merchandising — a horizontal rail of top sellers, NOT a filterable grid. */
function TopSellersRail() {
  const products = PRODUCTS.slice(0, 8);
  return (
    <section aria-label="Top sellers" className="scroll-mt-24">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Top Sellers in Residential</h2>
          <p className="text-sm text-muted-foreground">What pros are ordering this month</p>
        </div>
      </div>
      <ul className="flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {products.map((p) => (
          <li key={p.id} className="w-44 shrink-0 snap-start sm:w-52">
            <CanonicalProductCard data={toCard(p)} signedIn />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Buyer's guides / content cards — the "other content" Walmart shows below. */
type Guide = { title: string; copy: string; Icon: typeof BookOpen };
const GUIDES: Guide[] = [
  { title: "R-454B Transition Guide", copy: "What the low-GWP refrigerant change means for your next install.", Icon: Leaf },
  { title: "Sizing a Residential System", copy: "Match tonnage, coil, and air handler the right way, every time.", Icon: Ruler },
  { title: "Furnace Buying Guide", copy: "Gas vs. oil, efficiency ratings, and what to stock for winter.", Icon: BookOpen },
];

function BuyersGuides() {
  return (
    <section aria-label="Buyer's guides">
      <h2 className="mb-3 text-xl font-bold tracking-tight">Buyer&rsquo;s Guides</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {GUIDES.map((g) => (
          <li key={g.title}>
            <Link href="#" className="group flex h-full flex-col rounded-xl border bg-muted/30 p-5 transition hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <g.Icon className="size-5" aria-hidden />
              </span>
              <span className="mt-3 block font-semibold leading-tight text-foreground group-hover:text-primary">{g.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{g.copy}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read guide <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Brands you might love — chips, not a grid. */
const BRANDS = ["Bryant", "Armstrong Air", "Mitsubishi Electric", "Honeywell", "Aprilaire", "Copeland", "Rheem", "Fast-Stat"];

function BrandsRow() {
  return (
    <section aria-label="Brands you might love">
      <h2 className="mb-3 text-xl font-bold tracking-tight">Brands You Might Love</h2>
      <ul className="flex flex-wrap gap-3">
        {BRANDS.map((b) => (
          <li key={b}>
            <Link
              href="#"
              className="inline-flex items-center rounded-lg border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {b}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PromoStrip() {
  return (
    <section
      aria-label="Shipping and rewards"
      className="flex flex-col items-center justify-between gap-3 rounded-xl px-6 py-5 text-white shadow-sm sm:flex-row"
      style={{ backgroundColor: NAVY }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Truck className="size-5" aria-hidden /> Free freight on equipment orders over {formatUSD(2500)}
        </span>
        <span className="inline-flex items-center gap-2 font-semibold">
          <BadgePercent className="size-5" aria-hidden /> Earn Homans Rewards points on every order
        </span>
      </div>
      <Button asChild size="sm" className="shrink-0 bg-white text-[#003874] hover:bg-white/90">
        <Link href="/dashboard?signedin=1">View My Rewards</Link>
      </Button>
    </section>
  );
}

export function CategoryJump({ title = "Residential" }: { title?: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 pb-4 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <span>{title}</span>
      </nav>

      <div className="space-y-10">
        <CategoryBanner />
        <TileGrid />
        <TopSellersRail />
        <BuyersGuides />
        <BrandsRow />
        <PromoStrip />
      </div>
    </div>
  );
}
