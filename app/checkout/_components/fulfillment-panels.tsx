"use client";

import * as React from "react";
import { Info, MapPin, Plus, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/pdp/_lib/types";
import type {
  BrandAddress,
  BrandBranch,
  BrandCheckoutConfig,
} from "../_lib/brand-checkout";
import {
  METHOD_META,
  METHOD_RATE,
  METHOD_RATE_LABEL,
  type FulfillmentMethod,
} from "./fulfillment-methods";
import { DateField } from "./fulfillment-calendar";
import {
  AddAddressDrawer,
  AddressBookDrawer,
  AddressRow,
  GROUP_LABEL,
  GROUP_ORDER,
  StoreFinderDrawer,
} from "./checkout-drawers";

/* Fulfillment panels — the body of each segmented tab. Sections are separated by
 * hairline `border-t` rules (never nested bordered boxes) and packed into 2-col
 * grids to cut vertical height. */

/* ───────────────────────── Pickup panel ───────────────────────── */

export function PickupPanel({
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
      {/* Branch + pickup date side by side — no boxed inset, just a rule of thumb
          layout: the current branch on the left, the date picker on the right. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Pickup branch</p>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              Change
            </Button>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium">{branch.name}</p>
              <p className="text-sm text-muted-foreground">{branch.address}</p>
              <p className="mt-1 text-xs font-medium text-in-stock">{branch.hours}</p>
            </div>
          </div>
        </div>

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

      {/* Pickup add-on service (Baker Express) — a toggle, not a method. Separated
          by a hairline rule instead of its own bordered card. */}
      {addon ? (
        <div className="border-t pt-5">
          <Label className="flex items-start gap-3 text-sm font-normal">
            <Checkbox checked={addonOn} onCheckedChange={(v) => setAddonOn(v === true)} className="mt-0.5" />
            <span>
              <span className="block font-medium text-foreground">{addon.label}</span>
              <span className="block text-xs text-muted-foreground">{addon.hint}</span>
            </span>
          </Label>
        </div>
      ) : null}

      <StoreFinderDrawer open={open} onClose={() => setOpen(false)} branches={branches} current={branch} onSelect={onChangeBranch} />
    </div>
  );
}

/* ───────────────────────── Delivery panel ───────────────────────── */

/** Addresses shown inline per group before the "See all" drawer takes over. */
const INLINE_PER_GROUP = 3;

export function DeliveryPanel({
  deliveryMethods,
  method,
  onSelectMethod,
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
  deliveryMethods: FulfillmentMethod[];
  method: FulfillmentMethod;
  onSelectMethod: (m: FulfillmentMethod) => void;
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
  const selectedAddress = addresses.find((a) => a.id === addressId);
  const rateLabel = method === "truck" && truckLabel ? truckLabel : METHOD_RATE_LABEL[method];
  // A single delivery method needs no chooser — the Delivery tab already says it.
  const multiMethod = deliveryMethods.length > 1;

  return (
    <div className="space-y-5">
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

      {/* Secondary delivery-method chooser — compact 2-col radios, not big cards. */}
      {multiMethod ? (
        <fieldset className="space-y-2.5">
          <legend className="text-sm font-semibold">Delivery method</legend>
          <RadioGroup
            value={method}
            onValueChange={(v) => onSelectMethod(v as FulfillmentMethod)}
            className="grid gap-2 sm:grid-cols-2"
            aria-label="Delivery method"
          >
            {deliveryMethods.map((id) => {
              const meta = METHOD_META[id];
              const { Icon } = meta;
              const selected = id === method;
              const rate = METHOD_RATE[id];
              return (
                <Label
                  key={id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md border p-3 transition-colors",
                    selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value={id} />
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1 text-sm font-medium">{meta.label}</span>
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {rate === 0 ? "Free" : formatUSD(rate)}
                  </span>
                </Label>
              );
            })}
          </RadioGroup>
        </fieldset>
      ) : null}

      {/* Address picker — grouped card grid (2-col), reusing the account card row. */}
      <div className={cn("space-y-3", multiMethod && "border-t pt-5")}>
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
                <div className="grid gap-2 sm:grid-cols-2">
                  {inline.map((a) => (
                    <AddressRow key={a.id} address={a} selected={a.id === addressId} />
                  ))}
                </div>
                {hidden > 0 ? (
                  <p className="text-xs text-muted-foreground">+{hidden} more in this group</p>
                ) : null}
              </div>
            );
          })}
        </RadioGroup>
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setBookOpen(true)}>
          See all ({addresses.length}) addresses
        </Button>
      </div>

      {/* Requested date + rate appear only AFTER an address is chosen. 2-col.
          Peirce's ship date is CSR-confirmed, not picked. */}
      {selectedAddress ? (
        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
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
      ) : null}

      <Alert variant="info">
        <Info />
        <AlertDescription>
          We&apos;ll do our best to ship via your requested method and date. Availability depends on carrier
          capacity and branch cutoff — we&apos;ll confirm before the order ships.
        </AlertDescription>
      </Alert>

      {/* Modifiers (Homans local delivery) — two compact radio groups, side by side. */}
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
