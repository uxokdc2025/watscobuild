"use client";

/**
 * Search / PLP list view — what the List toggle (`?view=list`) renders.
 *
 * Every row is the design system's list-view product card
 * (`@/components/ui/product-list-row`, documented at /components/list-views):
 * image, capped description, availability as its own centered column, price +
 * Add. Nothing else — no attribute/comparison tables, no family header
 * sections, and no Compare checkbox (the DS card has none).
 *
 * This file is the ADAPTER only. App concerns live here: the signed-in price
 * gate, the cart wiring, Homans' contact-for-availability behavior. Layout is
 * the DS card's.
 */

import * as React from "react";
import Link from "next/link";
import { Info, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductListRow } from "@/components/ui/product-list-row";
import { InventoryLine } from "@/app/ahri/_lib/parts";
import { useCart } from "@/components/cart/cart-context";
import { formatUSD } from "@/app/pdp/_lib/types";

import type { SearchResult } from "./mock-data";
import { productImageFor } from "./product-images";

export function SearchListView({
  results,
  signedIn,
  brandKey,
  storeName,
  signInHref,
}: {
  results: SearchResult[];
  signedIn: boolean;
  /** Picks the image manifest, exactly as the grid cards do. */
  brandKey: string;
  /** Branch label for the availability line, e.g. "Manchester, NH - Homans". */
  storeName: string;
  /** Current URL with `signedin=1` — the gated-price link target. */
  signInHref: string;
}) {
  if (!results.length) return null;

  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-background">
      {results.map((result, i) => (
        <li key={result.id}>
          <ResultRow
            result={result}
            image={productImageFor(brandKey, i, result.image)}
            signedIn={signedIn}
            storeName={storeName}
            signInHref={signInHref}
          />
        </li>
      ))}
    </ul>
  );
}

function ResultRow({
  result,
  image,
  signedIn,
  storeName,
  signInHref,
}: {
  result: SearchResult;
  image: string;
  signedIn: boolean;
  storeName: string;
  signInHref: string;
}) {
  const { addItem } = useCart();
  const href = result.href ?? `/pdp/tradepro-${result.item.toLowerCase()}`;
  // Price is gated to logged-in (repo-wide rule); availability rides with it,
  // matching the grid card's signed-out state.
  const hasCommerce = signedIn && result.price != null;
  // Same convention as the grid card: a stocked SKU shows 2 at your branch.
  const branchQty = result.stockStatus === "out-of-stock" ? 0 : 2;

  return (
    <ProductListRow
      image={image}
      imageAlt={result.title}
      brand={result.brand}
      title={
        <Link href={href} className="text-primary underline-offset-2 hover:underline">
          {result.title}
        </Link>
      }
      item={result.item}
      mfg={result.mfg}
      availability={
        hasCommerce ? (
          result.contactForAvailability ? (
            <ContactForAvailability />
          ) : (
            <InventoryLine
              branchQty={branchQty}
              branchName={storeName}
              allBranchesQty={result.allBranchesQty ?? 0}
            />
          )
        ) : undefined
      }
      actions={
        hasCommerce ? (
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
            <p className="text-base font-semibold text-price">
              {formatUSD(result.price!)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
            </p>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                addItem({
                  id: result.id,
                  title: result.title,
                  brand: result.brand,
                  item: result.item,
                  mfg: result.mfg,
                  image,
                  price: result.price ?? 0,
                })
              }
            >
              <ShoppingCart className="size-4 shrink-0" />
              Add
            </Button>
          </div>
        ) : (
          <Link
            href={signInHref}
            className="inline-flex h-9 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in to View Pricing
          </Link>
        )
      }
    />
  );
}

/** Homans never shows out-of-stock: flagged SKUs swap the availability lines
 *  for the same "Limited Availability / Contact Us" affordance the cards use. */
function ContactForAvailability() {
  return (
    <div className="space-y-0.5 text-xs leading-4">
      <p className="inline-flex items-center gap-1 font-medium text-low-stock">
        <Info className="size-3.5 shrink-0" aria-hidden />
        Limited Availability
      </p>
      <p className="text-muted-foreground">Let us help you find this product.</p>
      <a href="#" className="font-medium text-primary underline-offset-2 hover:underline">
        Contact Us
      </a>
    </div>
  );
}
