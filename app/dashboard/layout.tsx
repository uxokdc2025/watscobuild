import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";

const brand = getBrand("homans");

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
