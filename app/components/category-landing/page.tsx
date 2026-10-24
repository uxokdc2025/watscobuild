import type { Metadata } from "next";

import CategoryLandingReference from "./category-landing-reference";

export const metadata: Metadata = {
  title: "Category Landing — Watsco DS",
  description:
    "Plug-and-play CMS content blocks for category landing / 'jump' pages: banners, category tiles, promo tiles, brand grid, side-by-side ad, content cards, and product rails. Prop-driven, built on the design system.",
};

// Server Component (exports metadata); the live catalog lives in the client child.
export default function CategoryLandingComponentsPage() {
  return <CategoryLandingReference />;
}
