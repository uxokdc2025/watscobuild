import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CMS_CATEGORIES } from "../cms-catalog";
import { Examples } from "./examples";

export const metadata: Metadata = {
  title: "Shopware CMS Blocks — Landing Page Examples",
};

export default function CmsBlocksExamplesPage() {
  const total = CMS_CATEGORIES.reduce((n, c) => n + c.blocks.length, 0);
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto min-w-0 max-w-6xl px-4 py-10 md:px-6">
        <Link href="/components/cms-blocks" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          Back to the block catalog
        </Link>

        <header className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight">Shopware CMS Block Examples</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            A realistic example of every block Shopware&apos;s &ldquo;Shopping Experiences&rdquo; editor offers when building a{" "}
            <span className="font-medium text-foreground">Landing page</span>, each labelled with Shopware&apos;s exact block
            name and category tab. Built on our design system with the real imagery and copy from the pages we&apos;ve shipped —{" "}
            <Link href="/home/ecmdi" className="text-primary hover:underline">East Coast Metal</Link>,{" "}
            <Link href="/home/peirce" className="text-primary hover:underline">Peirce-Phelps</Link>, and the{" "}
            <Link href="/category/residential?v=jump" className="text-primary hover:underline">Residential jump page</Link>.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {total} landing-page blocks · {CMS_CATEGORIES.length} categories · Shopware is the source of truth — where a built
            section differs from the real block, the block here matches Shopware and the difference is noted.
          </p>
        </header>

        <div className="mt-10">
          <Examples />
        </div>
      </main>
    </div>
  );
}
