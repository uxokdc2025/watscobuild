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
  title: "Checkout | Homans Associates",
  description: "Review your order and complete checkout.",
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ case?: string; demo?: string }> }) {
  const brand = getBrand("homans");
  if (!brand) return null;

  const params = await searchParams;
  const scenario = CHECKOUT_CASES.includes(params.case as CheckoutCase)
    ? (params.case as CheckoutCase)
    : undefined;

  return <>
    <SiteHeader brand={brand} signedIn />
    <CheckoutClient scenario={scenario} demo={params.demo === "1"} />
    <SiteFooter brand={brand} />
  </>;
}
