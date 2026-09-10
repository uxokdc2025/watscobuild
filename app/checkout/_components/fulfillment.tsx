"use client";

import * as React from "react";
import { Store, Truck } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BrandBranch, BrandCheckoutConfig } from "../_lib/brand-checkout";
import {
  isDeliveryMethod,
  type FulfillmentMethod,
} from "./fulfillment-methods";
import { TODAY, addDays, firstSelectable, fmtDate } from "./fulfillment-calendar";
import { DeliveryPanel, PickupPanel } from "./fulfillment-panels";

/* ───────────────────────── Fulfillment section ─────────────────────────
 * ONE card. The primary fork — Pickup vs Delivery — is a full-width segmented
 * tab (the DS Tabs primitive: role=tablist/tab/tabpanel, aria-selected, keyboard
 * arrows). WHICH concrete methods fill the Delivery side, and all demo data
 * (branches, addresses), come from the per-brand config — so each brand shows
 * only its own methods with NO scattered `brand === "…"` branching.
 *
 * `method` (owned by the checkout client) stays the single source of truth for
 * the rate + review summary; the active tab is DERIVED from it, so the existing
 * scenario→method mapping already lands each ?case on the right tab. */

// Re-exported so the checkout client / review step keep one import site.
export {
  METHOD_RATE,
  methodLabel,
  isDeliveryMethod,
  type FulfillmentMethod,
} from "./fulfillment-methods";

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

  const deliveryMethods = config.methods.filter(isDeliveryMethod);
  const hasPickup = config.methods.includes("pickup");
  const hasDelivery = deliveryMethods.length > 0;

  // Remember the last-chosen delivery method so switching Pickup↔Delivery restores
  // it (and so the 150-mile auto-switch to Freight is reflected on return).
  const [lastDelivery, setLastDelivery] = React.useState<FulfillmentMethod>(
    isDeliveryMethod(method) ? method : deliveryMethods[0] ?? "delivery"
  );
  React.useEffect(() => {
    if (isDeliveryMethod(method)) setLastDelivery(method);
  }, [method]);

  const activeTab: "pickup" | "delivery" = isDeliveryMethod(method) ? "delivery" : "pickup";
  const onTabChange = (tab: string) => setMethod(tab === "pickup" ? "pickup" : lastDelivery);

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

  const pickupPanel = (
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
  );

  const deliveryPanel = (
    <DeliveryPanel
      deliveryMethods={deliveryMethods}
      method={isDeliveryMethod(method) ? method : lastDelivery}
      onSelectMethod={setMethod}
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

  // Brands with only one side skip the toggle entirely — no empty tab.
  if (!hasPickup || !hasDelivery) {
    return <div className="p-5">{hasPickup ? pickupPanel : deliveryPanel}</div>;
  }

  return (
    <div className="p-5">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList variant="segmented" className="min-h-11 w-full" aria-label="Fulfillment method">
          <TabsTrigger value="pickup">
            <Store className="size-4" aria-hidden="true" />
            Pickup
          </TabsTrigger>
          <TabsTrigger value="delivery">
            <Truck className="size-4" aria-hidden="true" />
            Delivery
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pickup" className="pt-5">
          {pickupPanel}
        </TabsContent>
        <TabsContent value="delivery" className="pt-5">
          {deliveryPanel}
        </TabsContent>
      </Tabs>
    </div>
  );
}
