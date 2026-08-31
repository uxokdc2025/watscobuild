"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
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
    branchName: item.branchName,
    nearbyBranchQty: item.allBranchesQty ?? item.nearbyQty,
  };
}

/** First card aligns flush-left with the surrounding container (no
 *  wrapper padding). Arrows overlay on the L/R edges of the first/last
 *  visible card, vertically centered. Default state = translucent
 *  outline; hover fills with primary blue. Dots sit centered below. */
export function CarouselStrip({
  items,
  title,
  extraHeader,
}: {
  items: FbtProduct[];
  title?: React.ReactNode;
  extraHeader?: React.ReactNode;
}) {
  const { signedIn } = useAuth();
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  const [snaps, setSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!api) return;
    const sync = () => {
      setSelected(api.selectedScrollSnap());
      setSnaps(api.scrollSnapList());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
  }, [api]);

  if (!items.length) {
    return (
      <div className="rounded-md border px-6 py-5 text-sm text-muted-foreground">
        No featured products in this category.
      </div>
    );
  }

  const arrowClass = cn(
    "size-10 rounded-full border-border bg-background/80 text-foreground shadow-sm backdrop-blur",
    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
    "disabled:opacity-40",
    // Arrows sit 44px above vertical center so they visually land on the
    // image band of the cards, not the price/CTA cluster.
    "top-[calc(50%-44px)]",
  );

  return (
    <div className="flex flex-col gap-3">
      {(title || extraHeader) && (
        <div className="flex flex-wrap items-center gap-3">
          {title}
          {extraHeader}
        </div>
      )}
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{ align: "start" }}
          className="overflow-x-clip"
        >
          {/* Four cards keep PDP recommendation rails readable within the
              intentionally capped 1400px product canvas. */}
          <CarouselContent className="ml-0 gap-4 [&>*]:pl-0">
            {items.map((it) => (
              <CarouselItem
                key={it.id}
                className="basis-full sm:basis-[calc(50%-8px)] lg:basis-[calc(25%-12px)]"
              >
                <ProductCard data={toCardData(it)} signedIn={signedIn} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {snaps.length > 1 ? (
            <>
              <CarouselPrevious
                aria-label="Previous"
                className={cn(arrowClass, "left-0 -translate-x-1/2")}
              />
              <CarouselNext
                aria-label="Next"
                className={cn(arrowClass, "right-0 translate-x-1/2")}
              />
            </>
          ) : null}
        </Carousel>
      </div>
      {snaps.length > 1 ? (
        <div className="flex items-center justify-center gap-1.5">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selected
                  ? "w-6 bg-foreground"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Back-compat alias — some content still calls FbtRail.
const FbtRail = ({ items }: { items: FbtProduct[] }) => (
  <CarouselStrip items={items} />
);

export function FrequentlyBoughtTogether({ product }: { product: PdpProduct }) {
  if (!product.fbt?.length) return null;
  const suggest = product.detailsStyle === "about";
  const multiGroup = product.fbt.length > 1;
  return (
    <section aria-label="Frequently bought together" className="flex flex-col gap-3">
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
          <TabsList
            className={cn(
              // Track: rounded pill container, subtle muted background, small
              // inset padding, gap between chips.
              "!h-auto w-fit gap-1 overflow-x-auto rounded-2xl border border-border bg-muted/40 p-1",
              // Trigger: chip inside the track — transparent by default,
              // rounded-xl so active chip pops.
              "[&_[data-slot=tabs-trigger]]:relative",
              "[&_[data-slot=tabs-trigger]]:h-9",
              "[&_[data-slot=tabs-trigger]]:shrink-0",
              "[&_[data-slot=tabs-trigger]]:flex-none",
              "[&_[data-slot=tabs-trigger]]:rounded-xl",
              "[&_[data-slot=tabs-trigger]]:border-0",
              "[&_[data-slot=tabs-trigger]]:bg-transparent",
              "[&_[data-slot=tabs-trigger]]:px-3.5",
              "[&_[data-slot=tabs-trigger]]:text-sm",
              "[&_[data-slot=tabs-trigger]]:font-medium",
              "[&_[data-slot=tabs-trigger]]:text-muted-foreground",
              "[&_[data-slot=tabs-trigger]]:shadow-none",
              "[&_[data-slot=tabs-trigger]]:after:content-none",
              "[&_[data-slot=tabs-trigger]:hover]:text-foreground",
              // Active: primary blue pill with white text + soft shadow.
              "[&_[data-slot=tabs-trigger][data-state=active]]:bg-primary",
              "[&_[data-slot=tabs-trigger][data-state=active]]:text-primary-foreground",
              "[&_[data-slot=tabs-trigger][data-state=active]]:shadow-sm",
            )}
          >
            {product.fbt.map((g) => (
              <TabsTrigger key={g.label} value={g.label}>
                {g.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {product.fbt.map((g) => (
            <TabsContent key={g.label} value={g.label} className="mt-4">
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
    <section aria-label="Customers also purchased">
      <CarouselStrip
        items={product.customersAlsoPurchased}
        title={
          <h2 className="text-xl font-bold tracking-tight">Customers Also Purchased</h2>
        }
      />
    </section>
  );
}
