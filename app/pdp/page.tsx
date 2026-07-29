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
  // Glasfloss (Gemaire) is a placeholder-image example — hidden from the master.
  const templates = pdps.filter((p) => p.slug !== "glasfloss-zlp17h211");
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PDP Templates</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              One data-driven template · {templates.length} products, each rendered
              inside its own brand&apos;s header / footer. Open the signed-out or
              signed-in version.
            </p>
          </div>
          <OpenAllButton slugs={getPdpSlugs()} />
        </div>

        <ul className="mt-8 flex flex-col gap-3">
          {templates.map((p) => {
            const b = p.brandKey ? BRANDS[p.brandKey] : undefined;
            return (
            <li
              key={p.slug}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                {b ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: b.accent }}
                    />
                    <span className="text-sm font-semibold">{b.name}</span>
                  </span>
                ) : null}
                <span className="text-sm text-muted-foreground">{p.brand}</span>
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
            );
          })}
        </ul>
      </main>
    </div>
  );
}
