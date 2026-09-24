"use client";

import * as React from "react";
import Link from "next/link";
import {
  Banknote,
  Check,
  ChevronLeft,
  CreditCard,
  Package,
  Plus,
  Printer,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

import { useCart, type CartItem } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
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
import { fmtDate } from "./fulfillment-calendar";
import { CardMark } from "./card-mark";
import { SummaryCard } from "./summary-card";
import { OrderDetailsStep } from "./order-details-step";
import { SwitchAccountDrawer, CreditCardDrawer, AllCreditCardsDrawer } from "./checkout-drawers";
import {
  getBrandCheckout,
  type BrandBranch,
  type BrandCheckoutConfig,
  type SwitchAccount,
} from "../_lib/brand-checkout";

/* ───────────────────────── Demo data ───────────────────────── */

const DEMO_ITEMS: CartItem[] = [
  { id: "cart-air-handler", title: "Aspen® 3-Ton Multi-Position Electric Air Handler", brand: "Aspen", item: "AH3-676A", mfg: "ASP-3T-MP", price: 676.5, quantity: 1, image: "/peirce-search/blower-motor-07.avif" },
  { id: "cart-contactor", title: "TP-CON-2P30A — Definite Purpose Contactor, 2 Pole, 30 Amp, 24V Coil", brand: "TRADEPRO®", item: "34530C", mfg: "TP-CON-2P30A", price: 22.75, quantity: 2, image: "/peirce-search/blower-motor-09.avif" },
  { id: "cart-blower-motor", title: "TP-EC13-50 — Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230V, 1/2 HP", brand: "TRADEPRO®", item: "54510A", mfg: "TP-EC13-50", price: 168.42, quantity: 1, image: "/peirce-search/blower-motor-01.avif" },
  { id: "cart-wire-rope", title: "Duro Dyne® Cable Lock Wire Rope - 500' Roll", brand: "Duro Dyne", item: "DD-500WR", mfg: "CL-WR-500", price: 277, quantity: 1, image: "/peirce-search/blower-motor-17.avif" },
];

const BACKORDER_IDS = new Set(["cart-air-handler", "cart-wire-rope"]);

/* Saved cards are modeled as SHARED FROM THE COMPANY — the account, not the
 * individual, owns the card on file (ECM pattern). */
type CardOption = { id: string; brand: string; name: string; tail: string; expires: string; shared?: boolean; added?: boolean };

const SAVED_CARDS: CardOption[] = [
  { id: "visa-6177", brand: "VISA", name: "Company Card", tail: "6177", expires: "4/2028", shared: true },
  { id: "mc-8801", brand: "MASTERCARD", name: "Field Ops", tail: "8801", expires: "2/2027", shared: true },
  { id: "personal-4412", brand: "VISA", name: "Personal", tail: "4412", expires: "9/2029", shared: false },
  { id: "mc-3092", brand: "MASTERCARD", name: "Warehouse", tail: "3092", expires: "6/2028", shared: true },
  { id: "visa-5521", brand: "VISA", name: "Fleet Fuel", tail: "5521", expires: "11/2027", shared: true },
];

/* Extra company/personal cards that live only in the "All credit cards" drawer
 * — together with SAVED_CARDS they total 10. */
const MORE_CARDS: CardOption[] = [
  { id: "amex-1005", brand: "AMEX", name: "Travel", tail: "1005", expires: "3/2026", shared: false },
  { id: "visa-7788", brand: "VISA", name: "Jobsite", tail: "7788", expires: "8/2028", shared: true },
  { id: "mc-6644", brand: "MASTERCARD", name: "Office", tail: "6644", expires: "1/2029", shared: true },
  { id: "visa-9234", brand: "VISA", name: "Emergency", tail: "9234", expires: "12/2026", shared: false },
  { id: "mc-1209", brand: "MASTERCARD", name: "Projects", tail: "1209", expires: "5/2027", shared: true },
];

const ALL_CREDIT_CARDS: CardOption[] = [...SAVED_CARDS, ...MORE_CARDS];

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
  // Fulfillment opens on the DELIVERY tab (method is a delivery method → tab is
  // derived from it), routing to a grouped address. Brands without UPS clamp to
  // their first delivery method — still Delivery.
  "delivery-pickup-routing": { initialStep: "fulfillment", method: "ups" },
  // Fulfillment opens on the DELIVERY tab with the date-cutoff messaging on the
  // delivery date (the Pickup tab carries the same cutoff note on its date).
  "availability-date-constraints": { initialStep: "fulfillment", method: "truck", availabilityConstraint: true },
  "terms-or-credit-card": { initialStep: "payment", payment: "card" },
  "review-coupon-special-handling": { initialStep: "review", showCoupon: true, showSpecialHandling: true },
  "order-confirmation": { initialStep: "review", submitted: true },
};

function resolveScenario(scenario?: CheckoutCase): ScenarioConfig {
  return scenario ? { ...BASE, ...CHECKOUT_SCENARIOS[scenario] } : BASE;
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
  initialAccountId,
  variant = "tabs",
}: {
  scenario?: CheckoutCase;
  demo?: boolean;
  brandKey?: string;
  /** Account id handed off from the cart page (?account=…); falls back to the
   *  brand default when absent or unknown for this brand. */
  initialAccountId?: string;
  /** Layout variant: 'tabs' is the existing tabbed checkout (v1, unchanged);
   *  'accordion' is the vertical progressive checkout (v2). */
  variant?: "tabs" | "accordion";
}) {
  const cfg = resolveScenario(scenario);
  const brand = getBrandCheckout(brandKey);
  const { items: cartItems } = useCart();
  const items = cartItems.length ? cartItems : (demo || scenario ? DEMO_ITEMS : []);
  const backordered = items.filter((i) => BACKORDER_IDS.has(i.id));
  const regular = items.filter((i) => !BACKORDER_IDS.has(i.id));

  // The default/first address starts selected. Delivery is date-gated: the
  // address cards + date field show on arrival, and the Ship-complete box +
  // method radios reveal once a date is chosen.
  const initialAddressId =
    brand.addresses.find((a) => a.isDefault)?.id ?? brand.addresses[0]?.id ?? "";
  // A scenario may request a method this brand doesn't expose — clamp it to the
  // brand's first delivery method, else Pickup, so the selection stays valid.
  // The Delivery side otherwise opens on the brand's first delivery method.
  const firstDeliveryMethod = brand.methods.find(isDeliveryMethod) ?? "pickup";
  const clampedMethod = brand.methods.includes(cfg.method) ? cfg.method : firstDeliveryMethod;
  // 150-mile rule: an out-of-radius default address resolves straight to Freight.
  const initialOutOfRadius =
    brand.radiusRule && !!brand.addresses.find((a) => a.id === initialAddressId)?.outOfRadius;
  const initialMethod =
    initialOutOfRadius && brand.methods.includes("freight") ? "freight" : clampedMethod;

  // Account is seeded from the cart page's selection (?account=…), falling back
  // to the brand default when absent or not valid for this brand. The
  // SwitchAccountDrawer still lets it change in checkout.
  const accounts = brand.switchAccounts;
  const seededAccountId =
    initialAccountId && accounts.some((a) => a.id === initialAccountId)
      ? initialAccountId
      : accounts[0].id;
  const [accountId, setAccountId] = React.useState(seededAccountId);
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

  // Fulfillment detail state is lifted here (FulfillmentSection is controlled) so
  // the Review "Fulfillment" card can show the requested date, delivery address,
  // and per-brand modifiers — not just the method.
  // The default/first address starts selected, the method is preselected,
  // the date picker opens BLANK (null until the user picks a date), and both
  // modifiers start unchecked. The method radios + Ship complete reveal once
  // a delivery date is chosen (CSR-date brands always show them).
  const [addressId, setAddressId] = React.useState(initialAddressId);
  const [pickupDate, setPickupDate] = React.useState<Date | null>(null);
  const [deliveryDate, setDeliveryDate] = React.useState<Date | null>(null);
  const [split, setSplit] = React.useState<"complete" | "partial">("partial");
  const [liftgate, setLiftgate] = React.useState<"none" | "required">("none");
  const [expressOn, setExpressOn] = React.useState(false);
  // The delivery method starts preselected, so the choice flag starts true and
  // stays true — changing the address never unpicks it; picking a date
  // reveals the radios with the preselected method intact.
  const [deliveryMethodChosen, setDeliveryMethodChosen] = React.useState(true);

  const [payment, setPayment] = React.useState<Payment>(cfg.payment);
  const [po, setPo] = React.useState("PO-2048");
  const [job, setJob] = React.useState(cfg.seededJob);
  const [notes, setNotes] = React.useState("");
  const [poError, setPoError] = React.useState<string | undefined>();
  const [coupon, setCoupon] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  // Special handling (Homans): checking it reveals a REQUIRED branch-comments
  // field that blocks Place order until filled.
  const [specialHandling, setSpecialHandling] = React.useState(false);
  const [handlingComments, setHandlingComments] = React.useState("");

  // Payment card selection is lifted here so the Payment step edits it and the
  // Review summary can name the exact card (•••• tail) that will be charged.
  const [addedCards, setAddedCards] = React.useState<CardOption[]>([]);
  const [paymentCardId, setPaymentCardId] = React.useState(SAVED_CARDS[0].id);
  const cards: CardOption[] = [...SAVED_CARDS, ...addedCards];
  // The drawer lists every card on file (10 samples + anything added this
  // order), so a drawer pick always resolves to a real card for Review.
  const drawerCards: CardOption[] = [...ALL_CREDIT_CARDS, ...addedCards];
  const selectedCard = drawerCards.find((c) => c.id === paymentCardId) ?? SAVED_CARDS[0];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Applied coupon takes 10% off the subtotal.
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * brand.taxRate;
  // Shipping reflects the chosen fulfillment method's rate — but for delivery
  // with a picker date, the rate is unknown until a date is chosen (CSR-date
  // brands confirm the date themselves, so their rate always applies).
  const shipping = METHOD_RATE[method];
  const total = subtotal - discount + tax + shipping;
  const shippingUnknown =
    isDeliveryMethod(method) && brand.deliveryDateMode !== "csr" && deliveryDate == null;

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

  // Horizontal (tabbed) forward-navigation gates, shared by the in-step
  // Continue buttons below. Delivery gates Continue until a date is selected
  // AND a method is picked; Pickup stays enabled. CSR-date brands have no
  // picker, so the method choice alone gates them.
  const fulfillmentContinueDisabled = isDeliveryMethod(method)
    ? brand.deliveryDateMode === "csr"
      ? !deliveryMethodChosen
      : !(deliveryDate && deliveryMethodChosen)
    : false;
  const paymentContinueDisabled =
    payment === "terms" && account.availableCredit != null && total > account.availableCredit;
  // The horizontal summary's Place-order button is enabled on Review, subject
  // to the existing place-order gating.
  const placeOrderDisabled = step !== "review" || handlingBlocks;

  /* ── Accordion (v2) progressive layout — reuses the SAME state, handlers,
   *    and step components as v1. v1's return below is unchanged. ── */
  if (variant === "accordion") {
    const accordionIndex: Record<Step, number> = { details: 0, fulfillment: 1, payment: 2, review: 3 };
    const currentAccordionIndex = accordionIndex[step];
    const deliveryAddress =
      brand.addresses.find((a) => a.id === addressId) ??
      brand.addresses.find((a) => a.isDefault) ??
      brand.addresses[0];
    const detailsSummary = `${account.name} · PO ${po || "—"}`;
    const fulfillmentSummary = isDeliveryMethod(method)
      ? `${methodLabel(method)} · ${deliveryAddress?.name ?? ""}`
      : `${methodLabel(method)} · ${branch.name}`;
    const paymentSummary = payment === "card" ? `Credit card •••• ${selectedCard.tail}` : paymentLabel(payment);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const goToStep = (target: Step) => {
      setStep(target);
      scrollToTop();
    };

    const editButton = (target: Step, label: string) => (
      <button
        type="button"
        aria-label={label}
        onClick={() => goToStep(target)}
        className="shrink-0 text-sm font-medium text-primary hover:underline"
      >
        Edit
      </button>
    );

    const futureHeader = (number: string, title: string) => (
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{number}</span>
          <h2 className="text-lg font-semibold text-muted-foreground">{title}</h2>
        </div>
      </div>
    );

    const completedHeader = (number: string, title: string, summary: string, target: Step) => (
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{number}</span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="truncate text-sm text-muted-foreground">{summary}</p>
          </div>
        </div>
        {editButton(target, `Edit ${title}`)}
      </div>
    );

    return (
      <main className="min-h-svh bg-muted/30 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-[var(--layout-max-width)]">
          <Link href={`/cart?brand=${brandKey}${demo ? "&demo=1" : ""}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back to cart
          </Link>

          <div className="mt-5">
            <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex min-w-0 flex-col gap-4">
              {/* Order details */}
              <section className="rounded-md border bg-background shadow-sm" aria-label="Order details">
                <AnimatePresence initial={false}>
                  {currentAccordionIndex === 0 ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <OrderDetailsStep
                        account={account}
                        onSwitchAccount={() => setAccountDrawerOpen(true)}
                        branch={branch}
                        po={po}
                        setPo={setPo}
                        poError={poError}
                        jobName={job}
                        setJobName={setJob}
                        notes={notes}
                        setNotes={setNotes}
                      />
                      <div className="flex justify-end border-t px-5 py-4">
                        <Button
                          size="sm"
                          onClick={() => {
                            goToFulfillment();
                            if (po.trim()) scrollToTop();
                          }}
                        >
                          Continue to fulfillment
                        </Button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                {currentAccordionIndex === 0 ? null : currentAccordionIndex > 0 ? (
                  completedHeader("1", "Order details", detailsSummary, "details")
                ) : (
                  futureHeader("1", "Order details")
                )}
              </section>

              {/* Fulfillment */}
              <section className="rounded-md border bg-background shadow-sm" aria-label="Fulfillment">
                <AnimatePresence initial={false}>
                  {currentAccordionIndex === 1 ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                    <SectionHeading number="2" title="Fulfillment" />
                    <FulfillmentSection
                      config={brand}
                      method={method}
                      setMethod={setMethod}
                      availabilityConstraint={cfg.availabilityConstraint}
                      branch={branch}
                      onChangeBranch={changeBranch}
                      addressId={addressId}
                      setAddressId={setAddressId}
                      pickupDate={pickupDate}
                      setPickupDate={setPickupDate}
                      deliveryDate={deliveryDate}
                      setDeliveryDate={setDeliveryDate}
                      split={split}
                      setSplit={setSplit}
                      liftgate={liftgate}
                      setLiftgate={setLiftgate}
                      expressOn={expressOn}
                      setExpressOn={setExpressOn}
                      deliveryMethodChosen={deliveryMethodChosen}
                      setDeliveryMethodChosen={setDeliveryMethodChosen}
                    />
                    <div className="flex justify-end border-t px-5 py-4">
                      <Button size="sm" onClick={() => goToStep("payment")}>
                        Continue to payment
                      </Button>
                    </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                {currentAccordionIndex === 1 ? null : currentAccordionIndex > 1 ? (
                  completedHeader("2", "Fulfillment", fulfillmentSummary, "fulfillment")
                ) : (
                  futureHeader("2", "Fulfillment")
                )}
              </section>

              {/* Payment */}
              <section className="rounded-md border bg-background shadow-sm" aria-label="Payment">
                <AnimatePresence initial={false}>
                  {currentAccordionIndex === 2 ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                    <PaymentStep
                      brand={brand}
                      account={account}
                      payment={payment}
                      total={total}
                      setPayment={setPayment}
                      cards={cards}
                      drawerCards={drawerCards}
                      cardId={paymentCardId}
                      setCardId={setPaymentCardId}
                      addedCards={addedCards}
                      setAddedCards={setAddedCards}
                      onBack={() => setStep("fulfillment")}
                      hideBack
                    />
                    <div className="flex justify-end border-t px-5 py-4">
                      <Button size="sm" onClick={() => goToStep("review")}>
                        Continue to review
                      </Button>
                    </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                {currentAccordionIndex === 2 ? null : currentAccordionIndex > 2 ? (
                  completedHeader("3", "Payment", paymentSummary, "payment")
                ) : (
                  futureHeader("3", "Payment")
                )}
              </section>

              {/* Review */}
              <section className="rounded-md border bg-background shadow-sm" aria-label="Review">
                <AnimatePresence initial={false}>
                  {currentAccordionIndex === 3 ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <SectionHeading number="4" title="Review" />
                      <div className="p-5">
                        <div className="space-y-4">
                          {backordered.length > 0 ? (
                            <Alert variant="warning">
                              <TriangleAlert />
                              <AlertTitle>Backordered items ({backordered.length})</AlertTitle>
                              <AlertDescription>
                                <p>Some items are available on backorder. We&apos;ll contact you with an estimated availability date.</p>
                                <div className="mt-3 grid w-full gap-3">
                                  {backordered.map((item) => (
                                    <div key={item.id} className="grid grid-cols-[64px_minmax(0,340px)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-6 rounded-md border bg-background p-4">
                                      <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
                                        {item.image ? (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img src={item.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                        ) : null}
                                      </div>
                                      <div className="min-w-0">
                                        {item.brand ? <p className="truncate text-xs font-medium text-primary">{item.brand}</p> : null}
                                        <p className="line-clamp-2 text-sm font-semibold leading-snug">{item.title}</p>
                                        {item.item || item.mfg ? <p className="mt-1 truncate text-xs text-muted-foreground">Item: {item.item} · MFG: {item.mfg}</p> : null}
                                      </div>
                                      <div className="flex flex-col items-center gap-1"><span className="text-xs text-muted-foreground">Qty</span><span className="text-sm font-medium">{item.quantity}</span></div>
                                      <div className="flex flex-col items-end text-right"><span className="text-base font-semibold">{formatUSD(item.price * item.quantity)}</span><span className="text-xs text-muted-foreground">{formatUSD(item.price)} / each</span></div>
                                    </div>
                                  ))}
                                </div>
                              </AlertDescription>
                            </Alert>
                          ) : null}
                          <div className="rounded-md border">
                            <div className="border-b px-5 py-4 font-semibold">Items ({regular.length})</div>
                            {regular.map((item) => (
                              <div key={item.id} className="grid grid-cols-[64px_minmax(0,340px)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-6 border-b p-4 last:border-0">
                                <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
                                  {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                  ) : null}
                                </div>
                                <div className="min-w-0">
                                  {item.brand ? <p className="truncate text-xs font-medium text-primary">{item.brand}</p> : null}
                                  <p className="line-clamp-2 text-sm font-semibold leading-snug">{item.title}</p>
                                  {item.item || item.mfg ? <p className="mt-1 truncate text-xs text-muted-foreground">Item: {item.item} · MFG: {item.mfg}</p> : null}
                                </div>
                                <div className="flex flex-col items-center gap-1"><span className="text-xs text-muted-foreground">Qty</span><span className="text-sm font-medium">{item.quantity}</span></div>
                                <div className="flex flex-col items-end text-right"><span className="text-base font-semibold">{formatUSD(item.price * item.quantity)}</span><span className="text-xs text-muted-foreground">{formatUSD(item.price)} / each</span></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                {currentAccordionIndex === 3 ? null : futureHeader("4", "Review")}
              </section>
            </div>

            <OrderSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              tax={tax}
              shipping={shipping}
              shippingUnknown={shippingUnknown}
              total={total}
              primary={{ label: "Place order", onClick: () => setSubmitted(true), disabled: step !== "review" }}
              coupon={coupon}
              setCoupon={setCoupon}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={() => coupon.trim() && setAppliedCoupon(coupon.trim().toUpperCase())}
              showConfirm
              saveQuoteDisabled={step !== "review"}
              onSaveQuote={() => toast.success("Quote saved — find it under Quotes in your account.")}
            />
          </div>
        </div>

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

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-[var(--layout-max-width)]">
        <Link href={`/cart?brand=${brandKey}${demo ? "&demo=1" : ""}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to cart
        </Link>

        <div className="mt-5">
          <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
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
              <>
                <OrderDetailsStep
                  account={account}
                  onSwitchAccount={() => setAccountDrawerOpen(true)}
                  branch={branch}
                  po={po}
                  setPo={setPo}
                  poError={poError}
                  jobName={job}
                  setJobName={setJob}
                  notes={notes}
                  setNotes={setNotes}
                />
                <div className="flex justify-between border-t px-5 py-4">
                  <span aria-hidden="true" />
                  <Button size="sm" onClick={goToFulfillment}>
                    Continue to fulfillment
                  </Button>
                </div>
              </>
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
                  addressId={addressId}
                  setAddressId={setAddressId}
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  deliveryDate={deliveryDate}
                  setDeliveryDate={setDeliveryDate}
                  split={split}
                  setSplit={setSplit}
                  liftgate={liftgate}
                  setLiftgate={setLiftgate}
                  expressOn={expressOn}
                  setExpressOn={setExpressOn}
                  deliveryMethodChosen={deliveryMethodChosen}
                  setDeliveryMethodChosen={setDeliveryMethodChosen}
                />
                <div className="flex justify-between border-t px-5 py-4">
                  <Button variant="outline" size="sm" onClick={() => setStep("details")}>Back</Button>
                  <Button size="sm" onClick={() => setStep("payment")} disabled={fulfillmentContinueDisabled}>
                    Continue to payment
                  </Button>
                </div>
              </>
            ) : null}
            {step === "payment" ? (
              <>
                <PaymentStep
                  brand={brand}
                  account={account}
                  payment={payment}
                  total={total}
                  setPayment={setPayment}
                  cards={cards}
                  drawerCards={drawerCards}
                  cardId={paymentCardId}
                  setCardId={setPaymentCardId}
                  addedCards={addedCards}
                  setAddedCards={setAddedCards}
                  onBack={() => setStep("fulfillment")}
                  hideBack
                />
                <div className="flex justify-between border-t px-5 py-4">
                  <Button variant="outline" size="sm" onClick={() => setStep("fulfillment")}>Back</Button>
                  <Button size="sm" onClick={() => setStep("review")} disabled={paymentContinueDisabled}>
                    Continue to review
                  </Button>
                </div>
              </>
            ) : null}
            {step === "review" ? (
              <>
                <ReviewStep
                  brand={brand}
                  items={items}
                  account={account}
                  branch={branch}
                  method={method}
                  addressId={addressId}
                  pickupDate={pickupDate}
                  deliveryDate={deliveryDate}
                  split={split}
                  liftgate={liftgate}
                  expressOn={expressOn}
                  payment={payment}
                  cardTail={selectedCard.tail}
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
                  hideBack
                />
                <div className="flex justify-between border-t px-5 py-4">
                  <Button variant="outline" size="sm" onClick={() => setStep("payment")}>Back</Button>
                </div>
              </>
            ) : null}
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
            saveQuoteDisabled={step !== "review"}
            onSaveQuote={() => toast.success("Quote saved — find it under Quotes in your account.")}
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

function PaymentStep({
  brand,
  account,
  payment,
  total,
  setPayment,
  cards,
  drawerCards,
  cardId,
  setCardId,
  addedCards,
  setAddedCards,
  onBack,
  hideBack = false,
}: {
  brand: BrandCheckoutConfig;
  account: SwitchAccount;
  payment: Payment;
  total: number;
  setPayment: (v: Payment) => void;
  cards: CardOption[];
  /** Every card on file (drawer list) — grid shows `cards`, drawer shows these. */
  drawerCards: CardOption[];
  cardId: string;
  setCardId: (v: string) => void;
  addedCards: CardOption[];
  setAddedCards: React.Dispatch<React.SetStateAction<CardOption[]>>;
  onBack: () => void;
  /** The surrounding flow renders its own footer outside, so the in-component
   *  Back row is hidden when true. Defaults to false. */
  hideBack?: boolean;
}) {
  const [cardDrawerOpen, setCardDrawerOpen] = React.useState(false);
  const [allCardsOpen, setAllCardsOpen] = React.useState(false);

  const addCard = (tail: string) => {
    const id = `card-${tail}-${addedCards.length}`;
    setAddedCards((prev) => [...prev, { id, brand: "VISA", name: "New card", tail, expires: "—", shared: false, added: true }]);
    setCardId(id);
  };

  return (
    <>
      <SectionHeading number="3" title="Payment" />
      <div className="space-y-5 p-5">
        <RadioGroup value={payment} onValueChange={(v) => setPayment(v as Payment)} className="grid gap-3">
          <RadioCard value="terms" selected={payment === "terms"}>
            <span className="block font-semibold">Account terms, COD</span>
            <span className="mt-1 block text-sm text-muted-foreground">Charge this order to your {brand.brandName} account.</span>
            {payment === "terms" && account.availableCredit != null ? (
              <div className="mt-3 border-t pt-3">
                <div className="flex flex-wrap items-stretch gap-x-10 gap-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Account balance</p>
                    <p className="text-base font-semibold tabular-nums">{formatUSD(account.creditBalance ?? 0)}</p>
                  </div>
                  <div aria-hidden="true" className="w-px self-stretch bg-border" />
                  <div>
                    <p className="text-xs text-muted-foreground">Available credit</p>
                    <p className="text-base font-semibold tabular-nums">{formatUSD(account.availableCredit)}</p>
                  </div>
                </div>
                {total > account.availableCredit ? (
                  <Alert variant="destructive" className="mt-3">
                    <TriangleAlert />
                    <AlertTitle>Order exceeds available credit</AlertTitle>
                    <AlertDescription>This order ({formatUSD(total)}) is more than your available credit. Choose another payment method to continue.</AlertDescription>
                  </Alert>
                ) : null}
              </div>
            ) : null}
          </RadioCard>
          <RadioCard value="card" selected={payment === "card"}>
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="flex items-center gap-2 font-semibold">
                  <CreditCard className="size-4" aria-hidden="true" />
                  Credit card
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">Use a saved card or add one securely.</span>
              </span>
              {payment === "card" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCardDrawerOpen(true)}
                  className="h-auto flex-col items-center gap-1 py-2 text-center"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  <span>Add new card</span>
                </Button>
              ) : null}
            </span>
          </RadioCard>
          {payment === "card" ? (
            <div className="mt-2 rounded-md border bg-muted/30 p-4">
              <RadioGroup value={cardId} onValueChange={setCardId} className="flex flex-wrap gap-4">
                {cards.map((c, i) => (
                  <Label
                    key={c.id}
                    className={cn(
                      "flex h-[152px] w-[272px] shrink-0 grow-0 cursor-pointer items-start gap-2.5 rounded-md border bg-background p-3 text-left transition-colors",
                      cardId === c.id
                        ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem value={c.id} className="mt-0.5 shrink-0" />
                    <CardMark brand={c.brand} className="h-8 w-12 shrink-0 rounded-sm px-1.5 text-[9px] font-bold" />
                    <span className="block min-w-0 flex-1 text-left">
                      <span className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold leading-tight">
                        <span className="truncate">{c.name}</span>
                        {i === 0 ? (
                          <span className="rounded-sm bg-in-stock/12 px-1.5 py-0.5 text-[11px] font-semibold text-in-stock">
                            Default
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs leading-normal whitespace-nowrap text-muted-foreground">•••• {c.tail}</span>
                      <span className="block text-xs leading-normal whitespace-nowrap text-muted-foreground">Expires: {c.expires}</span>
                      {c.shared ? (
                        <Badge variant="solid" color="slate" className="mt-1.5">
                          Company
                        </Badge>
                      ) : c.added ? (
                        <Badge variant="solid" color="slate" className="mt-1.5">
                          Added this order
                        </Badge>
                      ) : (
                        <Badge variant="solid" color="slate" className="mt-1.5">
                          Personal
                        </Badge>
                      )}
                    </span>
                  </Label>
                ))}
                {/* See-all tile — same fixed footprint as the saved cards, with
                    the CTA that opens the full card list. */}
                <div className="flex h-[152px] w-[272px] shrink-0 grow-0 items-center justify-center rounded-md border border-dashed bg-background p-3 text-center">
                  <button
                    type="button"
                    onClick={() => setAllCardsOpen(true)}
                    className="rounded-sm text-center text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    See all credit cards
                  </button>
                </div>
              </RadioGroup>
            </div>
          ) : null}
          <RadioCard value="cash" selected={payment === "cash"}>
            <span className="flex items-center gap-2 font-semibold">
              <Banknote className="size-4" aria-hidden="true" />
              Cash on pickup
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">Pay at the branch counter when you collect the order.</span>
          </RadioCard>
        </RadioGroup>

        {hideBack ? null : (
          <div className="flex justify-start border-t pt-5">
            <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
          </div>
        )}
      </div>

      <CreditCardDrawer open={cardDrawerOpen} onClose={() => setCardDrawerOpen(false)} onSave={addCard} />
      <AllCreditCardsDrawer
        open={allCardsOpen}
        onClose={() => setAllCardsOpen(false)}
        cards={drawerCards}
        selectedId={cardId}
        onSelect={setCardId}
      />
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
  brand,
  items,
  account,
  branch,
  method,
  addressId,
  pickupDate,
  deliveryDate,
  split,
  liftgate,
  expressOn,
  payment,
  cardTail,
  po,
  job,
  notes,
  showSpecialHandling,
  specialHandling,
  setSpecialHandling,
  handlingComments,
  setHandlingComments,
  onBack,
  hideBack = false,
}: {
  brand: BrandCheckoutConfig;
  items: CartItem[];
  account: SwitchAccount;
  branch: BrandBranch;
  method: FulfillmentMethod;
  addressId: string;
  pickupDate: Date | null;
  deliveryDate: Date | null;
  split: "complete" | "partial";
  liftgate: "none" | "required";
  expressOn: boolean;
  payment: Payment;
  cardTail: string;
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
  /** The surrounding flow renders its own footer outside, so the
   *  in-component Back row is hidden when true. Defaults to false. */
  hideBack?: boolean;
}) {
  const commentsMissing = specialHandling && !handlingComments.trim();
  // Delivery address is the exact one chosen in the (now controlled) Fulfillment
  // step; falls back to the default entry if the id no longer resolves.
  const deliveryAddress =
    brand.addresses.find((a) => a.id === addressId) ??
    brand.addresses.find((a) => a.isDefault) ??
    brand.addresses[0];
  const billingAddress = brand.addresses.find((a) => a.group === "billing");
  // Requested date for the active method (pickup vs delivery), shown only if set.
  const requestedDate = isDeliveryMethod(method) ? deliveryDate : pickupDate;
  const backordered = items.filter((i) => BACKORDER_IDS.has(i.id));
  const regular = items.filter((i) => !BACKORDER_IDS.has(i.id));
  return (
    <>
      <SectionHeading number="4" title="Review & submit" />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard label="Order details">
            <p className="font-medium text-foreground">{account.name}</p>
            <p className="text-muted-foreground">{account.detail}</p>
            <p className="text-muted-foreground">PO {po || "—"}</p>
            <p className="text-muted-foreground">{job ? `Job: ${job}` : "No job name"}</p>
            {notes.trim() ? <p className="text-muted-foreground line-clamp-2">Notes: {notes}</p> : null}
          </SummaryCard>

          <SummaryCard label="Fulfillment">
            {isDeliveryMethod(method) ? (
              <>
                <p className="font-medium text-foreground">Delivery — {methodLabel(method)}</p>
                <p className="text-muted-foreground">{deliveryAddress.name}</p>
                <p className="text-muted-foreground">
                  {deliveryAddress.city}, {deliveryAddress.state}
                </p>
                {requestedDate ? (
                  <p className="text-muted-foreground">Requested {fmtDate(requestedDate)}</p>
                ) : null}
                {brand.deliveryModifiers ? (
                  <>
                    <p className="text-muted-foreground">
                      Split: {split === "partial" ? "partial" : "complete"}
                    </p>
                    <p className="text-muted-foreground">
                      Liftgate: {liftgate === "required" ? "required" : "not needed"}
                    </p>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <p className="font-medium text-foreground">Pickup — {brand.pickupBranchShort}</p>
                <p className="text-muted-foreground">{branch.name}</p>
                <p className="text-muted-foreground">{branch.address}</p>
                {requestedDate ? (
                  <p className="text-muted-foreground">Pickup {fmtDate(requestedDate)}</p>
                ) : null}
                {expressOn && brand.pickupAddon ? (
                  <p className="text-muted-foreground">{brand.pickupAddon.label}</p>
                ) : null}
              </>
            )}
          </SummaryCard>

          <SummaryCard label="Payment">
            {payment === "card" ? (
              <>
                <p className="font-medium text-foreground">Credit card •••• {cardTail}</p>
                {billingAddress ? (
                  <p className="text-muted-foreground">
                    Billing: {billingAddress.name} · {billingAddress.city}, {billingAddress.state}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="font-medium text-foreground">{paymentLabel(payment)}</p>
            )}
          </SummaryCard>
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

        <div className="space-y-4">
          {backordered.length > 0 ? (
            <Alert variant="warning">
              <TriangleAlert />
              <AlertTitle>Backordered items ({backordered.length})</AlertTitle>
              <AlertDescription>
                <p>Some items are available on backorder. We&apos;ll contact you with an estimated availability date.</p>
                <div className="mt-3 grid w-full gap-3">
                  {backordered.map((item) => (
                    <div key={item.id} className="grid grid-cols-[64px_minmax(0,340px)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-6 rounded-md border bg-background p-4">
                      <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        {item.brand ? <p className="truncate text-xs font-medium text-primary">{item.brand}</p> : null}
                        <p className="line-clamp-2 text-sm font-semibold leading-snug">{item.title}</p>
                        {item.item || item.mfg ? <p className="mt-1 truncate text-xs text-muted-foreground">Item: {item.item} · MFG: {item.mfg}</p> : null}
                      </div>
                      <div className="flex flex-col items-center gap-1"><span className="text-xs text-muted-foreground">Qty</span><span className="text-sm font-medium">{item.quantity}</span></div>
                      <div className="flex flex-col items-end text-right"><span className="text-base font-semibold">{formatUSD(item.price * item.quantity)}</span><span className="text-xs text-muted-foreground">{formatUSD(item.price)} / each</span></div>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          ) : null}
          <div className="rounded-md border">
            <div className="border-b px-5 py-4 font-semibold">Items ({regular.length})</div>
            {regular.map((item) => (
              <div key={item.id} className="grid grid-cols-[64px_minmax(0,340px)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-6 border-b p-4 last:border-0">
                <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  {item.brand ? <p className="truncate text-xs font-medium text-primary">{item.brand}</p> : null}
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">{item.title}</p>
                  {item.item || item.mfg ? <p className="mt-1 truncate text-xs text-muted-foreground">Item: {item.item} · MFG: {item.mfg}</p> : null}
                </div>
                <div className="flex flex-col items-center gap-1"><span className="text-xs text-muted-foreground">Qty</span><span className="text-sm font-medium">{item.quantity}</span></div>
                <div className="flex flex-col items-end text-right"><span className="text-base font-semibold">{formatUSD(item.price * item.quantity)}</span><span className="text-xs text-muted-foreground">{formatUSD(item.price)} / each</span></div>
              </div>
            ))}
          </div>
        </div>

        {hideBack ? null : (
          <div className="flex justify-start border-t pt-5">
            <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
          </div>
        )}
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
  shippingUnknown = false,
  total,
  primary,
  coupon,
  setCoupon,
  appliedCoupon,
  onApplyCoupon,
  showConfirm,
  saveQuoteDisabled = false,
  onSaveQuote,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  /** Delivery rate is unknown until a delivery date is chosen — Shipping and
   *  Total render "N/A" while true. Pickup is unaffected. */
  shippingUnknown?: boolean;
  total: number;
  primary: { label: string; onClick: () => void; disabled: boolean };
  coupon: string;
  setCoupon: (v: string) => void;
  appliedCoupon: string | null;
  onApplyCoupon: () => void;
  showConfirm: boolean;
  saveQuoteDisabled?: boolean;
  onSaveQuote: () => void;
}) {
  const [handlingDismissed, setHandlingDismissed] = React.useState(false);
  return (
    <aside className="h-fit overflow-hidden rounded-md border bg-background shadow-sm lg:sticky lg:top-6">
      <div className="border-b bg-muted/60 px-5 py-3">
        <h2 className="text-base font-semibold">
          Order Summary ({items.length} {items.length === 1 ? "Item" : "Items"})
        </h2>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>{formatUSD(subtotal)}</span>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between text-in-stock">
              <span className="font-medium">Discount{appliedCoupon ? ` (${appliedCoupon})` : ""}:</span>
              <span>−{formatUSD(discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span className="font-medium">Estimated Tax:</span>
            <span>{formatUSD(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Shipping:</span>
            <span>{shippingUnknown ? "N/A" : shipping > 0 ? formatUSD(shipping) : "Free"}</span>
          </div>
          <div className="flex justify-between pt-1 font-bold">
            <span>Total:</span>
            <span>{shippingUnknown ? "N/A" : formatUSD(total)}</span>
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

        {/* Special-handling note — between Coupon/Apply and Place order. */}
        {showConfirm && !handlingDismissed ? (
          <Alert variant="warning" className="pr-9">
            <TriangleAlert aria-hidden="true" />
            <AlertDescription>
              Commercial rooftop equipment may require special handling and additional freight costs. Customer support will follow up.
            </AlertDescription>
            <button
              type="button"
              onClick={() => setHandlingDismissed(true)}
              aria-label="Dismiss special handling notice"
              className="absolute top-2.5 right-2.5 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </Alert>
        ) : null}

        {/* Sticky primary CTA — the strongest action, always reachable.
            "Save cart for later" lives on the cart page only, not in checkout. */}
        <div>
          <Button className="w-full" onClick={primary.onClick} disabled={primary.disabled}>
            {primary.label}
          </Button>
          {showConfirm ? (
            <button
              type="button"
              onClick={onSaveQuote}
              disabled={saveQuoteDisabled}
              className={cn(
                "mx-auto mt-1.5 block text-sm font-medium",
                saveQuoteDisabled ? "text-muted-foreground" : "text-primary hover:underline"
              )}
            >
              Save quote
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
