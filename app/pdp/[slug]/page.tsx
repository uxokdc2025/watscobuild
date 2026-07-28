import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Pdp } from "../_lib/pdp";
import { getPdp, getPdpSlugs } from "../_lib/registry";

export function generateStaticParams() {
  return getPdpSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getPdp(slug);
  if (!product) return { title: "PDP not found" };
  return { title: `${product.item} — ${product.brand}`, description: product.title };
}

export default async function PdpSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getPdp(slug);
  if (!product) notFound();
  return <Pdp product={product} />;
}
