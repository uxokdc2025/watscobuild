"use client";

import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        <Badge className="px-2.5 py-0.5 font-semibold">Search Results</Badge>
      </div>
      <div className="mt-1 line-clamp-1 font-medium">{p.title}</div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">
        Query &ldquo;{p.query}&rdquo; · {routeLabel}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={signedOutHref} target="_blank" rel="noopener noreferrer">
            Signed out
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={signedInHref} target="_blank" rel="noopener noreferrer">
            Signed in
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
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
          <Badge className="px-2.5 py-0.5 font-semibold">{p.useCase}</Badge>
        ) : descoped ? (
          <Badge variant="soft" color="amber">Descoped</Badge>
        ) : (
          <Badge variant="outline" className="font-normal text-muted-foreground">
            {p.commerce?.price != null ? "priced + gated" : "gated"}
          </Badge>
        )}
      </div>
      <div className="mt-1 line-clamp-1 font-medium">{p.title}</div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">
        Item {p.item} · /pdp/{p.slug}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {signedInOnly ? null : (
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/pdp/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Signed out
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        )}
        <Button asChild size="sm">
          <Link
            href={`/pdp/${p.slug}?signedin=1`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {signedInOnly ? "Open (signed in)" : "Signed in"}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
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

/* ── Today's changes — a dated, at-a-glance review list for Ryan & Melissa.
   New work lands here at the top; everything else lives in the sections below. */
const TODAYS_CHANGES: { title: string; desc: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Cart & Checkout — mobile pass",
    desc: "Sticky bottom CTAs, no inner-scroll lists, slimmer saved-card tiles, responsive item rows, and step auto-scroll — across both the horizontal (v1) and accordion (v2) flows.",
    links: [
      { label: "Cart", href: "/cart?demo=1" },
      { label: "Checkout v1", href: "/checkout?demo=1" },
      { label: "Checkout v2", href: "/checkout/v2?demo=1" },
    ],
  },
  {
    title: "Homans “Contact Us” — Limited Availability message",
    desc: "The buy box and PLP cards now show “Limited Availability / Let us help you find this product / Contact Us” instead of a bare Contact Us link.",
    links: [
      { label: "PDP", href: "/pdp/homans-contact-us?signedin=1" },
      { label: "PLP", href: "/search/homans-contact-us?signedin=1" },
    ],
  },
  {
    title: "Tab styles — Style 2 + icons",
    desc: "Style 2 active segment is now a soft, AA-accessible light blue; Specifications uses a gauge icon and Part List a gear icon so they no longer read like Description.",
    links: [{ label: "Tab styles", href: "/pdp/about-variants" }],
  },
  {
    title: "Shopping list — design system + unified list rows",
    desc: "Buttons normalized to the design system; rows rebuilt on the shared list-row pattern — [drag + select] · image · description/item# · availability · price/qty/add.",
    links: [{ label: "Shopping list", href: "/dashboard/shopping-lists/hvac-maintenance-kit" }],
  },
  {
    title: "Search results (PLP) — List view + availability nav",
    desc: "List view is now a full-width horizontal list on the shared row pattern with DS Add-to-Cart buttons; a PLP v2 adds a checkbox “Shop By Availability” filter (Pick Up Today / All Stores) in our grey-box treatment.",
    links: [
      { label: "PLP (Grid/List)", href: "/search?q=blower%20motor&signedin=1" },
      { label: "PLP v2 — availability checkboxes", href: "/search/plp-v2?signedin=1" },
    ],
  },
  {
    title: "Header & search refinements",
    desc: "Mega-menu column header (section name left, View all right, rule under), account panel actions (Change account primary, stacked), and tighter search-sidebar spacing.",
    links: [{ label: "Open PLP", href: "/search?q=blower%20motor&signedin=1" }],
  },
];

export default function PdpMasterPage() {
  // Glasfloss (Gemaire) is a placeholder-image example — hidden from the master.
  const templates = pdps.filter((p) => p.slug !== "glasfloss-zlp17h211");
  // In-review bucket: the PDP(s) David is actively reviewing right now.
  // `uc-ahri-matched-system` is the canonical review PDP — it renders the
  // full AHRI discovery pattern (Find AHRI outline button, matchup badge)
  // that is the current review target.
  const inReviewSlugs = ["uc-ahri-matched-system"];
  const tabsAccordionsSlugs = ["uc-tabs-accordions"];
  const inReview = templates.filter((p) => inReviewSlugs.includes(p.slug));
  const tabsAccordions = templates.filter((p) =>
    tabsAccordionsSlugs.includes(p.slug),
  );
  const useCases = templates.filter(
    (p) =>
      p.useCase &&
      !inReviewSlugs.includes(p.slug) &&
      !tabsAccordionsSlugs.includes(p.slug),
  );
  const rest = templates.filter(
    (p) =>
      p.slug !== "ecmdi-pro-flush-v2" &&
      !p.useCase &&
      !inReviewSlugs.includes(p.slug) &&
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
            <Button asChild variant="outline">
              <Link
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                Account section
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild>
              <Link
                href="/search?q=blower%20motor&signedin=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open PLP
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href="/components"
                target="_blank"
                rel="noopener noreferrer"
              >
                Components
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <a
                href="https://github.com/uxokdc2025/watscobuild"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
              >
                <Github className="size-3.5" />
                GitHub
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* ── Today's changes — dated, at-a-glance review list. New work lands
            here at the top; everything else lives in the sections below. ── */}
        <section
          aria-labelledby="todays-changes"
          className="mt-8 rounded-xl border-2 border-primary/30 bg-primary/[0.04] p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
              New · Sep 29, 2026
            </Badge>
            <h2 id="todays-changes" className="text-lg font-bold tracking-tight">
              Today&apos;s Changes
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            New this session — click through to review each change.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {TODAYS_CHANGES.map((c) => (
              <li key={c.title} className="rounded-lg border bg-card p-4">
                <p className="font-semibold">{c.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.links.map((l) => (
                    <Button key={l.href} asChild variant="outline" size="sm">
                      <Link href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Everything below is prior work, organized by area. Each section is
            its own accordion panel; all panels start collapsed to keep the
            review focused on Today's Changes above. */}
        <Accordion
          type="multiple"
          defaultValue={[]}
          className="mt-8 flex flex-col gap-3"
        >
          <AccordionItem
            value="in-scope"
            className="rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Product Details Page
                </Badge>
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
              className="scroll-mt-6 rounded-xl border bg-card px-5"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3">
                  <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                    Product Details Page
                  </Badge>
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

          {inReview.length ? (
            <AccordionItem
              value="in-review"
              id="in-review"
              className="scroll-mt-6 rounded-xl border-2 border-primary/40 bg-card px-5"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3">
                  <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                    Product Details Page
                  </Badge>
                  <span className="text-lg font-bold tracking-tight">
                    In Review ({inReview.length})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Active review target. AHRI matched-system flow, buy-box
                  layout, product cards, and the Find-AHRI outline button all
                  render on this PDP.
                </p>
                <ul className="mt-4 flex flex-col gap-3 pb-2">
                  {inReview.map((p) => (
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
                  <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                    Product Details Page
                  </Badge>
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
                <div className="mt-4 flex flex-wrap items-center gap-2 pb-2">
                  <Button asChild>
                    <Link
                      href="/pdp/about-variants"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      About This Product — Tab styles (client review)
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      href="/pdp/about-accordion-variants"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      About This Product — Accordion styles (client review)
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          <AccordionItem
            value="store-locator"
            id="store-locator"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Shared Component
                </Badge>
                <span className="text-lg font-bold tracking-tight">
                  Store Locator + Inventory Drawer
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Two related components, three directions each. Store Locator
                slides in from the LEFT (branch selection). Inventory Drawer
                slides in from the RIGHT (per-branch stock for one product) —
                surfaces from a PDP&apos;s Nearby Branches link or a PLP card.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button asChild>
                  <Link
                    href="/store-locator"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Store Locator + Inventory Drawer
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="account-menus"
            id="account-menus"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Shared Component
                </Badge>
                <span className="text-lg font-bold tracking-tight">
                  Account Menus — v1 vs v2
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="max-w-2xl text-sm text-muted-foreground">
                A choice for the account menus: the current flat lists (v1), or a
                nested version (v2) that groups Shopping Lists + Saved Carts under a
                single <span className="font-medium text-foreground">Buying Tools</span>{" "}
                parent — like the live Homans site. The account fly-out and the dashboard
                sidebar are each shown current next to nested.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button asChild>
                  <Link
                    href="/components/account-menus"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Account Menus comparison
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="plp"
            id="plp"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Product Listing Page
                </Badge>
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
              <div className="pb-2">
                <Button asChild size="sm">
                  <Link href="/search/plp-v2?signedin=1" target="_blank" rel="noopener noreferrer">
                    PLP v2 — checkbox availability
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="homans-contact-us"
            id="homans-contact-us"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Homans
                </Badge>
                <span className="text-lg font-bold tracking-tight">
                  Out-of-stock → Contact Us (Homans)
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Homans never shows out-of-stock — a zero-availability product
                renders a simple{" "}
                <span className="font-medium text-foreground">Contact Us</span>{" "}
                link instead of branch-availability zeros or any
                &ldquo;out of stock&rdquo; wording. Price, Quantity, Add to
                Cart, and Add to List stay exactly as-is.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 pb-2">
                <Button asChild>
                  <Link
                    href="/pdp/homans-contact-us?signedin=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Homans PDP (signed in)
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="/search/homans-contact-us?signedin=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Homans PLP (signed in)
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link
                    href="/search/homans-contact-us-v2?signedin=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PLP (multi-result example)
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="checkout"
            id="checkout"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="text-lg font-bold tracking-tight">Cart and Checkout Flow</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-3 pb-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/checkout?demo=1">
                    Checkout
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/checkout/v2?demo=1">
                    Checkout — Progressive (v2)
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/cart?demo=1">
                    Cart
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
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

        {/* Project footer — persistent credits + provenance. Kept terse so
            the review page ends with signal, not chrome. */}
        <footer className="mt-16 border-t pt-8 pb-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-semibold text-foreground">
                Watsco Prototype
              </p>
              <p className="mt-1">
                Started July 23, 2026 · Design-system prototype for the Watsco
                distributor storefronts.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs sm:text-sm">
              <dt className="font-semibold text-foreground">Client</dt>
              <dd>Ryan · Watsco</dd>
              <dt className="font-semibold text-foreground">UX Designer</dt>
              <dd>David Cervantes</dd>
              <dt className="font-semibold text-foreground">Stack</dt>
              <dd>Next.js 15 · React 19 · Tailwind v4 · shadcn</dd>
              <dt className="font-semibold text-foreground">Source</dt>
              <dd>
                <a
                  href="https://github.com/uxokdc2025/watscobuild"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  github.com/uxokdc2025/watscobuild
                </a>
              </dd>
            </dl>
          </div>
          <p className="mt-6 text-xs">
            Prototype · not for production. Product data is representative,
            not live inventory.
          </p>
        </footer>
      </main>
    </div>
  );
}
