import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { BRANDS, getBrand } from "../../../pdp/_lib/brands";
import { SiteHeader, SiteFooter } from "../../../pdp/_lib/chrome";

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
  return { title: `${b?.name ?? "Header"} — Watsco DS` };
}

export default async function BrandHeaderPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) notFound();

  return (
    <div className="min-h-svh bg-background">
      <div className="border-b bg-muted/30 px-4 py-2 md:px-8">
        <Link
          href="/components/headers"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ChevronLeft className="size-4" />
          All headers
        </Link>
      </div>

      <SiteHeader brand={b} signedIn />

      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Header &amp; footer preview
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{b.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The unified chrome themed for {b.name}. Store selector sits on the left; the same layout
          renders for every brand — only color and logo change.
        </p>
      </div>

      <SiteFooter brand={b} />
    </div>
  );
}
