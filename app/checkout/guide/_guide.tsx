"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRANDS } from "@/app/pdp/_lib/brands";

/* ─────────────────────────── Coverage model ───────────────────────────
 * ONE unified checkout, skinned per distributor via
 * /checkout?brand=<key>&case=<scenario>&demo=1. Each row below is one line
 * item from that brand's own document, mapped to the scenario that deep-links
 * into the live flow at the right step. `status` is verified against the
 * actual checkout code — "solved" where the feature is distinctly built,
 * "in flow" where the case is reachable but the micro-feature isn't a
 * distinct control yet (honest, not over-claimed). */

type Status = "solved" | "in-flow";

// undefined scenario → base demo entry (/checkout?brand=<key>&demo=1).
type Row = { label: string; scenario?: string; status: Status; note?: string };

type BrandGuide = {
  key: string;
  /** Section label as it reads on the brand's document. */
  label: string;
  rows: Row[];
};

const GUIDES: BrandGuide[] = [
  {
    key: "baker",
    label: "Baker Distributing",
    rows: [
      { label: "Order Details (now labeled)", scenario: "account-job-context", status: "solved" },
      { label: "Pickup + branch / date", scenario: "account-job-context", status: "solved" },
      { label: "Delivery address + 150-mile rule", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Delivery date cutoff", scenario: "availability-date-constraints", status: "solved" },
      { label: "Multiple delivery types (Truck / Freight / UPS / Local)", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Add shipping address", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Stock warnings (branch-transfer + backorder)", status: "solved", note: "base demo" },
      { label: "Payment — On Account / card + promo", scenario: "terms-or-credit-card", status: "solved" },
      { label: "Review + Order Summary", scenario: "review-coupon-special-handling", status: "solved" },
    ],
  },
  {
    key: "peirce",
    label: "Peirce·Phelps",
    rows: [
      { label: "Job Details + required PO", scenario: "account-job-context", status: "solved" },
      { label: "Store-finder pickup", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Grouped saved + account addresses", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Order notes", scenario: "account-job-context", status: "solved" },
      { label: "Inventory-confirmed / stock notice", scenario: "account-job-context", status: "solved" },
      { label: "Ship-date selector", scenario: "availability-date-constraints", status: "solved" },
      { label: "Payment — On Account / card", scenario: "terms-or-credit-card", status: "solved" },
      { label: "Review", scenario: "review-coupon-special-handling", status: "solved" },
    ],
  },
  {
    key: "homans",
    label: "Homans",
    rows: [
      { label: "Numbered sections", scenario: "account-job-context", status: "solved" },
      { label: "Switch account", scenario: "account-job-context", status: "solved" },
      { label: "Split shipment (partial / complete)", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Liftgate", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Special handling → required comments", scenario: "review-coupon-special-handling", status: "solved" },
      { label: "Delivery date", scenario: "availability-date-constraints", status: "solved" },
      { label: "Coupon", scenario: "review-coupon-special-handling", status: "solved" },
      { label: "Payment — COD / card", scenario: "terms-or-credit-card", status: "solved" },
      { label: "Thank-you", scenario: "order-confirmation", status: "solved" },
    ],
  },
  {
    key: "ecmdi",
    label: "East Coast Metal",
    rows: [
      { label: "Order Details + send-confirmation-email / notify salesperson", scenario: "account-job-context", status: "solved" },
      { label: "4 delivery methods (Pickup / Truck / Freight / UPS)", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Cash on Pickup", scenario: "terms-or-credit-card", status: "solved" },
      { label: "Shared company cards", scenario: "terms-or-credit-card", status: "solved" },
      { label: "Add shipping address", scenario: "delivery-pickup-routing", status: "solved" },
      { label: "Review (3-column)", scenario: "review-coupon-special-handling", status: "solved" },
      { label: "Thank-you + print", scenario: "order-confirmation", status: "solved" },
    ],
  },
];

function checkoutHref(brandKey: string, scenario?: string): string {
  const params = new URLSearchParams({ brand: brandKey });
  if (scenario) params.set("case", scenario);
  params.set("demo", "1");
  return `/checkout?${params.toString()}`;
}

function StatusPill({ status }: { status: Status }) {
  return status === "solved" ? (
    <Badge variant="soft" color="green" className="shrink-0">
      Solved
    </Badge>
  ) : (
    <Badge variant="soft" color="slate" className="shrink-0">
      In flow
    </Badge>
  );
}

function UseCaseRow({ brandKey, row }: { brandKey: string; row: Row }) {
  return (
    <li>
      <Link
        href={checkoutHref(brandKey, row.scenario)}
        target="_blank"
        rel="noopener noreferrer"
        className="group -mx-2 flex min-h-11 items-center gap-3 rounded-md px-2 py-2.5 no-underline transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              {row.label}
            </span>
            <ArrowUpRight
              aria-hidden
              className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            />
          </span>
          <span className="mt-0.5 block truncate font-mono text-xs text-muted-foreground">
            {row.scenario ? `?brand=${brandKey}&case=${row.scenario}` : `?brand=${brandKey}&demo=1`}
            {row.note ? ` · ${row.note}` : ""}
          </span>
        </span>
        <StatusPill status={row.status} />
      </Link>
    </li>
  );
}

function BrandSection({ guide }: { guide: BrandGuide }) {
  const brand = BRANDS[guide.key];
  const accent = brand?.accent ?? "var(--primary)";
  const solved = guide.rows.filter((r) => r.status === "solved").length;
  const headingId = `brand-${guide.key}`;

  return (
    <section
      aria-labelledby={headingId}
      className="scroll-mt-6 rounded-xl border bg-card p-5 md:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <h2 id={headingId} className="text-lg font-bold tracking-tight">
              {guide.label}
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {brand?.name ?? guide.label} · {guide.rows.length} use cases · {solved} solved
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href={checkoutHref(guide.key)} target="_blank" rel="noopener noreferrer">
            Walk the {guide.label} checkout
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      <ul className="mt-4 flex flex-col border-t pt-2">
        {guide.rows.map((row) => (
          <UseCaseRow key={`${guide.key}-${row.label}`} brandKey={guide.key} row={row} />
        ))}
      </ul>
    </section>
  );
}

export default function CheckoutGuide() {
  const totalRows = GUIDES.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Templates
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Checkout — brand walkthroughs</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              One checkout, four distributor skins — every use case from the brand docs, solved in
              the same flow. Each brand is a skinned entrypoint into the same unified checkout; the
              flow walks end-to-end (Fulfillment → Payment → Review → Place order → Confirmation).
              Every row deep-links to the live step so you can go one-to-one against the document.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={checkoutHref("baker")} target="_blank" rel="noopener noreferrer">
              Open the unified checkout
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Legend — what the two pills mean, so "in flow" reads as honest scope,
            not a gap. */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Badge variant="soft" color="green">Solved</Badge>
            Built distinctly in the flow
          </span>
          <span className="inline-flex items-center gap-2">
            <Badge variant="soft" color="slate">In flow</Badge>
            Reachable in the flow; micro-feature not a distinct control yet
          </span>
          <span className="ml-auto font-mono text-xs">
            {GUIDES.length} brands · {totalRows} use cases
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {GUIDES.map((guide) => (
            <BrandSection key={guide.key} guide={guide} />
          ))}
        </div>
      </main>
    </div>
  );
}
