import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { DirectionCDrawer } from "../../store-locator/_drawers";
import { InventoryStoreLocatorDrawer } from "../../store-locator/_inventory-drawers";

export const metadata: Metadata = {
  title: "Store Locator — Watsco DS",
  description: "Branch selection + inventory drawer. Two related global components.",
};

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <div className="h-[720px]">{children}</div>
    </div>
  );
}

export default function StoreLocatorBlock() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blocks</p>
        <h1 className="text-3xl font-bold tracking-tight">Store Locator</h1>
        <p className="max-w-2xl text-muted-foreground">
          A global component pair, identical on every page. The Branch Selector slides in from the
          left; the Inventory Drawer slides in from the right for per-branch stock. The active header
          store is selected by default.
        </p>
        <Link
          href="/store-locator/in-plp?v=c"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Open full-screen in a PLP
          <ArrowUpRight className="size-3.5" />
        </Link>
      </header>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Column label="Branch selector">
          <DirectionCDrawer />
        </Column>
        <Column label="Inventory drawer">
          <InventoryStoreLocatorDrawer />
        </Column>
      </div>
    </main>
  );
}
