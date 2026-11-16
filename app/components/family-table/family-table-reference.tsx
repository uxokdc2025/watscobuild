"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, ListPlus, ShoppingCart } from "lucide-react";

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
} from "@/components/ui/expandable-product-row";
import { CodeBlock, PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "family-section", label: "Family Section" },
  { id: "family-table", label: "Family Table" },
  { id: "column-config", label: "Column Config" },
  { id: "expandable-row", label: "Expandable Row" },
  { id: "branch-availability", label: "Branch Availability" },
  { id: "qty-stepper", label: "Qty Stepper" },
  { id: "anatomy", label: "Anatomy" },
  { id: "guidance", label: "Guidance" },
  { id: "in-production", label: "In Production" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

/* ---------------------------------------------------------------- *
 * Sample data — three SKUs out of one real Bryant® condenser family.
 * ---------------------------------------------------------------- */

type DemoRow = {
  id: string;
  title: string;
  item: string;
  mfg: string;
  brand: string;
  refrigerant: string;
  tonnage: string;
  capacity: string;
  voltage: string;
  dimensions: string;
  price: string;
};

const DEMO_ROWS: DemoRow[] = [
  {
    id: "134SAN02400N",
    title: "Bryant® - Legacy™ - 2.0-Ton - 14 SEER - Single Stage Air Conditioner - 208/1 - R-454B",
    item: "134SAN02400N",
    mfg: "134SAN02400N",
    brand: "Bryant®",
    refrigerant: "R-454B",
    tonnage: "2 Ton",
    capacity: "24,000 Btu/h",
    voltage: "208/230V · 1 Ph",
    dimensions: '28" × 29½" × 29½"',
    price: "$2,049.00",
  },
  {
    id: "134SAN03000N",
    title: "Bryant® - Legacy™ - 2.5-Ton - 14 SEER - Single Stage Air Conditioner - 208/1 - R-454B",
    item: "134SAN03000N",
    mfg: "134SAN03000N",
    brand: "Bryant®",
    refrigerant: "R-454B",
    tonnage: "2.5 Ton",
    capacity: "30,000 Btu/h",
    voltage: "208/230V · 1 Ph",
    dimensions: '28" × 29½" × 29½"',
    price: "$2,187.50",
  },
  {
    id: "134SAN03600N",
    title: "Bryant® - Legacy™ - 3.0-Ton - 14 SEER - Single Stage Air Conditioner - 208/1 - R-454B",
    item: "134SAN03600N",
    mfg: "134SAN03600N",
    brand: "Bryant®",
    refrigerant: "R-454B",
    tonnage: "3 Ton",
    capacity: "36,000 Btu/h",
    voltage: "208/230V · 1 Ph",
    dimensions: '32" × 29½" × 29½"',
    price: "$2,310.00",
  },
];

const DEMO_IMAGE =
  "https://resource.carrierenterprise.com/is/image/Watscocom/bryant_134san_en_normal?defaultImage=homans_image-coming-soon&fmt=jpg&wid=320&hei=320&qlt=85&fit=fit,1";

const DEMO_COLUMNS: FamilyTableColumn<DemoRow>[] = [
  { key: "tonnage", label: "Tonnage", render: (r) => <span className="tabular-nums">{r.tonnage}</span> },
  { key: "capacity", label: "Cooling capacity", hideBelow: "sm", render: (r) => <span className="tabular-nums">{r.capacity}</span> },
  { key: "voltage", label: "Voltage", hideBelow: "md", render: (r) => r.voltage },
  { key: "dimensions", label: "Dimensions (H×W×D)", hideBelow: "lg", render: (r) => r.dimensions },
  { key: "brand", label: "Brand", hideBelow: "md", render: (r) => r.brand },
  {
    key: "price",
    label: "Price",
    align: "right",
    render: (r) => (
      <span className="font-semibold text-price tabular-nums">
        {r.price}
        <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
      </span>
    ),
  },
];

function DemoCommerce({ row }: { row: DemoRow }) {
  const [qty, setQty] = React.useState(1);
  return (
    <>
      <p className="text-lg font-bold leading-6 text-price">
        {row.price}
        <span className="ml-1 text-xs font-normal text-muted-foreground">/ EACH</span>
      </p>
      <BranchAvailabilityList
        branches={[
          { name: "Manchester, NH - Homans", qty: 2 },
          { name: "Nearby branches", qty: 29 },
          { name: "All branches", qty: 31 },
        ]}
      />
      <div className="flex items-center gap-2">
        <QtyStepper value={qty} onChange={setQty} label={`Quantity for ${row.item}`} />
        <Button type="button" size="sm" className="h-[34px] flex-1">
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

function DemoDetail({ row }: { row: DemoRow }) {
  return (
    <ExpandableProductRowDetail
      image={DEMO_IMAGE}
      brand={row.brand}
      title={row.title}
      href={`/pdp/tradepro-${row.item.toLowerCase()}`}
      item={row.item}
      mfg={row.mfg}
      compareId={`ds-compare-${row.id}`}
      specs={
        <SpecList
          items={[
            { label: "Tonnage", value: row.tonnage },
            { label: "Cooling capacity", value: row.capacity },
            { label: "Voltage", value: row.voltage },
            { label: "Dimensions (H×W×D)", value: row.dimensions },
            { label: "Refrigerant", value: row.refrigerant },
            { label: "Brand", value: row.brand },
          ]}
        />
      }
      commerce={<DemoCommerce row={row} />}
    />
  );
}

function DemoFamilyTable() {
  return (
    <FamilyTable
      columns={DEMO_COLUMNS}
      groups={[{ key: "r-454b", label: "R-454B", rows: DEMO_ROWS }]}
      groupLabel="Refrigerant"
      caption="Bryant® Legacy™ 134SAN — compare by tonnage, capacity, voltage, dimensions, brand, price"
      rowKey={(r) => r.id}
      rowLabel={(r) => r.title}
      renderDetail={(r) => <DemoDetail row={r} />}
    />
  );
}

/* ---------------------------------------------------------------- */

const ANATOMY: { part: string; detail: string }[] = [
  { part: "Family header", detail: "Thumbnail + family name + a short plain-language description + a count/range meta line. Never a bare SKU list." },
  { part: "Column header", detail: "Uppercase 12px muted labels on a muted band; labels come from the category's column config." },
  { part: "Sub-group band", detail: "A colgroup <th> spanning the table: “Refrigerant: R-454B (12)”. One table per family so columns stay aligned across bands." },
  { part: "Summary row", detail: "Comparison columns only — the attributes a contractor scans. The whole row is the expand target; the chevron carries the aria-expanded state." },
  { part: "Expanded panel", detail: "Image, brand, name, Item/MFG, View product details, Compare, full spec list, price, availability by branch, qty, Add to Cart, Add to List." },
  { part: "Responsive drop-out", detail: "hideBelow drops a column below sm/md/lg; the value still appears in the panel's spec list, so a phone loses no information." },
];

export default function FamilyTableReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Blocks
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Family Table</h1>
          <p className="max-w-2xl text-muted-foreground">
            The grouped result table that replaces the flat list view. Results are bucketed into
            product families; each family is a section with a thumbnail and a short description,
            rows are sub-grouped by a key attribute, and a row expands in place with everything
            needed to buy. Columns are data-driven per category — a category gets different
            columns by adding a config entry, never by forking the table.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ FamilyTable, ProductFamilySection, SpecList }"} from
              &quot;@/components/ui/family-table&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ ExpandableProductRowDetail, BranchAvailabilityList }"} from
              &quot;@/components/ui/expandable-product-row&quot;
            </code>
          </div>
        </header>

        {/* ── Family section ── */}
        <section className="space-y-4">
          <H2 id="family-section">Family section</H2>
          <p className="text-sm text-muted-foreground">
            The section header does the work the old flat list could not: it tells a contractor
            what the whole block of SKUs <em>is</em> before they read a single row. Thumbnail,
            family name, two lines of positioning, then a count / tonnage span.
          </p>
          <PreviewCode
            previewClassName="block"
            code={`<ProductFamilySection
  name="Bryant® Legacy™ 134SAN Air Conditioner"
  description="Single-stage 14-SEER R-454B condensers — the straightforward residential changeout."
  image={familyImage}
  meta="3 products · 2–3 Ton"
>
  <FamilyTable ... />
</ProductFamilySection>`}
          >
            <div className="w-full">
              <ProductFamilySection
                name="Bryant® Legacy™ 134SAN Air Conditioner"
                description="Single-stage 14-SEER R-454B condensers — the straightforward residential changeout. Full 2–4 ton ladder, 208/230V single phase."
                image={DEMO_IMAGE}
                meta="3 products · 2–3 Ton"
              >
                <p className="px-4 py-3 text-xs text-muted-foreground">
                  (table slot — see below)
                </p>
              </ProductFamilySection>
            </div>
          </PreviewCode>
        </section>

        {/* ── Family table ── */}
        <section className="space-y-4">
          <H2 id="family-table">Family table</H2>
          <p className="text-sm text-muted-foreground">
            One table per family. Click any row — or its chevron — to expand it in place. Only one
            row is open at a time, so the comparison never scrolls away. Narrow the window to see
            the <code className="rounded bg-muted px-1 py-0.5 text-xs">hideBelow</code> columns
            drop out.
          </p>
          <PreviewCode
            previewClassName="block"
            code={`<FamilyTable
  columns={columns}
  groups={groupBySpec(rows, "refrigerant")}
  groupLabel="Refrigerant"
  rowKey={(row) => row.id}
  rowLabel={(row) => row.title}
  renderDetail={(row) => <RowDetail row={row} />}
/>`}
          >
            <div className="w-full overflow-hidden rounded-lg border bg-card">
              <DemoFamilyTable />
            </div>
          </PreviewCode>
          <PropsTable
            caption="FamilyTable"
            rows={[
              { name: "columns", type: "FamilyTableColumn<T>[]", description: "The comparison columns. Derive from the category config map — never hardcode per page." },
              { name: "groups", type: "FamilyTableGroup<T>[]", description: "Sub-groups inside the family. Pass one group to render without bands." },
              { name: "groupLabel", type: "string", description: "Prefix on each band, e.g. “Refrigerant”. Omit with a single group." },
              { name: "rowKey", type: "(row: T) => string", description: "Stable row identity — also drives which row is expanded." },
              { name: "rowLabel", type: "(row: T) => string", description: "Accessible name for the expand toggle and the panel region. Use the product title." },
              { name: "renderDetail", type: "(row: T) => ReactNode", description: "The accordion panel. Compose ExpandableProductRowDetail." },
            ]}
          />
        </section>

        {/* ── Column config ── */}
        <section className="space-y-4">
          <H2 id="column-config">Column config (per category)</H2>
          <p className="text-sm text-muted-foreground">
            Columns differ by category — AC condensers compare tonnage and capacity, motors compare
            horsepower and RPM. Keep that in a plain config map and attach the render functions in
            the view, so adding a category is one data entry with no JSX.
          </p>
          <CodeBlock
            code={`// app/search/_lib/family-table-config.ts
export const CATEGORY_TABLE_CONFIG: Record<string, CategoryTableConfig> = {
  residential: {
    groupBy: "refrigerant",
    groupLabel: "Refrigerant",
    columns: [
      { key: "tonnage",    label: "Tonnage" },
      { key: "capacity",   label: "Cooling capacity",   hideBelow: "sm" },
      { key: "voltage",    label: "Voltage",            hideBelow: "md" },
      { key: "dimensions", label: "Dimensions (H×W×D)", hideBelow: "lg" },
      { key: "brand",      label: "Brand",              hideBelow: "md" },
      { key: "price",      label: "Price", align: "right", kind: "price" },
    ],
  },
};`}
          />
          <PropsTable
            caption="FamilyColumnConfig"
            rows={[
              { name: "key", type: "string", description: "Addresses a value on the normalized row's `specs`. With kind:\"price\", routes through the signed-in price gate." },
              { name: "label", type: "string", description: "The column header, and the label used in the expanded spec list." },
              { name: "align", type: '"left" | "right"', description: "Right-align price and numeric columns." },
              { name: "hideBelow", type: '"sm" | "md" | "lg"', description: "Drop the column below this breakpoint. The value still shows in the expanded panel." },
              { name: "kind", type: '"spec" | "price"', description: "“price” renders the gated price cell. Omitted means a plain spec value." },
            ]}
          />
        </section>

        {/* ── Expandable row ── */}
        <section className="space-y-4">
          <H2 id="expandable-row">Expandable row</H2>
          <p className="text-sm text-muted-foreground">
            The panel a row opens into — three zones at lg+, stacked below. The{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">commerce</code> slot is
            caller-supplied, because price gating, cart wiring and branch inventory are app
            concerns; the panel owns the layout and the identity block.
          </p>
          <PreviewCode
            previewClassName="block"
            code={`<ExpandableProductRowDetail
  image={row.image}
  brand={row.brand}
  title={row.title}
  href={pdpHref}
  item={row.item}
  mfg={row.mfg}
  compareId={\`compare-\${row.id}\`}
  specs={<SpecList items={specs} />}
  commerce={<RowCommerce row={row} />}
/>`}
          >
            <div className="w-full rounded-lg border bg-muted/20 p-4">
              <DemoDetail row={DEMO_ROWS[2]} />
            </div>
          </PreviewCode>
        </section>

        {/* ── Branch availability ── */}
        <section className="space-y-4">
          <H2 id="branch-availability">Branch availability</H2>
          <p className="text-sm text-muted-foreground">
            The expanded row shows stock per branch, not the single aggregate line a card has. A
            zero-stock branch reads &ldquo;Available to order&rdquo; in the friendly low-stock
            token — never red. A transfer is still a sale.
          </p>
          <PreviewCode
            code={`<BranchAvailabilityList
  branches={[
    { name: "Manchester, NH - Homans", qty: 2 },
    { name: "Nearby branches", qty: 29 },
    { name: "All branches", qty: 31 },
  ]}
/>`}
          >
            <div className="w-full max-w-xs">
              <BranchAvailabilityList
                branches={[
                  { name: "Manchester, NH - Homans", qty: 2 },
                  { name: "Nashua, NH - Homans", qty: 0 },
                  { name: "All branches", qty: 31 },
                ]}
              />
            </div>
          </PreviewCode>
        </section>

        {/* ── Qty stepper ── */}
        <section className="space-y-4">
          <H2 id="qty-stepper">Qty stepper</H2>
          <p className="text-sm text-muted-foreground">
            Extracted from the canonical ProductCard so the grid card and the expanded row share
            one control. 34px tall, 28px cells, disabled at the bounds.
          </p>
          <PreviewCode code={`<QtyStepper value={qty} onChange={setQty} />`}>
            <QtyStepperDemo />
          </PreviewCode>
        </section>

        {/* ── Anatomy ── */}
        <section className="space-y-4">
          <H2 id="anatomy">Anatomy</H2>
          <PropsTable caption="Parts, top to bottom" rows={ANATOMY.map((a) => ({ name: a.part, type: "", description: a.detail }))} />
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Group by product family first, then sub-group by the attribute the category is actually filtered on.</>,
              <>Keep the summary row to comparison columns — identity and commerce belong in the panel.</>,
              <>Add a category by adding a config entry to <code className="rounded bg-muted px-1 py-0.5 text-xs">CATEGORY_TABLE_CONFIG</code>.</>,
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">hideBelow</code> for narrow screens; the spec list in the panel is the safety net.</>,
            ]}
            donts={[
              <>Ship a flat one-row-per-SKU table — that is the &ldquo;Excel spreadsheet&rdquo; this pattern replaced.</>,
              <>Fork the table per category, or hardcode columns inside a page.</>,
              <>Open every row at once; one panel at a time keeps the comparison on screen.</>,
              <>Put price in the table without the signed-in gate — price is always gated.</>,
              <>Use the Family Table for the Grid view; Grid stays on the canonical ProductCard.</>,
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where this pattern ships. Switch to the <strong>List</strong> view.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Residential category — List view", href: "/search?brand=homans&category=residential&signedin=1" },
              { label: "Search results — List view", href: "/search?q=blower%20motor&signedin=1" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
                <ExternalLink className="size-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}

function QtyStepperDemo() {
  const [qty, setQty] = React.useState(1);
  return <QtyStepper value={qty} onChange={setQty} />;
}
