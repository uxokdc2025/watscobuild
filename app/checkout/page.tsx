import type { Metadata } from "next";
import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import CheckoutClient from "./_components/checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Homans Associates",
  description: "Review your order and complete checkout.",
};

export default function CheckoutPage() {
  const brand = getBrand("homans");
  if (!brand) return null;

  return <>
    <SiteHeader brand={brand} signedIn />
    <CheckoutClient />
    <SiteFooter brand={brand} />
  </>;
}
