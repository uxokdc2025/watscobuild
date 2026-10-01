"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  RotateCcw,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/app/pdp/_lib/types";
import {
  AIRFLOW_LABEL,
  ANY,
  FILTERS,
  STAGE_LABEL,
  SYSTEMS,
  SYSTEM_TYPES,
  systemPrice,
  type AhriSystem,
  type SystemTypeId,
} from "./data";
import { SpecPill, SystemTypeIcon, ThumbTile } from "./parts";

type Step = "type" | "refine";

/* The outdoor unit that launched the flow (from the GLZS4B PDP). */
const ANCHOR = {
  title: "GLZS4B 3-1/2 Ton Split System Heat Pump",
  model: "GLZS4BA4210",
};

export function AhriBuilder() {
  const [step, setStep] = React.useState<Step>("type");
  const [systemType, setSystemType] = React.useState<SystemTypeId | null>(null);
  const [values, setValues] = React.useState<Record<string, string>>({});

  const activeFilters = React.useMemo(
    () =>
      systemType
        ? FILTERS.filter(
            (f) => !f.appliesTo || f.appliesTo.includes(systemType),
          )
        : [],
    [systemType],
  );

  const matches = React.useMemo(() => {
    if (!systemType) return [];
    return SYSTEMS.filter((s) => s.systemType === systemType).filter((s) =>
      activeFilters.every((f) => {
        const v = values[f.key] ?? ANY;
        return v === ANY || f.test(s, v);
      }),
    );
  }, [systemType, values, activeFilters]);

  const appliedCount = activeFilters.filter(
    (f) => (values[f.key] ?? ANY) !== ANY,
  ).length;

  function chooseType(id: SystemTypeId) {
    setSystemType(id);
    setValues({});
    setStep("refine");
  }

  function resetFilters() {
    setValues({});
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
      <StepRail step={step} systemType={systemType} onBackToType={() => setStep("type")} />

      {step === "type" ? (
        <TypeStep onChoose={chooseType} selected={systemType} />
      ) : (
        <RefineStep
          activeFilters={activeFilters}
          values={values}
          setValues={setValues}
          matches={matches}
          appliedCount={appliedCount}
          onReset={resetFilters}
          onChangeType={() => setStep("type")}
        />
      )}
    </div>
  );
}

/* ── Step rail ── */
function StepRail({
  step,
  systemType,
  onBackToType,
}: {
  step: Step;
  systemType: SystemTypeId | null;
  onBackToType: () => void;
}) {
  const typeLabel = SYSTEM_TYPES.find((t) => t.id === systemType)?.label;
  return (
    <div className="mb-6 flex flex-col gap-4">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href="/pdp/uc-ahri-matched-system?signedin=1" className="hover:text-foreground hover:underline">
              GLZS4B Heat Pump
            </Link>
          </li>
          <li aria-hidden className="text-muted-foreground/50">/</li>
          <li aria-current="page" className="text-foreground">AHRI System Builder</li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            AHRI System Builder
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Build a certified, AHRI-matched system around your{" "}
            <span className="font-medium text-foreground">{ANCHOR.title}</span>.
            Start with the indoor equipment type — we&rsquo;ll only show
            combinations that are certified to match.
          </p>
        </div>

        <ol className="flex items-center gap-2 text-sm">
          <RailNode n={1} label="System Type" active={step === "type"} done={step === "refine"} onClick={step === "refine" ? onBackToType : undefined} />
          <ChevronRight className="size-4 text-muted-foreground/40" aria-hidden />
          <RailNode n={2} label={typeLabel ? `Refine · ${typeLabel}` : "Refine & Match"} active={step === "refine"} done={false} />
        </ol>
      </div>
    </div>
  );
}

function RailNode({
  n,
  label,
  active,
  done,
  onClick,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums",
          active && "bg-primary text-primary-foreground",
          done && "bg-emerald-600 text-white",
          !active && !done && "bg-muted text-muted-foreground",
        )}
      >
        {done ? <Check className="size-3.5" /> : n}
      </span>
      <span className={cn("font-medium", active ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </>
  );
  const cls = "inline-flex items-center gap-2 rounded-full px-2 py-1";
  return onClick ? (
    <li>
      <button type="button" onClick={onClick} className={cn(cls, "transition-colors hover:bg-accent")}>
        {content}
      </button>
    </li>
  ) : (
    <li className={cls}>{content}</li>
  );
}

/* ── Step 1: system type ── */
function TypeStep({
  onChoose,
  selected,
}: {
  onChoose: (id: SystemTypeId) => void;
  selected: SystemTypeId | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SYSTEM_TYPES.map((t) => {
        const count = SYSTEMS.filter((s) => s.systemType === t.id).length;
        const isSel = selected === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChoose(t.id)}
            aria-pressed={isSel}
            className={cn(
              "group flex h-full flex-col items-start gap-4 rounded-2xl border p-5 text-left transition-all",
              "hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              isSel ? "border-primary ring-[3px] ring-ring/30" : "border-border",
            )}
          >
            <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <SystemTypeIcon icon={t.icon} className="size-6" />
            </span>
            <div className="flex-1">
              <h2 className="text-base font-bold tracking-tight">{t.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {count} matched {count === 1 ? "system" : "systems"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Step 2: refine + results ── */
function RefineStep({
  activeFilters,
  values,
  setValues,
  matches,
  appliedCount,
  onReset,
  onChangeType,
}: {
  activeFilters: typeof FILTERS;
  values: Record<string, string>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  matches: AhriSystem[];
  appliedCount: number;
  onReset: () => void;
  onChangeType: () => void;
}) {
  const appliedChips = activeFilters
    .map((f) => {
      const v = values[f.key] ?? ANY;
      if (v === ANY) return null;
      const opt = f.options.find((o) => o.value === v);
      return { key: f.key, label: opt?.label ?? v };
    })
    .filter((x): x is { key: string; label: string } => x !== null);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
      {/* Filter panel — required/primary filters live on the LEFT */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4" />
              Refine match
            </span>
            {appliedCount > 0 ? (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            ) : null}
          </div>
          <div className="flex flex-col divide-y">
            {activeFilters.map((f) => (
              <fieldset key={f.key} className="px-4 py-4">
                <legend className="text-sm font-semibold">{f.label}</legend>
                <p className="mb-2.5 text-xs text-muted-foreground">{f.help}</p>
                <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={f.label}>
                  {f.options.map((o) => {
                    const checked = (values[f.key] ?? ANY) === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() =>
                          setValues((prev) => ({ ...prev, [f.key]: o.value }))
                        }
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                        )}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="border-t px-4 py-3">
            <Button variant="outline" size="sm" className="w-full" onClick={onChangeType}>
              <ArrowLeft className="size-4" />
              Change system type
            </Button>
          </div>
        </div>
      </aside>

      {/* Results */}
      <section aria-label="Matched systems" className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 className="text-lg font-bold tracking-tight">
            {matches.length} matched {matches.length === 1 ? "system" : "systems"}
          </h2>
          {appliedChips.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {appliedChips.map((c) => (
                <span
                  key={c.key}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  {c.label}
                  <button
                    type="button"
                    aria-label={`Remove ${c.label}`}
                    onClick={() => setValues((prev) => ({ ...prev, [c.key]: ANY }))}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {matches.length === 0 ? (
          <EmptyState onReset={onReset} />
        ) : (
          <ul className="flex flex-col gap-4">
            {matches.map((s) => (
              <li key={s.ahriNumber}>
                <ResultCard system={s} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-6" />
      </span>
      <p className="text-base font-semibold">No systems match those filters</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Try loosening one of your selections — or set a filter back to
        &ldquo;Any / Not sure&rdquo; if you&rsquo;re unsure of the spec.
      </p>
      <Button variant="outline" size="sm" onClick={onReset} className="mt-1">
        <RotateCcw className="size-4" />
        Clear all filters
      </Button>
    </div>
  );
}

/* ── Result card — refined, no wide horizontal scroll table ── */
function ResultCard({ system }: { system: AhriSystem }) {
  const price = systemPrice(system);
  return (
    <div className="group grid grid-cols-1 gap-5 rounded-2xl border p-5 transition-all hover:border-primary/50 hover:shadow-md sm:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
            AHRI #{system.ahriNumber}
          </span>
          {system.taxCredit ? (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Tax-credit eligible
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 text-base font-bold tracking-tight">{system.headline}</h3>

        {/* spec strip */}
        <div className="mt-3 flex flex-wrap gap-2">
          <SpecPill label="SEER2" value={String(system.seer2)} accent />
          {system.afue != null ? <SpecPill label="AFUE" value={`${system.afue}%`} /> : null}
          {system.hspf2 != null ? <SpecPill label="HSPF2" value={String(system.hspf2)} /> : null}
          <SpecPill label="Capacity" value={`${system.tonnage} Ton`} />
          <SpecPill label="Stage" value={STAGE_LABEL[system.stage].replace("-Stage", "")} />
          <SpecPill label="Airflow" value={AIRFLOW_LABEL[system.airflow]} />
        </div>

        {/* component thumbs */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {system.components.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <ThumbTile kind={c.kind} src={c.image} alt={c.title} className="size-11" />
              <div className="leading-tight">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {c.role}
                </p>
                <p className="text-xs font-semibold tabular-nums">{c.model}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* price + CTA */}
      <div className="flex flex-row items-center justify-between gap-4 border-t pt-4 sm:w-48 sm:flex-col sm:items-stretch sm:justify-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
        <div className="sm:text-right">
          <p className="text-xs text-muted-foreground">System total</p>
          <p className="text-xl font-bold tabular-nums">{formatUSD(price)}</p>
          <p className="text-[11px] text-muted-foreground">
            {system.components.length} matched units
          </p>
        </div>
        <Button asChild className="shrink-0 sm:w-full">
          <Link href={`/ahri/${system.ahriNumber}`}>
            View System
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
