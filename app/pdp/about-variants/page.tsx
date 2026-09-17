import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPdp } from "../_lib/registry";
import { ShowcaseShell } from "../_lib/showcase";
import { AboutVariants } from "./about-variants";

export const metadata: Metadata = {
  title: "About This Product — Tab styles",
  description:
    "Four blue-active tab styles for About This Product, rendered with real product content for client review.",
};

export default function AboutVariantsPage() {
  const product = getPdp("uc-tabs-accordions");
  if (!product) notFound();
  return (
    <ShowcaseShell
      eyebrow="Client review"
      heading="About This Product — Tab style options (client review)"
      intro="Four tab styles over the real About content (Description, Specifications, Documents, Part List) with blue as the active color."
    >
      <AboutVariants product={product} />
    </ShowcaseShell>
  );
}
