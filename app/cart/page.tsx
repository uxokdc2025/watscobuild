import type { Metadata } from "next";
import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import CartClient from "./_cart-client";

export const metadata: Metadata = {
  title: "Cart | Watsco",
  description: "Review your items before checkout.",
};

// The unified cart precedes checkout. Brand-aware via ?brand=<key> (default
// homans) — the same pattern as the checkout page: only the header/footer skin
// changes per brand; the cart underneath is identical.
export default async function CartPage({ searchParams }: { searchParams: Promise<{ brand?: string }> }) {
  const params = await searchParams;
  const brand = getBrand(params.brand ?? "homans") ?? getBrand("homans");
  if (!brand) return null;

  return <>
    <SiteHeader brand={brand} signedIn />
    <CartClient brandKey={brand.key} />
    <SiteFooter brand={brand} />
  </>;
}
