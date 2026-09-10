import type { ComponentType } from "react";
import { Bike, Container, Package, Store, Truck } from "lucide-react";

/* ───────────────────────── Fulfillment method model ─────────────────────────
 * Leaf module: the method vocabulary + per-method metadata/rates. Kept free of
 * any component/panel import so both the brand config (`brand-checkout.ts`) and
 * the fulfillment UI can depend on it without a cycle. Pickup vs Delivery is the
 * primary fork in the UI (a segmented tab); these are the concrete methods that
 * fill each side. WHICH appear per brand comes from the brand config. */

export type FulfillmentMethod = "pickup" | "truck" | "freight" | "ups" | "local" | "delivery";

const DELIVERY_METHODS: FulfillmentMethod[] = ["truck", "freight", "ups", "local", "delivery"];
export function isDeliveryMethod(m: FulfillmentMethod): boolean {
  return DELIVERY_METHODS.includes(m);
}

export type MethodMeta = {
  id: FulfillmentMethod;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

export const METHOD_META: Record<FulfillmentMethod, MethodMeta> = {
  pickup: { id: "pickup", label: "Pickup", Icon: Store },
  truck: { id: "truck", label: "Truck", Icon: Truck },
  freight: { id: "freight", label: "Freight / LTL", Icon: Container },
  ups: { id: "ups", label: "UPS", Icon: Package },
  local: { id: "local", label: "Local Delivery", Icon: Bike },
  delivery: { id: "delivery", label: "Delivery", Icon: Truck },
};

/** Per-method rate (used in the delivery-method line AND lifted into the order
 *  summary so the total reflects the chosen method). */
export const METHOD_RATE: Record<FulfillmentMethod, number> = {
  pickup: 0,
  truck: 0,
  freight: 89.5,
  ups: 41.8,
  local: 25,
  delivery: 0,
};

export const METHOD_RATE_LABEL: Record<FulfillmentMethod, string> = {
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
