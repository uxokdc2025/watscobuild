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
  InventoryDirection1,
  InventoryDirection2,
  InventoryDirection3,
  InventoryStoreLocatorDrawer,
  InventoryCloseX,
} from "../../_inventory-drawers";
import { DrawerOverlay } from "../../_drawer-overlay";
import { DrawerPanel } from "@/components/ui/drawer";

export const metadata: Metadata = {
  title: "Inventory Drawer — over PLP",
  description: "Preview an inventory drawer variant overlaid on the Homans PLP.",
};

type SearchParams = { v?: string };

function VariantDrawer({ v }: { v: string }) {
  if (v === "1") return <InventoryDirection1 />;
  if (v === "2") return <InventoryDirection2 />;
  if (v === "c") return <InventoryStoreLocatorDrawer />;
  return <InventoryDirection3 />;
}

export default async function InventoryInPlpPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { v = "c" } = await searchParams;
  const variant = ["1", "2", "3", "c"].includes(v) ? v : "c";
  const brand = getBrand("homans");
  if (!brand) notFound();

  const results = MOCK_RESULTS.slice(0, 24);

  return (
    <PdpAuthProvider initialSignedIn>
      <div className="relative min-h-svh bg-background">
        {/* PLP background — non-interactive under the scrim. */}
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

        {/* Scrim + right-side drawer */}
        <DrawerOverlay>
          <DrawerPanel open side="right" className="absolute inset-y-0 right-0 flex">
            {/* Variants without their own header X get the floating scrim close
                control; the store-locator drawer ("c") has its own header X. */}
            {variant !== "c" ? (
              <div className="absolute top-4 -left-2">
                <InventoryCloseX />
              </div>
            ) : null}
            <VariantDrawer v={variant} />
          </DrawerPanel>
        </DrawerOverlay>
      </div>
    </PdpAuthProvider>
  );
}
