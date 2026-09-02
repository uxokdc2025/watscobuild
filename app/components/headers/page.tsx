import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BRANDS } from "../../pdp/_lib/brands";

export const metadata: Metadata = {
  title: "Headers & Footers — Watsco DS",
  description: "One unified header + footer, themed per Watsco brand. Open any brand to preview.",
};

export default function HeadersIndex() {
  const brands = Object.values(BRANDS);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Chrome</p>
        <h1 className="text-3xl font-bold tracking-tight">Headers &amp; Footers</h1>
        <p className="max-w-2xl text-muted-foreground">
          One unified, best-practice header and footer. Every brand shares the same layout —
          utility bar, brand bar (logo, store selector on the left, search, account &amp; cart), and
          nav. A brand differs only by its color and logo. Open any brand to preview its chrome.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {brands.map((b) => (
          <Link
            key={b.key}
            href={`/components/headers/${b.key}`}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span
              aria-hidden
              className="size-9 shrink-0 rounded-md border"
              style={{ backgroundColor: b.accent }}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{b.name}</span>
              <span className="block text-xs text-muted-foreground">Header &amp; footer</span>
            </span>
            <ArrowRight className="size-4 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-60" />
          </Link>
        ))}
      </div>
    </main>
  );
}
