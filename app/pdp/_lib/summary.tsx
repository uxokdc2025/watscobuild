"use client";

import * as React from "react";
import { ListPlus, LogIn, Minus, Plus, ShoppingCart, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { stockTextClass } from "@/components/ui/label-badges";
import { useAuth } from "./auth";
import { formatUSD, type PdpCommerce, type PdpProduct } from "./types";

function Segmented({ options }: { options: string[] }) {
  const [active, setActive] = React.useState(0);
  return (
    <div className="inline-flex w-full rounded-md border bg-muted p-0.5">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={i === active}
          onClick={() => setActive(i)}
          className={cn(
            "h-9 flex-1 cursor-pointer rounded-sm px-3 text-sm font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            i === active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

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
              <li key={b.name} className="grid grid-cols-[2.5rem_1fr] items-center gap-3 text-sm">
                <span
                  className={cn(
                    "text-right tabular-nums",
                    b.qty > 0
                      ? "font-medium text-green-700 dark:text-green-400"
                      : "text-muted-foreground"
                  )}
                >
                  {b.qty}
                </span>
                <span className="text-muted-foreground">{b.name}</span>
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
  const showCommerce = signedIn && product.commerce;

  return (
    <div className="flex flex-col gap-5">
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

      {showCommerce ? (
        <>
          {product.commerce!.price != null ? (
            <>
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
            </>
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
              <Segmented options={product.commerce!.packSizes} />
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
        </>
      )}
    </div>
  );
}
