"use client";

import * as React from "react";
import Link from "next/link";
import {
  Banknote,
  Check,
  ChevronLeft,
  CreditCard,
  LockKeyhole,
  Package,
  Plus,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { useCart, type CartItem } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { OrderDetailsStep } from "./order-details-step";
import { SwitchAccountDrawer, CreditCardDrawer } from "./checkout-drawers";
import {
  getBrandCheckout,
  type BrandBranch,
  type BrandCheckoutConfig,
  type SwitchAccount,
} from "../_lib/brand-checkout";

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

type Step = "details" | "fulfillment" | "payment" | "review";
type Payment = "terms" | "cash" | "card";

type ScenarioConfig = {
  initialStep: Step;
  submitted: boolean;
  method: FulfillmentMethod;
  payment: Payment;
  seededJob: string;
  availabilityConstraint: boolean;
  showCoupon: boolean;
  showSpecialHandling: boolean;
};

const BASE: ScenarioConfig = {
  initialStep: "details",
  submitted: false,
  method: "pickup",
  payment: "terms",
  seededJob: "",
  availabilityConstraint: false,
  showCoupon: false,
  showSpecialHandling: false,
};

const CHECKOUT_SCENARIOS: Record<CheckoutCase, Partial<ScenarioConfig>> = {
  "account-job-context": { seededJob: "Spring maintenance" },
  // Opens on Fulfillment with a delivery method already selected (routing to a grouped address).
  "delivery-pickup-routing": { initialStep: "fulfillment", method: "ups" },
  // Opens on Fulfillment with the date-cutoff messaging visible on a delivery method.
  "availability-date-constraints": { initialStep: "fulfillment", method: "truck", availabilityConstraint: true },
  "terms-or-credit-card": { initialStep: "payment", payment: "card" },
  "review-coupon-special-handling": { initialStep: "review", showCoupon: true, showSpecialHandling: true },
  "order-confirmation": { initialStep: "review", submitted: true },
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

  // Account is bound to the brand-checkout config for now (switchAccounts[0]).
  // SEAM: the cart page's selected account should feed this state once the
  // cart→checkout account hand-off is wired — that is the follow-up.
  const accounts = brand.switchAccounts;
  const [accountId, setAccountId] = React.useState(accounts[0].id);
  const [defaultAccountId, setDefaultAccountId] = React.useState(accounts[0].id);
  const [accountDrawerOpen, setAccountDrawerOpen] = React.useState(false);
  const account: SwitchAccount = accounts.find((a) => a.id === accountId) ?? accounts[0];

  // Branch is lifted here so Order Details and the Fulfillment pickup panel
  // share one branch choice.
  const defaultBranch = brand.branches.find((b) => b.current) ?? brand.branches[0];
  const [branch, setBranch] = React.useState<BrandBranch>(defaultBranch);
  const changeBranch = (b: BrandBranch) => {
    setBranch(b);
    toast.success(`Now shopping ${b.name}`);
  };

  const [step, setStep] = React.useState<Step>(cfg.initialStep);
  const [submitted, setSubmitted] = React.useState(cfg.submitted);
  const [method, setMethod] = React.useState<FulfillmentMethod>(initialMethod);
  const [payment, setPayment] = React.useState<Payment>(cfg.payment);
  const [po, setPo] = React.useState("PO-2048");
  const [job, setJob] = React.useState(cfg.seededJob);
  const [jobAccount, setJobAccount] = React.useState(
    (brand.addresses.find((a) => a.group === "job" && a.isDefault) ?? brand.addresses.find((a) => a.group === "job"))?.id ?? ""
  );
  const [notes, setNotes] = React.useState("");
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
    { id: "details", label: "Order details" },
    { id: "fulfillment", label: "Fulfillment" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ];
  const currentIndex = steps.findIndex((s) => s.id === step);

  // PO is required to leave Order Details.
  const goToFulfillment = () => {
    if (!po.trim()) {
      setPoError("PO number is required.");
      return;
    }
    setPoError(undefined);
    setStep("fulfillment");
  };

  // Special handling requires branch comments before the order can be placed.
  const handlingBlocks = cfg.showSpecialHandling && specialHandling && !handlingComments.trim();

  // The sticky order-summary CTA is context-aware: it carries the forward action
  // for the current step, so on a long review the Place-order button stays pinned.
  const primary =
    step === "details"
      ? { label: "Continue to fulfillment", onClick: goToFulfillment, disabled: false }
      : step === "fulfillment"
        ? { label: "Continue to payment", onClick: () => setStep("payment"), disabled: false }
        : step === "payment"
          ? { label: "Continue to review", onClick: () => setStep("review"), disabled: false }
          : { label: "Place order", onClick: () => setSubmitted(true), disabled: !confirmed || handlingBlocks };

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <Link href={`/cart?brand=${brandKey}${demo ? "&demo=1" : ""}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to cart
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Secure checkout
          </div>
        </div>

        <ol aria-label="Checkout progress" className="mt-6 grid max-w-3xl grid-cols-4 gap-2 text-sm">
          {steps.map((entry, index) => {
            const isActive = step === entry.id;
            const isComplete = index < currentIndex;
            const content = (
              <>
                <span className="grid size-6 place-items-center rounded-full border text-xs">
                  {isComplete ? <Check className="size-3.5" /> : index + 1}
                </span>
                {entry.label}
              </>
            );
            const className = cn(
              "flex w-full items-center gap-2 border-b-2 pb-3 text-left",
              isActive
                ? "border-primary font-semibold text-foreground"
                : isComplete
                  ? "border-in-stock text-in-stock"
                  : "border-border text-muted-foreground"
            );
            return (
              <li key={entry.id} aria-current={isActive ? "step" : undefined}>
                {/* Completed steps are navigable backward; forward moves gate via Continue. */}
                {isComplete ? (
                  <button type="button" className={cn(className, "hover:text-foreground")} onClick={() => setStep(entry.id)}>
                    {content}
                  </button>
                ) : (
                  <span className={className}>{content}</span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-md border bg-background shadow-sm">
            {step === "details" ? (
              <OrderDetailsStep
                brand={brand}
                account={account}
                onSwitchAccount={() => setAccountDrawerOpen(true)}
                branch={branch}
                branches={brand.branches}
                onChangeBranch={changeBranch}
                po={po}
                setPo={setPo}
                poError={poError}
                jobAccount={jobAccount}
                setJobAccount={setJobAccount}
                jobName={job}
                setJobName={setJob}
                notes={notes}
                setNotes={setNotes}
              />
            ) : null}
            {step === "fulfillment" ? (
              <>
                <SectionHeading number="2" title="Fulfillment" />
                <FulfillmentSection
                  config={brand}
                  method={method}
                  setMethod={setMethod}
                  availabilityConstraint={cfg.availabilityConstraint}
                  branch={branch}
                  onChangeBranch={changeBranch}
                />
              </>
            ) : null}
            {step === "payment" ? (
              <PaymentStep brand={brand} payment={payment} setPayment={setPayment} onBack={() => setStep("fulfillment")} />
            ) : null}
            {step === "review" ? (
              <ReviewStep
                brand={brand}
                items={items}
                account={account}
                method={method}
                payment={payment}
                po={po}
                job={job}
                notes={notes}
                showSpecialHandling={cfg.showSpecialHandling}
                specialHandling={specialHandling}
                setSpecialHandling={setSpecialHandling}
                handlingComments={handlingComments}
                setHandlingComments={setHandlingComments}
                onBack={() => setStep("payment")}
                onEditDetails={() => setStep("details")}
                onEditFulfillment={() => setStep("fulfillment")}
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

      {/* Switch-account drawer is owned by the client so the choice persists
          across steps and feeds the Review summary. */}
      <SwitchAccountDrawer
        open={accountDrawerOpen}
        onClose={() => setAccountDrawerOpen(false)}
        accounts={accounts}
        currentId={accountId}
        defaultId={defaultAccountId}
        onSelect={setAccountId}
        onSetDefault={setDefaultAccountId}
      />
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
      <SectionHeading number="3" title="Payment" />
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
  account,
  method,
  payment,
  po,
  job,
  notes,
  showSpecialHandling,
  specialHandling,
  setSpecialHandling,
  handlingComments,
  setHandlingComments,
  onBack,
  onEditDetails,
  onEditFulfillment,
  onEditPayment,
}: {
  brand: BrandCheckoutConfig;
  items: CartItem[];
  account: SwitchAccount;
  method: FulfillmentMethod;
  payment: Payment;
  po: string;
  job: string;
  notes: string;
  showSpecialHandling: boolean;
  specialHandling: boolean;
  setSpecialHandling: (v: boolean) => void;
  handlingComments: string;
  setHandlingComments: (v: string) => void;
  onBack: () => void;
  onEditDetails: () => void;
  onEditFulfillment: () => void;
  onEditPayment: () => void;
}) {
  const commentsMissing = specialHandling && !handlingComments.trim();
  return (
    <>
      <SectionHeading number="4" title="Review & submit" />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Order details</p>
            <p className="mt-2 font-medium">{account.name}</p>
            <p className="text-sm text-muted-foreground">{account.detail}</p>
            <p className="mt-1 text-sm text-muted-foreground">PO {po || "—"}</p>
            <p className="text-sm text-muted-foreground">{job ? `Job: ${job}` : "No job name"}</p>
            {notes.trim() ? <p className="text-sm text-muted-foreground line-clamp-2">Notes: {notes}</p> : null}
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditDetails}>Change</Button>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Fulfillment</p>
            <p className="mt-2 font-medium">
              {isDeliveryMethod(method) ? `Delivery — ${methodLabel(method)}` : `Pickup — ${brand.pickupBranchShort}`}
            </p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditFulfillment}>Change</Button>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Payment</p>
            <p className="mt-2 font-medium">{paymentLabel(payment)}</p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditPayment}>Change</Button>
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
        <div className="space-y-2 text-sm">
          {/* Itemized list — plain text rows (name → line total), styled like the
              summary rows below and flowing straight into Subtotal. No thumbnails. */}
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {item.quantity > 1 ? `Qty ${item.quantity} · ` : null}
                {item.title}
              </span>
              <span className="shrink-0">{formatUSD(item.price * item.quantity)}</span>
            </div>
          ))}
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

        {/* Sticky primary CTA — the strongest action, always reachable.
            "Save cart for later" lives on the cart page only, not in checkout. */}
        <Button className="w-full" onClick={primary.onClick} disabled={primary.disabled}>
          {primary.label}
        </Button>
      </div>
    </aside>
  );
}
