"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, BadgePercent, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/pdp/_lib/types";
import {
  ProductCard as CanonicalProductCard,
  type ProductCardData,
} from "@/app/pdp/_lib/product-card";
import { CATEGORY_RESULTS } from "@/app/search/_lib/category-data";
import type { SearchResult } from "@/app/search/_lib/mock-data";

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

/* ── Hero promo carousel ── */
type Slide = {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  href: string;
  image: string;
  from: string;
  to: string;
};
const SLIDES: Slide[] = [
  {
    eyebrow: "Limited-time rebate",
    title: "Beat the Heat. Save up to $400.",
    copy: "Instant rebates on select R-454B air conditioners — in stock and ready to install.",
    cta: "Shop Air Conditioners",
    href: "#top-rated",
    image: "/category-tiles/air-conditioner.webp",
    from: "#003874",
    to: "#0a63b8",
  },
  {
    eyebrow: "Now in stock",
    title: "The New R-454B Lineup",
    copy: "Next-generation, low-GWP refrigerant systems from Armstrong Air and Bryant.",
    cta: "See What's New",
    href: "#new-lineup",
    image: "/category-tiles/heat-pump.webp",
    from: "#0f766e",
    to: "#0ea5a0",
  },
  {
    eyebrow: "Pro install",
    title: "Build a Complete System",
    copy: "Match a condenser, coil, and air handler — bundled, priced, and in stock together.",
    cta: "Build a System",
    href: "#bundle",
    image: "/category-tiles/air-handler.webp",
    from: "#1e293b",
    to: "#334155",
  },
];

function PromoCarousel() {
  const [i, setI] = React.useState(0);
  const n = SLIDES.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);
  React.useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n]);
  const s = SLIDES[i];
  return (
    <section aria-label="Featured promotions" aria-roledescription="carousel" className="relative">
      <div
        className="relative overflow-hidden rounded-xl text-white shadow-sm"
        style={{ backgroundImage: `linear-gradient(110deg, ${s.from}, ${s.to})` }}
      >
        <div className="grid items-center gap-6 py-10 pr-6 pl-10 sm:grid-cols-[1.3fr_1fr] sm:py-12 sm:pr-8 sm:pl-20 md:py-14 md:pr-10 md:pl-28">
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              {s.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{s.title}</h2>
            <p className="mt-3 max-w-md text-sm text-white/85 sm:text-base">{s.copy}</p>
            <Button asChild size="lg" className="mt-6 bg-white text-slate-900 hover:bg-white/90">
              <Link href={s.href}>
                {s.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          {/* Transparent product floats large with a soft spotlight — no disc. */}
          <div className="relative hidden items-center justify-center justify-self-center sm:flex">
            <span
              aria-hidden
              className="absolute size-64 rounded-full bg-white/20 blur-3xl md:size-80"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt=""
              className="relative size-60 object-contain drop-shadow-2xl md:size-72 lg:size-80"
            />
          </div>
        </div>

        {/* Controls */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute top-1/2 left-2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === i}
            className={cn(
              "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              idx === i ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/50",
            )}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Product row ── */
function ProductRow({
  id,
  title,
  subtitle,
  products,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  products: SearchResult[];
}) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-24">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/search?brand=homans&category=residential&signedin=1">
            View All
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((p) => (
          <CanonicalProductCard key={p.id} data={toCard(p)} signedIn />
        ))}
      </div>
    </section>
  );
}

/* ── System bundle feature ── */
function BundleFeature() {
  const parts = [
    { label: "Condenser", image: "/category-tiles/air-conditioner.webp" },
    { label: "Evaporator Coil", image: "/category-tiles/evaporator-coil.webp" },
    { label: "Air Handler", image: "/category-tiles/air-handler.webp" },
  ];
  const bundle = 4299;
  const was = 4730;
  return (
    <section id="bundle" aria-label="Complete comfort system bundle" className="scroll-mt-24">
      <div className="overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] shadow-sm">
        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:p-8">
          <div className="flex flex-col justify-center">
            <Badge variant="soft" color="green" className="w-fit">Save {formatUSD(was - bundle)}</Badge>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Complete Comfort System</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A matched 3-ton R-454B system — condenser, cased evaporator coil, and air handler — bundled
              together and in stock at your branch. One add to cart, one install-ready kit.
            </p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatUSD(bundle)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatUSD(was)}</span>
              <span className="text-sm font-medium text-in-stock">/ system</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="lg">
                <PlusCircle className="size-4" />
                Add Bundle to Cart
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#top-rated">Customize System</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {parts.map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-2 rounded-lg border bg-background p-3 text-center">
                <span className="grid aspect-square w-full place-items-center rounded-md bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="max-h-full max-w-full object-contain p-2" loading="lazy" />
                </span>
                <span className="text-xs font-medium leading-snug">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Slim promo strip ── */
function PromoStrip() {
  return (
    <section
      aria-label="Shipping and rewards"
      className="flex flex-col items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/[0.05] px-6 py-4 sm:flex-row"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2 font-medium">
          <Truck className="size-5 text-primary" aria-hidden />
          Free freight on equipment orders over {formatUSD(2500)}
        </span>
        <span className="inline-flex items-center gap-2 font-medium">
          <BadgePercent className="size-5 text-primary" aria-hidden />
          Earn Homans Rewards points on every order
        </span>
      </div>
      <Button asChild variant="outline" size="sm" className="shrink-0">
        <Link href="/dashboard?signedin=1">View My Rewards</Link>
      </Button>
    </section>
  );
}

export function CategoryLanding({ title = "Air Conditioners" }: { title?: string }) {
  const p = PRODUCTS;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 pb-4 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <Link href="/search?brand=homans&category=residential&signedin=1" className="text-primary hover:underline">
          Residential
        </Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <span>{title}</span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>

      <div className="space-y-10">
        <PromoCarousel />
        <ProductRow id="top-rated" title="Top-Rated Air Conditioners" subtitle="Highest-reviewed R-454B condensers in stock" products={p.slice(0, 5)} />
        <ProductRow title="Single-Stage Value" subtitle="Reliable, efficient, budget-friendly" products={p.slice(5, 10)} />
        <BundleFeature />
        <ProductRow id="new-lineup" title="New R-454B Lineup" subtitle="The next-generation refrigerant, just landed" products={p.slice(10, 15)} />
        <ProductRow title="High-Efficiency Picks" subtitle="15 SEER and up" products={p.slice(2, 7)} />
        <PromoStrip />
        <ProductRow title="Armstrong Air" subtitle="Built to last, built for pros" products={p.filter((x) => x.brand.includes("Armstrong")).slice(0, 5)} />
        <ProductRow title="Bryant Legacy" subtitle="Dependable comfort, every season" products={p.filter((x) => x.brand.includes("Bryant")).slice(0, 5)} />
        <ProductRow title="Shop All Air Conditioners" subtitle={`${p.length} products`} products={p.slice(0, 5)} />
      </div>
    </div>
  );
}
