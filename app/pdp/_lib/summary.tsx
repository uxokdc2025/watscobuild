"use client";

import * as React from "react";
import { Info, ListPlus, LogIn, Minus, Plus, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BranchRow, PointsBadge, stockTextClass } from "@/components/ui/label-badges";
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

// Single stacked card (your branch, then nearby branches below) — the branch
// availability is never split into two side-by-side columns.
function BranchAvailability({ commerce }: { commerce: PdpCommerce }) {
  return (
    <div className="rounded-lg border p-4 text-sm">
      {commerce.yourBranch ? (
        <div>
          <p className="font-semibold">Your Branch</p>
          <p className="mt-1 text-muted-foreground">{commerce.yourBranch.name}</p>
          <p className={cn("mt-2 font-medium", stockTextClass(commerce.yourBranch.stock))}>
            {commerce.yourBranch.stock} in stock today
          </p>
        </div>
      ) : null}
      {commerce.nearbyBranches?.length ? (
        <div className={commerce.yourBranch ? "mt-4 border-t pt-4" : undefined}>
          <p className="font-semibold">Nearby Branches</p>
          <ul className="mt-2 flex flex-col gap-1">
            {commerce.nearbyBranches.map((b) => (
              <li key={b.name}>
                <BranchRow qty={b.qty} name={b.name} />
              </li>
            ))}
          </ul>
          <a href="#" className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline">
            View All Branches
          </a>
        </div>
      ) : null}
    </div>
  );
}

function SaveToList() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <ListPlus className="size-4" />
      Save to List
    </button>
  );
}

/** Save to List + (optional) Compare — both links, Save to List first. */
function SecondaryActions({ showCompare }: { showCompare: boolean }) {
  return (
    <div className="-ml-1 flex flex-wrap items-center gap-x-3 gap-y-1">
      <SaveToList />
      {showCompare ? <CompareButton /> : null}
    </div>
  );
}

export function PdpSummary({
  product,
  showCompare = false,
}: {
  product: PdpProduct;
  showCompare?: boolean;
}) {
  const { signedIn } = useAuth();
  // ── Buy-box VALUE HIERARCHY (see project_pdp_value_hierarchy memory) ──
  // Any price- or product-value message (rebate, sale, points, was-price)
  // belongs in the high-value zone: the solid badge row up top or the price
  // cluster — never demoted to a muted callout below the branch cards.
  //
  // Status taxonomy:
  //  - blocksPurchase  → item can't be transacted online: hide price + cart,
  //    show a status callout (red = hard stop for non-sellable).
  //  - requires-license → fully purchasable once licensed: keep full commerce
  //    and surface an amber info banner above the price cluster.
  const blocksPurchase =
    product.status === "non-sellable" ||
    product.status === "replaced" ||
    product.status === "discontinued";
  const licenseGated = product.status === "requires-license";
  const showCommerce = signedIn && product.commerce && !blocksPurchase;

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

      {product.ahri ? (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm">
          <span className="font-semibold">
            AHRI Matchup: {product.ahri.number}
          </span>
          <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
            View System Details
          </a>
        </div>
      ) : product.ahriEmpty ? (
        <div className="rounded-lg border px-3 py-2.5 text-sm text-muted-foreground">
          No AHRI Matchups Found
        </div>
      ) : null}

      {blocksPurchase ? (
        // "replaced" hands its column to the Replacement Products section (no box).
        product.status === "replaced" ? null : product.status ===
          "non-sellable" ? (
          // Non-sellable is store-specific: blocked here, may have stock elsewhere.
          <>
            <div className="rounded-lg border p-4 text-sm">
              <p className="font-semibold">Availability</p>
              <p className="mt-2 font-medium text-red-600 dark:text-red-400">
                Non-Sellable{product.store?.name ? ` at ${product.store.name}` : ""}
              </p>
              {product.nonSellableAllBranchesQty != null ? (
                <p className="mt-1 font-medium text-in-stock">
                  {product.nonSellableAllBranchesQty} at All Branches
                </p>
              ) : null}
              <a
                href="#"
                className="mt-2 inline-block font-medium text-red-600 underline-offset-4 hover:underline dark:text-red-400"
              >
                View All Branches
              </a>
            </div>
            <SecondaryActions showCompare={showCompare} />
          </>
        ) : (
          <div className="rounded-lg border border-amber-500/40 bg-amber-50 p-4 text-sm dark:bg-amber-950/30">
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              Discontinued
            </p>
            <p className="mt-1 text-muted-foreground">
              This item has been discontinued and is no longer available.
            </p>
          </div>
        )
      ) : (
        <>
          {/* License gate: purchasable once licensed — neutral info banner
              matching the reference (no badge, no amber "required" box). */}
          {licenseGated ? (
            <div className="flex items-start gap-2 rounded-lg border bg-muted/50 p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">
                This item requires the necessary license in order to be purchased.
              </p>
            </div>
          ) : null}

          {showCommerce ? (
            <>
              {product.commerce!.price != null ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-price">
                  {formatUSD(product.commerce!.price)}
                </span>
                {product.commerce!.wasPrice != null ? (
                  <span className="pb-1 text-lg font-medium text-muted-foreground line-through">
                    {formatUSD(product.commerce!.wasPrice)}
                  </span>
                ) : null}
                <span className="pb-1 text-sm text-muted-foreground">
                  /{product.commerce!.uom}
                </span>
              </div>
              {product.commerce!.points ? (
                <PointsBadge points={product.commerce!.points} />
              ) : null}
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
            </div>
            <SecondaryActions showCompare={showCompare} />
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
          <Button size="lg" className="h-12 w-full text-base">
            <LogIn />
            Sign in to view pricing
          </Button>
          <SecondaryActions showCompare={showCompare} />
        </>
          )}
        </>
      )}
    </div>
  );
}
