"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "./auth";
import { ProductCard, type ProductCardData } from "./product-card";
import type { FbtProduct, PdpProduct } from "./types";

/** Map an `FbtProduct` (used in FBT + Customers Also Purchased data) into the
 *  canonical `ProductCardData` shape the shared ProductCard component expects. */
function toCardData(item: FbtProduct): ProductCardData {
  return {
    id: item.id,
    brand: item.brand,
    title: item.title,
    item: item.item,
    mfg: item.mfg,
    image: item.image,
    price: item.price,
    wasPrice: item.wasPrice,
    points: item.points,
    pct: item.pct,
    yourBranchQty: item.branchQty,
    nearbyBranchQty: item.allBranchesQty ?? item.nearbyQty,
  };
}

// Cards are always sized 4-up (1/4 width). ≤4 items just show; >4 hide the
// overflow inside a carousel with prev/next arrows.
function FbtRail({ items }: { items: FbtProduct[] }) {
  const { signedIn } = useAuth();
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
            <ProductCard data={toCardData(it)} signedIn={signedIn} />
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
  const { signedIn } = useAuth();
  if (!product.customersAlsoPurchased?.length) return null;
  return (
    <section aria-label="Customers also purchased" className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">Customers Also Purchased</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {product.customersAlsoPurchased.map((it) => (
          <ProductCard key={it.id} data={toCardData(it)} signedIn={signedIn} />
        ))}
      </div>
    </section>
  );
}
