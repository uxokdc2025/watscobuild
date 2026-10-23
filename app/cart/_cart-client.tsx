"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bookmark,
  Check,
  ChevronLeft,
  FilePlus2,
  House,
  ImageOff,
  MapPin,
  Minus,
  Package,
  Plus,
  Share2,
  TriangleAlert,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const media = line.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={line.image} alt={line.title} loading="lazy" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
  ) : (
    <ImageOff className="size-6 opacity-40" aria-hidden="true" />
  );
  const titleBlock = (
    <>
      <p className="truncate text-xs font-medium text-primary">{line.brand ?? "Watsco"}</p>
      <p className="line-clamp-2 text-sm font-semibold leading-snug">{line.title}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">Item: {line.item} · MFG: {line.mfg}</p>
    </>
  );
  const removeBtn = (
    <Button type="button" variant="link" size="sm" className="h-auto px-0" aria-label={`Remove ${line.mfg}`} onClick={onRemove}>
      Remove
    </Button>
  );
  return (
    <div className="border-b last:border-0">
      {/* Desktop — image (64px) · product capped at 340px · Qty · price */}
      <div className="hidden grid-cols-[64px_minmax(0,340px)_minmax(max-content,1fr)_minmax(max-content,1fr)] items-center gap-x-6 p-4 sm:grid">
        <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">{media}</div>
        <div className="min-w-0">{titleBlock}</div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Qty</span>
          <QtyStepper value={line.quantity} onChange={onQty} label={line.mfg} />
        </div>
        <div className="flex flex-col items-end gap-0.5 text-right">
          <span className="text-base font-semibold">{formatUSD(line.price * line.quantity)}</span>
          <span className="text-xs text-muted-foreground">{formatUSD(line.price)} / each</span>
          <span className="mt-1">{removeBtn}</span>
        </div>
      </div>
      {/* Mobile — image + title, with Qty stepper and price/Remove on a row beneath */}
      <div className="flex items-start gap-3 p-4 sm:hidden">
        <div className="grid size-14 shrink-0 place-items-center self-start rounded-md bg-muted/40 p-1 text-muted-foreground">{media}</div>
        <div className="min-w-0 flex-1">
          {titleBlock}
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Qty</span>
              <QtyStepper value={line.quantity} onChange={onQty} label={line.mfg} />
            </div>
            <div className="flex flex-col items-end gap-0.5 text-right">
              <span className="text-sm font-semibold text-foreground">{formatUSD(line.price * line.quantity)}</span>
              <span className="text-xs text-muted-foreground">{formatUSD(line.price)} / each</span>
              {removeBtn}
            </div>
          </div>
        </div>
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
  checkoutHref,
}: {
  count: number;
  subtotal: number;
  checkoutHref: string;
}) {
  // Save-for-later is local demo state — toggles the label to confirm the save.
  const [saved, setSaved] = React.useState(false);
  // ?summary=2 — Save / Share sit in a full-width band under the header
  // (like the V1 mini-cart) instead of inline in the header row.
  const [sumV2, setSumV2] = React.useState(false);
  React.useEffect(() => {
    setSumV2(new URLSearchParams(window.location.search).get("summary") === "2");
  }, []);
  const saveBtn = (full: boolean) => (
    <Button type="button" variant="ghost" size="sm" aria-pressed={saved} onClick={() => setSaved(true)}>
      {saved ? <Check className="size-4" aria-hidden="true" /> : <Bookmark className="size-4" aria-hidden="true" />}
      {saved ? (full ? "Cart Saved" : "Saved") : full ? "Save Cart" : "Save"}
    </Button>
  );
  const shareBtn = (full: boolean) => (
    <Button type="button" variant="ghost" size="sm">
      <Share2 className="size-4" aria-hidden="true" />
      {full ? "Share Cart" : "Share"}
    </Button>
  );
  return (
    <aside className="h-fit overflow-hidden rounded-md border bg-background shadow-sm lg:sticky lg:top-6">
      {/* Header — V2 default: Save / Share inline, right of the title. */}
      <div className="flex items-center justify-between gap-2 border-b bg-muted/60 px-5 py-2.5">
        <h2 className="text-base font-semibold">
          Order Summary ({count} {count === 1 ? "Item" : "Items"})
        </h2>
        {!sumV2 ? <div className="flex items-center gap-1">{saveBtn(false)}{shareBtn(false)}</div> : null}
      </div>
      {/* Alt version: Save Cart | Share Cart as a full-width band under the header. */}
      {sumV2 ? (
        <div className="flex items-center justify-center gap-2 border-b py-2">
          {saveBtn(true)}
          <span aria-hidden className="h-4 w-px bg-border" />
          {shareBtn(true)}
        </div>
      ) : null}
      <div className="space-y-4 p-5">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Subtotal</span>
            <span>{formatUSD(subtotal)}</span>
          </div>
          <div>
            <div className="flex justify-between">
              <span className="font-semibold">Tax (0%)</span>
              <span>{formatUSD(0)}</span>
            </div>
            <p className="text-xs text-muted-foreground">(Final tax will be calculated at checkout)</p>
          </div>
          <div className="flex justify-between border-y py-3 text-base font-bold">
            <span>Total</span>
            <span>{formatUSD(subtotal)}</span>
          </div>
        </div>

        {/* Promo code */}
        <div className="space-y-2">
          <label htmlFor="promo-code" className="text-sm font-medium">Promo Code</label>
          <div className="flex gap-2">
            <Input id="promo-code" placeholder="Enter promo code" className="h-9" />
            {/* Muted-blue "inactive" treatment, matching the reference. */}
            <Button type="button" size="sm" className="h-9 bg-primary/55 px-5 font-medium text-white hover:bg-primary/70">Apply</Button>
          </div>
        </div>

        {/* Action stack — the same funnel order as the V2 mini-cart. */}
        <div className="flex flex-col gap-2.5">
          {/* Primary also lives in the mobile sticky bar; shown here on desktop. */}
          <Button asChild className="hidden w-full lg:inline-flex">
            <Link href={checkoutHref}>Proceed to Checkout</Link>
          </Button>
          <Button asChild variant="tertiary" className="w-full">
            <Link href="/dashboard/proposals?signedin=1">
              <FilePlus2 className="size-4" aria-hidden="true" />
              Create Proposal
            </Link>
          </Button>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Quickly create professional proposals for your customers using the products in your cart. Save time and close more deals with SimpleProposal.
        </p>
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
        <Link href={SHOP_HREF}>Continue Shopping</Link>
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
          Back to Shopping
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
            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
              <div className="min-w-0 space-y-4">
                <AccountContextRow brandKey={brandKey} accountId={accountId} onSelectAccount={setAccountId} />
                <section className="rounded-md border bg-background shadow-sm">
                  <div className="border-b px-5 py-4 font-semibold">Items ({lines.length})</div>
                  {/* Desktop: long carts scroll their own container so the sticky
                      summary stays put. Mobile: the whole page scrolls — no inner box. */}
                  <div className="lg:max-h-[70svh] lg:overflow-y-auto">
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

              <OrderSummary count={count} subtotal={subtotal} checkoutHref={checkoutHref} />
            </div>

            {/* Mobile-only sticky checkout bar — the primary action stays reachable
                on a long cart without scrolling to the summary. */}
            <div
              className="fixed inset-x-0 bottom-0 z-40 border-t bg-background px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:hidden"
              style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
            >
              <div className="mx-auto max-w-[var(--layout-max-width)]">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total</span>
                  <span className="text-lg font-bold">{formatUSD(subtotal)}</span>
                </div>
                <Button asChild className="mt-2 w-full">
                  <Link href={checkoutHref}>Proceed to Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
