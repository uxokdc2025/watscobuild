import type { Metadata } from "next";

import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import { QuickOrderClient } from "./quick-order-client";

export const metadata: Metadata = {
  title: "Quick Order | Watsco",
  description: "Add many items at once by item number — search, multiple search, or upload.",
};

// Quick Order renders inside a brand's chrome (default Homans), like the cart.
export default async function QuickOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const params = await searchParams;
  const brand = getBrand(params.brand ?? "homans") ?? getBrand("homans");
  if (!brand) return null;

  return (
    <>
      <SiteHeader brand={brand} signedIn />
      <QuickOrderClient />
      <SiteFooter brand={brand} />
    </>
  );
}
