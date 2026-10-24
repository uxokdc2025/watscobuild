"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CategoryTileGrid, BrandTiles, type Tile, type BrandTile } from "@/components/category-landing";

/* ════════════════════════════════════════════════════════════════════════
   Brand home — the Watsco Home-page Figma designs (ECM + Peirce) implemented
   on our chrome + design-system tokens. Section copy is the design's; the
   imagery is the design file's own exported assets (hero promo slides, category
   product photos, the designed service cards, and brand logos).
   ════════════════════════════════════════════════════════════════════════ */

type ImgLink = { alt: string; image: string; href: string };

export type HomeContent = {
  heroImages: string[];
  specials: string[];
  categoriesHeading: string;
  categories: Tile[];
  servicesHeading: string;
  servicesSub?: string;
  serviceCards: ImgLink[];
  twoUp?: ImgLink[];
  missionImage?: string;
  brandsHeading: string;
  brandsCopy: string;
  brandsCta: string;
  brandLogos?: BrandTile[];
  brandBand?: string;
  partner: { title: string; copy: string; cta?: string };
};

/* A light auto-rotating hero carousel over the design's promo slides. */
function Hero({ images }: { images: string[] }) {
  const [i, setI] = React.useState(0);
  const n = images.length;
  React.useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);
  return (
    <section aria-label="Featured" aria-roledescription="carousel" className="relative overflow-hidden rounded-xl border bg-muted">
      <div className="relative aspect-[1728/540] w-full">
        {images.map((src, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${idx === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
      {n > 1 ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === i}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${idx === i ? "w-6 bg-primary" : "w-2 bg-background/80 hover:bg-background"}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ServiceGrid({ heading, sub, cards }: { heading: string; sub?: string; cards: ImgLink[] }) {
  return (
    <section aria-label={heading}>
      <h2 className="text-center text-2xl font-bold tracking-tight">{heading}</h2>
      {sub ? <p className="mt-1 text-center text-sm text-muted-foreground">{sub}</p> : null}
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.alt}>
            <Link href={c.href} className="group block overflow-hidden rounded-xl border transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={c.alt} className="w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BrandHome({ brandKey }: { brandKey: string }) {
  const content = HOME_CONTENT[brandKey];
  if (!content) return null;
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:px-6">
      <Hero images={content.heroImages} />

      {/* Current specials */}
      <section aria-label="Current specials">
        <ul className="flex flex-wrap justify-center gap-2">
          {content.specials.map((s) => (
            <li key={s}>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="#">{s}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured categories */}
      <section aria-label={content.categoriesHeading}>
        <h2 className="mb-5 text-center text-2xl font-bold tracking-tight">{content.categoriesHeading}</h2>
        <CategoryTileGrid heading="" tiles={content.categories} />
      </section>

      {/* Trusted brands */}
      <section aria-label={content.brandsHeading} className="rounded-xl bg-muted/50 p-6 md:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">{content.brandsHeading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.brandsCopy}</p>
        </div>
        {content.brandLogos ? (
          <div className="mt-6">
            <BrandTiles heading="" brands={content.brandLogos} />
          </div>
        ) : null}
        {content.brandBand ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.brandBand} alt="Brands we carry" className="mx-auto mt-6 w-full max-w-4xl object-contain" loading="lazy" />
        ) : null}
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="#">{content.brandsCta}</Link>
          </Button>
        </div>
      </section>

      {/* Services / tools */}
      <ServiceGrid heading={content.servicesHeading} sub={content.servicesSub} cards={content.serviceCards} />

      {/* Two-up (blog / training) */}
      {content.twoUp ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {content.twoUp.map((c) => (
            <li key={c.alt}>
              <Link href={c.href} className="group block overflow-hidden rounded-xl border transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.alt} className="w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

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
    { alt: "OnCall Air — the ultimate sales engine", image: `${P}/on-call-air.png`, href: "#" },
    { alt: "Housecall Pro — run your business like a pro", image: `${P}/housecall-pro.png`, href: "#" },
    { alt: "Amply — LiDAR-powered design", image: `${P}/amply.png`, href: "#" },
    { alt: "Wingman — faster support", image: `${P}/wingman.png`, href: "#" },
    { alt: "AHRI System Builder", image: `${P}/ahri.png`, href: "#" },
    { alt: "FlashClaim", image: `${P}/flashclaim.png`, href: "#" },
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
  heroImages: [
    `${E}/hero/hero-1.jpg`,
    `${E}/hero/hero-2.jpg`,
    `${E}/hero/hero-3.jpg`,
  ],
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
  serviceCards: [
    { alt: "HVAC Pro+ Mobile App", image: `${E}/mobile-app.png`, href: "#" },
    { alt: "SimpleStock", image: `${E}/simple-stock.png`, href: "#" },
    { alt: "Dockside Pickup", image: `${E}/dockside-pickup.png`, href: "#" },
    { alt: "Order Templates", image: `${E}/order-templates.png`, href: "#" },
  ],
  twoUp: [
    { alt: "Check out our blog", image: `${E}/a-cool-read-ecmd-blog.png`, href: "#" },
    { alt: "Grow your skillset — PRO training", image: `${E}/pro-training.png`, href: "#" },
  ],
  missionImage: `${E}/hvac-products.png`,
  brandsHeading: "Brands We Trust",
  brandsCopy:
    "We take HVAC equipment, supplies, parts, and tools seriously, and we know your customers depend on you for quality goods. That's why we partner with the most trusted and highest quality HVAC manufacturers in the heating and cooling industry to offer you quality equipment, supplies, parts, and tools.",
  brandsCta: "Shop By Brand",
  brandBand: `${E}/brands-we-trust-east-coast-metal-distributors.png`,
  partner: {
    title: "HVAC Products You Need, When You Need Them",
    copy: "Our mission is to deliver the quality HVAC products you need, when you need them, and provide expert technical support. Our products, branches, and technical support combine to give you exceptional service before, during, and after the sale. This is our commitment to you. We are dedicated to fulfilling this commitment every single day. We are confident in our team and our products, and we're proud to have the opportunity to serve you.",
  },
};

export const HOME_CONTENT: Record<string, HomeContent> = {
  peirce: PEIRCE_HOME,
  ecmdi: ECM_HOME,
};
