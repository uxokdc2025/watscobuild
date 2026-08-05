"use client";

import { Info, ListPlus, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
        MFG: {item.mfg}
      </p>

      <div className="mt-auto flex flex-col gap-2 pt-1">
      {rich ? (
        <>
          {signedIn ? (
            <>
              {item.stockStatus == null && item.branchName ? (
                <div className="text-xs leading-relaxed">
                  <span className="font-medium text-in-stock">{item.branchQty}</span>{" "}
                  <span className="text-muted-foreground">{item.branchName}</span>
                  <br />
                  <span className="font-medium text-in-stock">{item.nearbyQty}</span>{" "}
                  <span className="text-muted-foreground">Nearby Branches</span>
                  <br />
                  <a href="#" className="text-primary underline-offset-4 hover:underline">
                    Check Nearby Branches
                  </a>
                </div>
              ) : null}
              <p className="mt-1">
                <span className="text-lg font-bold">{formatUSD(item.price!)}</span>{" "}
                <span className="text-xs text-muted-foreground">/ EACH</span>
              </p>
              {item.points ? <PointsBadge points={item.points} /> : null}
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
          <div className="mt-1">
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
    </div>
  );
}

// 4-up grid, identical to Customers Also Purchased. Fewer than 4 items fill the
// row (min(count,4) columns); more than 4 wrap to the next row.
function FbtRail({ items }: { items: FbtProduct[] }) {
  if (!items.length) {
    return (
      <div className="rounded-md border px-6 py-5 text-sm text-muted-foreground">
        No featured products in this category.
      </div>
    );
  }
  const cols = Math.min(items.length, 4);
  const lgCols =
    cols === 1
      ? "lg:grid-cols-1"
      : cols === 2
        ? "lg:grid-cols-2"
        : cols === 3
          ? "lg:grid-cols-3"
          : "lg:grid-cols-4";
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", lgCols)}>
      {items.map((it) => (
        <FbtCard key={it.id} item={it} />
      ))}
    </div>
  );
}

export function FrequentlyBoughtTogether({ product }: { product: PdpProduct }) {
  if (!product.fbt?.length) return null;
  const suggest = product.detailsStyle === "about";
  // A single group needs no tab bar — the h2 already names the section.
  const multiGroup = product.fbt.length > 1;
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
      {multiGroup ? (
        <Tabs defaultValue={product.fbt[0].label}>
          {/* Many categories → horizontal slider so no tab clips off-screen. */}
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

function CapCard({ item }: { item: FbtProduct }) {
  const { signedIn } = useAuth();
  return (
    <div className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4">
      <FbtImage src={item.image} alt={item.title} />
      {item.brand ? (
        <p className="text-xs text-muted-foreground">{item.brand}</p>
      ) : null}
      <a href="#" className="line-clamp-2 text-sm font-semibold text-primary hover:underline">
        {item.title}
      </a>
      {item.pct != null ? (
        <p className="text-xs text-muted-foreground italic">{item.pct}% Also Purchased</p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Product: {item.item}
        <br />
        MFG: {item.mfg}
      </p>
      <div className="mt-auto flex flex-col gap-2 pt-1">
        {signedIn ? (
          <>
            {item.price != null ? (
              <p className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold">{formatUSD(item.price)}</span>
                {item.wasPrice != null ? (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatUSD(item.wasPrice)}
                  </span>
                ) : null}
              </p>
            ) : null}
            <div className="text-xs leading-relaxed">
              <span className="font-medium text-in-stock">
                {item.branchQty} {item.branchName}
              </span>
              <br />
              <span className="font-medium text-in-stock">
                {item.allBranchesQty ?? item.nearbyQty} All Branches
              </span>
            </div>
            <Button size="sm" className="w-full">
              <ShoppingCart className="size-4" />
              Add To Cart
            </Button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ListPlus className="size-3.5" />
              Save to List
            </button>
          </>
        ) : (
          <a href="#" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Sign in to view pricing
          </a>
        )}
      </div>
    </div>
  );
}

export function CustomersAlsoPurchased({ product }: { product: PdpProduct }) {
  if (!product.customersAlsoPurchased?.length) return null;
  return (
    <section aria-label="Customers also purchased" className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Customers Also Purchased</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {product.customersAlsoPurchased.map((it) => (
          <CapCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
