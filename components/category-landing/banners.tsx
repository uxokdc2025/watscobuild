import * as React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════════
   Category Landing — CMS content blocks (plug-and-play).
   Prop-driven banner components a future CMS can expose as drag-in blocks.
   Built on the design-system Button + semantic tokens. Sizing matches the
   walmart.com /cp category-landing reference.
   ════════════════════════════════════════════════════════════════════════ */

export type BannerCta = { label: string; href: string };

/* ── Large Banner ──────────────────────────────────────────────────────
 * The category hero, Walmart-style: a light band with a white inset lockup
 * card on the left, centered kicker + headline + copy + pill CTA, and a white
 * product inset on the right. `tone` swaps the band to brand navy. */
export function LargeBanner({
  kicker,
  title,
  copy,
  cta,
  image,
  lockup,
  tone = "grey",
  className,
}: {
  /** Small line above the headline, e.g. "Now at Homans". */
  kicker?: string;
  title: React.ReactNode;
  copy?: string;
  cta?: BannerCta;
  /** Product image shown in the right-hand white inset. */
  image?: string;
  /** Short brand/offer lockup for the left white inset (optional). */
  lockup?: React.ReactNode;
  tone?: "grey" | "navy";
  className?: string;
}) {
  const dark = tone === "navy";
  return (
    <section
      aria-label={typeof title === "string" ? title : "Featured banner"}
      className={cn("overflow-hidden rounded-xl", dark ? "bg-primary" : "bg-muted", className)}
    >
      <div className="mx-auto grid min-h-[180px] max-w-[72rem] items-center gap-5 px-5 py-5 sm:grid-cols-[1fr_1.5fr_1fr] sm:px-6 sm:py-6">
        {/* Left inset lockup */}
        {lockup ? (
          <div className="hidden place-items-center rounded-xl bg-background p-6 text-center shadow-sm sm:grid sm:min-h-[132px]">
            {lockup}
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}
        {/* Center copy */}
        <div className={cn("text-center", dark ? "text-primary-foreground" : "text-foreground")}>
          {kicker ? <p className={cn("text-sm font-semibold", dark ? "text-primary-foreground/80" : "text-muted-foreground")}>{kicker}</p> : null}
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{title}</h2>
          {copy ? <p className={cn("mx-auto mt-2 max-w-md text-sm sm:text-base", dark ? "text-primary-foreground/85" : "text-muted-foreground")}>{copy}</p> : null}
          {cta ? (
            <Button asChild variant={dark ? "secondary" : "outline"} className="mt-4 rounded-full px-6">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
        </div>
        {/* Right product inset */}
        {image ? (
          <div className="hidden place-items-center rounded-xl bg-background p-4 shadow-sm sm:grid sm:min-h-[132px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="max-h-[120px] max-w-full object-contain" />
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </section>
  );
}

/* ── Mini Banner ───────────────────────────────────────────────────────
 * A slim promo strip: one or more icon + message pairs and an optional CTA.
 * The "free freight / earn rewards" style bar. */
export type MiniBannerItem = { icon?: LucideIcon; text: string };
export function MiniBanner({
  items,
  cta,
  tone = "navy",
  className,
}: {
  items: MiniBannerItem[];
  cta?: BannerCta;
  tone?: "navy" | "grey";
  className?: string;
}) {
  const dark = tone === "navy";
  return (
    <section
      aria-label="Promotional message"
      className={cn(
        "flex flex-col items-center justify-between gap-3 rounded-xl px-6 py-5 shadow-sm sm:flex-row",
        dark ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        {items.map((it) => (
          <span key={it.text} className="inline-flex items-center gap-2 font-semibold">
            {it.icon ? <it.icon className="size-5" aria-hidden /> : null}
            {it.text}
          </span>
        ))}
      </div>
      {cta ? (
        <Button asChild size="sm" variant={dark ? "secondary" : "default"} className="shrink-0">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      ) : null}
    </section>
  );
}
