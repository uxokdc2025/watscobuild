"use client";

import * as React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Play, ChevronLeft, ChevronRight, Star, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ════════════════════════════════════════════════════════════════════════
   Shopware "Shopping Experiences" — Landing-page block EXAMPLES.
   One long page, one labelled section per block, using Shopware's EXACT block
   name and category tab as the heading (verified against Shopware 6.7.4.0,
   the live admin version). Each example is
   a realistic, full-width section built on our design-system tokens with the
   real imagery and copy from the built pages (East Coast Metal /home/ecmdi,
   Peirce /home/peirce, Residential jump /category/residential?v=jump) where it
   fits, and HVAC placeholder copy elsewhere.

   Shopware is the source of truth: where a built-page section differs from the
   real Shopware block, the block here is built to MATCH Shopware and the
   difference is called out in a "Differs from the built page" note.
   ════════════════════════════════════════════════════════════════════════ */

/* Single place for the Next.js raw-img lint opt-out (design prototype, static
   assets, no next/image optimisation wanted). */
function Img({ className, alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img loading="lazy" alt={alt} className={cn("max-w-full min-w-0", className)} {...props} />;
}

/* ── Real content pulled from the built pages ──────────────────────────── */
const E = "/figma-home/ecmdi";
const P = "/figma-home/peirce";
/* Promo banners are 1728×512. Shown whole (standard / a matching cover frame)
   so the baked-in type is not sliced off. */
const HERO_SLIDES = [
  { src: `${P}/hero/hero-1.jpg`, alt: "Peirce-Phelps October monthly special on Honeywell Home thermostats, through October 31, 2026" },
  { src: `${P}/hero/hero-2.jpg`, alt: "Quarterly special: Viessmann and Carrier boilers, now stocking through December 31, 2026" },
  { src: `${P}/hero/hero-3.jpg`, alt: "Peirce-Phelps Flash Claim — file warranty claims in minutes" },
  { src: `${P}/hero/hero-4.jpg`, alt: "Payne WeatherMaker by Carrier residential equipment" },
  { src: `${P}/hero/hero-5.jpg`, alt: "SimpleProposal, a free proposal builder for HVAC contractors" },
];

/* Text-free photos for cover frames (image grid, three-column cover, hero). */
const SCENE_PHOTOS = [
  { src: "/guide-images/furnace.jpg", alt: "Residential furnace and air handler in a mechanical room", pos: "object-center" },
  { src: "/guide-images/r454b.jpg", alt: "Outdoor air conditioner beside a house", pos: "object-[28%_center]" },
  { src: "/guide-images/sizing.jpg", alt: "Technician reviewing HVAC equipment", pos: "object-[72%_center]" },
];

const ECM_TOOLS = [
  { title: "HVAC Pro+™ Mobile App", image: `${E}/mobile-app.png`, desc: "Our mobile app provides access to product info and easy to use tools while on the go." },
  { title: "SimpleStock", image: `${E}/simple-stock.png`, desc: "Inventory and truck stock replenishment, right from your tablet or mobile phone." },
  { title: "Dockside Pickup", image: `${E}/dockside-pickup.png`, desc: "Skip the counter for quicker, more convenient contactless pickup." },
  { title: "Order Templates", image: `${E}/order-templates.png`, desc: "Save lists of commonly ordered products for easy reference when you need to reorder." },
];

const PEIRCE_SERVICES = [
  { title: "OnCall Air", image: `${P}/on-call-air.png`, desc: "HVAC sales software with AHRI match-ups, live inventory, dynamic pricing, and proposal builder.", cta: "Boost a Proposal" },
  { title: "Housecall Pro", image: `${P}/housecall-pro.png`, desc: "Top-rated field service software for trades with smart scheduling, online booking, and fast payments.", cta: "Run Your Business Better" },
  { title: "Amply", image: `${P}/amply.png`, desc: "LiDAR scans, ACCA load calculations, and AR visualization make design and Manual J fast and accurate.", cta: "Explore Amply" },
];

const PEIRCE_CATEGORIES = [
  { label: "Residential Equipment", image: `${P}/residential-hvac-equipment.png` },
  { label: "Commercial Equipment", image: `${P}/commercial-hvac-equipment.png` },
  { label: "Ductless & Mini Split Systems", image: `${P}/ductless-and-mini-split-systems.png` },
  { label: "Indoor Air Quality", image: `${P}/indoor-air-quality.png` },
];

const RESI_TILES = [
  { label: "Air Conditioners", image: "/category-tiles/air-conditioner-t.png" },
  { label: "Heat Pumps", image: "/category-tiles/heat-pump-t.png" },
  { label: "Gas Furnaces", image: "/category-tiles/gas-furnace-t.png" },
];

const PRODUCTS = [
  { mfg: "TradePro", name: "13.4 SEER2 Air Conditioner Condenser, 2.5 Ton", price: "$1,284.00", image: "/category-tiles/air-conditioner-t.png" },
  { mfg: "TradePro", name: "15 SEER2 Heat Pump, 3 Ton", price: "$1,540.00", image: "/category-tiles/heat-pump-t.png" },
  { mfg: "TradePro", name: "80% AFUE Gas Furnace, 60,000 BTU", price: "$892.00", image: "/category-tiles/gas-furnace-t.png" },
  { mfg: "TradePro", name: "Multi-Position Air Handler, 3 Ton", price: "$740.00", image: "/category-tiles/air-handler-t.png" },
  { mfg: "TradePro", name: "Cased Evaporator Coil, 2.5 Ton", price: "$410.00", image: "/category-tiles/evaporator-coil-t.png" },
  { mfg: "TradePro", name: "Packaged Gas/Electric Unit, 3 Ton", price: "$2,180.00", image: "/category-tiles/small-packaged-t.png" },
];

const LOREM =
  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.";

/* ── Section scaffolding ───────────────────────────────────────────────── */
function BlockSection({
  id,
  category,
  name,
  maps,
  differs,
  note,
  children,
}: {
  id: string;
  category: string;
  name: string;
  /** "Maps to" line — which built-page section this block corresponds to. */
  maps?: React.ReactNode;
  /** Discrepancy callout vs. the built page. */
  differs?: React.ReactNode;
  /** Neutral note, e.g. a Shopware data-mapping caveat. */
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="min-w-0 scroll-mt-24">
      <div className="mb-5 border-b pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{category}</p>
        <h3 id={`${id}-h`} className="mt-0.5 text-xl font-bold tracking-tight">
          {name}
        </h3>
        {maps ? (
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Maps to:</span> {maps}
          </p>
        ) : null}
        {differs ? (
          <p className="mt-2 rounded-md border-l-2 border-primary bg-muted/50 px-3 py-2 text-sm text-foreground">
            <span className="font-semibold">Differs from the built page:</span> {differs}
          </p>
        ) : null}
        {note ? <p className="mt-2 text-sm text-muted-foreground">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function CategoryHeading({ id, title, count, blurb }: { id: string; title: string; count: number; blurb: string }) {
  return (
    <div id={id} className="scroll-mt-24 border-b-2 border-foreground/80 pb-2">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <span className="text-sm text-muted-foreground">
          {count} {count === 1 ? "block" : "blocks"} · Shopware tab &ldquo;{title}&rdquo;
        </span>
      </div>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{blurb}</p>
    </div>
  );
}

/* ── Reusable example primitives ───────────────────────────────────────── */
function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h4 className={cn("text-2xl font-bold tracking-tight text-foreground", className)}>{children}</h4>;
}
function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm leading-relaxed text-muted-foreground", className)}>{children}</p>;
}

function Stars() {
  return (
    <span className="flex items-center gap-0.5 text-rating-star" aria-label="Rated 5 out of 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="size-3.5 fill-current" aria-hidden />
      ))}
    </span>
  );
}

function ProductBox({ p }: { p: (typeof PRODUCTS)[number] }) {
  return (
    <article className="flex h-full flex-col rounded-xl border bg-card p-3 text-left">
      <span className="grid aspect-square place-items-center overflow-hidden rounded-lg bg-muted">
        <Img src={p.image} className="max-h-[82%] max-w-[82%] object-contain" />
      </span>
      <span className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{p.mfg}</span>
      <span className="mt-0.5 line-clamp-2 text-sm font-semibold leading-tight text-foreground">{p.name}</span>
      <span className="mt-1.5">
        <Stars />
      </span>
      <span className="mt-1 text-base font-bold text-price">{p.price}</span>
      <span className="mt-1 text-xs text-in-stock">In stock</span>
      <div className="mt-auto pt-3">
        <Button size="sm" className="w-full">
          Add to Cart
        </Button>
      </div>
    </article>
  );
}

function SliderArrow({
  dir,
  label,
  disabled,
  onClick,
  className,
}: {
  dir: "prev" | "next";
  label: string;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn("shrink-0 rounded-full bg-background/95", className)}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className="size-5" />
    </Button>
  );
}

/* Shopware image-slider: one slide at a time, arrows outside from sm up
   (the 6.7.4.0 default), displayMode standard so the artwork is not
   cover-cropped. Dots sit under the frame — this page documents a dot pager;
   6.7.4.0's defaultConfig sets navigationDots to "none". Below sm the arrows
   join the dots so they don't cover a short 1728×512 banner. */
function ImageSlider({ images }: { images: { src: string; alt: string }[] }) {
  const [i, setI] = React.useState(0);
  const last = images.length - 1;
  const prev = () => setI((n) => Math.max(0, n - 1));
  const next = () => setI((n) => Math.min(last, n + 1));
  return (
    <div
      className="min-w-0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Image slider"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        }
      }}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <SliderArrow dir="prev" label="Previous slide" disabled={i === 0} onClick={prev} className="hidden sm:inline-flex" />
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-xl border bg-muted">
          <Img src={images[i].src} alt={images[i].alt} className="aspect-[1728/512] h-auto w-full object-contain" />
        </div>
        <SliderArrow dir="next" label="Next slide" disabled={i === last} onClick={next} className="hidden sm:inline-flex" />
      </div>
      {/* On a phone the arrows sit with the dots, under the artwork, so they
          don't cover the banner type. From sm up they flank the image
          (Shopware's outside default). */}
      <div className="mt-3 flex items-center justify-center gap-2" role="group" aria-label="Choose slide">
        <SliderArrow dir="prev" label="Previous slide" disabled={i === 0} onClick={prev} className="sm:hidden" />
        <div className="flex flex-wrap justify-center gap-1">
          {images.map((img, n) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Go to slide ${n + 1} of ${images.length}`}
              aria-current={n === i ? "true" : undefined}
              onClick={() => setI(n)}
              className="grid size-6 place-items-center rounded-full focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className={cn("h-2 rounded-full", n === i ? "w-6 bg-primary" : "w-2 bg-border")} />
            </button>
          ))}
        </div>
        <SliderArrow dir="next" label="Next slide" disabled={i === last} onClick={next} className="sm:hidden" />
      </div>
    </div>
  );
}

/* Shopware image-gallery defaults: thumbnails on the left (underneath on
   small screens), arrows inside, no dots, displayMode standard. */
function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [i, setI] = React.useState(0);
  const count = images.length;
  const go = (n: number) => setI(((n % count) + count) % count);
  return (
    <div className="grid min-w-0 items-start gap-3 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-4" role="region" aria-label="Image gallery">
      <div className="order-2 flex min-w-0 gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
        {images.map((img, n) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Show image ${n + 1} of ${count}`}
            aria-current={n === i ? "true" : undefined}
            className={cn(
              "size-16 shrink-0 overflow-hidden rounded-md border bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              n === i ? "border-primary ring-2 ring-primary" : "border-border",
            )}
          >
            <Img src={img.src} alt="" className="size-full object-contain" />
          </button>
        ))}
      </div>
      <div className="relative order-1 min-w-0 md:order-2">
        <div className="flex min-w-0 items-center justify-center overflow-hidden rounded-xl border bg-muted md:min-h-[340px]">
          <Img src={images[i].src} alt={images[i].alt} className="h-auto w-full object-contain" />
          <SliderArrow dir="prev" label="Previous image" onClick={() => go(i - 1)} className="absolute top-1/2 left-2 hidden -translate-y-1/2 md:inline-flex" />
          <SliderArrow dir="next" label="Next image" onClick={() => go(i + 1)} className="absolute top-1/2 right-2 hidden -translate-y-1/2 md:inline-flex" />
        </div>
        <div className="mt-2 flex justify-between md:hidden">
          <SliderArrow dir="prev" label="Previous image" onClick={() => go(i - 1)} />
          <SliderArrow dir="next" label="Next image" onClick={() => go(i + 1)} />
        </div>
      </div>
    </div>
  );
}

/* Shopware product-slider: outside arrows, no dots (nav: false), boxes at
   about the 300px default minimum. One box on a phone, two from sm, three
   from xl — where this column is wide enough for a 300px box. */
function ProductSlider({ products, label }: { products: typeof PRODUCTS; label: string }) {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const sync = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <div
      className="flex min-w-0 items-center gap-2 sm:gap-3"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          api?.scrollPrev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          api?.scrollNext();
        }
      }}
    >
      <SliderArrow dir="prev" label={`Previous ${label}`} disabled={!canPrev} onClick={() => api?.scrollPrev()} />
      <div ref={ref} className="min-w-0 flex-1 overflow-hidden">
        <ul className="-ml-3 flex items-stretch sm:-ml-4">
          {products.map((p) => (
            <li key={p.name} className="flex min-w-0 shrink-0 grow-0 basis-full pl-3 sm:basis-1/2 sm:pl-4 xl:basis-1/3">
              <div className="w-full">
                <ProductBox p={p} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <SliderArrow dir="next" label={`Next ${label}`} disabled={!canNext} onClick={() => api?.scrollNext()} />
    </div>
  );
}

/* Shopware cross-selling: one tab per group, each tab a product slider
   with outside arrows. */
function CrossSelling() {
  const groups = [
    { id: "also-bought", name: "Customers also bought", products: PRODUCTS },
    { id: "similar", name: "Similar products", products: [...PRODUCTS].reverse() },
  ];
  const [active, setActive] = React.useState(0);
  return (
    <div className="min-w-0">
      <div role="tablist" aria-label="Cross selling" className="flex min-w-0 gap-1 overflow-x-auto border-b">
        {groups.map((g, i) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            id={`cross-tab-${g.id}`}
            aria-selected={i === active}
            aria-controls={`cross-panel-${g.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const next = e.key === "ArrowRight" ? (i + 1) % groups.length : (i - 1 + groups.length) % groups.length;
              setActive(next);
              document.getElementById(`cross-tab-${groups[next].id}`)?.focus();
            }}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-semibold focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:px-4",
              i === active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {g.name}
          </button>
        ))}
      </div>
      {groups.map((g, i) => (
        <div
          key={g.id}
          role="tabpanel"
          id={`cross-panel-${g.id}`}
          aria-labelledby={`cross-tab-${g.id}`}
          hidden={i !== active}
          className="pt-4"
        >
          {i === active ? <ProductSlider products={g.products} label={g.name} /> : null}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   The page body
   ════════════════════════════════════════════════════════════════════════ */
export function Examples() {
  return (
    <div className="min-w-0 space-y-16">
      {/* Mapping summary — which Shopware block each real built-page section is */}
      <section aria-labelledby="map-h" className="rounded-xl border bg-muted/30 p-5">
        <h2 id="map-h" className="text-lg font-bold tracking-tight">
          How our built sections map to Shopware blocks
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The sections already live on <Link href="/home/ecmdi" className="text-primary hover:underline">/home/ecmdi</Link>,{" "}
          <Link href="/home/peirce" className="text-primary hover:underline">/home/peirce</Link> and{" "}
          <Link href="/category/residential?v=jump" className="text-primary hover:underline">/category/residential?v=jump</Link>,
          and the Shopware block each one corresponds to. Where the two differ, the block below is built to match Shopware.
        </p>
        <div className="mt-4 min-w-0 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-semibold">Built page</th>
                <th className="py-2 pr-4 font-semibold">Section</th>
                <th className="py-2 pr-4 font-semibold">Shopware block</th>
                <th className="py-2 font-semibold">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                ["/home/ecmdi", "“Premium Tools For Fast Ordering” — 4 icon cards", "Three columns, image/text cards", "Text & images", "#image-text-gallery"],
                ["/home/ecmdi", "“Check Out Our Blog” / “Grow Your Skillset”", "Two columns, boxed image & text", "Text & images", "#image-text"],
                ["/home/ecmdi", "“Brands We Trust” logo carousel", "Image slider", "Images", "#image-slider"],
                ["/home/ecmdi", "Partner / mission band", "Two columns, full-sized image & text", "Text & images", "#image-text-cover"],
                ["/home/peirce", "Hero carousel (8 slides)", "Image slider", "Images", "#image-slider"],
                ["/home/peirce", "“Our Services” — 6 cards with CTAs", "Three columns, image/text cards", "Text & images", "#image-text-gallery"],
                ["/home/peirce", "“Featured Categories” — 4-up tiles", "Four columns, boxed", "Images", "#image-four-column"],
                ["/home/peirce", "“Our Trusted Brands” logo carousel", "Image slider", "Images", "#image-slider"],
                ["/category/residential?v=jump", "“Shop by Category” — 5+4 tile grid", "Three columns, captioned images", "Text & images", "#image-text-row"],
                ["/category/residential?v=jump", "Large banner hero", "Hero image", "Text & images", "#text-on-image"],
                ["/category/residential?v=jump", "Buyer’s-guide content cards", "Three columns, image/text cards", "Text & images", "#image-text-gallery"],
                ["/category/residential?v=jump", "Top-sellers product rails", "Product slider", "Commerce", "#product-slider"],
              ].map((r, i) => (
                <tr key={i} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{r[0]}</td>
                  <td className="py-2 pr-4">{r[1]}</td>
                  <td className="py-2 pr-4">
                    <a href={r[4]} className="font-medium text-primary hover:underline">
                      {r[2]}
                    </a>
                  </td>
                  <td className="py-2 text-muted-foreground">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════════════ TEXT ══════════════ */}
      <CategoryHeading id="cat-text" title="Text" count={6} blurb="Rich-text blocks — one or more text editor slots, no media." />
      <div className="space-y-14">
        <BlockSection id="text" category="Text" name="Text">
          <Heading>HVAC Products You Need, When You Need Them</Heading>
          <Body className="mt-3 max-w-3xl">
            Our mission is to deliver the quality HVAC products you need, when you need them, and provide expert technical
            support. Our products, branches, and technical support combine to give you exceptional service before, during,
            and after the sale. This is our commitment to you.
          </Body>
        </BlockSection>

        <BlockSection id="text-hero" category="Text" name="Text banner">
          <div className="rounded-xl bg-muted/60 px-6 py-14 text-center">
            <Heading className="text-4xl">Serving the HVAC Industry Since 1954</Heading>
            <Body className="mx-auto mt-4 max-w-2xl text-base">
              HVAC equipment, supplies, parts, and tools from the most trusted manufacturers in heating and cooling.
            </Body>
          </div>
        </BlockSection>

        <BlockSection id="text-teaser" category="Text" name="Teaser text">
          <div className="text-center">
            <Heading className="text-3xl">Brands We Trust</Heading>
            <span aria-hidden className="mx-auto mt-3 block h-1 w-16 rounded bg-primary/40" />
            <Body className="mx-auto mt-4 max-w-2xl">
              We partner with the most trusted and highest-quality HVAC manufacturers in the heating and cooling industry
              so your customers can depend on the goods you install.
            </Body>
          </div>
        </BlockSection>

        <BlockSection id="text-teaser-section" category="Text" name="Two columns, teaser text">
          <div className="grid gap-10 md:grid-cols-2">
            {[
              { h: "Expert Technical Support", b: "Certified Technical Service Representatives help solve the problem at hand and keep you up to date on products." },
              { h: "In Stock at Your Branch", b: "Condensers, furnaces, coils, and complete systems, ready to pick up or ship from a branch near you." },
            ].map((c) => (
              <div key={c.h}>
                <Heading className="text-xl">{c.h}</Heading>
                <span aria-hidden className="mt-2 block h-0.5 w-10 rounded bg-primary/40" />
                <Body className="mt-3">{c.b}</Body>
              </div>
            ))}
          </div>
        </BlockSection>

        <BlockSection id="text-two-column" category="Text" name="Two columns, text">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <Heading className="text-xl">About East Coast Metal</Heading>
              <Body className="mt-3">
                We take HVAC equipment, supplies, parts, and tools seriously, and we know your customers depend on you for
                quality goods. {LOREM}
              </Body>
            </div>
            <div>
              <Heading className="text-xl">Grow Your Skillset</Heading>
              <Body className="mt-3">
                Attend one of our scheduled onsite training events or view our video library for technical training on
                your own time. {LOREM}
              </Body>
            </div>
          </div>
        </BlockSection>

        <BlockSection id="text-three-column" category="Text" name="Three columns, text">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["Quality Products", "The most trusted and highest-quality HVAC manufacturers, all in one place."],
              ["Local Branches", "Over 20 locations across the region with inventory ready today."],
              ["Pro Support", "A technical service team that knows the equipment you install."],
            ].map(([h, b]) => (
              <div key={h}>
                <Heading className="text-lg">{h}</Heading>
                <Body className="mt-2">{b}</Body>
              </div>
            ))}
          </div>
        </BlockSection>
      </div>

      {/* ══════════════ IMAGES ══════════════ */}
      <CategoryHeading id="cat-image" title="Images" count={11} blurb="Image-only blocks — single images, columns, grids, a slider, and a gallery." />
      <div className="space-y-14">
        <BlockSection id="image" category="Images" name="Image, boxed">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-xl border bg-muted">
              <Img src={HERO_SLIDES[0].src} alt={HERO_SLIDES[0].alt} className="aspect-[1728/512] h-auto w-full object-contain" />
            </div>
          </div>
        </BlockSection>

        <BlockSection id="image-cover" category="Images" name="Image, full-sized">
          <div className="overflow-hidden rounded-xl bg-muted">
            <Img src={HERO_SLIDES[1].src} alt={HERO_SLIDES[1].alt} className="aspect-[1728/512] h-auto w-full object-cover" />
          </div>
        </BlockSection>

        <BlockSection id="image-two-column" category="Images" name="Two columns, boxed">
          <div className="grid gap-6 sm:grid-cols-2">
            {PEIRCE_CATEGORIES.slice(0, 2).map((c) => (
              <span key={c.label} className="grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-muted">
                <Img src={c.image} className="max-h-[80%] max-w-[80%] object-contain" />
              </span>
            ))}
          </div>
        </BlockSection>

        <BlockSection id="image-three-column" category="Images" name="Three columns, boxed">
          <div className="grid gap-6 sm:grid-cols-3">
            {RESI_TILES.map((t) => (
              <span key={t.label} className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-muted">
                <Img src={t.image} className="max-h-[80%] max-w-[80%] object-contain" />
              </span>
            ))}
          </div>
        </BlockSection>

        <BlockSection id="image-three-cover" category="Images" name="Three columns, full-sized">
          <div className="grid min-w-0 grid-cols-1 gap-px overflow-hidden rounded-xl bg-border md:grid-cols-3">
            {SCENE_PHOTOS.map((p) => (
              <Img key={p.src} src={p.src} alt={p.alt} className={cn("aspect-[16/9] w-full object-cover", p.pos)} />
            ))}
          </div>
        </BlockSection>

        <BlockSection
          id="image-four-column"
          category="Images"
          name="Four columns, boxed"
          maps={<>Peirce <span className="font-medium text-foreground">“Featured Categories”</span> 4-up tiles.</>}
          differs="The built page prints a text label under each tile (captioned tiles). Shopware’s “Four columns, boxed” holds images only — so this example is image-only, as Shopware renders it."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PEIRCE_CATEGORIES.map((c) => (
              <span key={c.label} className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-muted">
                <Img src={c.image} className="max-h-[80%] max-w-[80%] object-contain" />
              </span>
            ))}
          </div>
        </BlockSection>

        <BlockSection id="image-bubble-row" category="Images" name="Three columns, rounded">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {ECM_TOOLS.slice(0, 3).map((t) => (
              <span key={t.title} className="grid size-24 place-items-center overflow-hidden rounded-full bg-muted sm:size-36">
                <Img src={t.image} className="max-h-[64%] max-w-[64%] object-contain" />
              </span>
            ))}
          </div>
        </BlockSection>

        <BlockSection id="image-highlight-row" category="Images" name="Three columns, boxed & background">
          <div className="grid gap-5 rounded-2xl bg-muted/60 p-6 sm:grid-cols-3">
            {RESI_TILES.map((t) => (
              <span key={t.label} className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-background">
                <Img src={t.image} className="max-h-[80%] max-w-[80%] object-contain" />
              </span>
            ))}
          </div>
        </BlockSection>

        <BlockSection id="image-simple-grid" category="Images" name="Image grid">
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:h-[28rem] sm:grid-cols-2 sm:grid-rows-2">
            <Img
              src={SCENE_PHOTOS[0].src}
              alt={SCENE_PHOTOS[0].alt}
              className={cn("aspect-[16/9] w-full rounded-xl object-cover sm:aspect-auto sm:h-full", SCENE_PHOTOS[0].pos)}
            />
            <Img
              src={SCENE_PHOTOS[1].src}
              alt={SCENE_PHOTOS[1].alt}
              className={cn(
                "aspect-[16/9] w-full rounded-xl object-cover sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:aspect-auto sm:h-full",
                SCENE_PHOTOS[1].pos,
              )}
            />
            <Img
              src={SCENE_PHOTOS[2].src}
              alt={SCENE_PHOTOS[2].alt}
              className={cn("aspect-[16/9] w-full rounded-xl object-cover sm:aspect-auto sm:h-full", SCENE_PHOTOS[2].pos)}
            />
          </div>
        </BlockSection>

        <BlockSection
          id="image-slider"
          category="Images"
          name="Image slider"
          maps={<>Both home hero carousels and the “Brands We Trust” / “Our Trusted Brands” logo carousels.</>}
          differs="The built hero is a tabbed carousel and the brand strips are a continuous, seamless marquee. Shopware’s “Image slider” is a paged slider with prev/next controls and a dot pager — shown here."
        >
          <ImageSlider images={HERO_SLIDES} />
        </BlockSection>

        <BlockSection id="image-gallery" category="Images" name="Image gallery">
          <ImageGallery images={HERO_SLIDES} />
        </BlockSection>
      </div>

      {/* ══════════════ TEXT & IMAGES ══════════════ */}
      <CategoryHeading id="cat-text-image" title="Text & images" count={7} blurb="Mixed blocks — images paired with text, captions, or an overlaid headline." />
      <div className="space-y-14">
        <BlockSection
          id="image-text"
          category="Text & images"
          name="Two columns, boxed image & text"
          maps={<>East Coast Metal “Check Out Our Blog” / “Grow Your Skillset”.</>}
          differs="The built page stacks the image above the text inside two card boxes. Shopware’s block is one row — a boxed image in one column, text (and a CTA) in the other — shown here."
        >
          <div className="grid items-center gap-8 md:grid-cols-2">
            <Img src={`${E}/a-cool-read-ecmd-blog.png`} className="w-full rounded-xl border object-cover" />
            <div>
              <Heading>Check Out Our Blog</Heading>
              <Body className="mt-3">
                Stay current on what matters to you with expert blog posts, HVAC industry news, tech tips, tutorials, and
                product troubleshooting. Be sure to check out our monthly Tech Tips series written by our Technical Service Team.
              </Body>
              <Button className="mt-5">Read Now</Button>
            </div>
          </div>
        </BlockSection>

        <BlockSection
          id="image-text-cover"
          category="Text & images"
          name="Two columns, full-sized image & text"
          maps={<>East Coast Metal partner / mission band.</>}
          differs="The built band is reversed out on the brand primary colour with a photo inset. Shopware’s block is a neutral full-bleed image column beside a text column — shown here."
        >
          <div className="grid items-stretch gap-0 overflow-hidden rounded-xl border md:grid-cols-2">
            <Img src={`${E}/hvac-products.png`} className="min-h-[260px] w-full object-cover" />
            <div className="flex flex-col justify-center bg-muted/40 p-8">
              <Heading>HVAC Products You Need, When You Need Them</Heading>
              <Body className="mt-3">
                Our products, branches, and technical support combine to give you exceptional service before, during, and
                after the sale.
              </Body>
              <Button className="mt-5 w-fit">Learn More</Button>
            </div>
          </div>
        </BlockSection>

        <BlockSection id="center-text" category="Text & images" name="Three columns, boxed images & text">
          <div className="grid items-center gap-8 md:grid-cols-3">
            <span className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-muted">
              <Img src={RESI_TILES[0].image} className="max-h-[80%] max-w-[80%] object-contain" />
            </span>
            <div className="text-center">
              <Heading className="text-xl">Complete Systems</Heading>
              <Body className="mt-3">Match a condenser, coil, and air handler the right way — every time.</Body>
            </div>
            <span className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-muted">
              <Img src={RESI_TILES[1].image} className="max-h-[80%] max-w-[80%] object-contain" />
            </span>
          </div>
        </BlockSection>

        <BlockSection
          id="image-text-row"
          category="Text & images"
          name="Three columns, captioned images"
          maps={<>Residential “Shop by Category” tiles and Peirce “Featured Categories” (captioned image tiles).</>}
          differs="The built grids run 5-up (Residential) and 4-up (Peirce). Shopware’s captioned-images block is a fixed three columns — shown here."
        >
          <div className="grid gap-8 md:grid-cols-3">
            {RESI_TILES.map((t) => (
              <div key={t.label}>
                <span className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-muted">
                  <Img src={t.image} className="max-h-[80%] max-w-[80%] object-contain" />
                </span>
                <p className="mt-3 text-center text-base font-semibold text-foreground">{t.label}</p>
              </div>
            ))}
          </div>
        </BlockSection>

        <BlockSection
          id="image-text-gallery"
          category="Text & images"
          name="Three columns, image/text cards"
          maps={<>Peirce “Our Services” cards, ECM “Premium Tools For Fast Ordering”, and the Residential buyer’s-guide cards.</>}
          differs="Peirce shows 6 cards (two rows of 3) and ECM shows 4 icon tiles. Shopware’s block is a single row of three image/text cards — shown here with the Peirce service cards."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {PEIRCE_SERVICES.map((s) => (
              <article key={s.title} className="flex flex-col overflow-hidden rounded-xl border bg-card">
                <Img src={s.image} alt="" className="aspect-[3/2] w-full object-cover object-top" />
                <div className="flex flex-1 flex-col p-5">
                  <Heading className="text-lg">{s.title}</Heading>
                  <Body className="mt-2 flex-1">{s.desc}</Body>
                  <Button variant="outline" size="sm" className="mt-4 w-fit text-foreground">
                    {s.cta}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </BlockSection>

        <BlockSection id="image-text-bubble" category="Text & images" name="Three columns, captioned & rounded">
          <div className="grid gap-8 md:grid-cols-3">
            {ECM_TOOLS.slice(0, 3).map((t) => (
              <div key={t.title} className="flex flex-col items-center text-center">
                <span className="grid size-28 place-items-center overflow-hidden rounded-full bg-muted">
                  <Img src={t.image} className="max-h-[62%] max-w-[62%] object-contain" />
                </span>
                <Heading className="mt-4 text-lg">{t.title}</Heading>
                <Body className="mt-2">{t.desc}</Body>
              </div>
            ))}
          </div>
        </BlockSection>

        <BlockSection
          id="text-on-image"
          category="Text & images"
          name="Hero image"
          maps={<>The Residential large banner hero (text + CTA over a background).</>}
          differs="The built banner is a light band with side lockups. Shopware’s “Hero image” overlays the headline, copy, and CTA directly on a full background image — shown here."
        >
          <div className="relative grid min-h-[320px] place-items-center overflow-hidden rounded-xl sm:min-h-[420px]">
            <Img src="/guide-images/r454b.jpg" alt="" className="absolute inset-0 size-full object-cover object-[32%_center]" />
            <div className="absolute inset-0 bg-black/55" aria-hidden />
            <div className="relative z-10 max-w-xl px-6 text-center text-white">
              <h4 className="text-3xl font-bold tracking-tight drop-shadow-md sm:text-4xl">Residential Equipment</h4>
              <p className="mx-auto mt-4 max-w-md text-sm text-white/90 sm:text-base">
                Condensers, furnaces, coils, and complete systems — in stock at your branch. Pick a category to start.
              </p>
              <Button variant="secondary" className="mt-6">
                Shop the Season
              </Button>
            </div>
          </div>
        </BlockSection>
      </div>

      {/* ══════════════ VIDEO ══════════════ */}
      <CategoryHeading id="cat-video" title="Video" count={2} blurb="An embedded video player slot — a YouTube or a Vimeo video." />
      <div className="space-y-14">
        {(
          [
            { id: "vimeo-video", name: "Vimeo video", brand: "vimeo" as const, label: "Vimeo" },
            { id: "youtube-video", name: "YouTube video", brand: "youtube" as const, label: "YouTube" },
          ]
        ).map((v, i) => (
          <BlockSection key={v.id} id={v.id} category="Video" name={v.name}>
            <div className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-xl border">
              <Img src={SCENE_PHOTOS[i % SCENE_PHOTOS.length].src} alt="" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-black/30" aria-hidden />
              <span
                className={cn(
                  "relative z-10 grid size-16 place-items-center rounded-2xl text-white shadow-lg",
                  v.brand === "youtube" ? "bg-[#ff0000]" : v.brand === "vimeo" ? "bg-[#1ab7ea]" : "bg-primary",
                )}
              >
                <Play className="size-8 translate-x-0.5 fill-current" aria-hidden />
              </span>
              <span className="absolute bottom-3 right-3 z-10 rounded bg-black/55 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                {v.label}
              </span>
            </div>
          </BlockSection>
        ))}
      </div>

      {/* ══════════════ COMMERCE ══════════════ */}
      <CategoryHeading
        id="cat-commerce"
        title="Commerce"
        count={5}
        blurb="Product-aware blocks. On a landing page these need a product or category mapped to them; the blocks offered in the landing-page picker are shown here with sample product data."
      />
      <div className="space-y-14">
        <BlockSection
          id="product-slider"
          category="Commerce"
          name="Product slider"
          maps={<>The Residential “Top Sellers” / “New Arrivals” product rails.</>}
          differs="The built rails use our storefront ProductCard (branch availability, rewards points, gated price). Shopware’s product slider renders product boxes — image, name, rating, price, Add to Cart — shown here."
        >
          <ProductSlider products={PRODUCTS} label="Product slider" />
        </BlockSection>

        <BlockSection id="product-three-column" category="Commerce" name="Three columns, product boxes">
          <div className="grid gap-6 sm:grid-cols-3">
            {PRODUCTS.slice(0, 3).map((p) => (
              <ProductBox key={p.name} p={p} />
            ))}
          </div>
        </BlockSection>

        <BlockSection id="cross-selling" category="Commerce" name="Cross Selling">
          <CrossSelling />
        </BlockSection>

        <BlockSection
          id="gallery-buybox"
          category="Commerce"
          name="Image gallery and buy box"
          note="A product-detail block by intent — a product gallery on the left, the buy box on the right. Offered in the landing-page picker, but needs a product mapped to it to render real data."
        >
          <div className="grid gap-8 rounded-xl border p-6 md:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
              <div className="flex gap-3 sm:flex-col">
                {PRODUCTS.slice(0, 3).map((p) => (
                  <span key={p.name} className="grid size-16 place-items-center overflow-hidden rounded-lg border bg-muted">
                    <Img src={p.image} className="max-h-[78%] max-w-[78%] object-contain" />
                  </span>
                ))}
              </div>
              <span className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-muted">
                <Img src={PRODUCTS[0].image} className="max-h-[82%] max-w-[82%] object-contain" />
              </span>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{PRODUCTS[0].mfg}</span>
              <h4 className="mt-1 text-xl font-bold tracking-tight text-foreground">{PRODUCTS[0].name}</h4>
              <div className="mt-2 flex items-center gap-2">
                <Stars />
                <span className="text-xs text-muted-foreground">(42 reviews)</span>
              </div>
              <p className="mt-4 text-3xl font-bold text-price">{PRODUCTS[0].price}</p>
              <p className="mt-1 text-sm text-in-stock">In stock at your branch</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="inline-flex h-10 items-center rounded-md border border-input px-3 text-sm">Qty 1</span>
                <Button className="flex-1">Add to Cart</Button>
              </div>
            </div>
          </div>
        </BlockSection>

        <BlockSection
          id="product-description-reviews"
          category="Commerce"
          name="Product description & reviews"
          note="A product-detail block by intent — the long product description and the customer reviews. Offered in the landing-page picker, but needs a product mapped to it to render real data."
        >
          <div className="rounded-xl border p-6">
            <h4 className="text-lg font-bold tracking-tight text-foreground">Description</h4>
            <Body className="mt-2 max-w-3xl">
              A high-efficiency residential condenser built for the R-454B transition. {LOREM}
            </Body>
            <div className="mt-6 border-t pt-5">
              <h4 className="text-lg font-bold tracking-tight text-foreground">Reviews</h4>
              <div className="mt-3 space-y-4">
                {[
                  { who: "Mike R.", text: "Easy install, quiet operation. Exactly what the spec sheet promised." },
                  { who: "Dana P.", text: "Shipped same-day from my branch. Would order again." },
                ].map((r) => (
                  <div key={r.who} className="rounded-lg bg-muted/40 p-4">
                    <div className="flex items-center gap-2">
                      <Stars />
                      <span className="text-sm font-semibold text-foreground">{r.who}</span>
                    </div>
                    <Body className="mt-1">{r.text}</Body>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BlockSection>
      </div>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <CategoryHeading
        id="cat-sidebar"
        title="Sidebar"
        count={1}
        blurb="Blocks for a layout’s sidebar section. Landing pages support sidebar sections, so Category navigation is offered; it renders inside a sidebar column."
      />
      <div className="space-y-14">
        <BlockSection
          id="category-navigation"
          category="Sidebar"
          name="Category navigation"
          note="Renders the shop category tree. Not gated to another page type in Shopware 6.7.4.0, so it is offered on landing pages — but only renders meaningfully inside a Sidebar section with a category mapped."
        >
          <div className="max-w-xs rounded-xl border p-4">
            <p className="mb-2 text-sm font-bold tracking-tight text-foreground">Categories</p>
            <ul className="text-sm">
              {["Air Conditioners", "Heat Pumps", "Gas Furnaces", "Air Handlers", "Evaporator Coils", "Parts & Accessories"].map((c, i) => (
                <li key={c}>
                  <span
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1.5",
                      i === 0 ? "bg-muted font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {c}
                    <ChevronDown className="size-4 opacity-50" aria-hidden />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </BlockSection>
      </div>

      {/* ══════════════ FORM ══════════════ */}
      <CategoryHeading id="cat-form" title="Form" count={1} blurb="A configurable form — contact, newsletter sign-up, or a custom form built in the admin." />
      <div className="space-y-14">
        <BlockSection id="form" category="Form" name="Form">
          <form className="max-w-xl rounded-xl border p-6">
            <h4 className="text-lg font-bold tracking-tight text-foreground">Contact Us</h4>
            <Body className="mt-1">Questions about an order or product? Send us a note and a rep will follow up.</Body>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-1 text-sm font-medium">
                Name
                <input type="text" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="Your name" />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Email
                <input type="email" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="you@company.com" />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Message
                <textarea rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="How can we help?" />
              </label>
              <Button type="button" className="w-fit">
                Send Message
              </Button>
            </div>
          </form>
        </BlockSection>
      </div>

      {/* ══════════════ HTML ══════════════ */}
      <CategoryHeading id="cat-html" title="HTML" count={1} blurb="A raw-HTML slot — the editor pastes custom markup, rendered as-is on the page." />
      <div className="space-y-14">
        <BlockSection
          id="html"
          category="HTML"
          name="HTML"
          note="The editor pastes custom markup into a code editor; the storefront renders it verbatim. A rendered example is shown below."
        >
          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-dashed p-5">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary font-bold">%</div>
              <div>
                <p className="font-semibold text-foreground">Spring Rebate Event</p>
                <p className="text-sm text-muted-foreground">Custom promo markup rendered by the HTML block.</p>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-foreground p-4 text-xs leading-relaxed text-background">
              <code>{`<div class="promo">
  <strong>Spring Rebate Event</strong>
  <p>Custom promo markup rendered by the HTML block.</p>
</div>`}</code>
            </pre>
          </div>
        </BlockSection>
      </div>

      {/* ══════════════ Not offered on landing pages ══════════════ */}
      <section aria-labelledby="unavailable-h" className="rounded-xl border bg-muted/30 p-5">
        <h2 id="unavailable-h" className="text-lg font-bold tracking-tight">
          Not offered on Landing pages
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Shopware ships these blocks too, but the Landing-page picker in Shopware 6.7.4.0 does not surface them —
          they are either <span className="font-mono text-xs">hidden</span> or gated by{" "}
          <span className="font-mono text-xs">allowedPageTypes</span> to another page type.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            ["Product listing", "Commerce", "Hidden from the picker everywhere; auto-added to category (product_list) pages only."],
            ["Product name & manufacturer logo", "Commerce", "allowedPageTypes: [product_detail] — product-detail pages only."],
            ["Product filter", "Sidebar", "allowedPageTypes: [product_list] — category/listing pages only."],
          ].map(([name, cat, why]) => (
            <li key={name} className="rounded-lg border bg-background p-3">
              <span className="font-semibold text-foreground">{name}</span>
              <span className="ml-2 text-xs uppercase tracking-wide text-muted-foreground">{cat}</span>
              <p className="mt-0.5 text-muted-foreground">{why}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
