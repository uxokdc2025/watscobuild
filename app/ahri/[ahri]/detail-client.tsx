"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ListPlus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatUSD } from "@/app/pdp/_lib/types";
import { PdpAuthProvider } from "@/app/pdp/_lib/auth";
import { CarouselStrip } from "@/app/pdp/_lib/fbt";
import {
  AIRFLOW_LABEL,
  STAGE_LABEL,
  systemPrice,
  systemTypeLabel,
  type AhriComponent,
  type AhriSystem,
} from "../_lib/data";
import { InventoryLine, SpecPill, ThumbTile } from "../_lib/parts";

/** Link the outdoor unit back to its real PDP; other components are demo-only. */
function componentHref(c: AhriComponent): string {
  return c.kind === "outdoor" ? "/pdp/uc-ahri-matched-system?signedin=1" : "#";
}

export function AhriSystemDetail({ system }: { system: AhriSystem }) {
  const total = systemPrice(system);
  const [added, setAdded] = React.useState(false);

  return (
    <PdpAuthProvider initialSignedIn>
    <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-28 md:px-6 lg:pb-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href="/pdp/uc-ahri-matched-system?signedin=1" className="hover:text-foreground hover:underline">
              GLZS4B Heat Pump
            </Link>
          </li>
          <li aria-hidden className="text-muted-foreground/50">/</li>
          <li>
            <Link href="/pdp/uc-ahri-matched-system?signedin=1#ahri-lookup" className="hover:text-foreground hover:underline">
              AHRI Lookup
            </Link>
          </li>
          <li aria-hidden className="text-muted-foreground/50">/</li>
          <li aria-current="page" className="text-foreground">System #{system.ahriNumber}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mt-4 flex flex-col gap-4 border-b pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <BadgeCheck className="size-3.5" />
            AHRI Certified Match #{system.ahriNumber}
          </span>
          <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {systemTypeLabel(system.systemType)}
          </span>
          {system.taxCredit ? (
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Tax-credit eligible
            </span>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{system.headline}</h1>
        <div className="flex flex-wrap gap-2">
          <SpecPill label="SEER2" value={String(system.seer2)} accent />
          {system.eer2 != null ? <SpecPill label="EER2" value={String(system.eer2)} /> : null}
          {system.hspf2 != null ? <SpecPill label="HSPF2" value={String(system.hspf2)} /> : null}
          {system.afue != null ? <SpecPill label="AFUE" value={`${system.afue}%`} /> : null}
          <SpecPill label="Capacity" value={`${system.tonnage} Ton`} />
          <SpecPill label="Stage" value={STAGE_LABEL[system.stage]} />
          <SpecPill label="Airflow" value={AIRFLOW_LABEL[system.airflow]} />
          <SpecPill label="Refrigerant" value={system.refrigerant} />
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Components */}
        <section aria-label="System components" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">
              System components
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {system.components.length} matched units
              </span>
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/pdp/uc-ahri-matched-system?signedin=1#ahri-lookup">
                <ArrowLeft className="size-4" />
                Back to results
              </Link>
            </Button>
          </div>

          {system.components.map((c) => (
            <ComponentCard key={c.id} c={c} />
          ))}

          {/* Customers Also Purchased — reuses the canonical ProductCard rail */}
          {system.addOns.length ? (
            <section aria-label="Customers also purchased" className="mt-6">
              <CarouselStrip
                items={system.addOns}
                title={
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Customers Also Purchased</h2>
                    <p className="text-sm text-muted-foreground">
                      Common install accessories for this system.
                    </p>
                  </div>
                }
              />
            </section>
          ) : null}
        </section>

        {/* Right rail — AHRI System summary (desktop) */}
        <aside className="hidden lg:sticky lg:top-6 lg:block">
          <SystemSummary system={system} total={total} added={added} onAdd={() => setAdded(true)} />
        </aside>
      </div>

      {/* Mobile sticky action bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 py-3 backdrop-blur lg:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">System total</span>
          <span className="text-lg font-bold tabular-nums">{formatUSD(total)}</span>
        </div>
        <Button className="w-full" onClick={() => setAdded(true)} disabled={added}>
          {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          {added ? "Added to Cart" : "Add System to Cart"}
        </Button>
      </div>
    </div>
    </PdpAuthProvider>
  );
}

/* ── One component card (Outdoor / Indoor Coil / Furnace / Air Handler) ── */
function ComponentCard({ c }: { c: AhriComponent }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border p-4 sm:grid-cols-[7rem_1fr_auto] sm:gap-5 sm:p-5">
      <ThumbTile kind={c.kind} src={c.image} alt={c.title} className="size-20 sm:size-28" />

      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {c.role} · {c.brand}
        </p>
        <Link href={componentHref(c)} className="mt-0.5 block text-sm font-semibold text-primary hover:underline">
          {c.title}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          Item {c.item} &nbsp;·&nbsp; MFG {c.model}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          {c.specs.map((s) => (
            <span key={s.label}>
              <span className="text-foreground/70">{s.label}:</span>{" "}
              <span className="font-medium text-foreground">{s.value}</span>
            </span>
          ))}
        </div>
        <InventoryLine
          className="mt-2"
          branchQty={c.branchQty}
          branchName={c.branchName}
          allBranchesQty={c.allBranchesQty}
        />
      </div>

      <div className="col-span-2 flex items-center justify-between border-t pt-3 sm:col-span-1 sm:w-32 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
        <span className="text-lg font-bold tabular-nums">{formatUSD(c.price)}</span>
        <span className="text-[11px] text-muted-foreground">/ EACH</span>
      </div>
    </div>
  );
}

/* ── Right rail summary ── */
function SystemSummary({
  system,
  total,
  added,
  onAdd,
}: {
  system: AhriSystem;
  total: number;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="border-b bg-muted/30 px-5 py-4">
        <h2 className="text-sm font-bold tracking-tight">AHRI System Summary</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Certified match #{system.ahriNumber}
        </p>
      </div>

      <ul className="flex flex-col divide-y px-5">
        {system.components.map((c) => (
          <li key={c.id} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight">{c.role}</p>
              <p className="truncate text-xs text-muted-foreground">{c.model}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {formatUSD(c.price)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-between border-t px-5 py-4">
        <span className="text-sm font-semibold">System total</span>
        <span className="text-xl font-bold tabular-nums">{formatUSD(total)}</span>
      </div>

      <div className="flex flex-col gap-2 px-5 pb-5">
        <Button className="w-full" onClick={onAdd} disabled={added}>
          {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          {added ? "Added to Cart" : "Add System to Cart"}
        </Button>
        <Button variant="outline" className="w-full">
          <ListPlus className="size-4" />
          Save to List
        </Button>
      </div>

      <div className="flex flex-col gap-1.5 border-t bg-muted/20 px-5 py-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          AHRI-certified performance match
        </span>
        <span className="inline-flex items-center gap-2">
          <Truck className="size-3.5 text-emerald-600" />
          All units stocked — ships together
        </span>
      </div>
    </div>
  );
}
