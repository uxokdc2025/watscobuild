import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import CheckoutClient from "../../checkout/_components/checkout-client";

export const metadata: Metadata = {
  title: "Checkout — Watsco DS",
  description: "The checkout block: delivery / pickup routing and commerce use cases.",
};

export default function CheckoutBlock() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blocks</p>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="max-w-2xl text-muted-foreground">
          The full checkout flow — account/job context, delivery vs. pickup routing, availability,
          terms/credit, review, and confirmation. Rendered here without the brand chrome (a separate
          global component).
        </p>
        <Link
          href="/checkout?demo=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Open full-screen with chrome
          <ArrowUpRight className="size-3.5" />
        </Link>
      </header>
      <div className="rounded-xl border bg-card p-4 md:p-6">
        <CheckoutClient demo />
      </div>
    </main>
  );
}
