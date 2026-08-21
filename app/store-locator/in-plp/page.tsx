import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrand } from "@/app/pdp/_lib/brands";
import { SiteHeader, SiteFooter } from "@/app/pdp/_lib/chrome";
import { PdpAuthProvider } from "@/app/pdp/_lib/auth";
import { SearchBody } from "@/app/search/_lib/search-body";
import {
  MOCK_RESULTS,
  TOTAL_RESULT_COUNT,
} from "@/app/search/_lib/mock-data";

import {
  DirectionBDrawer,
  DirectionCDrawer,
} from "../_drawers";
import { DrawerOverlay } from "../_drawer-overlay";

export const metadata: Metadata = {
  title: "Store Locator — Drawer over PLP",
  description: "Preview a drawer variant overlaid on the Homans search PLP.",
};

type SearchParams = { v?: string };

function VariantDrawer({ v }: { v: string }) {
  if (v === "b") return <DirectionBDrawer />;
  return <DirectionCDrawer />;
}

export default async function StoreLocatorInPlpPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { v = "c" } = await searchParams;
  const variant = v === "b" || v === "c" ? v : "c";
  const brand = getBrand("homans");
  if (!brand) notFound();

  const results = MOCK_RESULTS.slice(0, 24);

  return (
    <PdpAuthProvider initialSignedIn>
      <div className="relative min-h-svh bg-background">
        {/* PLP background — Homans search results, signed-in state. Kept
            non-interactive under the scrim so the drawer is the focus. */}
        <div aria-hidden className="pointer-events-none opacity-95">
          <SiteHeader brand={brand} signedIn searchQuery="blower motor" />
          <main>
            <SearchBody
              query="blower motor"
              results={results}
              totalResults={TOTAL_RESULT_COUNT}
              pageSize={24}
              signedIn
              hiddenSearchFields={[{ name: "brand", value: "homans" }]}
              storeName="Manchester, NH - Homans"
              brandKey="homans"
            />
          </main>
          <SiteFooter brand={brand} />
        </div>

        {/* Scrim covers the viewport; drawer pins left, full viewport height. */}
        <DrawerOverlay>
          <div className="drawer-panel-left-enter absolute inset-y-0 left-0 flex">
            <VariantDrawer v={variant} />
          </div>
        </DrawerOverlay>
      </div>
    </PdpAuthProvider>
  );
}
