"use client";

import * as React from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

/* ───────────────────────── Shared summary primitives ─────────────────────────
 * ONE boxed-card + edit pattern for every checkout summary (Review step cards,
 * the Payment billing summary, and the Fulfillment pickup branch). SummaryCard
 * is a bordered box with an uppercase muted label top-left, an optional Edit
 * control top-right, and content beneath. */

/** The shared Edit control: a DS link button (blue text-primary) with a pencil +
 *  "Edit". 44px min touch target; labelled per use. */
function SummaryEditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={onClick}
      aria-label={label}
      className="absolute top-2.5 right-2.5 shrink-0 min-h-9"
    >
      <Pencil className="size-3.5" aria-hidden="true" />
      Edit
    </Button>
  );
}

/** A uniform summary box: uppercase muted label top-left, optional Edit or CTA
 *  top-right, richer body below. `h-full` flex column so cards line up in a
 *  grid. `cta` overrides the legacy `onEdit`/`editLabel` pencil button when
 *  provided. */
export function SummaryCard({
  label,
  labelIcon,
  editLabel,
  onEdit,
  cta,
  children,
}: {
  label: string;
  labelIcon?: React.ReactNode;
  editLabel?: string;
  onEdit?: () => void;
  cta?: { label: string; onClick: () => void; icon?: React.ReactNode };
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full flex-col rounded-md border bg-card p-4">
      <div className="flex items-center gap-1.5 pr-16">
        {labelIcon}
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      </div>
      {cta ? (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={cta.onClick}
          aria-label={cta.label}
          className="absolute top-2.5 right-2.5 shrink-0 min-h-9"
        >
          {cta.icon}
          {cta.label}
        </Button>
      ) : onEdit ? (
        <SummaryEditButton label={editLabel ?? "Edit"} onClick={onEdit} />
      ) : null}
      <div className="mt-2 space-y-1 text-sm">{children}</div>
    </div>
  );
}
