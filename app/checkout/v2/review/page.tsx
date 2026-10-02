import type { Metadata } from "next";
import { getBrand } from "@/app/pdp/_lib/brands";
import { CheckoutFooter, CheckoutHeader } from "@/app/pdp/_lib/chrome";
import ReviewPageClient from "../../v3/review/review-page-client";

const CHECKOUT_CASES = [
  "account-job-context",
  "delivery-pickup-routing",
  "availability-date-constraints",
  "terms-or-credit-card",
  "review-coupon-special-handling",
  "order-confirmation",
] as const;
type CheckoutCase = (typeof CHECKOUT_CASES)[number];

export const metadata: Metadata = {
  title: "Review | Checkout v2 | Watsco",
  description: "Review your order and complete checkout.",
};

// Standalone review page for the v2 (accordion) checkout — after Payment the
// flow advances to this page, just like v3. Reuses the shared ReviewStep +
// Order Summary via ReviewPageClient.
export default async function CheckoutV2ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ case?: string; demo?: string; brand?: string; account?: string }>;
}) {
  const params = await searchParams;
  const brand = getBrand(params.brand ?? "homans") ?? getBrand("homans");
  if (!brand) return null;

  const scenario = CHECKOUT_CASES.includes(params.case as CheckoutCase)
    ? (params.case as CheckoutCase)
    : undefined;

  return (
    <>
      <CheckoutHeader brand={brand} />
      <ReviewPageClient
        scenario={scenario}
        demo={params.demo === "1"}
        brandKey={brand.key}
        initialAccountId={params.account}
        basePath="/checkout/v2"
      />
      <CheckoutFooter brand={brand} />
    </>
  );
}
