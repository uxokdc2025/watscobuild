import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CATEGORY_RESULTS } from "../../search/_lib/category-data";
import { getBrand } from "../../pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "../../pdp/_lib/chrome";
import { PdpAuthProvider } from "../../pdp/_lib/auth";
import { CategoryLanding, CategoryLandingV2 } from "./category-landing";
import { CategoryJump } from "./category-jump";

type SearchParams = { signedin?: string; v?: string; view?: string; rev?: string };
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
  const { signedin, v, view, rev } = await searchParams;
  const signedIn = signedin !== "0" && signedin !== "false";

  // Nov 17 (item 6b): this category's revised PLP — the grouped list table
  // whose rows open the design-system list card — lives on the shared results
  // page, so `?rev=nov17` hands off to it rather than growing a second
  // results view here. Only categories with a real product set redirect;
  // without `rev` this page is untouched, so every Nov 10 link still opens
  // the landing page exactly as reviewed.
  if (rev === "nov17" && CATEGORY_RESULTS[slug]) {
    const query = new URLSearchParams({
      brand: "homans",
      category: slug,
      signedin: signedIn ? "1" : "0",
      rev: "nov17",
      view: view === "grid" ? "grid" : "list",
    });
    redirect(`/search?${query.toString()}`);
  }

  const brand = getBrand("homans")!;

  return (
    <PdpAuthProvider initialSignedIn={signedIn}>
      <div className="min-h-svh bg-background">
        <SiteHeader brand={brand} signedIn={signedIn} />
        <main>
          {v === "jump" ? (
            <CategoryJump title={titleFor(slug)} />
          ) : v === "2" ? (
            <CategoryLandingV2 title={titleFor(slug)} />
          ) : (
            <CategoryLanding title={titleFor(slug)} />
          )}
        </main>
        <SiteFooter brand={brand} />
      </div>
    </PdpAuthProvider>
  );
}
