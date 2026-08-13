import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pdps } from "./_lib/registry";
import type { PdpProduct } from "./_lib/types";
import { BRANDS } from "./_lib/brands";

/** Product Listing Page (PLP) entries — /search route rendered inside a brand's chrome. */
type PlpEntry = {
  brandKey: string;
  brand: string;
  title: string;
  query: string;
  pageSize?: number;
  sourceUrl: string;
};

const PLP_ENTRIES: PlpEntry[] = [
  {
    brandKey: "homans",
    brand: "Homans Associates",
    title: "Search Results — Blower Motor (Homans)",
    query: "blower motor",
    sourceUrl: "https://arrow-sw-homans.wsm.wsoecom.ninja/search?q=blower%20motor",
  },
  {
    brandKey: "peirce",
    brand: "Peirce-Phelps",
    title: "Search Results — Blower Motor (Peirce-Phelps)",
    query: "blower motor",
    pageSize: 18,
    sourceUrl: "https://www.peirce.com/search?q=blower+motor&page_size=18",
  },
  {
    brandKey: "ecmdi",
    brand: "East Coast Metal Distributors",
    title: "Search Results — Blower (ECMDI)",
    query: "blower",
    sourceUrl: "https://www.ecmdi.com/search?q=blower",
  },
];

function PlpCard({ p }: { p: PlpEntry }) {
  const b = BRANDS[p.brandKey];
  const params = new URLSearchParams({ q: p.query, brand: p.brandKey });
  if (p.pageSize) params.set("page_size", String(p.pageSize));
  const signedOutHref = `/search?${params.toString()}`;
  const signedInHref = `/search?${params.toString()}&signedin=1`;
  const routeLabel = `/search?q=${encodeURIComponent(p.query)}&brand=${p.brandKey}${p.pageSize ? `&page_size=${p.pageSize}` : ""}`;

  return (
    <li className="rounded-xl border bg-card p-5">
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
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
          Search Results
        </span>
      </div>
      <div className="mt-1 line-clamp-1 font-medium">{p.title}</div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">
        Query &ldquo;{p.query}&rdquo; · {routeLabel}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={signedOutHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Signed out
          <ArrowUpRight className="size-3.5" />
        </Link>
        <Link
          href={signedInHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          Signed in
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
      <a
        href={p.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={p.sourceUrl}
        className="mt-2 block truncate font-mono text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
      >
        ↗ reference: {p.sourceUrl.replace(/^https?:\/\/(www\.)?/, "")}
      </a>
    </li>
  );
}

export const metadata: Metadata = {
  title: "Watsco Design Templates",
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
  // Use-case demo entries get their own section at the bottom.
  // "Tabs & Accordions" is its own section on the master (per David) — pulled
  // out of the general Use-Cases list so both surfaces stay clean.
  const tabsAccordionsSlugs = ["uc-tabs-accordions"];
  const tabsAccordions = templates.filter((p) => tabsAccordionsSlugs.includes(p.slug));
  const useCases = templates.filter(
    (p) => p.useCase && !tabsAccordionsSlugs.includes(p.slug),
  );
  const rest = templates.filter(
    (p) =>
      p.slug !== "ecmdi-pro-flush-v2" &&
      !p.useCase &&
      !tabsAccordionsSlugs.includes(p.slug),
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
            <h1 className="text-3xl font-bold tracking-tight">Watsco Design Templates</h1>
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
            <a
              href="https://github.com/uxokdc2025/watscobuild"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-neutral-800 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <Github className="size-3.5" />
              GitHub
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Each section is its own accordion panel. Use Cases opens by default;
            the in-scope list and Descoped start collapsed. */}
        <Accordion
          type="multiple"
          defaultValue={["use-cases"]}
          className="mt-8 flex flex-col gap-3"
        >
          <AccordionItem
            value="in-scope"
            className="rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground uppercase">
                  Product Details Page
                </span>
                <span className="text-lg font-bold tracking-tight">
                  Baseline ({inScope.length})
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-3 pb-2">
                {inScope.map((p) => (
                  <TemplateCard key={p.slug} p={p} />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {useCases.length ? (
            <AccordionItem
              value="use-cases"
              id="use-cases"
              className="scroll-mt-6 rounded-xl border-2 border-primary/40 bg-card px-5"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground uppercase">
                    Product Details Page
                  </span>
                  <span className="text-lg font-bold tracking-tight">
                    Content patterns &amp; badges ({useCases.length})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  One PDP per pattern — each demonstrates a specific state or badge
                  (Replacement, AHRI matched system, pack size, bundle &amp; rebate,
                  points, non-sellable, requires-license, strike-thru pricing). Open
                  ours (signed in) next to the{" "}
                  <span className="font-medium text-foreground">reference</span> link
                  to compare.
                </p>
                <ul className="mt-4 flex flex-col gap-3 pb-2">
                  {useCases.map((p) => (
                    <TemplateCard key={p.slug} p={p} signedInOnly />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          {tabsAccordions.length ? (
            <AccordionItem
              value="tabs-accordions"
              id="tabs-accordions"
              className="scroll-mt-6 rounded-xl border bg-card px-5"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground uppercase">
                    Product Details Page
                  </span>
                  <span className="text-lg font-bold tracking-tight">
                    Tabs &amp; Accordions ({tabsAccordions.length})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-3 pb-2">
                  {tabsAccordions.map((p) => (
                    <TemplateCard key={p.slug} p={p} signedInOnly />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          <AccordionItem
            value="plp"
            id="plp"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground uppercase">
                  Product Listing Page
                </span>
                <span className="text-lg font-bold tracking-tight">
                  Search results (PLP) ({PLP_ENTRIES.length})
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-3 pb-2">
                {PLP_ENTRIES.map((p) => (
                  <PlpCard key={p.brandKey} p={p} />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {descoped.length ? (
            <AccordionItem
              value="descoped"
              className="rounded-xl border bg-card px-5"
            >
              <AccordionTrigger className="text-sm font-semibold tracking-wide text-muted-foreground uppercase hover:no-underline">
                Descoped · building independently ({descoped.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-3 pb-2">
                  {descoped.map((p) => (
                    <TemplateCard key={p.slug} p={p} descoped />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : null}
        </Accordion>
      </main>
    </div>
  );
}
