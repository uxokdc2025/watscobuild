import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPdpSlugs, pdps } from "./_lib/registry";
import { OpenAllButton } from "./_lib/open-all";
import { BRANDS } from "./_lib/brands";

export const metadata: Metadata = {
  title: "PDP Master — all brands",
  description: "Directory of every data-driven PDP template.",
};

export default function PdpMasterPage() {
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PDP Templates</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              One data-driven template · {pdps.length} products in the registry.
              Each renders a signed-out and signed-in version — toggle it on the
              page.
            </p>
          </div>
          <OpenAllButton slugs={getPdpSlugs()} />
        </div>

        <ul className="mt-8 flex flex-col gap-3">
          {pdps.map((p) => (
            <li
              key={p.slug}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-primary">
                  {p.brand}
                </span>
                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  {p.commerce?.price != null ? "priced + gated" : "gated"}
                </span>
              </div>
              <div className="mt-1 line-clamp-1 font-medium">{p.title}</div>
              <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                Item {p.item} · /pdp/{p.slug}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/pdp/${p.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  Signed out
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                  href={`/pdp/${p.slug}?signedin=1`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  Signed in
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {/* Brand chrome previews */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">Brand chrome</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The content template inside each sub-company&apos;s current header /
            footer. {Object.keys(BRANDS).length} brands.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Object.values(BRANDS).map((b) => (
              <li key={b.key}>
                <Link
                  href={`/pdp/chrome/${b.key}`}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-card p-4 outline-none transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className="min-w-0 truncate text-sm font-medium">
                    {b.name}
                  </span>
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: b.accent }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
