"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DirectionCDrawer } from "./_drawers";
import { InventoryStoreLocatorDrawer } from "./_inventory-drawers";

function DirectionColumn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {/* Gallery pins each drawer at 720px so height-relative behavior
          (scroller, sticky header/footer) is visible. In /in-plp the same
          drawer inherits full viewport height. */}
      <div className="h-[720px]">{children}</div>
      <Button asChild>
        <Link
          href="/store-locator/in-plp?v=c"
          target="_blank"
          rel="noopener noreferrer"
        >
          See in PLP
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

export default function StoreLocatorPage() {
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/pdp"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to templates
          </Link>
          <h1 className="text-lg font-semibold">Store Locator and Inventory Drawer</h1>
          <span className="w-32" />
        </div>
        <div className="flex flex-wrap items-start justify-center gap-6">
          <DirectionColumn label="Store Locator — Direction 2">
            <DirectionCDrawer />
          </DirectionColumn>
          <DirectionColumn label="Inventory Drawer — Direction C">
            <InventoryStoreLocatorDrawer />
          </DirectionColumn>
        </div>
      </main>
    </div>
  );
}
