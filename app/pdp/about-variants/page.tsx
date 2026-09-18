import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { getPdp } from "../_lib/registry";
import { getBrand } from "../_lib/brands";
import { SiteFooter, SiteHeader } from "../_lib/chrome";
import { AboutVariants } from "./about-variants";

export const metadata: Metadata = {
  title: "About This Product — Tab styles",
  description:
    "Four blue-active tab styles for About This Product, rendered with real product content for client review.",
};

export default function AboutVariantsPage() {
  const product = getPdp("uc-tabs-accordions");
  if (!product) notFound();
  const brand = getBrand(product.brandKey ?? "carrier");
  if (!brand) notFound();
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader brand={brand} />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Link
          href="/pdp"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          PDP Master
        </Link>

        <div className="mt-4">
          <span className="text-xs font-bold tracking-wide text-primary uppercase">
            Client review
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            About This Product — Tab style options (client review)
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Four tab styles over the real About content (Description,
            Specifications, Documents, Part List) with blue as the active
            color.
          </p>
        </div>

        <div className="mt-14">
          <AboutVariants product={product} />
        </div>
      </main>
      <SiteFooter brand={brand} />
    </div>
  );
}
