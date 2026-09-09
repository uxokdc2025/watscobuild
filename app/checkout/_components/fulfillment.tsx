"use client";

import * as React from "react";
import {
  Bike,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Container,
  Info,
  MapPin,
  Package,
  Plus,
  Store,
  TriangleAlert,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/pdp/_lib/types";
import type {
  BrandAddress,
  BrandBranch,
  BrandCheckoutConfig,
} from "../_lib/brand-checkout";
import {
  AddAddressDrawer,
  AddressBookDrawer,
  AddressRow,
  GROUP_LABEL,
  GROUP_ORDER,
  StoreFinderDrawer,
} from "./checkout-drawers";

/* ───────────────────────── Fulfillment domain model ─────────────────────────
 * ONE unified fulfillment section. Method is the top-level choice (ECM pattern),
 * not a Pickup/Delivery toggle. WHICH methods appear, and all demo data (stores,
 * addresses), come from the per-brand config — so each brand shows only its own
 * methods, and there is no scattered `brand === "…"` branching in the markup. */

export type FulfillmentMethod = "pickup" | "truck" | "freight" | "ups" | "local" | "delivery";

const DELIVERY_METHODS: FulfillmentMethod[] = ["truck", "freight", "ups", "local", "delivery"];
export function isDeliveryMethod(m: FulfillmentMethod): boolean {
  return DELIVERY_METHODS.includes(m);
}

type MethodMeta = {
  id: FulfillmentMethod;
  label: string;
  blurb: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const METHOD_META: Record<FulfillmentMethod, MethodMeta> = {
  pickup: { id: "pickup", label: "Pickup", blurb: "Pick up at your branch counter", Icon: Store },
  truck: { id: "truck", label: "Truck", blurb: "Company truck delivery", Icon: Truck },
  freight: { id: "freight", label: "Freight / LTL", blurb: "Palletized freight carrier", Icon: Container },
  ups: { id: "ups", label: "UPS", blurb: "UPS small-parcel", Icon: Package },
  local: { id: "local", label: "Local Delivery", blurb: "Local courier, same metro", Icon: Bike },
  delivery: { id: "delivery", label: "Delivery", blurb: "Ship to your job or account address", Icon: Truck },
};

/** Per-method rate (used in the panel line AND lifted into the order summary so
 *  the total reflects the chosen method). */
export const METHOD_RATE: Record<FulfillmentMethod, number> = {
  pickup: 0,
  truck: 0,
  freight: 89.5,
  ups: 41.8,
  local: 25,
  delivery: 0,
};

const METHOD_RATE_LABEL: Record<FulfillmentMethod, string> = {
  pickup: "Branch pickup — no charge",
  truck: "Company truck — $0.00",
  freight: "Freight / LTL — $89.50",
  ups: "UPS Ground — $41.80",
  local: "Local Delivery — $25.00",
  delivery: "Ship date confirmed by your CSR",
};

export function methodLabel(m: FulfillmentMethod): string {
  return METHOD_META[m]?.label ?? "Delivery";
}

/* ───────────────────────── Calendar (date validation) ─────────────────────────
 * Fixed "today" keeps the prototype deterministic (no SSR/CSR hydration drift and
 * stable screenshots). The calendar DISABLES invalid dates and surfaces the
 * reason — it never silently accepts an out-of-window pick. */

const TODAY = new Date(2026, 8, 4); // Fri, Sep 4 2026

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number): Date {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
}
function sameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}
function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** First actually-selectable date at/after `earliest` (skips closed days). */
function firstSelectable(earliest: Date): Date {
  let d = startOfDay(earliest);
  for (let i = 0; i < 14; i++) {
    if (!disabledReason(d, earliest)) return d;
    d = addDays(d, 1);
  }
  return d;
}

/** Returns a human reason a date can't be picked, or null if it's selectable. */
function disabledReason(date: Date, earliest: Date): string | null {
  const day = startOfDay(date);
  if (day.getTime() < startOfDay(earliest).getTime()) {
    if (day.getTime() < startOfDay(TODAY).getTime()) return "Date has passed";
    return "Before the earliest available date";
  }
  if (date.getDay() === 0) return "Branch closed Sundays";
  return null;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarGrid({
  selected,
  earliest,
  onSelect,
}: {
  selected: Date | null;
  earliest: Date;
  onSelect: (d: Date) => void;
}) {
  const [view, setView] = React.useState<Date>(() => new Date(earliest.getFullYear(), earliest.getMonth(), 1));

  const firstOfMonth = new Date(view.getFullYear(), view.getMonth(), 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const leading = firstOfMonth.getDay();
  const minMonth = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const maxMonth = new Date(earliest.getFullYear(), earliest.getMonth() + 2, 1);
  const canPrev = view > minMonth;
  const canNext = view < maxMonth;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          disabled={!canPrev}
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-semibold" aria-live="polite">
          {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          disabled={!canNext}
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`b-${i}`} />;
          const reason = disabledReason(date, earliest);
          const isSelected = selected ? sameDay(date, selected) : false;
          const isToday = sameDay(date, TODAY);
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={!!reason}
              title={reason ?? undefined}
              aria-label={`${fmtDate(date)}${reason ? ` — ${reason}` : ""}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(date)}
              className={cn(
                "grid h-9 place-items-center rounded-md text-sm transition-colors",
                reason
                  ? "cursor-not-allowed text-muted-foreground/40 line-through"
                  : "hover:bg-muted",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                !isSelected && isToday && !reason && "ring-1 ring-inset ring-border font-semibold"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateField({
  id,
  label,
  value,
  onSelect,
  earliest,
  reason,
  required = false,
}: {
  id: string;
  label: string;
  value: Date | null;
  onSelect: (d: Date) => void;
  earliest: Date;
  /** Persistent cutoff/availability explanation shown near the field. */
  reason?: string;
  required?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-haspopup="dialog"
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <span className={cn(value ? "text-foreground" : "text-muted-foreground")}>
              {value ? fmtDate(value) : "Select a date"}
            </span>
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto min-w-[18rem] p-3">
          <CalendarGrid
            selected={value}
            earliest={earliest}
            onSelect={(d) => {
              onSelect(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {reason ? (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{reason}</span>
        </p>
      ) : null}
    </div>
  );
}

/* ───────────────────────── Pickup panel ───────────────────────── */

function PickupPanel({
  branch,
  branches,
  onChangeBranch,
  pickupDate,
  setPickupDate,
  earliest,
  dateReason,
  addon,
  addonOn,
  setAddonOn,
}: {
  branch: BrandBranch;
  branches: BrandBranch[];
  onChangeBranch: (b: BrandBranch) => void;
  pickupDate: Date | null;
  setPickupDate: (d: Date) => void;
  earliest: Date;
  dateReason?: string;
  addon?: BrandCheckoutConfig["pickupAddon"];
  addonOn: boolean;
  setAddonOn: (v: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-md border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-semibold">{branch.name}</p>
            <p className="text-sm text-muted-foreground">{branch.address}</p>
            <p className="mt-1 text-xs font-medium text-in-stock">{branch.hours}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Change
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DateField
          id="pickup-date"
          label="Pickup date"
          required
          value={pickupDate}
          onSelect={setPickupDate}
          earliest={earliest}
          reason={dateReason}
        />
      </div>

      {/* Pickup add-on service (Baker Express) — a toggle, not a method. */}
      {addon ? (
        <Label className="flex items-start gap-3 rounded-md border p-4 text-sm font-normal">
          <Checkbox checked={addonOn} onCheckedChange={(v) => setAddonOn(v === true)} className="mt-0.5" />
          <span>
            <span className="block font-medium text-foreground">{addon.label}</span>
            <span className="block text-xs text-muted-foreground">{addon.hint}</span>
          </span>
        </Label>
      ) : null}

      <StoreFinderDrawer open={open} onClose={() => setOpen(false)} branches={branches} current={branch} onSelect={onChangeBranch} />
    </div>
  );
}

/* ───────────────────────── Delivery panel ───────────────────────── */

/** Addresses shown inline per group before the "See all" drawer takes over. */
const INLINE_PER_GROUP = 3;

function DeliveryPanel({
  method,
  addresses,
  addressId,
  onSelectAddress,
  deliveryDate,
  setDeliveryDate,
  earliest,
  dateReason,
  dateMode,
  showModifiers,
  truckLabel,
  split,
  setSplit,
  liftgate,
  setLiftgate,
  outOfRadius,
}: {
  method: FulfillmentMethod;
  addresses: BrandAddress[];
  addressId: string;
  onSelectAddress: (id: string) => void;
  deliveryDate: Date | null;
  setDeliveryDate: (d: Date) => void;
  earliest: Date;
  dateReason?: string;
  dateMode: "picker" | "csr";
  showModifiers: boolean;
  truckLabel?: string;
  split: "complete" | "partial";
  setSplit: (v: "complete" | "partial") => void;
  liftgate: "none" | "required";
  setLiftgate: (v: "none" | "required") => void;
  outOfRadius: boolean;
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [bookOpen, setBookOpen] = React.useState(false);
  const rateLabel = method === "truck" && truckLabel ? truckLabel : METHOD_RATE_LABEL[method];

  return (
    <div className="space-y-6">
      {outOfRadius ? (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>This address is outside the 150-mile delivery radius</AlertTitle>
          <AlertDescription>
            Truck delivery isn&apos;t available here. We&apos;ve set the method to Freight / LTL — a
            carrier will quote the final rate.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Grouped address picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Deliver to</p>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            New address
          </Button>
        </div>
        <RadioGroup value={addressId} onValueChange={onSelectAddress} className="gap-4">
          {GROUP_ORDER.map((group) => {
            const rows = addresses.filter((a) => a.group === group);
            if (!rows.length) return null;
            // The selected address always shows inline even if it sorts past the
            // inline cap, so the current choice is never hidden behind "See all".
            const inline = rows.slice(0, INLINE_PER_GROUP);
            if (!inline.some((a) => a.id === addressId)) {
              const chosen = rows.find((a) => a.id === addressId);
              if (chosen) inline[inline.length - 1] = chosen;
            }
            const hidden = rows.length - inline.length;
            return (
              <div key={group} className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {GROUP_LABEL[group]}
                </p>
                <div className="grid gap-2">
                  {inline.map((a) => (
                    <AddressRow key={a.id} address={a} selected={a.id === addressId} />
                  ))}
                </div>
                {hidden > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    +{hidden} more in this group
                  </p>
                ) : null}
              </div>
            );
          })}
        </RadioGroup>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setBookOpen(true)}
        >
          See all ({addresses.length}) addresses
        </Button>
      </div>

      {/* Requested date + rate. Peirce's ship date is CSR-confirmed, not picked. */}
      <div className="grid gap-4 sm:grid-cols-2">
        {dateMode === "picker" ? (
          <DateField
            id="delivery-date"
            label="Requested delivery date"
            required
            value={deliveryDate}
            onSelect={setDeliveryDate}
            earliest={earliest}
            reason={dateReason}
          />
        ) : (
          <div className="space-y-2">
            <Label htmlFor="delivery-date-csr">Ship date</Label>
            <div
              id="delivery-date-csr"
              className="flex h-9 items-center rounded-md border bg-muted/30 px-3 text-sm text-muted-foreground"
            >
              Set by your CSR
            </div>
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <span>Your customer service rep confirms the ship date after reviewing stock and routing.</span>
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="rate-line">Estimated rate</Label>
          <div
            id="rate-line"
            className="flex h-9 items-center rounded-md border bg-muted/30 px-3 text-sm font-medium"
          >
            {rateLabel}
          </div>
        </div>
      </div>

      <Alert variant="info">
        <Info />
        <AlertDescription>
          We&apos;ll do our best to ship via your requested method and date. Availability depends on carrier
          capacity and branch cutoff — we&apos;ll confirm before the order ships.
        </AlertDescription>
      </Alert>

      {/* Modifiers (Homans local delivery) */}
      {showModifiers ? (
        <div className="grid gap-5 border-t pt-5 sm:grid-cols-2">
          <ModifierGroup
            legend="Split shipment"
            value={split}
            onValueChange={(v) => setSplit(v as "complete" | "partial")}
            options={[
              { value: "complete", label: "Ship complete", hint: "Hold until all items are ready" },
              { value: "partial", label: "Ship partial", hint: "Send available items now" },
            ]}
          />
          <ModifierGroup
            legend="Liftgate"
            value={liftgate}
            onValueChange={(v) => setLiftgate(v as "none" | "required")}
            options={[
              { value: "none", label: "Not needed", hint: "Dock or forklift on site" },
              { value: "required", label: "Required", hint: "No dock — lower to ground" },
            ]}
          />
        </div>
      ) : null}

      <AddAddressDrawer open={addOpen} onClose={() => setAddOpen(false)} />
      <AddressBookDrawer
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        addresses={addresses}
        addressId={addressId}
        onSelect={onSelectAddress}
      />
    </div>
  );
}

function ModifierGroup({
  legend,
  value,
  onValueChange,
  options,
}: {
  legend: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string; hint: string }[];
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <RadioGroup value={value} onValueChange={onValueChange} className="gap-2">
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <Label
              key={o.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
                selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
              )}
            >
              <RadioGroupItem value={o.value} className="mt-0.5" />
              <span className="flex-1">
                <span className="block text-sm font-medium">{o.label}</span>
                <span className="block text-xs text-muted-foreground">{o.hint}</span>
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}

/* ───────────────────────── Flat method selector ───────────────────────── */

function MethodRow({ meta, selected }: { meta: MethodMeta; selected: boolean }) {
  const { Icon } = meta;
  const rate = METHOD_RATE[meta.id];
  return (
    <Label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-colors",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
      )}
    >
      <RadioGroupItem value={meta.id} />
      <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{meta.label}</span>
        <span className="block text-sm text-muted-foreground">{meta.blurb}</span>
      </span>
      <span className="shrink-0 text-sm font-medium text-muted-foreground">
        {meta.id === "pickup" ? "Free" : rate === 0 ? "Free" : formatUSD(rate)}
      </span>
    </Label>
  );
}

/* ───────────────────────── Public: the unified fulfillment section ───────────────────────── */

export function FulfillmentSection({
  config,
  method,
  setMethod,
  availabilityConstraint,
  branch,
  onChangeBranch,
}: {
  config: BrandCheckoutConfig;
  method: FulfillmentMethod;
  setMethod: (m: FulfillmentMethod) => void;
  /** Scenario flag: an order placed after the branch cutoff — same/next-day off. */
  availabilityConstraint: boolean;
  /** Branch is lifted to the client so Order Details and pickup share one choice. */
  branch: BrandBranch;
  onChangeBranch: (b: BrandBranch) => void;
}) {
  const defaultAddressId = (config.addresses.find((a) => a.isDefault) ?? config.addresses[0]).id;

  const [addressId, setAddressId] = React.useState<string>(defaultAddressId);
  const [pickupDate, setPickupDate] = React.useState<Date | null>(null);
  const [deliveryDate, setDeliveryDate] = React.useState<Date | null>(null);
  const [split, setSplit] = React.useState<"complete" | "partial">("complete");
  const [liftgate, setLiftgate] = React.useState<"none" | "required">("none");
  const [expressOn, setExpressOn] = React.useState(false);

  const selectedAddress = config.addresses.find((a) => a.id === addressId);
  const outOfRadius = config.radiusRule && !!selectedAddress?.outOfRadius;

  // Earliest selectable date: cutoff pushes it out by an extra day.
  const earliest = availabilityConstraint ? addDays(TODAY, 2) : addDays(TODAY, 1);
  const earliestLabel = fmtDate(firstSelectable(earliest));
  const dateReason = availabilityConstraint
    ? `Ordered after today's 2:00 PM cutoff — same-day and next-day are unavailable. Earliest is ${earliestLabel}.`
    : "Same-day delivery isn't available. Choose the next business day or later; Sundays are closed.";
  const pickupReason = availabilityConstraint
    ? `Ordered after today's 2:00 PM cutoff — earliest pickup is ${earliestLabel}.`
    : "Allow one business day for the branch to stage your order. Sundays are closed.";

  // 150-mile rule: selecting an out-of-radius address forces Freight / LTL.
  const selectAddress = (id: string) => {
    setAddressId(id);
    if (!config.radiusRule) return;
    const addr = config.addresses.find((a) => a.id === id);
    if (addr?.outOfRadius) setMethod("freight");
  };

  // The panel for whichever method is selected. Rendered directly UNDER that
  // method's row (expand-in-place), the same way each delivery method reveals
  // its address/date panel — never a detached block at the bottom.
  const panelFor = (id: FulfillmentMethod) =>
    id === "pickup" ? (
      <PickupPanel
        branch={branch}
        branches={config.branches}
        onChangeBranch={onChangeBranch}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        earliest={earliest}
        dateReason={pickupReason}
        addon={config.pickupAddon}
        addonOn={expressOn}
        setAddonOn={setExpressOn}
      />
    ) : (
      <DeliveryPanel
        method={id}
        addresses={config.addresses}
        addressId={addressId}
        onSelectAddress={selectAddress}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        earliest={earliest}
        dateReason={dateReason}
        dateMode={config.deliveryDateMode}
        showModifiers={config.deliveryModifiers}
        truckLabel={config.truckLabel}
        split={split}
        setSplit={setSplit}
        liftgate={liftgate}
        setLiftgate={setLiftgate}
        outOfRadius={outOfRadius}
      />
    );

  return (
    <div className="space-y-4 p-5">
      <p className="text-sm font-semibold">How would you like to receive this order?</p>
      <RadioGroup
        value={method}
        onValueChange={(v) => setMethod(v as FulfillmentMethod)}
        className="gap-2"
        aria-label="Fulfillment method"
      >
        {config.methods.map((id) => (
          <div key={id} className="space-y-4">
            <MethodRow meta={METHOD_META[id]} selected={id === method} />
            {id === method ? (
              <div className="rounded-md border border-dashed bg-muted/20 p-4">{panelFor(id)}</div>
            ) : null}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
