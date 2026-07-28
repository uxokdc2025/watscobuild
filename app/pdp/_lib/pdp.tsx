import { MapPin } from "lucide-react";

import { PdpGallery } from "../_components/gallery";
import { PdpAuthProvider } from "./auth";
import { PdpSummary } from "./summary";
import { PdpDetails } from "./details";
import { FrequentlyBoughtTogether } from "./fbt";
import { SiteFooter, SiteHeader } from "./chrome";
import { getBrand } from "./brands";
import type { PdpProduct } from "./types";

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
      <div className="min-h-svh bg-background">
        {brand ? (
          <SiteHeader brand={brand} />
        ) : (
          <LegacyShell label={`Legacy header · ${product.brand}`} />
        )}

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          {/* Store */}
          {product.store ? (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span className="font-medium text-foreground">
                {product.store.name}
              </span>
              {product.store.hours ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{product.store.hours}</span>
                </>
              ) : null}
            </div>
          ) : null}

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mt-3 text-sm">
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
            />
            <PdpSummary product={summaryProduct} />
          </div>

          {/* Frequently bought together (only if present) */}
          {product.fbt?.length ? (
            <div className="mt-14">
              <FrequentlyBoughtTogether product={product} />
            </div>
          ) : null}

          {/* Description / specs / extra tabs */}
          <div className="mt-14">
            <PdpDetails product={product} />
          </div>
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
