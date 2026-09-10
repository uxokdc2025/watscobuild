"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Check,
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
          // Remove sits in the item cluster (left column), away from the price;
          // a vertical rule separates it from the substitute actions so Remove
          // isn't clicked by accident.
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-11 gap-1.5 px-0 text-destructive hover:bg-transparent hover:text-destructive/80"
              aria-label={`Remove ${line.mfg}`}
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
            {line.replacement ? (
              <>
                <span aria-hidden="true" className="h-5 w-px bg-border" />
                {/* DS StockStatus (amber dot + tone), made clickable to open the
                    substitutes drawer — the component/colors stay design-system. */}
                <button
                  type="button"
                  onClick={onViewSubstitutes}
                  className="rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <StockStatus tone="amber">Replacement available</StockStatus>
                </button>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto gap-1.5 px-0"
                  onClick={onViewSubstitutes}
                >
                  <Replace className="size-3.5" />
                  View substitutes
                </Button>
              </>
            ) : null}
          </div>
        }
        actions={
          <div className="flex w-full flex-col items-start gap-2.5 sm:w-auto sm:items-end">
            <span className="text-xs text-muted-foreground">{formatUSD(line.price)} / each</span>
            <QtyStepper value={line.quantity} onChange={onQty} label={line.mfg} />
            <span className="text-base font-semibold">{formatUSD(line.price * line.quantity)}</span>
          </div>
        }
      />
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
  lines,
  count,
  subtotal,
  tax,
  total,
  checkoutHref,
}: {
  lines: CartLine[];
  count: number;
  subtotal: number;
  tax: number;
  total: number;
  checkoutHref: string;
}) {
  // Save-for-later is local demo state — toggles the label to confirm the save.
  const [saved, setSaved] = React.useState(false);
  return (
    <aside className="h-fit rounded-md border bg-background shadow-sm lg:sticky lg:top-6">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <p className="mt-1 text-sm text-muted-foreground">{count} items</p>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-3 text-sm">
          {/* Itemized list — plain text rows (name → line total). A divider
              separates the products from the totals below. No thumbnails. */}
          <div className="space-y-2 border-b pb-3">
            {lines.map((line) => (
              <div key={line.id} className="flex justify-between gap-6">
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {line.quantity > 1 ? `Qty ${line.quantity} · ` : null}
                  {line.title}
                </span>
                <span className="shrink-0">{formatUSD(line.price * line.quantity)}</span>
              </div>
            ))}
          </div>
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
  const [drawerFor, setDrawerFor] = React.useState<CartLine | null>(null);
  // Stock/availability notices — moved here from checkout. Backorder + nearby
  // are dismissible summaries; the itemized panel below them is not.
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

        <AccountContextRow brandKey={brandKey} accountId={accountId} onSelectAccount={setAccountId} />

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

              <OrderSummary lines={lines} count={count} subtotal={subtotal} tax={tax} total={total} checkoutHref={checkoutHref} />
            </div>
          </>
        )}
      </div>

      <SubstitutesDrawer line={drawerFor} onClose={() => setDrawerFor(null)} onChoose={chooseAlt} />
    </main>
  );
}
