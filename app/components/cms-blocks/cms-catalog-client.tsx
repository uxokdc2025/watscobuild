"use client";

import Link from "next/link";
import { Hammer, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CMS_CATEGORIES, Preview } from "./cms-catalog";

/* Catalog grids — each block is a thumbnail that links to its full, realistic
   example (anchored by block name) on the examples page, plus a link into the
   page composer. */
export function CatalogGrids() {
  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/components/cms-blocks/examples">
            View All Examples
          </Link>
        </Button>
        <Button asChild variant="outline">
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
              {cat.blocks.length} {cat.blocks.length === 1 ? "block" : "blocks"} · Shopware category &ldquo;{cat.shopware}&rdquo;
            </span>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {cat.blocks.map((b) => (
              <Link
                key={b.name}
                href={`/components/cms-blocks/examples#${b.name}`}
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
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
