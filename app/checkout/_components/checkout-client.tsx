"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  CreditCard,
  LockKeyhole,
  MapPin,
  Package,
  ShieldCheck,
  TriangleAlert,
  Truck,
} from "lucide-react";

import { useCart, type CartItem } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/pdp/_lib/types";
import type { CheckoutCase } from "../page";

/* ───────────────────────── Demo data ───────────────────────── */

const DEMO_ITEMS: CartItem[] = [
  { id: "checkout-air-handler", title: "Aspen® 3-Ton Multi-Position Electric Air Handler", brand: "Aspen", price: 676.5, quantity: 1, image: "/peirce-search/blower-motor-07.avif" },
  { id: "checkout-wire-rope", title: "Duro Dyne® Cable Lock Wire Rope - 500' Roll", brand: "Duro Dyne", price: 277, quantity: 1, image: "/peirce-search/blower-motor-17.avif" },
];

const SAVED_CARDS = [
  { id: "visa-4242", label: "Visa ending 4242", meta: "Exp 08/28" },
  { id: "mc-8801", label: "Mastercard ending 8801", meta: "Exp 02/27" },
];

const ORDER_NUMBER = "HOM-2026-04871";
const TAX_RATE = 0.0625;

/* ───────────────────────── Scenario model ─────────────────────────
 * The 6 use cases are STATES of one flow, not separate flows. Each case is a
 * single config entry — no scattered `scenario === "…"` branching in the JSX. */

type Step = "shipping" | "payment" | "review";

type ScenarioConfig = {
  initialStep: Step;
  submitted: boolean;
  fulfillment: "delivery" | "pickup";
  payment: "terms" | "card";
  notices: { backorder: boolean; nearby: boolean };
  seededJob: string;
  seededDate: string;
  availabilityConstraint: boolean;
  showCoupon: boolean;
  showSpecialHandling: boolean;
};

const BASE: ScenarioConfig = {
  initialStep: "shipping",
  submitted: false,
  fulfillment: "delivery",
  payment: "terms",
  notices: { backorder: true, nearby: true },
  seededJob: "",
  seededDate: "As soon as available",
  availabilityConstraint: false,
  showCoupon: false,
  showSpecialHandling: false,
};

const CHECKOUT_SCENARIOS: Record<CheckoutCase, Partial<ScenarioConfig>> = {
  "account-job-context": { notices: { backorder: false, nearby: false }, seededJob: "Spring maintenance" },
  "delivery-pickup-routing": { fulfillment: "pickup" },
  "availability-date-constraints": { seededDate: "September 3, 2026", availabilityConstraint: true },
  "terms-or-credit-card": { initialStep: "payment", payment: "card", notices: { backorder: false, nearby: false } },
  "review-coupon-special-handling": { initialStep: "review", notices: { backorder: false, nearby: false }, showCoupon: true, showSpecialHandling: true },
  "order-confirmation": { initialStep: "review", submitted: true, notices: { backorder: false, nearby: false } },
};

function resolveScenario(scenario?: CheckoutCase): ScenarioConfig {
  return scenario ? { ...BASE, ...CHECKOUT_SCENARIOS[scenario] } : BASE;
}

/* ───────────────────────── Field (DS Input + Label) ───────────────────────── */

function Field({
  id,
  label,
  required = false,
  error,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { id: string; label: string; required?: boolean; error?: string; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      <Input id={id} required={required} aria-invalid={error ? true : undefined} {...props} />
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

/* A selectable radio card — one pattern for both fulfillment and payment. */
function RadioCard({
  value,
  selected,
  className,
  children,
}: {
  value: string;
  selected: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50",
        className
      )}
    >
      <RadioGroupItem value={value} className="mt-0.5" />
      <span className="flex-1">{children}</span>
    </Label>
  );
}

/* ───────────────────────── Main ───────────────────────── */

export default function CheckoutClient({ scenario, demo = false }: { scenario?: CheckoutCase; demo?: boolean }) {
  const cfg = resolveScenario(scenario);
  const { items: cartItems } = useCart();
  const items = cartItems.length ? cartItems : (demo || scenario ? DEMO_ITEMS : []);

  const [step, setStep] = React.useState<Step>(cfg.initialStep);
  const [submitted, setSubmitted] = React.useState(cfg.submitted);
  const [saved, setSaved] = React.useState(false);
  const [fulfillment, setFulfillment] = React.useState(cfg.fulfillment);
  const [payment, setPayment] = React.useState(cfg.payment);
  const notices = cfg.notices;
  const [po, setPo] = React.useState("PO-2048");
  const [poError, setPoError] = React.useState<string | undefined>();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (submitted) {
    return (
      <main className="min-h-[60svh] bg-muted/30 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-[var(--layout-max-width)]">
          <section className="mx-auto max-w-2xl rounded-md border bg-background p-8 text-center shadow-sm">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-in-stock/15 text-in-stock">
              <Check aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Order submitted</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Order <span className="font-semibold text-foreground">{ORDER_NUMBER}</span> is being reviewed.
              We&apos;ll send confirmation and fulfillment details to your account.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Track status and delivery updates from Open Orders.
            </p>
            <Button asChild className="mt-6" size="sm">
              <Link href="/dashboard/orders?status=open">View open orders</Link>
            </Button>
          </section>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="min-h-[60svh] bg-muted/30 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-[var(--layout-max-width)]">
          <section className="mx-auto max-w-2xl rounded-md border bg-background p-8 text-center shadow-sm">
            <Package className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-sm text-muted-foreground">Add products to your cart before starting checkout.</p>
            <Button asChild className="mt-6" size="sm">
              <Link href="/search?q=blower%20motor&signedin=1">Continue shopping</Link>
            </Button>
          </section>
        </div>
      </main>
    );
  }

  const steps: { id: Step; label: string }[] = [
    { id: "shipping", label: "Fulfillment" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ];
  const currentIndex = steps.findIndex((s) => s.id === step);

  const goToPayment = () => {
    if (!po.trim()) {
      setPoError("PO number is required.");
      return;
    }
    setPoError(undefined);
    setStep("payment");
  };

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <Link href="/search?q=blower%20motor&signedin=1" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to shopping
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
            <p className="mt-1 text-sm text-muted-foreground">Review your order and choose how you&apos;d like to receive it.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Secure checkout
          </div>
        </div>

        {/* Account context — a read-only summary, not a form (the global account
            component owns account switching). */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-4 py-3 text-sm">
          <div>
            <span className="font-semibold">Homans Associates</span>
            <span className="text-muted-foreground"> · #HOM509973 · Manchester, NH</span>
          </div>
          <span className="text-xs text-muted-foreground">Ship to 613 Main Street · change from the account menu</span>
        </div>

        <ol aria-label="Checkout progress" className="mt-6 grid max-w-3xl grid-cols-3 gap-2 text-sm">
          {steps.map((entry, index) => (
            <li
              key={entry.id}
              className={cn(
                "flex items-center gap-2 border-b-2 pb-3",
                step === entry.id
                  ? "border-primary font-semibold text-foreground"
                  : index < currentIndex
                    ? "border-in-stock text-in-stock"
                    : "border-border text-muted-foreground"
              )}
            >
              <span className="grid size-6 place-items-center rounded-full border text-xs">
                {index < currentIndex ? <Check className="size-3.5" /> : index + 1}
              </span>
              {entry.label}
            </li>
          ))}
        </ol>

        {(notices.backorder || notices.nearby) ? (
          <div className="mt-6 space-y-3">
            {notices.backorder ? (
              <Alert className="border-low-stock/40">
                <TriangleAlert className="size-4 text-low-stock" />
                <AlertTitle>Backorder</AlertTitle>
                <AlertDescription>
                  Some items are available on backorder. We&apos;ll contact you with an estimated availability date.
                </AlertDescription>
              </Alert>
            ) : null}
            {notices.nearby ? (
              <Alert className="border-low-stock/40">
                <MapPin className="size-4 text-low-stock" />
                <AlertTitle>Nearby branches</AlertTitle>
                <AlertDescription>
                  Some items are available at another branch and may ship separately.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-md border bg-background shadow-sm">
            {step === "shipping" ? (
              <FulfillmentStep
                fulfillment={fulfillment}
                setFulfillment={setFulfillment}
                po={po}
                setPo={setPo}
                poError={poError}
                seededJob={cfg.seededJob}
                seededDate={cfg.seededDate}
                availabilityConstraint={cfg.availabilityConstraint}
                onNext={goToPayment}
              />
            ) : null}
            {step === "payment" ? (
              <PaymentStep payment={payment} setPayment={setPayment} onBack={() => setStep("shipping")} onNext={() => setStep("review")} />
            ) : null}
            {step === "review" ? (
              <ReviewStep
                items={items}
                fulfillment={fulfillment}
                payment={payment}
                showCoupon={cfg.showCoupon}
                showSpecialHandling={cfg.showSpecialHandling}
                onBack={() => setStep("payment")}
                onEditFulfillment={() => setStep("shipping")}
                onEditPayment={() => setStep("payment")}
                onSubmit={() => setSubmitted(true)}
              />
            ) : null}
          </section>

          <OrderSummary items={items} subtotal={subtotal} tax={tax} total={total} saved={saved} onSave={() => setSaved(true)} />
        </div>
      </div>
    </main>
  );
}

/* ───────────────────────── Sections ───────────────────────── */

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center justify-between border-b px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{number}</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
    </div>
  );
}

function FulfillmentStep({
  fulfillment,
  setFulfillment,
  po,
  setPo,
  poError,
  seededJob,
  seededDate,
  availabilityConstraint,
  onNext,
}: {
  fulfillment: "delivery" | "pickup";
  setFulfillment: (v: "delivery" | "pickup") => void;
  po: string;
  setPo: (v: string) => void;
  poError?: string;
  seededJob: string;
  seededDate: string;
  availabilityConstraint: boolean;
  onNext: () => void;
}) {
  const isPickup = fulfillment === "pickup";
  return (
    <>
      <SectionHeading number="1" title="Fulfillment" />
      <div className="space-y-6 p-5">
        <RadioGroup value={fulfillment} onValueChange={(v) => setFulfillment(v as "delivery" | "pickup")} className="grid gap-3 sm:grid-cols-2">
          <RadioCard value="delivery" selected={!isPickup}>
            <span className="flex items-center gap-2 font-semibold">
              <Truck className="size-4" aria-hidden="true" />
              Delivery
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">Standard delivery · Free</span>
          </RadioCard>
          <RadioCard value="pickup" selected={isPickup}>
            <span className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4" aria-hidden="true" />
              Pickup
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">Manchester branch · choose a date</span>
          </RadioCard>
        </RadioGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="po" label="PO number" required value={po} onChange={(e) => setPo(e.target.value)} placeholder="Enter PO number" error={poError} />
          <Field id="job" label="Job name" placeholder="Optional job name" defaultValue={seededJob || undefined} />

          {isPickup ? (
            <>
              <Field id="branch" label="Pickup branch" required defaultValue="Manchester, NH - Homans" className="sm:col-span-2" />
              <Field id="pickup-date" label="Pickup date" required defaultValue={seededDate} />
              <Field id="contact" label="Contact phone" required defaultValue="+1 978 657 8990" />
            </>
          ) : (
            <>
              <Field id="address" label="Street address" required defaultValue="613 Main Street" className="sm:col-span-2" />
              <Field id="city" label="City" required defaultValue="Williston" />
              <Field id="state" label="State" required defaultValue="VT" />
              <Field id="zip" label="ZIP code" required defaultValue="05495" />
              <Field id="delivery-date" label="Delivery date" required defaultValue={seededDate} />
            </>
          )}
        </div>

        {availabilityConstraint ? (
          <Alert className="border-low-stock/40">
            <TriangleAlert className="size-4 text-low-stock" />
            <AlertTitle>Availability depends on branch transfer and cutoff time</AlertTitle>
            <AlertDescription>We&apos;ll confirm the earliest available date before your order is submitted.</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end border-t pt-5">
          <Button size="sm" onClick={onNext}>Continue to payment</Button>
        </div>
      </div>
    </>
  );
}

function PaymentStep({ payment, setPayment, onBack, onNext }: { payment: "terms" | "card"; setPayment: (v: "terms" | "card") => void; onBack: () => void; onNext: () => void }) {
  const [card, setCard] = React.useState<string>(SAVED_CARDS[0].id);
  return (
    <>
      <SectionHeading number="2" title="Payment" />
      <div className="space-y-5 p-5">
        <RadioGroup value={payment} onValueChange={(v) => setPayment(v as "terms" | "card")} className="grid gap-3">
          <RadioCard value="terms" selected={payment === "terms"}>
            <span className="block font-semibold">Account terms, COD</span>
            <span className="mt-1 block text-sm text-muted-foreground">Charge this order to your Homans account.</span>
          </RadioCard>
          <RadioCard value="card" selected={payment === "card"}>
            <span className="flex items-center gap-2 font-semibold">
              <CreditCard className="size-4" aria-hidden="true" />
              Credit card
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">Use a saved card or add one securely.</span>
          </RadioCard>
        </RadioGroup>

        {payment === "card" ? (
          <div className="space-y-3 rounded-md bg-muted/40 p-4">
            <RadioGroup value={card} onValueChange={setCard} className="grid gap-2">
              {SAVED_CARDS.map((c) => (
                <RadioCard key={c.id} value={c.id} selected={card === c.id} className="bg-background">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium">{c.label}</span>
                    <span className="text-xs text-muted-foreground">{c.meta}</span>
                  </span>
                </RadioCard>
              ))}
              <RadioCard value="new" selected={card === "new"} className="bg-background">
                <span className="font-medium">Add a new card</span>
              </RadioCard>
            </RadioGroup>
            {card === "new" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="card-number" label="Card number" required placeholder="1234 5678 9012 3456" className="sm:col-span-2" />
                <Field id="card-exp" label="Expiration" required placeholder="MM / YY" />
                <Field id="card-cvv" label="CVV" required placeholder="123" />
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex justify-between border-t pt-5">
          <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
          <Button size="sm" onClick={onNext}>Continue to review</Button>
        </div>
      </div>
    </>
  );
}

function ReviewStep({
  items,
  fulfillment,
  payment,
  showCoupon,
  showSpecialHandling,
  onBack,
  onEditFulfillment,
  onEditPayment,
  onSubmit,
}: {
  items: CartItem[];
  fulfillment: string;
  payment: string;
  showCoupon: boolean;
  showSpecialHandling: boolean;
  onBack: () => void;
  onEditFulfillment: () => void;
  onEditPayment: () => void;
  onSubmit: () => void;
}) {
  const [confirmed, setConfirmed] = React.useState(false);
  return (
    <>
      <SectionHeading number="3" title="Review & submit" />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Fulfillment</p>
            <p className="mt-2 font-medium">{fulfillment === "pickup" ? "Pickup — Manchester branch" : "Delivery — Standard"}</p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditFulfillment}>Edit</Button>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Payment</p>
            <p className="mt-2 font-medium">{payment === "card" ? "Credit card" : "Account terms, COD"}</p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditPayment}>Edit</Button>
          </div>
        </div>

        {showCoupon || showSpecialHandling ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {showCoupon ? <Field id="coupon" label="Coupon code" placeholder="Enter coupon code" /> : null}
            {showSpecialHandling ? (
              <Label className="flex items-center gap-3 rounded-md border p-3 text-sm font-normal sm:mt-8">
                <Checkbox />
                Order requires special handling
              </Label>
            ) : null}
          </div>
        ) : null}

        <div className="rounded-md border">
          <div className="border-b px-4 py-3 font-semibold">Items ({items.length})</div>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 border-b px-4 py-3 last:border-0">
              <div className="grid size-12 shrink-0 place-items-center rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <p className="min-w-0 flex-1 text-sm font-medium">
                {item.title}
                <span className="block text-xs text-muted-foreground">Qty {item.quantity}</span>
              </p>
              <span className="text-sm font-semibold">{formatUSD(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Label className="flex gap-3 text-sm font-normal">
          <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
          <span>I confirm the order details are correct and agree to the account terms.</span>
        </Label>

        <div className="flex justify-between border-t pt-5">
          <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
          <Button size="sm" onClick={onSubmit} disabled={!confirmed}>Place order</Button>
        </div>
      </div>
    </>
  );
}

function OrderSummary({
  items,
  subtotal,
  tax,
  total,
  saved,
  onSave,
}: {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <aside className="h-fit rounded-md border bg-background shadow-sm lg:sticky lg:top-6">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} items</p>
      </div>
      <div className="space-y-4 p-5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="grid size-14 shrink-0 place-items-center rounded-md bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold">{formatUSD(item.price * item.quantity)}</p>
          </div>
        ))}
        <div className="space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatUSD(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated tax</span>
            <span>{formatUSD(tax)}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatUSD(total)}</span>
          </div>
        </div>
        <div className="rounded-md bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mr-1 inline size-4 text-in-stock" aria-hidden="true" />
          Your total is shown before payment details, with no surprise fees.
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={onSave} disabled={saved}>
          {saved ? <><Check className="size-4" />Cart saved</> : "Save cart for later"}
        </Button>
      </div>
    </aside>
  );
}
