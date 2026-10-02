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
  OPERATOR_LABEL,
  STAGE_LABEL,
  SYSTEM_TYPES,
  WIZARD_STEPS,
  systemPrice,
  systemTypeLabel,
  wizardMatches,
  type AhriSystem,
  type Operator,
  type SystemTypeId,
  type WizardSelection,
  type WizardStep,
} from "@/app/ahri/_lib/data";
import { ThumbTile } from "@/app/ahri/_lib/parts";

/* ──────────────────────────────────────────────────────────────────────────
 * AHRI Lookup — lives in the PDP's About tabs (reference: ecmdi AHRI Lookup).
 * Two versions, selected by the `?ahri=all` query:
 *   · V1 (default) — a progressive wizard: pick System Type, then answer each
 *     required attribute step in turn ([Value][Operator][Attribute]); matched
 *     systems render only after the last step, as removable chips + a list.
 *   · V2 (`?ahri=all`) — pre-populated to the first system type, all matched
 *     systems shown at once.
 * Row order is Value · Operator · Attribute (the interactive value field leads;
 * the fixed attribute label sits on the right).
 * ────────────────────────────────────────────────────────────────────────── */

const SIGN: Record<Operator, string> = { eq: "=", lte: "≤", gte: "≥" };

export function AhriLookupTab() {
  const [mode, setMode] = React.useState<"progressive" | "all">("progressive");
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const v = new URLSearchParams(window.location.search).get("ahri");
    setMode(v === "all" ? "all" : "progressive");
  }, []);
  return mode === "all" ? <AllVisibleLookup /> : <WizardLookup />;
}

/* ── V1 — progressive wizard ── */
type StepState = Record<string, { op: Operator; value: string }>;

function WizardLookup() {
  const [systemType, setSystemType] = React.useState<SystemTypeId | "">("");
  const [sel, setSel] = React.useState<StepState>({});
  // Optional filters added AFTER the required flow completes ("add filter is at
  // the end"). Drawn from attributes not already covered by the wizard steps.
  const [extras, setExtras] = React.useState<AddedFilter[]>([]);

  const steps = systemType ? WIZARD_STEPS[systemType] : [];

  // How many leading steps are fully answered (value set).
  let completeCount = 0;
  for (; completeCount < steps.length; completeCount++) {
    if (!sel[steps[completeCount].key]?.value) break;
  }
  const allComplete = systemType !== "" && completeCount === steps.length;
  // Reveal completed steps plus the current (first unanswered) one.
  const revealed = steps.slice(0, Math.min(completeCount + 1, steps.length));

  const selections: WizardSelection[] = steps
    .filter((st) => sel[st.key]?.value)
    .map((st) => ({ key: st.key, op: sel[st.key].op, value: sel[st.key].value }));
  const stepKeys = new Set(steps.map((s) => s.key));
  const optionalFilters = systemType
    ? FILTERS.filter(
        (f) => (!f.appliesTo || f.appliesTo.includes(systemType)) && !stepKeys.has(f.key),
      )
    : [];
  const unusedOptional = optionalFilters.filter((f) => !extras.some((e) => e.key === f.key));

  const matches = systemType
    ? wizardMatches(systemType, selections).filter((s) =>
        extras.every((e) => {
          if (!e.value) return true;
          const def = FILTERS.find((f) => f.key === e.key);
          return def ? def.test(s, e.value) : true;
        }),
      )
    : [];

  function pickSystemType(v: string) {
    setSystemType(v as SystemTypeId);
    setSel({});
    setExtras([]);
  }
  function setStepValue(key: string, value: string) {
    setSel((p) => ({ ...p, [key]: { op: p[key]?.op ?? "eq", value } }));
  }
  function setStepOp(key: string, op: Operator) {
    setSel((p) => ({ ...p, [key]: { op, value: p[key]?.value ?? "" } }));
  }
  /** Remove a selection (and everything after it, since later steps depend on it). */
  function removeSelection(key: string) {
    if (key === "systemType") {
      setSystemType("");
      setSel({});
      return;
    }
    const idx = steps.findIndex((s) => s.key === key);
    if (idx === -1) return;
    setSel((p) => {
      const next = { ...p };
      steps.slice(idx).forEach((s) => delete next[s.key]);
      return next;
    });
  }
  function clearAll() {
    setSystemType("");
    setSel({});
    setExtras([]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-bold tracking-tight">Select System Options</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {allComplete
            ? "Matched systems for your selections. Edit a chip to change a step, or add a filter to narrow further."
            : "Answer each option in turn — matched systems appear once the required options are set."}
        </p>
      </div>

      {allComplete ? (
        <>
          <ChipBar
            systemType={systemType as SystemTypeId}
            steps={steps}
            sel={sel}
            onRemove={removeSelection}
            onClearAll={clearAll}
          />

          {/* Optional filters — added only at the end, after the required flow */}
          {extras.length ? (
            <div className="flex flex-col gap-2.5">
              {extras.map((e, idx) => {
                const def = FILTERS.find((f) => f.key === e.key)!;
                const attrOptions = optionalFilters.filter(
                  (f) => f.key === e.key || !extras.some((o) => o.key === f.key),
                );
                return (
                  <FilterRow
                    key={`${e.key}-${idx}`}
                    attributeNode={
                      <Select
                        value={e.key}
                        onValueChange={(v) =>
                          setExtras((x) => x.map((o, i) => (i === idx ? { key: v, value: "" } : o)))
                        }
                      >
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
                      <Select
                        value={e.value}
                        onValueChange={(v) =>
                          setExtras((x) => x.map((o, i) => (i === idx ? { ...o, value: v } : o)))
                        }
                      >
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
                    onRemove={() => setExtras((x) => x.filter((_, i) => i !== idx))}
                  />
                );
              })}
            </div>
          ) : null}

          {unusedOptional.length ? (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = unusedOptional[0];
                  if (next) setExtras((x) => [...x, { key: next.key, value: "" }]);
                }}
              >
                <Plus className="size-4" />
                Add filter
              </Button>
            </div>
          ) : null}

          <ResultsList matches={matches} />
        </>
      ) : (
        <div className="flex flex-col gap-2.5">
          <SystemTypeRow value={systemType} onChange={pickSystemType} />

          {/* Revealed steps, one at a time */}
          {revealed.map((step) => (
            <StepRow
              key={step.key}
              step={step}
              state={sel[step.key]}
              onOp={(op) => setStepOp(step.key, op)}
              onValue={(v) => setStepValue(step.key, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* System Type row (shared). First/driving row — just the selector, no Equals
   or attribute-label cell (per client direction). */
function SystemTypeRow({
  value,
  onChange,
}: {
  value: SystemTypeId | "";
  onChange: (v: string) => void;
}) {
  return (
    <div className="w-full sm:w-48">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full" aria-label="System Type">
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
    </div>
  );
}

/* One wizard step row (shared by the guided + all-open versions). */
function StepRow({
  step,
  state,
  onOp,
  onValue,
}: {
  step: WizardStep;
  state?: { op: Operator; value: string };
  onOp: (op: Operator) => void;
  onValue: (value: string) => void;
}) {
  return (
    <FilterRow
      attribute={step.label}
      operatorNode={
        step.kind === "numeric" ? (
          // Operator pre-filled to Equals (changeable to ≤/≥); not an empty
          // "Select filter". The attribute label (right) stays non-editable.
          <Select value={state?.op ?? "eq"} onValueChange={(v) => onOp(v as Operator)}>
            <SelectTrigger className="w-full" aria-label={`${step.label} operator`}>
              <SelectValue placeholder="Equals" />
            </SelectTrigger>
            <SelectContent>
              {(["eq", "lte", "gte"] as Operator[]).map((op) => (
                <SelectItem key={op} value={op}>
                  {OPERATOR_LABEL[op]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : undefined
      }
      valueNode={
        <Select value={state?.value ?? ""} onValueChange={onValue}>
          <SelectTrigger className="w-full" aria-label={`${step.label} value`}>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {step.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
}

/** Completed-selection chips + Clear All (shown once the wizard is complete). */
function ChipBar({
  systemType,
  steps,
  sel,
  onRemove,
  onClearAll,
}: {
  systemType: SystemTypeId;
  steps: WizardStep[];
  sel: StepState;
  onRemove: (key: string) => void;
  onClearAll: () => void;
}) {
  const chips: { key: string; label: string }[] = [
    { key: "systemType", label: `System Type: ${systemTypeLabel(systemType)}` },
    ...steps.map((st) => {
      const s = sel[st.key];
      const valueLabel = st.options.find((o) => o.value === s.value)?.label ?? s.value;
      const text =
        st.kind === "numeric"
          ? `${st.label} ${SIGN[s.op]} ${valueLabel}`
          : `${st.label}: ${valueLabel}`;
      return { key: st.key, label: text };
    }),
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <span
          key={c.key}
          className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 py-1 pr-1.5 pl-3 text-xs font-medium"
        >
          {c.label}
          <button
            type="button"
            aria-label={`Remove ${c.label}`}
            onClick={() => onRemove(c.key)}
            className="grid size-4 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 text-xs font-medium text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

/* ── V2 — all open (same flow as V1; every step shown at once) ── */
type AddedFilter = { key: string; value: string };

function AllVisibleLookup() {
  const [systemType, setSystemType] = React.useState<SystemTypeId>(SYSTEM_TYPES[0].id);
  const [sel, setSel] = React.useState<StepState>({});

  const steps = WIZARD_STEPS[systemType];
  const selections: WizardSelection[] = steps
    .filter((st) => sel[st.key]?.value)
    .map((st) => ({ key: st.key, op: sel[st.key].op, value: sel[st.key].value }));
  const matches = wizardMatches(systemType, selections);

  function changeSystemType(v: string) {
    setSystemType(v as SystemTypeId);
    setSel({});
  }
  function setStepValue(key: string, value: string) {
    setSel((p) => ({ ...p, [key]: { op: p[key]?.op ?? "eq", value } }));
  }
  function setStepOp(key: string, op: Operator) {
    setSel((p) => ({ ...p, [key]: { op, value: p[key]?.value ?? "" } }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-bold tracking-tight">Select System Options</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          All options are shown — set any to narrow the matched systems below.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <SystemTypeRow value={systemType} onChange={changeSystemType} />
        {steps.map((step) => (
          <StepRow
            key={step.key}
            step={step}
            state={sel[step.key]}
            onOp={(op) => setStepOp(step.key, op)}
            onValue={(v) => setStepValue(step.key, v)}
          />
        ))}
      </div>

      <ResultsList matches={matches} />
    </div>
  );
}

/* One condensed row: [Value] · [Operator] · [Attribute] (+ optional remove).
   The interactive value leads on the left; operator in the middle; the fixed
   attribute label sits on the right. Full width on mobile, compact at sm+. */
function FilterRow({
  attribute,
  attributeNode,
  operatorNode,
  valueNode,
  onRemove,
}: {
  attribute?: string;
  attributeNode?: React.ReactNode;
  operatorNode?: React.ReactNode;
  valueNode: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Value — leads (interactive) */}
      <div className="w-full sm:w-48">{valueNode}</div>
      {/* Operator — a Select for numeric steps, else fixed "Equals" */}
      {operatorNode ? (
        <div className="w-full sm:w-44">{operatorNode}</div>
      ) : (
        <div className="flex h-9 w-full items-center rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground sm:w-24">
          Equals
        </div>
      )}
      {/* Attribute — fixed label on the right */}
      {attributeNode ? (
        <div className="w-full sm:w-44">{attributeNode}</div>
      ) : (
        <div className="flex h-9 w-full items-center rounded-md border bg-muted/40 px-3 text-sm font-medium text-muted-foreground sm:w-44">
          {attribute}
        </div>
      )}
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
function ResultsList({ matches }: { matches: AhriSystem[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-bold tracking-tight">
        {matches.length} matched {matches.length === 1 ? "system" : "systems"}
      </h4>
      {matches.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
          No systems match those selections. Edit a step to broaden the search.
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
      <div className="hidden grid-cols-[96px_minmax(0,340px)_minmax(0,1fr)_auto] items-center gap-5 sm:grid">
        <ThumbTile kind={outdoor.kind} src={outdoor.image} alt={outdoor.title} className="size-24" />
        {details}
        <div className="text-center">{availability}</div>
        <div className="justify-self-end">{actions}</div>
      </div>
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
