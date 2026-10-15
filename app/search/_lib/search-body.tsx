"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Fan, Flame, ImageOff, Info, LayoutGrid, List as ListIcon, ListPlus, Package, ShoppingCart, Snowflake, Thermometer, Wind, Wrench, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/pdp/_lib/types";

import {
  ProductCard as CanonicalProductCard,
  type ProductCardData,
} from "@/app/pdp/_lib/product-card";
import type { SearchResult } from "./mock-data";
import { useCart } from "@/components/cart/cart-context";
import { FilterPill } from "@/components/ui/plp-filters";

const STOCK_LOCATIONS = [
  { value: "your-branch", label: "Your Store" },
  { value: "nearby", label: "Nearby Branches" },
  { value: "all", label: "All Branches" },
] as const;

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

/* ------------------------------------------------------------------ *
 * Body
 * ------------------------------------------------------------------ */

type SearchBodyProps = {
  query: string;
  /** When set, the page renders as a category listing (breadcrumb + H1). */
  category?: string;
  results: SearchResult[];
  totalResults: number;
  pageSize: number;
  signedIn: boolean;
  /** Hidden field name/value pairs preserved when the Sign-in link submits. */
  hiddenSearchFields?: { name: string; value: string }[];
  /** Store name shown in the "Stocked At" facet. */
  storeName?: string;
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
};

/* Real Residential subcategories + live counts, grabbed from homans.com — fed
   into our existing Categories facet (our pattern, real data). */
/* Category impact design — V1: a horizontally-scrolling row of circular
   category tiles above the PLP grid (reference: Atwoods "Farm and Ranch").
   Each tile carries a real product image when we have one, else a tinted
   circle + category icon as a placeholder until the full image set is built. */
type CategoryTile = { label: string; Icon: LucideIcon; image?: string; href?: string };
const CATEGORY_TILES: CategoryTile[] = [
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

function CategoryScroller({ items, href }: { items: CategoryTile[]; href: string }) {
  return (
    <section aria-label="Shop by category" className="mb-5 border-b pb-4">
      <div>
        <ul className="flex snap-x gap-5 overflow-x-auto pb-3 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
          {items.map((it) => (
            <li key={it.label} className="snap-start">
              <Link
                href={it.href ?? href}
                aria-label={`Shop ${it.label}`}
                className="group flex w-28 shrink-0 flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                <span
                  className={cn(
                    // ring-inset so the ring draws INSIDE the circle — the
                    // scroll container's overflow:auto would clip an outset
                    // ring flat at the top (the "notch").
                    "grid size-24 place-items-center overflow-hidden rounded-full ring-1 ring-inset ring-border transition group-hover:ring-2 group-hover:ring-primary",
                    it.image ? "bg-white" : "bg-muted",
                  )}
                >
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt="" className="max-h-[82%] max-w-[82%] object-contain" loading="lazy" />
                  ) : (
                    <it.Icon className="size-9 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" />
                  )}
                </span>
                <span className="text-xs font-medium leading-snug text-foreground group-hover:text-primary">
                  {it.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A self-contained collapsible facet (its own checkbox state). Used for the
 *  real Residential filter rail, whose options aren't tied to result fields. */
function StaticFacetGroup({ facet, open = false }: { facet: StaticFacet; open?: boolean }) {
  const [checked, setChecked] = React.useState<Set<string>>(new Set());
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
                    checked={checked.has(opt.name)}
                    onCheckedChange={() =>
                      setChecked((prev) => {
                        const next = new Set(prev);
                        next.has(opt.name) ? next.delete(opt.name) : next.add(opt.name);
                        return next;
                      })
                    }
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
  results,
  totalResults,
  pageSize,
  signedIn,
  hiddenSearchFields = [],
  storeName = "Manchester, NH - Homans",
  branchName,
  brandKey,
  availabilityVariant = "radio",
}: SearchBodyProps) {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [stockLocation, setStockLocation] = React.useState<typeof STOCK_LOCATIONS[number]["value"]>("your-branch");
  const [selectedFacets, setSelectedFacets] = React.useState<Record<string, Set<string>>>({});
  const [selectedBrands, setSelectedBrands] = React.useState<Set<string>>(new Set());
  // Checkbox-variant "Shop By Availability" state — demo-only, all default checked.
  const [pickUpToday, setPickUpToday] = React.useState(true);
  const [branchAvailability, setBranchAvailability] = React.useState(true);
  const [allStoresAvailability, setAllStoresAvailability] = React.useState(true);

  const displayName = branchName ?? storeName.split(" - ")[0];
  const displayLocations = React.useMemo(
    () => STOCK_LOCATIONS.map((loc) => loc.value === "your-branch" ? { ...loc, label: storeName } : loc),
    [storeName],
  );
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

  const toggleFacet = (group: string, option: string) => {
    setSelectedFacets((prev) => {
      const next = { ...prev };
      const set = new Set(next[group] ?? []);
      if (set.has(option)) set.delete(option);
      else set.add(option);
      next[group] = set;
      return next;
    });
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  };

  const appliedFilters = [
    ...Object.entries(selectedFacets).flatMap(([group, options]) =>
      Array.from(options).map((option) => ({ key: `${group}-${option}`, label: option })),
    ),
    ...Array.from(selectedBrands).map((brand) => ({ key: `brand-${brand}`, label: brand })),
  ];

  const clearAllFilters = () => {
    setStockLocation("all");
    setSelectedFacets({});
    setSelectedBrands(new Set());
  };

  const removeFilter = (key: string) => {
    if (key.startsWith("location-")) {
      setStockLocation("all");
      return;
    }
    const [group, ...rest] = key.split("-");
    const option = rest.join("-");
    if (group === "brand") {
      toggleBrand(option);
      return;
    }
    toggleFacet(group, option);
  };

  return (
    <>
      {/* Breadcrumb — the site-chrome search bar carries the query, no
          second search input on the results page. */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-6xl items-center gap-2 px-4 pt-6 text-sm text-muted-foreground md:px-6"
      >
        <Link href="/" className="text-primary hover:underline">
          Home
        </Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <span>{category ? category : <>Search For &ldquo;{query}&rdquo;</>}</span>
      </nav>

      <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[256px_1fr]">
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
                  onValueChange={(value) => setStockLocation(value as typeof STOCK_LOCATIONS[number]["value"])}
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
                        <span className="text-xs text-muted-foreground">({location.value === "all" ? totalResults : 0})</span>
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

            {/* Categories facet — hidden on category pages, where the circular
                category scroller on top already presents the categories. */}
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
                <StaticFacetGroup
                  facet={{
                    label: "Brand",
                    options: RESIDENTIAL_BRANDS.map((b) => ({ name: b, count: 0 })),
                    seeMore: true,
                  }}
                  open
                />
                {RESIDENTIAL_FACETS.map((f) => (
                  <StaticFacetGroup key={f.label} facet={f} />
                ))}
              </>
            ) : (
              <>
                {FACET_GROUPS.map((group) => (
                  <FacetGroup
                    key={group.key}
                    spec={group}
                    results={results}
                    selected={selectedFacets[group.key] ?? new Set()}
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
                                checked={selectedBrands.has(b)}
                                onCheckedChange={() => toggleBrand(b)}
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
          <section aria-label="Search results" className="flex flex-col gap-4">
            {/* Category impact design V1 — circular category scroller sits at the
                top of the content column so it lines up with the category H1
                (not over the sidebar). Category pages only. */}
            {category ? (
              <CategoryScroller
                items={CATEGORY_TILES}
                href={`/search?brand=${brandKey}&category=residential&signedin=1`}
              />
            ) : null}
            {/* Category H1 sits on top of the grid (not over the sidebar). */}
            {category ? (
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{category}</h1>
            ) : null}
            {/* Results toolbar — heading + view toggle (the toggle moves into
                the sidebar on category pages). */}
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
              <div
                role="group"
                aria-label="Result view"
                className="inline-flex items-center gap-0.5 self-start rounded-md border bg-background p-0.5 md:self-auto"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className={cn(
                    "rounded-sm",
                    view === "grid"
                      ? "bg-[var(--tab-active-bg)] font-semibold text-[var(--tab-active-fg)] hover:bg-[var(--tab-active-bg)] hover:text-[var(--tab-active-fg)]"
                      : "text-muted-foreground"
                  )}
                >
                  <LayoutGrid /> Grid
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className={cn(
                    "rounded-sm",
                    view === "list"
                      ? "bg-[var(--tab-active-bg)] font-semibold text-[var(--tab-active-fg)] hover:bg-[var(--tab-active-bg)] hover:text-[var(--tab-active-fg)]"
                      : "text-muted-foreground"
                  )}
                >
                  <ListIcon /> List
                </Button>
              </div>
            </div>
            {appliedFilters.length ? (
              <div className="flex flex-wrap items-center gap-2">
                {appliedFilters.map((filter) => (
                  <FilterPill
                    key={filter.key}
                    label={filter.label}
                    onRemove={() => removeFilter(filter.key)}
                  />
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="ml-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Clear All
                </button>
              </div>
            ) : null}
            {view === "grid" ? (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 min-[1730px]:grid-cols-5">
                {results.map((r, i) => (
                  <li key={r.id}>
                    <ProductCard result={r} signedIn={signedIn} index={i} brandKey={brandKey} />
                  </li>
                ))}
              </ul>
            ) : (
              // True full-width horizontal list — one product per row, spanning
              // the content column. Rows are divided within a single card, using
              // the shared [image | details | actions] storefront row pattern.
              <ul className="divide-y overflow-hidden rounded-lg border bg-card">
                {results.map((r, i) => (
                  <li key={r.id}>
                    <ProductRow result={r} signedIn={signedIn} index={i} brandKey={brandKey} />
                  </li>
                ))}
              </ul>
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
      </div>
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
  selected: Set<string>;
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
 * Product cards (grid + list)
 * ------------------------------------------------------------------ */

/** Product photos captured from each distributor's search page. Per-brand list
 *  because extensions and counts differ (Homans: 24× webp — logo + spacer dropped;
 *  Peirce: 28× avif + 1× webp). */
const IMAGES_BY_BRAND: Record<string, string[]> = {
  homans: Array.from({ length: 24 }, (_, i) => `/homans-search/blower-motor-${(i + 1).toString().padStart(2, "0")}.webp`),
  peirce: [
    "/peirce-search/blower-motor-01.avif",
    "/peirce-search/blower-motor-02.avif",
    "/peirce-search/blower-motor-03.avif",
    "/peirce-search/blower-motor-04.avif",
    "/peirce-search/blower-motor-05.avif",
    "/peirce-search/blower-motor-06.avif",
    "/peirce-search/blower-motor-07.avif",
    "/peirce-search/blower-motor-08.avif",
    "/peirce-search/blower-motor-09.avif",
    "/peirce-search/blower-motor-10.avif",
    "/peirce-search/blower-motor-11.avif",
    "/peirce-search/blower-motor-12.avif",
    "/peirce-search/blower-motor-13.avif",
    "/peirce-search/blower-motor-14.avif",
    "/peirce-search/blower-motor-15.avif",
    "/peirce-search/blower-motor-16.avif",
    "/peirce-search/blower-motor-17.avif",
    "/peirce-search/blower-motor-18.avif",
    "/peirce-search/blower-motor-19.avif",
    "/peirce-search/blower-motor-20.avif",
    "/peirce-search/blower-motor-21.avif",
    "/peirce-search/blower-motor-22.avif",
    "/peirce-search/blower-motor-23.avif",
    "/peirce-search/blower-motor-24.avif",
    "/peirce-search/blower-motor-25.avif",
    "/peirce-search/blower-motor-26.avif",
    "/peirce-search/blower-motor-27.webp",
    "/peirce-search/blower-motor-28.avif",
    "/peirce-search/blower-motor-29.avif",
  ],
};

function productImageFor(brandKey: string, index: number, explicit?: string): string {
  if (explicit) return explicit;
  const list = IMAGES_BY_BRAND[brandKey] ?? IMAGES_BY_BRAND.homans;
  return list[index % list.length];
}

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

/** PLP list row — a TRUE full-width horizontal row spanning the content column.
 *  Canonical 3-zone storefront grid: [image 96px] [details flex-1] [actions,
 *  right-aligned] at sm+, matching the cart / checkout review / shopping-list
 *  rows. Below sm it stacks: image + details side-by-side on top, actions full
 *  width beneath (no horizontal overflow at 375px). Stock/price/contact logic is
 *  shared via StockLine + SignedInCommerce — never duplicated. */
function ProductRow({
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
  const href = result.href ?? `/pdp/tradepro-${result.item.toLowerCase()}`;
  const media = imageSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={result.title}
      loading="lazy"
      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
    />
  ) : (
    <ImageOff className="size-6 opacity-40" aria-hidden="true" />
  );
  const details = (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-primary">{result.brand}</p>
      <Link href={href} className="line-clamp-3 text-sm font-semibold leading-snug hover:text-primary hover:underline">
        {result.title}
      </Link>
      <p className="mt-1 truncate text-xs text-muted-foreground">
        Item: {result.item} · MFG: {result.mfg}
      </p>
    </div>
  );
  // Availability is its own column between the description and the CTAs — keeps
  // the description from sprawling and gives the row a clear middle.
  const availability = signedIn ? <StockLine result={result} /> : null;
  const signedOutActions = (
    <p className="text-sm">
      <span className="font-medium">Sign in</span>{" "}
      <span className="text-muted-foreground">for pricing.</span>
    </p>
  );
  return (
    <article className="p-4">
      {/* Desktop — [image] [capped description] [availability, centered] [actions].
          The description is capped so the title wraps (2–3 lines) instead of
          sprawling; availability takes the middle slack and centers between the
          description and the Add CTA. */}
      <div className="hidden grid-cols-[96px_minmax(0,340px)_minmax(0,1fr)_auto] items-center gap-5 sm:grid">
        <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
          {media}
        </div>
        {details}
        <div className="text-center text-sm">{availability}</div>
        <div className="justify-self-end">
          {signedIn ? (
            <SignedInCommerce result={result} align="right" showStock={false} />
          ) : (
            signedOutActions
          )}
        </div>
      </div>
      {/* Mobile — image + details side-by-side (availability beneath), actions full width */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-start gap-3">
          <div className="grid size-20 shrink-0 place-items-center self-start rounded-md bg-muted/40 p-1 text-muted-foreground">
            {media}
          </div>
          <div className="min-w-0 flex-1">
            {details}
            {availability ? <div className="mt-1.5 text-sm">{availability}</div> : null}
          </div>
        </div>
        <div>
          {signedIn ? (
            <SignedInCommerce result={result} align="left" showStock={false} />
          ) : (
            signedOutActions
          )}
        </div>
      </div>
    </article>
  );
}

function SignedInCommerce({
  result,
  align = "left",
  showStock = true,
}: {
  result: SearchResult;
  align?: "left" | "right";
  showStock?: boolean;
}) {
  const { addItem } = useCart();
  return (
    <div className={cn("space-y-1", align === "right" ? "text-right" : "text-left")}>
      {result.price != null ? (
        <p className="text-base font-semibold text-price">
          {formatUSD(result.price)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
        </p>
      ) : null}
      {result.points != null ? (
        <p className="text-xs font-medium text-[color:var(--violet)]">
          Earn {result.points.toLocaleString()} points
        </p>
      ) : null}
      {showStock ? <StockLine result={result} /> : null}
      {result.price != null ? (
        <>
          {/* Add to Cart — design-system primary Button (solid), with the cart
              icon. Matches the grid card's Add button. */}
          <Button
            size="sm"
            className="mt-2"
            onClick={() => addItem({
              id: result.id,
              title: result.title,
              brand: result.brand,
              image: result.image,
              price: result.price ?? 0,
            })}
          >
            <ShoppingCart className="size-4" />
            Add to Cart
          </Button>
          {/* Save to List — muted affordance below the Add button, mirroring the
              grid card's Save. */}
          <div className="pt-1">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ListPlus className="size-4" />
              Save
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StockLine({ result }: { result: SearchResult }) {
  // Homans "never shows out-of-stock": flagged rows swap every stock line
  // (including "Out of stock") for a single "Contact Us" link — or, on the
  // richer reference-style variant, for "Limited Availability" (info icon,
  // friendly low-stock token) plus the muted helper subline and a primary
  // "Contact Us" link directly underneath (same block).
  if (result.contactForAvailability) {
    if (result.contactVariant === "rich") {
      return (
        <div className="flex flex-col gap-0.5">
          <p className="inline-flex items-center gap-1 text-xs font-medium text-low-stock">
            <Info className="size-3.5 shrink-0" aria-hidden />
            Limited Availability
          </p>
          <p className="text-xs text-muted-foreground">
            Let us help you find this product.
          </p>
          <p className="text-xs font-medium">
            <a
              href="#"
              className="text-primary underline-offset-2 transition-colors hover:text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Contact Us
            </a>
          </p>
        </div>
      );
    }
    return (
      <p className="text-xs font-medium">
        <a
          href="#"
          className="text-primary underline-offset-2 transition-colors hover:text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Contact Us
        </a>
      </p>
    );
  }
  const status = result.stockStatus;
  if (!status) return null;
  if (status === "in-stock")
    return (
      <p className="text-xs font-medium text-in-stock">
        In stock · {result.allBranchesQty ?? 0} All Branches
      </p>
    );
  if (status === "low-stock")
    return (
      <p className="text-xs font-medium text-low-stock">
        Low stock · {result.allBranchesQty ?? 0} All Branches
      </p>
    );
  return (
    <p className="text-xs font-medium text-out-of-stock">Out of stock</p>
  );
}

/* ------------------------------------------------------------------ *
 * Pagination — matches source (Prev · 1 2 3 4 5 · Next)
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
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  if (currentCount === 0) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-1 text-sm"
    >
      <Button type="button" variant="outline" size="sm" disabled>
        Previous
      </Button>
      {pageNumbers.map((n) => (
        <Button
          key={n}
          type="button"
          variant="ghost"
          size="sm"
          aria-current={n === 1 ? "page" : undefined}
          className={cn(
            "min-w-9",
            n === 1 && "bg-accent text-accent-foreground hover:bg-accent"
          )}
        >
          {n}
        </Button>
      ))}
      <Button type="button" variant="outline" size="sm">
        Next
      </Button>
    </nav>
  );
}
