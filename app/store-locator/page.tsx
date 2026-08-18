import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import {
  DirectionADrawer,
  DirectionBDrawer,
  DirectionCDrawer,
} from "./_drawers";

export const metadata: Metadata = {
  title: "Store Locator — Drawer Directions",
  description:
    "Three drawer directions side-by-side for visual comparison.",
};

function DirectionColumn({
  label,
  variant,
  children,
}: {
  label: string;
  variant: "a" | "b" | "c";
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
      <Link
        href={`/store-locator/in-plp?v=${variant}`}
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

export default function StoreLocatorPage() {
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/pdp"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to templates
          </Link>
          <h1 className="text-lg font-semibold">Store Locator — drawer directions</h1>
          <span className="w-32" />
        </div>
        <div className="flex flex-wrap items-start justify-center gap-6">
          <DirectionColumn label="Direction 1" variant="a">
            <DirectionADrawer />
          </DirectionColumn>
          <DirectionColumn label="Direction 2" variant="b">
            <DirectionBDrawer />
          </DirectionColumn>
          <DirectionColumn label="Direction 3" variant="c">
            <DirectionCDrawer />
          </DirectionColumn>
        </div>
      </main>
    </div>
  );
}
