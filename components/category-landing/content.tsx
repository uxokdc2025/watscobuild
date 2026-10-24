import * as React from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════════
   Category Landing — content & brand blocks (plug-and-play).
   Buyer's-guide cards and a brand chip row — the editorial content a CMS
   editor drops below the merchandising, like Walmart's guides + brand strip.
   ════════════════════════════════════════════════════════════════════════ */

/* ── Content Cards (buyer's guides) ────────────────────────────────────
 * Three editorial cards: icon, title, blurb, "read" link. */
export type ContentCard = { title: string; copy: string; href: string; icon?: LucideIcon; image?: string };
export function ContentCards({
  heading = "Buyer’s Guides",
  cards,
  className,
}: {
  heading?: string;
  cards: ContentCard[];
  className?: string;
}) {
  return (
    <section aria-label={heading} className={className}>
      <h2 className="mb-3 text-xl font-bold tracking-tight">{heading}</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <li key={c.title}>
            <Link
              href={c.href}
              className="group flex h-full flex-col overflow-hidden rounded-xl border bg-muted/30 transition hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {c.image ? (
                <span className="relative block aspect-[16/9] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" className="size-full object-cover transition duration-300 group-hover:scale-[1.03]" loading="lazy" />
                </span>
              ) : null}
              <span className="flex flex-1 flex-col p-5">
                {c.icon && !c.image ? (
                  <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <c.icon className="size-5" aria-hidden />
                  </span>
                ) : null}
                <span className={cn("block font-semibold leading-tight text-foreground group-hover:text-primary", c.icon && !c.image && "mt-3")}>{c.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{c.copy}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read guide <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Brand Row ─────────────────────────────────────────────────────────
 * "Brands you might love" — a wrapped row of brand chips. */
export type BrandChip = { label: string; href?: string };
export function BrandRow({
  heading = "Brands You Might Love",
  brands,
  className,
}: {
  heading?: string;
  brands: BrandChip[];
  className?: string;
}) {
  return (
    <section aria-label={heading} className={className}>
      <h2 className="mb-3 text-xl font-bold tracking-tight">{heading}</h2>
      <ul className="flex flex-wrap gap-3">
        {brands.map((b) => (
          <li key={b.label}>
            <Link
              href={b.href ?? "#"}
              className="inline-flex items-center rounded-lg border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {b.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Product Rail ──────────────────────────────────────────────────────
 * A horizontal, snap-scrolling row of merchandising cards (top sellers /
 * flash deals) — a rail, deliberately NOT a filterable results grid. The
 * cards themselves are passed in so this block stays data-agnostic. */
export function ProductRail({
  id,
  heading,
  subheading,
  cta,
  children,
  className,
}: {
  id?: string;
  heading: string;
  subheading?: string;
  cta?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-label={heading} className={cn("scroll-mt-24", className)}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{heading}</h2>
          {subheading ? <p className="text-sm text-muted-foreground">{subheading}</p> : null}
        </div>
        {cta ? (
          <Link href={cta.href} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {cta.label} <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : null}
      </div>
      <ul className="flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {React.Children.map(children, (child) => (
          <li className="w-44 shrink-0 snap-start sm:w-52">{child}</li>
        ))}
      </ul>
    </section>
  );
}
