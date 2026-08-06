"use client";

import * as React from "react";
import { ListPlus, Minus, Plus, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PointsBadge } from "@/components/ui/label-badges";
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

/** "Nearby Branches" — a link that opens a branch-availability drawer. */
function NearbyBranchesLink({ item }: { item: FbtProduct }) {
  const nearby = item.allBranchesQty ?? item.nearbyQty;
  const storeName = item.branchName || item.stockBranch;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="block text-left font-medium text-primary underline-offset-4 hover:underline"
        >
          {nearby} Nearby Branches
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Branch Availability</SheetTitle>
          <SheetDescription className="line-clamp-2">{item.title}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 text-sm">
          <div className="rounded-lg border p-3">
            <p className="font-semibold">Your Branch</p>
            <p className="mt-0.5 text-muted-foreground">{storeName}</p>
            <p className="mt-1 font-medium text-in-stock">{item.branchQty} in stock</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-semibold">Nearby Branches</p>
            <p className="mt-1 font-medium text-in-stock">
              {nearby} available across nearby branches
            </p>
            <a
              href="#"
              className="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View all branches
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Compact quantity box + mini (icon-only) Add-to-Cart, side by side. */
function QtyMiniAdd() {
  const [qty, setQty] = React.useState(1);
  const step =
    "grid h-9 w-8 place-items-center text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div className="flex items-stretch gap-2">
      <div className="inline-flex h-9 shrink-0 items-center rounded-md border" role="group" aria-label="Quantity">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity" className={cn(step, "rounded-l-md")}>
          <Minus className="size-3.5" />
        </button>
        <span aria-live="polite" className="w-7 text-center text-sm font-medium tabular-nums">{qty}</span>
        <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity" className={cn(step, "rounded-r-md")}>
          <Plus className="size-3.5" />
        </button>
      </div>
      <Button size="sm" aria-label="Add to cart" title="Add to cart" className="h-9 flex-1">
        <ShoppingCart className="size-4" />
      </Button>
    </div>
  );
}

/**
 * GLOBAL product card (Frequently Bought Together + Customers Also Purchased).
 * Order: image → brand → title (≤3 lines) → Product/MFG → your store +
 * Nearby Branches (drawer link) → price/sale → qty + mini add → Save to List.
 * Everything from Product/MFG down is pinned (mt-auto) so it aligns across cards.
 */
function ProductCard({ item }: { item: FbtProduct }) {
  const { signedIn } = useAuth();
  const onSale = item.wasPrice != null;
  const nearby = item.allBranchesQty ?? item.nearbyQty;

  return (
    <div className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4">
      <FbtImage src={item.image} alt={item.title} />
      {item.brand ? (
        <p className="text-xs text-muted-foreground">{item.brand}</p>
      ) : null}
      <a
        href="#"
        className="line-clamp-3 text-sm font-semibold text-primary hover:underline"
      >
        {item.title}
      </a>

      {/* Pinned block — aligns across every card in the row */}
      <div className="mt-auto flex flex-col gap-2 pt-1">
        {/* Product / MFG — always together */}
        <div className="text-xs text-muted-foreground">
          <p>Product: <span className="text-foreground">{item.item}</span></p>
          <p>MFG: <span className="text-foreground">{item.mfg}</span></p>
        </div>

        {signedIn ? (
          <>
            {/* Stock: line 1 = your store, line 2 = Nearby Branches (drawer) */}
            <div className="text-xs leading-relaxed">
              {item.branchName ? (
                <p className="font-medium text-in-stock">
                  {item.branchQty} {item.branchName}
                </p>
              ) : item.stockBranch ? (
                <p className="font-medium text-in-stock">
                  {item.stockStatus} · {item.stockBranch}
                </p>
              ) : null}
              {nearby ? <NearbyBranchesLink item={item} /> : null}
            </div>

            {/* Price / sale / strikethrough */}
            {item.price != null ? (
              <p className="flex flex-wrap items-baseline gap-1.5">
                <span className={cn("text-base font-bold", onSale && "text-red-600 dark:text-red-500")}>
                  {formatUSD(item.price)}
                </span>
                {onSale ? (
                  <>
                    <span className="text-xs font-bold text-red-600 dark:text-red-500">Sale</span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatUSD(item.wasPrice!)}
                    </span>
                  </>
                ) : null}
              </p>
            ) : null}
            {item.points ? <PointsBadge points={item.points} /> : null}

            {/* Qty + mini add */}
            <QtyMiniAdd />

            {/* Save to List */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ListPlus className="size-3.5" />
              Save to List
            </button>
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
