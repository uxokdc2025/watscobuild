import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrand } from "../pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "../pdp/_lib/chrome";
import { PdpAuthProvider } from "../pdp/_lib/auth";
import { SearchBody, type FilterLayout } from "./_lib/search-body";
import { MOCK_RESULTS, TOTAL_RESULT_COUNT } from "./_lib/mock-data";
import { CATEGORY_RESULTS } from "./_lib/category-data";
import { taxonomyLabel } from "@/components/ui/mega-taxonomy";

type SearchParams = {
  q?: string;
  brand?: string;
  category?: string;
  page_size?: string;
  signedin?: string;
  /** "top" adds the pinned horizontal filter bar above the grid. */
  filters?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { q = "", category } = await searchParams;
  const categoryLabel = category ? taxonomyLabel(category) : null;
  const title = categoryLabel
    ? `${categoryLabel} | Homans Associates`
    : q
      ? `Search Results for: "${q}" | Watsco`
      : "Search | Watsco";
  return { title };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const {
    q = "",
    brand: brandKey = "homans",
    category,
    page_size: pageSizeParam,
    signedin,
    filters,
  } = await searchParams;

  const brand = getBrand(brandKey);
  if (!brand) notFound();

  const filterLayout: FilterLayout = filters === "top" ? "top" : "sidebar";

  const categoryLabel = category ? taxonomyLabel(category) ?? undefined : undefined;

  const pageSize = Math.max(1, Math.min(48, Number.parseInt(pageSizeParam ?? "24", 10) || 24));
  const signedIn = signedin !== "0" && signedin !== "false";

  // Category pages show their real product set; search shows the mock set.
  const categoryResults = category ? CATEGORY_RESULTS[category] : undefined;
  const sourceResults = categoryResults ?? MOCK_RESULTS;
  const results = sourceResults.slice(0, pageSize);
  const totalResults = categoryResults ? categoryResults.length : TOTAL_RESULT_COUNT;

  const hiddenSearchFields = [{ name: "brand", value: brandKey }];
  const storeName = brandStoreName(brandKey);

  // Links for the Sidebar / Top bar version switch — same page, same query,
  // only the filter layout changes, so the two can be compared side by side.
  const filterLayoutLinks = {
    sidebar: searchHref({ q, brandKey, category, pageSizeParam, signedIn }),
    top: searchHref({ q, brandKey, category, pageSizeParam, signedIn, filters: "top" }),
  };

  return (
    <PdpAuthProvider initialSignedIn={signedIn}>
      <div className="min-h-svh bg-background">
        <SiteHeader brand={brand} signedIn={signedIn} searchQuery={q} />
        <main>
          <SearchBody
            query={q}
            category={categoryLabel}
            results={results}
            totalResults={totalResults}
            pageSize={pageSize}
            signedIn={signedIn}
            hiddenSearchFields={hiddenSearchFields}
            storeName={storeName}
            brandKey={brandKey}
            filterLayout={filterLayout}
            filterLayoutLinks={filterLayoutLinks}
          />
        </main>
        <SiteFooter brand={brand} />
      </div>
    </PdpAuthProvider>
  );
}

function searchHref({
  q,
  brandKey,
  category,
  pageSizeParam,
  signedIn,
  filters,
}: {
  q: string;
  brandKey: string;
  category?: string;
  pageSizeParam?: string;
  signedIn: boolean;
  filters?: string;
}): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("brand", brandKey);
  if (category) params.set("category", category);
  if (pageSizeParam) params.set("page_size", pageSizeParam);
  params.set("signedin", signedIn ? "1" : "0");
  if (filters) params.set("filters", filters);
  return `/search?${params.toString()}`;
}

function brandStoreName(brandKey: string): string {
  switch (brandKey) {
    case "homans":
      return "Manchester, NH - Homans";
    case "peirce":
      return "Norristown, PA - Peirce-Phelps";
    case "gemaire":
      return "Miami, FL - Gemaire";
    case "baker":
      return "Jacksonville, FL - Baker";
    case "carrier":
      return "Charlotte, NC - Carrier Enterprise";
    case "ecmdi":
      return "Durham, NC - ECMDI";
    default:
      return "Your Branch";
  }
}
