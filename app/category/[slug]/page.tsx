import type { Metadata } from "next";

import { getBrand } from "../../pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "../../pdp/_lib/chrome";
import { PdpAuthProvider } from "../../pdp/_lib/auth";
import { CategoryLanding } from "./category-landing";

type SearchParams = { signedin?: string };
type Params = { slug: string };

/* Human title per known category slug (extend as more landings are built). */
const TITLES: Record<string, string> = {
  "air-conditioners": "Air Conditioners",
};

function titleFor(slug: string): string {
  return (
    TITLES[slug] ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${titleFor(slug)} | Homans Associates` };
}

export default async function CategoryLandingPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const { signedin } = await searchParams;
  const signedIn = signedin !== "0" && signedin !== "false";
  const brand = getBrand("homans")!;

  return (
    <PdpAuthProvider initialSignedIn={signedIn}>
      <div className="min-h-svh bg-background">
        <SiteHeader brand={brand} signedIn={signedIn} />
        <main>
          <CategoryLanding title={titleFor(slug)} />
        </main>
        <SiteFooter brand={brand} />
      </div>
    </PdpAuthProvider>
  );
}
