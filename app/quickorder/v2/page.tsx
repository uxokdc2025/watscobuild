import type { Metadata } from "next";

import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import { QuickOrderClient } from "../quick-order-client";

export const metadata: Metadata = {
  title: "Quick Order V2 | Watsco",
  description:
    "Quick Order V2 — Select Product opens the right-side drawer, the same panel as the shopping-list Replacements.",
};

// V2 is the same Quick Order in the same brand chrome as V1 (default Homans);
// only the review interaction differs — "Select Product" opens the right-side
// drawer instead of expanding the match list inline.
export default async function QuickOrderV2Page({
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
      <QuickOrderClient version={2} brand={params.brand} />
      <SiteFooter brand={brand} />
    </>
  );
}
