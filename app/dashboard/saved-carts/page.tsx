"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SavedCartsPage() {
  return <DashboardShell title="Saved Carts" description="Save a cart now and return to it when you are ready to place the order.">
    <div className="grid gap-4 md:grid-cols-2">
      {[{ name: "Spring maintenance order", items: "12 items", updated: "Updated today" }, { name: "Blower motor replacements", items: "4 items", updated: "Updated yesterday" }].map((cart) => <article key={cart.name} className="rounded-lg border bg-background p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary"><ShoppingCart aria-hidden="true" className="size-5" /></div><Badge variant="secondary">Personal</Badge></div><h2 className="mt-5 font-semibold">{cart.name}</h2><p className="mt-1 text-sm text-muted-foreground">{cart.items} · {cart.updated}</p><Button asChild className="mt-5 min-h-11"><Link href="/search?q=blower%20motor&signedin=1">Open cart</Link></Button></article>)}
    </div>
  </DashboardShell>;
}
