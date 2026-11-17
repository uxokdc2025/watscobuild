"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout, CalloutDescription, CalloutTitle } from "@/components/ui/callout";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/ui/page-container";
import { ProductGrid } from "@/components/ui/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ProductCard,
  type ProductCardData,
} from "@/app/pdp/_lib/product-card";
import { MOCK_RESULTS } from "@/app/search/_lib/mock-data";
import {
  CMS_LAYOUT_RULES,
  LAYOUT_BREAKPOINTS,
  LAYOUT_MAX_WIDTH,
  layoutBreakpointAt,
  LAYOUT_CARD_MIN,
  LAYOUT_SIDEBAR,
  LAYOUT_SIDEBAR_FROM,
  plpColumnsAt,
} from "@/lib/layout";

import { Guidance, PreviewCode, PropsTable } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

/* ════════════════════════════════════════════════════════════════════════
   Foundations · Grid & Breakpoints.

   Written after the Nov 10 review, where the search results page was
   stretching edge-to-edge on a large monitor. Everything on this page reads
   from the same tokens the storefront renders with — `lib/layout.ts` mirrors
   the `--layout-*` / `--breakpoint-*` block in `app/globals.css` — so the
   documentation can't drift from the pages.
   ════════════════════════════════════════════════════════════════════════ */

const TOC = [
  { id: "rule", label: "The Rule" },
  { id: "breakpoints", label: "Breakpoints" },
  { id: "container", label: "Page Container" },
  { id: "overlay", label: "Column Overlay" },
  { id: "product-grid", label: "Product Grid" },
  { id: "cms", label: "CMS Layout Rules" },
  { id: "guidance", label: "Do / Don't" },
];

/** The widths the PR screenshots are taken at, plus the two extremes. */
const PRESETS = [375, 768, 1024, 1280, 1440, 1600, 1728, 1920, 2560];

/* Real search rows + the real captured Homans product photos, so the
   resizable demo renders the same cards /search renders. */
const DEMO_CARDS: ProductCardData[] = MOCK_RESULTS.slice(0, 6).map((r, i) => ({
  id: r.id,
  brand: r.brand,
  title: r.title,
  item: r.item,
  mfg: r.mfg,
  image: `/homans-search/blower-motor-${(i + 1).toString().padStart(2, "0")}.webp`,
  price: r.price ?? null,
  points: r.points,
  yourBranchQty: r.stockStatus === "out-of-stock" ? 0 : 2,
  branchName: "Manchester",
  nearbyBranchQty: r.allBranchesQty ?? 0,
  href: `/pdp/tradepro-${r.item.toLowerCase()}`,
}));

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

/** Live viewport width. `null` until mounted, so SSR and the first client
 *  render agree. */
function useViewportWidth(): number | null {
  const [width, setWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    const read = () => setWidth(window.innerWidth);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return width;
}

/* ─────────────────────────── Breakpoint table ─────────────────────────── */

/** What a search / PLP page (results column beside the filter sidebar)
 *  actually renders across one band, e.g. "3 → 4 from 1200px". */
function plpColumnsLabel(bp: (typeof LAYOUT_BREAKPOINTS)[number]): string {
  const top = Math.min(bp.max ?? 2560, 2560);
  const atMin = plpColumnsAt(bp.min);
  const steps: string[] = [String(atMin)];
  let last = atMin;
  for (let w = bp.min + 1; w <= top; w++) {
    const n = plpColumnsAt(w);
    if (n !== last) {
      steps.push(`${n} from ${w}px`);
      last = n;
    }
  }
  return steps.join(" → ");
}

function BreakpointTable({ activeKey }: { activeKey: string | null }) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase hover:bg-muted/40">
            <TableHead className="px-4">Breakpoint</TableHead>
            <TableHead className="px-4">Range</TableHead>
            <TableHead className="px-4">Variant</TableHead>
            <TableHead className="px-4 text-right">Max columns</TableHead>
            <TableHead className="px-4">PLP with filters</TableHead>
            <TableHead className="px-4 text-right">Gutter</TableHead>
            <TableHead className="px-4 text-right">Margin</TableHead>
            <TableHead className="px-4">Container</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {LAYOUT_BREAKPOINTS.map((bp) => (
            <TableRow
              key={bp.key}
              data-state={bp.key === activeKey ? "selected" : undefined}
            >
              <TableCell className="px-4 py-2.5 font-medium">
                {bp.label}
                {bp.key === activeKey ? (
                  <Badge variant="soft" color="blue" className="ml-2 align-middle">
                    You are here
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell className="px-4 py-2.5 tabular-nums text-muted-foreground">
                {bp.max == null ? `${bp.min}px +` : `${bp.min}–${bp.max}px`}
              </TableCell>
              <TableCell className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                {bp.variant ?? "—"}
              </TableCell>
              <TableCell className="px-4 py-2.5 text-right font-medium tabular-nums">
                {bp.columns}
              </TableCell>
              <TableCell className="px-4 py-2.5 whitespace-normal tabular-nums text-muted-foreground">
                {plpColumnsLabel(bp)}
              </TableCell>
              <TableCell className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                {bp.gutter}px
              </TableCell>
              <TableCell className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                {bp.margin}px
              </TableCell>
              <TableCell className="px-4 py-2.5 whitespace-normal text-muted-foreground">
                {bp.container}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ─────────────────────────── Column overlay ───────────────────────────
 * Toggles a tinted column + gutter + margin overlay on a real
 * PageContainer / ProductGrid at this browser's width. Resize the window
 * and both the grid and the overlay step together — they're the same
 * tokens.
 * -------------------------------------------------------------------- */

function ColumnOverlayDemo({ viewport }: { viewport: number | null }) {
  const [showOverlay, setShowOverlay] = React.useState(false);
  const bp = layoutBreakpointAt(viewport ?? 0);
  const columns = viewport == null ? 2 : bp.columns;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/30 px-4 py-3">
        <Label htmlFor="grid-overlay" className="gap-3">
          <Switch
            id="grid-overlay"
            checked={showOverlay}
            onCheckedChange={setShowOverlay}
          />
          Show column overlay
        </Label>
        <p className="text-sm text-muted-foreground tabular-nums">
          {viewport == null ? (
            "Measuring…"
          ) : (
            <>
              {viewport}px · <span className="font-medium text-foreground">{bp.label}</span> ·{" "}
              {bp.columns} columns · {bp.gutter}px gutter · {bp.margin}px margin
            </>
          )}
        </p>
      </div>

      {/* The overlay draws the page's layout columns, so card-min is off here
          (it only limits how narrow a product card may get, see Product grid). */}
      <div
        className="relative overflow-hidden rounded-xl border bg-card py-8"
        style={{ "--layout-card-min": "0px" } as React.CSSProperties}
      >
        <PageContainer>
          <ProductGrid>
            {Array.from({ length: columns }, (_, i) => (
              <li key={i}>
                <Skeleton className="h-36 w-full animate-none" />
              </li>
            ))}
          </ProductGrid>
        </PageContainer>

        {showOverlay ? (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {/* Margins — a strip of exactly --layout-margin at each edge. */}
            <div className="absolute inset-y-0 left-0 w-[var(--layout-margin)] bg-destructive/10" />
            <div className="absolute inset-y-0 right-0 w-[var(--layout-margin)] bg-destructive/10" />
            {/* Columns — one tinted cell each; the gutters read as the
                untinted gaps between them. */}
            <PageContainer className="h-full">
              <ProductGrid className="h-full">
                {Array.from({ length: columns }, (_, i) => (
                  <li
                    key={i}
                    className="h-full bg-primary/10 outline outline-primary/30"
                  />
                ))}
              </ProductGrid>
            </PageContainer>
          </div>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        Blue cells are columns, the gaps between them are the{" "}
        <span className="font-medium text-foreground">gutter</span>, and the red band at
        each edge is the page <span className="font-medium text-foreground">margin</span>.
        Resize this browser window — the grid and the overlay step together because they
        read the same tokens.
      </p>
    </div>
  );
}

/* ─────────────────────────── Resizable product grid ───────────────────
 * Simulates a viewport width by overriding the three layout tokens on a
 * wrapper. Inside it, the real PageContainer and the real ProductGrid
 * behave exactly as they would at that width — including the 1920px cap,
 * which is what the muted band at 2560px is showing.
 * -------------------------------------------------------------------- */

function ResizableGridDemo() {
  const [width, setWidth] = React.useState(1440);
  const bp = layoutBreakpointAt(width);
  // Lay out exactly as the search page does: filter sidebar beside the
  // results from lg up, and the grid's card-min rule decides the count.
  const withSidebar = width >= LAYOUT_SIDEBAR_FROM;
  const shownColumns = plpColumnsAt(width);
  const cards = DEMO_CARDS.slice(0, shownColumns);
  const capped = width > LAYOUT_MAX_WIDTH;

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-xl border bg-muted/30 px-4 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex min-w-60 flex-1 items-center gap-3">
            <Label className="shrink-0 text-muted-foreground">Width</Label>
            <Slider
              aria-label="Simulated viewport width"
              min={320}
              max={2560}
              step={16}
              value={[width]}
              onValueChange={(v) => setWidth(v[0] ?? width)}
            />
          </div>
          <p className="text-sm tabular-nums">
            <span className="font-semibold">{width}px</span>{" "}
            <span className="text-muted-foreground">
              · {bp.label} · {shownColumns} of max {bp.columns} columns beside the filters ·{" "}
              {bp.gutter}px gutter · {bp.margin}px margin
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p}
              type="button"
              variant={p === width ? "default" : "outline"}
              size="sm"
              onClick={() => setWidth(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card p-4">
        {/* The simulated viewport. Overriding the tokens here — and nothing
            else — is enough to make the shared components lay out as they
            would at that width. */}
        <div
          className="mx-auto bg-muted/30 py-6"
          style={
            {
              width,
              "--layout-margin": `${bp.margin}px`,
              "--layout-gutter": `${bp.gutter}px`,
              "--layout-columns": bp.columns,
              "--layout-card-min": `${bp.cardMin}px`,
            } as React.CSSProperties
          }
        >
          <PageContainer className="bg-background">
            <div
              className={
                withSidebar ? "grid gap-6 grid-cols-[var(--layout-sidebar)_minmax(0,1fr)]" : undefined
              }
            >
              {withSidebar ? (
                <div className="space-y-3" aria-label="Filter sidebar (placeholder)">
                  <Skeleton className="h-6 w-2/3 animate-none" />
                  <Skeleton className="h-40 w-full animate-none" />
                  <Skeleton className="h-40 w-full animate-none" />
                </div>
              ) : null}
              <div className="min-w-0">
                <ProductGrid>
                  {cards.map((card) => (
                    <li key={card.id}>
                      <ProductCard data={card} signedIn />
                    </li>
                  ))}
                </ProductGrid>
              </div>
            </div>
          </PageContainer>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {capped ? (
          <>
            Above {LAYOUT_MAX_WIDTH}px the content stops growing and centers — the muted
            band on each side is the width the page deliberately leaves empty. Scroll the
            frame sideways to see both edges.
          </>
        ) : (
          <>
            Below {LAYOUT_MAX_WIDTH}px the container is fluid: the columns grow with the
            viewport and the count steps at the breakpoints above, up to the 5-column cap.
            From {LAYOUT_SIDEBAR_FROM}px the{" "}
            {LAYOUT_SIDEBAR}px filter sidebar sits beside the results, and no card gets narrower
            than {LAYOUT_CARD_MIN}px — when the max column count won&apos;t fit at that width
            the grid shows one fewer instead of overflowing (e.g. 4 at 1280px, 5 from 1440px).
            Drag to 2560px to see the cap — the count stays 5, the cards just get wider.
          </>
        )}
      </p>
    </div>
  );
}

/* ─────────────────────────── CMS layout rules ─────────────────────────── */

function CmsRulesTable() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase hover:bg-muted/40">
            <TableHead className="px-4">Shopware block</TableHead>
            <TableHead className="px-4">Category</TableHead>
            <TableHead className="px-4 text-right">Max per row</TableHead>
            <TableHead className="px-4">How it steps down</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {CMS_LAYOUT_RULES.map((rule) => (
            <TableRow key={rule.blocks}>
              <TableCell className="px-4 py-2.5 whitespace-normal font-medium">
                {rule.blocks}
              </TableCell>
              <TableCell className="px-4 py-2.5 whitespace-normal text-muted-foreground">
                {rule.category}
              </TableCell>
              <TableCell className="px-4 py-2.5 text-right font-medium tabular-nums">
                {rule.maxPerRow}
              </TableCell>
              <TableCell className="px-4 py-2.5 whitespace-normal text-muted-foreground">
                {rule.steps}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function GridReference() {
  const viewport = useViewportWidth();
  const activeKey = viewport == null ? null : layoutBreakpointAt(viewport).key;

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Foundations
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Grid &amp; breakpoints</h1>
          <p className="max-w-2xl text-muted-foreground">
            Eight layout bands, one {LAYOUT_MAX_WIDTH}px content canvas, one page
            container and one product grid. Every page — search results, PLP, PDP, account
            — reads the same layout tokens, so no page can stretch past the canvas.
          </p>
        </header>

        <section className="space-y-3">
          <H2 id="rule">The rule</H2>
          <Callout>
            <CalloutTitle>Five columns maximum — never six.</CalloutTitle>
            <CalloutDescription>
              The product grid reaches{" "}
              <span className="font-medium text-foreground">5 columns at 1440px</span> — with
              the {LAYOUT_SIDEBAR}px filter sidebar beside it — and holds at 5 all the way to
              2560px. Past 1440 the extra width goes into wider cards, not another column, so
              24 products plus the &ldquo;Want more options?&rdquo; end card read as a 5 × 5
              grid. Below 1440 it steps down 4 / 3 / 2 as the cards run out of room.
            </CalloutDescription>
          </Callout>
          <Callout>
            <CalloutTitle>Fluid to {LAYOUT_MAX_WIDTH}px, then centered.</CalloutTitle>
            <CalloutDescription>
              Content grows with the viewport up to{" "}
              <span className="font-medium text-foreground">{LAYOUT_MAX_WIDTH}px</span>, then
              it stops and the page centers inside the extra space. Width lives in tokens —{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">--layout-max-width</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">--layout-margin</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">--layout-gutter</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">--layout-columns</code>{" "}
              — so a page never sets its own max-width, and a one-line token change moves
              every page at once.
            </CalloutDescription>
          </Callout>
        </section>

        <section className="space-y-4">
          <H2 id="breakpoints">Breakpoints</H2>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 py-0.5 text-xs">sm</code>–
            <code className="rounded bg-muted px-1 py-0.5 text-xs">xl</code> are Tailwind&apos;s
            own.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">wide</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">xwide</code> and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">canvas</code> are ours,
            because the product grid hits its 5-column cap at 1440, the page margin steps at
            1728 and the canvas caps at 1920 — widths Tailwind&apos;s scale doesn&apos;t cover. Tailwind&apos;s{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">2xl</code> (1536px) still
            exists but must never drive width: it sits inside the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">wide</code> band.
          </p>
          <BreakpointTable activeKey={activeKey} />
          <PropsTable
            caption="Layout tokens"
            rows={[
              {
                name: "--layout-max-width",
                type: "1920px",
                description:
                  "The content canvas. PageContainer caps at it and centers above it.",
              },
              {
                name: "--layout-margin",
                type: "16 → 48px",
                description:
                  "Page side margin (the container's inline padding). Steps 16 / 24 / 32 / 40 / 48px.",
              },
              {
                name: "--layout-gutter",
                type: "16 → 24px",
                description: "Gap between grid cells. 16px below md, 24px from md up.",
              },
              {
                name: "--layout-columns",
                type: "2 → 5",
                description:
                  "MAXIMUM search / PLP product columns per band. 2 / 3 / 4 / 5, then holds at 5 — six columns are never allowed, at any width. The grid shows fewer when that many cards can't each be --layout-card-min wide.",
              },
              {
                name: "--layout-card-min",
                type: "0 → 196px",
                description:
                  "Narrowest legible product card. 0 below lg (phones/tablets get exactly the column count); 196px from lg up — qty stepper (86) + gap (8) + Add (72) + the card's 15px padding either side, i.e. the width where the stepper and Add stay on one line. ProductGrid auto-fills tracks of max(card-min, 1/N of the row), so it drops a column rather than overflow.",
              },
              {
                name: "--layout-sidebar",
                type: "256px",
                description:
                  "PLP filter sidebar width beside the results (lg and up). The results column is minmax(0, 1fr), so wide content inside it can never push the grid past the viewport.",
              },
            ]}
          />
        </section>

        <section className="space-y-4">
          <H2 id="container">Page container</H2>
          <p className="text-sm text-muted-foreground">
            One component for every page shell, band inner and section. It owns the width
            so nothing else has to.
          </p>
          <PreviewCode
            previewClassName="block p-0"
            code={`import { PageContainer } from "@/components/ui/page-container"

// Page shell
<PageContainer className="pt-4 pb-16">{children}</PageContainer>

// Full-bleed band: background outside, container inside
<div className="border-b bg-muted/40">
  <PageContainer className="py-4">{children}</PageContainer>
</div>

// Keep your own tag with asChild
<PageContainer asChild>
  <nav aria-label="Breadcrumb" className="flex items-center gap-2">{children}</nav>
</PageContainer>`}
          >
            <div className="w-full bg-muted/30 py-6">
              <PageContainer className="rounded-md border bg-background py-6 text-center text-sm text-muted-foreground">
                PageContainer — fluid to {LAYOUT_MAX_WIDTH}px, then centered. The muted band
                is the space it refuses to fill.
              </PageContainer>
            </div>
          </PreviewCode>
          <PropsTable
            caption="PageContainer props"
            rows={[
              {
                name: "asChild",
                type: "boolean",
                description:
                  "Render the container's classes on your own element (nav, section, main) instead of a div.",
              },
              {
                name: "className",
                type: "string",
                description:
                  "Vertical rhythm and background only. Never a max-width or an inline padding — those are tokens.",
              },
            ]}
          />
        </section>

        <section className="space-y-4">
          <H2 id="overlay">Column overlay</H2>
          <p className="text-sm text-muted-foreground">
            Turn the overlay on to see the columns, gutters and margins the current
            breakpoint is using.
          </p>
          <ColumnOverlayDemo viewport={viewport} />
        </section>

        <section className="space-y-4">
          <H2 id="product-grid">Product grid</H2>
          <p className="text-sm text-muted-foreground">
            The grid behind{" "}
            <Link href={"/search?q=blower+motor&signedin=1"} className="text-primary hover:underline">
              search results
            </Link>{" "}
            and every PLP. Drag the slider to change the simulated viewport — these are the
            real cards, the real container and the real grid, with only the layout tokens
            overridden. It tops out at five columns: from 1440px up, every width from 1440 to
            2560 shows the same five, so a full page of 24 products plus the end card is a
            5 × 5.
          </p>
          <ResizableGridDemo />
          <PreviewCode
            previewClassName="block p-0"
            code={`import { PageContainer } from "@/components/ui/page-container"
import { ProductGrid } from "@/components/ui/product-grid"

<PageContainer className="pt-4 pb-16">
  <ProductGrid>
    {results.map((r) => (
      <li key={r.id}>
        <ProductCard data={r} signedIn={signedIn} />
      </li>
    ))}
  </ProductGrid>
</PageContainer>

// columns={3} overrides the token for one instance — CMS blocks that are
// capped lower than the PLP. Never to give a page its own count.`}
          >
            <div className="w-full">
              <ProductGrid columns={3}>
                {Array.from({ length: 3 }, (_, i) => (
                  <li key={i}>
                    <Skeleton className="h-24 w-full animate-none" />
                  </li>
                ))}
              </ProductGrid>
            </div>
          </PreviewCode>
        </section>

        <section className="space-y-4">
          <H2 id="cms">CMS layout rules</H2>
          <p className="text-sm text-muted-foreground">
            What an editor is allowed to put across one row, per Shopware block. A block
            that exceeds its cap makes items narrower than the smallest legible card — the
            fastest way back to a stretched-looking page. Rows use Shopware&apos;s own block names,
            so each one is findable in the Shopping Experiences editor and on the{" "}
            <Link
              href="/components/cms-blocks/examples"
              className="text-primary hover:underline"
            >
              CMS block examples
            </Link>{" "}
            page.
          </p>
          <CmsRulesTable />
          <Callout>
            <CalloutTitle>Two caps, not one.</CalloutTitle>
            <CalloutDescription>
              A CMS row is capped by its block (above) <em>and</em> by the page container.
              Even a full-bleed background keeps its content inside the{" "}
              {LAYOUT_MAX_WIDTH}px canvas — background bleeds, content doesn&apos;t.
            </CalloutDescription>
          </Callout>
          <Button asChild variant="outline" size="sm">
            <Link href="/components/cms-blocks/examples">
              Open the CMS block examples
              <ArrowRight />
            </Link>
          </Button>
        </section>

        <section className="space-y-4">
          <H2 id="guidance">Do / Don&apos;t</H2>
          <Guidance
            dos={[
              <>
                Wrap every page in{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">PageContainer</code> and
                every product listing in{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">ProductGrid</code>.
              </>,
              <>
                Change layout behavior by editing the{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">--layout-*</code> tokens
                in <code className="rounded bg-muted px-1 py-0.5 text-xs">globals.css</code> and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">lib/layout.ts</code>{" "}
                together.
              </>,
              <>
                Put full-bleed backgrounds on the element outside the container, content
                inside it.
              </>,
              <>
                Check a new page at 1024, 1280, 1440, 1920 and 2560px — and confirm nothing
                scrolls sideways at any width in between.
              </>,
              <>
                Let a wide screen make the cards bigger, not the row longer. Five columns is
                the cap at every width from 1440 to 2560.
              </>,
            ]}
            donts={[
              <>
                Set a page-level{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">max-w-*</code> or{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">px-*</code> on a page
                shell — that&apos;s how one page ends up 1152px and the next 1920px.
              </>,
              <>
                Add a one-off grid like{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  sm:grid-cols-2 lg:grid-cols-4
                </code>{" "}
                for products. Use{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">ProductGrid</code>.
              </>,
              <>
                Use <code className="rounded bg-muted px-1 py-0.5 text-xs">2xl:</code> for
                width — it sits inside the{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">wide</code> band and
                reads as a 1440px rule that isn&apos;t one.
              </>,
              <>
                Run a sixth product column at any width — not with{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">--layout-columns</code>,
                not with a{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">columns</code> override,
                and not with a CMS product slider. Five is the cap.
              </>,
              <>Let a CMS row run more items across than its block&apos;s cap.</>,
            ]}
          />
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}
