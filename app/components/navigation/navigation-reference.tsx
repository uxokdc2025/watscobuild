"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "breadcrumb", label: "Breadcrumb" },
  { id: "pagination", label: "Pagination" },
  { id: "tabs-nav", label: "Tabs as nav" },
  { id: "guidance", label: "Guidance" },
  { id: "api", label: "API" },
  { id: "in-production", label: "In production" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export default function NavigationReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
          <p className="max-w-2xl text-muted-foreground">
            Wayfinding controls — where the shopper is, how to move between result pages,
            and how to switch between sections of a category. Each renders live below with
            the exact JSX to paste. Selected, current-page, and disabled states are shown;
            hover and focus are produced by the component itself.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Breadcrumb, … }"} from &quot;@/components/ui/breadcrumb&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              npx shadcn add breadcrumb pagination tabs
            </code>
          </div>
        </header>

        {/* ── Breadcrumb ── */}
        <section className="space-y-4">
          <H2 id="breadcrumb">Breadcrumb</H2>
          <p className="text-sm text-muted-foreground">
            The trail to the current page. The last item is a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">BreadcrumbPage</code> (not a
            link — it carries <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-current=&quot;page&quot;</code>);
            collapse deep trails with a <code className="rounded bg-muted px-1 py-0.5 text-xs">BreadcrumbEllipsis</code>.
          </p>
          <PreviewCode
            install="breadcrumb"
            previewClassName="items-start"
            code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PreviewCode>
        </section>

        {/* ── Pagination ── */}
        <section className="space-y-4">
          <H2 id="pagination">Pagination</H2>
          <p className="text-sm text-muted-foreground">
            Moves between result pages. The current page sets{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">isActive</code> (renders the
            outline variant + <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-current=&quot;page&quot;</code>);
            Previous/Next hide their label on small screens.
          </p>
          <PreviewCode
            install="pagination"
            previewClassName="items-start"
            code={`<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
          >
            <div className="w-full">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </PreviewCode>
        </section>

        {/* ── Tabs as nav ── */}
        <section className="space-y-4">
          <H2 id="tabs-nav">Tabs as nav</H2>
          <p className="text-sm text-muted-foreground">
            When tabs switch between sections of a category, use the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">line</code> variant (underlined,
            brand-colored active tab) or the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">segmented</code> variant (the
            Pack-Size selector style). For tabs that switch content panels, see{" "}
            <Link href="/components/data#tabs" className="underline underline-offset-2 hover:text-foreground">
              Data display
            </Link>
            .
          </p>
          <PreviewCode
            install="tabs"
            previewClassName="items-stretch"
            code={`{/* Line — underlined, brand-colored active tab */}
<Tabs defaultValue="equipment">
  <TabsList variant="line">
    <TabsTrigger value="equipment">Equipment</TabsTrigger>
    <TabsTrigger value="parts">Parts</TabsTrigger>
    <TabsTrigger value="supplies">Supplies</TabsTrigger>
  </TabsList>
  <TabsContent value="equipment" className="pt-3 text-sm text-muted-foreground">
    Frequently bought equipment.
  </TabsContent>
</Tabs>`}
          >
            <div className="w-full max-w-md">
              <Tabs defaultValue="equipment">
                <TabsList variant="line">
                  <TabsTrigger value="equipment">Equipment</TabsTrigger>
                  <TabsTrigger value="parts">Parts</TabsTrigger>
                  <TabsTrigger value="supplies">Supplies</TabsTrigger>
                </TabsList>
                <TabsContent value="equipment" className="pt-3 text-sm text-muted-foreground">
                  Frequently bought equipment.
                </TabsContent>
                <TabsContent value="parts" className="pt-3 text-sm text-muted-foreground">
                  Replacement parts and components.
                </TabsContent>
                <TabsContent value="supplies" className="pt-3 text-sm text-muted-foreground">
                  Consumable supplies.
                </TabsContent>
              </Tabs>
            </div>
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">Segmented — solid pill (Pack Size selector)</p>
          <PreviewCode
            code={`<Tabs defaultValue="each">
  <TabsList variant="segmented">
    <TabsTrigger value="each">Each</TabsTrigger>
    <TabsTrigger value="12">12-Pk</TabsTrigger>
    <TabsTrigger value="24">24-Pk</TabsTrigger>
    <TabsTrigger value="36">36-Pk</TabsTrigger>
  </TabsList>
  <TabsContent value="each" className="pt-3 text-sm text-muted-foreground">
    Priced per each.
  </TabsContent>
</Tabs>`}
          >
            <div className="w-full max-w-md">
              <Tabs defaultValue="each">
                <TabsList variant="segmented">
                  <TabsTrigger value="each">Each</TabsTrigger>
                  <TabsTrigger value="12">12-Pk</TabsTrigger>
                  <TabsTrigger value="24">24-Pk</TabsTrigger>
                  <TabsTrigger value="36">36-Pk</TabsTrigger>
                </TabsList>
                <TabsContent value="each" className="pt-3 text-sm text-muted-foreground">
                  Priced per each.
                </TabsContent>
                <TabsContent value="12" className="pt-3 text-sm text-muted-foreground">
                  12-pack pricing.
                </TabsContent>
                <TabsContent value="24" className="pt-3 text-sm text-muted-foreground">
                  24-pack pricing.
                </TabsContent>
                <TabsContent value="36" className="pt-3 text-sm text-muted-foreground">
                  36-pack pricing.
                </TabsContent>
              </Tabs>
            </div>
          </PreviewCode>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Make the current page a <code className="rounded bg-muted px-1 py-0.5 text-xs">BreadcrumbPage</code>, never a link back to itself.</>,
              <>Collapse long trails with a <code className="rounded bg-muted px-1 py-0.5 text-xs">BreadcrumbEllipsis</code> between the root and the tail.</>,
              <>Set <code className="rounded bg-muted px-1 py-0.5 text-xs">isActive</code> on exactly one <code className="rounded bg-muted px-1 py-0.5 text-xs">PaginationLink</code>.</>,
              <>Use the <code className="rounded bg-muted px-1 py-0.5 text-xs">line</code> variant for category section nav; <code className="rounded bg-muted px-1 py-0.5 text-xs">segmented</code> for mutually-exclusive options like pack size.</>,
            ]}
            donts={[
              <>Drop the <code className="rounded bg-muted px-1 py-0.5 text-xs">BreadcrumbSeparator</code> between items — it is a real list item, not a pseudo-element.</>,
              <>Mark two pagination links active at once.</>,
              <>Reach for the <code className="rounded bg-muted px-1 py-0.5 text-xs">default</code> Tabs variant when the tabs are wayfinding — that reads as a content switcher.</>,
              <>Hand-roll pagination buttons; <code className="rounded bg-muted px-1 py-0.5 text-xs">PaginationLink</code> already maps to the Button variants.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="Breadcrumb — parts"
            rows={[
              { name: "Breadcrumb", type: "nav", description: "Labelled landmark (aria-label=\"breadcrumb\")." },
              { name: "BreadcrumbList / BreadcrumbItem", type: "ol / li", description: "Ordered list of steps." },
              { name: "BreadcrumbLink", type: "a", description: "Navigable step. Supports asChild for Next Link." },
              { name: "BreadcrumbPage", type: "span", description: "Current page — aria-current=\"page\", not a link." },
              { name: "BreadcrumbSeparator", type: "li", description: "Chevron by default; pass children to override." },
              { name: "BreadcrumbEllipsis", type: "span", description: "Collapsed-steps indicator." },
            ]}
          />
          <PropsTable
            caption="Pagination — parts"
            rows={[
              { name: "Pagination", type: "nav", description: "Labelled landmark (aria-label=\"pagination\")." },
              { name: "PaginationLink isActive", type: "boolean", description: "Current page — outline variant + aria-current." },
              { name: "PaginationLink size", type: "Button size", description: "Defaults to icon; Prev/Next use default." },
              { name: "PaginationPrevious / PaginationNext", type: "a", description: "Directional controls; label hidden < sm." },
              { name: "PaginationEllipsis", type: "span", description: "Skipped-pages indicator." },
            ]}
          />
          <PropsTable
            caption="Tabs — variant"
            rows={[
              { name: "line", type: "underline", description: "Category section nav — brand-colored active tab + underline." },
              { name: "segmented", type: "solid pill", description: "Mutually-exclusive options (Pack Size). Primary-filled active." },
              { name: "default", type: "pill track", description: "Content-panel switcher — documented under Data display." },
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
              { label: "PLP — Search results", href: "/search?q=blower%20motor&signedin=1" },
              { label: "PDP — Replacement Products", href: "/pdp/uc-replacement-products?signedin=1" },
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
