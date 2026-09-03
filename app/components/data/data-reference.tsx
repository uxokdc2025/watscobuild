"use client";

import Link from "next/link";
import {
  BookOpen,
  Boxes,
  ClipboardList,
  ExternalLink,
  FileText,
  Wrench,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "table", label: "Table" },
  { id: "tabs", label: "Tabs" },
  { id: "accordion", label: "Accordion" },
  { id: "guidance", label: "Guidance" },
  { id: "api", label: "API" },
  { id: "in-production", label: "In production" },
];

const ROWS = [
  { id: "INV-001", status: "Paid", total: "$250.00" },
  { id: "INV-002", status: "Pending", total: "$150.00" },
  { id: "INV-003", status: "Unpaid", total: "$350.00" },
  { id: "INV-004", status: "Paid", total: "$120.00" },
];

// One tab per collection; each tab reveals its own carousel of products —
// the "Frequently Bought Together" pattern from the PDP.
const FBT_GROUPS = [
  { value: "best-sellers", label: "Best Sellers", items: ["Equipment Pad 40×40", "Whip 6 ft", "Thermostat"] },
  { value: "pads-blocks", label: "Pads & Blocks", items: ["Rubber Block", "Anti-Vib Pad", "Riser Block"] },
  { value: "refrigerant-oils", label: "Refrigerant & Oils", items: ["R-410A 25 lb", "POE Oil 1 qt", "Leak Sealant"] },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export default function DataReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Data display</h1>
          <p className="max-w-2xl text-muted-foreground">
            Components that structure and reveal content: rows of records, panels of
            related detail, and stacked disclosures. Each renders live below with the
            exact JSX to paste — production must never re-implement these by hand.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Table, … }"} from &quot;@/components/ui/table&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              npx shadcn add table tabs accordion
            </code>
          </div>
        </header>

        {/* ── Table ── */}
        <section className="space-y-4">
          <H2 id="table">Table</H2>
          <p className="text-sm text-muted-foreground">
            A record grid. Hover any row (live). The middle row carries{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">data-state=&quot;selected&quot;</code>;
            zebra striping is applied at the call site, not baked into the component.
          </p>
          <PreviewCode
            install="table"
            previewClassName="items-stretch"
            code={`<Table className="[&_tbody_tr:nth-child(even)]:bg-muted/40">
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Total</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((r, i) => (
      <TableRow key={r.id} data-state={i === 1 ? "selected" : undefined}>
        <TableCell className="font-medium">{r.id}</TableCell>
        <TableCell>{r.status}</TableCell>
        <TableCell className="text-right">{r.total}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
          >
            <div className="w-full">
              <Table className="[&_tbody_tr:nth-child(even)]:bg-muted/40">
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map((r, i) => (
                    <TableRow key={r.id} data-state={i === 1 ? "selected" : undefined}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell className="text-right">{r.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PreviewCode>
        </section>

        {/* ── Tabs ── */}
        <section className="space-y-4">
          <H2 id="tabs">Tabs</H2>
          <p className="text-sm text-muted-foreground">
            The default variant switches between panels of related content — PDP detail
            sections, for example. Tab 3 is{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">disabled</code>. For tabs used
            as section navigation (line / segmented), see{" "}
            <Link href="/components/navigation#tabs" className="underline underline-offset-2 hover:text-foreground">
              Navigation
            </Link>
            .
          </p>
          <PreviewCode
            install="tabs"
            previewClassName="items-stretch"
            code={`<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="team" disabled>Team</TabsTrigger>
  </TabsList>
  <TabsContent value="account" className="pt-3 text-sm text-muted-foreground">
    Manage your account settings and preferences.
  </TabsContent>
  <TabsContent value="password" className="pt-3 text-sm text-muted-foreground">
    Change your password here.
  </TabsContent>
</Tabs>`}
          >
            <div className="w-full max-w-md">
              <Tabs defaultValue="account">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="team" disabled>
                    Team
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="pt-3 text-sm text-muted-foreground">
                  Manage your account settings and preferences.
                </TabsContent>
                <TabsContent value="password" className="pt-3 text-sm text-muted-foreground">
                  Change your password here.
                </TabsContent>
              </Tabs>
            </div>
          </PreviewCode>

          <h3 className="pt-2 text-base font-semibold tracking-tight">
            Tabs — group multiple carousels
          </h3>
          <p className="text-sm text-muted-foreground">
            The canonical storefront usage: one section holds several parallel collections,
            and each tab reveals its own product carousel. This is the{" "}
            <span className="font-medium text-foreground">Frequently Bought Together</span>{" "}
            pattern on the PDP — swap the placeholder strip below for the real{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Carousel</code>.
          </p>
          <PreviewCode
            install="tabs"
            previewClassName="items-stretch"
            code={`<Tabs defaultValue="best-sellers">
  <TabsList>
    <TabsTrigger value="best-sellers">Best Sellers</TabsTrigger>
    <TabsTrigger value="pads-blocks">Pads & Blocks</TabsTrigger>
    <TabsTrigger value="refrigerant-oils">Refrigerant & Oils</TabsTrigger>
  </TabsList>
  {groups.map((g) => (
    <TabsContent key={g.value} value={g.value} className="pt-4">
      {/* Each tab holds its own carousel — here a lightweight scroll-row. */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {g.items.map((name) => (
          <div key={name} className="w-40 shrink-0 rounded-lg border p-3">
            <div className="aspect-square w-full rounded bg-muted" />
            <p className="mt-2 line-clamp-2 text-sm font-medium">{name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Item 00-0000</p>
          </div>
        ))}
      </div>
    </TabsContent>
  ))}
</Tabs>`}
          >
            <div className="w-full">
              <Tabs defaultValue="best-sellers">
                <TabsList>
                  <TabsTrigger value="best-sellers">Best Sellers</TabsTrigger>
                  <TabsTrigger value="pads-blocks">Pads &amp; Blocks</TabsTrigger>
                  <TabsTrigger value="refrigerant-oils">Refrigerant &amp; Oils</TabsTrigger>
                </TabsList>
                {FBT_GROUPS.map((g) => (
                  <TabsContent key={g.value} value={g.value} className="pt-4">
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {g.items.map((name) => (
                        <div key={name} className="w-40 shrink-0 rounded-lg border p-3">
                          <div className="aspect-square w-full rounded bg-muted" />
                          <p className="mt-2 line-clamp-2 text-sm font-medium">{name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">Item 00-0000</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </PreviewCode>
          <p className="text-sm text-muted-foreground">
            Use Tabs when a section holds several parallel carousels/collections (e.g.
            Frequently Bought Together on the PDP).
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pdp/uc-tabs-accordions?signedin=1"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              In production — PDP: Frequently Bought Together
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </section>

        {/* ── Accordion ── */}
        <section className="space-y-4">
          <H2 id="accordion">Accordion</H2>
          <p className="text-sm text-muted-foreground">
            Stacked disclosures — spec sheets, FAQs, PDP detail groups.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">type=&quot;single&quot;</code> +{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">collapsible</code> lets one
            panel open at a time and every panel close.
          </p>
          <PreviewCode
            install="accordion"
            previewClassName="items-stretch"
            code={`<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. It comes with default styles that match the other components.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Is it animated?</AccordionTrigger>
    <AccordionContent>
      Yes, with a CSS-driven open/close transition.
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
          >
            <div className="w-full max-w-md">
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that match the other components.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes, with a CSS-driven open/close transition.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </PreviewCode>

          <h3 className="pt-2 text-base font-semibold tracking-tight">
            Accordion — product info sections
          </h3>
          <p className="text-sm text-muted-foreground">
            The canonical storefront usage: the PDP&apos;s{" "}
            <span className="font-medium text-foreground">About This Product</span> block.
            Each long-form panel — Description, Specifications, Documents, Part List, Where
            Used — is one item, with a lucide icon on its trigger and the first panel open.
          </p>
          <PreviewCode
            install="accordion"
            previewClassName="items-stretch"
            code={`<Accordion type="single" collapsible defaultValue="description">
  <AccordionItem value="description">
    <AccordionTrigger className="hover:no-underline">
      <span className="flex items-center gap-3">
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        Description
      </span>
    </AccordionTrigger>
    <AccordionContent className="pl-7 text-muted-foreground">
      Overview copy, feature bullets, and compliance notes.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="specifications">
    <AccordionTrigger className="hover:no-underline">
      <span className="flex items-center gap-3">
        <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
        Specifications
      </span>
    </AccordionTrigger>
    <AccordionContent className="pl-7 text-muted-foreground">
      Filterable spec tables grouped by category.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="documents">
    <AccordionTrigger className="hover:no-underline">
      <span className="flex items-center gap-3">
        <BookOpen className="size-4 shrink-0 text-muted-foreground" />
        Documents
      </span>
    </AccordionTrigger>
    <AccordionContent className="pl-7 text-muted-foreground">
      Spec sheets, manuals, and warranty PDFs.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="part-list">
    <AccordionTrigger className="hover:no-underline">
      <span className="flex items-center gap-3">
        <Wrench className="size-4 shrink-0 text-muted-foreground" />
        Part List
      </span>
    </AccordionTrigger>
    <AccordionContent className="pl-7 text-muted-foreground">
      Matching-model parts with inventory and price.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="where-used">
    <AccordionTrigger className="hover:no-underline">
      <span className="flex items-center gap-3">
        <Boxes className="size-4 shrink-0 text-muted-foreground" />
        Where Used
      </span>
    </AccordionTrigger>
    <AccordionContent className="pl-7 text-muted-foreground">
      Models and assemblies this part appears in.
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
          >
            <div className="w-full max-w-md">
              <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-3">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      Description
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-7 text-muted-foreground">
                    Overview copy, feature bullets, and compliance notes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="specifications">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-3">
                      <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
                      Specifications
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-7 text-muted-foreground">
                    Filterable spec tables grouped by category.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="documents">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-3">
                      <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                      Documents
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-7 text-muted-foreground">
                    Spec sheets, manuals, and warranty PDFs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="part-list">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-3">
                      <Wrench className="size-4 shrink-0 text-muted-foreground" />
                      Part List
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-7 text-muted-foreground">
                    Matching-model parts with inventory and price.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="where-used">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-3">
                      <Boxes className="size-4 shrink-0 text-muted-foreground" />
                      Where Used
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-7 text-muted-foreground">
                    Models and assemblies this part appears in.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </PreviewCode>
          <p className="text-sm text-muted-foreground">
            Use an Accordion for long-form product info panels (Description, Specifications,
            Documents, Part List, Where Used) — the &ldquo;About This Product&rdquo; pattern.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pdp/uc-tabs-accordions?signedin=1"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              In production — PDP: About This Product
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Mark the active row with <code className="rounded bg-muted px-1 py-0.5 text-xs">data-state=&quot;selected&quot;</code> — it maps to the built-in <code className="rounded bg-muted px-1 py-0.5 text-xs">bg-muted</code>.</>,
              <>Right-align numeric columns with <code className="rounded bg-muted px-1 py-0.5 text-xs">text-right</code> on both head and cell.</>,
              <>Give every <code className="rounded bg-muted px-1 py-0.5 text-xs">Accordion</code> item a stable, unique <code className="rounded bg-muted px-1 py-0.5 text-xs">value</code>.</>,
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">type=&quot;single&quot; collapsible</code> for spec/FAQ groups where one panel opens at a time.</>,
            ]}
            donts={[
              <>Hand-roll a <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;table&gt;</code> with copied classes — hover/selected drift instantly.</>,
              <>Bake zebra striping into the component; apply it per-table at the call site.</>,
              <>Nest interactive controls inside an <code className="rounded bg-muted px-1 py-0.5 text-xs">AccordionTrigger</code> — it is itself a button.</>,
              <>Reach for Tabs when the panels are unrelated pages — that is Navigation.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="Table — parts"
            rows={[
              { name: "Table", type: "table", description: "Wraps in an overflow-x-auto container automatically." },
              { name: "TableHeader / TableBody / TableFooter", type: "thead / tbody / tfoot", description: "Structural sections." },
              { name: "TableRow", type: "tr", description: "Hover + data-state=\"selected\" styling built in." },
              { name: "TableHead", type: "th", description: "Column header cell (h-10, left-aligned)." },
              { name: "TableCell", type: "td", description: "Body cell (p-2, nowrap)." },
              { name: "TableCaption", type: "caption", description: "Muted caption below the table." },
            ]}
          />
          <PropsTable
            caption="Tabs — props"
            rows={[
              { name: "TabsList variant", type: "default | line | segmented", description: "default = pill track (this page). line / segmented = Navigation." },
              { name: "Tabs defaultValue", type: "string", description: "Value of the tab open on first render." },
              { name: "Tabs orientation", type: "horizontal | vertical", description: "Lays the list across or down." },
              { name: "TabsTrigger disabled", type: "boolean", description: "Non-selectable tab." },
            ]}
          />
          <PropsTable
            caption="Accordion — props"
            rows={[
              { name: "type", type: "single | multiple", description: "One panel open, or many at once." },
              { name: "collapsible", type: "boolean", description: "(single only) allow all panels closed." },
              { name: "defaultValue", type: "string | string[]", description: "Item value(s) open on first render." },
              { name: "AccordionItem value", type: "string", description: "Required stable id per item." },
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where these ship. Compare against the library above.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "PDP — detail tabs & specs", href: "/pdp/uc-replacement-products?signedin=1" },
              { label: "PLP — Search results", href: "/search?q=blower%20motor&signedin=1" },
              { label: "Checkout", href: "/checkout?demo=1" },
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
