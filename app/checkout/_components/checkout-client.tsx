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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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

/* Accounts reachable from the in-checkout switch-account control (Homans
 * pattern). Superset of contexts: account / ship-to / company / location. */
type SwitchAccount = {
  id: string;
  name: string;
  kind: "Account" | "Ship-to" | "Company" | "Location";
  detail: string;
};

const SWITCH_ACCOUNTS: SwitchAccount[] = [
  { id: "hom509973", name: "Homans Associates", kind: "Account", detail: "#HOM509973 · Manchester, NH" },
  { id: "hom-613main", name: "613 Main Street", kind: "Ship-to", detail: "Manchester, NH 03101" },
  { id: "hom-north", name: "North warehouse", kind: "Location", detail: "42 Industrial Way, Concord, NH" },
  { id: "hom-parent", name: "Homans — New England", kind: "Company", detail: "Parent company · 12 branches" },
  { id: "hom-portsmouth", name: "Portsmouth branch", kind: "Location", detail: "155 Heritage Ave, Portsmouth, NH" },
];

const ORDER_NUMBER = "HOM-2026-04871";
const TAX_RATE = 0.0625;

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

export default function CheckoutClient({ scenario, demo = false }: { scenario?: CheckoutCase; demo?: boolean }) {
  const cfg = resolveScenario(scenario);
  const { items: cartItems } = useCart();
  const items = cartItems.length ? cartItems : (demo || scenario ? DEMO_ITEMS : []);

  const [step, setStep] = React.useState<Step>(cfg.initialStep);
  const [submitted, setSubmitted] = React.useState(cfg.submitted);
  const [saved, setSaved] = React.useState(false);
  const [method, setMethod] = React.useState<FulfillmentMethod>(cfg.method);
  const [payment, setPayment] = React.useState<Payment>(cfg.payment);
  const [notices, setNotices] = React.useState(cfg.notices);
  const [po, setPo] = React.useState("PO-2048");
  const [job, setJob] = React.useState(cfg.seededJob);
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
  const tax = (subtotal - discount) * TAX_RATE;
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
            <p className="mt-2 text-sm text-muted-foreground">
              Order <span className="font-semibold text-foreground">{ORDER_NUMBER}</span> is being reviewed.
              We&apos;ll send confirmation and fulfillment details to your account.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Track status and delivery updates from Open Orders.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm">
                <Link href="/dashboard/orders?status=open">View open orders</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="size-4" aria-hidden="true" />
                Print order confirmation
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
        <AccountContextRow />

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
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-md border bg-background shadow-sm">
            {step === "shipping" ? (
              <FulfillmentStep
                method={method}
                setMethod={setMethod}
                po={po}
                setPo={setPo}
                job={job}
                setJob={setJob}
                poError={poError}
                availabilityConstraint={cfg.availabilityConstraint}
              />
            ) : null}
            {step === "payment" ? (
              <PaymentStep payment={payment} setPayment={setPayment} onBack={() => setStep("shipping")} />
            ) : null}
            {step === "review" ? (
              <ReviewStep
                items={items}
                method={method}
                payment={payment}
                po={po}
                job={job}
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
function FulfillmentStep({
  method,
  setMethod,
  po,
  setPo,
  job,
  setJob,
  poError,
  availabilityConstraint,
}: {
  method: FulfillmentMethod;
  setMethod: (m: FulfillmentMethod) => void;
  po: string;
  setPo: (v: string) => void;
  job: string;
  setJob: (v: string) => void;
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
        </div>
        <OrderDetailsExtras />
      </div>
      <FulfillmentSection method={method} setMethod={setMethod} availabilityConstraint={availabilityConstraint} />
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

function AccountContextRow() {
  const [open, setOpen] = React.useState(false);
  const [currentId, setCurrentId] = React.useState(SWITCH_ACCOUNTS[0].id);
  const [defaultId, setDefaultId] = React.useState(SWITCH_ACCOUNTS[0].id);
  const current = SWITCH_ACCOUNTS.find((a) => a.id === currentId) ?? SWITCH_ACCOUNTS[0];

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
      <SwitchAccountDialog
        open={open}
        onOpenChange={setOpen}
        currentId={currentId}
        defaultId={defaultId}
        onSelect={setCurrentId}
        onSetDefault={setDefaultId}
      />
    </div>
  );
}

function SwitchAccountDialog({
  open,
  onOpenChange,
  currentId,
  defaultId,
  onSelect,
  onSetDefault,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentId: string;
  defaultId: string;
  onSelect: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Switch account</DialogTitle>
          <DialogDescription>Choose the account, ship-to, company, or location for this order.</DialogDescription>
        </DialogHeader>
        <ul className="max-h-[60vh] space-y-2 overflow-y-auto">
          {SWITCH_ACCOUNTS.map((a) => {
            const isCurrent = a.id === currentId;
            const isDefault = a.id === defaultId;
            return (
              <li key={a.id}>
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-md border p-3",
                    isCurrent && "border-primary bg-primary/5"
                  )}
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      {a.name}
                      <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {a.kind}
                      </span>
                      {isDefault ? (
                        <span className="rounded-sm bg-in-stock/12 px-1.5 py-0.5 text-[11px] font-semibold text-in-stock">
                          Default
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{a.detail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isDefault ? (
                      <Button size="sm" variant="tertiary" onClick={() => onSetDefault(a.id)}>
                        Set default
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent}
                      onClick={() => {
                        onSelect(a.id);
                        onOpenChange(false);
                      }}
                    >
                      {isCurrent ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentStep({ payment, setPayment, onBack }: { payment: Payment; setPayment: (v: Payment) => void; onBack: () => void }) {
  const [card, setCard] = React.useState<string>(SAVED_CARDS[0].id);
  return (
    <>
      <SectionHeading number="2" title="Payment" />
      <div className="space-y-5 p-5">
        <RadioGroup value={payment} onValueChange={(v) => setPayment(v as Payment)} className="grid gap-3">
          <RadioCard value="terms" selected={payment === "terms"}>
            <span className="block font-semibold">Account terms, COD</span>
            <span className="mt-1 block text-sm text-muted-foreground">Charge this order to your Homans account.</span>
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
          <div className="space-y-3 rounded-md bg-muted/40 p-4">
            <RadioGroup value={card} onValueChange={setCard} className="grid gap-2">
              {SAVED_CARDS.map((c) => (
                <RadioCard key={c.id} value={c.id} selected={card === c.id} className="bg-background">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium">•••• {c.tail}</span>
                    <span className="text-xs text-muted-foreground">· expires {c.expires} ·</span>
                    <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      Shared from the company
                    </span>
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

        <div className="flex justify-start border-t pt-5">
          <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
        </div>
      </div>
    </>
  );
}

function paymentLabel(payment: Payment): string {
  if (payment === "card") return "Credit card";
  if (payment === "cash") return "Cash on pickup";
  return "Account terms, COD";
}

const MAX_HANDLING_COMMENTS = 300;

function ReviewStep({
  items,
  method,
  payment,
  po,
  job,
  showSpecialHandling,
  specialHandling,
  setSpecialHandling,
  handlingComments,
  setHandlingComments,
  onBack,
  onEditFulfillment,
  onEditPayment,
}: {
  items: CartItem[];
  method: FulfillmentMethod;
  payment: Payment;
  po: string;
  job: string;
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
            <Button variant="link" size="sm" className="mt-1 h-auto p-0" onClick={onEditFulfillment}>Edit</Button>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Fulfillment</p>
            <p className="mt-2 font-medium">
              {isDeliveryMethod(method) ? `Delivery — ${methodLabel(method)}` : "Pickup — Manchester branch"}
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
