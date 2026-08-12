"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "./auth";
import { formatUSD, type FbtProduct, type PdpProduct } from "./types";

function FbtImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="aspect-square w-full rounded-md bg-white object-contain"
      />
    );
  }
  return (
    <div
      className="grid aspect-square w-full place-items-center rounded-md text-xs text-muted-foreground"
      style={{
        backgroundColor: "var(--muted)",
        backgroundImage:
          "repeating-linear-gradient(45deg, color-mix(in oklch, var(--muted-foreground) 12%, transparent) 0 8px, transparent 8px 16px)",
      }}
      aria-hidden
    >
      <span className="font-mono">[ Product Image ]</span>
    </div>
  );
}


/**
 * GLOBAL product card — the one canonical treatment used everywhere a product
 * appears as a card: PLP grid (/search), Frequently Bought Together, Customers
 * Also Purchased. Matches the pattern established on /search:
 *   image → brand (blue link) → title (≤3 lines, black bold, blue on hover)
 *     → Item / MFG (label: value stacked)
 *     → price + / EACH (sale badge in the badges row, price stays neutral)
 *     → Earn N points (plain text — no violet badge chip here)
 *     → In stock · N All Branches (single green line, `allBranchesQty` when
 *       present, else `nearbyQty`)
 *     → Add to Cart (full-width primary, no qty stepper on the card)
 * Signed-out state collapses commerce to a single "Sign in" gated link.
 * Everything from Item/MFG down is pinned (mt-auto) so cards align in a row.
 * If you're rendering a product-as-card anywhere else, use this — do NOT
 * add a second "global" pattern.
 */
function ProductCard({ item }: { item: FbtProduct }) {
  const { signedIn } = useAuth();
  const onSale = item.wasPrice != null;
  const allBranches = item.allBranchesQty ?? item.nearbyQty;

  return (
    <div className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4">
      <FbtImage src={item.image} alt={item.title} />
      {item.brand ? (
        <a
          href="#"
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          {item.brand}
        </a>
      ) : null}
      <a
        href="#"
        className="line-clamp-3 text-sm font-semibold text-foreground hover:text-primary"
      >
        {item.title}
      </a>

      {/* Pinned block — aligns across every card in the row */}
      <div className="mt-auto flex flex-col gap-2 pt-1">
        {/* Item / MFG — always together (label: value) */}
        <div className="text-xs text-muted-foreground">
          <p>Item: <span className="text-foreground">{item.item}</span></p>
          <p>MFG: <span className="text-foreground">{item.mfg}</span></p>
        </div>

        {signedIn ? (
          <>
            {/* Price / sale / strikethrough */}
            {item.price != null ? (
              <p className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-base font-bold text-price">
                  {formatUSD(item.price)}
                </span>
                <span className="text-xs text-muted-foreground">/ EACH</span>
                {onSale ? (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatUSD(item.wasPrice!)}
                  </span>
                ) : null}
              </p>
            ) : null}

            {/* Points — plain text */}
            {item.points ? (
              <p className="text-xs font-medium text-foreground">
                Earn {item.points.toLocaleString()} points
              </p>
            ) : null}

            {/* Stock — single green line */}
            {allBranches != null ? (
              <p className="text-xs font-medium text-in-stock">
                In stock · {allBranches.toLocaleString()} All Branches
              </p>
            ) : null}

            {/* Add to Cart — full-width primary */}
            <Button size="sm" className="mt-1 w-full">
              <ShoppingCart className="size-4" />
              Add to Cart
            </Button>
          </>
        ) : (
          <a
            href="#"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in to view pricing
          </a>
        )}
      </div>
    </div>
  );
}

// Cards are always sized 4-up (1/4 width). ≤4 items just show; >4 hide the
// overflow inside a carousel with prev/next arrows.
function FbtRail({ items }: { items: FbtProduct[] }) {
  if (!items.length) {
    return (
      <div className="rounded-md border px-6 py-5 text-sm text-muted-foreground">
        No featured products in this category.
      </div>
    );
  }
  const scrollable = items.length > 4;
  return (
    <Carousel opts={{ align: "start" }} className={scrollable ? "mx-10" : ""}>
      <CarouselContent>
        {items.map((it) => (
          <CarouselItem key={it.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
            <ProductCard item={it} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {scrollable ? (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      ) : null}
    </Carousel>
  );
}

export function FrequentlyBoughtTogether({ product }: { product: PdpProduct }) {
  if (!product.fbt?.length) return null;
  const suggest = product.detailsStyle === "about";
  const multiGroup = product.fbt.length > 1;
  return (
    <section aria-label="Frequently bought together" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight">Frequently Bought Together</h2>
        {suggest ? (
          <button
            type="button"
            className="rounded bg-slate-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Suggest Products
          </button>
        ) : null}
      </div>
      {multiGroup ? (
        <Tabs defaultValue={product.fbt[0].label}>
          <TabsList variant="line" className="gap-4 overflow-x-auto">
            {product.fbt.map((g) => (
              <TabsTrigger key={g.label} value={g.label}>
                {g.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {product.fbt.map((g) => (
            <TabsContent key={g.label} value={g.label} className="pt-6">
              <FbtRail items={g.items} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="pt-2">
          <FbtRail items={product.fbt[0].items} />
        </div>
      )}
    </section>
  );
}

export function CustomersAlsoPurchased({ product }: { product: PdpProduct }) {
  if (!product.customersAlsoPurchased?.length) return null;
  return (
    <section aria-label="Customers also purchased" className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">Customers Also Purchased</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {product.customersAlsoPurchased.map((it) => (
          <ProductCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
