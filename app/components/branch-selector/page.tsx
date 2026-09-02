import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { DirectionCDrawer } from "../../store-locator/_drawers";

export const metadata: Metadata = {
  title: "Branch Selector — Watsco DS",
  description: "The global branch finder. Slides in from the left; sets the active store.",
};

export default function BranchSelectorBlock() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blocks</p>
        <h1 className="text-3xl font-bold tracking-tight">Branch Selector</h1>
        <p className="max-w-2xl text-muted-foreground">
          The global branch finder, identical on every page. It slides in from the{" "}
          <span className="font-medium text-foreground">left</span> and sets the active store. The
          active header store is preselected and shown as the current store.
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
      <div className="flex justify-center">
        <div className="h-[720px]">
          <DirectionCDrawer />
        </div>
      </div>
    </main>
  );
}
