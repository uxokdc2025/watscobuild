import type { Metadata } from "next";

import { product } from "./_data";
import { PdpGallery } from "./_components/gallery";
import { PdpSummary } from "./_components/summary";
import { PdpDetails } from "./_components/details";
import { FrequentlyBoughtTogether } from "./_components/frequently-bought-together";

export const metadata: Metadata = {
  title: `${product.item} — PDP v2`,
  description: "Watsco B2B product-detail template (v2).",
};

/** Thin stand-in for the per-brand legacy chrome we don't own. */
function LegacyShell({ label }: { label: string }) {
  return (
    <div className="border-y border-dashed bg-muted/40 py-3 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {label}
    </div>
  );
}

export default function PdpPage() {
  return (
    <div className="min-h-svh bg-background">
      <LegacyShell label="Legacy header · per-brand · unchanged (buttons restyled)" />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* Breadcrumb (plain semantic markup — keeps this a Server Component) */}
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex items-center gap-1.5">
            <li>
              <a
                href="#"
                className="rounded-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Home
              </a>
            </li>
            <li aria-hidden className="text-muted-foreground/50">
              /
            </li>
            <li aria-current="page" className="line-clamp-1 text-foreground">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Gallery (third-party, boxed) + summary */}
        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <PdpGallery thumbnailCount={product.thumbnailCount} />
          <PdpSummary />
        </div>

        {/* Frequently bought together */}
        <div className="mt-14">
          <FrequentlyBoughtTogether />
        </div>

        {/* Description / specs */}
        <div className="mt-14">
          <PdpDetails />
        </div>
      </main>

      <LegacyShell label="Legacy footer · per-brand · unchanged (buttons restyled)" />
    </div>
  );
}
