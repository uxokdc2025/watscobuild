import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrand } from "../../pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "../../pdp/_lib/chrome";
import { PdpAuthProvider } from "../../pdp/_lib/auth";
import { BrandHome, HOME_CONTENT } from "../_lib/brand-home";

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
  const content = HOME_CONTENT[brand];
  if (!chrome || !content) notFound();
  const signedIn = signedin !== "0" && signedin !== "false";

  return (
    <PdpAuthProvider initialSignedIn={signedIn}>
      <div className="min-h-svh bg-background">
        <SiteHeader brand={chrome} signedIn={signedIn} />
        <main>
          <BrandHome content={content} />
        </main>
        <SiteFooter brand={chrome} />
      </div>
    </PdpAuthProvider>
  );
}
