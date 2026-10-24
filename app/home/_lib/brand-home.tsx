"use client";

import * as React from "react";
import Link from "next/link";
import {
  Boxes,
  CalendarCheck,
  FileText,
  LifeBuoy,
  Package,
  ScanLine,
  Smartphone,
  Sparkles,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  LargeBanner,
  MiniBanner,
  CategoryTileGrid,
  BrandTiles,
  SideBySideImage,
  ContentCards,
  type Tile,
  type BrandTile,
  type ContentCard,
  type AdPanel,
} from "@/components/category-landing";

/* ════════════════════════════════════════════════════════════════════════
   Brand home — a reskin shell. Takes a distributor home page's content and
   re-renders it on OUR design system using the Category Landing CMS blocks,
   so every brand's home reads as one system (depth, card treatments, tokens).
   A clone-bones reskin: the structure + content are kept, the source brand art
   and third-party manufacturer logos are dropped for our tokens + image pool.
   ════════════════════════════════════════════════════════════════════════ */

export type HomeService = { title: string; copy: string; cta: string; icon: LucideIcon };

export type HomeContent = {
  hero: { kicker: string; title: string; copy: string; cta: { label: string; href: string }; images: string[] };
  specials: string[];
  categoriesHeading: string;
  categories: Tile[];
  servicesHeading: string;
  services: HomeService[];
  twoUp: { left: AdPanel; right: AdPanel };
  brandsHeading: string;
  brandsCopy: string;
  brands: BrandTile[];
  partner: { title: string; copy: string; cta: { label: string; href: string } };
};

export function BrandHome({ brandKey }: { brandKey: string }) {
  const content = HOME_CONTENT[brandKey];
  if (!content) return null;
  const serviceCards: ContentCard[] = content.services.map((s) => ({
    title: s.title,
    copy: s.copy,
    href: "#",
    icon: s.icon,
  }));
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:px-6">
      {/* Hero */}
      <LargeBanner
        kicker={content.hero.kicker}
        kickerIcon={Sparkles}
        title={content.hero.title}
        copy={content.hero.copy}
        cta={content.hero.cta}
        images={content.hero.images}
      />

      {/* Current specials — a wrapped row of pill links */}
      <section aria-label="Current specials">
        <h2 className="mb-3 text-xl font-bold tracking-tight">Current Specials</h2>
        <ul className="flex flex-wrap gap-2">
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
      <CategoryTileGrid heading={content.categoriesHeading} tiles={content.categories} />

      {/* Services / tools */}
      <ContentCards heading={content.servicesHeading} cards={serviceCards} />

      {/* Two-up content block */}
      <SideBySideImage left={content.twoUp.left} right={content.twoUp.right} />

      {/* Trusted brands */}
      <section aria-label={content.brandsHeading} className="space-y-4">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight">{content.brandsHeading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{content.brandsCopy}</p>
        </div>
        <BrandTiles heading="" brands={content.brands} />
      </section>

      {/* Partner / CTA */}
      <LargeBanner
        tone="navy"
        kicker="Trade professionals"
        title={content.partner.title}
        copy={content.partner.copy}
        cta={content.partner.cta}
      />

      <MiniBanner
        items={[
          { icon: Truck, text: "Fast delivery and dockside pickup at your branch" },
          { icon: Package, text: "Live inventory and pricing for trade accounts" },
        ]}
        cta={{ label: "Open an account", href: "#" }}
      />
    </div>
  );
}

/* ── Shared icon pool for service cards ── */
const ICON = { Smartphone, ScanLine, LifeBuoy, FileText, CalendarCheck, Wrench, Boxes, Package, Sparkles } as const;

/* ════════════════ Peirce-Phelps — content reskinned ════════════════ */
export const PEIRCE_HOME: HomeContent = {
  hero: {
    kicker: "Quarterly Special · Now Stocking",
    title: "Serving contractors for 100 years",
    copy: "High-quality HVAC/R equipment, parts, supplies, and tools at 20+ locations across PA, NJ, and DE.",
    cta: { label: "Shop the specials", href: "#" },
    images: ["/category-tiles/gas-furnace-t.png", "/category-tiles/small-packaged-t.png"],
  },
  specials: [
    "Monthly Special",
    "Quarterly Special",
    "Preseason",
    "FlashClaims",
    "WeatherMaker Systems",
    "SimpleProposal",
    "Mitsubishi WR Systems",
    "100 Years",
  ],
  categoriesHeading: "Featured Categories",
  categories: [
    { label: "Residential Equipment", image: "/category-tiles/air-conditioner-t.png", href: "#" },
    { label: "Commercial Equipment", image: "/category-tiles/small-packaged-t.png", href: "#" },
    { label: "Ductless & Mini-Split", image: "/category-tiles/ductless-t.png", href: "#" },
    { label: "Indoor Air Quality", image: "/category-tiles/evaporator-coil-t.png", href: "#" },
    { label: "Thermostats & Zoning", image: "/category-tiles/accessories-t.png", href: "#" },
    { label: "Testing Equipment", image: "/category-tiles/heat-pump-t.png", href: "#" },
    { label: "Parts", image: "/category-tiles/accessories-t.png", href: "#" },
    { label: "Tools & Supplies", image: "/category-tiles/air-handler-t.png", href: "#" },
  ],
  servicesHeading: "Our Services",
  services: [
    { title: "OnCall Air", copy: "Sales software with AHRI match-ups, live inventory, dynamic pricing, and a proposal builder.", cta: "Boost a proposal", icon: ICON.FileText },
    { title: "Housecall Pro", copy: "Top-rated field-service software with smart scheduling, online booking, and fast payments.", cta: "Run your business", icon: ICON.CalendarCheck },
    { title: "Amply", copy: "LiDAR scans, ACCA load calcs, and AR visualization make design and Manual J fast and accurate.", cta: "Explore Amply", icon: ICON.ScanLine },
    { title: "Wingman", copy: "In the HVAC Pro+ mobile app for faster support and priority service.", cta: "See how it works", icon: ICON.LifeBuoy },
    { title: "AHRI System Builder", copy: "Matched systems made easy with real-time inventory and pricing.", cta: "Build a system", icon: ICON.Sparkles },
    { title: "FlashClaim", copy: "Submit warranty claims, receive approvals, and create replacement orders without the back-and-forth.", cta: "Start a claim", icon: ICON.Boxes },
  ],
  twoUp: {
    left: { image: "/guide-images/sizing.jpg", eyebrow: "Design & sizing", title: "Match a system in minutes", copy: "Real-time AHRI match-ups with live inventory and pricing.", cta: { label: "Build a system", href: "#" } },
    right: { image: "/guide-images/furnace.jpg", eyebrow: "Preseason", title: "Now stocking for the season", copy: "Get ahead of demand with in-stock equipment at your branch.", cta: { label: "Shop preseason", href: "#" } },
  },
  brandsHeading: "Our Trusted Brands",
  brandsCopy: "Shop from the industry's most reliable brands and manufacturers — you're sure to find what you're looking for.",
  brands: [
    { label: "Carrier" }, { label: "Viessmann" }, { label: "Mitsubishi" }, { label: "Bryant" }, { label: "Honeywell" }, { label: "Aprilaire" },
  ],
  partner: {
    title: "Partner with Peirce-Phelps",
    copy: "We sell to HVAC trade professionals within our territory. Credit accounts and payment terms are subject to approval.",
    cta: { label: "Become a dealer", href: "#" },
  },
};

/* ════════════════ East Coast Metal — content reskinned ════════════════ */
export const ECM_HOME: HomeContent = {
  hero: {
    kicker: "Save on select products · Limited time",
    title: "The HVAC supplier of choice since 1954",
    copy: "The quality HVAC products you need, when you need them — plus expert technical support before, during, and after the sale.",
    cta: { label: "Save now", href: "#" },
    images: ["/category-tiles/air-conditioner-t.png", "/category-tiles/heat-pump-t.png"],
  },
  specials: ["Pro Deals", "Ductless Solutions", "Smart Home", "Tech Tips", "Training Events"],
  categoriesHeading: "Shop by Category",
  categories: [
    { label: "HVAC Equipment", image: "/category-tiles/air-conditioner-t.png", href: "#" },
    { label: "Ductless & Mini-Splits", image: "/category-tiles/ductless-t.png", href: "#" },
    { label: "Ductwork", image: "/category-tiles/air-handler-t.png", href: "#" },
    { label: "Equipment Pads", image: "/category-tiles/small-packaged-t.png", href: "#" },
    { label: "Motors", image: "/category-tiles/accessories-t.png", href: "#" },
    { label: "HVAC Parts", image: "/category-tiles/accessories-t.png", href: "#" },
    { label: "Tools", image: "/category-tiles/accessories-t.png", href: "#" },
    { label: "Thermostats", image: "/category-tiles/accessories-t.png", href: "#" },
    { label: "Indoor Air Quality", image: "/category-tiles/evaporator-coil-t.png", href: "#" },
    { label: "Air Distribution", image: "/category-tiles/air-handler-t.png", href: "#" },
    { label: "Supplies", image: "/category-tiles/gas-furnace-t.png", href: "#" },
    { label: "Smart Home", image: "/category-tiles/heat-pump-t.png", href: "#" },
  ],
  servicesHeading: "Premium Tools for Fast Ordering",
  services: [
    { title: "HVAC Pro+ Mobile App", copy: "Product info and easy-to-use tools while you're on the go.", cta: "Learn more", icon: ICON.Smartphone },
    { title: "SimpleStock", copy: "Inventory and truck-stock replenishment right from your tablet or phone.", cta: "Learn more", icon: ICON.ScanLine },
    { title: "Dockside Pickup", copy: "Skip the counter for quicker, more convenient contactless pickup.", cta: "Learn more", icon: ICON.Package },
    { title: "Order Templates", copy: "Save lists of commonly ordered products for fast, organized reordering.", cta: "Learn more", icon: ICON.FileText },
  ],
  twoUp: {
    left: { image: "/guide-images/r454b.jpg", eyebrow: "The blog", title: "Check out our blog", copy: "Expert tech tips, industry news, tutorials, and product troubleshooting.", cta: { label: "Read now", href: "#" } },
    right: { image: "/guide-images/sizing.jpg", eyebrow: "Training", title: "Grow your skillset", copy: "Certified technical reps, onsite training events, and an on-demand video library.", cta: { label: "Start learning", href: "#" } },
  },
  brandsHeading: "Brands We Trust",
  brandsCopy: "We partner with the most trusted, highest-quality HVAC manufacturers so your customers get quality equipment, supplies, parts, and tools.",
  brands: [
    { label: "Carrier" }, { label: "Rheem" }, { label: "Mitsubishi" }, { label: "Honeywell" }, { label: "Copeland" }, { label: "Aprilaire" },
  ],
  partner: {
    title: "HVAC products you need, when you need them",
    copy: "Our products, branches, and technical support combine to give you exceptional service — our commitment to you, every day.",
    cta: { label: "Open an account", href: "#" },
  },
};

export const HOME_CONTENT: Record<string, HomeContent> = {
  peirce: PEIRCE_HOME,
  ecmdi: ECM_HOME,
};
