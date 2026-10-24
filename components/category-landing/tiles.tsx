import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════════
   Category Landing — tile & grid content blocks (plug-and-play).
   Square-tile grids with the label BELOW the card, sized to the walmart.com
   /cp reference: "Shop by category" (6-up), "Don't miss these" promo tiles
   (4-up), and a brand tile grid (6-up). Built on design-system tokens only
   (bg-muted tiles, bg-primary color panels) — no bespoke colors.
   ════════════════════════════════════════════════════════════════════════ */

/* ── Category Tile Grid ────────────────────────────────────────────────
 * The primary "jump" element (Walmart "Shop by category"): a 6-up grid of
 * square tiles — image centered in a light square, label centered below.
 * Selecting one is the only route into a product grid — the client goal. */
export type Tile = { label: string; image: string; href: string };
export function CategoryTileGrid({
  heading = "Shop by Category",
  action,
  tiles,
  className,
}: {
  heading?: string;
  /** Optional top-right link, e.g. { label: "See all", href }. */
  action?: { label: string; href: string };
  tiles: Tile[];
  className?: string;
}) {
  return (
    <section aria-label={heading} className={className}>
      <SectionHead heading={heading} action={action} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link href={t.href} className="group block focus-visible:outline-none">
              <span className="relative block aspect-square overflow-hidden rounded-2xl bg-muted transition group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt="" className="absolute inset-0 m-auto max-h-[82%] max-w-[82%] object-contain" loading="lazy" />
              </span>
              <span className="mt-2 block text-center text-sm font-medium leading-tight text-foreground group-hover:text-primary">
                {t.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Promo Tiles ───────────────────────────────────────────────────────
 * Walmart "Don't miss these": a 4-up row of square promo tiles. A tile is
 * either a solid-color text panel or a product/editorial image panel, with
 * the caption centered below. The compact "bento" of callouts. */
export type PromoTile = {
  caption: string;
  href: string;
  /** Image tile: product/editorial art on a light square. */
  image?: string;
  /** Color tile: big headline text on a solid background. */
  title?: string;
  /** Tailwind background class for a color tile, e.g. "bg-primary". */
  bg?: string;
  /** Text color token class for a color tile, e.g. "text-primary-foreground". */
  fg?: string;
};
export function PromoTiles({
  heading = "Don’t Miss These",
  tiles,
  className,
}: {
  heading?: string;
  tiles: PromoTile[];
  className?: string;
}) {
  return (
    <section aria-label={heading} className={className}>
      <SectionHead heading={heading} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.caption}>
            <Link href={t.href} className="group block focus-visible:outline-none">
              {t.image ? (
                <span className="relative block aspect-square overflow-hidden rounded-2xl bg-muted transition group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt="" className="absolute inset-0 m-auto max-h-[78%] max-w-[78%] object-contain" loading="lazy" />
                </span>
              ) : (
                <span
                  className={cn(
                    "grid aspect-square place-items-center rounded-2xl p-5 text-center transition group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring",
                    t.bg ?? "bg-primary",
                    t.fg ?? "text-primary-foreground",
                  )}
                >
                  <span className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{t.title}</span>
                </span>
              )}
              <span className="mt-2 block text-center text-sm font-medium leading-tight text-foreground group-hover:text-primary">
                {t.caption}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Brand Tiles ───────────────────────────────────────────────────────
 * Walmart "Tech brands you love": a 6-up grid of square logo tiles, label
 * centered below. Logos fall back to the brand name set in a light square. */
export type BrandTile = { label: string; href?: string; logo?: string };
export function BrandTiles({
  heading = "Brands You Might Love",
  action,
  brands,
  className,
}: {
  heading?: string;
  action?: { label: string; href: string };
  brands: BrandTile[];
  className?: string;
}) {
  return (
    <section aria-label={heading} className={className}>
      <SectionHead heading={heading} action={action} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((b) => (
          <li key={b.label}>
            <Link href={b.href ?? "#"} className="group block focus-visible:outline-none">
              <span
                className="grid aspect-square place-items-center rounded-2xl p-5 text-center transition group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring bg-muted"
              >
                {b.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logo} alt={b.label} className="max-h-[56%] max-w-[72%] object-contain" loading="lazy" />
                ) : (
                  <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{b.label}</span>
                )}
              </span>
              <span className="mt-2 block text-center text-sm font-medium leading-tight text-muted-foreground group-hover:text-primary">
                {b.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Side-by-Side Image ────────────────────────────────────────────────
 * Two equal ad panels in one row — a left image tile and a right image tile,
 * each with its own copy + CTA. The classic CMS "2-up" promo block. */
export type AdPanel = {
  image: string;
  eyebrow?: string;
  title: string;
  copy?: string;
  cta?: { label: string; href: string };
  tone?: string;
};
export function SideBySideImage({
  left,
  right,
  className,
}: {
  left: AdPanel;
  right: AdPanel;
  className?: string;
}) {
  return (
    <section aria-label="Featured promotions" className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {[left, right].map((p, i) => (
        <article key={i} className={cn("flex items-center gap-4 overflow-hidden rounded-xl border p-5 sm:p-6", p.tone ?? "bg-muted/40")}>
          <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-background ring-1 ring-border sm:size-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" className="max-h-[80%] max-w-[80%] object-contain" loading="lazy" />
          </span>
          <div className="min-w-0">
            {p.eyebrow ? <span className="text-xs font-semibold tracking-wide text-primary uppercase">{p.eyebrow}</span> : null}
            <h3 className="mt-0.5 text-lg font-bold leading-tight tracking-tight">{p.title}</h3>
            {p.copy ? <p className="mt-1 text-sm text-muted-foreground">{p.copy}</p> : null}
            {p.cta ? (
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href={p.cta.href}>{p.cta.label}<ArrowRight className="size-4" /></Link>
              </Button>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}

/* Shared section header: bold heading left, optional link top-right. */
function SectionHead({ heading, action }: { heading: string; action?: { label: string; href: string } }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <h2 className="text-xl font-bold tracking-tight">{heading}</h2>
      {action ? (
        <Link href={action.href} className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
