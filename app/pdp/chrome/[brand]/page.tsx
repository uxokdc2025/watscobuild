import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BRANDS, getBrand } from "../../_lib/brands";
import { SiteFooter, SiteHeader } from "../../_lib/chrome";
import { Pdp } from "../../_lib/pdp";
import { pdps } from "../../_lib/registry";

export function generateStaticParams() {
  return Object.keys(BRANDS).map((brand) => ({ brand }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const b = getBrand(brand);
  return { title: b ? `${b.name} — PDP` : "Brand not found" };
}

export default async function BrandPdpPage({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ signedin?: string }>;
}) {
  const { brand } = await params;
  const { signedin } = await searchParams;
  const b = getBrand(brand);
  if (!b) notFound();

  // Combined view: the real PDP content template inside this brand's chrome.
  const product = pdps.find((p) => p.brandKey === brand);
  if (product) {
    return (
      <Pdp product={product} signedIn={signedin !== "0" && signedin !== "false"} />
    );
  }

  // No product wired yet (e.g. DCNE) — show the chrome with a note.
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader brand={b} />
      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-xl border-2 border-dashed bg-muted/30 p-10 text-center md:p-16">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {b.name}
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-balance">
            Product content pending
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            The shared PDP content template renders here inside {b.name}&apos;s
            chrome once a product + signed-in data is added.
          </p>
        </div>
      </main>
      <SiteFooter brand={b} />
    </div>
  );
}
