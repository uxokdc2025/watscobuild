import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrand } from "../pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "../pdp/_lib/chrome";
import { PdpAuthProvider } from "../pdp/_lib/auth";
import { SearchBody } from "./_lib/search-body";
import { MOCK_RESULTS, TOTAL_RESULT_COUNT } from "./_lib/mock-data";

type SearchParams = {
  q?: string;
  brand?: string;
  page_size?: string;
  signedin?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const title = q
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
    page_size: pageSizeParam,
    signedin,
  } = await searchParams;

  const brand = getBrand(brandKey);
  if (!brand) notFound();

  const pageSize = Math.max(1, Math.min(48, Number.parseInt(pageSizeParam ?? "24", 10) || 24));
  const signedIn = signedin !== "0" && signedin !== "false";

  // Slice the mock set to page_size so the grid respects the URL.
  const results = MOCK_RESULTS.slice(0, pageSize);

  const hiddenSearchFields = [{ name: "brand", value: brandKey }];
  const storeName = brandStoreName(brandKey);

  return (
    <PdpAuthProvider initialSignedIn={signedIn}>
      <div className="min-h-svh bg-background">
        <SiteHeader brand={brand} signedIn={signedIn} searchQuery={q} />
        <main>
          <SearchBody
            query={q}
            results={results}
            totalResults={TOTAL_RESULT_COUNT}
            pageSize={pageSize}
            signedIn={signedIn}
            hiddenSearchFields={hiddenSearchFields}
            storeName={storeName}
            brandKey={brandKey}
          />
        </main>
        <SiteFooter brand={brand} />
      </div>
    </PdpAuthProvider>
  );
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
    case "dcne":
      return "Boston, MA - DCNE";
    default:
      return "Your Branch";
  }
}
