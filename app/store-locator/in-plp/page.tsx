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
  DirectionBDrawer,
  DirectionCDrawer,
} from "../_drawers";

export const metadata: Metadata = {
  title: "Store Locator — Drawer over PLP",
  description: "Preview a drawer variant overlaid on the Homans search PLP.",
};

type SearchParams = { v?: string };

const VARIANT_TITLE: Record<string, string> = {
  b: "Direction 1 — Divider list, inline commit",
  c: "Direction 2 — Product-aware inventory drawer",
};

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
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute inset-y-0 left-0 flex">
            <VariantDrawer v={variant} />
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-3 rounded-lg bg-background/95 px-3 py-2 shadow-lg">
            <Link
              href="/store-locator"
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
