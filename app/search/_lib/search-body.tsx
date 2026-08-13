"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ImageOff, LayoutGrid, List as ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/app/pdp/_lib/types";

import type { SearchResult } from "./mock-data";

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

const STOCK_LOCATIONS = [
  { value: "your-branch", label: "Manchester, NH - Homans" },
  { value: "nearby", label: "Nearby Branches" },
  { value: "all", label: "All Branches" },
] as const;

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
  const [stockLocation, setStockLocation] = React.useState<typeof STOCK_LOCATIONS[number]["value"]>("all");
  const [selectedFacets, setSelectedFacets] = React.useState<Record<string, Set<string>>>({});
  const [selectedBrands, setSelectedBrands] = React.useState<Set<string>>(new Set());

  const displayName = branchName ?? storeName.split(" - ")[0];
  const displayLocations = React.useMemo(
    () =>
      STOCK_LOCATIONS.map((loc) =>
        loc.value === "your-branch" ? { ...loc, label: storeName } : loc,
      ),
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
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Facet sidebar */}
          <aside aria-label="Filters" className="space-y-6 text-sm">
            <section aria-labelledby="stocked-at-heading" className="space-y-2">
              <h2 id="stocked-at-heading" className="font-semibold">
                Stocked At
              </h2>
              <RadioGroup
                value={stockLocation}
                onValueChange={(v) =>
                  setStockLocation(v as typeof STOCK_LOCATIONS[number]["value"])
                }
                className="space-y-2"
              >
                {displayLocations.map((loc) => (
                  <label
                    key={loc.value}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value={loc.value} id={`loc-${loc.value}`} />
                      <span>{loc.label}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({loc.value === "all" ? totalResults : loc.value === "your-branch" ? 0 : 0})
                    </span>
                  </label>
                ))}
              </RadioGroup>
              {stockLocation !== "your-branch" ? (
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Change
                </button>
              ) : null}
            </section>

            <section aria-labelledby="categories-heading" className="space-y-2 border-t pt-4">
              <h2 id="categories-heading" className="font-semibold">
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

            <section aria-labelledby="narrow-heading" className="space-y-2 border-t pt-4">
              <h2 id="narrow-heading" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
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

            <section aria-labelledby="brand-facet-heading" className="space-y-2 border-t pt-4">
              <details open>
                <summary className="flex cursor-pointer items-center justify-between font-semibold">
                  <span id="brand-facet-heading">Brand</span>
                  <ChevronRight className="size-3.5 opacity-70 transition-transform group-open:rotate-90" />
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
                  className="mt-2 text-xs font-medium text-primary hover:underline"
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
    <section aria-labelledby={`facet-${spec.key}-heading`} className="space-y-2 border-t pt-4">
      <details open className="group">
        <summary className="flex cursor-pointer items-center justify-between font-semibold">
          <span id={`facet-${spec.key}-heading`}>{spec.label}</span>
          <ChevronRight className="size-3.5 opacity-70 transition-transform group-open:rotate-90" />
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
            className="mt-2 text-xs font-medium text-primary hover:underline"
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
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      <div className="grid aspect-[4/3] place-items-center bg-muted/40 p-4 text-muted-foreground">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={result.title}
            loading="lazy"
            className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
          />
        ) : (
          <ImageOff className="size-8 opacity-40" aria-hidden />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium text-primary">{result.brand}</p>
        <Link
          href={`/pdp/tradepro-${result.item.toLowerCase()}`}
          className="text-sm font-semibold leading-snug text-foreground hover:text-primary"
        >
          {result.title}
        </Link>
        <div className="grid gap-0.5 text-xs text-muted-foreground">
          <span>
            <span className="font-medium">Item:</span> {result.item}
          </span>
          <span>
            <span className="font-medium">MFG:</span> {result.mfg}
          </span>
        </div>
        <div className="mt-auto pt-2 text-sm">
          {signedIn ? (
            <SignedInCommerce result={result} />
          ) : (
            <p className="text-sm">
              <span className="font-medium">Sign in</span>{" "}
              <span className="text-muted-foreground">to view pricing and inventory.</span>
            </p>
          )}
        </div>
      </div>
    </article>
  );
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
      <Button size="sm" className="mt-2">
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
