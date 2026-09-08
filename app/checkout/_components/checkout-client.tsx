"use client";

import * as React from "react";
import Link from "next/link";
import {
  Banknote,
  Building2,
  Check,
  ChevronLeft,
  CreditCard,
  LockKeyhole,
  MapPin,
  Package,
  PackageCheck,
  Plus,
  Printer,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

import { useCart, type CartItem } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/pdp/_lib/types";
import type { CheckoutCase } from "../page";
import {
  FulfillmentSection,
  METHOD_RATE,
  methodLabel,
  isDeliveryMethod,
  type FulfillmentMethod,
} from "./fulfillment";
import { StockUnavailablePanel } from "./stock-unavailable";
import { SwitchAccountDrawer, CreditCardDrawer } from "./checkout-drawers";
import { getBrandCheckout, type BrandCheckoutConfig } from "../_lib/brand-checkout";

/* ───────────────────────── Demo data ───────────────────────── */

const DEMO_ITEMS: CartItem[] = [
  { id: "checkout-air-handler", title: "Aspen® 3-Ton Multi-Position Electric Air Handler", brand: "Aspen", price: 676.5, quantity: 1, image: "/peirce-search/blower-motor-07.avif" },
  { id: "checkout-wire-rope", title: "Duro Dyne® Cable Lock Wire Rope - 500' Roll", brand: "Duro Dyne", price: 277, quantity: 1, image: "/peirce-search/blower-motor-17.avif" },
];

/* Saved cards are modeled as SHARED FROM THE COMPANY — the account, not the
 * individual, owns the card on file (ECM pattern). */
const SAVED_CARDS = [
  { id: "visa-6177", tail: "6177", expires: "4/2028" },
  { id: "mc-8801", tail: "8801", expires: "2/2027" },
];

/* The in-checkout switch-account control, pickup branches, and grouped "Deliver
 * to" addresses are all per-brand — they come from the brand checkout config, so
 * each brand shows only its own account / store / address data. */

/* ───────────────────────── Scenario model ─────────────────────────
 * The 6 use cases are STATES of one flow, not separate flows. Each case is a
 * single config entry — no scattered `scenario === "…"` branching in the JSX. */

type Step = "shipping" | "payment" | "review";
type Payment = "terms" | "cash" | "card";

type ScenarioConfig = {
  initialStep: Step;
  submitted: boolean;
  method: FulfillmentMethod;
  payment: Payment;
  notices: { backorder: boolean; nearby: boolean };
  seededJob: string;
  availabilityConstraint: boolean;
  showCoupon: boolean;
  showSpecialHandling: boolean;
};

const BASE: ScenarioConfig = {
  initialStep: "shipping",
  submitted: false,
  method: "pickup",
  payment: "terms",
  notices: { backorder: true, nearby: true },
  seededJob: "",
  availabilityConstraint: false,
  showCoupon: false,
  showSpecialHandling: false,
};

const CHECKOUT_SCENARIOS: Record<CheckoutCase, Partial<ScenarioConfig>> = {
  "account-job-context": { notices: { backorder: false, nearby: false }, seededJob: "Spring maintenance" },
  // Opens on Fulfillment with a delivery method already selected (routing to a grouped address).
  "delivery-pickup-routing": { method: "ups", notices: { backorder: false, nearby: false } },
  // Opens on Fulfillment with the date-cutoff messaging visible on a delivery method.
  "availability-date-constraints": { method: "truck", availabilityConstraint: true, notices: { backorder: false, nearby: false } },
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

/* ───────────────────────── Main ───────────────────────── */

export default function CheckoutClient({
  scenario,
  demo = false,
  brandKey = "homans",
}: {
  scenario?: CheckoutCase;
  demo?: boolean;
  brandKey?: string;
}) {
  const cfg = resolveScenario(scenario);
  const brand = getBrandCheckout(brandKey);
  const { items: cartItems } = useCart();
  const items = cartItems.length ? cartItems : (demo || scenario ? DEMO_ITEMS : []);

  // A scenario may request a method this brand doesn't expose — clamp it to the
  // brand's first delivery method, else Pickup, so the selection stays valid.
  const initialMethod = brand.methods.includes(cfg.method)
    ? cfg.method
    : (brand.methods.find(isDeliveryMethod) ?? "pickup");

  const [step, setStep] = React.useState<Step>(cfg.initialStep);
  const [submitted, setSubmitted] = React.useState(cfg.submitted);
  const [saved, setSaved] = React.useState(false);
  const [method, setMethod] = React.useState<FulfillmentMethod>(initialMethod);
  const [payment, setPayment] = React.useState<Payment>(cfg.payment);
  const [notices, setNotices] = React.useState(cfg.notices);
  const [po, setPo] = React.useState("PO-2048");
  const [job, setJob] = React.useState(cfg.seededJob);
  const [reference, setReference] = React.useState("");
  const [poError, setPoError] = React.useState<string | undefined>();
  const [confirmed, setConfirmed] = React.useState(false);
  const [coupon, setCoupon] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  // Special handling (Homans): checking it reveals a REQUIRED branch-comments
  // field that blocks Place order until filled.
  const [specialHandling, setSpecialHandling] = React.useState(false);
  const [handlingComments, setHandlingComments] = React.useState("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Applied coupon takes 10% off the subtotal.
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * brand.taxRate;
  // Shipping reflects the chosen fulfillment method's rate.
  const shipping = METHOD_RATE[method];
  const total = subtotal - discount + tax + shipping;

  if (submitted) {
    return (
      <main className="min-h-[60svh] bg-muted/30 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-[var(--layout-max-width)]">
          <section className="mx-auto max-w-2xl rounded-md border bg-background p-8 text-center shadow-sm">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-in-stock/15 text-in-stock">
              <Check aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Order submitted</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground text-balance">
              Order <span className="font-semibold text-foreground">{brand.orderNumber}</span> is being reviewed.
              We&apos;ll send confirmation and fulfillment details to your account.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground text-balance">
              Track status and delivery updates from Open Orders.
            </p>
            {/* Primary ("View open orders") on the RIGHT, secondary on the LEFT,
                equal width — the global button-pair rule. */}
            <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}>
                <Printer className="size-4" aria-hidden="true" />
                Print confirmation
              </Button>
              <Button asChild size="sm" className="w-full">
                <Link href="/dashboard/orders?status=open">View open orders</Link>
              </Button>
            </div>
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

  // Special handling requires branch comments before the order can be placed.
  const handlingBlocks = cfg.showSpecialHandling && specialHandling && !handlingComments.trim();

  // The sticky order-summary CTA is context-aware: it carries the forward action
  // for the current step, so on a long review the Place-order button stays pinned.
  const primary =
    step === "shipping"
      ? { label: "Continue to payment", onClick: goToPayment, disabled: false }
      : step === "payment"
        ? { label: "Continue to review", onClick: () => setStep("review"), disabled: false }
        : { label: "Place order", onClick: () => setSubmitted(true), disabled: !confirmed || handlingBlocks };

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

        {/* Account context — with an in-checkout Switch account control. */}
        <AccountContextRow brand={brand} />

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

        {/* Stock notices belong to the Fulfillment step only — once the user
         * has advanced past it they've decided how to proceed, so hide them. */}
        {step === "shipping" ? ((notices.backorder || notices.nearby) ? (
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
            {/* Itemized detail: which items are short at the current store, and the
             * options to proceed. Stacks beneath the summary alerts; not dismissable. */}
            <StockUnavailablePanel items={items} />
          </div>
        ) : (
          // No stock warnings → positive inventory confirmation (Peirce pattern).
          <div className="mt-6">
            <Alert variant="success">
              <PackageCheck />
              <AlertTitle>Inventory confirmed — all items available</AlertTitle>
              <AlertDescription>
                Every item on this order is in stock at your branch and ready to fulfill.
              </AlertDescription>
            </Alert>
          </div>
        )) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-md border bg-background shadow-sm">
            {step === "shipping" ? (
              <FulfillmentStep
                config={brand}
                method={method}
                setMethod={setMethod}
                po={po}
                setPo={setPo}
                job={job}
                setJob={setJob}
                reference={reference}
                setReference={setReference}
                poError={poError}
                availabilityConstraint={cfg.availabilityConstraint}
              />
            ) : null}
            {step === "payment" ? (
              <PaymentStep brand={brand} payment={payment} setPayment={setPayment} onBack={() => setStep("shipping")} />
            ) : null}
            {step === "review" ? (
              <ReviewStep
                brand={brand}
                items={items}
                method={method}
                payment={payment}
                po={po}
                job={job}
                reference={reference}
                showSpecialHandling={cfg.showSpecialHandling}
                specialHandling={specialHandling}
                setSpecialHandling={setSpecialHandling}
                handlingComments={handlingComments}
                setHandlingComments={setHandlingComments}
                onBack={() => setStep("payment")}
                onEditFulfillment={() => setStep("shipping")}
                onEditPayment={() => setStep("payment")}
              />
            ) : null}
          </section>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            shipping={shipping}
            total={total}
            saved={saved}
            onSave={() => setSaved(true)}
            primary={primary}
            coupon={coupon}
            setCoupon={setCoupon}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={() => coupon.trim() && setAppliedCoupon(coupon.trim().toUpperCase())}
            showConfirm={step === "review"}
            confirmed={confirmed}
            setConfirmed={setConfirmed}
          />
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

/** The Fulfillment step: order-level details (PO / job) above the one unified
 *  fulfillment section (method selector + method panel). The section owns all
 *  method/address/date/modifier logic; this wrapper only supplies the header
 *  and the PO gate. */
const MAX_REFERENCE = 24;

function FulfillmentStep({
  config,
  method,
  setMethod,
  po,
  setPo,
  job,
  setJob,
  reference,
  setReference,
  poError,
  availabilityConstraint,
}: {
  config: BrandCheckoutConfig;
  method: FulfillmentMethod;
  setMethod: (m: FulfillmentMethod) => void;
  po: string;
  setPo: (v: string) => void;
  job: string;
  setJob: (v: string) => void;
  reference: string;
  setReference: (v: string) => void;
  poError?: string;
  availabilityConstraint: boolean;
}) {
  return (
    <>
      <SectionHeading number="1" title="Fulfillment" />
      <div className="space-y-5 border-b p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="po" label="PO number" required value={po} onChange={(e) => setPo(e.target.value)} placeholder="Enter PO number" error={poError} />
          <Field id="job" label="Job name" placeholder="Optional job name" value={job} onChange={(e) => setJob(e.target.value)} />
          <Field
            id="reference"
            label="Reference"
            placeholder="Optional reference"
            maxLength={MAX_REFERENCE}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
        <OrderDetailsExtras />
      </div>
      <FulfillmentSection config={config} method={method} setMethod={setMethod} availabilityConstraint={availabilityConstraint} />
    </>
  );
}

const MAX_NOTES = 2000;

/** Order Details extras — the superset of order-level options across brands:
 *  order notes (Peirce), plus confirmation email + additional recipients +
 *  notify-salesperson (ECM). Self-contained: none of these gate submit. */
function OrderDetailsExtras() {
  const [notes, setNotes] = React.useState("");
  const [sendEmail, setSendEmail] = React.useState(true);
  const [notifyRep, setNotifyRep] = React.useState(false);
  const [recipients, setRecipients] = React.useState<string[]>([]);

  const addRecipient = () => setRecipients((r) => [...r, ""]);
  const removeRecipient = (index: number) => setRecipients((r) => r.filter((_, i) => i !== index));
  const setRecipient = (index: number, value: string) =>
    setRecipients((r) => r.map((v, i) => (i === index ? value : v)));

  return (
    <div className="space-y-5">
      {/* Order notes (Peirce) */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor="order-notes">Order notes</Label>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {notes.length}/{MAX_NOTES}
          </span>
        </div>
        <Textarea
          id="order-notes"
          value={notes}
          maxLength={MAX_NOTES}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a note for this order (visible to your branch)"
          className="min-h-20"
        />
      </div>

      {/* Confirmation email + recipients + notify salesperson (ECM) */}
      <div className="space-y-3 rounded-md border bg-muted/30 p-4">
        <Label className="flex items-start gap-3 text-sm font-normal">
          <Checkbox checked={sendEmail} onCheckedChange={(v) => setSendEmail(v === true)} className="mt-0.5" />
          <span>
            <span className="block font-medium text-foreground">Send order confirmation email</span>
            <span className="block text-xs text-muted-foreground">A copy of this order goes to your account email.</span>
          </span>
        </Label>

        {sendEmail ? (
          <div className="space-y-2 pl-7">
            {recipients.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setRecipient(index, e.target.value)}
                  placeholder="name@company.com"
                  aria-label={`Additional recipient ${index + 1}`}
                  className="h-9"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => removeRecipient(index)}
                  aria-label={`Remove recipient ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
              <Plus className="size-4" />
              Add recipient
            </Button>
          </div>
        ) : null}

        <Label className="flex items-start gap-3 border-t pt-3 text-sm font-normal">
          <Checkbox checked={notifyRep} onCheckedChange={(v) => setNotifyRep(v === true)} className="mt-0.5" />
          <span>
            <span className="block font-medium text-foreground">Notify your salesperson (Dana Whitfield)</span>
            <span className="block text-xs text-muted-foreground">Send a heads-up to your assigned rep when this order is placed.</span>
          </span>
        </Label>
      </div>
    </div>
  );
}

/* ───────────────────────── Account context + switch account ───────────────────────── */

function AccountContextRow({ brand }: { brand: BrandCheckoutConfig }) {
  const accounts = brand.switchAccounts;
  const [open, setOpen] = React.useState(false);
  const [currentId, setCurrentId] = React.useState(accounts[0].id);
  const [defaultId, setDefaultId] = React.useState(accounts[0].id);
  const current = accounts.find((a) => a.id === currentId) ?? accounts[0];

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-4 py-3 text-sm">
      <div className="min-w-0">
        <span className="font-semibold">{current.name}</span>
        <span className="text-muted-foreground"> · {current.detail}</span>
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

type CardOption = { id: string; tail: string; expires: string; added?: boolean };

function PaymentStep({
  brand,
  payment,
  setPayment,
  onBack,
}: {
  brand: BrandCheckoutConfig;
  payment: Payment;
  setPayment: (v: Payment) => void;
  onBack: () => void;
}) {
  const [addedCards, setAddedCards] = React.useState<CardOption[]>([]);
  const [card, setCard] = React.useState<string>(SAVED_CARDS[0].id);
  const [cardDrawerOpen, setCardDrawerOpen] = React.useState(false);
  const [billingSame, setBillingSame] = React.useState(true);

  const cards: CardOption[] = [...SAVED_CARDS, ...addedCards];
  const billingAddress = brand.addresses.find((a) => a.group === "billing");

  const addCard = (tail: string) => {
    const id = `card-${tail}-${addedCards.length}`;
    setAddedCards((prev) => [...prev, { id, tail, expires: "—", added: true }]);
    setCard(id);
  };

  return (
    <>
      <SectionHeading number="2" title="Payment" />
      <div className="space-y-5 p-5">
        <RadioGroup value={payment} onValueChange={(v) => setPayment(v as Payment)} className="grid gap-3">
          <RadioCard value="terms" selected={payment === "terms"}>
            <span className="block font-semibold">Account terms, COD</span>
            <span className="mt-1 block text-sm text-muted-foreground">Charge this order to your {brand.brandName} account.</span>
          </RadioCard>
          <RadioCard value="cash" selected={payment === "cash"}>
            <span className="flex items-center gap-2 font-semibold">
              <Banknote className="size-4" aria-hidden="true" />
              Cash on pickup
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">Pay at the branch counter when you collect the order.</span>
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
          <div className="space-y-4 rounded-md bg-muted/40 p-4">
            <RadioGroup value={card} onValueChange={setCard} className="grid gap-2">
              {cards.map((c) => (
                <RadioCard key={c.id} value={c.id} selected={card === c.id} className="bg-background">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium">•••• {c.tail}</span>
                    {c.expires !== "—" ? (
                      <span className="text-xs text-muted-foreground">· expires {c.expires} ·</span>
                    ) : null}
                    <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {c.added ? "Added this order" : "Shared from the company"}
                    </span>
                  </span>
                </RadioCard>
              ))}
            </RadioGroup>
            <Button variant="outline" size="sm" onClick={() => setCardDrawerOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              Add a new card
            </Button>

            {/* Billing address — same as shipping by default; unchecking reveals
                an editable billing block. */}
            <div className="space-y-3 rounded-md border bg-background p-4">
              <Label className="flex items-start gap-3 text-sm font-normal">
                <Checkbox checked={billingSame} onCheckedChange={(v) => setBillingSame(v === true)} className="mt-0.5" />
                <span>
                  <span className="block font-medium text-foreground">My billing and shipping address are the same</span>
                  <span className="block text-xs text-muted-foreground">We&apos;ll bill the delivery/pickup address on this order.</span>
                </span>
              </Label>
              {!billingSame ? <BillingAddressBlock billingAddress={billingAddress} /> : null}
            </div>
          </div>
        ) : null}

        <div className="flex justify-start border-t pt-5">
          <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
        </div>
      </div>

      <CreditCardDrawer open={cardDrawerOpen} onClose={() => setCardDrawerOpen(false)} onSave={addCard} />
    </>
  );
}

/** Editable billing address — a summary the buyer can expand into fields. */
function BillingAddressBlock({ billingAddress }: { billingAddress?: BrandCheckoutConfig["addresses"][number] }) {
  const [editing, setEditing] = React.useState(false);

  if (editing) {
    return (
      <div className="grid gap-4 border-t pt-3 sm:grid-cols-2">
        <Field id="bill-name" label="Name / company" required defaultValue={billingAddress?.name} className="sm:col-span-2" />
        <Field id="bill-street" label="Street address" required defaultValue={billingAddress?.line1} className="sm:col-span-2" />
        <Field id="bill-city" label="City" required defaultValue={billingAddress?.city} />
        <Field id="bill-state" label="State" required defaultValue={billingAddress?.state} />
        <Field id="bill-zip" label="ZIP code" required defaultValue={billingAddress?.zip} />
        <div className="sm:col-span-2">
          <Button type="button" size="sm" onClick={() => setEditing(false)}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3 border-t pt-3">
      <div className="min-w-0 text-sm">
        {billingAddress ? (
          <>
            <p className="font-medium">{billingAddress.name}</p>
            <p className="text-muted-foreground">
              {billingAddress.line1}, {billingAddress.city}, {billingAddress.state} {billingAddress.zip}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No billing address on file.</p>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
        Edit
      </Button>
    </div>
  );
}

function paymentLabel(payment: Payment): string {
  if (payment === "card") return "Credit card";
  if (payment === "cash") return "Cash on pickup";
  return "Account terms, COD";
}

const MAX_HANDLING_COMMENTS = 300;

function ReviewStep({
  brand,
  items,
  method,
  payment,
  po,
  job,
  reference,
  showSpecialHandling,
  specialHandling,
  setSpecialHandling,
  handlingComments,
  setHandlingComments,
  onBack,
  onEditFulfillment,
  onEditPayment,
}: {
  brand: BrandCheckoutConfig;
  items: CartItem[];
  method: FulfillmentMethod;
  payment: Payment;
  po: string;
  job: string;
  reference: string;
  showSpecialHandling: boolean;
  specialHandling: boolean;
  setSpecialHandling: (v: boolean) => void;
  handlingComments: string;
  setHandlingComments: (v: string) => void;
  onBack: () => void;
  onEditFulfillment: () => void;
  onEditPayment: () => void;
}) {
  const commentsMissing = specialHandling && !handlingComments.trim();
  return (
    <>
      <SectionHeading number="3" title="Review & submit" />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Order details</p>
            <p className="mt-2 font-medium">PO {po || "—"}</p>
            <p className="text-sm text-muted-foreground">{job ? `Job: ${job}` : "No job name"}</p>
            {reference ? <p className="text-sm text-muted-foreground">Ref: {reference}</p> : null}
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditFulfillment}>Edit</Button>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Fulfillment</p>
            <p className="mt-2 font-medium">
              {isDeliveryMethod(method) ? `Delivery — ${methodLabel(method)}` : `Pickup — ${brand.pickupBranchShort}`}
            </p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditFulfillment}>Edit</Button>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Payment</p>
            <p className="mt-2 font-medium">{paymentLabel(payment)}</p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditPayment}>Edit</Button>
          </div>
        </div>

        {showSpecialHandling ? (
          <div className="space-y-3 rounded-md border p-4">
            <Label className="flex items-center gap-3 text-sm font-normal">
              <Checkbox checked={specialHandling} onCheckedChange={(v) => setSpecialHandling(v === true)} />
              Order requires special handling
            </Label>
            {specialHandling ? (
              <div className="space-y-2 pl-7">
                <div className="flex items-baseline justify-between gap-2">
                  <Label htmlFor="handling-comments">
                    Comments for branch
                    <span className="ml-0.5 text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-muted-foreground" aria-live="polite">
                    {handlingComments.length}/{MAX_HANDLING_COMMENTS}
                  </span>
                </div>
                <Textarea
                  id="handling-comments"
                  required
                  value={handlingComments}
                  maxLength={MAX_HANDLING_COMMENTS}
                  onChange={(e) => setHandlingComments(e.target.value)}
                  aria-invalid={commentsMissing ? true : undefined}
                  placeholder="Tell the branch what this order needs (e.g. crated, appointment delivery, dock hours)."
                  className="min-h-20"
                />
                {commentsMissing ? (
                  <p className="text-xs font-medium text-destructive">
                    Comments are required before this order can be placed.
                  </p>
                ) : null}
              </div>
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

        <div className="flex justify-start border-t pt-5">
          <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
        </div>
      </div>
    </>
  );
}

function OrderSummary({
  items,
  subtotal,
  discount,
  tax,
  shipping,
  total,
  saved,
  onSave,
  primary,
  coupon,
  setCoupon,
  appliedCoupon,
  onApplyCoupon,
  showConfirm,
  confirmed,
  setConfirmed,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  saved: boolean;
  onSave: () => void;
  primary: { label: string; onClick: () => void; disabled: boolean };
  coupon: string;
  setCoupon: (v: string) => void;
  appliedCoupon: string | null;
  onApplyCoupon: () => void;
  showConfirm: boolean;
  confirmed: boolean;
  setConfirmed: (v: boolean) => void;
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
          {discount > 0 ? (
            <div className="flex justify-between text-in-stock">
              <span>Discount{appliedCoupon ? ` (${appliedCoupon})` : ""}</span>
              <span>−{formatUSD(discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping > 0 ? formatUSD(shipping) : "Free"}</span>
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
        {/* Coupon — lives in the summary, near the total. */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code"
              aria-label="Coupon code"
              className="h-9"
            />
            <Button variant="outline" size="sm" className="h-9 shrink-0" onClick={onApplyCoupon} disabled={!coupon.trim()}>
              Apply
            </Button>
          </div>
          {appliedCoupon ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-in-stock">
              <Check className="size-3.5" />
              Coupon {appliedCoupon} applied
            </p>
          ) : null}
        </div>

        <div className="rounded-md bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mr-1 inline size-4 text-in-stock" aria-hidden="true" />
          Your total is shown before payment details, with no surprise fees.
        </div>

        {/* Confirm gate sits right above Place order, so the grey→blue is clear. */}
        {showConfirm ? (
          <Label className="flex gap-2.5 text-sm font-normal">
            <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
            <span>I confirm the order details are correct and agree to the account terms.</span>
          </Label>
        ) : null}

        {/* Sticky primary CTA — the strongest action, always reachable. */}
        <Button className="w-full" onClick={primary.onClick} disabled={primary.disabled}>
          {primary.label}
        </Button>

        {/* Save for later — a de-emphasized link, not a competing button. */}
        <div className="text-center">
          <button
            type="button"
            onClick={onSave}
            disabled={saved}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80 disabled:text-muted-foreground"
          >
            {saved ? "Cart saved" : "Save cart for later"}
          </button>
        </div>
      </div>
    </aside>
  );
}
