"use client";

/**
 * Family list view — the List toggle on /search and the category PLPs.
 *
 * Replaces the flat one-row-per-SKU list (the "Excel spreadsheet") with the
 * Grainger shape: results grouped into product families, each family a
 * section with a thumbnail and a short description, rows sub-grouped by a key
 * attribute and expanding in place.
 *
 * The expanded row has two documented shapes, picked with `expandedRow`:
 *
 * - `"list-card"` (Nov 17, item 6b) — the row opens into the design system's
 *   list-view product card (`ProductListRow`, via `./list-view`): image,
 *   capped description, availability, price + Add. No spec grid, no
 *   availability box, no Compare.
 * - `"spec-panel"` — the Nov 10 panel (`ExpandableProductRowDetail`), kept so
 *   `?rev=nov10` still opens the state handed out at that review.
 *
 * This file is the ADAPTER only. The visual patterns live in the design
 * system (`@/components/ui/family-table`,
 * `@/components/ui/expandable-product-row`,
 * `@/components/ui/product-list-row`) and the columns come from the
 * per-category config map (`./family-table-config`). Everything app-specific
 * — the signed-in price gate, the cart, Homans' contact-for-availability
 * behavior — is resolved here.
 *
 * Grid view is untouched; it still renders the canonical ProductCard.
 */

import * as React from "react";
import { ListPlus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QtyStepper } from "@/components/ui/qty-stepper";
import {
  FamilyTable,
  ProductFamilySection,
  SpecList,
  type FamilyTableColumn,
} from "@/components/ui/family-table";
import {
  BranchAvailabilityList,
  ExpandableProductRowDetail,
  type BranchStock,
} from "@/components/ui/expandable-product-row";
import { useCart } from "@/components/cart/cart-context";
import { formatUSD } from "@/app/pdp/_lib/types";

import type { SearchResult } from "./mock-data";
import { SearchListRow } from "./list-view";
import { productImageFor } from "./product-images";
import {
  groupBySpec,
  groupIntoFamilies,
  tonnageSpan,
  type NormalizedProduct,
} from "./product-families";
import type { CategoryTableConfig } from "./family-table-config";

const EMPTY = "—";

export function FamilyListView({
  results,
  signedIn,
  brandKey,
  storeName,
  config,
  expandedRow = "spec-panel",
  signInHref = "?signedin=1",
}: {
  results: SearchResult[];
  signedIn: boolean;
  brandKey: string;
  /** Branch label for the first availability line, e.g. "Manchester, NH - Homans". */
  storeName: string;
  config: CategoryTableConfig;
  /**
   * What a row opens into. "list-card" renders the DS list-view product card
   * (the Nov 17 state); "spec-panel" keeps the Nov 10 spec/availability panel.
   */
  expandedRow?: "list-card" | "spec-panel";
  /** Current URL with `signedin=1` — the gated-price link target. */
  signInHref?: string;
}) {
  const families = React.useMemo(
    () => groupIntoFamilies(results, (r, i) => productImageFor(brandKey, i, r.image)),
    [results, brandKey],
  );

  // The config map is plain data; the render functions are attached here so
  // the config stays serializable and a new category is one entry, no JSX.
  const columns = React.useMemo<FamilyTableColumn<NormalizedProduct>[]>(
    () =>
      config.columns.map((col) => ({
        key: col.key,
        label: col.label,
        align: col.align,
        hideBelow: col.hideBelow,
        render:
          col.kind === "price"
            ? (row) => <PriceCell row={row} signedIn={signedIn} />
            : (row) => <span className="tabular-nums">{row.specs[col.key] ?? EMPTY}</span>,
      })),
    [config, signedIn],
  );

  if (!results.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {families.map(({ family, rows }) => {
        const span = tonnageSpan(rows);
        const meta = [
          `${rows.length} ${rows.length === 1 ? "product" : "products"}`,
          span,
        ]
          .filter(Boolean)
          .join(" · ");
        return (
          <ProductFamilySection
            key={family.key}
            name={family.name}
            description={family.description}
            image={family.image}
            meta={meta}
          >
            <FamilyTable
              columns={columns}
              groups={groupBySpec(rows, config.groupBy)}
              groupLabel={config.groupLabel}
              caption={`${family.name} — compare by ${config.columns.map((c) => c.label).join(", ")}`}
              rowKey={(row) => row.id}
              rowLabel={(row) => row.title}
              renderDetail={(row) =>
                expandedRow === "list-card" ? (
                  // The expanded row IS the design system's list-view card —
                  // same component the list stack and the drawers render.
                  <div className="overflow-hidden rounded-lg border bg-background">
                    <SearchListRow
                      result={row}
                      image={row.image}
                      signedIn={signedIn}
                      storeName={storeName}
                      signInHref={signInHref}
                    />
                  </div>
                ) : (
                  <RowDetail
                    row={row}
                    signedIn={signedIn}
                    storeName={storeName}
                    config={config}
                  />
                )
              }
            />
          </ProductFamilySection>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Price — gated to logged-in (repo-wide rule).
 * ------------------------------------------------------------------ */

function PriceCell({ row, signedIn }: { row: NormalizedProduct; signedIn: boolean }) {
  if (!signedIn || row.price == null) {
    return <span className="text-xs font-medium text-primary">Sign in</span>;
  }
  return (
    <span className="whitespace-nowrap font-semibold text-price tabular-nums">
      {formatUSD(row.price)}
      <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Expanded row — the Nov 10 spec/availability panel. Only `?rev=nov10`
 * reaches this now; Nov 17 opens the DS list card above.
 * ------------------------------------------------------------------ */

function RowDetail({
  row,
  signedIn,
  storeName,
  config,
}: {
  row: NormalizedProduct;
  signedIn: boolean;
  storeName: string;
  config: CategoryTableConfig;
}) {
  // Every configured column shows here, including the ones the table dropped
  // at this breakpoint — the panel is the full spec sheet. The sub-group
  // attribute joins them so the panel stands alone, away from its band.
  const specs = [
    ...config.columns
      .filter((col) => col.kind !== "price")
      .map((col) => ({ label: col.label, value: row.specs[col.key] ?? EMPTY })),
    { label: config.groupLabel, value: row.specs[config.groupBy] ?? EMPTY },
  ];

  return (
    <ExpandableProductRowDetail
      image={row.image}
      brand={row.brand}
      title={row.title}
      href={row.href ?? `/pdp/tradepro-${row.item.toLowerCase()}`}
      item={row.item}
      mfg={row.mfg}
      compareId={`compare-${row.id}`}
      specs={<SpecList items={specs} />}
      commerce={<RowCommerce row={row} signedIn={signedIn} storeName={storeName} />}
    />
  );
}

/** Availability split across branches, derived from the row's all-branches
 *  count so the expanded panel never contradicts the card's stock line. */
function branchesFor(row: NormalizedProduct, storeName: string): BranchStock[] {
  const all = row.allBranchesQty ?? 0;
  // Matches the ProductCard convention: a stocked SKU shows 2 at your branch.
  const yourBranch = row.stockStatus === "out-of-stock" ? 0 : Math.min(2, all);
  return [
    { name: storeName, qty: yourBranch },
    { name: "Nearby branches", qty: Math.max(0, all - yourBranch) },
    { name: "All branches", qty: all },
  ];
}

function RowCommerce({
  row,
  signedIn,
  storeName,
}: {
  row: NormalizedProduct;
  signedIn: boolean;
  storeName: string;
}) {
  const [qty, setQty] = React.useState(1);
  const { addItem } = useCart();

  if (!signedIn || row.price == null) {
    return (
      <p className="text-sm">
        <a href="?signedin=1" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </a>{" "}
        <span className="text-muted-foreground">to see pricing and branch inventory.</span>
      </p>
    );
  }

  return (
    <>
      <div>
        <p className="text-lg font-bold leading-6 text-price">
          {formatUSD(row.price)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
        </p>
        {row.points != null ? (
          <p className="text-xs font-medium text-[color:var(--violet)]">
            Earn {row.points.toLocaleString()} points
          </p>
        ) : null}
      </div>

      {/* Homans never shows out-of-stock — flagged SKUs swap the branch list
          for the Contact Us affordance the cards already use. */}
      {row.contactForAvailability ? (
        <div className="space-y-0.5 text-xs">
          <p className="font-medium text-low-stock">Limited Availability</p>
          <p className="text-muted-foreground">Let us help you find this product.</p>
          <a href="#" className="font-medium text-primary underline-offset-2 hover:underline">
            Contact Us
          </a>
        </div>
      ) : (
        <BranchAvailabilityList branches={branchesFor(row, storeName)} />
      )}

      <div className="flex items-center gap-2">
        <QtyStepper value={qty} onChange={setQty} label={`Quantity for ${row.title}`} />
        <Button
          type="button"
          size="sm"
          className="h-[34px] flex-1"
          onClick={() =>
            addItem(
              {
                id: row.id,
                title: row.title,
                brand: row.brand,
                item: row.item,
                mfg: row.mfg,
                image: row.image,
                price: row.price ?? 0,
              },
              qty,
            )
          }
        >
          <ShoppingCart className="size-4 shrink-0" />
          Add to Cart
        </Button>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ListPlus className="size-4" />
        Add to List
      </button>
    </>
  );
}
