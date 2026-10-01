import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "@/app/pdp/_lib/chrome";
import { getBrand } from "@/app/pdp/_lib/brands";
import { getSystem, SYSTEMS } from "../_lib/data";
import { AhriSystemDetail } from "./detail-client";

export function generateStaticParams() {
  return SYSTEMS.map((s) => ({ ahri: s.ahriNumber }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ahri: string }>;
}): Promise<Metadata> {
  const { ahri } = await params;
  const system = getSystem(ahri);
  return { title: system ? `AHRI #${system.ahriNumber} — ${system.headline}` : "AHRI System" };
}

export default async function AhriSystemPage({
  params,
}: {
  params: Promise<{ ahri: string }>;
}) {
  const { ahri } = await params;
  const system = getSystem(ahri);
  if (!system) notFound();

  const brand = getBrand("ecmdi")!;
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader brand={brand} signedIn />
      <main>
        <AhriSystemDetail system={system} />
      </main>
      <SiteFooter brand={brand} />
    </div>
  );
}
