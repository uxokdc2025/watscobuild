import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrand } from "../../pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "../../pdp/_lib/chrome";
import { PdpAuthProvider } from "../../pdp/_lib/auth";
import { BrandHome } from "../_lib/brand-home";

// Plain, server-safe list of brands that have a reskinned home (the content
// configs live in a client module, so they can't be read here directly).
const HOME_BRANDS = new Set(["peirce", "ecmdi"]);

type Params = { brand: string };
type SearchParams = { signedin?: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { brand } = await params;
  const b = getBrand(brand);
  return { title: b ? `${b.name} — Home (reskin)` : "Home" };
}

/**
 * Reskinned distributor home page. `/home/peirce` and `/home/ecmdi` take each
 * site's content and re-render it on our design system (Category Landing CMS
 * blocks) inside that brand's chrome — so both read as one system.
 */
export default async function BrandHomePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { brand } = await params;
  const { signedin } = await searchParams;
  const chrome = getBrand(brand);
  if (!chrome || !HOME_BRANDS.has(brand)) notFound();
  const signedIn = signedin !== "0" && signedin !== "false";

  return (
    <PdpAuthProvider initialSignedIn={signedIn}>
      <div className="min-h-svh bg-background">
        <SiteHeader brand={chrome} signedIn={signedIn} />
        <main>
          <BrandHome brandKey={brand} />
        </main>
        <SiteFooter brand={chrome} />
      </div>
    </PdpAuthProvider>
  );
}
