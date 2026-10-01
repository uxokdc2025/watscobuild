"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { getBrandCheckout } from "../../_lib/brand-checkout";
import { METHOD_RATE, isDeliveryMethod } from "../../_components/fulfillment";
import {
  ReviewStep,
  OrderSummary,
  OrderConfirmation,
  MobileCtaBar,
  resolveScenario,
  DEMO_ITEMS,
  SAVED_CARDS,
} from "../../_components/checkout-client";
import type { CheckoutCase } from "../../page";

/* Standalone v3 review page. It re-derives the SAME defaults CheckoutClient
 * computes (brand config, demo items, seeded account/branch, clamped fulfillment
 * method, totals) and feeds them into the shared ReviewStep + OrderSummary — the
 * identical review content the v1 flow shows, minus the step progress bar. The
 * "Place order" CTA submits to the shared OrderConfirmation state. */
export default function ReviewPageClient({
  scenario,
  demo = false,
  brandKey = "homans",
  initialAccountId,
}: {
  scenario?: CheckoutCase;
  demo?: boolean;
  brandKey?: string;
  initialAccountId?: string;
}) {
  const router = useRouter();
  const cfg = resolveScenario(scenario);
  const brand = getBrandCheckout(brandKey);
  const { items: cartItems } = useCart();
  const items = cartItems.length ? cartItems : demo || scenario ? DEMO_ITEMS : [];

  // Account seeded from ?account=…, falling back to the brand default.
  const accounts = brand.switchAccounts;
  const account =
    (initialAccountId && accounts.find((a) => a.id === initialAccountId)) || accounts[0];

  // Branch = brand's current/first branch.
  const branch = brand.branches.find((b) => b.current) ?? brand.branches[0];

  // Fulfillment defaults — mirror CheckoutClient's initial derivation.
  const initialAddressId =
    brand.addresses.find((a) => a.isDefault)?.id ?? brand.addresses[0]?.id ?? "";
  const firstDeliveryMethod = brand.methods.find(isDeliveryMethod) ?? "pickup";
  const clampedMethod = brand.methods.includes(cfg.method) ? cfg.method : firstDeliveryMethod;
  const initialOutOfRadius =
    brand.radiusRule && !!brand.addresses.find((a) => a.id === initialAddressId)?.outOfRadius;
  const method =
    initialOutOfRadius && brand.methods.includes("freight") ? "freight" : clampedMethod;

  const [submitted, setSubmitted] = React.useState(cfg.submitted);
  const [specialHandling, setSpecialHandling] = React.useState(false);
  const [handlingComments, setHandlingComments] = React.useState("");
  const [coupon, setCoupon] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);

  const po = "PO-2048";
  const job = cfg.seededJob;
  const cardTail = SAVED_CARDS[0].tail;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * brand.taxRate;
  const shipping = METHOD_RATE[method];
  const total = subtotal - discount + tax + shipping;
  // No delivery date is chosen on the standalone review page, so a picker-mode
  // delivery method's rate is unknown (same rule as the main flow pre-date).
  const shippingUnknown = isDeliveryMethod(method) && brand.deliveryDateMode !== "csr";

  // Special-handling comments gate Place order, same as the v1 review step.
  const placeOrderDisabled = cfg.showSpecialHandling && specialHandling && !handlingComments.trim();

  const saveQuote = () => toast.success("Quote saved — find it under Quotes in your account.");
  const backHref = `/checkout/v3?brand=${brandKey}${demo ? "&demo=1" : ""}${scenario ? `&case=${scenario}` : ""}`;

  if (submitted) {
    return <OrderConfirmation brand={brand} />;
  }

  if (!items.length) {
    return (
      <main className="min-h-[60svh] bg-muted/30 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-[var(--layout-max-width)]">
          <section className="mx-auto max-w-2xl rounded-md border bg-background p-8 text-center shadow-sm">
            <Package className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-sm text-muted-foreground">Add products to your cart before reviewing your order.</p>
            <Button asChild className="mt-6" size="sm">
              <Link href="/search?q=blower%20motor&signedin=1">Continue shopping</Link>
            </Button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        {/* Back control returns to the open v3 checkout. */}
        <Button asChild variant="outline" size="sm">
          <Link href={backHref}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back
          </Link>
        </Button>

        <div className="mt-5">
          <h1 className="text-2xl font-bold tracking-tight">Review</h1>
        </div>

        {/* No step progress bar — just the shared review content + Order Summary. */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-md border bg-background shadow-sm">
            <ReviewStep
              brand={brand}
              items={items}
              account={account}
              branch={branch}
              method={method}
              addressId={initialAddressId}
              pickupDate={null}
              deliveryDate={null}
              split="partial"
              liftgate="none"
              expressOn={false}
              payment={cfg.payment}
              cardTail={cardTail}
              po={po}
              job={job}
              notes=""
              showSpecialHandling={cfg.showSpecialHandling}
              specialHandling={specialHandling}
              setSpecialHandling={setSpecialHandling}
              handlingComments={handlingComments}
              setHandlingComments={setHandlingComments}
              onBack={() => {}}
              onEditDetails={() => router.push(`${backHref}#order-details`)}
              onEditFulfillment={() => router.push(`${backHref}#fulfillment`)}
              onEditPayment={() => router.push(`${backHref}#payment`)}
              hideBack
            />
          </section>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            shipping={shipping}
            shippingUnknown={shippingUnknown}
            total={total}
            primary={{ label: "Place order", onClick: () => setSubmitted(true), disabled: placeOrderDisabled }}
            coupon={coupon}
            setCoupon={setCoupon}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={() => coupon.trim() && setAppliedCoupon(coupon.trim().toUpperCase())}
            showConfirm
            onSaveQuote={saveQuote}
          />
        </div>
      </div>

      {/* Mobile sticky CTA — Place order + Save quote (OrderSummary's buttons are
          desktop-only). */}
      <MobileCtaBar
        label="Place order"
        onClick={() => setSubmitted(true)}
        disabled={placeOrderDisabled}
        total={total}
        shippingUnknown={shippingUnknown}
        secondaryLabel="Save quote"
        onSecondary={saveQuote}
      />
    </main>
  );
}
