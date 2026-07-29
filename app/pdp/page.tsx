import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPdpSlugs, pdps } from "./_lib/registry";
import type { PdpProduct } from "./_lib/types";
import { OpenAllButton } from "./_lib/open-all";
import { OpenQuestions } from "./_lib/open-questions";
import { BRANDS } from "./_lib/brands";

export const metadata: Metadata = {
  title: "PDP Master — all brands",
  description: "Directory of every data-driven PDP template.",
};

// Business units we're actively designing the shared PDP content for.
const IN_SCOPE = ["ecmdi", "baker", "homans", "peirce"];

function TemplateCard({
  p,
  descoped = false,
}: {
  p: PdpProduct;
  descoped?: boolean;
}) {
  const b = p.brandKey ? BRANDS[p.brandKey] : undefined;
  return (
    <li className={`rounded-xl border bg-card p-5 ${descoped ? "opacity-70" : ""}`}>
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
        {descoped ? (
          <span className="rounded-full border border-amber-500/40 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            Descoped
          </span>
        ) : (
          <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
            {p.commerce?.price != null ? "priced + gated" : "gated"}
          </span>
        )}
      </div>
      <div className="mt-1 line-clamp-1 font-medium">{p.title}</div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">
        Item {p.item} · /pdp/{p.slug}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/pdp/${p.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Signed out
          <ArrowUpRight className="size-3.5" />
        </Link>
        <Link
          href={`/pdp/${p.slug}?signedin=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Signed in
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </li>
  );
}

export default function PdpMasterPage() {
  // Glasfloss (Gemaire) is a placeholder-image example — hidden from the master.
  const templates = pdps.filter((p) => p.slug !== "glasfloss-zlp17h211");
  const inScope = templates
    .filter((p) => IN_SCOPE.includes(p.brandKey ?? ""))
    .sort(
      (a, b) => IN_SCOPE.indexOf(a.brandKey ?? "") - IN_SCOPE.indexOf(b.brandKey ?? "")
    );
  const descoped = templates.filter((p) => !IN_SCOPE.includes(p.brandKey ?? ""));

  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PDP Templates</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              One data-driven template · {inScope.length} in-scope business units,
              each rendered inside its own header / footer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/components"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Components
              <ArrowUpRight className="size-3.5" />
            </Link>
            <OpenAllButton slugs={getPdpSlugs()} />
          </div>
        </div>

        {/* Scope callout */}
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <p className="font-semibold">What we&apos;re designing</p>
          <p className="mt-1 text-muted-foreground">
            The shared <span className="font-medium text-foreground">PDP content</span>{" "}
            — gallery, pricing, branch inventory, tabs, related products — unified
            across the in-scope business units (East Coast, Baker, Homans,
            Peirce). Each keeps its own header / footer. The template flexes to
            each unit&apos;s data model — e.g. Peirce aggregates branch inventory
            (&ldquo;173 · All Branches&rdquo;) while Baker and East Coast list
            individual branches.
          </p>
          <p className="mt-2 text-muted-foreground">
            <span className="font-medium text-foreground">Carrier Enterprise</span>{" "}
            and <span className="font-medium text-foreground">Gemaire</span> are{" "}
            <span className="font-medium text-amber-700 dark:text-amber-400">
              descoped
            </span>{" "}
            — their front-end teams are building independently. Kept below for
            reference only.
          </p>
        </div>

        {/* In scope */}
        <h2 className="mt-8 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          In scope · unifying the PDP content
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {inScope.map((p) => (
            <TemplateCard key={p.slug} p={p} />
          ))}
        </ul>

        {/* Descoped */}
        {descoped.length ? (
          <>
            <h2 className="mt-10 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Descoped · building independently
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {descoped.map((p) => (
                <TemplateCard key={p.slug} p={p} descoped />
              ))}
            </ul>
          </>
        ) : null}

        <OpenQuestions />
      </main>
    </div>
  );
}
