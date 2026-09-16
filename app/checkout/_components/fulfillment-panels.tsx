"use client";

import * as React from "react";
import { Info, MapPin, Plus, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { SummaryCard } from "./summary-card";
import {
  AddAddressDrawer,
  AddressBookDrawer,
  AddressRow,
  StoreFinderDrawer,
} from "./checkout-drawers";

/* Fulfillment panels — the body of each segmented tab. Compact reference
 * composition: narrow left column, vertically stacked, whitespace on the right. */

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
    <div className="max-w-[440px] space-y-5">
      <SummaryCard
        label="Pickup branch"
        labelIcon={<MapPin className="size-4 text-muted-foreground" aria-hidden="true" />}
        cta={{ label: "Change", onClick: () => setOpen(true) }}
      >
        <p className="font-medium text-foreground">{branch.name}</p>
        <p className="text-muted-foreground">{branch.address}</p>
        <p className="text-xs font-medium text-in-stock">{branch.hours}</p>
      </SummaryCard>

      <DateField
        id="pickup-date"
        label="Pickup date"
        required
        value={pickupDate}
        onSelect={setPickupDate}
        earliest={earliest}
        reason={dateReason}
      />

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

/* ───────────────────────── Delivery panel ─────────────────────────
 * One compact 600px column: Deliver to header (See all + New address),
 * flat 3-up address row, requested date, method radios/rate, alerts,
 * modifiers. Whitespace on the right. */

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
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Deliver to</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setBookOpen(true)} className="text-sm font-medium text-primary hover:underline">
            See all ({addresses.length})
          </button>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            New address
          </Button>
        </div>
      </div>
      <RadioGroup value={addressId} onValueChange={onSelectAddress}>
        <div className="grid grid-cols-4 gap-3">
          {addresses.slice(0, 4).map((a) => (
            <AddressRow key={a.id} address={a} selected={a.id === addressId} />
          ))}
        </div>
      </RadioGroup>
      <div className="max-w-[560px] space-y-4">

      {/* Requested date appears only AFTER an address is chosen, stacked
          left-aligned. Peirce's ship date is CSR-confirmed, not picked. */}
      {selectedAddress ? (
        dateMode === "picker" ? (
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
        )
      ) : null}

      {/* Delivery methods UNDER the date as plain radio rows (multi-method
          brands only); single-method brands show the estimated rate line. */}
      {selectedAddress && multiMethod ? (
        <RadioGroup
          value={method}
          onValueChange={(v) => onSelectMethod(v as FulfillmentMethod)}
          className="gap-1.5"
          aria-label="Delivery method"
        >
          {deliveryMethods.map((id) => {
            const meta = METHOD_META[id];
            const rate = METHOD_RATE[id];
            return (
              <Label key={id} className="flex items-center gap-2.5 py-1 text-sm">
                <RadioGroupItem value={id} />
                <span className="flex-1">{meta.label}</span>
                <span className="text-xs text-muted-foreground">{rate === 0 ? "Free" : formatUSD(rate)}</span>
              </Label>
            );
          })}
        </RadioGroup>
      ) : null}
      {selectedAddress && !multiMethod ? (
        <div className="space-y-2">
          <Label htmlFor="rate-line">Estimated rate</Label>
          <div
            id="rate-line"
            className="flex h-9 items-center rounded-md border bg-muted/30 px-3 text-sm font-medium"
          >
            {rateLabel}
          </div>
        </div>
      ) : null}

      {/* Warning + info messages beneath the delivery methods. */}
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
      <Alert variant="info">
        <Info />
        <AlertDescription>
          We&apos;ll do our best to ship via your requested method and date. Availability depends on carrier
          capacity and branch cutoff — we&apos;ll confirm before the order ships.
        </AlertDescription>
      </Alert>

      {/* Modifiers (Homans local delivery) — two checkbox rows in the flow. */}
      {showModifiers ? (
        <div className="space-y-2">
          <Label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm font-normal">
            <Checkbox checked={split === "complete"} onCheckedChange={(v) => setSplit(v === true ? "complete" : "partial")} className="mt-0.5" />
            <span>
              <span className="block font-medium text-foreground">Ship complete</span>
              <span className="block text-xs text-muted-foreground">Hold until all items are ready</span>
            </span>
          </Label>
          <Label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm font-normal">
            <Checkbox checked={liftgate === "required"} onCheckedChange={(v) => setLiftgate(v === true ? "required" : "none")} className="mt-0.5" />
            <span>
              <span className="block font-medium text-foreground">Liftgate Required</span>
              <span className="block text-xs text-muted-foreground">No dock — lower to ground</span>
            </span>
          </Label>
        </div>
      ) : null}
      </div>

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
