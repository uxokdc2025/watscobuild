import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { InventoryStoreLocatorDrawer } from "../../store-locator/_inventory-drawers";

export const metadata: Metadata = {
  title: "Inventory Drawer — Watsco DS",
  description: "Per-branch stock for one product. Slides in from the right.",
};

export default function InventoryDrawerBlock() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blocks</p>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Drawer</h1>
        <p className="max-w-2xl text-muted-foreground">
          Per-branch stock for a single product, identical on every page. It slides in from the{" "}
          <span className="font-medium text-foreground">right</span> — surfaced from a PDP&apos;s
          Nearby Branches link or a PLP card — and shows availability by branch with a Select action.
        </p>
        <Link
          href="/store-locator/inventory/in-pdp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Open full-screen in a PDP
          <ArrowUpRight className="size-3.5" />
        </Link>
      </header>
      <div className="flex justify-center">
        <div className="h-[720px]">
          <InventoryStoreLocatorDrawer />
        </div>
      </div>
    </main>
  );
}
