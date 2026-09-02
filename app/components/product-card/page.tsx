import type { Metadata } from "next";

import { ProductCardsSection } from "../_sections/product-cards";

export const metadata: Metadata = {
  title: "Product Card — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <ProductCardsSection />
    </main>
  );
}
