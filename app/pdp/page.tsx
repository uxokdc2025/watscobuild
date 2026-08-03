import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { getPdpSlugs, pdps } from "./_lib/registry";
import type { PdpProduct } from "./_lib/types";
import { OpenAllButton } from "./_lib/open-all";
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
  signedInOnly = false,
}: {
  p: PdpProduct;
  descoped?: boolean;
  signedInOnly?: boolean;
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
        {p.useCase ? (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            {p.useCase}
          </span>
        ) : descoped ? (
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
        {signedInOnly ? null : (
          <Link
            href={`/pdp/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            Signed out
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
        <Link
          href={`/pdp/${p.slug}?signedin=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {signedInOnly ? "Open (signed in)" : "Signed in"}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
      {p.sourceUrl ? (
        <a
          href={p.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={p.sourceUrl}
          className="mt-2 block truncate font-mono text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
        >
          ↗ reference: {p.sourceUrl.replace(/^https?:\/\/(www\.)?/, "")}
        </a>
      ) : null}
    </li>
  );
}

export default function PdpMasterPage() {
  // Glasfloss (Gemaire) is a placeholder-image example — hidden from the master.
  const templates = pdps.filter((p) => p.slug !== "glasfloss-zlp17h211");
  // The v2 pack-size-pills demo is called out on its own, not in the main list.
  const v2 = templates.find((p) => p.slug === "ecmdi-pro-flush-v2");
  // Use-case demo entries get their own section at the bottom.
  const useCases = templates.filter((p) => p.useCase);
  const rest = templates.filter(
    (p) => p.slug !== "ecmdi-pro-flush-v2" && !p.useCase
  );
  const inScope = rest
    .filter((p) => IN_SCOPE.includes(p.brandKey ?? ""))
    .sort(
      (a, b) => IN_SCOPE.indexOf(a.brandKey ?? "") - IN_SCOPE.indexOf(b.brandKey ?? "")
    );
  const descoped = rest.filter((p) => !IN_SCOPE.includes(p.brandKey ?? ""));

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
            <a
              href="#use-cases"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <ArrowDown className="size-3.5" />
              Use cases
            </a>
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

        {/* v2 callout — pack-size pills */}
        {v2 ? (
          <div className="mt-6 rounded-xl border-2 border-primary bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                v2 · Pack-size pills
              </span>
              <span className="text-sm font-semibold">East Coast Metal Distributors</span>
              <span className="text-sm text-muted-foreground">{v2.brand}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Demonstrates the pack-size selector as <span className="font-medium text-foreground">pills</span>{" "}
              instead of a segmented control — shown here with the &ldquo;few
              options&rdquo; case (Each / 12-Pk). One option renders as a single
              static label; more options wrap cleanly. See it under{" "}
              <span className="font-medium text-foreground">Pack Size</span> on the
              signed-in view.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/pdp/${v2.slug}?signedin=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Signed in · see the pills
                <ArrowUpRight className="size-3.5" />
              </Link>
              <Link
                href={`/pdp/${v2.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Signed out
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* In scope */}
        <h2 className="mt-8 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          In scope · unifying the PDP content
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {inScope.map((p) => (
            <TemplateCard key={p.slug} p={p} />
          ))}
        </ul>

        {/* Use cases */}
        {useCases.length ? (
          <section id="use-cases" className="scroll-mt-6">
            {/* Noticeable divider */}
            <div className="mt-12 flex items-center gap-4" aria-hidden>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground uppercase">
                Use Cases
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            <h2 className="mt-6 text-lg font-bold tracking-tight">
              Content patterns &amp; new badges
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              One PDP per pattern — each demonstrates a specific state or badge
              (Replacement, AHRI matched system, pack size, bundle &amp; rebate,
              points, non-sellable, requires-license, strike-thru pricing). Open
              ours (signed in) next to the <span className="font-medium text-foreground">reference</span>{" "}
              link to compare.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {useCases.map((p) => (
                <TemplateCard key={p.slug} p={p} signedInOnly />
              ))}
            </ul>
          </section>
        ) : null}

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
      </main>
    </div>
  );
}
