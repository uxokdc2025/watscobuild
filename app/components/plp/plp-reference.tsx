"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FilterPill,
  FilterOption,
  FilterSection,
  RadiusControl,
} from "@/components/ui/plp-filters";
import { ProductListRow } from "@/components/ui/product-list-row";
import { PreviewCode, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "applied-filters", label: "Applied filters" },
  { id: "branch-selector", label: "Branch selector" },
  { id: "radius", label: "Radius" },
  { id: "facets", label: "Facet list" },
  { id: "view-toggle", label: "View toggle" },
  { id: "list-row", label: "Product list row" },
  { id: "anatomy", label: "Anatomy" },
  { id: "guidance", label: "Guidance" },
  { id: "in-production", label: "In production" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

const ANATOMY: { part: string; detail: string }[] = [
  { part: "Applied filters", detail: "Blue removable pills below the results heading + a “Clear All” text link." },
  { part: "Branch selector", detail: "Your Store / Nearby / All radio card; the active header store is preselected and never becomes a pill." },
  { part: "Radius", detail: "Numeric input with an explicit miles label and an Apply action." },
  { part: "Facets", detail: "Expandable section of checkboxes with counts and a compact “See More” link." },
  { part: "View toggle", detail: "Grid / List — mutually-exclusive selected states on shared Buttons." },
  { part: "List row", detail: "Compact result row: product identity left, commerce actions right." },
];

export default function PlpReference() {
  const [radius, setRadius] = React.useState("50");

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">PLP Patterns</h1>
          <p className="max-w-2xl text-muted-foreground">
            The reusable product-list patterns that frame every search result: branch selection,
            applied-filter pills, radius, facets, view controls, and the compact list row. Compose
            these — never re-invent the filter rail or a bespoke result row per category.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ FilterPill, FilterSection, RadiusControl }"} from &quot;@/components/ui/plp-filters&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ ProductListRow }"} from &quot;@/components/ui/product-list-row&quot;
            </code>
          </div>
        </header>

        {/* ── Applied filters ── */}
        <section className="space-y-4">
          <H2 id="applied-filters">Applied filters</H2>
          <p className="text-sm text-muted-foreground">
            Blue pills sit below the results heading; each removes one facet. Clear All is a text
            link, not a button.
          </p>
          <PreviewCode
            code={`<div className="flex flex-wrap items-center gap-2">
  <FilterPill label="Manchester, NH - Homans" onRemove={remove} />
  <FilterPill label="Amps: 2" onRemove={remove} />
  <Button variant="link" className="px-1">Clear All</Button>
</div>`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <FilterPill label="Manchester, NH - Homans" onRemove={() => undefined} />
              <FilterPill label="Amps: 2" onRemove={() => undefined} />
              <Button variant="link" className="px-1">
                Clear All
              </Button>
            </div>
          </PreviewCode>
        </section>

        {/* ── Branch selector ── */}
        <section className="space-y-4">
          <H2 id="branch-selector">Branch selector</H2>
          <p className="text-sm text-muted-foreground">
            The active header store is selected by default and does{" "}
            <span className="font-medium text-foreground">not</span> become an applied-filter pill.
          </p>
          <PreviewCode
            previewClassName="justify-center"
            code={`<Card className="w-full max-w-sm">
  <CardContent className="p-4">
    <p className="mb-3 font-semibold">Stocked At</p>
    <RadioGroup defaultValue="your-store" className="gap-2">
      <label className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
        <span className="flex items-center gap-2"><RadioGroupItem value="your-store" />Your Store</span>
        <span className="text-xs text-muted-foreground">(0)</span>
      </label>
      <label className="flex items-center justify-between px-3 py-2">
        <span className="flex items-center gap-2"><RadioGroupItem value="nearby" />Nearby Branches</span>
        <span className="text-xs text-muted-foreground">(0)</span>
      </label>
      <label className="flex items-center justify-between px-3 py-2">
        <span className="flex items-center gap-2"><RadioGroupItem value="all" />All Branches</span>
        <span className="text-xs text-muted-foreground">(101)</span>
      </label>
    </RadioGroup>
    <Button variant="link" className="mt-2 px-0">Change</Button>
  </CardContent>
</Card>`}
          >
            <Card className="w-full max-w-sm">
              <CardContent className="p-4">
                <p className="mb-3 font-semibold">Stocked At</p>
                <RadioGroup defaultValue="your-store" className="gap-2">
                  <label className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value="your-store" />
                      Your Store
                    </span>
                    <span className="text-xs text-muted-foreground">(0)</span>
                  </label>
                  <label className="flex items-center justify-between px-3 py-2">
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value="nearby" />
                      Nearby Branches
                    </span>
                    <span className="text-xs text-muted-foreground">(0)</span>
                  </label>
                  <label className="flex items-center justify-between px-3 py-2">
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value="all" />
                      All Branches
                    </span>
                    <span className="text-xs text-muted-foreground">(101)</span>
                  </label>
                </RadioGroup>
                <Button variant="link" className="mt-2 px-0">
                  Change
                </Button>
              </CardContent>
            </Card>
          </PreviewCode>
        </section>

        {/* ── Radius ── */}
        <section className="space-y-4">
          <H2 id="radius">Radius control</H2>
          <p className="text-sm text-muted-foreground">
            Numeric radius input with an explicit miles label and an Apply action.
          </p>
          <PreviewCode
            code={`const [radius, setRadius] = React.useState("50");

<RadiusControl value={radius} onChange={setRadius} />`}
          >
            <RadiusControl value={radius} onChange={setRadius} />
          </PreviewCode>
        </section>

        {/* ── Facets ── */}
        <section className="space-y-4">
          <H2 id="facets">Facet list</H2>
          <p className="text-sm text-muted-foreground">
            Expandable section with checkbox options, result counts, and a compact See More link.
          </p>
          <PreviewCode
            previewClassName="justify-center"
            code={`<FilterSection title="Amps">
  <div className="space-y-1">
    <FilterOption id="amp-2" label="2" count={1} />
    <FilterOption id="amp-3" label="3" count={4} />
    <FilterOption id="amp-4" label="4" count={10} />
  </div>
  <Button variant="link" size="sm" className="mt-2 px-0">See More</Button>
</FilterSection>`}
          >
            <div className="w-full max-w-sm">
              <FilterSection title="Amps">
                <div className="space-y-1">
                  <FilterOption id="plp-amp-2" label="2" count={1} />
                  <FilterOption id="plp-amp-3" label="3" count={4} />
                  <FilterOption id="plp-amp-4" label="4" count={10} />
                </div>
                <Button variant="link" size="sm" className="mt-2 px-0">
                  See More
                </Button>
              </FilterSection>
            </div>
          </PreviewCode>
        </section>

        {/* ── View toggle ── */}
        <section className="space-y-4">
          <H2 id="view-toggle">Results view toggle</H2>
          <p className="text-sm text-muted-foreground">
            Grid and list are mutually-exclusive selected states — the selected view is a primary
            Button, the other a ghost Button.
          </p>
          <PreviewCode
            code={`<div className="inline-flex rounded-md border p-0.5">
  <Button size="sm" className="gap-1"><LayoutGrid />Grid</Button>
  <Button size="sm" variant="ghost" className="gap-1"><List />List</Button>
</div>`}
          >
            <div className="inline-flex rounded-md border p-0.5">
              <Button size="sm" className="gap-1">
                <LayoutGrid />
                Grid
              </Button>
              <Button size="sm" variant="ghost" className="gap-1">
                <List />
                List
              </Button>
            </div>
          </PreviewCode>
        </section>

        {/* ── Product list row ── */}
        <section className="space-y-4">
          <H2 id="list-row">Product list row</H2>
          <p className="text-sm text-muted-foreground">
            The compact result row for List view: product identity on the left, commerce actions
            aligned to the right. Actions are ordinary Buttons from the shared system.
          </p>
          <PreviewCode
            code={`<ProductListRow
  image="/peirce-search/blower-motor-01.avif"
  imageAlt="Blower motor"
  brand="Factory Authorized Parts"
  title="Blower Motor 1/2 HP · 120/240 V"
  item="58MV660006"
  mfg="58MV 660 006"
  actions={<Button size="sm">Add to Cart</Button>}
/>`}
          >
            <div className="w-full">
              <ProductListRow
                image="/peirce-search/blower-motor-01.avif"
                imageAlt="Blower motor"
                brand="Factory Authorized Parts"
                title="Blower Motor 1/2 HP · 120/240 V"
                item="58MV660006"
                mfg="58MV 660 006"
                actions={<Button size="sm">Add to Cart</Button>}
              />
            </div>
          </PreviewCode>
        </section>

        {/* ── Anatomy ── */}
        <section className="space-y-4">
          <H2 id="anatomy">Anatomy</H2>
          <p className="text-sm text-muted-foreground">
            A search results page is these six pieces: the filter rail (branch, radius, facets) on
            the left, applied-filter pills and the view toggle above the results, and a grid of
            Product Cards or a stack of list rows below.
          </p>
          <ol className="overflow-hidden rounded-xl border">
            {ANATOMY.map((a, i) => (
              <li
                key={a.part}
                className="flex gap-4 border-b px-4 py-3 last:border-0 sm:items-baseline"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="w-32 shrink-0 text-sm font-medium">{a.part}</span>
                <span className="text-sm text-muted-foreground">{a.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Preselect the active header store and keep it out of the applied-filter pills.</>,
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">FilterPill</code> for every removable applied facet.</>,
              <>Render Grid results with <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;ProductCard&gt;</code> and List results with <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;ProductListRow&gt;</code>.</>,
              <>Keep row/toggle actions on the shared <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Button&gt;</code> so hover/focus match everywhere.</>,
            ]}
            donts={[
              <>Make Clear All a solid button — it&apos;s a text link (<code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;link&quot;</code>).</>,
              <>Turn the preselected branch into a pill the user has to remove.</>,
              <>Build a bespoke result row per category — compose <code className="rounded bg-muted px-1 py-0.5 text-xs">ProductListRow</code>.</>,
              <>Let Grid and List both read as selected; they&apos;re mutually exclusive.</>,
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where these patterns ship. Compare against the reference above.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "PLP — Search results", href: "/search?q=blower%20motor&signedin=1" },
              { label: "Store Locator", href: "/store-locator" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
                <ExternalLink className="size-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}
