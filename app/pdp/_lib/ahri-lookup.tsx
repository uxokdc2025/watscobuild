"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatUSD } from "./types";
import {
  AIRFLOW_LABEL,
  FILTERS,
  STAGE_LABEL,
  SYSTEMS,
  SYSTEM_TYPES,
  systemPrice,
  type AhriSystem,
  type SystemTypeId,
} from "@/app/ahri/_lib/data";
import { ThumbTile } from "@/app/ahri/_lib/parts";

/* ──────────────────────────────────────────────────────────────────────────
 * AHRI Lookup — lives inside the PDP's About tabs (reference: ecmdi AHRI
 * Lookup tab). A filter-builder: pick the required System Type first (every-
 * thing else stays disabled until then), then optionally add refinement
 * filters. Matched systems render in the canonical product-list-row grid.
 * ────────────────────────────────────────────────────────────────────────── */

type AddedFilter = { key: string; value: string };

type LookupMode = "progressive" | "all";

/** The AHRI Lookup tab body. Two review versions, switchable:
 *  · Step-by-step (progressive) — nothing is pre-selected; matched systems stay
 *    hidden until the user picks a system type, then reveal.
 *  · Show all — pre-populated to the first record so results show immediately. */
export function AhriLookupTab() {
  const [mode, setMode] = React.useState<LookupMode>("progressive");
  return (
    <section aria-label="AHRI Lookup" className="flex flex-col gap-5">
      <div className="inline-flex w-fit rounded-md border bg-muted/40 p-0.5 text-sm">
        {([
          ["progressive", "Step-by-step"],
          ["all", "Show all"],
        ] as [LookupMode, string][]).map(([m, label]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded px-3 py-1.5 font-medium transition-colors",
              mode === m
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {/* key={mode} remounts so switching versions starts each cleanly */}
      <AhriLookup key={mode} mode={mode} />
    </section>
  );
}

function AhriLookup({ mode }: { mode: LookupMode }) {
  const [systemType, setSystemType] = React.useState<SystemTypeId | "">(
    mode === "all" ? SYSTEM_TYPES[0].id : "",
  );
  const [filters, setFilters] = React.useState<AddedFilter[]>([]);
  const selected = systemType !== "";

  // Refinement filters that apply to the chosen system type.
  const availableFilters = React.useMemo(
    () =>
      selected
        ? FILTERS.filter((f) => !f.appliesTo || f.appliesTo.includes(systemType as SystemTypeId))
        : [],
    [systemType, selected],
  );
  const unusedFilters = availableFilters.filter(
    (f) => !filters.some((af) => af.key === f.key),
  );

  const matches = React.useMemo(() => {
    if (!selected) return [];
    return SYSTEMS.filter((s) => s.systemType === systemType).filter((s) =>
      filters.every((af) => {
        if (!af.value) return true; // incomplete filter — ignored until a value is picked
        const def = FILTERS.find((f) => f.key === af.key);
        return def ? def.test(s, af.value) : true;
      }),
    );
  }, [systemType, filters, selected]);

  function changeSystemType(v: string) {
    setSystemType(v as SystemTypeId);
    setFilters([]); // refinements depend on system type — reset on change
  }
  function addFilter() {
    const next = unusedFilters[0];
    if (next) setFilters((f) => [...f, { key: next.key, value: "" }]);
  }
  function setFilterKey(idx: number, key: string) {
    setFilters((f) => f.map((af, i) => (i === idx ? { key, value: "" } : af)));
  }
  function setFilterValue(idx: number, value: string) {
    setFilters((f) => f.map((af, i) => (i === idx ? { ...af, value } : af)));
  }
  function removeFilter(idx: number) {
    setFilters((f) => f.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-bold tracking-tight">Select System Options</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "progressive"
            ? "Choose a system type to begin — matched systems appear once you make a selection."
            : "Change the system type or add filters to narrow the matched systems below."}
        </p>
      </div>

      {/* Filter builder — condensed, left-aligned rows (attribute · equals · value) */}
      <div className="flex flex-col gap-2.5">
        {/* First row — System Type (attribute + operator are fixed/disabled) */}
        <FilterRow
          attribute="System Type"
          valueNode={
            <Select value={systemType} onValueChange={changeSystemType}>
              <SelectTrigger className="w-full" aria-label="System Type value">
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                {SYSTEM_TYPES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        {/* Refinement rows — only after a system type is chosen */}
        {selected && filters.map((af, idx) => {
          const def = FILTERS.find((f) => f.key === af.key)!;
          const attrOptions = availableFilters.filter(
            (f) => f.key === af.key || !filters.some((o) => o.key === f.key),
          );
          return (
            <FilterRow
              key={`${af.key}-${idx}`}
              attributeNode={
                <Select value={af.key} onValueChange={(v) => setFilterKey(idx, v)}>
                  <SelectTrigger className="w-full" aria-label="Filter attribute">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {attrOptions.map((f) => (
                      <SelectItem key={f.key} value={f.key}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
              valueNode={
                <Select value={af.value} onValueChange={(v) => setFilterValue(idx, v)}>
                  <SelectTrigger className="w-full" aria-label={`${def.label} value`}>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    {def.options
                      .filter((o) => o.value !== "any")
                      .map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              }
              onRemove={() => removeFilter(idx)}
            />
          );
        })}

        {selected && unusedFilters.length ? (
          <div>
            <Button variant="outline" size="sm" onClick={addFilter}>
              <Plus className="size-4" />
              Add filter
            </Button>
          </div>
        ) : null}
      </div>

      {/* Results — revealed only after a system type is selected (progressive
          disclosure); "Show all" mode pre-selects, so they appear immediately. */}
      {selected ? (
        <ResultsList matches={matches} onReset={() => setFilters([])} hasFilters={filters.length > 0} />
      ) : (
        <div className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground/70">
          Select a system type to see matched AHRI systems.
        </div>
      )}
    </div>
  );
}

/* One condensed filter row: [attribute] [Equals] [value] (+ optional remove).
   The attribute + operator are fixed, disabled-looking cells; the value is a
   live Select. Fields are compact — full width on mobile, fixed widths at sm+
   (value and attribute even, Equals narrower) so they don't stretch the row. */
function FilterRow({
  attribute,
  attributeNode,
  valueNode,
  onRemove,
}: {
  attribute?: string;
  attributeNode?: React.ReactNode;
  valueNode: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Attribute */}
      {attributeNode ? (
        <div className="w-full sm:w-48">{attributeNode}</div>
      ) : (
        <div className="flex h-9 w-full items-center rounded-md border bg-muted/40 px-3 text-sm font-medium text-muted-foreground sm:w-48">
          {attribute}
        </div>
      )}
      {/* Operator (fixed, narrower) */}
      <div className="flex h-9 w-full items-center rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground sm:w-24">
        Equals
      </div>
      {/* Value */}
      <div className="w-full sm:w-48">{valueNode}</div>
      {/* Remove (refinement rows only) */}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove filter"
          className="grid size-9 shrink-0 place-items-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

/* ── Matched systems as canonical product-list rows ── */
function ResultsList({
  matches,
  onReset,
  hasFilters,
}: {
  matches: AhriSystem[];
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold tracking-tight">
          {matches.length} matched {matches.length === 1 ? "system" : "systems"}
        </h4>
        {hasFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
          No systems match those filters. Try removing one.
        </div>
      ) : (
        <ul className="divide-y rounded-xl border">
          {matches.map((s) => (
            <li key={s.ahriNumber}>
              <SystemRow system={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SystemRow({ system }: { system: AhriSystem }) {
  const price = systemPrice(system);
  const outdoor = system.components.find((c) => c.kind === "outdoor") ?? system.components[0];
  const inStock = system.components.every((c) => c.branchQty > 0);
  const specLine = [
    `${system.seer2} SEER2`,
    system.afue != null ? `${system.afue}% AFUE` : null,
    `${system.tonnage} Ton`,
  ]
    .filter(Boolean)
    .join(" · ");

  const details = (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-primary">AHRI #{system.ahriNumber}</p>
      <Link
        href={`/ahri/${system.ahriNumber}`}
        className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary hover:underline"
      >
        {system.headline}
      </Link>
      <p className="mt-1 truncate text-xs text-muted-foreground">
        {system.components.map((c) => c.model).join(" · ")}
      </p>
      <p className="mt-1 text-xs font-medium text-foreground">{specLine}</p>
    </div>
  );

  const availability = (
    <div className="text-sm">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold",
          inStock ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400",
        )}
      >
        <span className={cn("size-1.5 rounded-full", inStock ? "bg-emerald-500" : "bg-amber-500")} aria-hidden />
        {inStock ? "In stock" : "To order"}
      </span>
      <p className="mt-0.5 text-xs text-muted-foreground">{STAGE_LABEL[system.stage]}</p>
      <p className="text-xs text-muted-foreground">{AIRFLOW_LABEL[system.airflow]}</p>
    </div>
  );

  const actions = (
    <div className="sm:text-right">
      <p className="text-base font-semibold text-price">
        {formatUSD(price)}
        <span className="ml-1 text-xs font-normal text-muted-foreground">/ system</span>
      </p>
      <Button asChild size="sm" className="mt-2 max-sm:w-full">
        <Link href={`/ahri/${system.ahriNumber}`}>
          View System
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );

  return (
    <article className="p-4">
      {/* Desktop — [thumb] [details] [availability centered] [actions] */}
      <div className="hidden grid-cols-[96px_minmax(0,340px)_minmax(0,1fr)_auto] items-center gap-5 sm:grid">
        <ThumbTile kind={outdoor.kind} src={outdoor.image} alt={outdoor.title} className="size-24" />
        {details}
        <div className="text-center">{availability}</div>
        <div className="justify-self-end">{actions}</div>
      </div>
      {/* Mobile — thumb + details on top, availability beneath, actions full width */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-start gap-3">
          <ThumbTile kind={outdoor.kind} src={outdoor.image} alt={outdoor.title} className="size-20 shrink-0" />
          <div className="min-w-0 flex-1">
            {details}
            <div className="mt-1.5">{availability}</div>
          </div>
        </div>
        {actions}
      </div>
    </article>
  );
}
