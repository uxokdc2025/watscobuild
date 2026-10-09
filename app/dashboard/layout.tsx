import type { Metadata } from "next";

import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";

const brand = getBrand("homans");

// Client dashboard pages can't export metadata, so the section title lives
// here (overrides the root default so pages never read "Create Next App").
export const metadata: Metadata = {
  title: {
    default: "My Account — Homans Associates",
    template: "%s — Homans Associates",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!brand) return children;
  return (
    <>
      <SiteHeader brand={brand} signedIn />
      {children}
      <SiteFooter brand={brand} />
    </>
  );
}
