"use client";

import { Info, ShoppingCart } from "lucide-react";

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

function FbtCard({ item }: { item: FbtProduct }) {
  const { signedIn } = useAuth();
  const rich = item.price != null;

  return (
    <div className="flex h-full flex-col gap-2 rounded-lg border p-4">
      <FbtImage src={item.image} alt={item.title} />
      <a href="#" className="line-clamp-3 text-sm font-semibold text-primary hover:underline">
        {item.title}
      </a>
      <p className="text-xs text-muted-foreground">
        Item: {item.item}
        <br />
        MFR: {item.mfg}
      </p>

      {rich ? (
        <>
          {signedIn ? (
            <>
              <p className="mt-1">
                <span className="text-lg font-bold">{formatUSD(item.price!)}</span>{" "}
                <span className="text-xs text-muted-foreground">/ EACH</span>
              </p>
              {item.points ? (
                <p className="text-xs font-medium text-in-stock">
                  Earn {item.points} point{item.points === 1 ? "" : "s"}
                </p>
              ) : null}
              <Button size="sm" className="mt-2 w-full">
                <ShoppingCart className="size-4" />
                Add To Cart
              </Button>
              {item.stockStatus ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs">
                  <Info className="size-3.5 text-muted-foreground" />
                  <span className="font-semibold text-in-stock">{item.stockStatus}</span>
                  <span className="text-muted-foreground">{item.stockBranch}</span>
                </p>
              ) : null}
            </>
          ) : (
            <a
              href="#"
              className="mt-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in to view pricing
            </a>
          )}
        </>
      ) : (
        <>
          <div className="text-sm">
            <span className="font-medium text-in-stock">{item.branchQty}</span>{" "}
            <span className="text-muted-foreground">{item.branchName}</span>
          </div>
          <div className="mt-auto pt-1">
            {signedIn ? (
              <Button size="sm" className="w-full">
                <ShoppingCart />
                Add to Cart
              </Button>
            ) : (
              <a
                href="#"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in to view pricing
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function FrequentlyBoughtTogether({ product }: { product: PdpProduct }) {
  if (!product.fbt?.length) return null;
  const suggest = product.detailsStyle === "about";
  return (
    <section aria-label="Frequently bought together" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight">Frequently Bought Together</h2>
        {suggest ? (
          <button
            type="button"
            className="rounded bg-slate-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Suggest Products
          </button>
        ) : null}
      </div>
      <Tabs defaultValue={product.fbt[0].label}>
        <TabsList variant="line">
          {product.fbt.map((g) => (
            <TabsTrigger key={g.label} value={g.label}>
              {g.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {product.fbt.map((g) => (
          <TabsContent key={g.label} value={g.label} className="pt-6">
            <Carousel opts={{ align: "start" }} className="mx-10">
              <CarouselContent>
                {g.items.map((it) => (
                  <CarouselItem
                    key={it.id}
                    className="basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/6"
                  >
                    <FbtCard item={it} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
