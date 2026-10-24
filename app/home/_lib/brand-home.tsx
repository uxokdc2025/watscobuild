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
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  LargeBanner,
  CategoryTileGrid,
  SideBySideImage,
  ContentCards,
  type Tile,
  type ContentCard,
  type AdPanel,
} from "@/components/category-landing";

/* ════════════════════════════════════════════════════════════════════════
   Brand home — a reskin shell. Takes a distributor home page's content and
   re-renders it on OUR design system using the Category Landing CMS blocks,
   so every brand's home reads as one system (depth, card treatments, tokens).
   A clone-bones reskin: the content is the source site's VERBATIM copy; only
   the source brand art + third-party manufacturer logos are dropped for our
   tokens + image pool.
   ════════════════════════════════════════════════════════════════════════ */

export type HomeService = { title: string; copy: string; cta: string; icon: LucideIcon };

export type HomeContent = {
  hero: { kicker?: string; title: string; copy: string; cta: { label: string; href: string }; images: string[] };
  specials: string[];
  categoriesHeading: string;
  categories: Tile[];
  servicesHeading: string;
  servicesSub?: string;
  services: HomeService[];
  twoUp?: { left: AdPanel; right: AdPanel };
  brandsHeading: string;
  brandsCopy: string;
  brandsCta: string;
  partner: { title: string; copy: string; cta?: { label: string; href: string } };
};

export function BrandHome({ brandKey }: { brandKey: string }) {
  const content = HOME_CONTENT[brandKey];
  if (!content) return null;
  const serviceCards: ContentCard[] = content.services.map((s) => ({
    title: s.title,
    copy: s.copy,
    cta: s.cta,
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
      <ContentCards heading={content.servicesHeading} subheading={content.servicesSub} cards={serviceCards} />

      {/* Two-up content block (only where the source page has one) */}
      {content.twoUp ? <SideBySideImage left={content.twoUp.left} right={content.twoUp.right} /> : null}

      {/* Trusted brands — the source's exact copy + its shop-brands CTA */}
      <section aria-label={content.brandsHeading} className="space-y-4">
        <div className="max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight">{content.brandsHeading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.brandsCopy}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="#">{content.brandsCta}</Link>
        </Button>
      </section>

      {/* Partner / mission */}
      <LargeBanner tone="navy" title={content.partner.title} copy={content.partner.copy} cta={content.partner.cta} />
    </div>
  );
}

/* ════════════════ Peirce-Phelps — content (verbatim) ════════════════ */
export const PEIRCE_HOME: HomeContent = {
  hero: {
    kicker: "Now Stocking",
    title: "Quarterly Special",
    copy: "Oct. 1st – Dec. 31st, 2026",
    cta: { label: "Click here to order now", href: "#" },
    images: ["/category-tiles/gas-furnace-t.png", "/category-tiles/small-packaged-t.png"],
  },
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
    { label: "Residential Equipment", image: "/category-tiles/air-conditioner-t.png", href: "#" },
    { label: "Commercial Equipment", image: "/category-tiles/small-packaged-t.png", href: "#" },
    { label: "Ductless & Mini Split Systems", image: "/category-tiles/ductless-t.png", href: "#" },
    { label: "Indoor Air Quality", image: "/category-tiles/evaporator-coil-t.png", href: "#" },
    { label: "Thermostat Controls & Zoning", image: "/category-tiles/accessories-t.png", href: "#" },
    { label: "Testing Equipment", image: "/category-tiles/heat-pump-t.png", href: "#" },
    { label: "Parts", image: "/category-tiles/accessories-t.png", href: "#" },
    { label: "Tools & Supplies", image: "/category-tiles/air-handler-t.png", href: "#" },
  ],
  servicesHeading: "Our Services",
  services: [
    { title: "OnCall Air", copy: "HVAC sales software with AHRI match-ups, live inventory, dynamic pricing, and proposal builder.", cta: "Boost a Proposal", icon: FileText },
    { title: "Housecall Pro", copy: "Top-rated field service software for trades with smart scheduling, online booking, and fast payments.", cta: "Run Your Business Better", icon: CalendarCheck },
    { title: "Amply", copy: "LiDAR scans, ACCA load calculations, and AR visualization make design and Manual J fast and accurate.", cta: "Explore Amply", icon: ScanLine },
    { title: "Wingman", copy: "Wingman in the HVAC Pro+ Mobile App for faster support and priority service.", cta: "See How It Works", icon: LifeBuoy },
    { title: "AHRI System Builder", copy: "Matched Systems made easy with real-time inventory and pricing.", cta: "Build a System", icon: Sparkles },
    { title: "FlashClaim", copy: "FlashClaim, contractors can take control—submit claims, receive approvals, and create replacement orders without the back-and-forth.", cta: "Start a Claim", icon: Boxes },
  ],
  brandsHeading: "Our Trusted Brands",
  brandsCopy:
    "Peirce Phelps provides high quality HVAC/R equipment, parts, supplies, and tools to contractors at over 20 locations across Pennsylvania, New Jersey, and Delaware. With some of the most well-known brands in the HVAC/R industry, you're sure to find what you're looking for. Shop from the industry's most reliable brands and manufacturers.",
  brandsCta: "View Our Brands",
  partner: {
    title: "Partner with Peirce-Phelps",
    copy: "Peirce-Phelps only sells to HVAC trade professionals and service organizations within its geographic territory and not sell directly to homeowners. Some HVAC manufacturer's equipment may be restricted without supplying a contractor's license and credit accounts & payment terms are subject to Credit Approval",
    cta: { label: "Become a Peirce-Phelps Dealer", href: "#" },
  },
};

/* ════════════════ East Coast Metal — content (verbatim) ════════════════ */
export const ECM_HOME: HomeContent = {
  hero: {
    kicker: "HVAC Supplier of Choice",
    title: "Save on Select Products!",
    copy: "For a limited time and while supplies last.",
    cta: { label: "Save Now", href: "#" },
    images: ["/category-tiles/air-conditioner-t.png", "/category-tiles/heat-pump-t.png"],
  },
  specials: ["Google Nest Savings", "Crocodile Cloth", "Pro Deals", "Ductless Solutions"],
  categoriesHeading: "Serving the HVAC Industry Since 1954",
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
  servicesHeading: "Premium Tools For Fast Ordering",
  servicesSub: "These tools are designed to make your ordering process faster, simpler, and better organized.",
  services: [
    { title: "HVAC Pro+™ Mobile App", copy: "Our mobile app provides access to product info and easy to use tools while on the go.", cta: "Learn More", icon: Smartphone },
    { title: "SimpleStock", copy: "Inventory and truck stock replenishment, right from your tablet or mobile phone.", cta: "Learn More", icon: ScanLine },
    { title: "Dockside Pickup", copy: "Skip the counter for quicker, more convenient contactless pickup.", cta: "Learn More", icon: Package },
    { title: "Order Templates", copy: "Save lists of commonly ordered products for easy reference when you need to reorder.", cta: "Learn More", icon: FileText },
  ],
  twoUp: {
    left: {
      image: "/guide-images/r454b.jpg",
      eyebrow: "Check Out Our Blog",
      title: "Check Out Our Blog",
      copy: "Catch up with us. Stay current on what matters to you with expert blog posts, HVAC industry news, tech tips, tutorials, product troubleshooting tips, and more! Be sure to check out our monthly series of Tech Tips blog posts written by members of our Technical Service Team.",
      cta: { label: "Read Now", href: "#" },
    },
    right: {
      image: "/guide-images/sizing.jpg",
      eyebrow: "Grow Your Skillset",
      title: "Grow Your Skillset",
      copy: "We're here to help. We have certified Technical Service Representatives available to help solve the problem at hand, keep you up-to-date on products, and offer helpful troubleshooting tips. Attend one of our scheduled onsite training events or view our video library for technical training on your own time.",
      cta: { label: "Start Learning", href: "#" },
    },
  },
  brandsHeading: "Brands We Trust",
  brandsCopy:
    "We take HVAC equipment, supplies, parts, and tools seriously, and we know your customers depend on you for quality goods. That's why we partner with the most trusted and highest quality HVAC manufacturers in the heating and cooling industry to offer you quality equipment, supplies, parts, and tools.",
  brandsCta: "Shop By Brand",
  partner: {
    title: "HVAC Products You Need, When You Need Them",
    copy: "Our mission is to deliver the quality HVAC products you need, when you need them, and provide expert technical support. Our products, branches, and technical support combine to give you exceptional service before, during, and after the sale. This is our commitment to you. We are dedicated to fulfilling this commitment every single day. We are confident in our team and our products, and we're proud to have the opportunity to serve you.",
  },
};

export const HOME_CONTENT: Record<string, HomeContent> = {
  peirce: PEIRCE_HOME,
  ecmdi: ECM_HOME,
};
