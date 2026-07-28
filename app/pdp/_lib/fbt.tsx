"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "./auth";
import type { FbtProduct, PdpProduct } from "./types";

function FbtImage() {
  return (
    <div
      className="grid aspect-[4/3] w-full place-items-center rounded-md text-xs text-muted-foreground"
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
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <FbtImage />
      <h3 className="line-clamp-3 text-sm font-semibold">{item.title}</h3>
      <p className="text-xs text-muted-foreground">
        Item: {item.item}
        <br />
        MFG: {item.mfg}
      </p>
      <div className="text-sm">
        <span className="font-medium text-in-stock">{item.branchQty}</span>{" "}
        <span className="text-muted-foreground">{item.branchName}</span>
      </div>
      <div className="text-sm">
        <span className="font-medium text-in-stock">{item.nearbyQty}</span>{" "}
        <a href="#" className="text-primary underline-offset-4 hover:underline">
          Check Nearby Branches
        </a>
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
    </div>
  );
}

export function FrequentlyBoughtTogether({ product }: { product: PdpProduct }) {
  if (!product.fbt?.length) return null;
  return (
    <section aria-label="Frequently bought together" className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Frequently Bought Together</h2>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {g.items.map((it) => (
                <FbtCard key={it.id} item={it} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
