"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";

const DEMO = [
  { id: "cart-demo-air-handler", title: "Aspen® 3-Ton Multi-Position Electric Air Handler", brand: "Aspen", price: 676.5, image: "/peirce-search/blower-motor-07.avif" },
  { id: "cart-demo-wire-rope", title: "Duro Dyne® Cable Lock Wire Rope - 500' Roll", brand: "Duro Dyne", price: 277, image: "/peirce-search/blower-motor-17.avif" },
];

export default function CartDrawerReference() {
  const { addItem, openCart } = useCart();

  function openWithDemo() {
    DEMO.forEach((d) => addItem(d));
    openCart();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blocks</p>
        <h1 className="text-3xl font-bold tracking-tight">Cart Drawer</h1>
        <p className="max-w-2xl text-muted-foreground">
          The global mini-cart, identical on every page. It slides in from the{" "}
          <span className="font-medium text-foreground">right</span> with line items, quantity
          steppers, subtotal, and &quot;you may also need&quot; recommendations. Triggered from the
          header cart control anywhere in the store.
        </p>
      </header>
      <div className="rounded-xl border bg-card p-6">
        <p className="mb-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Preview
        </p>
        <Button onClick={openWithDemo}>
          <ShoppingCart className="size-4" />
          Open cart with sample items
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Adds two sample items and opens the drawer. Close it with the X or by clicking the overlay.
        </p>
      </div>
    </main>
  );
}
