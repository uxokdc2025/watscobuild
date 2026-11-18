"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FilterPill,
  FilterOption,
  FilterSection,
  RadiusControl,
} from "@/components/ui/plp-filters";
import {
  PlpTopFilterBar,
  TopFilterChips,
  TopFilterDropdown,
  type TopFilterChip,
  type TopFilterFacet,
  type TopFilterSelection,
} from "@/components/ui/plp-top-filters";
import {
  ResultsHeader,
  ResultsViewToggle,
  type ResultsView,
} from "@/components/ui/plp-results-header";
import { ProductListRow } from "@/components/ui/product-list-row";
import { InventoryLine } from "@/app/ahri/_lib/parts";
import {
  CategoryThumbnails,
  type CategoryThumbnailItem,
} from "@/components/ui/category-thumbnails";
import { PreviewCode, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "category-thumbnails", label: "Category Thumbnails" },
  { id: "results-header", label: "Results Header" },
  { id: "applied-filters", label: "Applied Filters" },
  { id: "branch-selector", label: "Branch Selector" },
  { id: "radius", label: "Radius" },
  { id: "facets", label: "Facet List" },
  { id: "facet-dropdown", label: "Facet Dropdown" },
  { id: "pinned-bar", label: "Pinned Filter Bar" },
  { id: "view-toggle", label: "View Toggle" },
  { id: "list-row", label: "Product List Row" },
  { id: "anatomy", label: "Anatomy" },
  { id: "guidance", label: "Guidance" },
  { id: "in-production", label: "In Production" },
];

/* Demo facets for the pinned bar — the real Homans Residential groups. */
const DEMO_PINNED_FACETS: TopFilterFacet[] = [
  {
    key: "Brand",
    label: "Brand",
    options: [
      { name: "Armstrong Air®" },
      { name: "Bryant®" },
      { name: "Payne®" },
      { name: "Goodman®" },
      { name: "Mitsubishi Electric®" },
    ],
  },
  {
    key: "Tonnage",
    label: "Tonnage",
    options: [
      { name: "1.5 Ton", count: 46 },
      { name: "2 Ton", count: 92 },
      { name: "2.5 Ton", count: 88 },
      { name: "3 Ton", count: 95 },
      { name: "4 Ton", count: 58 },
      { name: "5 Ton", count: 40 },
    ],
  },
  {
    key: "SEER2",
    label: "SEER2",
    options: [
      { name: "13.4", count: 72 },
      { name: "14", count: 95 },
      { name: "15", count: 83 },
      { name: "16", count: 51 },
    ],
  },
  {
    key: "Refrigerant",
    label: "Refrigerant",
    options: [
      { name: "R-454B", count: 268 },
      { name: "R-410A", count: 96 },
      { name: "R-32", count: 12 },
    ],
  },
  {
    key: "Product Family",
    label: "Product Family",
    options: [
      { name: "Legacy™", count: 96 },
      { name: "Preferred™", count: 58 },
      { name: "OMNI", count: 74 },
    ],
  },
];

/* Everything behind "More filters" — the pinned five plus the long tail. */
const DEMO_ALL_FACETS: TopFilterFacet[] = [
  ...DEMO_PINNED_FACETS,
  {
    key: "Stage",
    label: "Stage",
    options: [
      { name: "Single Stage", count: 214 },
      { name: "Two Stage", count: 58 },
      { name: "Variable Speed", count: 31 },
    ],
  },
  {
    key: "Voltage",
    label: "Voltage",
    options: [
      { name: "115V", count: 24 },
      { name: "208/230V", count: 288 },
      { name: "460V", count: 31 },
    ],
  },
  {
    key: "AFUE",
    label: "AFUE",
    options: [
      { name: "80%", count: 58 },
      { name: "90%", count: 42 },
      { name: "96%", count: 22 },
    ],
  },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

const CATEGORY_THUMBNAILS: CategoryThumbnailItem[] = [
  { label: "Air Conditioner", image: "/category-tiles/air-conditioner.webp", href: "#" },
  { label: "Heat Pump", image: "/category-tiles/heat-pump.webp", href: "#" },
  { label: "Gas Furnace", image: "/category-tiles/gas-furnace.webp", href: "#" },
  { label: "Air Handler", image: "/category-tiles/air-handler.webp", href: "#" },
  { label: "Evaporator Coil", image: "/category-tiles/evaporator-coil.webp", href: "#" },
  { label: "Ductless", image: "/category-tiles/ductless.webp", href: "#" },
];

const ANATOMY: { part: string; detail: string }[] = [
  { part: "Category thumbnails", detail: "A scrolling strip of square category tiles above the results — the category jump." },
  { part: "Results header", detail: "One row above the filters: title + result count in a smaller font + the view toggle at the right end." },
  { part: "Applied filters", detail: "Removable pills under the results count — white with a thin outline and a small red × — plus a “Clear All” text link." },
  { part: "Branch selector", detail: "Your Store / Nearby / All radio card; the active header store is preselected and never becomes a pill." },
  { part: "Radius", detail: "Numeric input with an explicit miles label and an Apply action." },
  { part: "Facets", detail: "Expandable section of checkboxes with counts and a compact “See More” link." },
  { part: "Pinned filter bar", detail: "Always-on row of facet dropdowns under the header row + “More filters”. No container; light-blue hover on each trigger. Adds to the rail, never replaces it — one shared selection." },
  { part: "View toggle", detail: "Grid / List — mutually-exclusive selected states on shared Buttons, at the right end of the header row." },
  { part: "List row", detail: "The product in List view — identity left, availability centered, commerce actions right. No Compare. Rendered on its own, or as the expanded row of the grouped Family Table." },
];

export default function PlpReference() {
  const [radius, setRadius] = React.useState("50");
  const [resultsView, setResultsView] = React.useState<ResultsView>("grid");
  /* One selection map, exactly as a PLP holds it: the pinned bar, the More
     filters sheet and the left rail all read and write this. */
  const [topSelected, setTopSelected] = React.useState<TopFilterSelection>({
    Tonnage: new Set(["3 Ton"]),
  });

  const toggleTop = React.useCallback((facetKey: string, option: string) => {
    setTopSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facetKey] ?? []);
      if (set.has(option)) set.delete(option);
      else set.add(option);
      if (set.size) next[facetKey] = set;
      else delete next[facetKey];
      return next;
    });
  }, []);

  const clearTopFacet = React.useCallback((facetKey: string) => {
    setTopSelected((prev) => {
      if (!prev[facetKey]) return prev;
      const next = { ...prev };
      delete next[facetKey];
      return next;
    });
  }, []);

  const topChips = React.useMemo<TopFilterChip[]>(
    () =>
      Object.entries(topSelected).flatMap(([facetKey, options]) =>
        Array.from(options).map((option) => ({
          facetKey,
          option,
          label: `${facetKey}: ${option}`,
        })),
      ),
    [topSelected],
  );

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
            applied-filter pills, radius, facets, the pinned top filter bar, view controls, and the
            compact list row. Compose these — never re-invent the filter rail or a bespoke result
            row per category.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ FilterPill, FilterSection, RadiusControl }"} from &quot;@/components/ui/plp-filters&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ PlpTopFilterBar, TopFilterChips }"} from &quot;@/components/ui/plp-top-filters&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ ResultsHeader, ResultsViewToggle }"} from &quot;@/components/ui/plp-results-header&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ ProductListRow }"} from &quot;@/components/ui/product-list-row&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ CategoryThumbnails }"} from &quot;@/components/ui/category-thumbnails&quot;
            </code>
          </div>
        </header>

        {/* ── Category thumbnails ── */}
        <section className="space-y-4">
          <H2 id="category-thumbnails">Category thumbnails</H2>
          <p className="text-sm text-muted-foreground">
            The category jump that sits above search and PLP results. Tiles are{" "}
            <span className="font-medium text-foreground">square</span>, on the small
            corner-radius token (<code className="rounded bg-muted px-1 py-0.5 text-xs">rounded-sm</code>{" "}
            → <code className="rounded bg-muted px-1 py-0.5 text-xs">var(--radius)</code>), using the
            standard card tile treatment — a bordered <code className="rounded bg-muted px-1 py-0.5 text-xs">bg-card</code>{" "}
            square with the art contained inside and the label below. Never circles: the strip matches the
            square tiles already used by Category Landing and the brand homepages. The row scrolls
            horizontally at every width.
          </p>
          <PreviewCode
            code={`<CategoryThumbnails
  items={[
    { label: "Air Conditioner", image: "/category-tiles/air-conditioner.webp", href: "/category/air-conditioners" },
    { label: "Heat Pump", image: "/category-tiles/heat-pump.webp" },
    // …
  ]}
  href="/search?brand=homans&category=residential"
/>`}
          >
            <div className="w-full">
              <CategoryThumbnails
                items={CATEGORY_THUMBNAILS}
                href="#"
                className="mb-0 border-b-0 pb-0"
              />
            </div>
          </PreviewCode>
        </section>

        {/* ── Results header ── */}
        <section className="space-y-4">
          <H2 id="results-header">Results header</H2>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">One row</span> above the filters: the
            category (or query) as the page title, the result count beside it in a smaller font,
            and the view controls pushed to the right end of that same row. It sits{" "}
            <span className="font-medium text-foreground">above</span> the top filter bar, so the
            page reads title → count → view → filters → results and the shopper never hunts for the
            view switch halfway down the page. The count is its own line of type — smaller, muted,
            with the number itself bold — never a badge.
          </p>
          <PreviewCode
            previewClassName="block"
            code={`<ResultsHeader
  title="Residential"
  count={348}
  actions={<ResultsViewToggle value={view} onChange={setView} />}
/>`}
          >
            <div className="w-full">
              <ResultsHeader
                title="Residential"
                count={348}
                actions={
                  <ResultsViewToggle value={resultsView} onChange={setResultsView} />
                }
              />
            </div>
          </PreviewCode>
          <p className="text-sm text-muted-foreground">
            The title renders as an{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">h1</code> by default; pass{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">as=&quot;h2&quot;</code> where
            the page already owns its H1. Below the layout&apos;s small breakpoint the actions drop
            to their own right-aligned line rather than forcing the row to overflow.
          </p>
        </section>

        {/* ── Applied filters ── */}
        <section className="space-y-4">
          <H2 id="applied-filters">Applied filters</H2>
          <p className="text-sm text-muted-foreground">
            Removable pills sit under the results count; each one drops a single facet. Clear All is
            a text link, not a button.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;outline&quot;</code>{" "}
            is the default treatment for a results page: a plain white pill with a thin outline and
            a small red ×, so a dozen applied facets read as a quiet list instead of a wall of
            blue, and the × reads unmistakably as &ldquo;remove&rdquo;.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;solid&quot;</code>{" "}
            is the original filled pill, kept for surfaces where one or two pills carry real
            emphasis.
          </p>
          <PreviewCode
            previewClassName="block"
            code={`<div className="flex flex-wrap items-center gap-2">
  <FilterPill variant="outline" label="Brand: Factory Authorized Parts" onRemove={remove} />
  <FilterPill variant="outline" label="Tonnage: 3 Ton" onRemove={remove} />
  <Button variant="link" className="px-1">Clear All</Button>
</div>`}
          >
            <div className="w-full space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <FilterPill
                  variant="outline"
                  label="Brand: Factory Authorized Parts"
                  onRemove={() => undefined}
                />
                <FilterPill variant="outline" label="Tonnage: 3 Ton" onRemove={() => undefined} />
                <Button variant="link" className="px-1">
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <FilterPill label="Manchester, NH - Homans" onRemove={() => undefined} />
                <FilterPill label="Amps: 2" onRemove={() => undefined} />
                <span className="text-xs text-muted-foreground">
                  ← <code className="rounded bg-muted px-1 py-0.5">variant=&quot;solid&quot;</code>
                </span>
              </div>
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

        {/* ── Facet dropdown ── */}
        <section className="space-y-4">
          <H2 id="facet-dropdown">Facet dropdown</H2>
          <p className="text-sm text-muted-foreground">
            One facet as a dropdown, for the pinned bar above the grid. The trigger is an outline
            Button that fills its container — the row, not the label, sets the width — and carries a
            count badge once something is selected. Options are the same{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">FilterOption</code> rows as the
            rail, so counts and tap targets match. Selections apply immediately; there is no Apply
            button to hunt for.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">hover=&quot;accent&quot;</code>{" "}
            swaps the grey Button hover for the light-blue active-nav state — use it in the
            container-less bar, where the trigger is the only thing signalling the row is
            interactive.
          </p>
          <PreviewCode
            code={`<TopFilterDropdown
  facet={{ key: "Tonnage", label: "Tonnage", options: [{ name: "3 Ton", count: 95 }] }}
  selected={selected["Tonnage"]}
  onToggle={(option) => toggleFacet("Tonnage", option)}
  onClear={() => clearFacet("Tonnage")}
/>`}
          >
            <div className="w-full max-w-44">
              <TopFilterDropdown
                facet={DEMO_PINNED_FACETS[1]}
                selected={topSelected["Tonnage"]}
                onToggle={(option) => toggleTop("Tonnage", option)}
                onClear={() => clearTopFacet("Tonnage")}
              />
            </div>
          </PreviewCode>
        </section>

        {/* ── Pinned filter bar ── */}
        <section className="space-y-4">
          <H2 id="pinned-bar">Pinned filter bar</H2>
          <p className="text-sm text-muted-foreground">
            A horizontal row of the top four or five facets, sitting directly under the{" "}
            <a href="#results-header" className="font-medium text-primary hover:underline">
              results header
            </a>{" "}
            and above the results, with{" "}
            <span className="font-medium text-foreground">More filters</span> opening the full list
            in a sheet. It is an <span className="font-medium text-foreground">addition</span> to the
            left rail, not a replacement: both are bound to one selection map, so checking{" "}
            <em>3 Ton</em> in either place selects it in the other and produces one chip. Every
            control is one cell of a grid, so the widths are identical by construction: a single row
            on desktop, wrapping to three columns on tablets and two on phones rather than scrolling
            controls off-screen. The bar is <span className="font-medium text-foreground">always on</span>{" "}
            for search and category PLPs — there is no Sidebar / Top bar switch.
          </p>
          <PreviewCode
            previewClassName="block"
            code={`const [selected, setSelected] = React.useState<TopFilterSelection>({});

<PlpTopFilterBar
  facets={PINNED_FACETS}       // Brand, Tonnage, SEER2, Refrigerant, Product Family
  allFacets={ALL_FACETS}       // everything, for the More filters sheet
  selected={selected}
  onToggle={toggleFacet}
  onClearFacet={clearFacet}
  onClearAll={clearAllFilters}
  resultCount={348}
/>
<TopFilterChips items={chips} onRemove={removeChip} onClearAll={clearAllFilters} />`}
          >
            <div className="w-full space-y-3">
              <PlpTopFilterBar
                facets={DEMO_PINNED_FACETS}
                allFacets={DEMO_ALL_FACETS}
                selected={topSelected}
                onToggle={toggleTop}
                onClearFacet={clearTopFacet}
                onClearAll={() => setTopSelected({})}
                resultCount={348}
                sticky={false}
                variant="plain"
              />
              <TopFilterChips
                items={topChips}
                onRemove={(chip) => toggleTop(chip.facetKey, chip.option)}
                onClearAll={() => setTopSelected({})}
                variant="outline"
              />
            </div>
          </PreviewCode>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;plain&quot;</code>{" "}
            (above) is the results-page framing: the dropdowns sit straight on the page with{" "}
            <span className="font-medium text-foreground">no container</span> around them — no
            grey inset box competing with the header row and the grid. With the card edge gone the
            interactive signal moves onto the triggers themselves, as the light-blue hover and open
            state built from the design-system active-nav tokens (
            <code className="rounded bg-muted px-1 py-0.5 text-xs">--tab-active-bg</code> /{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">--tab-active-fg</code> — the same
            pair the active tab and the Grid/List toggle use). Hover any dropdown to see it.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;inset&quot;</code>{" "}
            keeps the original bordered card.
          </p>
          <PreviewCode
            previewClassName="block"
            code={`<PlpTopFilterBar variant="inset" … />   {/* bordered card */}`}
          >
            <div className="w-full">
              <PlpTopFilterBar
                facets={DEMO_PINNED_FACETS}
                allFacets={DEMO_ALL_FACETS}
                selected={topSelected}
                onToggle={toggleTop}
                onClearFacet={clearTopFacet}
                onClearAll={() => setTopSelected({})}
                resultCount={348}
                sticky={false}
                variant="inset"
              />
            </div>
          </PreviewCode>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 py-0.5 text-xs">sticky</code> (the default) pins
            the bar to the top of the viewport while the grid scrolls under it — on desktop only,
            where it is one row and cannot eat the screen. Chips sit
            below the bar and read{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Facet: Option</code> — up top a
            bare &ldquo;14&rdquo; has lost the group heading that explained it.
          </p>
        </section>

        {/* ── View toggle ── */}
        <section className="space-y-4">
          <H2 id="view-toggle">Results view toggle</H2>
          <p className="text-sm text-muted-foreground">
            Grid and list are mutually-exclusive selected states on shared ghost Buttons — the
            selected side takes the light-blue active-nav tokens, the other stays muted. It lives
            at the right end of the{" "}
            <a href="#results-header" className="font-medium text-primary hover:underline">
              results header
            </a>{" "}
            row; never build a second copy next to the grid.
          </p>
          <PreviewCode
            code={`const [view, setView] = React.useState<ResultsView>("grid");

<ResultsViewToggle value={view} onChange={setView} />`}
          >
            <ResultsViewToggle value={resultsView} onChange={setResultsView} />
          </PreviewCode>
        </section>

        {/* ── Product list row ── */}
        <section className="space-y-4">
          <H2 id="list-row">Product list row</H2>
          <p className="text-sm text-muted-foreground">
            The product in List view: identity on the left, availability as its own centered
            column, commerce actions aligned to the right. Actions are ordinary Buttons from the
            shared system. The row has no Compare control; pass{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">availability</code> and the row
            adds the centered stock column. The storefront List view renders it as the expanded
            row of the grouped{" "}
            <Link href="/components/family-table#expanded-list-card" className="text-primary underline-offset-2 hover:underline">
              Family Table
            </Link>
            , so the open row and a standalone list row are the same component.
          </p>
          <PreviewCode
            code={`<ProductListRow
  image="/peirce-search/blower-motor-01.avif"
  imageAlt="Blower motor"
  brand="Factory Authorized Parts"
  title="Blower Motor 1/2 HP · 120/240 V"
  item="58MV660006"
  mfg="58MV 660 006"
  availability={<InventoryLine branchQty={2} branchName="Norristown, PA" allBranchesQty={12} />}
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
                availability={
                  <InventoryLine branchQty={2} branchName="Norristown, PA" allBranchesQty={12} />
                }
                actions={<Button size="sm">Add to Cart</Button>}
              />
            </div>
          </PreviewCode>
        </section>

        {/* ── Anatomy ── */}
        <section className="space-y-4">
          <H2 id="anatomy">Anatomy</H2>
          <p className="text-sm text-muted-foreground">
            A search results page is these pieces, top to bottom: the category-thumbnail strip, the
            one-row results header (title + count + view toggle), the always-on pinned filter bar,
            the applied-filter pills, and a grid of Product Cards or a stack of list rows — with
            the filter rail (branch, radius, facets) alongside them the whole way down.
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
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">CategoryThumbnails</code> for every search/PLP category strip so one change updates them all.</>,
              <>Preselect the active header store and keep it out of the applied-filter pills.</>,
              <>Put the title, the result count and the view toggle on one <code className="rounded bg-muted px-1 py-0.5 text-xs">ResultsHeader</code> row above the filter bar.</>,
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">FilterPill</code> for every removable applied facet, on <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;outline&quot;</code> under the results count.</>,
              <>Render Grid results with <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;ProductCard&gt;</code> and List results with <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;ProductListRow&gt;</code>.</>,
              <>Keep row/toggle actions on the shared <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Button&gt;</code> so hover/focus match everywhere.</>,
              <>Bind the pinned bar and the left rail to one selection map, and pin only the four or five facets that actually narrow the set.</>,
            ]}
            donts={[
              <>Render category thumbnails as circles (<code className="rounded bg-muted px-1 py-0.5 text-xs">rounded-full</code>) or on a bespoke radius — they&apos;re square tiles on the small radius token.</>,
              <>Make Clear All a solid button — it&apos;s a text link (<code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;link&quot;</code>).</>,
              <>Turn the preselected branch into a pill the user has to remove.</>,
              <>Build a bespoke result row per category — compose <code className="rounded bg-muted px-1 py-0.5 text-xs">ProductListRow</code>.</>,
              <>Hang a Compare checkbox or a spec/attribute grid off a list row — the row is the whole card. (The Family Table may host it as an expanded row; it never adds controls to it.)</>,
              <>Let Grid and List both read as selected; they&apos;re mutually exclusive.</>,
              <>Drop the left rail when you add the pinned bar, give the dropdowns ragged widths, or hide every facet behind one &ldquo;Filters&rdquo; button.</>,
              <>Wrap the results-page filter row in a grey inset box, or hand-roll a second title/count/toggle row under it.</>,
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
              { label: "PLP — Residential Category (Nov 17)", href: "/search?brand=homans&category=residential&signedin=1&rev=nov17" },
              { label: "PLP — Search Results (Nov 17)", href: "/search?q=blower%20motor&signedin=1&rev=nov17" },
              { label: "PLP — Residential Category (Nov 10)", href: "/search?brand=homans&category=residential&signedin=1" },
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
