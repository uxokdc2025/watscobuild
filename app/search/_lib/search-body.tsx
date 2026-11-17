"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Fan, Flame, Package, Snowflake, Thermometer, Wind, Wrench } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { PageContainer } from "@/components/ui/page-container";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductGrid } from "@/components/ui/product-grid";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  CategoryThumbnails,
  type CategoryThumbnailItem,
} from "@/components/ui/category-thumbnails";

import {
  ProductCard as CanonicalProductCard,
  type ProductCardData,
} from "@/app/pdp/_lib/product-card";
import type { SearchResult } from "./mock-data";
import { MoreOptionsCard } from "@/components/ui/more-options-card";
import {
  PlpTopFilterBar,
  TopFilterChips,
  type TopFilterChip,
  type TopFilterFacet,
  type TopFilterSelection,
} from "@/components/ui/plp-top-filters";
import { ResultsHeader, ResultsViewToggle } from "@/components/ui/plp-results-header";
import { productImageFor } from "./product-images";
import { FamilyListView } from "./family-list-view";
import { tableConfigFor } from "./family-table-config";

const STOCK_LOCATIONS = [
  { value: "your-branch", label: "Your Store" },
  { value: "nearby", label: "Nearby Branches" },
  { value: "all", label: "All Branches" },
] as const;

export type StockLocationValue = (typeof STOCK_LOCATIONS)[number]["value"];

/** Product count per "Stocked At" scope — ONE source of truth, shared by the
 *  facet rail and the results-grid end card so the two can never disagree. */
export type StockedAtCounts = Record<StockLocationValue, number>;

/* ------------------------------------------------------------------ *
 * Facet definitions
 * ------------------------------------------------------------------ */

type FacetGroupSpec = {
  key: keyof Pick<SearchResult, "amps" | "basisOfRotationView" | "bearingType" | "capacitorMfdF">;
  label: string;
  options: string[];
  seeMore?: boolean;
};

const FACET_GROUPS: FacetGroupSpec[] = [
  {
    key: "amps",
    label: "Amps",
    options: ["2", "3", "4", "15", "0.53"],
    seeMore: true,
  },
  {
    key: "basisOfRotationView",
    label: "Basis Of Rotation View",
    options: ["Drive End", "Lead End", "Shaft End"],
  },
  {
    key: "bearingType",
    label: "Bearing Type",
    options: ["Ball", "Self Aligning (SAB)", "Sleeve"],
  },
  {
    key: "capacitorMfdF",
    label: "Capacitor Mfd F",
    options: ["5", "7.5", "10", "15"],
  },
];

const BRANDS_FACET = [
  "DiversiTech®",
  "Factory Authorized Parts",
  "Genteq®",
  "Non-Branded",
  "TOTALINE®",
];

/* Real Homans Residential category brands (from the live facet rail). */
const RESIDENTIAL_BRANDS = [
  "Armstrong Air®",
  "Bryant®",
  "Payne®",
  "Mitsubishi Electric®",
  "Goodman®",
  "Honeywell®",
];

/* The full Residential filter rail scraped from homans.com — the real facet
   groups and representative options. Rendered on category pages (Brand first,
   everything else collapsed). */
type StaticFacet = { label: string; options: { name: string; count: number }[]; seeMore?: boolean };
const RESIDENTIAL_FACETS: StaticFacet[] = [
  { label: "Promotions", options: [ { name: "On Sale", count: 42 }, { name: "Rebate Eligible", count: 88 }, { name: "Clearance", count: 15 } ] },
  { label: "Tonnage", options: [ { name: "1.5 Ton", count: 46 }, { name: "2 Ton", count: 92 }, { name: "2.5 Ton", count: 88 }, { name: "3 Ton", count: 95 }, { name: "3.5 Ton", count: 61 }, { name: "4 Ton", count: 58 }, { name: "5 Ton", count: 40 } ], seeMore: true },
  { label: "SEER2", options: [ { name: "13.4", count: 72 }, { name: "14", count: 95 }, { name: "15", count: 83 }, { name: "16", count: 51 }, { name: "18", count: 24 } ] },
  { label: "SEER", options: [ { name: "13", count: 40 }, { name: "14", count: 121 }, { name: "15", count: 78 }, { name: "16", count: 33 } ] },
  { label: "Stage", options: [ { name: "Single Stage", count: 214 }, { name: "Two Stage", count: 58 }, { name: "Variable Speed", count: 31 } ] },
  { label: "Refrigerant", options: [ { name: "R-454B", count: 268 }, { name: "R-410A", count: 96 }, { name: "R-32", count: 12 } ] },
  { label: "Fuel Type", options: [ { name: "Natural Gas", count: 153 }, { name: "Oil", count: 20 }, { name: "Electric", count: 118 }, { name: "Propane", count: 44 } ] },
  { label: "Product Family", options: [ { name: "Legacy™", count: 96 }, { name: "Preferred™", count: 58 }, { name: "OMNI", count: 74 } ] },
  { label: "Air Flow Direction", options: [ { name: "Upflow", count: 88 }, { name: "Downflow", count: 62 }, { name: "Horizontal", count: 71 }, { name: "Multipoise", count: 49 } ] },
  { label: "Voltage", options: [ { name: "115V", count: 24 }, { name: "208/230V", count: 288 }, { name: "460V", count: 31 } ] },
  { label: "Phase", options: [ { name: "Single Phase", count: 312 }, { name: "Three Phase", count: 36 } ] },
  { label: "AFUE", options: [ { name: "80%", count: 58 }, { name: "90%", count: 42 }, { name: "92%", count: 31 }, { name: "96%", count: 22 } ] },
  { label: "HSPF2", options: [ { name: "7.5", count: 33 }, { name: "8.1", count: 28 }, { name: "8.5", count: 19 } ] },
  { label: "EER2", options: [ { name: "11", count: 61 }, { name: "12", count: 44 }, { name: "13", count: 18 } ] },
  { label: "CFM", options: [ { name: "800", count: 38 }, { name: "1200", count: 66 }, { name: "1600", count: 59 }, { name: "2000", count: 41 } ] },
  { label: "BTU Input", options: [ { name: "45,000", count: 24 }, { name: "70,000", count: 48 }, { name: "100,000", count: 33 } ] },
  { label: "BTU Output", options: [ { name: "36,000", count: 31 }, { name: "60,000", count: 52 }, { name: "90,000", count: 28 } ] },
  { label: "Cooling Rated Capacity (Btu/h)", options: [ { name: "24,000", count: 46 }, { name: "36,000", count: 95 }, { name: "48,000", count: 58 }, { name: "60,000", count: 40 } ] },
  { label: "Multi Zone", options: [ { name: "Single Zone", count: 198 }, { name: "Multi Zone", count: 86 } ] },
  { label: "Number of HVAC Zones", options: [ { name: "1", count: 198 }, { name: "2", count: 44 }, { name: "3", count: 28 }, { name: "4+", count: 14 } ] },
  { label: "Built-In Wi-Fi", options: [ { name: "Yes", count: 72 }, { name: "No", count: 276 } ] },
  { label: "A2L Compatible", options: [ { name: "Yes", count: 268 }, { name: "No", count: 80 } ] },
  { label: "Mounting Type", options: [ { name: "Wall", count: 134 }, { name: "Ceiling", count: 38 }, { name: "Floor", count: 92 } ] },
  { label: "Color", options: [ { name: "Beige", count: 142 }, { name: "Gray", count: 96 }, { name: "White", count: 110 } ] },
  { label: "Amps", options: [ { name: "15", count: 61 }, { name: "20", count: 88 }, { name: "30", count: 72 }, { name: "40", count: 44 } ] },
  { label: "Kilowatt (KW)", options: [ { name: "5", count: 33 }, { name: "8", count: 41 }, { name: "10", count: 36 }, { name: "15", count: 22 } ] },
  { label: "Liquid Line Size (OD)", options: [ { name: "3/8\"", count: 112 }, { name: "1/2\"", count: 88 } ] },
  { label: "Suction Line Size (OD)", options: [ { name: "3/4\"", count: 96 }, { name: "7/8\"", count: 74 } ] },
  { label: "Fitting Type", options: [ { name: "Sweat", count: 128 }, { name: "Flare", count: 62 } ] },
];

/* The category rail as one ordered list — Brand first, then every scraped
   facet group. The sidebar and the pinned top bar both read this, so a
   facet checked in one shows as checked in the other. */
const CATEGORY_FACETS: StaticFacet[] = [
  { label: "Brand", options: RESIDENTIAL_BRANDS.map((name) => ({ name, count: 0 })), seeMore: true },
  ...RESIDENTIAL_FACETS,
];

/* Which facets get pinned to the top bar. Everything else stays one click
   away behind "More filters". Keys match the facet keys built below. */
const PINNED_CATEGORY_FACETS = ["Brand", "Tonnage", "SEER2", "Refrigerant", "Product Family"];
const PINNED_SEARCH_FACETS = ["brand", "amps", "bearingType", "capacitorMfdF", "basisOfRotationView"];

/** Shared empty set so unselected facets keep a stable prop identity. */
const NO_SELECTION: ReadonlySet<string> = new Set<string>();

/* ------------------------------------------------------------------ *
 * Body
 * ------------------------------------------------------------------ */

type SearchBodyProps = {
  query: string;
  /** When set, the page renders as a category listing (breadcrumb + H1). */
  category?: string;
  /**
   * Category slug — picks the List view's column config out of
   * CATEGORY_TABLE_CONFIG. Omitted falls back to the parts/motor columns.
   */
  categorySlug?: string;
  /**
   * Which view the page opens on. Grid stays the default; `?view=list` makes
   * the family-table view deep-linkable for review and QA.
   */
  initialView?: "grid" | "list";
  results: SearchResult[];
  totalResults: number;
  pageSize: number;
  signedIn: boolean;
  /** Hidden field name/value pairs preserved when the Sign-in link submits. */
  hiddenSearchFields?: { name: string; value: string }[];
  /** Store name shown in the "Stocked At" facet. */
  storeName?: string;
  /**
   * Real product count per "Stocked At" scope. Feeds the facet rail counts AND
   * the results-grid end card ("Want more options?"), which only renders
   * when a page knows these — there is nothing honest to offer otherwise.
   */
  stockedAtCounts?: StockedAtCounts;
  /** Renders the branch-scoped facet count first. */
  branchName?: string;
  /** Brand key — picks the correct image manifest for product cards. */
  brandKey: string;
  /**
   * Availability filter treatment for the top grey-box section.
   * "radio" (default) = the current "Stocked At" RadioGroup.
   * "checkbox" = a "Shop By Availability" checkbox stack (Peirce-Phelps style).
   */
  availabilityVariant?: "radio" | "checkbox";
  /**
   * Which revision of the search chrome to render. `nov10` (the default)
   * keeps the state reviewed on Nov 10 so existing links stay honest;
   * `nov17` is the reviewed punch-list chrome — one header row (title +
   * count + view toggle) above a container-less filter bar, with the applied
   * filters as outlined white pills underneath.
   */
  rev?: "nov10" | "nov17";
};

/* Real Residential subcategories + live counts, grabbed from homans.com — fed
   into our existing Categories facet (our pattern, real data). */
/* Category impact design: the shared category-thumbnail strip above the PLP
   grid — square tiles on the small corner-radius token (see
   `@/components/ui/category-thumbnails`). Each tile carries a real product
   image when we have one, else a tinted tile + category icon as a
   placeholder until the full image set is built. */
const CATEGORY_TILES: CategoryThumbnailItem[] = [
  { label: "Air Conditioner", Icon: Snowflake, image: "/category-tiles/air-conditioner.webp", href: "/category/air-conditioners?signedin=1" },
  { label: "Heat Pump", Icon: Thermometer, image: "/category-tiles/heat-pump.webp" },
  { label: "Gas Furnace", Icon: Flame, image: "/category-tiles/gas-furnace.webp" },
  { label: "Air Handler", Icon: Fan, image: "/category-tiles/air-handler.webp" },
  { label: "Evaporator Coil", Icon: Snowflake, image: "/category-tiles/evaporator-coil.webp" },
  { label: "Ductless", Icon: Wind, image: "/category-tiles/ductless.webp" },
  { label: "Oil Furnace", Icon: Flame, image: "/category-tiles/oil-furnace.webp" },
  { label: "Small Packaged", Icon: Package, image: "/category-tiles/small-packaged.webp" },
  { label: "Accessories", Icon: Wrench, image: "/category-tiles/accessories.webp" },
];

/** A collapsible facet for the real Residential filter rail, whose options
 *  aren't tied to result fields. Selection is controlled by the page so the
 *  rail and the pinned top filter bar stay in sync. */
function StaticFacetGroup({
  facet,
  open = false,
  selected,
  onToggle,
}: {
  facet: StaticFacet;
  open?: boolean;
  selected: ReadonlySet<string>;
  onToggle: (option: string) => void;
}) {
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? facet.options : facet.options.slice(0, 6);
  const id = facet.label.replace(/\s+/g, "-").toLowerCase();
  return (
    <section aria-labelledby={`facet-${id}-heading`} className="space-y-2 pt-4">
      <details {...(open ? { open: true } : {})} className="group">
        <summary className="flex cursor-pointer items-center justify-between border-b border-border/70 pb-3 font-semibold">
          <span id={`facet-${id}-heading`}>{facet.label}</span>
          <ChevronDown className="size-4 opacity-70 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-2 space-y-2">
          {visible.map((opt) => {
            const oid = `facet-${id}-${opt.name}`.replace(/[^\w-]/g, "-");
            return (
              <li key={opt.name} className="flex items-center justify-between gap-2">
                <label htmlFor={oid} className="flex flex-1 items-center gap-2">
                  <Checkbox
                    id={oid}
                    aria-label={opt.name}
                    checked={selected.has(opt.name)}
                    onCheckedChange={() => onToggle(opt.name)}
                  />
                  <span>{opt.name}</span>
                </label>
                {opt.count > 0 ? (
                  <span className="text-xs text-muted-foreground">({opt.count})</span>
                ) : null}
              </li>
            );
          })}
        </ul>
        {facet.seeMore && facet.options.length > 6 ? (
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="mt-3 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            {showAll ? "See Less" : "See More"}
          </button>
        ) : null}
      </details>
    </section>
  );
}

export function SearchBody({
  query,
  category,
  categorySlug,
  results,
  totalResults,
  pageSize,
  signedIn,
  hiddenSearchFields = [],
  storeName = "Manchester, NH - Homans",
  stockedAtCounts,
  branchName,
  brandKey,
  availabilityVariant = "radio",
  initialView = "grid",
  rev = "nov10",
}: SearchBodyProps) {
  const nov17 = rev === "nov17";
  const [view, setView] = React.useState<"grid" | "list">(initialView);
  const [stockLocation, setStockLocation] = React.useState<StockLocationValue>("your-branch");
  // One selection map for every facet, keyed by facet key (search results) or
  // facet label (category rail). The sidebar and the top bar both drive it.
  const [selectedFacets, setSelectedFacets] = React.useState<TopFilterSelection>({});
  // Checkbox-variant "Shop By Availability" state — demo-only, all default checked.
  const [pickUpToday, setPickUpToday] = React.useState(true);
  const [branchAvailability, setBranchAvailability] = React.useState(true);
  const [allStoresAvailability, setAllStoresAvailability] = React.useState(true);

  const displayName = branchName ?? storeName.split(" - ")[0];
  const displayLocations = React.useMemo(
    () => STOCK_LOCATIONS.map((loc) => loc.value === "your-branch" ? { ...loc, label: storeName } : loc),
    [storeName],
  );
  // "Stocked At" counts — one source of truth for the facet rail and the grid
  // end card. Pages that know their real per-scope counts pass them in; the
  // rest keep the long-standing placeholder treatment, where only "All
  // Branches" carries a count.
  const stockCounts: StockedAtCounts = stockedAtCounts ?? {
    "your-branch": 0,
    nearby: 0,
    all: totalResults,
  };

  // ── Results-grid end card ──
  // "Want more options?" is the last tile in the grid, after the final
  // product on the last page. Pagination here is static (the grid always
  // renders page 1), so that means the single-page case. It offers only the
  // scopes holding strictly MORE products than the selected one — when none
  // do, there are no more options and the card drops out of the grid.
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const selectedScopeLabel =
    displayLocations.find((loc) => loc.value === stockLocation)?.label ?? storeName;
  const widerScopes = displayLocations.filter(
    (loc) => stockCounts[loc.value] > stockCounts[stockLocation],
  );
  const showEndCard = stockedAtCounts != null && totalPages === 1 && widerScopes.length > 0;

  // Counts for facets — derived from the visible mock set for realism.
  const facetCount = React.useCallback(
    (key: FacetGroupSpec["key"], option: string) => {
      return results.filter((r) => r[key] === option).length;
    },
    [results],
  );

  const brandCount = React.useCallback(
    (brandName: string) => results.filter((r) => r.brand === brandName).length,
    [results],
  );

  const toggleFacet = React.useCallback((group: string, option: string) => {
    setSelectedFacets((prev) => {
      const next = { ...prev };
      const set = new Set(next[group] ?? []);
      if (set.has(option)) set.delete(option);
      else set.add(option);
      if (set.size) next[group] = set;
      else delete next[group];
      return next;
    });
  }, []);

  const clearFacet = React.useCallback((group: string) => {
    setSelectedFacets((prev) => {
      if (!prev[group]) return prev;
      const next = { ...prev };
      delete next[group];
      return next;
    });
  }, []);

  const clearAllFilters = () => {
    setStockLocation("all");
    setSelectedFacets({});
  };

  /* Every facet as the top bar wants it. Category pages use the real
     Residential rail; search uses the result-driven groups plus Brand. */
  const allTopFacets = React.useMemo<TopFilterFacet[]>(() => {
    if (category) {
      return CATEGORY_FACETS.map((facet) => ({
        key: facet.label,
        label: facet.label,
        options: facet.options.map((opt) =>
          opt.count > 0 ? { name: opt.name, count: opt.count } : { name: opt.name },
        ),
      }));
    }
    return [
      ...FACET_GROUPS.map((group) => ({
        key: group.key as string,
        label: group.label,
        options: group.options.map((opt) => ({ name: opt, count: facetCount(group.key, opt) || 1 })),
      })),
      {
        key: "brand",
        label: "Brand",
        options: BRANDS_FACET.map((name) => ({ name, count: brandCount(name) || 1 })),
      },
    ];
  }, [category, facetCount, brandCount]);

  const pinnedTopFacets = React.useMemo<TopFilterFacet[]>(() => {
    const order = category ? PINNED_CATEGORY_FACETS : PINNED_SEARCH_FACETS;
    const byKey = new Map(allTopFacets.map((facet) => [facet.key, facet]));
    const pinned = order
      .map((key) => byKey.get(key))
      .filter((facet): facet is TopFilterFacet => Boolean(facet));
    return pinned.length ? pinned : allTopFacets.slice(0, 5);
  }, [allTopFacets, category]);

  const facetLabels = React.useMemo(() => {
    const labels: Record<string, string> = {};
    for (const facet of allTopFacets) labels[facet.key] = facet.label;
    return labels;
  }, [allTopFacets]);

  /* Applied-filter chips. With the top bar on, chips carry the facet name
     too — "Tonnage: 3 Ton" — because a bare "3 Ton" loses its group once the
     facets are no longer read top-to-bottom down a rail. */
  const appliedChips = React.useMemo<TopFilterChip[]>(
    () =>
      Object.entries(selectedFacets).flatMap(([facetKey, options]) =>
        Array.from(options).map((option) => ({
          facetKey,
          option,
          label: `${facetLabels[facetKey] ?? facetKey}: ${option}`,
        })),
      ),
    [selectedFacets, facetLabels],
  );

  return (
    <>
      {/* Breadcrumb — the site-chrome search bar carries the query, no
          second search input on the results page. */}
      <PageContainer asChild>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 pt-6 text-sm text-muted-foreground"
        >
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <ChevronRight className="size-3.5 opacity-60" />
          <span>{category ? category : <>Search For &ldquo;{query}&rdquo;</>}</span>
        </nav>
      </PageContainer>

      {/* Page width, side margins and the results grid all come from the
          layout tokens — see /components/grid. */}
      <PageContainer className="pt-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[var(--layout-sidebar)_minmax(0,1fr)]">
          {/* Facet sidebar */}
          <aside aria-label="Filters" className="space-y-5 text-sm">
            {availabilityVariant === "checkbox" ? (
              <section aria-labelledby="availability-heading" className="space-y-1 rounded-md bg-muted/50 p-4">
                <h2 id="availability-heading" className="pb-2 font-semibold">Shop By Availability</h2>
                {/* Parent — Pick Up Today */}
                <label
                  htmlFor="avail-pickup-today"
                  className="flex min-h-9 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-background/70"
                >
                  <Checkbox
                    id="avail-pickup-today"
                    aria-label="Pick Up Today"
                    checked={pickUpToday}
                    onCheckedChange={(v) => setPickUpToday(v === true)}
                  />
                  <span className="font-medium">Pick Up Today</span>
                </label>
                {/* Nested — this branch + all stores */}
                <div className="space-y-0.5 pl-6">
                  <label
                    htmlFor="avail-branch"
                    className="flex min-h-9 items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-background/70"
                  >
                    <span className="flex items-center gap-2">
                      <Checkbox
                        id="avail-branch"
                        aria-label={displayName}
                        checked={branchAvailability}
                        onCheckedChange={(v) => setBranchAvailability(v === true)}
                      />
                      <span>{displayName}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">(5)</span>
                  </label>
                  <Link href="/store-locator/in-plp?v=c" className="block pl-8 text-xs font-medium text-primary hover:underline">
                    Change
                  </Link>
                  <label
                    htmlFor="avail-all-stores"
                    className="flex min-h-9 items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-background/70"
                  >
                    <span className="flex items-center gap-2">
                      <Checkbox
                        id="avail-all-stores"
                        aria-label="All Stores"
                        checked={allStoresAvailability}
                        onCheckedChange={(v) => setAllStoresAvailability(v === true)}
                      />
                      <span>All Stores</span>
                    </span>
                    <span className="text-xs text-muted-foreground">({totalResults})</span>
                  </label>
                </div>
              </section>
            ) : (
              <section aria-labelledby="stocked-at-heading" className="space-y-1 rounded-md bg-muted/50 p-4">
                <h2 id="stocked-at-heading" className="pb-2 font-semibold">Stocked At</h2>
                <RadioGroup
                  value={stockLocation}
                  onValueChange={(value) => setStockLocation(value as StockLocationValue)}
                  className="space-y-0.5"
                >
                  {displayLocations.map((location) => (
                    <React.Fragment key={location.value}>
                      <label
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          stockLocation === location.value ? "bg-background font-medium shadow-sm" : "hover:bg-background/70",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <RadioGroupItem value={location.value} id={`loc-${location.value}`} aria-label={location.label} />
                          <span>{location.label}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">({stockCounts[location.value].toLocaleString()})</span>
                      </label>
                      {/* Change sits directly under the current ("Your Store") row */}
                      {location.value === "your-branch" ? (
                        <Link href="/store-locator/in-plp?v=c" className="block pl-8 text-xs font-medium text-primary hover:underline">
                          Change
                        </Link>
                      ) : null}
                    </React.Fragment>
                  ))}
                </RadioGroup>
              </section>
            )}

            {/* Categories facet — hidden on category pages, where the
                category-thumbnail strip on top already presents the
                categories. */}
            {!category ? (
              <section aria-labelledby="categories-heading" className="space-y-2 pt-4">
                <h2 id="categories-heading" className="border-b border-border/70 pb-3 font-semibold">
                  Categories
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between gap-2 text-sm">
                    <span className="cursor-pointer text-primary hover:underline">
                      Parts Service &amp; Electrical
                    </span>
                    <span className="text-xs text-muted-foreground">({totalResults})</span>
                  </li>
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="narrow-heading" className="mb-2 rounded-sm bg-neutral-500 px-3 py-2 text-white">
              <h2 id="narrow-heading" className="text-xs font-bold tracking-wide text-white uppercase">
                Narrow Your Results
              </h2>
            </section>

            {category ? (
              /* Category pages show the real Residential filter rail — Brand
                 first and open, every other filter collapsed. */
              <>
                {CATEGORY_FACETS.map((f, i) => (
                  <StaticFacetGroup
                    key={f.label}
                    facet={f}
                    open={i === 0}
                    selected={selectedFacets[f.label] ?? NO_SELECTION}
                    onToggle={(option) => toggleFacet(f.label, option)}
                  />
                ))}
              </>
            ) : (
              <>
                {FACET_GROUPS.map((group) => (
                  <FacetGroup
                    key={group.key}
                    spec={group}
                    results={results}
                    selected={selectedFacets[group.key] ?? NO_SELECTION}
                    onToggle={(opt) => toggleFacet(group.key, opt)}
                    count={facetCount}
                  />
                ))}
                <section aria-labelledby="brand-facet-heading" className="space-y-2 pt-4">
                  <details open>
                    <summary className="flex cursor-pointer items-center justify-between border-b border-border/70 pb-3 font-semibold">
                      <span id="brand-facet-heading">Brand</span>
                      <ChevronDown className="size-4 opacity-70 transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="mt-2 space-y-2">
                      {BRANDS_FACET.map((b) => {
                        const id = `brand-${b}`;
                        return (
                          <li key={b} className="flex items-center justify-between gap-2">
                            <label htmlFor={id} className="flex flex-1 items-center gap-2">
                              <Checkbox
                                id={id}
                                aria-label={b}
                                checked={(selectedFacets.brand ?? NO_SELECTION).has(b)}
                                onCheckedChange={() => toggleFacet("brand", b)}
                              />
                              <span>{b}</span>
                            </label>
                            <span className="text-xs text-muted-foreground">
                              ({brandCount(b) || 1})
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      type="button"
                      className="mt-3 text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      See More
                    </button>
                  </details>
                </section>
              </>
            )}
          </aside>

          {/* Results grid or list */}
          <section aria-label="Search results" className="flex min-w-0 flex-col gap-4">
            {/* The shared category-thumbnail strip sits at the top of the
                content column so it lines up with the category H1 (not over
                the sidebar). Category pages only. */}
            {category ? (
              <CategoryThumbnails
                items={CATEGORY_TILES}
                href={`/search?brand=${brandKey}&category=residential&signedin=1${nov17 ? "&rev=nov17" : ""}`}
              />
            ) : null}
            {/* ── Nov 17 search chrome ──
                One header row: title + result count in a smaller font + the
                Grid/List toggle on the right end, sitting ABOVE the filter
                bar. The filter bar loses its inset box, and the applied
                filters follow underneath as outlined white pills. */}
            {nov17 ? (
              <ResultsHeader
                title={category ?? <>Search Results for &ldquo;{query}&rdquo;</>}
                count={totalResults}
                actions={<ResultsViewToggle value={view} onChange={setView} />}
              />
            ) : null}
            {/* Category H1 sits on top of the grid (not over the sidebar). */}
            {!nov17 && category ? (
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{category}</h1>
            ) : null}
            {/* Pinned filter bar — always on. Sits above the grid and shares
                one selection with the left rail, which stays put. */}
            <PlpTopFilterBar
              facets={pinnedTopFacets}
              allFacets={allTopFacets}
              selected={selectedFacets}
              onToggle={toggleFacet}
              onClearFacet={clearFacet}
              onClearAll={clearAllFilters}
              resultCount={totalResults}
              variant={nov17 ? "plain" : "inset"}
            />
            {/* Results toolbar — heading + view toggle. The Nov 17 chrome
                folds both into the header row above the filter bar. */}
            {nov17 ? null : (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {category ? (
                  <h2 className="text-lg font-semibold tracking-tight">
                    Shop <span className="font-bold">{totalResults.toLocaleString()}</span> results
                  </h2>
                ) : (
                  <h1 className="text-lg font-semibold tracking-tight">
                    Shop <span className="font-bold">{totalResults.toLocaleString()}</span> results for &ldquo;{query}&rdquo;
                  </h1>
                )}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <ResultsViewToggle value={view} onChange={setView} />
                </div>
              </div>
            )}
            <TopFilterChips
              items={appliedChips}
              onRemove={(chip) => toggleFacet(chip.facetKey, chip.option)}
              onClearAll={clearAllFilters}
              variant={nov17 ? "outline" : "solid"}
            />
            {view === "grid" ? (
              <ProductGrid>
                {results.map((r, i) => (
                  <li key={r.id}>
                    <ProductCard result={r} signedIn={signedIn} index={i} brandKey={brandKey} />
                  </li>
                ))}
                {showEndCard ? (
                  <li>
                    <MoreOptionsCard
                      branchName={selectedScopeLabel}
                      shownCount={stockCounts[stockLocation]}
                      scopes={widerScopes.map((loc) => ({
                        label: loc.label,
                        count: stockCounts[loc.value],
                        onSelect: () => setStockLocation(loc.value),
                      }))}
                    />
                  </li>
                ) : null}
              </ProductGrid>
            ) : (
              // Family tables — results grouped by product family, sub-grouped
              // by a key attribute, each row expanding in place. Columns come
              // from the per-category config map, never from this component.
              <FamilyListView
                results={results}
                signedIn={signedIn}
                brandKey={brandKey}
                storeName={storeName}
                config={tableConfigFor(categorySlug)}
              />
            )}

            <SearchPagination
              currentCount={results.length}
              totalCount={totalResults}
              pageSize={pageSize}
            />

            <p className="pt-6 text-xs text-muted-foreground">
              Showing {Math.min(pageSize, results.length)} of{" "}
              {totalResults.toLocaleString()} results for &ldquo;{query}&rdquo;.{" "}
              {signedIn ? null : (
                <>
                  <Link
                    href={`?${hiddenSearchFields
                      .map((f) => `${f.name}=${encodeURIComponent(f.value)}`)
                      .concat([`q=${encodeURIComponent(query)}`, `signedin=1`])
                      .join("&")}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign In
                  </Link>{" "}
                  to see pricing and inventory in {displayName}.
                </>
              )}
            </p>
          </section>
        </div>
      </PageContainer>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Facet group
 * ------------------------------------------------------------------ */

function FacetGroup({
  spec,
  selected,
  onToggle,
  count,
  open = true,
}: {
  spec: FacetGroupSpec;
  results: SearchResult[];
  selected: ReadonlySet<string>;
  onToggle: (option: string) => void;
  count: (key: FacetGroupSpec["key"], option: string) => number;
  /** Initial expanded state. Omitting `open` leaves the group collapsed and
      user-toggleable; passing it keeps the group expanded. */
  open?: boolean;
}) {
  return (
    <section aria-labelledby={`facet-${spec.key}-heading`} className="space-y-2 pt-4">
      <details {...(open ? { open: true } : {})} className="group">
        <summary className="flex cursor-pointer items-center justify-between border-b border-border/70 pb-3 font-semibold">
          <span id={`facet-${spec.key}-heading`}>{spec.label}</span>
          <ChevronDown className="size-4 opacity-70 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-2 space-y-2">
          {spec.options.map((opt) => {
            const id = `facet-${spec.key}-${opt}`.replace(/\s+/g, "-");
            return (
              <li key={opt} className="flex items-center justify-between gap-2">
                <label htmlFor={id} className="flex flex-1 items-center gap-2">
                  <Checkbox
                    id={id}
                    aria-label={opt}
                    checked={selected.has(opt)}
                    onCheckedChange={() => onToggle(opt)}
                  />
                  <span>{opt}</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  ({count(spec.key, opt) || 1})
                </span>
              </li>
            );
          })}
        </ul>
        {spec.seeMore ? (
          <button
            type="button"
            className="mt-3 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            See More
          </button>
        ) : null}
      </details>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Product cards (grid view)
 *
 * The List view no longer renders one flat row per SKU — it renders the
 * family-table pattern (see ./family-list-view). Grid is unchanged.
 * ------------------------------------------------------------------ */

/** PLP tile — delegates to the canonical ProductCard (app/pdp/_lib) so
 *  the vertical slot structure (points chip → title → item/mfg → badges
 *  → % → your branch → nearby → price → qty/add → save) matches PDP FBT
 *  and Customers Also Purchased. Even though PLP cards are narrower, the
 *  slot order and heights are shared. */
function ProductCard({
  result,
  signedIn,
  index,
  brandKey,
}: {
  result: SearchResult;
  signedIn: boolean;
  index: number;
  brandKey: string;
}) {
  const imageSrc = productImageFor(brandKey, index, result.image);
  const isContact = result.contactForAvailability === true;
  const yourBranchQty = isContact
    ? undefined
    : result.stockStatus === "out-of-stock"
      ? 0
      : 2;
  const nearbyBranchQty = isContact ? undefined : (result.allBranchesQty ?? 0);
  const cardData: ProductCardData = {
    id: result.id,
    brand: result.brand,
    title: result.title,
    item: result.item,
    mfg: result.mfg,
    image: imageSrc,
    price: result.price ?? null,
    points: result.points,
    yourBranchQty,
    nearbyBranchQty,
    contactForAvailability: isContact,
    contactVariant: result.contactVariant,
    href: result.href ?? `/pdp/tradepro-${result.item.toLowerCase()}`,
  };
  return <CanonicalProductCard data={cardData} signedIn={signedIn} />;
}


/* ------------------------------------------------------------------ *
 * Pagination — the design-system Pagination (components/ui/pagination,
 * documented at /components/navigation#pagination). The current page uses
 * `isActive`; Previous / Next are disabled at either end.
 * ------------------------------------------------------------------ */

function SearchPagination({
  currentCount,
  totalCount,
  pageSize,
}: {
  currentCount: number;
  totalCount: number;
  pageSize: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const [page, setPage] = React.useState(1);
  if (currentCount === 0) return null;

  // Up to five page numbers around the current page, then an ellipsis.
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const go = (n: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setPage(Math.min(totalPages, Math.max(1, n)));
  };
  const disabled = "pointer-events-none opacity-50";

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={go(page - 1)}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
            className={cn(page === 1 && disabled)}
          />
        </PaginationItem>
        {pageNumbers.map((n) => (
          <PaginationItem key={n}>
            <PaginationLink href="#" isActive={n === page} onClick={go(n)}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        {end < totalPages ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={go(page + 1)}
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : undefined}
            className={cn(page === totalPages && disabled)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
