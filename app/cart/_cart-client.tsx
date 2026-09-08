"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  MapPin,
  Minus,
  Package,
  Plus,
  Replace,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductListRow } from "@/components/ui/product-list-row";
import { StockStatus } from "@/components/ui/label-badges";
import { formatUSD } from "@/app/pdp/_lib/types";
import { getBrandCheckout } from "../checkout/_lib/brand-checkout";
import { SwitchAccountDrawer } from "../checkout/_components/checkout-drawers";
import { StockUnavailablePanel } from "../checkout/_components/stock-unavailable";
import { SubstitutesDrawer } from "./_substitutes-drawer";
import { DEMO_CART, type AltProduct, type CartLine } from "./_cart-data";

const SHOP_HREF = "/search?q=blower%20motor&signedin=1";

/** Small dismiss control for a lightly-filled Alert (inherits the alert tone). */
function DismissButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute top-2 right-2 grid size-7 place-items-center rounded-md text-current/70 transition-colors hover:bg-black/5 hover:text-current focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
    >
      <X className="size-4" />
    </button>
  );
}

/* ───────────────────────── Quantity stepper ─────────────────────────
 * Mirrors the shopping-list / cart-drawer stepper markup so the control reads
 * identically across the flow. */
function QtyStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex h-9 items-center rounded-md border" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className="grid size-9 place-items-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="grid h-full w-9 place-items-center border-x text-sm tabular-nums">{value}</span>
      <button
        type="button"
        className="grid size-9 place-items-center text-muted-foreground transition-colors hover:bg-muted"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

/* ───────────────────────── Cart line row ───────────────────────── */
function CartLineRow({
  line,
  onQty,
  onRemove,
  onViewSubstitutes,
}: {
  line: CartLine;
  onQty: (next: number) => void;
  onRemove: () => void;
  onViewSubstitutes: () => void;
}) {
  return (
    <div className="border-b last:border-0">
      <ProductListRow
        image={line.image}
        imageAlt={line.title}
        brand={line.brand ?? "Watsco"}
        title={<p className="text-sm font-semibold leading-snug">{line.title}</p>}
        item={line.item}
        mfg={line.mfg}
        meta={
          line.replacement ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <StockStatus tone="amber">Replacement available</StockStatus>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto px-0"
                onClick={onViewSubstitutes}
              >
                <Replace className="size-3.5" />
                View substitutes
              </Button>
            </div>
          ) : null
        }
        actions={
          <div className="flex w-full flex-col items-start gap-2.5 sm:w-auto sm:items-end">
            <span className="text-xs text-muted-foreground">{formatUSD(line.price)} / each</span>
            <QtyStepper value={line.quantity} onChange={onQty} label={line.mfg} />
            <span className="text-base font-semibold">{formatUSD(line.price * line.quantity)}</span>
            <Button variant="ghost" size="icon-sm" aria-label={`Remove ${line.mfg}`} onClick={onRemove}>
              <Trash2 />
            </Button>
          </div>
        }
      />
    </div>
  );
}

/* ───────────────────────── Account / branch context ─────────────────────────
 * Consistent with the checkout account row — the brand's account + current
 * branch, with the same Switch-account drawer. */
function AccountContextRow({ brandKey }: { brandKey: string }) {
  const brand = getBrandCheckout(brandKey);
  const accounts = brand.switchAccounts;
  const branch = brand.branches.find((b) => b.current) ?? brand.branches[0];
  const [open, setOpen] = React.useState(false);
  const [currentId, setCurrentId] = React.useState(accounts[0].id);
  const [defaultId, setDefaultId] = React.useState(accounts[0].id);
  const current = accounts.find((a) => a.id === currentId) ?? accounts[0];

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-4 py-3 text-sm">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="min-w-0">
          <span className="font-semibold">{current.name}</span>
          <span className="text-muted-foreground"> · {current.detail}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {branch.name}
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Building2 className="size-4" aria-hidden="true" />
        Switch account
      </Button>
      <SwitchAccountDrawer
        open={open}
        onClose={() => setOpen(false)}
        accounts={accounts}
        currentId={currentId}
        defaultId={defaultId}
        onSelect={setCurrentId}
        onSetDefault={setDefaultId}
      />
    </div>
  );
}

/* ───────────────────────── Order summary rail ───────────────────────── */
function OrderSummary({
  count,
  subtotal,
  tax,
  total,
  checkoutHref,
}: {
  count: number;
  subtotal: number;
  tax: number;
  total: number;
  checkoutHref: string;
}) {
  return (
    <aside className="h-fit rounded-md border bg-background shadow-sm lg:sticky lg:top-6">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <p className="mt-1 text-sm text-muted-foreground">{count} items</p>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatUSD(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated shipping</span>
            <span className="text-muted-foreground">Calculated at checkout</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated tax</span>
            <span>{formatUSD(tax)}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatUSD(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Shipping and final tax are confirmed at checkout.</p>
        </div>

        <div className="rounded-md bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mr-1 inline size-4 text-in-stock" aria-hidden="true" />
          Review fulfillment, payment, and delivery on the next step — nothing is charged yet.
        </div>

        {/* Button pair — secondary LEFT, primary RIGHT, equal width. */}
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={SHOP_HREF}>Continue shopping</Link>
          </Button>
          <Button asChild size="sm" className="w-full">
            <Link href={checkoutHref}>Proceed to checkout</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}

/* ───────────────────────── Empty state ───────────────────────── */
function EmptyCart() {
  return (
    <section className="mx-auto max-w-2xl rounded-md border bg-background p-8 text-center shadow-sm">
      <Package className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
      <p className="mt-2 text-sm text-muted-foreground">Add products to your cart to start an order.</p>
      <Button asChild className="mt-6" size="sm">
        <Link href={SHOP_HREF}>Continue shopping</Link>
      </Button>
    </section>
  );
}

/* ───────────────────────── Main ───────────────────────── */
export default function CartClient({ brandKey = "homans" }: { brandKey?: string }) {
  const brand = getBrandCheckout(brandKey);
  const [lines, setLines] = React.useState<CartLine[]>(DEMO_CART);
  const [dismissed, setDismissed] = React.useState<string[]>([]);
  const [drawerFor, setDrawerFor] = React.useState<CartLine | null>(null);
  // Stock/availability notices — moved here from checkout. Backorder + nearby
  // are dismissible summaries; the itemized panel below them is not.
  const [notices, setNotices] = React.useState({ backorder: true, nearby: true });

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const tax = subtotal * brand.taxRate;
  const total = subtotal + tax;
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const checkoutHref = `/checkout?brand=${brandKey}&demo=1`;

  const bannerLines = lines.filter((l) => l.replacement && !dismissed.includes(l.id));

  const setQty = (id: string, next: number) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: Math.max(1, next) } : l)));

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    setDismissed((prev) => prev.filter((b) => b !== id));
  };

  // Replace / Substitute: swap the chosen alternative into the line in place,
  // drop the replacement flag, close the drawer, and confirm with a toast.
  const chooseAlt = (alt: AltProduct, kind: "replacement" | "substitute") => {
    const original = drawerFor;
    if (original) {
      setLines((prev) =>
        prev.map((l) =>
          l.id === original.id
            ? { ...l, title: alt.title, brand: alt.brand, image: alt.image, item: alt.item, mfg: alt.mfg, price: alt.price, replacement: undefined }
            : l,
        ),
      );
      setDismissed((prev) => [...prev, original.id]);
      const name = (s: string) => s.split("—")[0].trim();
      toast.success(`${name(original.title)} ${kind === "replacement" ? "replaced with" : "substituted with"} ${name(alt.title)}`);
    }
    setDrawerFor(null);
  };

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <Link href={SHOP_HREF} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to shopping
        </Link>

        <h1 className="mt-5 text-2xl font-bold tracking-tight">Cart</h1>

        <AccountContextRow brandKey={brandKey} />

        {!lines.length ? (
          <div className="mt-6">
            <EmptyCart />
          </div>
        ) : (
          <>
            {/* Stock / availability — the backorder + nearby summaries (dismissible)
                and the itemized "not available at your current store" panel, which
                carries its own store-locator drawer wiring. */}
            <div className="mt-6 space-y-3">
              {notices.backorder ? (
                <Alert variant="destructive" className="pr-10">
                  <TriangleAlert />
                  <AlertTitle>Backorder</AlertTitle>
                  <AlertDescription>
                    Some items are available on backorder. We&apos;ll contact you with an estimated availability date.
                  </AlertDescription>
                  <DismissButton label="Dismiss backorder notice" onClick={() => setNotices((n) => ({ ...n, backorder: false }))} />
                </Alert>
              ) : null}
              {notices.nearby ? (
                <Alert variant="warning" className="pr-10">
                  <MapPin />
                  <AlertTitle>Nearby branches</AlertTitle>
                  <AlertDescription>
                    Some items are available at another branch and may ship separately.
                  </AlertDescription>
                  <DismissButton label="Dismiss nearby branches notice" onClick={() => setNotices((n) => ({ ...n, nearby: false }))} />
                </Alert>
              ) : null}
              <StockUnavailablePanel items={lines} brandKey={brandKey} />
            </div>

            {/* Yellow "Replacements available" panel — same fill treatment as
                the shopping-list detail (no left bar). */}
            {bannerLines.length > 0 ? (
              <Alert variant="warning" className="mt-6">
                <Replace />
                <AlertTitle>Replacements available</AlertTitle>
                <AlertDescription>
                  <p>The following items have a replacement or substitute.</p>
                  <div className="mt-3 w-full space-y-3">
                    {bannerLines.map((l) => (
                      <div
                        key={l.id}
                        className="flex flex-col gap-3 rounded-md border border-border bg-background p-3 sm:flex-row sm:items-center"
                      >
                        <div className="grid size-12 shrink-0 place-items-center rounded-md bg-muted/40 p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={l.image}
                            alt={l.title}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-primary">{l.brand}</p>
                          <p className="truncate text-sm font-semibold text-foreground">{l.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Item: {l.item} · MFG: {l.mfg} · Replacement available
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="min-h-11 text-muted-foreground"
                            onClick={() => setDismissed((prev) => [...prev, l.id])}
                          >
                            Dismiss
                          </Button>
                          <Button variant="secondary" size="sm" className="min-h-11" onClick={() => setDrawerFor(l)}>
                            <Replace className="size-3.5" />
                            View substitutes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <section className="min-w-0 rounded-md border bg-background shadow-sm">
                <div className="border-b px-5 py-4 font-semibold">Items ({lines.length})</div>
                {/* Long carts scroll their own container so the summary stays put. */}
                <div className="max-h-[70svh] overflow-y-auto">
                  {lines.map((l) => (
                    <CartLineRow
                      key={l.id}
                      line={l}
                      onQty={(next) => setQty(l.id, next)}
                      onRemove={() => removeLine(l.id)}
                      onViewSubstitutes={() => setDrawerFor(l)}
                    />
                  ))}
                </div>
              </section>

              <OrderSummary count={count} subtotal={subtotal} tax={tax} total={total} checkoutHref={checkoutHref} />
            </div>
          </>
        )}
      </div>

      <SubstitutesDrawer line={drawerFor} onClose={() => setDrawerFor(null)} onChoose={chooseAlt} />
    </main>
  );
}
