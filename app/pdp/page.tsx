import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPdpSlugs, pdps } from "./_lib/registry";
import { OpenAllButton } from "./_lib/open-all";

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
            <li key={p.slug}>
              <Link
                href={`/pdp/${p.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border bg-card p-5 outline-none transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-primary">
                      {p.brand}
                    </span>
                    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                      {p.commerce ? "priced + gated" : "gated"}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-1 font-medium">{p.title}</div>
                  <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                    Item {p.item} · /pdp/{p.slug}
                  </div>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
