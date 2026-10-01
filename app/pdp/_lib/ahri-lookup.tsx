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

export function AhriLookup() {
  const [systemType, setSystemType] = React.useState<SystemTypeId | "">("");
  const [filters, setFilters] = React.useState<AddedFilter[]>([]);

  // Which refinement filters apply to the chosen system type (System Type is
  // handled separately as the required first row).
  const availableFilters = React.useMemo(
    () =>
      systemType
        ? FILTERS.filter((f) => !f.appliesTo || f.appliesTo.includes(systemType))
        : [],
    [systemType],
  );
  const unusedFilters = availableFilters.filter(
    (f) => !filters.some((af) => af.key === f.key),
  );

  const matches = React.useMemo(() => {
    if (!systemType) return [];
    return SYSTEMS.filter((s) => s.systemType === systemType).filter((s) =>
      filters.every((af) => {
        if (!af.value) return true; // incomplete filter — ignore until a value is picked
        const def = FILTERS.find((f) => f.key === af.key);
        return def ? def.test(s, af.value) : true;
      }),
    );
  }, [systemType, filters]);

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
    <section aria-label="AHRI Lookup" className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-bold tracking-tight">Select System Options</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start by choosing a system type — we&rsquo;ll show the AHRI-certified
          systems that match. Add more filters to narrow the results.
        </p>
      </div>

      {/* Filter builder */}
      <div className="flex flex-col gap-3">
        {/* Required first row — System Type */}
        <FilterRow
          attribute="System Type"
          required
          valueNode={
            <Select value={systemType} onValueChange={changeSystemType}>
              <SelectTrigger
                className={cn("w-full", !systemType && "border-destructive/60")}
                aria-label="System Type value"
              >
                <SelectValue placeholder="Select Values" />
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
          error={!systemType ? "Filter System Type is required" : undefined}
        />

        {/* Refinement rows — only once a system type is chosen */}
        {systemType
          ? filters.map((af, idx) => {
              const def = FILTERS.find((f) => f.key === af.key)!;
              // attribute options = this row's current filter + any still-unused
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
                        <SelectValue placeholder="Select Values" />
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
            })
          : null}

        {systemType && unusedFilters.length ? (
          <div>
            <Button variant="outline" size="sm" onClick={addFilter}>
              <Plus className="size-4" />
              Add filter
            </Button>
          </div>
        ) : null}
      </div>

      {/* Results */}
      {systemType ? (
        <ResultsList matches={matches} onReset={() => setFilters([])} hasFilters={filters.length > 0} />
      ) : (
        <div className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
          Select a system type above to see matched AHRI systems.
        </div>
      )}
    </section>
  );
}

/* One filter row: [attribute] [Equals] [value] (+ optional remove). The
   attribute + operator are fixed cells on the required row and selects on
   refinement rows. Layout matches the ecmdi reference (three cells). */
function FilterRow({
  attribute,
  attributeNode,
  valueNode,
  required,
  error,
  onRemove,
}: {
  attribute?: string;
  attributeNode?: React.ReactNode;
  valueNode: React.ReactNode;
  required?: boolean;
  error?: string;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_8rem_1fr_auto]">
        {/* Attribute */}
        {attributeNode ?? (
          <div className="flex h-9 items-center rounded-md border bg-muted/40 px-3 text-sm font-medium">
            {attribute}
            {required ? <span className="ml-0.5 text-destructive">*</span> : null}
          </div>
        )}
        {/* Operator (fixed) */}
        <div className="flex h-9 items-center rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground">
          Equals
        </div>
        {/* Value */}
        {valueNode}
        {/* Remove (refinement rows only) */}
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove filter"
            className="grid size-9 place-items-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground max-sm:justify-self-end"
          >
            <X className="size-4" />
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}
      </div>
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
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
