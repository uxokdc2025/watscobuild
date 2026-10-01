import type { Metadata } from "next";
import { getBrand } from "@/app/pdp/_lib/brands";
import { CheckoutFooter, CheckoutHeader } from "@/app/pdp/_lib/chrome";
import ReviewPageClient from "./review-page-client";

const CHECKOUT_CASES = [
  "account-job-context",
  "delivery-pickup-routing",
  "availability-date-constraints",
  "terms-or-credit-card",
  "review-coupon-special-handling",
  "order-confirmation",
] as const;
export type CheckoutCase = (typeof CHECKOUT_CASES)[number];

export const metadata: Metadata = {
  title: "Review | Checkout v3 | Watsco",
  description: "Review your order and complete checkout.",
};

// Standalone review page for the v3 "everything open" checkout — reuses the v1
// review layout (ReviewStep + Order Summary) without the step progress bar.
export default async function CheckoutV3ReviewPage({ searchParams }: { searchParams: Promise<{ case?: string; demo?: string; brand?: string; account?: string }> }) {
  const params = await searchParams;
  const brand = getBrand(params.brand ?? "homans") ?? getBrand("homans");
  if (!brand) return null;

  const scenario = CHECKOUT_CASES.includes(params.case as CheckoutCase)
    ? (params.case as CheckoutCase)
    : undefined;

  return <>
    <CheckoutHeader brand={brand} />
    <ReviewPageClient scenario={scenario} demo={params.demo === "1"} brandKey={brand.key} initialAccountId={params.account} />
    <CheckoutFooter brand={brand} />
  </>;
}
