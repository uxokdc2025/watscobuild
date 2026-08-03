import { cn } from "@/lib/utils";
import { PdpGallery } from "../_components/gallery";
import { PdpAuthProvider } from "./auth";
import { PdpSummary } from "./summary";
import { PdpDetails } from "./details";
import { CustomersAlsoPurchased, FrequentlyBoughtTogether } from "./fbt";
import { AboutThisProduct, BundleComponents, RecentlyViewed, Replacements, Substitutes } from "./about";
import { SiteFooter, SiteHeader } from "./chrome";
import { getBrand } from "./brands";
import type { PdpProduct } from "./types";

/** Per-brand page canvas (some sites use a light-grey background, not white). */
// All PDP pages use a white canvas across every brand.
const PAGE_BG: Record<string, string> = {
};

/** Fallback when a product has no mapped brand chrome. */
function LegacyShell({ label }: { label: string }) {
  return (
    <div className="border-y border-dashed bg-muted/40 py-3 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {label}
    </div>
  );
}

export function Pdp({
  product,
  signedIn = false,
}: {
  product: PdpProduct;
  signedIn?: boolean;
}) {
  const brand = product.brandKey ? getBrand(product.brandKey) : undefined;

  // Price/inventory is logged-in only — never serialize commerce to a
  // signed-out client (not just hidden in the UI).
  const summaryProduct = signedIn
    ? product
    : { ...product, commerce: undefined };

  return (
    <PdpAuthProvider initialSignedIn={signedIn}>
      <div
        className={cn(
          "min-h-svh",
          (brand && PAGE_BG[brand.key]) || "bg-background"
        )}
      >
        {brand ? (
          <SiteHeader brand={brand} signedIn={signedIn} />
        ) : (
          <LegacyShell label={`Legacy header · ${product.brand}`} />
        )}

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          {/* Breadcrumb (store/location lives in the site header) */}
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
            <PdpGallery
              thumbnailCount={product.thumbnailCount}
              images={product.images}
              alt={product.title}
              noImage={product.noImage}
            />
            <div className="flex flex-col gap-6">
              <PdpSummary
                product={summaryProduct}
                showCompare={brand?.hasCompare ?? false}
              />
              {/* New pattern: bundles + recommendations all sit under the buy
                  box, in the summary column. */}
              {product.replacements?.length ? (
                <Replacements product={product} />
              ) : null}
              {product.bundleItems?.length ? (
                <BundleComponents product={product} />
              ) : null}
              {product.substitutes?.length ? (
                <Substitutes product={product} />
              ) : null}
            </div>
          </div>

          {/* Frequently bought together (only if present) */}
          {product.fbt?.length ? (
            <div className="mt-14">
              <FrequentlyBoughtTogether product={product} />
            </div>
          ) : null}

          {product.detailsStyle === "about" ? (
            <>
              {/* Carrier "About This Product" + Recently Viewed */}
              <div className="mt-14">
                <AboutThisProduct product={product} />
              </div>
              {product.recentlyViewed?.length ? (
                <div className="mt-14">
                  <RecentlyViewed product={product} />
                </div>
              ) : null}
            </>
          ) : (
            /* Description / Part Lists / Equipment Spec / Documentation tabs */
            <div className="mt-14">
              <PdpDetails product={product} />
            </div>
          )}

          {/* Customers also purchased */}
          {product.customersAlsoPurchased?.length ? (
            <div className="mt-14">
              <CustomersAlsoPurchased product={product} />
            </div>
          ) : null}
        </main>

        {brand ? (
          <SiteFooter brand={brand} />
        ) : (
          <LegacyShell label={`Legacy footer · ${product.brand}`} />
        )}
      </div>
    </PdpAuthProvider>
  );
}
