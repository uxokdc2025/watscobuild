import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import { getBrand } from "@/app/pdp/_lib/brands";
import { AhriBuilder } from "./_lib/builder-client";

export const metadata: Metadata = {
  title: "AHRI System Builder",
};

export default function AhriBuilderPage() {
  const brand = getBrand("ecmdi")!;
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader brand={brand} signedIn />
      <main>
        <AhriBuilder />
      </main>
      <SiteFooter brand={brand} />
    </div>
  );
}
