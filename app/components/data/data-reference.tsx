"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Boxes,
  ChevronLeft,
  ChevronRight,
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
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
// the "Frequently Bought Together" pattern from the PDP. Enough items per group
// that the rail overflows, so the shared prev/next arrows on the tab row are live.
const FBT_GROUPS = [
  {
    value: "best-sellers",
    label: "Best Sellers",
    items: ["Equipment Pad 40×40", "Whip 6 ft", "Thermostat", "Line Set 3/8", "Condensate Pump", "Filter Drier"],
  },
  {
    value: "pads-blocks",
    label: "Pads & Blocks",
    items: ["Rubber Block", "Anti-Vib Pad", "Riser Block", "Composite Pad", "Snow Legs", "Wall Bracket"],
  },
  {
    value: "refrigerant-oils",
    label: "Refrigerant & Oils",
    items: ["R-410A 25 lb", "POE Oil 1 qt", "Leak Sealant", "R-32 10 lb", "Vacuum Pump Oil", "Dye Cartridge"],
  },
];

// Shared "About This Product" trigger treatment (mirrors about.tsx): no
// underline, primary-blue label + icon when open, colour transitions on the icon.
const ABOUT_TRIGGER =
  "hover:no-underline data-[state=open]:text-primary [&_svg]:transition-colors data-[state=open]:[&_svg]:text-primary";

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

/* ── Grouped-carousel tab demo — the shipped FBT composition (fbt.tsx
 *    `MultiGroupFbt`): the prev/next arrows sit ON the tab row, driving the
 *    active tab's carousel. No empty arrows-only band under the tabs. ── */
function FbtStrip({
  items,
  onApiChange,
}: {
  items: string[];
  onApiChange: (api: CarouselApi | undefined) => void;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  React.useEffect(() => {
    onApiChange(api);
  }, [api, onApiChange]);
  return (
    <Carousel setApi={setApi} opts={{ align: "start" }} className="flex flex-col gap-3 overflow-x-clip">
      <CarouselContent className="ml-0 gap-4 [&>*]:pl-0">
        {items.map((name) => (
          <CarouselItem key={name} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
            <div className="rounded-lg border p-3">
              <div className="aspect-square w-full rounded bg-muted" />
              <p className="mt-2 line-clamp-2 text-sm font-medium">{name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Item 00-0000</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function FbtTabsDemo() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const sync = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
  }, [api]);

  return (
    <div className="w-full">
      <Tabs defaultValue="best-sellers">
        {/* Arrows live ON the tab row: TabsList left, prev/next cluster right. */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="best-sellers">Best Sellers</TabsTrigger>
            <TabsTrigger value="pads-blocks">Pads &amp; Blocks</TabsTrigger>
            <TabsTrigger value="refrigerant-oils">Refrigerant &amp; Oils</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        {/* Tight gap (mt-3) straight to the cards — no empty header band. */}
        {FBT_GROUPS.map((g) => (
          <TabsContent key={g.value} value={g.value} className="mt-3">
            <FbtStrip items={g.items} onApiChange={setApi} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
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
            pattern on the PDP. The shipped treatment puts the prev/next arrows{" "}
            <span className="font-medium text-foreground">on the tab row itself</span> —{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">TabsList</code> on the left, an
            arrows cluster (two{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Button variant=&quot;outline&quot; size=&quot;icon&quot;</code>{" "}
            controls, disabled at the ends) on the right — driving the active tab&apos;s carousel.
            There is no empty arrows-only band under the tabs; the gap to the cards is tight
            (<code className="rounded bg-muted px-1 py-0.5 text-xs">mt-3</code>).
          </p>
          <PreviewCode
            install="tabs carousel"
            previewClassName="items-stretch"
            code={`// The active strip surfaces its Embla api via onApiChange; the arrows on
// the tab row read canScrollPrev/Next off it and drive scrollPrev/Next.
const [api, setApi] = React.useState<CarouselApi>();
const [canPrev, setCanPrev] = React.useState(false);
const [canNext, setCanNext] = React.useState(false);

React.useEffect(() => {
  if (!api) { setCanPrev(false); setCanNext(false); return; }
  const sync = () => {
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  };
  sync();
  api.on("select", sync);
  api.on("reInit", sync);
}, [api]);

return (
  <Tabs defaultValue={groups[0].value}>
    {/* Arrows live ON the tab row: TabsList left, prev/next cluster right. */}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <TabsList>
        {groups.map((g) => (
          <TabsTrigger key={g.value} value={g.value}>{g.label}</TabsTrigger>
        ))}
      </TabsList>
      <div className="flex items-center gap-2">
        <Button
          type="button" variant="outline" size="icon" aria-label="Previous"
          disabled={!canPrev} onClick={() => api?.scrollPrev()}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button" variant="outline" size="icon" aria-label="Next"
          disabled={!canNext} onClick={() => api?.scrollNext()}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
    {/* Tight gap (mt-3) straight to the cards — no empty header band. The strip
        runs hideHeader because the arrows already live on the tab row. */}
    {groups.map((g) => (
      <TabsContent key={g.value} value={g.value} className="mt-3">
        <CarouselStrip items={g.items} hideHeader onApiChange={setApi} />
      </TabsContent>
    ))}
  </Tabs>
);`}
          >
            <FbtTabsDemo />
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
            <span className="font-medium text-foreground">About This Product</span> block
            (<code className="rounded bg-muted px-1 py-0.5 text-xs">about.tsx</code>). Each
            long-form panel — Description, Specifications, Documents, Part List, Where Used — is
            one item; the trigger carries a lucide icon and a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">text-base font-semibold</code>{" "}
            title, turns{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">text-primary</code> when open,
            and never underlines (<code className="rounded bg-muted px-1 py-0.5 text-xs">hover:no-underline</code>).
            The first panel is open (<code className="rounded bg-muted px-1 py-0.5 text-xs">defaultValue</code>).
          </p>
          <PreviewCode
            install="accordion"
            previewClassName="items-stretch"
            code={`// One shared trigger class keeps every About panel consistent (about.tsx).
const TRIGGER =
  "hover:no-underline data-[state=open]:text-primary " +
  "[&_svg]:transition-colors data-[state=open]:[&_svg]:text-primary";

<Accordion type="single" collapsible defaultValue="description">
  <AccordionItem value="description">
    <AccordionTrigger className={TRIGGER}>
      <span className="flex items-center gap-4">
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-base font-semibold">Description</span>
      </span>
    </AccordionTrigger>
    <AccordionContent className="pt-4 pl-10 text-muted-foreground">
      Overview copy, feature bullets, and compliance notes.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="specifications">
    <AccordionTrigger className={TRIGGER}>
      <span className="flex items-center gap-4">
        <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-base font-semibold">Specifications</span>
      </span>
    </AccordionTrigger>
    <AccordionContent className="pt-4 pl-10 text-muted-foreground">
      Filterable spec tables grouped by category.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="documents">
    <AccordionTrigger className={TRIGGER}>
      <span className="flex items-center gap-4">
        <BookOpen className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-base font-semibold">Documents</span>
      </span>
    </AccordionTrigger>
    <AccordionContent className="pt-4 pl-10 text-muted-foreground">
      Spec sheets, manuals, and warranty PDFs.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="part-list">
    <AccordionTrigger className={TRIGGER}>
      <span className="flex items-center gap-4">
        <Wrench className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-base font-semibold">Part List</span>
      </span>
    </AccordionTrigger>
    <AccordionContent className="pt-4 pl-10 text-muted-foreground">
      Matching-model parts with inventory and price.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="where-used">
    <AccordionTrigger className={TRIGGER}>
      <span className="flex items-center gap-4">
        <Boxes className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-base font-semibold">Where Used</span>
      </span>
    </AccordionTrigger>
    <AccordionContent className="pt-4 pl-10 text-muted-foreground">
      Models and assemblies this part appears in.
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
          >
            <div className="w-full max-w-md">
              <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description">
                  <AccordionTrigger className={ABOUT_TRIGGER}>
                    <span className="flex items-center gap-4">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <span className="text-base font-semibold">Description</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pl-10 text-muted-foreground">
                    Overview copy, feature bullets, and compliance notes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="specifications">
                  <AccordionTrigger className={ABOUT_TRIGGER}>
                    <span className="flex items-center gap-4">
                      <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
                      <span className="text-base font-semibold">Specifications</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pl-10 text-muted-foreground">
                    Filterable spec tables grouped by category.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="documents">
                  <AccordionTrigger className={ABOUT_TRIGGER}>
                    <span className="flex items-center gap-4">
                      <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                      <span className="text-base font-semibold">Documents</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pl-10 text-muted-foreground">
                    Spec sheets, manuals, and warranty PDFs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="part-list">
                  <AccordionTrigger className={ABOUT_TRIGGER}>
                    <span className="flex items-center gap-4">
                      <Wrench className="size-4 shrink-0 text-muted-foreground" />
                      <span className="text-base font-semibold">Part List</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pl-10 text-muted-foreground">
                    Matching-model parts with inventory and price.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="where-used">
                  <AccordionTrigger className={ABOUT_TRIGGER}>
                    <span className="flex items-center gap-4">
                      <Boxes className="size-4 shrink-0 text-muted-foreground" />
                      <span className="text-base font-semibold">Where Used</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pl-10 text-muted-foreground">
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
