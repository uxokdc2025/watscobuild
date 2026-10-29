"use client";

import * as React from "react";
import Link from "next/link";
import { Hammer, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CMS_CATEGORIES, Preview, type Block } from "./cms-catalog";
import { FullBlock } from "./cms-blocks-full";

/* Catalog grids with a click-to-open full-size view per block, plus a link
   into the page composer. Client island inside the server catalog page. */
export function CatalogGrids() {
  const [active, setActive] = React.useState<Block | null>(null);
  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/components/cms-blocks/build">
            <Hammer className="size-4" aria-hidden />
            Build a Page
          </Link>
        </Button>
      </div>

      {CMS_CATEGORIES.map((cat) => (
        <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="mt-10">
          <div className="flex flex-wrap items-baseline gap-3 border-b pb-2">
            <h2 id={`cat-${cat.id}`} className="text-xl font-bold tracking-tight">
              {cat.title}
            </h2>
            <span className="text-sm text-muted-foreground">
              {cat.blocks.length} blocks · Shopware category &ldquo;{cat.shopware}&rdquo;
            </span>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {cat.blocks.map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => setActive(b)}
                className="group flex flex-col overflow-hidden rounded-xl border bg-card text-left transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex min-h-[150px] flex-1 items-center bg-background p-5">
                  <div className="w-full">
                    <Preview name={b.name} />
                  </div>
                </div>
                <span className="flex items-center justify-between gap-2 border-t bg-muted/40 px-4 py-2.5 text-sm font-medium">
                  {b.label}
                  <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-primary" aria-hidden />
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90svh] w-full max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{active?.label}</DialogTitle>
            <DialogDescription>
              Live, full-width preview of the Shopware &ldquo;{active?.label}&rdquo; block on our design system.
            </DialogDescription>
          </DialogHeader>
          <div className={cn("mt-2 rounded-lg border bg-background p-6")}>
            {active ? <FullBlock name={active.name} /> : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
