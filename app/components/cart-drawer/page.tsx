import type { Metadata } from "next";

import CartDrawerReference from "./cart-drawer-reference";

export const metadata: Metadata = {
  title: "Cart Drawer — Watsco DS",
  description: "The global mini-cart — line items, quantity, subtotal, recommendations.",
};

export default function CartDrawerBlock() {
  return <CartDrawerReference />;
}
