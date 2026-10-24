"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Leaf, Truck, BadgePercent, BookOpen, Ruler } from "lucide-react";

import {
  LargeBanner,
  CategoryTileGrid,
  PromoTiles,
  BrandTiles,
  ContentCards,
  ProductRail,
  MiniBanner,
  type Tile,
  type PromoTile,
  type BrandTile,
  type ContentCard,
} from "@/components/category-landing";
import {
  ProductCard as CanonicalProductCard,
  type ProductCardData,
} from "@/app/pdp/_lib/product-card";
import { CATEGORY_RESULTS } from "@/app/search/_lib/category-data";
import type { SearchResult } from "@/app/search/_lib/mock-data";

/* ════════════════════════════════════════════════════════════════════════
   Category "jump" page (Ryan's term) — the page a top-level category links to.
   The client goal: do NOT drop the user into a product grid. Make them choose
   a subcategory first. Composed entirely from the reusable Category Landing
   CMS blocks (a bridge to the future CMS). Order, per the brief and the
   walmart.com /cp reference: content sections first (banner → shop by category
   → don't miss these → brands), THEN two product rails.
   ════════════════════════════════════════════════════════════════════════ */

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

const TILES: Tile[] = [
  { label: "Air Conditioners", image: "/category-tiles/air-conditioner-t.png", href: "/category/air-conditioners?signedin=1" },
  { label: "Heat Pumps", image: "/category-tiles/heat-pump-t.png", href: "/category/heat-pumps?signedin=1" },
  { label: "Gas Furnaces", image: "/category-tiles/gas-furnace-t.png", href: "/category/gas-furnaces?signedin=1" },
  { label: "Air Handlers", image: "/category-tiles/air-handler-t.png", href: "/category/air-handlers?signedin=1" },
  { label: "Evaporator Coils", image: "/category-tiles/evaporator-coil-t.png", href: "/category/evaporator-coils?signedin=1" },
  { label: "Ductless & Mini-Splits", image: "/category-tiles/ductless-t.png", href: "/category/ductless?signedin=1" },
  { label: "Packaged Units", image: "/category-tiles/small-packaged-t.png", href: "/category/packaged-units?signedin=1" },
  { label: "Oil Furnaces", image: "/category-tiles/oil-furnace-t.png", href: "/category/oil-furnaces?signedin=1" },
  { label: "Parts & Accessories", image: "/category-tiles/accessories-t.png", href: "/category/accessories?signedin=1" },
];

const PROMO_TILES: PromoTile[] = [
  { title: "Clearance & Scratch-Dent", caption: "Shop all clearance", href: "/search?brand=homans&category=residential&signedin=1", bg: "bg-primary", fg: "text-primary-foreground" },
  { image: "/category-tiles/heat-pump-t.png", caption: "Pro picks this month", href: "/search?brand=homans&category=residential&signedin=1" },
  { title: "In Stock Today", caption: "Ready at your branch", href: "/search?brand=homans&category=residential&signedin=1", bg: "bg-secondary", fg: "text-secondary-foreground" },
  { title: "Rebate Roundup", caption: "Save up to $500", href: "/search?brand=homans&category=residential&signedin=1", bg: "bg-foreground", fg: "text-background" },
];

const BRANDS: BrandTile[] = [
  { label: "Bryant" },
  { label: "Armstrong Air" },
  { label: "Mitsubishi" },
  { label: "Honeywell" },
  { label: "Aprilaire" },
  { label: "Copeland" },
];

const GUIDES: ContentCard[] = [
  { title: "R-454B Transition Guide", copy: "What the low-GWP refrigerant change means for your next install.", href: "#", icon: Leaf },
  { title: "Sizing a Residential System", copy: "Match tonnage, coil, and air handler the right way, every time.", href: "#", icon: Ruler },
  { title: "Furnace Buying Guide", copy: "Gas vs. oil, efficiency ratings, and what to stock for winter.", href: "#", icon: BookOpen },
];

export function CategoryJump({ title = "Residential" }: { title?: string }) {
  const rail1 = PRODUCTS.slice(0, 8);
  const rail2 = PRODUCTS.slice(8, 16);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 pb-4 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <span>{title}</span>
      </nav>
      <h1 className="sr-only">{title} Equipment</h1>

      <div className="space-y-10">
        {/* Content sections first */}
        <LargeBanner
          kicker="Now at Homans"
          title="Residential Equipment"
          copy="Condensers, furnaces, coils, and complete systems — in stock at your branch. Pick a category to start."
          cta={{ label: "Shop the season", href: "#top-sellers" }}
          image="/category-tiles/air-conditioner-t.png"
          lockup={<span className="text-lg font-bold tracking-tight text-foreground">R-454B<br />Ready</span>}
        />
        <CategoryTileGrid tiles={TILES} action={{ label: "See all", href: "/search?brand=homans&category=residential&signedin=1" }} />
        <PromoTiles tiles={PROMO_TILES} />
        <BrandTiles brands={BRANDS} />
        <ContentCards cards={GUIDES} />

        {/* Then two product rails (existing merchandising cards) */}
        <ProductRail id="top-sellers" heading="Top Sellers in Residential" subheading="What pros are ordering this month" cta={{ label: "View all", href: "/search?brand=homans&category=residential&signedin=1" }}>
          {rail1.map((p) => (
            <CanonicalProductCard key={p.id} data={toCard(p)} signedIn />
          ))}
        </ProductRail>
        <ProductRail heading="New R-454B Arrivals" subheading="The next-generation refrigerant, just landed" cta={{ label: "View all", href: "/search?brand=homans&category=residential&signedin=1" }}>
          {rail2.map((p) => (
            <CanonicalProductCard key={p.id} data={toCard(p)} signedIn />
          ))}
        </ProductRail>

        <MiniBanner
          items={[
            { icon: Truck, text: "Free freight on equipment orders over $2,500" },
            { icon: BadgePercent, text: "Earn Homans Rewards points on every order" },
          ]}
          cta={{ label: "View My Rewards", href: "/dashboard?signedin=1" }}
        />
      </div>
    </div>
  );
}
