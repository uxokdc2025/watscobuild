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

        {/* By brand — chrome + template combined */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">
            By brand — chrome + template combined
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The PDP content template rendered inside each sub-company&apos;s
            current header / footer, so the client can approve it in context.{" "}
            {Object.keys(BRANDS).length} brands.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(BRANDS).map((b) => {
              const product = pdps.find((p) => p.brandKey === b.key);
              const hasPrice = product?.commerce?.price != null;
              return (
                <li key={b.key} className="rounded-lg border bg-card p-4">
                  {/* Brand name above the link */}
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: b.accent }}
                    />
                    <span className="truncate text-sm font-semibold">
                      {b.name}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link
                      href={`/pdp/chrome/${b.key}`}
                      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      Signed out <ArrowUpRight className="size-3" />
                    </Link>
                    {hasPrice ? (
                      <Link
                        href={`/pdp/chrome/${b.key}?signedin=1`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        Signed in <ArrowUpRight className="size-3" />
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}
