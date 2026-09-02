import type { Metadata } from "next";

import ProductCardReference from "./product-card-reference";

export const metadata: Metadata = {
  title: "Product Card — Watsco DS",
  description:
    "The canonical merchandising card: one component for the PLP grid, Frequently Bought Together, and Customers Also Purchased. Anatomy, states, and the exact code to paste.",
};

// Server Component so it can export metadata; all live rendering (which pulls
// in app/pdp/_lib + radix via the cart context) lives in the client child,
// keeping those out of the server graph.
export default function ProductCardPage() {
  return <ProductCardReference />;
}
