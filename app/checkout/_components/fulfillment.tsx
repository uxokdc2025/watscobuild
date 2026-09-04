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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/pdp/_lib/types";

/* ───────────────────────── Fulfillment domain model ─────────────────────────
 * ONE unified fulfillment section — the SUPERSET across Baker / Peirce / Homans
 * / ECM. Method is the top-level choice (ECM pattern), not a Pickup/Delivery
 * toggle. Every scenario renders this same component; behavior is data-driven,
 * so there is no scattered `scenario === "…"` branching in the markup. */

export type FulfillmentMethod = "pickup" | "truck" | "freight" | "ups" | "local";

const DELIVERY_METHODS: FulfillmentMethod[] = ["truck", "freight", "ups", "local"];
export function isDeliveryMethod(m: FulfillmentMethod): boolean {
  return DELIVERY_METHODS.includes(m);
}

type MethodMeta = {
  id: FulfillmentMethod;
  label: string;
  blurb: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const METHODS: MethodMeta[] = [
  { id: "pickup", label: "Pickup", blurb: "Pick up at your branch counter", Icon: Store },
  { id: "truck", label: "Truck", blurb: "Company truck delivery", Icon: Truck },
  { id: "freight", label: "Freight / LTL", blurb: "Palletized freight carrier", Icon: Container },
  { id: "ups", label: "UPS", blurb: "UPS small-parcel", Icon: Package },
  { id: "local", label: "Local Delivery", blurb: "Local courier, same metro", Icon: Bike },
];

/** Per-method rate (used in the panel line AND lifted into the order summary so
 *  the total reflects the chosen method). */
export const METHOD_RATE: Record<FulfillmentMethod, number> = {
  pickup: 0,
  truck: 0,
  freight: 89.5,
  ups: 41.8,
  local: 25,
};

const METHOD_RATE_LABEL: Record<FulfillmentMethod, string> = {
  pickup: "Branch pickup — no charge",
  truck: "ECMD Truck — $0.00",
  freight: "Freight / LTL — $89.50",
  ups: "UPS Ground — $41.80",
  local: "Local Delivery — $25.00",
};

export function methodLabel(m: FulfillmentMethod): string {
  return METHODS.find((x) => x.id === m)?.label ?? "Delivery";
}

/* ── Grouped address book (superset: Job account · Account · Billing) ── */

type AddressGroup = "job" | "account" | "billing";

type Address = {
  id: string;
  group: AddressGroup;
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  contact?: string;
  /** Deterministic default — the first job/primary address, never random. */
  isDefault?: boolean;
  /** 150-mile rule: address sits outside the branch delivery radius. */
  outOfRadius?: boolean;
};

const GROUP_LABEL: Record<AddressGroup, string> = {
  job: "Job account",
  account: "Account",
  billing: "Billing",
};

const ADDRESSES: Address[] = [
  {
    id: "job-spring",
    group: "job",
    name: "Spring maintenance",
    contact: "Site super — Dave R.",
    line1: "88 Elm Street",
    city: "Manchester",
    state: "NH",
    zip: "03101",
    isDefault: true,
  },
  {
    id: "job-riverside",
    group: "job",
    name: "Riverside retrofit",
    contact: "GC — Meadow Mechanical",
    line1: "1200 Shore Road",
    city: "Bar Harbor",
    state: "ME",
    zip: "04609",
    outOfRadius: true,
  },
  {
    id: "acct-main",
    group: "account",
    name: "Homans Associates — Main",
    line1: "613 Main Street",
    city: "Manchester",
    state: "NH",
    zip: "03101",
  },
  {
    id: "acct-north",
    group: "account",
    name: "North warehouse",
    line1: "42 Industrial Way",
    city: "Concord",
    state: "NH",
    zip: "03301",
  },
  {
    id: "billing-ap",
    group: "billing",
    name: "Accounts payable",
    line1: "PO Box 2200",
    city: "Manchester",
    state: "NH",
    zip: "03105",
  },
];

const DEFAULT_ADDRESS_ID = ADDRESSES.find((a) => a.isDefault)?.id ?? ADDRESSES[0].id;
const GROUP_ORDER: AddressGroup[] = ["job", "account", "billing"];

/* ── Branches for the pickup store-finder ── */

type Branch = {
  id: string;
  name: string;
  address: string;
  miles: number;
  hours: string;
  current?: boolean;
};

const BRANCHES: Branch[] = [
  { id: "manchester", name: "Manchester, NH #509973", address: "613 Main Street, Manchester, NH", miles: 0, hours: "Open · closes 5pm", current: true },
  { id: "nashua", name: "Nashua, NH #5102", address: "27 Simon Street, Nashua, NH", miles: 17.2, hours: "Open · closes 5pm" },
  { id: "concord", name: "Concord, NH #5140", address: "42 Industrial Way, Concord, NH", miles: 19.6, hours: "Open · closes 5pm" },
  { id: "portsmouth", name: "Portsmouth, NH #5177", address: "155 Heritage Ave, Portsmouth, NH", miles: 44.8, hours: "Open · closes 4:30pm" },
];

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

/* ───────────────────────── Small shared field (add-address dialog) ───────────────────────── */

function TextField({
  id,
  label,
  required = false,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { id: string; label: string; required?: boolean; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      <Input id={id} required={required} {...props} />
    </div>
  );
}

/* ───────────────────────── Pickup panel ───────────────────────── */

function PickupPanel({
  branch,
  onChangeBranch,
  pickupDate,
  setPickupDate,
  earliest,
  dateReason,
}: {
  branch: Branch;
  onChangeBranch: (b: Branch) => void;
  pickupDate: Date | null;
  setPickupDate: (d: Date) => void;
  earliest: Date;
  dateReason?: string;
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

      <StoreFinderDialog open={open} onOpenChange={setOpen} current={branch} onSelect={onChangeBranch} />
    </div>
  );
}

function StoreFinderDialog({
  open,
  onOpenChange,
  current,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  current: Branch;
  onSelect: (b: Branch) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose a pickup branch</DialogTitle>
          <DialogDescription>Sorted by distance from your account.</DialogDescription>
        </DialogHeader>
        <ul className="max-h-[60vh] space-y-2 overflow-y-auto">
          {BRANCHES.map((b) => {
            const isCurrent = b.id === current.id;
            return (
              <li key={b.id}>
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-md border p-3",
                    isCurrent && "border-primary bg-primary/5"
                  )}
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-medium">
                      {b.name}
                      {isCurrent ? (
                        <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                          Current
                        </span>
                      ) : null}
                    </p>
                    <p className="text-sm text-muted-foreground">{b.address}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {b.miles === 0 ? "Your branch" : `${b.miles} mi away`} · {b.hours}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent}
                    onClick={() => {
                      onSelect(b);
                      onOpenChange(false);
                    }}
                  >
                    {isCurrent ? "Selected" : "Select this store"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Delivery panel ───────────────────────── */

function AddressRow({ address, selected }: { address: Address; selected: boolean }) {
  return (
    <Label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
      )}
    >
      <RadioGroupItem value={address.id} className="mt-0.5" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{address.name}</span>
          {address.isDefault ? (
            <span className="rounded-sm bg-in-stock/12 px-1.5 py-0.5 text-[11px] font-semibold text-in-stock">
              Default
            </span>
          ) : null}
          {address.outOfRadius ? (
            <span className="rounded-sm bg-yellow-400/20 px-1.5 py-0.5 text-[11px] font-semibold text-yellow-800 dark:text-yellow-300">
              Outside radius
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground">
          {address.line1}, {address.city}, {address.state} {address.zip}
        </span>
        {address.contact ? (
          <span className="block text-xs text-muted-foreground">{address.contact}</span>
        ) : null}
      </span>
    </Label>
  );
}

function DeliveryPanel({
  method,
  addressId,
  onSelectAddress,
  deliveryDate,
  setDeliveryDate,
  earliest,
  dateReason,
  split,
  setSplit,
  liftgate,
  setLiftgate,
  outOfRadius,
}: {
  method: FulfillmentMethod;
  addressId: string;
  onSelectAddress: (id: string) => void;
  deliveryDate: Date | null;
  setDeliveryDate: (d: Date) => void;
  earliest: Date;
  dateReason?: string;
  split: "complete" | "partial";
  setSplit: (v: "complete" | "partial") => void;
  liftgate: "none" | "required";
  setLiftgate: (v: "none" | "required") => void;
  outOfRadius: boolean;
}) {
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {outOfRadius ? (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>This address is outside the 150-mile delivery radius</AlertTitle>
          <AlertDescription>
            Truck and local delivery aren&apos;t available here. We&apos;ve set the method to Freight / LTL — a
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
            const rows = ADDRESSES.filter((a) => a.group === group);
            if (!rows.length) return null;
            return (
              <div key={group} className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {GROUP_LABEL[group]}
                </p>
                <div className="grid gap-2">
                  {rows.map((a) => (
                    <AddressRow key={a.id} address={a} selected={a.id === addressId} />
                  ))}
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Requested date + rate */}
      <div className="grid gap-4 sm:grid-cols-2">
        <DateField
          id="delivery-date"
          label="Requested delivery date"
          required
          value={deliveryDate}
          onSelect={setDeliveryDate}
          earliest={earliest}
          reason={dateReason}
        />
        <div className="space-y-2">
          <Label htmlFor="rate-line">Estimated rate</Label>
          <div
            id="rate-line"
            className="flex h-9 items-center rounded-md border bg-muted/30 px-3 text-sm font-medium"
          >
            {METHOD_RATE_LABEL[method]}
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

      {/* Modifiers */}
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

      <AddAddressDialog open={addOpen} onOpenChange={setAddOpen} />
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

function AddAddressDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a delivery address</DialogTitle>
          <DialogDescription>Add a one-time address or save it to your address book.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="new-first" label="First name" required placeholder="First name" autoFocus />
            <TextField id="new-last" label="Last name" required placeholder="Last name" />
            <TextField id="new-company" label="Company" placeholder="Company (optional)" className="sm:col-span-2" />
            <TextField id="new-phone" label="Phone" required placeholder="(603) 555-0100" type="tel" />
            <TextField id="new-country" label="Country" required defaultValue="United States" />
            <TextField id="new-street1" label="Street address" required placeholder="Street address" className="sm:col-span-2" />
            <TextField id="new-street2" label="Street address 2" placeholder="Suite, unit, building (optional)" />
            <TextField id="new-apt" label="Apt / Suite" placeholder="Apt, suite" />
            <TextField id="new-city" label="City" required placeholder="City" />
            <TextField id="new-state" label="State" required placeholder="State" />
            <TextField id="new-zip" label="ZIP code" required placeholder="ZIP" />
          </div>
          <Label className="flex items-center gap-3 rounded-md border p-3 text-sm font-normal">
            <Checkbox defaultChecked />
            Save this address to my address book
          </Label>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save address</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
  method,
  setMethod,
  availabilityConstraint,
}: {
  method: FulfillmentMethod;
  setMethod: (m: FulfillmentMethod) => void;
  /** Scenario flag: an order placed after the branch cutoff — same/next-day off. */
  availabilityConstraint: boolean;
}) {
  const [branch, setBranch] = React.useState<Branch>(BRANCHES.find((b) => b.current) ?? BRANCHES[0]);
  const [addressId, setAddressId] = React.useState<string>(DEFAULT_ADDRESS_ID);
  const [pickupDate, setPickupDate] = React.useState<Date | null>(null);
  const [deliveryDate, setDeliveryDate] = React.useState<Date | null>(null);
  const [split, setSplit] = React.useState<"complete" | "partial">("complete");
  const [liftgate, setLiftgate] = React.useState<"none" | "required">("none");

  const selectedAddress = ADDRESSES.find((a) => a.id === addressId);
  const outOfRadius = !!selectedAddress?.outOfRadius;

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
    const addr = ADDRESSES.find((a) => a.id === id);
    if (addr?.outOfRadius) setMethod("freight");
  };

  return (
    <div className="space-y-6 p-5">
      <div>
        <p className="text-sm font-semibold">How would you like to receive this order?</p>
        <RadioGroup
          value={method}
          onValueChange={(v) => setMethod(v as FulfillmentMethod)}
          className="mt-3 gap-2"
          aria-label="Fulfillment method"
        >
          {METHODS.map((m) => (
            <MethodRow key={m.id} meta={m} selected={m.id === method} />
          ))}
        </RadioGroup>
      </div>

      {/* Selecting a method expands its panel; the others collapse. */}
      <div className="border-t pt-6">
        {method === "pickup" ? (
          <PickupPanel
            branch={branch}
            onChangeBranch={setBranch}
            pickupDate={pickupDate}
            setPickupDate={setPickupDate}
            earliest={earliest}
            dateReason={pickupReason}
          />
        ) : (
          <DeliveryPanel
            method={method}
            addressId={addressId}
            onSelectAddress={selectAddress}
            deliveryDate={deliveryDate}
            setDeliveryDate={setDeliveryDate}
            earliest={earliest}
            dateReason={dateReason}
            split={split}
            setSplit={setSplit}
            liftgate={liftgate}
            setLiftgate={setLiftgate}
            outOfRadius={outOfRadius}
          />
        )}
      </div>
    </div>
  );
}
