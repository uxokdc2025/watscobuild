"use client";

/**
 * Family table — the Grainger-style grouped result table.
 *
 * Replaces the flat "Excel spreadsheet" list view. Results arrive already
 * grouped into product families; each family renders as a section with a
 * thumbnail, name and short description, then one compact table whose rows
 * are sub-grouped by a key attribute (refrigerant, bearing type, …) and
 * expand in place as an accordion.
 *
 * ── Anatomy ──
 *
 *   ProductFamilySection       the family card
 *     ├─ thumbnail             64/80px square, muted plate, object-contain
 *     ├─ name                  family name — links to the family when `href`
 *     ├─ description           2 lines of plain-language positioning
 *     ├─ meta                  "16 products" / tonnage span / etc.
 *     └─ FamilyTable
 *          ├─ <thead>          column labels from `columns`
 *          ├─ group band       "Refrigerant: R-454B (12)" — a colgroup <th>
 *          ├─ summary row      one row per SKU, columns from `columns`
 *          └─ detail row       colSpan panel from `renderDetail`
 *
 * ── Data-driven columns ──
 * `columns` is the contract. Callers keep a per-category config map and turn
 * it into `FamilyTableColumn[]`, so AC condensers show tonnage / capacity /
 * voltage / dimensions / brand / price while motors show HP / voltage / RPM.
 * Never fork this component per category — add a column config instead.
 *
 * ── Responsive ──
 * `hideBelow` drops a column below a breakpoint; the value still appears in
 * the expanded panel, so nothing is lost on a phone. At 375px a condenser
 * table reads [tonnage | price | ⌄] and the panel carries the rest.
 */

import * as React from "react";
import { ChevronDown, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type FamilyTableColumn<T> = {
  /** Stable key — also the React key for the cell. */
  key: string;
  label: string;
  /** Right-align price / numeric columns. */
  align?: "left" | "right";
  /**
   * Hide this column below the given breakpoint. The value is still
   * reachable in the expanded panel, so dropping it costs no information.
   */
  hideBelow?: "sm" | "md" | "lg";
  /** Extra classes applied to both the header cell and every body cell. */
  className?: string;
  render: (row: T) => React.ReactNode;
};

export type FamilyTableGroup<T> = {
  key: string;
  /** The shared attribute value, e.g. "R-454B". */
  label: string;
  rows: T[];
};

/* Static class strings so Tailwind keeps them in the build. */
const HIDE_BELOW: Record<NonNullable<FamilyTableColumn<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

function columnClass<T>(col: FamilyTableColumn<T>): string {
  return cn(
    col.align === "right" ? "text-right" : "text-left",
    col.hideBelow ? HIDE_BELOW[col.hideBelow] : null,
    col.className,
  );
}

/* ------------------------------------------------------------------ *
 * Family section
 * ------------------------------------------------------------------ */

export function ProductFamilySection({
  name,
  description,
  image,
  meta,
  href,
  className,
  children,
}: {
  name: string;
  /** One or two plain-language sentences — what this family is for. */
  description?: string;
  image?: string;
  /** Short count / range line under the description, e.g. "9 products · 2–5 Ton". */
  meta?: string;
  /** Makes the family name a link (family landing page). */
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = `family-${slugify(name)}`;
  return (
    <section
      aria-labelledby={headingId}
      className={cn("overflow-hidden rounded-lg border bg-card", className)}
    >
      <div className="flex items-start gap-4 border-b p-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground sm:size-20">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              loading="lazy"
              className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
            />
          ) : (
            <ImageOff className="size-6 opacity-40" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 id={headingId} className="text-base font-semibold leading-snug tracking-tight">
            {href ? (
              <a href={href} className="text-primary underline-offset-2 hover:underline">
                {name}
              </a>
            ) : (
              name
            )}
          </h3>
          {description ? (
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{description}</p>
          ) : null}
          {meta ? (
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">{meta}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * The table
 * ------------------------------------------------------------------ */

export function FamilyTable<T>({
  columns,
  groups,
  rowKey,
  rowLabel,
  renderDetail,
  groupLabel,
  caption,
  className,
}: {
  columns: FamilyTableColumn<T>[];
  /** Sub-groups within the family. Pass a single group to skip the bands. */
  groups: FamilyTableGroup<T>[];
  rowKey: (row: T) => string;
  /** Accessible name for the row's expand toggle, e.g. the product title. */
  rowLabel: (row: T) => string;
  /** The accordion panel — image, identity, commerce. */
  renderDetail: (row: T) => React.ReactNode;
  /** Label prefixed to each group band, e.g. "Refrigerant". */
  groupLabel?: string;
  /** Screen-reader caption for the table. */
  caption?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  // +1 for the trailing expand-toggle column.
  const span = columns.length + 1;
  const showBands = groups.length > 1 || Boolean(groupLabel);

  return (
    <Table className={className}>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          {columns.map((col) => (
            <TableHead
              key={col.key}
              scope="col"
              className={cn(
                "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                columnClass(col),
              )}
            >
              {col.label}
            </TableHead>
          ))}
          <TableHead scope="col" className="w-10">
            <span className="sr-only">Details</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <React.Fragment key={group.key}>
            {showBands ? (
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead
                  scope="colgroup"
                  colSpan={span}
                  className="h-8 text-xs font-semibold tracking-wide text-foreground uppercase"
                >
                  {groupLabel ? `${groupLabel}: ` : null}
                  {group.label}{" "}
                  <span className="font-normal text-muted-foreground normal-case">
                    ({group.rows.length})
                  </span>
                </TableHead>
              </TableRow>
            ) : null}
            {group.rows.map((row) => {
              const key = rowKey(row);
              const isOpen = expanded === key;
              const panelId = `family-row-${key}-panel`;
              const toggle = () => setExpanded((prev) => (prev === key ? null : key));
              return (
                <React.Fragment key={key}>
                  <TableRow
                    onClick={toggle}
                    className={cn("cursor-pointer", isOpen && "border-b-0")}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn("py-2.5 text-sm", columnClass(col))}
                      >
                        {col.render(row)}
                      </TableCell>
                    ))}
                    <TableCell className="w-10 py-2.5 text-right">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={(e) => {
                          // The row itself toggles; stop the bubble so the
                          // click doesn't toggle twice and cancel itself out.
                          e.stopPropagation();
                          toggle();
                        }}
                        className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        <span className="sr-only">{`Details for ${rowLabel(row)}`}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                  {isOpen ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={span}
                        className="whitespace-normal bg-muted/20 p-0 align-top"
                      >
                        <div
                          id={panelId}
                          role="region"
                          aria-label={rowLabel(row)}
                          className="px-4 py-4"
                        >
                          {renderDetail(row)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

/* ------------------------------------------------------------------ *
 * Spec list — the expanded panel's attribute block. Carries every column,
 * including the ones the table dropped at this breakpoint.
 * ------------------------------------------------------------------ */

export function SpecList({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <dl className={cn("grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2", className)}>
      {items.map((it) => (
        <div key={it.label} className="flex items-baseline justify-between gap-3 border-b py-1">
          <dt className="text-muted-foreground">{it.label}</dt>
          <dd className="text-right font-medium text-foreground">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
}
