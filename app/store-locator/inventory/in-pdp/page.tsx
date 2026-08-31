import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getPdp } from "@/app/pdp/_lib/registry";
import { PdpAuthProvider } from "@/app/pdp/_lib/auth";
import { Pdp } from "@/app/pdp/_lib/pdp";

import {
  InventoryDirection1,
  InventoryDirection2,
  InventoryDirection3,
  InventoryCloseX,
} from "../../_inventory-drawers";
import { DrawerOverlay } from "../../_drawer-overlay";
import { drawerPanelClassName } from "@/components/ui/drawer";

export const metadata: Metadata = {
  title: "Inventory Drawer — over PDP",
  description: "Preview an inventory drawer variant overlaid on a Carrier PDP.",
};

type SearchParams = { v?: string; slug?: string };

const VARIANT_TITLE: Record<string, string> = {
  "1": "Direction 1 — Reference literal (East Coast)",
  "2": "Direction 2 — Tabbed, per-row commit",
  "3": "Direction 3 — Dense picker",
};

function VariantDrawer({ v }: { v: string }) {
  if (v === "1") return <InventoryDirection1 />;
  if (v === "2") return <InventoryDirection2 />;
  return <InventoryDirection3 />;
}

export default async function InventoryInPdpPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { v = "1", slug = "uc-tabs-accordions" } = await searchParams;
  const variant = ["1", "2", "3"].includes(v) ? v : "1";
  const product = getPdp(slug);
  if (!product) notFound();

  return (
    <PdpAuthProvider initialSignedIn>
      <div className="relative min-h-svh bg-background">
        {/* PDP background — non-interactive under the scrim. */}
        <div aria-hidden className="pointer-events-none opacity-95">
          <Pdp product={product} signedIn />
        </div>

        {/* Scrim + right-side inventory drawer */}
        <DrawerOverlay>
          <div className={drawerPanelClassName("right", false, "absolute inset-y-0 right-0 flex")}>
            <div className="absolute top-4 -left-2">
              <InventoryCloseX />
            </div>
            <VariantDrawer v={variant} />
          </div>
          <div className="absolute top-4 left-4 flex items-center gap-3 rounded-lg bg-background/95 px-3 py-2 shadow-lg">
            <Link
              href="/store-locator/inventory"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to gallery
            </Link>
            <span className="text-xs text-muted-foreground">
              {VARIANT_TITLE[variant]}
            </span>
          </div>
        </DrawerOverlay>
      </div>
    </PdpAuthProvider>
  );
}
