"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart, Loader2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "variants", label: "Variants" },
  { id: "sizes", label: "Sizes" },
  { id: "states", label: "States" },
  { id: "composition", label: "Composition" },
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

export default function ButtonReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Button</h1>
          <p className="max-w-2xl text-muted-foreground">
            Triggers an action or navigates. Every button in the storefront must be this
            component — never a hand-rolled <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;a&gt;</code> or{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;button&gt;</code> with copied
            classes. That is the only way hover, focus, and disabled stay identical everywhere.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Button }"} from &quot;@/components/ui/button&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              npx shadcn add button
            </code>
          </div>
        </header>

        {/* ── Usage ── */}
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <PreviewCode
            install="button"
            code={`<Button>Add to Cart</Button>`}
          >
            <Button>Add to Cart</Button>
          </PreviewCode>
        </section>

        {/* ── Variants ── */}
        <section className="space-y-4">
          <H2 id="variants">Variants</H2>
          <p className="text-sm text-muted-foreground">
            Six variants. Hover any button below to see its real interaction state — this
            preview renders the live component, not a screenshot.
          </p>
          <PreviewCode
            code={`<Button>Primary</Button>
<Button variant="secondary">See More Branches</Button>
<Button variant="outline">View Product</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Inline link</Button>
<Button variant="destructive">Delete</Button>`}
          >
            <Button>Primary</Button>
            <Button variant="secondary">See More Branches</Button>
            <Button variant="outline">View Product</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Inline link</Button>
            <Button variant="destructive">Delete</Button>
          </PreviewCode>
        </section>

        {/* ── Sizes ── */}
        <section className="space-y-4">
          <H2 id="sizes">Sizes</H2>
          <p className="text-sm text-muted-foreground">
            Four text sizes plus square icon sizes. <code className="rounded bg-muted px-1 py-0.5 text-xs">sm</code>{" "}
            is the PLP / dense-row size; <code className="rounded bg-muted px-1 py-0.5 text-xs">default</code> is the
            standard action.
          </p>
          <PreviewCode
            previewClassName="items-end"
            code={`<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

<Button size="icon-sm" aria-label="Add"><Plus /></Button>
<Button size="icon" aria-label="Add"><Plus /></Button>
<Button size="icon-lg" aria-label="Add"><Plus /></Button>`}
          >
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <span aria-hidden className="mx-1 h-8 w-px self-center bg-border" />
            <Button size="icon-sm" aria-label="Add">
              <Plus />
            </Button>
            <Button size="icon" aria-label="Add">
              <Plus />
            </Button>
            <Button size="icon-lg" aria-label="Add">
              <Plus />
            </Button>
          </PreviewCode>
        </section>

        {/* ── States ── */}
        <section className="space-y-4">
          <H2 id="states">States</H2>
          <p className="text-sm text-muted-foreground">
            Hover and focus are produced by the component itself — hover or tab to a button in any
            preview to see them. Disabled and loading are shown below.
          </p>
          <PreviewCode
            code={`<Button disabled>Disabled</Button>

<Button disabled>
  <Loader2 className="animate-spin" />
  Saving
</Button>`}
          >
            <Button disabled>Disabled</Button>
            <Button disabled>
              <Loader2 className="animate-spin" />
              Saving
            </Button>
          </PreviewCode>
          <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Interaction classes</span> (built into every
            variant, do not re-declare):{" "}
            <code className="rounded bg-background px-1 py-0.5 text-xs">hover:bg-primary/90</code> ·{" "}
            <code className="rounded bg-background px-1 py-0.5 text-xs">
              focus-visible:ring-[3px] focus-visible:ring-ring/50
            </code>{" "}
            · <code className="rounded bg-background px-1 py-0.5 text-xs">disabled:opacity-100 disabled:bg-muted</code>
          </div>
        </section>

        {/* ── Composition ── */}
        <section className="space-y-4">
          <H2 id="composition">Composition</H2>
          <p className="text-sm text-muted-foreground">
            Icon + label, secondary + icon, icon-only (always needs an{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code>), links via{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">asChild</code>, and the PLP
            small-quantity + Add pattern.
          </p>
          <PreviewCode
            code={`{/* Icon + label */}
<Button>
  <ShoppingCart />
  Add to Cart
</Button>

{/* Secondary + icon */}
<Button variant="secondary">
  See More Branches
  <ArrowRight />
</Button>

{/* A link that looks like a button — use asChild, never copy the classes */}
<Button asChild variant="outline">
  <a href="/pdp/uc-replacement-products">View Product</a>
</Button>`}
          >
            <Button>
              <ShoppingCart />
              Add to Cart
            </Button>
            <Button variant="secondary">
              See More Branches
              <ArrowRight />
            </Button>
            <Button asChild variant="outline">
              <Link href="/pdp/uc-replacement-products">View Product</Link>
            </Button>
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">PLP quantity + Add (small + icon)</p>
          <PreviewCode
            code={`<div className="inline-flex items-center gap-2">
  <div className="inline-flex items-center rounded-md border">
    <Button size="icon-sm" variant="ghost" aria-label="Decrease quantity"><Minus /></Button>
    <span className="w-8 text-center text-sm tabular-nums">1</span>
    <Button size="icon-sm" variant="ghost" aria-label="Increase quantity"><Plus /></Button>
  </div>
  <Button size="sm">
    <ShoppingCart />
    Add
  </Button>
</div>`}
          >
            <div className="inline-flex items-center gap-2">
              <div className="inline-flex items-center rounded-md border">
                <Button size="icon-sm" variant="ghost" aria-label="Decrease quantity">
                  <Minus />
                </Button>
                <span className="w-8 text-center text-sm tabular-nums">1</span>
                <Button size="icon-sm" variant="ghost" aria-label="Increase quantity">
                  <Plus />
                </Button>
              </div>
              <Button size="sm">
                <ShoppingCart />
                Add
              </Button>
            </div>
          </PreviewCode>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;outline&quot;</code> for secondary actions like &quot;View Product&quot;.</>,
              <>Wrap links in <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Button asChild&gt;</code> so they get the same hover/focus.</>,
              <>Give every icon-only button an <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code>.</>,
              <>Keep one primary button per view; everything else is secondary/ghost.</>,
            ]}
            donts={[
              <>Hand-roll <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;a className=&quot;border px-3 py-1.5…&quot;&gt;</code> — it drifts from the library.</>,
              <>Re-declare hover/focus classes; they&apos;re already in the variant.</>,
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">size=&quot;icon&quot;</code> without an accessible label.</>,
              <>Put two primary buttons side by side.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="variant"
            rows={[
              { name: "default", type: "primary", description: "The main call to action (Add to Cart, Continue)." },
              { name: "secondary", type: "outline-fill", description: "Secondary action — bordered, fills on hover (See More Branches)." },
              { name: "outline", type: "bordered", description: "Low-emphasis action on cards (View Product)." },
              { name: "ghost", type: "text", description: "Minimal — steppers, toolbar toggles, icon buttons." },
              { name: "link", type: "text", description: "Inline navigation that reads as a link." },
              { name: "destructive", type: "danger", description: "Irreversible/removal actions (Delete)." },
            ]}
          />
          <PropsTable
            caption="size"
            rows={[
              { name: "xs", type: "h-6", description: "Tight chips and inline controls." },
              { name: "sm", type: "h-8", description: "PLP rows, dense tables, filter actions." },
              { name: "default", type: "h-9", description: "Standard action button." },
              { name: "lg", type: "h-10", description: "Prominent CTAs (buy box)." },
              { name: "icon-sm / icon / icon-lg", type: "square", description: "Icon-only — 32 / 36 / 40px. Requires aria-label." },
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where this component ships. Compare against the library above.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "PDP — Replacement Products", href: "/pdp/uc-replacement-products?signedin=1" },
              { label: "PLP — Search results", href: "/search?q=blower%20motor&signedin=1" },
              { label: "Store Locator", href: "/store-locator" },
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
