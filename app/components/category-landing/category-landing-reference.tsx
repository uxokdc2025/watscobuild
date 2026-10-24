"use client";

import * as React from "react";
import { Leaf, Truck, BadgePercent, BookOpen, Ruler, Snowflake } from "lucide-react";

import {
  LargeBanner,
  MiniBanner,
  CategoryTileGrid,
  PromoTiles,
  BrandTiles,
  SideBySideImage,
  ContentCards,
} from "@/components/category-landing";

/* Category Landing — component catalog. Each CMS content block renders live
   with sample props. A bridge to the future CMS: these are the drag-in slots
   an editor will compose a category "jump" page from. All built on the design
   system (Button + semantic tokens); sizing matches the walmart.com /cp ref. */

function Block({
  name,
  desc,
  children,
}: {
  name: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="rounded-xl border bg-card p-5">{children}</div>
    </section>
  );
}

const TILES = [
  { label: "Air Conditioners", image: "/category-tiles/air-conditioner.webp", href: "#" },
  { label: "Heat Pumps", image: "/category-tiles/heat-pump.webp", href: "#" },
  { label: "Gas Furnaces", image: "/category-tiles/gas-furnace.webp", href: "#" },
  { label: "Air Handlers", image: "/category-tiles/air-handler.webp", href: "#" },
  { label: "Evaporator Coils", image: "/category-tiles/evaporator-coil.webp", href: "#" },
  { label: "Ductless", image: "/category-tiles/ductless.webp", href: "#" },
];

export default function CategoryLandingReference() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Components</p>
        <h1 className="text-3xl font-bold tracking-tight">Category Landing</h1>
        <p className="max-w-2xl text-muted-foreground">
          Plug-and-play content blocks for category &ldquo;jump&rdquo; pages — a bridge to the CMS. An editor composes a
          page from these slots: banners, category tiles, promo tiles, a brand grid, and editorial cards. Product rails
          reuse the existing product card. Every block is prop-driven and built only on the design system; tile sizing
          matches the walmart.com category reference.
        </p>
        <code className="inline-block rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
          import {"{ LargeBanner, CategoryTileGrid, … }"} from &quot;@/components/category-landing&quot;
        </code>
      </header>

      <div className="mt-10 space-y-10">
        <Block name="Large Banner" desc="The category hero — light band with a white lockup inset, centered kicker + headline + copy + pill CTA, and a product inset. tone='navy' swaps the band to brand navy.">
          <div className="space-y-4">
            <LargeBanner
              kicker="Now at Homans"
              title="Residential Equipment"
              copy="Condensers, furnaces, coils, and complete systems — in stock at your branch."
              cta={{ label: "Shop the season", href: "#" }}
              image="/category-tiles/air-conditioner.webp"
              lockup={<span className="text-lg font-bold tracking-tight text-foreground">R-454B<br />Ready</span>}
            />
            <LargeBanner tone="navy" kicker="Fall savings event" title="Fall Into Savings" copy="Stack rebates on R-454B systems through October." cta={{ label: "Shop the event", href: "#" }} image="/category-tiles/heat-pump.webp" />
          </div>
        </Block>

        <Block name="Category Tile Grid" desc="The primary 'jump' element — a 6-up grid of square tiles (image centered, label below). Selecting one is the only route into a product grid.">
          <CategoryTileGrid heading="Shop by Category" tiles={TILES} action={{ label: "See all", href: "#" }} />
        </Block>

        <Block name="Promo Tiles" desc="Walmart 'Don't miss these' — a 4-up row of square promo tiles, each a solid-color text panel or an image panel, caption below. Colors come from DS tokens.">
          <PromoTiles
            tiles={[
              { title: "Clearance & Scratch-Dent", caption: "Shop all clearance", href: "#", bg: "bg-primary", fg: "text-primary-foreground" },
              { image: "/category-tiles/heat-pump.webp", caption: "Pro picks this month", href: "#" },
              { title: "In Stock Today", caption: "Ready at your branch", href: "#", bg: "bg-secondary", fg: "text-secondary-foreground" },
              { title: "Rebate Roundup", caption: "Save up to $500", href: "#", bg: "bg-foreground", fg: "text-background" },
            ]}
          />
        </Block>

        <Block name="Brand Tiles" desc="A 6-up grid of square brand tiles (logo or name, label below). 'Brands you might love'.">
          <BrandTiles heading="Brands You Might Love" brands={[{ label: "Bryant" }, { label: "Armstrong Air" }, { label: "Mitsubishi" }, { label: "Honeywell" }, { label: "Aprilaire" }, { label: "Copeland" }]} />
        </Block>

        <Block name="Side-by-Side Image" desc="A 2-up ad block — left image tile and right image tile, each with its own eyebrow, copy, and CTA.">
          <SideBySideImage
            left={{ image: "/category-tiles/air-handler.webp", eyebrow: "New", title: "Air Handlers, Restocked", copy: "Matched to every R-454B condenser.", cta: { label: "Shop air handlers", href: "#" } }}
            right={{ image: "/category-tiles/evaporator-coil.webp", eyebrow: "Bundle & save", title: "Coil + Condenser Kits", copy: "Priced and in stock together.", cta: { label: "Build a system", href: "#" } }}
          />
        </Block>

        <Block name="Content Cards" desc="Three editorial 'buyer's guide' cards — icon, title, blurb, read link. The band-aid for taxonomy gaps: guide the user with content.">
          <ContentCards
            cards={[
              { title: "R-454B Transition Guide", copy: "What the refrigerant change means for your next install.", href: "#", icon: Leaf },
              { title: "Sizing a Residential System", copy: "Match tonnage, coil, and air handler every time.", href: "#", icon: Ruler },
              { title: "Furnace Buying Guide", copy: "Gas vs. oil, efficiency, and what to stock.", href: "#", icon: BookOpen },
            ]}
          />
        </Block>

        <Block name="Mini Banner" desc="A slim promo strip — icon + message pairs and an optional CTA. tone='navy' (default) or 'grey'.">
          <div className="space-y-4">
            <MiniBanner items={[{ icon: Truck, text: "Free freight on equipment orders over $2,500" }, { icon: BadgePercent, text: "Earn Homans Rewards on every order" }]} cta={{ label: "View My Rewards", href: "#" }} />
            <MiniBanner tone="grey" items={[{ icon: Snowflake, text: "Beat the first freeze — in-stock systems ship today" }]} cta={{ label: "Shop in-stock", href: "#" }} />
          </div>
        </Block>
      </div>
    </div>
  );
}
