import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import { PdpAuthProvider } from "@/app/pdp/_lib/auth";
import { SearchBody } from "../_lib/search-body";
import { MOCK_RESULTS, type SearchResult } from "../_lib/mock-data";

export const metadata: Metadata = {
  title: 'Search Results for: "air handler" (Homans) | Watsco',
};

// Homans use case: out-of-stock → Contact Us. Homans-branded PLP grid that
// includes the zero-availability Gree air handler (flagged
// contactForAvailability, $0.00 / EACH) alongside in-stock products — the
// flagged card shows a "Contact Us" link instead of any stock line.
const GREE_RESULT: SearchResult = {
  id: "FXU48HP230V1R32AH",
  title:
    "Gree - Flexx Ultra R32 - 48K BTU/H - Air Handler - Multi Position - Indoor Unit - 230V",
  brand: "Gree",
  item: "FXU48HP230V1R32AH",
  mfg: "FXU48HP230V1R32AH",
  image: "/uc/fancoil-pf5mnx.avif",
  price: 0,
  contactForAvailability: true,
  href: "/pdp/homans-contact-us?signedin=1",
};

const RESULTS: SearchResult[] = [GREE_RESULT, ...MOCK_RESULTS.slice(0, 3)];

export default async function HomansContactUsPlpPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; signedin?: string }>;
}) {
  const { q = "air handler", signedin } = await searchParams;
  const brand = getBrand("homans");
  if (!brand) notFound();
  const signedIn = signedin !== "0" && signedin !== "false";

  return (
    <PdpAuthProvider initialSignedIn={signedIn}>
      <div className="min-h-svh bg-background">
        <SiteHeader brand={brand} signedIn={signedIn} searchQuery={q} />
        <main>
          <SearchBody
            query={q}
            results={RESULTS}
            totalResults={RESULTS.length}
            pageSize={RESULTS.length}
            signedIn={signedIn}
            hiddenSearchFields={[{ name: "brand", value: "homans" }]}
            storeName="Manchester, NH - Homans"
            brandKey="homans"
          />
        </main>
        <SiteFooter brand={brand} />
      </div>
    </PdpAuthProvider>
  );
}
