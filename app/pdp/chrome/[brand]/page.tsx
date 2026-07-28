import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BRANDS, getBrand } from "../../_lib/brands";
import { SiteFooter, SiteHeader } from "../../_lib/chrome";

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
  return { title: b ? `${b.name} — chrome preview` : "Brand not found" };
}

export default async function ChromePreviewPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) notFound();

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader brand={b} />

      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-xl border-2 border-dashed bg-muted/30 p-10 text-center md:p-16">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {b.name} — current header &amp; footer
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-balance">
            The shared PDP content template renders here
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Gallery, summary, badges, and spec tabs sit inside {b.name}&apos;s own
            chrome — we only own the content between the header and footer.
          </p>
        </div>
      </main>

      <SiteFooter brand={b} />
    </div>
  );
}
