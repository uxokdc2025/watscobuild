import type { Metadata } from "next";
import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import CheckoutClient from "./_components/checkout-client";

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
  title: "Checkout | Watsco",
  description: "Review your order and complete checkout.",
};

// The unified checkout renders in any distributor's chrome — only the
// header/footer skin changes per brand; the flow underneath is identical.
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ case?: string; demo?: string; brand?: string }> }) {
  const params = await searchParams;
  const brand = getBrand(params.brand ?? "homans") ?? getBrand("homans");
  if (!brand) return null;

  const scenario = CHECKOUT_CASES.includes(params.case as CheckoutCase)
    ? (params.case as CheckoutCase)
    : undefined;

  return <>
    <SiteHeader brand={brand} signedIn />
    <CheckoutClient scenario={scenario} demo={params.demo === "1"} />
    <SiteFooter brand={brand} />
  </>;
}
