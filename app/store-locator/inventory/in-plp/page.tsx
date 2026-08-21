import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

export const metadata: Metadata = {
  title: "Inventory Drawer — over PLP",
  description: "Preview an inventory drawer variant overlaid on the Homans PLP.",
};

type SearchParams = { v?: string };

const VARIANT_TITLE: Record<string, string> = {
  "1": "Direction 1 — Reference literal (East Coast)",
  "2": "Direction 2 — Tabbed, per-row commit",
  "3": "Direction 3 — Dense picker",
  c: "Direction C — Store locator inventory",
};

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
  const { v = "1" } = await searchParams;
  const variant = ["1", "2", "3", "c"].includes(v) ? v : "1";
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
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute inset-y-0 right-0 flex">
            {/* Close X floats on the scrim, LEFT of the drawer edge. */}
            <div className="absolute top-4 -left-14">
              <InventoryCloseX />
            </div>
            <VariantDrawer v={variant} />
          </div>
          <div className="absolute top-4 left-4 flex items-center gap-3 rounded-lg bg-background/95 px-3 py-2 shadow-lg">
            <Link
              href="/store-locator/inventory"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to gallery
            </Link>
            <span className="text-xs text-muted-foreground">
              {VARIANT_TITLE[variant]}
            </span>
          </div>
        </div>
      </div>
    </PdpAuthProvider>
  );
}
