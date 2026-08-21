"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ImageOff, LayoutGrid, List as ListIcon, X } from "lucide-react";

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

/* ------------------------------------------------------------------ *
 * Body
 * ------------------------------------------------------------------ */

type SearchBodyProps = {
  query: string;
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
};

export function SearchBody({
  query,
  results,
  totalResults,
  pageSize,
  signedIn,
  hiddenSearchFields = [],
  storeName = "Manchester, NH - Homans",
  branchName,
  brandKey,
}: SearchBodyProps) {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [stockLocation, setStockLocation] = React.useState<typeof STOCK_LOCATIONS[number]["value"]>("your-branch");
  const [selectedFacets, setSelectedFacets] = React.useState<Record<string, Set<string>>>({});
  const [selectedBrands, setSelectedBrands] = React.useState<Set<string>>(new Set());

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
        <span>Search For &ldquo;{query}&rdquo;</span>
      </nav>

      <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[256px_1fr]">
          {/* Facet sidebar */}
          <aside aria-label="Filters" className="space-y-5 text-sm">
            <section aria-labelledby="stocked-at-heading" className="space-y-2 rounded-md bg-muted/50 p-4">
              <h2 id="stocked-at-heading" className="pb-3 font-semibold">Stocked At</h2>
              <RadioGroup
                value={stockLocation}
                onValueChange={(value) => setStockLocation(value as typeof STOCK_LOCATIONS[number]["value"])}
                className="space-y-2"
              >
                {displayLocations.map((location) => (
                  <label
                    key={location.value}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                      stockLocation === location.value ? "bg-background font-medium shadow-sm" : "hover:bg-background/70",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value={location.value} id={`loc-${location.value}`} />
                      <span>{location.label}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">({location.value === "all" ? totalResults : 0})</span>
                  </label>
                ))}
              </RadioGroup>
              <Link href="/store-locator/in-plp?v=c" className="text-xs font-medium text-primary hover:underline">
                Change
              </Link>
            </section>

            <section aria-labelledby="categories-heading" className="space-y-2 pt-4">
              <h2 id="categories-heading" className="border-b border-border/70 pb-3 font-semibold">
                Categories
              </h2>
              <ul className="space-y-2">
                <li className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-primary hover:underline cursor-pointer">
                    Parts Service &amp; Electrical
                  </span>
                  <span className="text-xs text-muted-foreground">({totalResults})</span>
                </li>
              </ul>
            </section>

            <section aria-labelledby="narrow-heading" className="-mb-3 rounded-sm bg-neutral-700 px-3 py-2 text-white">
              <h2 id="narrow-heading" className="text-xs font-bold tracking-wide text-white uppercase">
                Narrow Your Results
              </h2>
            </section>

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
          </aside>

          {/* Results grid or list */}
          <section aria-label="Search results" className="flex flex-col gap-4">
            {/* Results toolbar — heading left-aligned with the first product
                card; view toggle pinned right at the same baseline. */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="text-lg font-semibold tracking-tight">
                Shop <span className="font-bold">{totalResults.toLocaleString()}</span> results for &ldquo;{query}&rdquo;
              </h1>
              <div
                role="group"
                aria-label="Result view"
                className="inline-flex items-center gap-0.5 self-start rounded-md border bg-background p-0.5 md:self-auto"
              >
                <button
                  type="button"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-sm font-medium transition-colors [&_svg]:size-4",
                    view === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <LayoutGrid /> Grid
                </button>
                <button
                  type="button"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-sm font-medium transition-colors [&_svg]:size-4",
                    view === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <ListIcon /> List
                </button>
              </div>
            </div>
            {appliedFilters.length ? (
              <div className="flex flex-wrap items-center gap-2">
                {appliedFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => removeFilter(filter.key)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {filter.label}
                    <X className="size-3.5" />
                  </button>
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
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((r, i) => (
                  <li key={r.id}>
                    <ProductCard result={r} signedIn={signedIn} index={i} brandKey={brandKey} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="divide-y rounded-lg border bg-card">
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
                    Sign in
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
}: {
  spec: FacetGroupSpec;
  results: SearchResult[];
  selected: Set<string>;
  onToggle: (option: string) => void;
  count: (key: FacetGroupSpec["key"], option: string) => number;
}) {
  return (
    <section aria-labelledby={`facet-${spec.key}-heading`} className="space-y-2 pt-4">
      <details open className="group">
        <summary className="flex cursor-pointer items-center justify-between border-b border-border/70 pb-3 font-semibold">
          <span id={`facet-${spec.key}-heading`}>{spec.label}</span>
          <ChevronDown className="size-4 opacity-70 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-2 space-y-2">
          {spec.options.map((opt) => {
            const id = `facet-${spec.key}-${opt}`;
            return (
              <li key={opt} className="flex items-center justify-between gap-2">
                <label htmlFor={id} className="flex flex-1 items-center gap-2">
                  <Checkbox
                    id={id}
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
  const yourBranchQty = result.stockStatus === "out-of-stock" ? 0 : 2;
  const nearbyBranchQty = result.allBranchesQty ?? 0;
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
    href: `/pdp/tradepro-${result.item.toLowerCase()}`,
  };
  return <CanonicalProductCard data={cardData} signedIn={signedIn} />;
}

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
  return (
    <article className="grid gap-4 p-4 sm:grid-cols-[80px_1fr_auto] sm:items-center">
      <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={result.title}
            loading="lazy"
            className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
          />
        ) : (
          <ImageOff className="size-6 opacity-40" aria-hidden />
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-primary">{result.brand}</p>
        <Link
          href={`/pdp/tradepro-${result.item.toLowerCase()}`}
          className="text-sm font-semibold leading-snug hover:text-primary"
        >
          {result.title}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          Item: {result.item} · MFG: {result.mfg}
        </p>
      </div>
      <div className="text-sm sm:text-right">
        {signedIn ? (
          <SignedInCommerce result={result} align="right" />
        ) : (
          <p>
            <span className="font-medium">Sign in</span>{" "}
            <span className="text-muted-foreground">for pricing.</span>
          </p>
        )}
      </div>
    </article>
  );
}

function SignedInCommerce({
  result,
  align = "left",
}: {
  result: SearchResult;
  align?: "left" | "right";
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
      <StockLine result={result} />
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
        Add to Cart
      </Button>
    </div>
  );
}

function StockLine({ result }: { result: SearchResult }) {
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
      <button
        type="button"
        className="rounded-md border px-3 py-1.5 text-muted-foreground hover:bg-muted"
        disabled
      >
        Previous
      </button>
      {pageNumbers.map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === 1 ? "page" : undefined}
          className={cn(
            "rounded-md border px-3 py-1.5",
            n === 1
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted",
          )}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className="rounded-md border px-3 py-1.5 text-foreground hover:bg-muted"
      >
        Next
      </button>
    </nav>
  );
}
