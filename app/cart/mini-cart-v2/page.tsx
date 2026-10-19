"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, FilePlus2, Minus, Plus, Share2, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/app/pdp/_lib/types";

/* Mini-cart V2 preview — same panel we have, with the button hierarchy re-ranked
   to Watsco's funnel: Checkout (primary) → View Cart → Create Proposal →
   Save / Share (quiet). Shown inline so it can be reviewed from a link. */

type Line = { id: string; brand: string; title: string; item: string; price: number; qty: number; image: string };
const DEMO: Line[] = [
  {
    id: "1",
    brand: "Factory Authorized Parts",
    title: "Bryant® - 5K BTU/H - Air Handler Unit Heater - R-454B",
    item: "EHKMC05KN",
    price: 267,
    qty: 1,
    image: "/category-tiles/air-handler.webp",
  },
];

export default function MiniCartV2Preview() {
  const [lines, setLines] = React.useState<Line[]>(DEMO);
  const setQty = (id: string, q: number) =>
    setLines((p) => p.map((l) => (l.id === id ? { ...l, qty: Math.max(1, q) } : l)));
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <div className="min-h-svh bg-muted/40 px-4 py-10">
      <div className="mx-auto mb-5 max-w-[430px]">
        <h1 className="text-lg font-bold tracking-tight">Mini Cart — V2</h1>
        <p className="text-sm text-muted-foreground">
          Re-ranked actions: Checkout first, then View Cart, Create Proposal, and quiet Save / Share.
        </p>
      </div>

      {/* The panel — same chrome as the live drawer (430px, right-rail look). */}
      <div className="mx-auto flex max-w-[430px] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingCart className="size-5" /> Cart ({lines.reduce((s, l) => s + l.qty, 0)})
          </div>
          <button type="button" aria-label="Close cart" className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 px-5 py-5">
          <div className="flex flex-col gap-5">
            {lines.map((l) => (
              <div key={l.id} className="flex gap-3 border-b pb-5">
                <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-md bg-white ring-1 ring-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt="" className="max-h-[80%] max-w-[80%] object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{l.brand}</p>
                  <p className="line-clamp-2 text-sm font-semibold text-primary">{l.title}</p>
                  <p className="mt-1 font-semibold">{formatUSD(l.price * l.qty)}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="inline-flex h-8 items-center rounded-md border" role="group" aria-label={`Quantity for ${l.title}`}>
                      <button className="grid size-8 place-items-center" onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease quantity"><Minus className="size-3.5" /></button>
                      <span className="grid h-full w-8 place-items-center border-x text-sm">{l.qty}</span>
                      <button className="grid size-8 place-items-center" onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase quantity"><Plus className="size-3.5" /></button>
                    </div>
                    <button className="text-sm font-medium text-primary transition-colors hover:text-primary/80">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* V2 footer — weight cascade: solid → outline → ghost → links. */}
        <footer className="mt-auto border-t bg-background p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-lg font-bold">{formatUSD(subtotal)}</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {/* 1 — the goal */}
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout?demo=1">Checkout</Link>
            </Button>
            {/* 2 — review the full cart */}
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/cart?demo=1">View Cart</Link>
            </Button>
            {/* 3 — one tier down */}
            <Button asChild size="lg" variant="tertiary" className="w-full">
              <Link href="/dashboard/proposals?signedin=1">
                <FilePlus2 className="size-4" /> Create Proposal
              </Link>
            </Button>
          </div>
          {/* 4 — quiet utilities */}
          <div className="mt-3 flex items-center justify-center gap-6 border-t pt-3">
            <button type="button" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Bookmark className="size-4" /> Save Cart
            </button>
            <span aria-hidden className="h-4 w-px bg-border" />
            <button type="button" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Share2 className="size-4" /> Share Cart
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
