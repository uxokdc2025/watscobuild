import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CMS_CATEGORIES, CMS_OTHER } from "./cms-catalog";
import { CatalogGrids } from "./cms-catalog-client";

export const metadata: Metadata = {
  title: "Shopware CMS Blocks — Landing Page Catalog",
};

export default function CmsBlocksPage() {
  const total = CMS_CATEGORIES.reduce((n, c) => n + c.blocks.length, 0);
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <Link href="/pdp" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          Back to master
        </Link>

        <header className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight">Shopware CMS Blocks</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            A design-system mirror of every block Shopware&apos;s &ldquo;Shopping Experiences&rdquo;
            editor exposes when building a <span className="font-medium text-foreground">Landing page</span>.
            Catalogued straight from the live admin&apos;s block registry. Each preview is built from
            our own tokens — placeholder image, header text, lorem ipsum — so any block can be dropped
            into our pages as a real component.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {total} landing-page blocks · {CMS_CATEGORIES.length} categories · source:{" "}
            <span className="font-mono">getCmsBlockRegistry()</span>
          </p>
        </header>

        <p className="mt-2 text-xs text-muted-foreground">Click any block to open its full-size live preview.</p>
        <CatalogGrids />

        <section aria-labelledby="cat-other" className="mt-12">
          <div className="border-b pb-2">
            <h2 id="cat-other" className="text-xl font-bold tracking-tight">
              Not offered on Landing pages
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Shopware has these blocks too, but the Landing-page picker doesn&apos;t surface them
              (they need a product, a category listing, or a sidebar section). Listed for completeness.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {CMS_OTHER.map((g) => (
              <div key={g.title} className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-semibold">{g.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.blocks.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-normal text-muted-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
