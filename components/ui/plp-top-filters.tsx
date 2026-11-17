"use client";

import * as React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  FilterOption,
  FilterPill,
  FilterSection,
  type FilterPillVariant,
} from "@/components/ui/plp-filters";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Pinned top filter bar
 *
 * A horizontal row of facet dropdowns above the results grid. It is an
 * ADDITION to the left filter rail, never a replacement: both read and
 * write the same selection map, so a facet checked in the sidebar shows
 * as selected in its dropdown (and as a chip) and vice-versa.
 *
 * Composition:
 *   <PlpTopFilterBar>   pinned row — N dropdowns + "More filters"
 *     <TopFilterDropdown>   one facet, popover of checkboxes
 *     <TopFilterMore>       sheet with every facet group
 *   <TopFilterChips>    removable applied-filter chips + Clear All
 *
 * Two framings, one behaviour: `variant="inset"` keeps the bordered card the
 * row shipped in; `variant="plain"` drops the container and moves the signal
 * onto the triggers as the DS light-blue hover.
 * ------------------------------------------------------------------ */

export type TopFilterOption = { name: string; count?: number };

/**
 * Trigger hover treatment.
 *  - `neutral` — the stock outline Button hover (light grey accent).
 *  - `accent`  — the design-system light-blue nav/tab state: the
 *    `--tab-active-bg` tint with the darkened `--tab-active-fg` label, the
 *    same pair the active tab and the Grid/List toggle already use. Pair it
 *    with the container-less bar, where there is no card edge to signal
 *    that the row is interactive.
 */
export type TopFilterHover = "neutral" | "accent";

/** The light-blue hover/open state, straight off the DS active-nav tokens. */
const ACCENT_HOVER =
  "hover:bg-[var(--tab-active-bg)] hover:text-[var(--tab-active-fg)] data-[state=open]:bg-[var(--tab-active-bg)] data-[state=open]:text-[var(--tab-active-fg)]";

function hoverClasses(hover: TopFilterHover) {
  return hover === "accent" ? ACCENT_HOVER : undefined;
}

export type TopFilterFacet = {
  /** Stable key used for state + DOM ids. */
  key: string;
  label: string;
  options: TopFilterOption[];
};

/** Selected option names, per facet key. Shared with the sidebar rail. */
export type TopFilterSelection = Record<string, Set<string>>;

const EMPTY_SELECTION: ReadonlySet<string> = new Set<string>();

function optionId(prefix: string, facetKey: string, name: string) {
  return `${prefix}-${facetKey}-${name}`.replace(/[^\w-]+/g, "-").toLowerCase();
}

export function countSelected(selection: TopFilterSelection): number {
  return Object.values(selection).reduce((total, set) => total + set.size, 0);
}

/** The selected-count badge shared by both triggers. */
function TriggerCount({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums">
      {count}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * One facet dropdown
 * ------------------------------------------------------------------ */

export function TopFilterDropdown({
  facet,
  selected = EMPTY_SELECTION,
  onToggle,
  onClear,
  hover = "neutral",
  className,
}: {
  facet: TopFilterFacet;
  selected?: ReadonlySet<string>;
  onToggle: (option: string) => void;
  onClear?: () => void;
  hover?: TopFilterHover;
  className?: string;
}) {
  const count = selected.size;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={count ? `${facet.label}, ${count} selected` : facet.label}
          className={cn(
            // w-full so the grid cell — not the label — sets the width:
            // every dropdown in the bar is exactly the same size.
            "w-full justify-between gap-2 px-3 font-normal",
            count > 0 && "border-primary font-medium",
            hoverClasses(hover),
            className,
          )}
        >
          <span className="truncate" title={facet.label}>
            {facet.label}
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <TriggerCount count={count} />
            <ChevronDown aria-hidden="true" className="size-4 opacity-70" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <div
          role="group"
          aria-label={facet.label}
          className="max-h-72 space-y-0.5 overflow-y-auto p-2 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
        >
          {facet.options.map((opt) => (
            <FilterOption
              key={opt.name}
              id={optionId("tf", facet.key, opt.name)}
              label={opt.name}
              count={opt.count}
              checked={selected.has(opt.name)}
              onCheckedChange={() => onToggle(opt.name)}
            />
          ))}
        </div>
        {count ? (
          <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
            <span className="text-xs text-muted-foreground">{count} selected</span>
            <Button type="button" variant="link" size="sm" className="px-0" onClick={onClear}>
              Clear
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ *
 * "More filters" — the full facet list in a sheet
 * ------------------------------------------------------------------ */

export function TopFilterMore({
  facets,
  selected,
  onToggle,
  onClearAll,
  resultCount,
  label = "More filters",
  hover = "neutral",
  className,
}: {
  /** Every facet group — not just the pinned ones. */
  facets: TopFilterFacet[];
  selected: TopFilterSelection;
  onToggle: (facetKey: string, option: string) => void;
  onClearAll?: () => void;
  /** Shown in the header and on the apply button. */
  resultCount?: number;
  label?: string;
  hover?: TopFilterHover;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  // Which groups start expanded. Snapshotted when the sheet opens so a group
  // the user expands by hand never collapses under them as they check options
  // (<details open> is driven by this prop).
  const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(EMPTY_SELECTION);
  const total = countSelected(selected);

  function handleOpenChange(next: boolean) {
    if (next) {
      const keys = facets
        .filter((facet) => (selected[facet.key]?.size ?? 0) > 0)
        .map((facet) => facet.key);
      if (!keys.length && facets[0]) keys.push(facets[0].key);
      setExpanded(new Set(keys));
    }
    setOpen(next);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={total ? `${label}, ${total} selected` : label}
          className={cn("w-full justify-between gap-2 px-3", hoverClasses(hover), className)}
        >
          <span className="flex min-w-0 items-center gap-2">
            <SlidersHorizontal aria-hidden="true" className="size-4 opacity-70" />
            <span className="truncate">{label}</span>
          </span>
          <TriggerCount count={total} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4 pr-12">
          <SheetTitle>All filters</SheetTitle>
          <SheetDescription>
            {resultCount == null
              ? "Narrow your results"
              : `Narrowing ${resultCount.toLocaleString()} results`}
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          {facets.map((facet) => {
            const set = selected[facet.key] ?? EMPTY_SELECTION;
            return (
              <div key={facet.key} className="py-4">
                <FilterSection title={facet.label} defaultOpen={expanded.has(facet.key)}>
                  <div className="space-y-0.5">
                    {facet.options.map((opt) => (
                      <FilterOption
                        key={opt.name}
                        id={optionId("tf-sheet", facet.key, opt.name)}
                        label={opt.name}
                        count={opt.count}
                        checked={set.has(opt.name)}
                        onCheckedChange={() => onToggle(facet.key, opt.name)}
                      />
                    ))}
                  </div>
                </FilterSection>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-3 border-t p-4">
          {total && onClearAll ? (
            <Button type="button" variant="link" className="mr-auto px-0" onClick={onClearAll}>
              Clear all
            </Button>
          ) : null}
          <Button type="button" onClick={() => setOpen(false)}>
            {resultCount == null
              ? "Apply"
              : `Show ${resultCount.toLocaleString()} results`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ *
 * Applied-filter chips
 * ------------------------------------------------------------------ */

export type TopFilterChip = {
  facetKey: string;
  option: string;
  /** What the chip reads as, e.g. "Tonnage: 3 Ton". */
  label: string;
};

export function TopFilterChips({
  items,
  onRemove,
  onClearAll,
  variant = "solid",
  className,
}: {
  items: TopFilterChip[];
  onRemove: (chip: TopFilterChip) => void;
  onClearAll?: () => void;
  /** Pill treatment — see `FilterPillVariant`. */
  variant?: FilterPillVariant;
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <div
      role="group"
      aria-label="Applied filters"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {items.map((chip) => (
        <FilterPill
          key={`${chip.facetKey}|${chip.option}`}
          label={chip.label}
          variant={variant}
          onRemove={() => onRemove(chip)}
        />
      ))}
      {onClearAll ? (
        <Button type="button" variant="link" size="sm" className="px-1" onClick={onClearAll}>
          Clear All
        </Button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The bar
 * ------------------------------------------------------------------ */

export function PlpTopFilterBar({
  facets,
  allFacets,
  selected,
  onToggle,
  onClearFacet,
  onClearAll,
  resultCount,
  sticky = true,
  variant = "inset",
  moreLabel,
  className,
}: {
  /** The pinned facets — 4 or 5 reads cleanly; the rest live behind More filters. */
  facets: TopFilterFacet[];
  /** Every facet group, for the More filters sheet. Defaults to `facets`. */
  allFacets?: TopFilterFacet[];
  selected: TopFilterSelection;
  onToggle: (facetKey: string, option: string) => void;
  onClearFacet?: (facetKey: string) => void;
  onClearAll?: () => void;
  resultCount?: number;
  /** Pins the bar to the top of the viewport (xl and up, where it is one row). */
  sticky?: boolean;
  /**
   * How the row is framed.
   *  - `inset` — the bordered card the row shipped in originally.
   *  - `plain` — no container at all: the dropdowns sit straight on the page
   *    and carry the light-blue DS hover instead, so the filters read as
   *    page chrome rather than a grey inset box (Nov 17 review).
   */
  variant?: "inset" | "plain";
  moreLabel?: string;
  className?: string;
}) {
  // One column per dropdown plus one for More filters, so every control in
  // the row is exactly the same width. The single row needs a desktop
  // viewport to stay legible, so narrower screens wrap to three then two.
  const columns = Math.max(2, Math.min(facets.length + 1, 6));
  const plain = variant === "plain";
  const hover: TopFilterHover = plain ? "accent" : "neutral";

  return (
    <section
      aria-label="Filter results"
      className={cn(
        plain
          ? // No box: the pinned state only needs the page background behind
            // it so the grid doesn't show through the row as it scrolls under.
            sticky && "xl:sticky xl:top-0 xl:z-20 xl:bg-background xl:py-2"
          : cn(
              "rounded-lg border bg-card p-2 shadow-xs",
              // Small screens stack the dropdowns, so pinning would eat the
              // viewport — the bar only pins once it sits on a single row.
              sticky && "xl:sticky xl:top-2 xl:z-20",
            ),
        className,
      )}
    >
      <div
        style={{ "--top-filter-columns": columns } as React.CSSProperties}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:[grid-template-columns:repeat(var(--top-filter-columns),minmax(0,1fr))]"
      >
        {facets.map((facet) => (
          <TopFilterDropdown
            key={facet.key}
            facet={facet}
            selected={selected[facet.key]}
            onToggle={(option) => onToggle(facet.key, option)}
            onClear={onClearFacet ? () => onClearFacet(facet.key) : undefined}
            hover={hover}
          />
        ))}
        <TopFilterMore
          facets={allFacets ?? facets}
          selected={selected}
          onToggle={onToggle}
          onClearAll={onClearAll}
          resultCount={resultCount}
          label={moreLabel}
          hover={hover}
        />
      </div>
    </section>
  );
}
