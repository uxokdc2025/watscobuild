import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPdp } from "@/app/pdp/_lib/registry";
import { PdpAuthProvider } from "@/app/pdp/_lib/auth";
import { Pdp } from "@/app/pdp/_lib/pdp";

import {
  InventoryDirection1,
  InventoryDirection2,
  InventoryDirection3,
  InventoryStoreLocatorDrawer,
  InventoryCloseX,
} from "../../_inventory-drawers";
import { DrawerOverlay } from "../../_drawer-overlay";
import { DrawerPanel } from "@/components/ui/drawer";

export const metadata: Metadata = {
  title: "Inventory Drawer — over PDP",
  description: "The Product Availability drawer overlaid on a Carrier PDP.",
};

type SearchParams = { v?: string; slug?: string };

function VariantDrawer({ v }: { v: string }) {
  if (v === "1") return <InventoryDirection1 />;
  if (v === "2") return <InventoryDirection2 />;
  if (v === "c") return <InventoryStoreLocatorDrawer />;
  return <InventoryDirection3 />;
}

export default async function InventoryInPdpPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { v = "c", slug = "uc-tabs-accordions" } = await searchParams;
  const variant = ["1", "2", "3", "c"].includes(v) ? v : "c";
  const product = getPdp(slug);
  if (!product) notFound();

  return (
    <PdpAuthProvider initialSignedIn>
      <div className="relative min-h-svh bg-background">
        {/* PDP background — non-interactive under the scrim. */}
        <div aria-hidden className="pointer-events-none opacity-95">
          <Pdp product={product} signedIn />
        </div>

        {/* Scrim + right-side Product Availability drawer */}
        <DrawerOverlay>
          <DrawerPanel open side="right" className="absolute inset-y-0 right-0 flex">
            {/* The current availability drawer ("c") has its own header X; the
                legacy variants use the floating scrim close control. */}
            {variant !== "c" ? (
              <div className="absolute top-4 -left-2">
                <InventoryCloseX />
              </div>
            ) : null}
            <VariantDrawer v={variant} />
          </DrawerPanel>
        </DrawerOverlay>
      </div>
    </PdpAuthProvider>
  );
}
