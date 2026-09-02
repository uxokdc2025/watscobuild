import type { Metadata } from "next";

import BuyBoxReference from "./buy-box-reference";

export const metadata: Metadata = {
  title: "Buy Box — Watsco DS",
  description: "The PDP purchase panel: badges, price, availability, quantity + Add to Cart.",
};

export default function BuyBoxBlock() {
  return <BuyBoxReference />;
}
