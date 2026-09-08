"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";

import type { CartItem } from "@/components/cart/cart-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getBrandCheckout } from "../_lib/brand-checkout";
import { StockStoreLocatorDrawer } from "./checkout-drawers";

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

export function StockUnavailablePanel({
  items,
  rows,
  brandKey = "homans",
  className,
}: {
  items: CartItem[];
  /** Override the derived rows (e.g. to supply Peirce `elsewhere` lines). */
  rows?: StockRow[];
  /** Resolves the brand's branches (drawer seed) and cart route. */
  brandKey?: string;
  className?: string;
}) {
  const resolved = rows ?? defaultRows(items);
  const brand = getBrandCheckout(brandKey);
  // A single drawer instance serves every trigger; the product context (if any)
  // is set by whichever link opened it.
  const [drawer, setDrawer] = React.useState<{
    product?: { brand: string; title: string; item: string; mfg: string };
    showProductHeader: boolean;
  } | null>(null);

  if (!resolved.length) return null;

  const openForItem = (item: CartItem) =>
    setDrawer({
      product: { brand: item.brand ?? "Watsco", title: item.title, item: "—", mfg: "—" },
      showProductHeader: true,
    });
  const openForStore = () => setDrawer({ showProductHeader: false });

  return (
    // Caution/amber BACKGROUND fill on the outer container with white inner
    // cards — the same treatment as the shopping-list "Replacements available"
    // panel (DS `Alert variant="warning"`). No left rail.
    <Alert variant="warning" aria-labelledby="stock-unavailable-heading" className={className}>
      <TriangleAlert />
      <AlertTitle id="stock-unavailable-heading" className="line-clamp-none">
        These items are not available at your current store in requested quantities:
      </AlertTitle>
      <AlertDescription className="mt-3 w-full">
        <div className="w-full overflow-hidden rounded-md border border-border bg-background">
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
                    <button
                      type="button"
                      onClick={() => openForItem(item)}
                      className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      Check nearby stores
                    </button>
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
              <button
                type="button"
                onClick={openForStore}
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Change your selected store
              </button>
            </li>
            <li>Adjust quantities below.</li>
            <li>Continue and submit this purchase on backorder. You may incur additional charges.</li>
          </ul>
        </div>
      </AlertDescription>

      <StockStoreLocatorDrawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        branches={brand.branches}
        product={drawer?.product}
        showProductHeader={drawer?.showProductHeader ?? false}
        heading={drawer?.showProductHeader ? "Product availability" : "Find a branch"}
      />
    </Alert>
  );
}
