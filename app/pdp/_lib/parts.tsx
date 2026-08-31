"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "./auth";
import type { PartItem } from "./types";

function PartImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="aspect-[4/3] w-full rounded-md bg-white object-contain"
      />
    );
  }
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

function PartCard({ item }: { item: PartItem }) {
  const { signedIn } = useAuth();
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <PartImage src={item.image} alt={item.title} />
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
        <a
          href="/store-locator/inventory/in-plp?v=c"
          className="text-primary"
        >
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

/** Grid of part cards, no heading — used inside the "Part Lists" tab. */
export function PartsGrid({ parts }: { parts: PartItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 min-[1200px]:grid-cols-5">
      {parts.map((it) => (
        <PartCard key={it.id} item={it} />
      ))}
    </div>
  );
}
