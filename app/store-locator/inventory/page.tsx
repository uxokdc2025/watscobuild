import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import {
  InventoryDirection1,
  InventoryDirection2,
  InventoryDirection3,
} from "../_inventory-drawers";

export const metadata: Metadata = {
  title: "Inventory Drawer — Right-side directions",
  description:
    "Three right-side inventory drawers, side by side for visual comparison.",
};

function Column({
  label,
  variant,
  children,
}: {
  label: string;
  variant: "1" | "2" | "3";
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="h-[720px]">{children}</div>
      <Link
        href={`/store-locator/inventory/in-plp?v=${variant}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        See in PLP
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}

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
        <div className="flex flex-wrap items-start justify-center gap-6">
          <Column label="Direction 1" variant="1">
            <InventoryDirection1 />
          </Column>
          <Column label="Direction 2" variant="2">
            <InventoryDirection2 />
          </Column>
          <Column label="Direction 3" variant="3">
            <InventoryDirection3 />
          </Column>
        </div>
      </main>
    </div>
  );
}
