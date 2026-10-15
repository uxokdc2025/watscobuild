"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, BadgePercent, PlusCircle, Leaf, Snowflake, Layers, Gauge, Wind, Zap, Wrench, PackageCheck, type LucideIcon } from "lucide-react";

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
        <div className="grid items-center gap-6 py-6 pr-6 pl-10 sm:grid-cols-[1.3fr_1fr] sm:py-6 sm:pr-8 sm:pl-20 md:py-7 md:pr-10 md:pl-28">
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
          {/* Product sits in a large white circle — clean on the dark gradient. */}
          <div className="hidden items-center justify-center justify-self-center sm:flex">
            <span className="grid size-56 place-items-center overflow-hidden rounded-full bg-white shadow-2xl ring-4 ring-white/20 md:size-72 lg:size-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="max-h-[70%] max-w-[70%] object-contain" />
            </span>
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
      className="flex flex-col items-center justify-between gap-3 rounded-xl bg-[#003874] px-6 py-5 text-white shadow-sm sm:flex-row"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Truck className="size-5 text-white" aria-hidden />
          Free freight on equipment orders over {formatUSD(2500)}
        </span>
        <span className="inline-flex items-center gap-2 font-semibold">
          <BadgePercent className="size-5 text-white" aria-hidden />
          Earn Homans Rewards points on every order
        </span>
      </div>
      <Button asChild size="sm" className="shrink-0 bg-white text-[#003874] hover:bg-white/90">
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

/* ════════════════════════════════════════════════════════════════════════
   V2 — Autumn merchandised layout
   Hero → subcategories → Top-Rated → promo → carousel → promo → 2 carousels
   → promo → big end banner. Warm fall palette instead of all-blue.
   ════════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════════
   V2 — Fall merchandised layout on the Homans brand palette.
   Each of the 5 banner slots has its own distinct treatment; orange is an
   accent only, used sparingly. No two adjacent banners share a background or
   layout; the hero is the only full-bleed, bold banner.
   ════════════════════════════════════════════════════════════════════════ */

const NAVY = "#003874";

type HeroSlide = {
  theme: "navy" | "lightblue" | "white";
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
  cta: string;
  href: string;
  image: string;
};
const HERO_SLIDES: HeroSlide[] = [
  {
    theme: "navy",
    eyebrow: "Fall savings event",
    title: "Fall Into Savings",
    copy: "Stack manufacturer and utility rebates on R-454B air conditioners through October.",
    cta: "Shop the Event",
    href: "#v2-top-rated",
    image: "/category-tiles/air-conditioner-t.webp",
  },
  {
    theme: "lightblue",
    eyebrow: "In stock now",
    title: "The New R-454B Lineup",
    copy: "Next-generation, low-GWP systems from Armstrong Air and Bryant — ready to install.",
    cta: "See What's New",
    href: "#v2-new",
    image: "/category-tiles/heat-pump-t.webp",
  },
  {
    theme: "white",
    eyebrow: "Pro install",
    title: "Build a Complete System",
    copy: "Match a condenser, coil, and air handler — bundled, priced, and in stock together.",
    cta: "Build a System",
    href: "#v2-bundle",
    image: "/category-tiles/small-packaged-t.webp",
  },
];

function HeroCarousel() {
  const [i, setI] = React.useState(0);
  const n = HERO_SLIDES.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);
  React.useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n]);
  const s = HERO_SLIDES[i];
  const dark = s.theme === "navy";
  const bg = s.theme === "navy" ? NAVY : s.theme === "lightblue" ? "#E8F1FB" : "#ffffff";
  const textCls = dark ? "text-white" : "text-[#0b2e5e]";
  const subCls = dark ? "text-white/80" : "text-[#0b2e5e]/70";
  const ctrl = dark ? "bg-white/15 text-white hover:bg-white/25" : "bg-[#003874]/10 text-[#003874] hover:bg-[#003874]/20";
  return (
    <section aria-label="Featured promotions" aria-roledescription="carousel" className="relative">
      <div
        className={cn("relative overflow-hidden rounded-xl", s.theme === "white" && "border border-border")}
        style={{ backgroundColor: bg }}
      >
        {/* Content is held in a centered max-width band so the copy and the
            product sit close together (generous padding on wide screens). */}
        <div className={cn("relative mx-auto grid min-h-[300px] max-w-[68rem] items-center gap-6 px-6 py-8 sm:grid-cols-[1.2fr_1fr] sm:px-8 sm:py-10 md:min-h-[340px]", textCls)}>
          <div className="relative z-10 min-w-0">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase", dark ? "bg-white/15 text-white" : "bg-[#003874]/10 text-[#003874]")}>
              <Leaf className="size-3.5 text-orange-500" aria-hidden /> {s.eyebrow}
            </span>
            {/* thin autumn accent rule */}
            <span aria-hidden className="mt-4 block h-1 w-12 rounded-full bg-orange-500" />
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{s.title}</h2>
            <p className={cn("mt-3 max-w-md text-sm sm:text-base", subCls)}>{s.copy}</p>
            <Button asChild size="lg" variant="brand-yellow" className="mt-6">
              <Link href={s.href}>{s.cta}<ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          {/* Large product bleeds off the right of the content band. Never a circle. */}
          <div className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-1/2 items-center justify-end sm:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt="" className="h-[106%] max-w-none translate-x-[24%] object-contain object-right" />
          </div>
        </div>
        <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className={cn("absolute top-1/2 left-2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current", ctrl)}><ChevronLeft className="size-5" /></button>
        <button type="button" onClick={() => go(1)} aria-label="Next slide" className={cn("absolute top-1/2 right-2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current", ctrl)}><ChevronRight className="size-5" /></button>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button key={idx} type="button" onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} aria-current={idx === i} className={cn("h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", idx === i ? "w-6 bg-[#003874]" : "w-2 bg-border hover:bg-muted-foreground/50")} />
        ))}
      </div>
    </section>
  );
}

/* Subcategory chips — scrollable row directly under the hero. */
type SubCat = { label: string; count: number; Icon: LucideIcon };
const AC_SUBCATS: SubCat[] = [
  { label: "Single-Stage", count: 214, Icon: Snowflake },
  { label: "Two-Stage", count: 58, Icon: Layers },
  { label: "Variable-Speed", count: 31, Icon: Gauge },
  { label: "Packaged AC", count: 31, Icon: PackageCheck },
  { label: "High-Efficiency 16+ SEER2", count: 51, Icon: Zap },
  { label: "Ductless-Ready", count: 134, Icon: Wind },
  { label: "R-454B", count: 268, Icon: Leaf },
  { label: "Parts & Accessories", count: 78, Icon: Wrench },
];

function SubcategoryRow() {
  return (
    <section aria-label="Shop air conditioners by type">
      <h2 className="mb-3 text-xl font-bold tracking-tight">Shop by Type</h2>
      <ul className="flex snap-x gap-3 overflow-x-auto pt-1 pb-3 [scrollbar-width:thin]">
        {AC_SUBCATS.map((s) => (
          <li key={s.label} className="snap-start">
            <Link href="#v2-top-rated" className="group flex h-full w-44 shrink-0 items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3 transition hover:border-orange-300 hover:shadow-sm dark:border-amber-900/50 dark:from-amber-950/30 dark:to-orange-950/20">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-orange-600/10 text-orange-700 dark:text-orange-300">
                <s.Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold leading-tight text-foreground group-hover:text-orange-700 dark:group-hover:text-orange-300">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.count} products</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* A full-width autumn promo band between product rows. */
/* Slot 2 — "Fall Rebate Roundup": light treatment, the big number is the hero. */
function RebateBanner() {
  return (
    <section aria-label="Fall rebate roundup" className="overflow-hidden rounded-xl border border-border bg-[#FAFAF7]">
      <div className="mx-auto flex max-w-[68rem] flex-col items-center gap-6 px-6 py-6 sm:flex-row sm:gap-10 sm:px-8 sm:py-8">
        <div className="flex shrink-0 items-start gap-1 leading-none text-orange-600">
          <span className="mt-2 text-3xl font-bold sm:text-4xl">$</span>
          <span className="text-6xl font-extrabold tracking-tight sm:text-8xl">500</span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-orange-700 uppercase">
            <Leaf className="size-3.5" aria-hidden /> Limited-time rebate
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0b2e5e] sm:text-3xl">Fall Rebate Roundup</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Up to $500 in instant savings on qualifying high-efficiency systems — this month only. Stacks with utility rebates.
          </p>
        </div>
        <Button asChild size="lg" variant="brand-navy-outline" className="shrink-0">
          <Link href="#v2-new">Shop Rebates<ArrowRight className="size-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

/* Slot 3 — "Harvest the Bundle Savings": split card, 3-product lineup + copy. */
function BundleSplit() {
  const parts = [
    { label: "Condenser", image: "/category-tiles/air-conditioner-t.webp" },
    { label: "Evaporator Coil", image: "/category-tiles/evaporator-coil-t.webp" },
    { label: "Air Handler", image: "/category-tiles/air-handler-t.webp" },
  ];
  return (
    <section id="v2-bundle" aria-label="Harvest the bundle savings" className="overflow-hidden rounded-xl border border-border">
      <div className="grid md:grid-cols-2">
        {/* Left: 3-product lineup with + separators — images centered in equal
            boxes, no labels (the right-side copy names the components). */}
        <div className="flex items-center justify-center gap-3 bg-white p-6 sm:gap-5 sm:p-8">
          {parts.map((part, idx) => (
            <React.Fragment key={part.label}>
              <div className="grid h-28 flex-1 place-items-center sm:h-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={part.image} alt={part.label} className="max-h-full max-w-full object-contain" loading="lazy" />
              </div>
              {idx < parts.length - 1 ? (
                <span aria-hidden className="shrink-0 text-2xl font-light text-[#003874]/40">+</span>
              ) : null}
            </React.Fragment>
          ))}
        </div>
        {/* Right: copy on light brand blue */}
        <div className="flex flex-col justify-center p-6 sm:p-8" style={{ backgroundColor: "#E8F1FB" }}>
          <Badge variant="soft" color="green" className="w-fit">Save {formatUSD(431)}</Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0b2e5e]">Harvest the Bundle Savings</h2>
          <p className="mt-2 max-w-md text-sm text-[#0b2e5e]/70">
            A matched 3-ton R-454B system — condenser, cased coil, and air handler — bundled and in stock. One cart, one install-ready kit.
          </p>
          <Button asChild size="lg" variant="brand-navy" className="mt-5 w-fit">
            <Link href="#v2-top-rated">Build a System<ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* Slot 4 — "Beat the First Freeze": compact icy strip with a real branch chip. */
function FreezeStrip() {
  return (
    <section aria-label="Beat the first freeze" className="overflow-hidden rounded-xl border border-sky-200" style={{ backgroundColor: "#EAF4FB" }}>
      <div className="flex flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700">
            <Snowflake className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0b2e5e] sm:text-xl">Beat the First Freeze</h2>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-[#0b2e5e]/70">
              Get ahead of the cold with in-stock systems.
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                In stock at Wilmington #1248
              </span>
            </p>
          </div>
        </div>
        <Link href="#v2-top-rated" className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#003874] underline-offset-4 hover:underline">
          Shop In-Stock <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

/* Slot 5 — "Gear Up for Winter": charcoal rewards / system-builder, yellow accents. */
function RewardsBuilder() {
  return (
    <section aria-label="Gear up for winter" className="overflow-hidden rounded-2xl bg-[#121417] text-white">
      <div className="mx-auto grid max-w-[68rem] items-center gap-8 px-6 py-8 sm:grid-cols-[1.5fr_1fr] sm:px-8 sm:py-12">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold tracking-wide text-yellow-300 uppercase">
            Homans Rewards
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Gear Up for Winter</h2>
          <p className="mt-3 max-w-lg text-sm text-white/75 sm:text-base">
            Build a complete matched system, lock in fall pricing, and earn Rewards points on every component — install-ready before the first cold snap.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="brand-yellow">
              <Link href="#v2-bundle">Build My System<ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/dashboard?signedin=1">View My Rewards</Link>
            </Button>
          </div>
        </div>
        <div className="hidden justify-self-end sm:block">
          <div className="rounded-xl border border-white/15 bg-white/5 p-5 text-right">
            <p className="text-xs font-medium tracking-wide text-white/60 uppercase">Points on a full system</p>
            <p className="mt-1 text-4xl font-extrabold text-yellow-400">+6,800 pts</p>
            <p className="mt-1 text-xs text-white/50">Condenser + Coil + Air Handler</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoryLandingV2({ title = "Air Conditioners" }: { title?: string }) {
  const p = PRODUCTS;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 pb-4 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <Link href="/search?brand=homans&category=residential&signedin=1" className="text-primary hover:underline">Residential</Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <span>{title}</span>
      </nav>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>

      <div className="space-y-10">
        <HeroCarousel />
        <SubcategoryRow />
        <ProductRow id="v2-top-rated" title="Top-Rated Air Conditioners" subtitle="Highest-reviewed R-454B condensers in stock" products={p.slice(0, 5)} />
        <RebateBanner />
        <ProductRow id="v2-new" title="New R-454B Lineup" subtitle="The next-generation refrigerant, just landed" products={p.slice(10, 15)} />
        <BundleSplit />
        <ProductRow title="Single-Stage Value" subtitle="Reliable, efficient, budget-friendly" products={p.slice(5, 10)} />
        <ProductRow title="High-Efficiency Picks" subtitle="15 SEER2 and up" products={p.slice(2, 7)} />
        <FreezeStrip />
        <RewardsBuilder />
      </div>
    </div>
  );
}
