"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselHeader,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

/** Product rail. Title sits on the left of a header row; the prev/next
 *  arrows sit top-right of that same row as clearly-visible DS buttons that
 *  disable (dim, not clickable) at the ends of the track. Cards use the
 *  shared `ProductCard`, whose fixed-height slots keep every card in a row
 *  the same height. Pagination dots sit centered below for swipe feedback. */
export function CarouselStrip({
  items,
  title,
  extraHeader,
  hideHeader,
  onApiChange,
}: {
  items: FbtProduct[];
  title?: React.ReactNode;
  extraHeader?: React.ReactNode;
  /** When the arrows live on an outer row (e.g. the tab row), skip the
   *  strip's own header so there's no empty band above the cards. */
  hideHeader?: boolean;
  /** Surface this strip's Embla api so an outer control row can drive it. */
  onApiChange?: (api: CarouselApi | undefined) => void;
}) {
  const { signedIn } = useAuth();
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  const [snaps, setSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    onApiChange?.(api);
    if (!api) return;
    const sync = () => {
      setSelected(api.selectedScrollSnap());
      setSnaps(api.scrollSnapList());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
  }, [api, onApiChange]);

  if (!items.length) {
    return (
      <div className="rounded-md border px-6 py-5 text-sm text-muted-foreground">
        No featured products in this category.
      </div>
    );
  }

  const showControls = snaps.length > 1;

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start" }}
      className="flex flex-col gap-3 overflow-x-clip"
    >
      {!hideHeader && (title || extraHeader || showControls) && (
        <CarouselHeader>
          <div className="flex flex-wrap items-center gap-3">
            {title}
            {extraHeader}
          </div>
          {showControls ? <CarouselControls /> : null}
        </CarouselHeader>
      )}
      {/* Up to five cards per view — same dense product-row pattern as the
          PLP while the PDP canvas remains capped at 1400px. */}
      <CarouselContent className="ml-0 gap-4 [&>*]:pl-0">
        {items.map((it) => (
          <CarouselItem
            key={it.id}
            className="basis-full sm:basis-[calc(50%-8px)] lg:basis-[calc(25%-12px)] min-[1200px]:basis-[calc(20%-13px)]"
          >
            <ProductCard data={toCardData(it)} signedIn={signedIn} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {showControls ? (
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
    </Carousel>
  );
}

export function FrequentlyBoughtTogether({ product }: { product: PdpProduct }) {
  if (!product.fbt?.length) return null;
  const suggest = product.detailsStyle === "about";
  const multiGroup = product.fbt.length > 1;
  const suggestBtn = suggest ? (
    <Button type="button" variant="secondary" size="sm">
      Suggest Products
    </Button>
  ) : null;
  const heading = (
    <h2 className="text-xl font-bold tracking-tight">Frequently Bought Together</h2>
  );

  // Single group: the heading + Suggest button live in the strip's own header
  // row so the prev/next arrows sit top-right, aligned with the title.
  if (!multiGroup) {
    return (
      <section aria-label="Frequently bought together">
        <CarouselStrip
          items={product.fbt[0].items}
          title={heading}
          extraHeader={suggestBtn}
        />
      </section>
    );
  }

  // Multiple groups: heading stays above the tabs; the prev/next arrows sit on
  // the tab row itself (tabs left, arrows right) driving the active tab's
  // carousel — no empty header band between the tabs and the cards.
  return (
    <MultiGroupFbt product={product} heading={heading} suggestBtn={suggestBtn} />
  );
}

function MultiGroupFbt({
  product,
  heading,
  suggestBtn,
}: {
  product: PdpProduct;
  heading: React.ReactNode;
  suggestBtn: React.ReactNode;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const sync = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
  }, [api]);

  const overflow = canPrev || canNext;

  return (
    <section aria-label="Frequently bought together" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {heading}
        {suggestBtn}
      </div>
      <Tabs defaultValue={product.fbt![0].label}>
          <div className="flex flex-wrap items-center justify-between gap-3">
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
            {product.fbt!.map((g) => (
              <TabsTrigger key={g.label} value={g.label}>
                {g.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {overflow ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Previous"
                disabled={!canPrev}
                onClick={() => api?.scrollPrev()}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Next"
                disabled={!canNext}
                onClick={() => api?.scrollNext()}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ) : null}
          </div>
          {product.fbt!.map((g) => (
            <TabsContent key={g.label} value={g.label} className="mt-3">
              <CarouselStrip items={g.items} hideHeader onApiChange={setApi} />
            </TabsContent>
          ))}
        </Tabs>
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
