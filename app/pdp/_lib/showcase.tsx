"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatUSD } from "./types";
import { RA14 } from "./showcase-data";

/* ── Quantity stepper ── */
function QtyStepper({
  qty,
  setQty,
  size = "md",
}: {
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-11";
  const w = size === "sm" ? "w-9" : "w-11";
  const btn =
    "grid h-full place-items-center text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground";
  return (
    <div className={cn("inline-flex shrink-0 items-center rounded-md border", h)} role="group" aria-label="Quantity">
      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity" className={cn(btn, w, "rounded-l-md")}>
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className={cn("grid h-full place-items-center border-x text-sm font-medium tabular-nums", w)}>
        {qty}
      </span>
      <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity" className={cn(btn, w, "rounded-r-md")}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}

/* ── Sticky Add-to-Cart bar: slides in once the primary CTA scrolls off-screen ── */
function StickyCartBar({
  visible,
  qty,
  setQty,
}: {
  visible: boolean;
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-background/95 shadow-sm backdrop-blur transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <span className="line-clamp-1 flex-1 text-sm font-semibold">
          {RA14.short}
        </span>
        <span className="hidden text-lg font-bold text-price sm:inline">
          {formatUSD(RA14.price)}
        </span>
        <QtyStepper qty={qty} setQty={setQty} size="sm" />
        <Button className="h-9">
          <ShoppingCart className="size-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

/**
 * Showcase page shell: back link + product hero (image + buy box with the
 * primary Add-to-Cart) + the sticky-bar interaction. `children` renders the
 * variant showcase (tab or accordion designs) below the hero.
 */
export function ShowcaseShell({
  eyebrow,
  heading,
  intro,
  children,
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const [qty, setQty] = React.useState(1);
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = React.useState(false);

  React.useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Only once the CTA has scrolled ABOVE the viewport top.
        setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-svh bg-background">
      <StickyCartBar visible={showSticky} qty={qty} setQty={setQty} />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Link
          href="/pdp"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          PDP Master
        </Link>

        {heading ? (
          <div className="mt-4">
            {eyebrow ? (
              <span className="text-xs font-bold tracking-wide text-primary uppercase">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{heading}</h1>
            {intro ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{intro}</p>
            ) : null}
          </div>
        ) : null}

        {/* Product hero */}
        <div className="mt-6 grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:gap-12">
          <div className="md:sticky md:top-6">
            <div className="grid aspect-square w-full place-items-center rounded-xl border bg-white p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={RA14.image}
                alt={RA14.title}
                className="max-h-full w-auto object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <span className="text-sm font-semibold text-primary">{RA14.brand}</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-balance">
                {RA14.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-5 text-sm text-muted-foreground">
                <span>Item #: <span className="text-foreground">{RA14.item}</span></span>
                <span>MFG #: <span className="text-foreground">{RA14.mfg}</span></span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-price">{formatUSD(RA14.price)}</span>
              <span className="text-sm text-muted-foreground">/ EACH</span>
            </div>

            {/* Primary CTA — the sticky bar mirrors this once it scrolls away */}
            <div ref={ctaRef} className="flex flex-col gap-2">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-stretch gap-3">
                <QtyStepper qty={qty} setQty={setQty} />
                <Button size="lg" className="h-11 flex-1 text-base">
                  <ShoppingCart />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Variant showcase */}
        <div className="mt-14 flex flex-col gap-14">{children}</div>
      </main>
    </div>
  );
}
