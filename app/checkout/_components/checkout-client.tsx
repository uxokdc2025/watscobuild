"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronLeft, LockKeyhole, MapPin, Package, Plus, ShieldCheck, Truck, X } from "lucide-react";
import { useCart, type CartItem } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/app/pdp/_lib/types";
import type { CheckoutCase } from "../page";

const DEMO_ITEMS: CartItem[] = [
  { id: "checkout-air-handler", title: "Aspen® 3-Ton Multi-Position Electric Air Handler", brand: "Aspen", price: 676.5, quantity: 1, image: "/peirce-search/blower-motor-07.avif" },
  { id: "checkout-wire-rope", title: "Duro Dyne® Cable Lock Wire Rope - 500' Roll", brand: "Duro Dyne", price: 277, quantity: 1, image: "/peirce-search/blower-motor-17.avif" },
];

type Step = "shipping" | "payment" | "review";

export default function CheckoutClient({ scenario, demo = false }: { scenario?: CheckoutCase; demo?: boolean }) {
  const { items: cartItems } = useCart();
  const items = cartItems.length ? cartItems : (demo || scenario ? DEMO_ITEMS : []);
  const initialStep: Step = scenario === "terms-or-credit-card" ? "payment" : scenario === "review-coupon-special-handling" ? "review" : "shipping";
  const [step, setStep] = React.useState<Step>(initialStep);
  const [submitted, setSubmitted] = React.useState(scenario === "order-confirmation");
  const [saved, setSaved] = React.useState(false);
  const [fulfillment, setFulfillment] = React.useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = React.useState<"terms" | "card">(scenario === "terms-or-credit-card" ? "card" : "terms");
  const [visibleNotices, setVisibleNotices] = React.useState({ backorder: true, nearby: true });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (submitted) return <main className="min-h-[60svh] bg-brand-homans-bg px-4 py-12 md:px-6"><div className="mx-auto max-w-[var(--layout-max-width)]"><section className="mx-auto max-w-2xl rounded-md border bg-background p-8 text-center shadow-sm"><div className="mx-auto grid size-12 place-items-center rounded-full bg-success/15 text-success"><Check aria-hidden="true" /></div><h1 className="mt-4 text-2xl font-bold">Order submitted</h1><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Your order is being reviewed. We&apos;ll send confirmation and fulfillment details to your account.</p><Button asChild className="mt-6" size="sm"><Link href="/dashboard/orders?status=open">View open orders</Link></Button></section></div></main>;

  if (!cartItems.length) return <main className="min-h-[60svh] bg-brand-homans-bg px-4 py-12 md:px-6"><div className="mx-auto max-w-[var(--layout-max-width)]"><section className="mx-auto max-w-2xl rounded-md border bg-background p-8 text-center shadow-sm"><Package className="mx-auto size-10 text-muted-foreground" aria-hidden="true" /><h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1><p className="mt-2 text-sm text-muted-foreground">Add products to your cart before starting checkout.</p><Button asChild className="mt-6" size="sm"><Link href="/search?q=blower%20motor&signedin=1">Continue shopping</Link></Button></section></div></main>;

  const goNext = () => setStep(step === "shipping" ? "payment" : "review");
  const goBack = () => setStep(step === "review" ? "payment" : "shipping");

  return <main className="min-h-svh bg-brand-homans-bg px-4 py-6 md:px-6 md:py-8">
    <div className="mx-auto max-w-[var(--layout-max-width)]">
      <Link href="/search?q=blower%20motor&signedin=1" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ChevronLeft className="size-4" aria-hidden="true" />Back to shopping</Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight">Checkout</h1><p className="mt-1 text-sm text-muted-foreground">Review your order and choose how you&apos;d like to receive it.</p></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-4" aria-hidden="true" />Secure checkout</div></div>
      <ol aria-label="Checkout progress" className="mt-6 grid max-w-3xl grid-cols-3 gap-2 text-sm">
        {[{ id: "shipping", label: "Fulfillment" }, { id: "payment", label: "Payment" }, { id: "review", label: "Review" }].map((entry, index) => <li key={entry.id} className={`flex items-center gap-2 border-b-2 pb-3 ${step === entry.id ? "border-primary font-semibold text-foreground" : index < ["shipping", "payment", "review"].indexOf(step) ? "border-success text-success" : "border-border text-muted-foreground"}`}><span className="grid size-6 place-items-center rounded-full border text-xs">{index < ["shipping", "payment", "review"].indexOf(step) ? <Check className="size-3.5" /> : index + 1}</span>{entry.label}</li>)}
      </ol>
      <CheckoutNotices visible={visibleNotices} onDismiss={(notice) => setVisibleNotices((current) => ({ ...current, [notice]: false }))} scenario={scenario} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 rounded-md border bg-background shadow-sm">
          {step === "shipping" ? <FulfillmentStep fulfillment={fulfillment} setFulfillment={setFulfillment} onNext={goNext} scenario={scenario} /> : null}
          {step === "payment" ? <PaymentStep payment={payment} setPayment={setPayment} onBack={goBack} onNext={goNext} /> : null}
          {step === "review" ? <ReviewStep items={items} fulfillment={fulfillment} payment={payment} onBack={goBack} onSubmit={() => setSubmitted(true)} scenario={scenario} /> : null}
        </section>
        <OrderSummary items={items} subtotal={subtotal} saved={saved} onSave={() => setSaved(true)} />
      </div>
    </div>
  </main>;
}

function SectionHeading({ number, title, children }: { number: string; title: string; children?: React.ReactNode }) {
  return <div className="flex items-center justify-between border-b px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{number}</span><h2 className="text-lg font-semibold">{title}</h2></div>{children}</div>;
}

function Field({ label, required = false, placeholder, defaultValue, className = "" }: { label: string; required?: boolean; placeholder?: string; defaultValue?: string; className?: string }) {
  return <label className={`block text-sm font-medium ${className}`}>{label}{required ? <span className="ml-1 text-destructive">*</span> : null}<input required={required} defaultValue={defaultValue} placeholder={placeholder} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /></label>;
}

function CheckoutNotices({ visible, onDismiss, scenario }: { visible: { backorder: boolean; nearby: boolean }; onDismiss: (notice: "backorder" | "nearby") => void; scenario?: CheckoutCase }) {
  if (!visible.backorder && !visible.nearby) return null;
  return <div className="mt-6 space-y-3" aria-label="Order availability notices">
    {visible.backorder && scenario !== "terms-or-credit-card" && scenario !== "order-confirmation" ? <CheckoutNotice title="Backorder" onDismiss={() => onDismiss("backorder")}>Some items are available on backorder. We&apos;ll contact you with an estimated availability date.</CheckoutNotice> : null}
    {visible.nearby && scenario !== "terms-or-credit-card" && scenario !== "order-confirmation" ? <CheckoutNotice title="Nearby branches" onDismiss={() => onDismiss("nearby")}>Some items are available at another branch. We&apos;ll contact you with an estimated availability date.</CheckoutNotice> : null}
  </div>;
}

function CheckoutNotice({ title, children, onDismiss }: { title: string; children: React.ReactNode; onDismiss: () => void }) {
  return <div role="status" className="relative rounded-md border border-warning/50 bg-warning/10 px-4 py-3 pr-12 text-sm leading-5 text-foreground">
    <p><span className="font-semibold">{title}:</span> {children}</p>
    <button type="button" onClick={onDismiss} className="absolute right-2 top-2 grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-warning/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Dismiss ${title.toLowerCase()} notice`}><X className="size-4" aria-hidden="true" /></button>
  </div>;
}

function FulfillmentStep({ fulfillment, setFulfillment, onNext, scenario }: { fulfillment: "delivery" | "pickup"; setFulfillment: (value: "delivery" | "pickup") => void; onNext: () => void; scenario?: CheckoutCase }) {
  const pickup = scenario === "delivery-pickup-routing" ? "pickup" : fulfillment;
  return <><SectionHeading number="1" title={scenario === "account-job-context" ? "Account and job context" : "Fulfillment"} /><div className="space-y-6 p-5"><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setFulfillment("delivery")} className={`rounded-md border p-4 text-left ${pickup === "delivery" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"}`}><span className="flex items-center gap-2 font-semibold"><Truck className="size-4" aria-hidden="true" />Delivery</span><span className="mt-1 block text-sm text-muted-foreground">Standard delivery · Free</span></button><button type="button" onClick={() => setFulfillment("pickup")} className={`rounded-md border p-4 text-left ${pickup === "pickup" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"}`}><span className="flex items-center gap-2 font-semibold"><MapPin className="size-4" aria-hidden="true" />Pickup</span><span className="mt-1 block text-sm text-muted-foreground">Manchester branch · choose a date</span></button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Account" required defaultValue="#HOM509973 · Homans Associates" className="sm:col-span-2" /><Field label="Job name" placeholder="Optional job name" defaultValue={scenario === "account-job-context" ? "Spring maintenance" : undefined} className="sm:col-span-2" /><Field label="PO number" required placeholder="Enter PO number" /><Field label="Contact phone" required defaultValue="+1 978 657 8990" /><Field label={pickup === "pickup" ? "Pickup branch" : "Street address"} required defaultValue={pickup === "pickup" ? "Manchester, NH - Homans" : "613 Main Street"} className="sm:col-span-2" /><Field label="City" required defaultValue={pickup === "pickup" ? "Manchester" : "Williston"} /><Field label="State" required defaultValue={pickup === "pickup" ? "NH" : "VT"} /><Field label="ZIP code" required defaultValue={pickup === "pickup" ? "03101" : "05495"} /><Field label={pickup === "pickup" ? "Pickup date" : "Delivery date"} required defaultValue={scenario === "availability-date-constraints" ? "September 3, 2026" : "As soon as available"} /></div><div className="rounded-md border border-warning/50 bg-warning/10 p-3 text-sm">{scenario === "availability-date-constraints" ? "Availability depends on branch transfer and cutoff time. We&apos;ll confirm the earliest date before submission." : "We&apos;ll confirm inventory and the selected fulfillment method before your order is submitted."}</div><div className="flex justify-end border-t pt-5"><Button size="sm" onClick={onNext}>Continue to payment</Button></div></div></>;
}

function PaymentStep({ payment, setPayment, onBack, onNext }: { payment: "terms" | "card"; setPayment: (value: "terms" | "card") => void; onBack: () => void; onNext: () => void }) {
  return <><SectionHeading number="2" title="Payment" /><div className="space-y-5 p-5"><div className="space-y-3"><label className="flex cursor-pointer items-start gap-3 rounded-md border p-4"><input type="radio" name="payment" checked={payment === "terms"} onChange={() => setPayment("terms")} className="mt-1" /><span><span className="block font-semibold">Account terms, COD</span><span className="mt-1 block text-sm text-muted-foreground">Charge this order to your Homans account.</span></span></label><label className="flex cursor-pointer items-start gap-3 rounded-md border p-4"><input type="radio" name="payment" checked={payment === "card"} onChange={() => setPayment("card")} className="mt-1" /><span><span className="block font-semibold">Credit card</span><span className="mt-1 block text-sm text-muted-foreground">Use a saved card or add one securely.</span></span></label></div>{payment === "card" ? <div className="grid gap-4 rounded-md bg-muted/40 p-4 sm:grid-cols-2"><Field label="Card number" required placeholder="1234 5678 9012 3456" className="sm:col-span-2" /><Field label="Expiration" required placeholder="MM / YY" /><Field label="CVV" required placeholder="123" /></div> : null}<div className="flex justify-between border-t pt-5"><Button variant="outline" size="sm" onClick={onBack}>Back</Button><Button size="sm" onClick={onNext}>Continue to review</Button></div></div></>;
}

function ReviewStep({ items, fulfillment, payment, onBack, onSubmit, scenario }: { items: CartItem[]; fulfillment: string; payment: string; onBack: () => void; onSubmit: () => void; scenario?: CheckoutCase }) {
  return <><SectionHeading number="3" title="Review & submit" /><div className="space-y-5 p-5"><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-md border p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fulfillment</p><p className="mt-2 font-medium">{fulfillment === "pickup" ? "Pickup — Manchester branch" : "Delivery — Standard"}</p><button type="button" onClick={onBack} className="mt-2 text-sm text-primary hover:underline">Edit</button></div><div className="rounded-md border p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</p><p className="mt-2 font-medium">{payment === "card" ? "Credit card" : "Account terms, COD"}</p><button type="button" onClick={onBack} className="mt-2 text-sm text-primary hover:underline">Edit</button></div></div>{scenario === "review-coupon-special-handling" ? <div className="grid gap-3 sm:grid-cols-2"><Field label="Coupon code" placeholder="Enter coupon code" /><label className="flex items-center gap-3 rounded-md border p-3 text-sm"><input type="checkbox" />Order requires special handling</label></div> : null}<div className="rounded-md border"><div className="border-b px-4 py-3 font-semibold">Items ({items.length})</div>{items.map((item) => <div key={item.id} className="flex items-center gap-3 border-b px-4 py-3 last:border-0"><div className="grid size-12 shrink-0 place-items-center rounded-md bg-muted"><img src={item.image} alt="" className="max-h-full max-w-full object-contain" /></div><p className="min-w-0 flex-1 text-sm font-medium">{item.title}<span className="block text-xs text-muted-foreground">Qty {item.quantity}</span></p><span className="text-sm font-semibold">{formatUSD(item.price * item.quantity)}</span></div>)}</div><label className="flex gap-3 text-sm"><input type="checkbox" required className="mt-1" /><span>I confirm the order details are correct and agree to the account terms.</span></label><div className="flex justify-between border-t pt-5"><Button variant="outline" size="sm" onClick={onBack}>Back</Button><Button size="sm" onClick={onSubmit}>Place order</Button></div></div></>;
}

function OrderSummary({ items, subtotal, saved, onSave }: { items: CartItem[]; subtotal: number; saved: boolean; onSave: () => void }) {
  return <aside className="h-fit rounded-md border bg-background shadow-sm lg:sticky lg:top-6"><div className="border-b px-5 py-4"><h2 className="text-lg font-semibold">Order summary</h2><p className="mt-1 text-sm text-muted-foreground">{items.length} items</p></div><div className="space-y-4 p-5">{items.map((item) => <div key={item.id} className="flex gap-3"><div className="grid size-14 shrink-0 place-items-center rounded-md bg-muted"><img src={item.image} alt="" className="max-h-full max-w-full object-contain" /></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">Qty {item.quantity}</p></div><p className="text-sm font-semibold">{formatUSD(item.price * item.quantity)}</p></div>)}<div className="space-y-2 border-t pt-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatUSD(subtotal)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Free</span></div><div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span>{formatUSD(subtotal)}</span></div></div><div className="rounded-md bg-muted/50 p-3 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mr-1 inline size-4 text-success" aria-hidden="true" />Your total is shown before payment details, with no surprise fees.</div><Button variant="outline" size="sm" className="w-full" onClick={onSave} disabled={saved}>{saved ? <><Check className="size-4" />Cart saved</> : <><Plus className="size-4" />Save cart for later</>}</Button></div></aside>;
}
