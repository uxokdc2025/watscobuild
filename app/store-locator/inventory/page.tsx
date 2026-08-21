import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { InventoryStoreLocatorDrawer } from "../_inventory-drawers";

export const metadata: Metadata = {
  title: "Inventory Drawer — Right-side directions",
  description: "Inventory drawer using the store-locator branch finder pattern.",
};

export default function InventoryGalleryPage() {
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/store-locator"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Store locator
          </Link>
          <h1 className="text-lg font-semibold">
            Inventory drawer — right-side directions
          </h1>
          <span className="w-32" />
        </div>
        <div className="flex items-start justify-center">
          <div className="h-[720px]">
            <InventoryStoreLocatorDrawer />
          </div>
        </div>
      </main>
    </div>
  );
}
