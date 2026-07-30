"use client";

import * as React from "react";
import { ListPlus, LogIn, Minus, Plus, ShoppingCart, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BranchRow, stockTextClass } from "@/components/ui/label-badges";
import { CompareButton } from "@/components/ui/compare-button";
import { PackSizePills } from "@/components/ui/pack-size-pills";
import { useAuth } from "./auth";
import { formatUSD, type PdpCommerce, type PdpProduct } from "./types";

function QtyStepper() {
  const [qty, setQty] = React.useState(1);
  const btn =
    "grid h-full w-11 cursor-pointer place-items-center text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
  return (
    <div className="inline-flex h-12 shrink-0 items-center rounded-md border" role="group" aria-label="Quantity">
      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity" className={cn(btn, "rounded-l-md")}>
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="grid h-full w-11 place-items-center border-x text-sm font-medium tabular-nums">
        {qty}
      </span>
      <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity" className={cn(btn, "rounded-r-md")}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function BranchAvailability({ commerce }: { commerce: PdpCommerce }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {commerce.yourBranch ? (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-semibold">Your Branch</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {commerce.yourBranch.name}
          </p>
          <p className={cn("mt-2 text-sm font-medium", stockTextClass(commerce.yourBranch.stock))}>
            {commerce.yourBranch.stock} in stock today
          </p>
        </div>
      ) : null}
      {commerce.nearbyBranches?.length ? (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-semibold">Nearby Branches</p>
          <ul className="mt-2 flex flex-col gap-1">
            {commerce.nearbyBranches.map((b) => (
              <li key={b.name}>
                <BranchRow qty={b.qty} name={b.name} />
              </li>
            ))}
          </ul>
          <a href="#" className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            View All Branches
          </a>
        </div>
      ) : null}
    </div>
  );
}

function SaveToList() {
  return (
    <Button variant="outline" size="lg" className="h-12">
      <ListPlus />
      Save to List
    </Button>
  );
}

export function PdpSummary({ product }: { product: PdpProduct }) {
  const { signedIn } = useAuth();
  const nonSellable = product.status != null;
  const showCommerce = signedIn && product.commerce && !nonSellable;
  const STATUS_COPY: Record<string, string> = {
    replaced: "This item has been replaced. See the replacement product below.",
    discontinued: "This item has been discontinued and is no longer available.",
    "non-sellable": "This item is not available for online purchase.",
    "requires-license": "A valid license is required to purchase this item.",
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Brand + badges + title */}
      <div className="flex flex-col gap-2">
        <a href="#" className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline">
          {product.brand}
        </a>
        {product.badges?.length ? (
          <div className="flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <Badge key={b.label} variant={b.tone} color={b.color}>
                {b.label}
              </Badge>
            ))}
          </div>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-balance">{product.title}</h1>
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-0.5 text-sm text-muted-foreground">
          <span>Item #: <span className="text-foreground">{product.item}</span></span>
          <span>MFG #: <span className="text-foreground">{product.mfg}</span></span>
        </div>
      </div>

      {nonSellable ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-50 p-4 text-sm dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-300">
            {product.status === "replaced"
              ? "Replacement Product Available"
              : product.status === "requires-license"
                ? "License Required"
                : product.status === "discontinued"
                  ? "Discontinued"
                  : "Not Available for Purchase"}
          </p>
          <p className="mt-1 text-muted-foreground">
            {STATUS_COPY[product.status!]}
          </p>
        </div>
      ) : showCommerce ? (
        <>
          {product.commerce!.price != null ? (
            <div className="flex flex-col gap-1.5">
              {product.commerce!.packSizes?.length ? (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="size-4 text-primary" />
                  Buy more and save
                </div>
              ) : null}
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-price">
                  {formatUSD(product.commerce!.price)}
                </span>
                <span className="pb-1 text-sm text-muted-foreground">
                  /{product.commerce!.uom}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-muted-foreground">
              Price not available
            </div>
          )}

          {product.commerce!.fulfillmentNote ? (
            <div className="flex flex-col gap-3 text-sm">
              {["Pickup", "Delivery"].map((m) => (
                <div key={m}>
                  <p className="font-semibold">{m}</p>
                  <p className="text-low-stock">{product.commerce!.fulfillmentNote}</p>
                </div>
              ))}
            </div>
          ) : null}

          {product.commerce!.yourBranch ||
          product.commerce!.nearbyBranches?.length ? (
            <BranchAvailability commerce={product.commerce!} />
          ) : null}

          {product.commerce!.packSizes?.length ? (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Pack Size</span>
              <PackSizePills options={product.commerce!.packSizes} />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-stretch gap-3">
              <QtyStepper />
              <Button
                size="lg"
                disabled={product.commerce!.price == null}
                className="h-12 flex-1 text-base"
              >
                <ShoppingCart />
                Add to Cart
              </Button>
              <SaveToList />
            </div>
            <CompareButton className="-ml-1 self-start" />
          </div>
        </>
      ) : (
        <>
          <Separator />
          <div className="rounded-lg border bg-muted/40 p-4 text-sm">
            <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
              Sign in
            </a>
            <span className="text-muted-foreground"> to view pricing and inventory.</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 flex-1 text-base">
              <LogIn />
              Sign in to view pricing
            </Button>
            <SaveToList />
          </div>
          <CompareButton className="-ml-1 self-start" />
        </>
      )}
    </div>
  );
}
