"use client";

import * as React from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import type { CartItem } from "@/components/cart/cart-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ───────────────────────── Stock-availability model ─────────────────────────
 * The itemized "not available at your current store" panel. Each row pairs the
 * requested quantity against what's on hand at the selected store. The optional
 * `elsewhere` line carries the Peirce variant wording ("0 available at Dover, NC
 * · 243 available at All Branches"); Baker's simpler Requested/Available is the
 * default (no `elsewhere`). */

export type StockRow = {
  item: CartItem;
  requested: number;
  available: number;
  /** Peirce variant: an optional "available elsewhere" summary line. */
  elsewhere?: string;
};

/** Default resolver: treat every cart item as unavailable at the current store
 *  (available 0), mirroring the demo backorder/nearby scenario. */
function defaultRows(items: CartItem[]): StockRow[] {
  return items.map((item) => ({ item, requested: item.quantity, available: 0 }));
}

const STORE_HREF = "/store-locator";
/* No dedicated /cart route exists — the cart is a drawer; the app routes
 * "back to your cart" to the shopping surface, so we match that here. */
const CART_HREF = "/search?q=blower%20motor&signedin=1";

export function StockUnavailablePanel({
  items,
  rows,
  storeHref = STORE_HREF,
  cartHref = CART_HREF,
  className,
}: {
  items: CartItem[];
  /** Override the derived rows (e.g. to supply Peirce `elsewhere` lines). */
  rows?: StockRow[];
  storeHref?: string;
  cartHref?: string;
  className?: string;
}) {
  const resolved = rows ?? defaultRows(items);
  if (!resolved.length) return null;

  return (
    <section
      aria-labelledby="stock-unavailable-heading"
      className={cn(
        "overflow-hidden rounded-lg border border-border border-l-4 border-l-yellow-500 bg-muted/30",
        className
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <TriangleAlert
          className="mt-0.5 size-4 shrink-0 text-yellow-800 dark:text-yellow-300"
          aria-hidden="true"
        />
        <h3
          id="stock-unavailable-heading"
          className="text-sm font-semibold text-yellow-800 dark:text-yellow-300"
        >
          These items are not available at your current store in requested quantities:
        </h3>
      </div>

      <div className="px-4 pb-4">
        <div className="overflow-hidden rounded-md border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead scope="col">Product</TableHead>
                <TableHead scope="col" className="text-right">
                  Requested
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Available
                </TableHead>
                <TableHead scope="col" className="text-right">
                  <span className="sr-only">Availability at other stores</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resolved.map(({ item, requested, available, elsewhere }) => (
                <TableRow key={item.id} className="align-top">
                  <TableCell className="whitespace-normal">
                    <div className="flex items-start gap-3">
                      <div className="grid size-11 shrink-0 place-items-center rounded-md bg-muted/40 p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                      </div>
                      <div className="min-w-0">
                        {item.brand ? (
                          <p className="text-xs font-medium text-primary">{item.brand}</p>
                        ) : null}
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        {elsewhere ? (
                          <p className="mt-1 text-xs text-muted-foreground">{elsewhere}</p>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{requested}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium tabular-nums",
                      available === 0 ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {available}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={storeHref}
                      className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      Check nearby stores
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-foreground">You have several options to proceed:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>
              <Link
                href={storeHref}
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Change your selected store
              </Link>
            </li>
            <li>
              <Link
                href={cartHref}
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Change quantities by returning to your cart
              </Link>
            </li>
            <li>Continue and submit this purchase on backorder. You may incur additional charges.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
