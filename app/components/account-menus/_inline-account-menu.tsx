"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AccountNav } from "@/components/ui/account-nav";
import { DrawerPanel } from "@/components/ui/drawer";
import {
  BuyingToolsSubPanel,
  NestedAccountNav,
} from "@/app/pdp/_lib/account-flyout-nested";

/* ─────────────────────────── Inline "shown open" account menu ───────────────────────────
 * The account fly-out, rendered inline (not as a fixed overlay) inside a fixed-height
 * frame so v1 and v2 can sit open, side by side, on the comparison page. v1 uses the
 * shared flat AccountNav; v2 uses NestedAccountNav and the Buying Tools slide sub-panel —
 * the same slide+Back interaction the real drawer uses, scoped to this container. */

export function InlineAccountMenu({ nested = false }: { nested?: boolean }) {
  const [toolsOpen, setToolsOpen] = React.useState(false);

  return (
    <div className="flex h-[560px] w-full flex-col overflow-hidden rounded-xl border bg-background text-foreground shadow-sm">
      <header className="flex items-center justify-between border-b px-5 py-4">
        <h3 className="text-lg font-bold text-neutral-900">My Account</h3>
      </header>
      <div className="border-b px-5 py-4">
        <p className="font-semibold">Hello, David Whiteside</p>
        <p className="mt-2 text-xs text-muted-foreground">Account: #erp|HOM509973</p>
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="block">Ship To:</span>
          <span className="block">613 MAIN STREET · ALL CASH SALES ARE FINAL</span>
        </p>
        <div className="mt-4 flex gap-2">
          <Button type="button" variant="outline" size="lg" className="flex-1 text-xs font-semibold">Change account</Button>
          <Button type="button" size="lg" className="flex-1 gap-1 text-xs font-semibold">Change ship to <ChevronRight className="size-4" /></Button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        {nested ? (
          <NestedAccountNav
            onOpenBuyingTools={() => setToolsOpen(true)}
            buyingToolsOpen={toolsOpen}
          />
        ) : (
          <AccountNav />
        )}
        <div className="mt-auto border-t p-5">
          <Button type="button" variant="outline" size="lg" className="w-full">Sign Out</Button>
        </div>
        {nested && toolsOpen ? (
          <DrawerPanel open side="right" className="absolute inset-0 z-20 flex flex-col overflow-y-auto bg-background shadow-2xl">
            <BuyingToolsSubPanel onBack={() => setToolsOpen(false)} />
          </DrawerPanel>
        ) : null}
      </div>
    </div>
  );
}
