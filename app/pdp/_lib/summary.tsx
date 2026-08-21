"use client";

import * as React from "react";
import { Info, ListPlus, LogIn, Minus, Plus, Search, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BranchRow, PointsBadge, stockTextClass } from "@/components/ui/label-badges";
import { PackSizePills } from "@/components/ui/pack-size-pills";
import { useAuth } from "./auth";
import { formatUSD, formatUom, type PdpCommerce, type PdpProduct } from "./types";

function QtyStepper({
  qty,
  setQty,
}: {
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
}) {
  const btn =
    "grid h-full w-11 cursor-pointer place-items-center text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
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

// Two side-by-side boxes — Your Branch (col 1) + Nearby Branches (col 2).
// This is the standard availability pattern on every PDP. `statusLabel`
// (e.g. "Non-Sellable") replaces the stock line in the Your Branch box.
function BranchAvailability({
  commerce,
  statusLabel,
}: {
  commerce: PdpCommerce;
  statusLabel?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {commerce.yourBranch ? (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-semibold">Your Branch</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {commerce.yourBranch.name}
          </p>
          {statusLabel ? (
            <p className="mt-2 text-sm font-medium text-red-600">{statusLabel}</p>
          ) : (
            <p className={cn("mt-2 text-sm font-medium", stockTextClass(commerce.yourBranch.stock))}>
              {commerce.yourBranch.stock} in stock today
            </p>
          )}
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
          <a
            href="/store-locator/inventory/in-plp?v=c"
            className="mt-3 inline-block text-sm font-medium text-primary"
          >
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
      className="inline-flex items-center gap-1.5 rounded-md py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <ListPlus className="size-4" />
      Save to List
    </button>
  );
}

/**
 * Discovery CTA for the AHRI Matched System tool. Present on every PDP —
 * purple text link with a hover underline, matching the "AHRI" brand
 * association in the badges scale. Placed next to Save to List. */
function FindAhriMatchedSystem() {
  return (
    <a
      href="#"
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-violet-500 px-3 text-xs font-semibold text-violet-700 outline-none transition-colors hover:bg-violet-50 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-950/40"
    >
      <Search className="size-3.5" />
      Find an AHRI Matched System
    </a>
  );
}

/** Amber inline info banner — the shared "License required" style, reused for
 * any status message (license gate, replacement available, etc.). */
function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-50 p-4 text-sm dark:bg-amber-950/30">
      <Info className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" />
      <p className="text-amber-800 dark:text-amber-300">{children}</p>
    </div>
  );
}

/** Save to List + (optional) Find AHRI + (optional) Compare. The AHRI
 *  discovery link only shows on PDPs where AHRI is relevant to the product
 *  (i.e. `product.ahri` is present — either matchup-only or matched-product).
 *  It stays hidden on refrigerants, capacitors, blower motors, etc., where
 *  the page never "calls for" AHRI matching. */
function SecondaryActions({
  showFindAhri,
}: {
  showFindAhri: boolean;
}) {
  return (
    // Two-column grid mirrors the Qty-stepper (134px) + Add-to-Cart row above,
    // so Find AHRI aligns flush with the Add-to-Cart left edge and Save to
    // List sits under the qty stepper. No visual stagger between rows.
    // Compare is intentionally NOT surfaced in this secondary row (locked
    // 2026-08-18) — the buy-box already carries the value hierarchy without
    // a third CTA competing for attention.
    <div className="grid grid-cols-[134px_1fr] items-center gap-x-3 gap-y-1">
      <SaveToList />
      <div className="flex flex-wrap items-center gap-x-3">
        {showFindAhri ? <FindAhriMatchedSystem /> : null}
      </div>
    </div>
  );
}

// AHRI Matchup banner (deprecated 2026-08-12 per David — no longer a
// legitimate pattern). The buy-box no longer surfaces an "AHRI Matchup:
// {number} · View System Details" callout under the brand/title. Deep AHRI
// exploration lives in the About This Product → AHRI Matches tab; the
// "Find an AHRI Matched System" discovery link in SecondaryActions stays.
// If a matched product needs to surface as a companion buy, add it via
// `proPicks` (same shape) rather than reviving this component.

export function PdpSummary({
  product,
}: {
  product: PdpProduct;
}) {
  const { signedIn } = useAuth();
  // Shared quantity: the stepper and the pack-size pills both drive it, so
  // selecting "2 Packs (48)" sets the quantity box to 48.
  const [qty, setQty] = React.useState(1);
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
  // AHRI discovery link — the "help me find a match" CTA. Only surfaces on
  // PDPs that are explicitly *asking the shopper to discover a match*: the
  // product carries an `ahri` object (matchup number is known / expected)
  // but no `matchedProduct` is wired yet. If a matched system is already
  // wired, the AhriMatchup section below Add-to-Cart is the answer — no
  // discovery needed. If a page has `ahriEmpty: true` alone (no `ahri`), it's
  // just flagging the empty-state UI on the source page — not calling for
  // the CTA. Ref: registry-badged "AHRI Matched System" use case.
  const showFindAhri = Boolean(product.ahri) && !product.ahri?.matchedProduct;

  return (
    <div className="flex flex-col gap-4">
      {/* Brand + badges + title */}
      <div className="flex flex-col gap-2">
        <a href="#" className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline">
          {product.brand}
        </a>
        {(product.badges?.length || (signedIn && product.commerce?.points)) ? (
          <div className="flex flex-wrap gap-2">
            {product.badges?.map((b) => (
              <Badge key={b.label} variant={b.tone} color={b.color}>
                {b.label}
              </Badge>
            ))}
            {signedIn && product.commerce?.points ? (
              <PointsBadge points={product.commerce.points} />
            ) : null}
          </div>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-balance">{product.title}</h1>
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-0.5 text-sm text-muted-foreground">
          <span>Item #: <span className="text-foreground">{product.item}</span></span>
          <span>MFG #: <span className="text-foreground">{product.mfg}</span></span>
        </div>
      </div>


      {blocksPurchase ? (
        // "replaced" shows an inline amber banner; the Replacement Products
        // section fills the rest of the column below.
        product.status === "replaced" ? (
          <InfoBanner>
            A replacement product is available. See the replacement product below.
          </InfoBanner>
        ) : product.status === "non-sellable" ? (
          // Non-sellable is store-specific: blocked here, may have stock elsewhere.
          // Same 2-box availability — Your Branch carries the "Non-Sellable"
          // message; Nearby Branches shows the branch list.
          <>
            {product.commerce?.yourBranch ||
            product.commerce?.nearbyBranches?.length ? (
              <BranchAvailability
                commerce={product.commerce!}
                statusLabel={`Non-Sellable${product.store?.name ? ` at ${product.store.name}` : ""}`}
              />
            ) : (
              <div className="rounded-lg border p-4 text-sm">
                <p className="font-semibold">Availability</p>
                <p className="mt-2 font-medium text-red-600 dark:text-red-400">
                  Non-Sellable{product.store?.name ? ` at ${product.store.name}` : ""}
                </p>
              </div>
            )}
            <SecondaryActions showFindAhri={showFindAhri} />
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
          {/* License gate: purchasable once licensed — amber info banner
              (reference text, no separate "License Required" badge/box). */}
          {licenseGated ? (
            <InfoBanner>
              This item requires the necessary license in order to be purchased.
            </InfoBanner>
          ) : null}

          {showCommerce ? (
            <>
              {product.commerce!.price != null ? (
            <div className="flex flex-col gap-1.5">
              {/* Sale treatment: the "Sale" status lives in the `badges` row
                  below the brand line (docs/design-system.md §Badges). The
                  price cluster stays neutral — sale price in foreground
                  black, was-price struck through in muted. Pattern reference:
                  ecmdi.com CIRRA sale rows. */}
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-3xl font-bold text-price">
                  {formatUSD(product.commerce!.price)}
                </span>
                {product.commerce!.wasPrice != null ? (
                  <span className="text-lg font-medium text-muted-foreground line-through">
                    {formatUSD(product.commerce!.wasPrice)}
                  </span>
                ) : null}
                <span className="text-sm text-muted-foreground">
                  / {formatUom(product.commerce!.uom)}
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
              <PackSizePills
                options={product.commerce!.packSizes}
                onSelect={setQty}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-stretch gap-3">
              <QtyStepper qty={qty} setQty={setQty} />
              <Button
                size="lg"
                disabled={product.commerce!.price == null}
                className="h-12 flex-1 text-base"
              >
                <ShoppingCart />
                Add to Cart
              </Button>
            </div>
            <SecondaryActions showFindAhri={showFindAhri} />
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
          <SecondaryActions showFindAhri={showFindAhri} />
        </>
          )}
        </>
      )}
    </div>
  );
}
