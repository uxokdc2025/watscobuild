"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  House,
  ImageOff,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatUSD } from "@/app/pdp/_lib/types";
import { getBrandCheckout } from "../checkout/_lib/brand-checkout";
import { SwitchAccountDrawer } from "../checkout/_components/checkout-drawers";
import { DEMO_CART, type CartLine } from "./_cart-data";

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
}: {
  line: CartLine;
  onQty: (next: number) => void;
  onRemove: () => void;
}) {
  return (
    // Evenly-weighted columns: image · product (2fr) · Qty (1fr) · price (1fr).
    // The product column is capped so the title wraps to ~2 lines instead of
    // stretching the row, and Qty/price spread evenly across the rest.
    <div className="grid grid-cols-[64px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-6 border-b p-4 last:border-0">
      <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
        {line.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={line.image} alt={line.title} loading="lazy" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
        ) : (
          <ImageOff className="size-6 opacity-40" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-primary">{line.brand ?? "Watsco"}</p>
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{line.title}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">Item: {line.item} · MFG: {line.mfg}</p>
      </div>
      <div className="flex flex-col items-start gap-1.5">
        <span className="text-xs text-muted-foreground">Qty</span>
        <QtyStepper value={line.quantity} onChange={onQty} label={line.mfg} />
      </div>
      <div className="flex flex-col items-end gap-0.5 text-right">
        <span className="text-base font-semibold">{formatUSD(line.price * line.quantity)}</span>
        <span className="text-xs text-muted-foreground">{formatUSD(line.price)} / each</span>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-1 h-auto px-0"
          aria-label={`Remove ${line.mfg}`}
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

/* ───────────────────────── Account / branch context ─────────────────────────
 * Consistent with the checkout account row — the brand's account + current
 * branch, with the same Switch-account drawer. */
function AccountContextRow({
  brandKey,
  accountId,
  onSelectAccount,
}: {
  brandKey: string;
  /** Selected account, lifted to CartClient so it flows into the checkout href. */
  accountId: string;
  onSelectAccount: (id: string) => void;
}) {
  const brand = getBrandCheckout(brandKey);
  const accounts = brand.switchAccounts;
  const branch = brand.branches.find((b) => b.current) ?? brand.branches[0];
  const [open, setOpen] = React.useState(false);
  const [defaultId, setDefaultId] = React.useState(accounts[0].id);
  const current = accounts.find((a) => a.id === accountId) ?? accounts[0];

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-background px-4 py-3 text-sm">
      <div className="flex min-w-0 items-center gap-3">
        <House className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Your order will be placed at:</p>
          <p className="truncate">
            <span className="font-semibold">{current.name}</span>
            <span className="text-muted-foreground"> · {branch.name} · {branch.address}</span>
          </p>
        </div>
      </div>
      <Button variant="link" size="sm" className="h-auto shrink-0 px-0" onClick={() => setOpen(true)}>
        Change
      </Button>
      <SwitchAccountDrawer
        open={open}
        onClose={() => setOpen(false)}
        accounts={accounts}
        currentId={accountId}
        defaultId={defaultId}
        onSelect={onSelectAccount}
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
  // Save-for-later is local demo state — toggles the label to confirm the save.
  const [saved, setSaved] = React.useState(false);
  return (
    <aside className="h-fit overflow-hidden rounded-md border bg-background shadow-sm lg:sticky lg:top-6">
      <div className="border-b bg-muted/60 px-5 py-3">
        <h2 className="text-base font-semibold">
          Order Summary ({count} {count === 1 ? "Item" : "Items"})
        </h2>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>{formatUSD(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Estimated Tax:</span>
            <span>{formatUSD(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Estimated Shipping:</span>
            <span className="text-muted-foreground">Calculated at checkout</span>
          </div>
          <div className="flex justify-between pt-1 font-bold">
            <span>Total:</span>
            <span>{formatUSD(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Shipping and final tax are confirmed at checkout.</p>
        </div>

        <div className="rounded-md bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mr-1 inline size-4 text-in-stock" aria-hidden="true" />
          Review fulfillment, payment, and delivery on the next step — nothing is charged yet.
        </div>

        {/* Button pair — secondary LEFT (save for later), primary RIGHT, equal
            width. Continue-shopping is covered by the "Back to shopping" crumb. */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            aria-pressed={saved}
            onClick={() => setSaved(true)}
          >
            {saved ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Cart saved
              </>
            ) : (
              "Save cart"
            )}
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
  // Stock/availability notices — moved here from checkout. Backorder + nearby
  // are dismissible summaries.
  const [notices, setNotices] = React.useState({ backorder: true, nearby: true });
  // Selected account is lifted here so it flows into the checkout href
  // (?account=…) and seeds Order Details on the next step.
  const [accountId, setAccountId] = React.useState(brand.switchAccounts[0].id);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const tax = subtotal * brand.taxRate;
  const total = subtotal + tax;
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const checkoutHref = `/checkout?brand=${brandKey}&demo=1&account=${accountId}`;

  const setQty = (id: string, next: number) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: Math.max(1, next) } : l)));

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <Link href={SHOP_HREF} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to shopping
        </Link>

        <h1 className="mt-5 text-2xl font-bold tracking-tight">Cart</h1>

        {!lines.length ? (
          <div className="mt-6">
            <EmptyCart />
          </div>
        ) : (
          <>
            {/* Stock / availability — the backorder + nearby summaries
                (dismissible). Account context sits BELOW these messages. */}
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
            </div>

            {/* Left column carries the account context + Items; the Order Summary
                sits in the right column and rises to align with the account row. */}
            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="min-w-0 space-y-4">
                <AccountContextRow brandKey={brandKey} accountId={accountId} onSelectAccount={setAccountId} />
                <section className="rounded-md border bg-background shadow-sm">
                  <div className="border-b px-5 py-4 font-semibold">Items ({lines.length})</div>
                  {/* Long carts scroll their own container so the summary stays put. */}
                  <div className="max-h-[70svh] overflow-y-auto">
                    {lines.map((l) => (
                      <CartLineRow
                        key={l.id}
                        line={l}
                        onQty={(next) => setQty(l.id, next)}
                        onRemove={() => removeLine(l.id)}
                      />
                    ))}
                  </div>
                </section>
              </div>

              <OrderSummary count={count} subtotal={subtotal} tax={tax} total={total} checkoutHref={checkoutHref} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
