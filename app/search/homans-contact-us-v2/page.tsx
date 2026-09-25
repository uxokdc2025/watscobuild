import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import { PdpAuthProvider } from "@/app/pdp/_lib/auth";
import { SearchBody } from "../_lib/search-body";
import { MOCK_RESULTS, type SearchResult } from "../_lib/mock-data";

export const metadata: Metadata = {
  title: 'Search Results for: "air handler" (Homans, richer) | Watsco',
};

// Homans v2 use case: out-of-stock → richer reference-style treatment.
// Same zero-availability Gree air handler as the minimal v1 page, plus two
// more flagged items — every flagged card shows an info icon +
// "Limited Availability" (friendly low-stock token, never red) with the
// muted "Let us help you find this product." subline instead of any stock
// line or "out of stock" wording. Price, Add, and Save stay as-is.
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
  contactVariant: "rich",
  href: "/pdp/homans-contact-us-v2?signedin=1",
};

const GREE_36K_RESULT: SearchResult = {
  id: "FXU36HP230V1R32AH",
  title:
    "Gree - Flexx Ultra R32 - 36K BTU/H - Air Handler - Multi Position - Indoor Unit - 230V",
  brand: "Gree",
  item: "FXU36HP230V1R32AH",
  mfg: "FXU36HP230V1R32AH",
  image: "/uc/fancoil-pf5mnx.avif",
  price: 0,
  contactForAvailability: true,
  contactVariant: "rich",
  href: "/pdp/homans-contact-us-v2?signedin=1",
};

const GREE_60K_RESULT: SearchResult = {
  id: "FXU60HP230V1R32AH",
  title:
    "Gree - Flexx Ultra R32 - 60K BTU/H - Air Handler - Multi Position - Indoor Unit - 230V",
  brand: "Gree",
  item: "FXU60HP230V1R32AH",
  mfg: "FXU60HP230V1R32AH",
  image: "/uc/fancoil-pf5mnx.avif",
  price: 0,
  contactForAvailability: true,
  contactVariant: "rich",
  href: "/pdp/homans-contact-us-v2?signedin=1",
};

const RESULTS: SearchResult[] = [
  GREE_RESULT,
  GREE_36K_RESULT,
  GREE_60K_RESULT,
  ...MOCK_RESULTS.slice(0, 3),
];

export default async function HomansContactUsV2PlpPage({
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
