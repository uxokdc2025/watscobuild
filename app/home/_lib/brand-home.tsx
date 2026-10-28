"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Tile, BrandTile } from "@/components/category-landing";

/* ════════════════════════════════════════════════════════════════════════
   Brand home — the Watsco Home-page Figma designs (ECM + Peirce) implemented
   on our chrome + design-system tokens. Section copy is the design's; the
   imagery is the design file's own exported assets (hero promo slides, category
   product photos, the designed service cards, and brand logos).
   ════════════════════════════════════════════════════════════════════════ */

type ImgLink = { alt: string; image: string; href: string; desc?: string; cta?: string };
/* A two-up "news" bento box: a coloured banner lockup on top, then a white
   body with a heading, paragraph(s) and its own CTA button. */
type TwoUpCard = { image: string; alt: string; title: string; body: string; cta: string; href: string };

export type HomeContent = {
  heroImages: string[];
  specials: string[];
  categoriesHeading: string;
  categories: Tile[];
  servicesHeading: string;
  servicesSub?: string;
  serviceCards: ImgLink[];
  serviceStyle?: "card" | "tile";
  twoUp?: TwoUpCard[];
  missionImage?: string;
  brandsHeading: string;
  brandsCopy: string;
  brandsCta: string;
  brandLogos?: BrandTile[];
  partner: { title: string; copy: string; cta?: string };
};

/* Hero carousel + our carousel tab-bar. The specials labels are the slide
   controls (active = primary); auto-rotates and the active tab follows. */
function HeroCarousel({ images, tabs }: { images: string[]; tabs: string[] }) {
  // Placeholder mode when no real slides are supplied: one clean panel per tab.
  const placeholder = images.length === 0;
  const n = placeholder ? tabs.length : images.length;
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);
  return (
    <section aria-label="Featured" aria-roledescription="carousel">
      {/* Hero and its tab-bar are one attached unit so the connection is obvious. */}
      <div className="relative aspect-[1728/540] w-full overflow-hidden rounded-t-xl border border-b-0 bg-muted">
        {placeholder
          ? tabs.map((label, idx) => (
              <div
                key={label}
                className={cn(
                  "absolute inset-0 grid place-items-center bg-gradient-to-br from-muted to-primary/10 transition-opacity duration-500",
                  idx === i ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Promo slide placeholder</p>
                  <p className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{label}</p>
                </div>
              </div>
            ))
          : images.map((src, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className={cn("absolute inset-0 size-full object-cover transition-opacity duration-500", idx === i ? "opacity-100" : "opacity-0")}
              />
            ))}
      </div>
      <div className="overflow-x-auto rounded-b-xl border [scrollbar-width:thin]">
        <div className="flex w-max min-w-full divide-x divide-border">
          {tabs.slice(0, n).map((t, idx) => (
            <button
              key={t + idx}
              type="button"
              onClick={() => setI(idx)}
              aria-current={idx === i}
              className={cn(
                "flex-1 whitespace-nowrap px-4 py-2.5 text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                idx === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Centered tile grid — bordered white tiles (no grey fill), label below. */
function CategoryGrid({ heading, tiles }: { heading: string; tiles: Tile[] }) {
  return (
    <section aria-label={heading}>
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">{heading}</h2>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-6">
        {tiles.map((t) => (
          <li key={t.label} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)]">
            <Link href={t.href} className="group block focus-visible:outline-none">
              <span className="grid aspect-square place-items-center overflow-hidden rounded-xl border bg-background p-4 transition group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt="" className="max-h-[86%] max-w-[86%] object-contain" loading="lazy" />
              </span>
              <span className="mt-2 block text-center text-sm font-medium leading-tight text-foreground group-hover:text-primary">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Centered service grid. "card" = the full designed marketing cards (Peirce);
   "tile" = a compact icon + title + link (ECM's small icon tiles). */
function ServiceGrid({ heading, sub, cards, style = "card" }: { heading: string; sub?: string; cards: ImgLink[]; style?: "card" | "tile" }) {
  return (
    <section aria-label={heading}>
      <h2 className="text-center text-2xl font-bold tracking-tight">{heading}</h2>
      {sub ? <p className="mt-1 text-center text-sm text-muted-foreground">{sub}</p> : null}
      <ul className="mt-6 flex flex-wrap justify-center gap-4">
        {cards.map((c) => (
          <li key={c.alt} className={cn("w-full", style === "tile" ? "sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]" : "sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]")}>
            {style === "tile" ? (
              <div className="group flex h-full flex-col items-center rounded-xl border bg-background p-6 text-center shadow-sm transition hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" className="size-16 shrink-0 rounded-lg object-contain" loading="lazy" />
                <span className="mt-4 block font-semibold leading-tight text-foreground">{c.alt}</span>
                {c.desc ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p> : null}
                <Button asChild variant="outline" size="sm" className="mt-4 text-foreground">
                  <Link href={c.href}>{c.cta ?? "Learn More"}</Link>
                </Button>
              </div>
            ) : (
              <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" className="w-full object-cover" loading="lazy" />
                <div className="flex flex-1 flex-col items-center p-6 text-center">
                  <h3 className="text-lg font-bold tracking-tight">{c.alt}</h3>
                  {c.desc ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p> : null}
                  <Button asChild className="mt-5">
                    <Link href={c.href}>{c.cta ?? "Learn More"}</Link>
                  </Button>
                </div>
              </article>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Seamless logo marquee — logos only, no cards, no gaps. The track holds the
   full set twice so a -50% translate loops with no visible seam; each logo is
   a fixed height with even horizontal spacing so the strip reads continuous. */
function LogoMarquee({ logos }: { logos: string[] }) {
  if (!logos.length) return null;
  return (
    <div className="overflow-hidden" aria-label="Brands we carry">
      <div className="flex w-max animate-logo-marquee items-center">
        {[...logos, ...logos].map((src, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={idx} src={src} alt="" className="h-12 w-auto shrink-0 px-8 object-contain sm:h-14" />
        ))}
      </div>
    </div>
  );
}

export function BrandHome({ brandKey }: { brandKey: string }) {
  const content = HOME_CONTENT[brandKey];
  if (!content) return null;
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:px-6">
      <HeroCarousel images={content.heroImages} tabs={content.specials} />

      <CategoryGrid heading={content.categoriesHeading} tiles={content.categories} />

      <ServiceGrid heading={content.servicesHeading} sub={content.servicesSub} cards={content.serviceCards} style={content.serviceStyle} />

      {content.twoUp ? (
        <ul className="flex flex-wrap justify-center gap-4">
          {content.twoUp.map((c) => (
            <li key={c.alt} className="flex w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
              <article className="flex w-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.alt} className="w-full object-cover" loading="lazy" />
                <div className="flex flex-1 flex-col items-center p-6 text-center">
                  <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  <Button asChild className="mt-5">
                    <Link href={c.href}>{c.cta}</Link>
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Trusted brands — light rule separator, centered, slow logo marquee */}
      <section aria-label={content.brandsHeading} className="border-t pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">{content.brandsHeading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.brandsCopy}</p>
        </div>
        <div className="mt-8">
          <LogoMarquee logos={(content.brandLogos ?? []).map((b) => b.logo!).filter(Boolean)} />
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="#">{content.brandsCta}</Link>
          </Button>
        </div>
      </section>

      {/* Partner / mission */}
      <section aria-label={content.partner.title} className="overflow-hidden rounded-xl bg-primary text-primary-foreground">
        <div className="grid items-center gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{content.partner.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85">{content.partner.copy}</p>
            {content.partner.cta ? (
              <Button asChild variant="outline" className="mt-5 rounded-full px-6 text-foreground">
                <Link href="#">{content.partner.cta}</Link>
              </Button>
            ) : null}
          </div>
          {content.missionImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.missionImage} alt="" className="hidden w-full rounded-lg object-cover md:block" loading="lazy" />
          ) : null}
        </div>
      </section>
    </div>
  );
}

/* ════════════════ Peirce-Phelps ════════════════ */
const P = "/figma-home/peirce";
export const PEIRCE_HOME: HomeContent = {
  heroImages: [
    `${P}/hero/hero-1.jpg`,
    `${P}/hero/hero-2.jpg`,
    `${P}/hero/hero-3.jpg`,
    `${P}/hero/hero-4.jpg`,
    `${P}/hero/hero-5.jpg`,
    `${P}/hero/hero-6.jpg`,
    `${P}/hero/hero-7.jpg`,
    `${P}/hero/hero-8.jpg`,
  ],
  specials: [
    "Monthly Special",
    "Quarterly Special",
    "Preseason",
    "FlashClaims",
    "WeatherMaker by Carrier",
    "SimpleProposal",
    "Mitsubishi Electric WR Systems",
    "100 Years",
  ],
  categoriesHeading: "Featured Categories",
  categories: [
    { label: "Residential Equipment", image: `${P}/residential-hvac-equipment.png`, href: "#" },
    { label: "Commercial Equipment", image: `${P}/commercial-hvac-equipment.png`, href: "#" },
    { label: "Ductless & Mini Split Systems", image: `${P}/ductless-and-mini-split-systems.png`, href: "#" },
    { label: "Indoor Air Quality", image: `${P}/indoor-air-quality.png`, href: "#" },
    { label: "Thermostat Controls & Zoning", image: `${P}/thermostat-controls-and-zoning.png`, href: "#" },
    { label: "Testing Equipment", image: `${P}/testing-equipment.png`, href: "#" },
    { label: "Parts", image: `${P}/parts.png`, href: "#" },
    { label: "Tools & Supplies", image: `${P}/tools-and-supplies.png`, href: "#" },
  ],
  servicesHeading: "Our Services",
  serviceCards: [
    { alt: "OnCall Air", image: `${P}/on-call-air.png`, href: "#", desc: "HVAC sales software with AHRI match-ups, live inventory, dynamic pricing, and proposal builder.", cta: "Boost a Proposal" },
    { alt: "Housecall Pro", image: `${P}/housecall-pro.png`, href: "#", desc: "Top-rated field service software for trades with smart scheduling, online booking, and fast payments.", cta: "Run Your Business Better" },
    { alt: "Amply", image: `${P}/amply.png`, href: "#", desc: "LiDAR scans, ACCA load calculations, and AR visualization make design and Manual J fast and accurate.", cta: "Explore Amply" },
    { alt: "Wingman", image: `${P}/wingman.png`, href: "#", desc: "Wingman in the HVAC Pro+ Mobile App for faster support and priority service.", cta: "See How It Works" },
    { alt: "AHRI System Builder", image: `${P}/ahri.png`, href: "#", desc: "Matched Systems made easy with real-time inventory and pricing.", cta: "Build a System" },
    { alt: "FlashClaim", image: `${P}/flashclaim.png`, href: "#", desc: "FlashClaim, contractors can take control—submit claims, receive approvals, and create replacement orders without the back-and-forth.", cta: "Start a Claim" },
  ],
  brandsHeading: "Our Trusted Brands",
  brandsCopy:
    "Peirce Phelps provides high quality HVAC/R equipment, parts, supplies, and tools to contractors at over 20 locations across Pennsylvania, New Jersey, and Delaware. With some of the most well-known brands in the HVAC/R industry, you're sure to find what you're looking for. Shop from the industry's most reliable brands and manufacturers.",
  brandsCta: "View Our Brands",
  brandLogos: [
    { label: "Carrier", logo: `${P}/carrier-logo.png` },
    { label: "Bryant", logo: `${P}/bryant-logo.png` },
    { label: "WeatherMaker by Carrier", logo: `${P}/weathermaker-by-carrier-logo.png` },
    { label: "Mitsubishi Electric", logo: `${P}/mitsubishi-logo.png` },
  ],
  partner: {
    title: "Partner with Peirce-Phelps",
    copy: "Peirce-Phelps only sells to HVAC trade professionals and service organizations within its geographic territory and not sell directly to homeowners. Some HVAC manufacturer's equipment may be restricted without supplying a contractor's license and credit accounts & payment terms are subject to Credit Approval",
    cta: "Become a Peirce-Phelps Dealer",
  },
};

/* ════════════════ East Coast Metal ════════════════ */
const E = "/figma-home/ecmdi";
export const ECM_HOME: HomeContent = {
  heroImages: [],
  specials: ["Google Nest Savings", "Crocodile Cloth", "Pro Deals", "Ductless Solutions"],
  categoriesHeading: "Serving the HVAC Industry Since 1954",
  categories: [
    { label: "HVAC Equipment", image: `${E}/hvac-equipment.png`, href: "#" },
    { label: "Ductless & Mini-Splits", image: `${E}/ductless-mini-splits.png`, href: "#" },
    { label: "Ductwork", image: `${E}/ductwork.png`, href: "#" },
    { label: "Equipment Pads", image: `${E}/equipment-pads.png`, href: "#" },
    { label: "Motors", image: `${E}/motors.png`, href: "#" },
    { label: "HVAC Parts", image: `${E}/hvac-parts.png`, href: "#" },
    { label: "Tools", image: `${E}/tools.png`, href: "#" },
    { label: "Thermostats", image: `${E}/thermostats.png`, href: "#" },
    { label: "Indoor Air Quality", image: `${E}/indoor-air-quality.png`, href: "#" },
    { label: "Air Distribution", image: `${E}/air-distribution.png`, href: "#" },
    { label: "Supplies", image: `${E}/supplies.png`, href: "#" },
    { label: "Smart Home", image: `${E}/smart-home.png`, href: "#" },
  ],
  servicesHeading: "Premium Tools For Fast Ordering",
  servicesSub: "These tools are designed to make your ordering process faster, simpler, and better organized.",
  serviceStyle: "tile",
  serviceCards: [
    { alt: "HVAC Pro+™ Mobile App", image: `${E}/mobile-app.png`, href: "#", desc: "Our mobile app provides access to product info and easy to use tools while on the go.", cta: "Learn More" },
    { alt: "SimpleStock", image: `${E}/simple-stock.png`, href: "#", desc: "Inventory and truck stock replenishment, right from your tablet or mobile phone.", cta: "Learn More" },
    { alt: "Dockside Pickup", image: `${E}/dockside-pickup.png`, href: "#", desc: "Skip the counter for quicker, more convenient contactless pickup.", cta: "Learn More" },
    { alt: "Order Templates", image: `${E}/order-templates.png`, href: "#", desc: "Save lists of commonly ordered products for easy reference when you need to reorder.", cta: "Learn More" },
  ],
  twoUp: [
    {
      alt: "A Cool Read — the ECM blog",
      image: `${E}/a-cool-read-ecmd-blog.png`,
      href: "#",
      title: "Check Out Our Blog",
      body: "Catch up with us. Stay current on what matters to you with expert blog posts, HVAC industry news, tech tips, tutorials, product troubleshooting tips, and more! Be sure to check out our monthly series of Tech Tips blog posts written by members of our Technical Service Team.",
      cta: "Read Now",
    },
    {
      alt: "PRO Training",
      image: `${E}/pro-training.png`,
      href: "#",
      title: "Grow Your Skillset",
      body: "We're here to help. We have certified Technical Service Representatives available to help solve the problem at hand, keep you up-to-date on products, and offer helpful troubleshooting tips. Attend one of our scheduled onsite training events or view our video library for technical training on your own time.",
      cta: "Start Learning",
    },
  ],
  missionImage: `${E}/hvac-products.png`,
  brandsHeading: "Brands We Trust",
  brandsCopy:
    "We take HVAC equipment, supplies, parts, and tools seriously, and we know your customers depend on you for quality goods. That's why we partner with the most trusted and highest quality HVAC manufacturers in the heating and cooling industry to offer you quality equipment, supplies, parts, and tools.",
  brandsCta: "Shop By Brand",
  // The 25 manufacturer logos from ecmdi.com, scrolled as one seamless strip.
  brandLogos: Array.from({ length: 25 }, (_, i) => ({
    label: `Brand ${i + 1}`,
    logo: `${E}/brands/brand-${String(i + 1).padStart(2, "0")}.png`,
  })),
  partner: {
    title: "HVAC Products You Need, When You Need Them",
    copy: "Our mission is to deliver the quality HVAC products you need, when you need them, and provide expert technical support. Our products, branches, and technical support combine to give you exceptional service before, during, and after the sale. This is our commitment to you. We are dedicated to fulfilling this commitment every single day. We are confident in our team and our products, and we're proud to have the opportunity to serve you.",
  },
};

export const HOME_CONTENT: Record<string, HomeContent> = {
  peirce: PEIRCE_HOME,
  ecmdi: ECM_HOME,
};
