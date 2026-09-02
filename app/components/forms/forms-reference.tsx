"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "text-input", label: "Text input" },
  { id: "states", label: "Input states" },
  { id: "textarea", label: "Textarea" },
  { id: "checkbox", label: "Checkbox" },
  { id: "radio", label: "Radio group" },
  { id: "select", label: "Select" },
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

export default function FormsReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="max-w-2xl text-muted-foreground">
            Text entry and selection controls. Every field in the storefront must be one of these
            components — never a raw{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;input&gt;</code> or{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;select&gt;</code> with copied
            classes. That is the only way border, focus ring, disabled, and the error state stay
            identical everywhere. Always pair a control with a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Label&gt;</code>.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Input }"} from &quot;@/components/ui/input&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Label }"} from &quot;@/components/ui/label&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Textarea }"} from &quot;@/components/ui/textarea&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Checkbox }"} from &quot;@/components/ui/checkbox&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ RadioGroup, RadioGroupItem }"} from &quot;@/components/ui/radio-group&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Select, ... }"} from &quot;@/components/ui/select&quot;
            </code>
          </div>
        </header>

        {/* ── Usage ── */}
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <p className="text-sm text-muted-foreground">
            The unit of a form is a labelled field: a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Label htmlFor&gt;</code> tied
            to a control by <code className="rounded bg-muted px-1 py-0.5 text-xs">id</code>. Clicking
            the label focuses the control and screen readers announce it.
          </p>
          <PreviewCode
            install="input"
            code={`<div className="grid gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@company.com" />
</div>`}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" className="w-64" />
            </div>
          </PreviewCode>
        </section>

        {/* ── Text input ── */}
        <section className="space-y-4">
          <H2 id="text-input">Text input</H2>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Input&gt;</code> accepts any
            native <code className="rounded bg-muted px-1 py-0.5 text-xs">type</code> —{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">text</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">email</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">number</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">search</code>. Focus and hover are
            produced by the component; tab into a field to see the ring.
          </p>
          <PreviewCode
            install="input"
            code={`<Input placeholder="Search part number" />
<Input type="email" placeholder="you@company.com" />
<Input type="number" defaultValue={1} min={1} />`}
          >
            <Input placeholder="Search part number" className="w-56" />
            <Input type="email" placeholder="you@company.com" className="w-56" />
            <Input type="number" defaultValue={1} min={1} className="w-24" />
          </PreviewCode>
        </section>

        {/* ── Input states ── */}
        <section className="space-y-4">
          <H2 id="states">Input states</H2>
          <p className="text-sm text-muted-foreground">
            Default, disabled, and error. The error state is driven by{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid</code> — it colours
            the border and ring destructive AND announces the field as invalid. Never fake an error
            with a red border class.
          </p>
          <PreviewCode
            previewClassName="items-start"
            code={`<Input placeholder="Default" />
<Input placeholder="Disabled" disabled />
<Input defaultValue="not-an-email" aria-invalid />`}
          >
            <Input placeholder="Default" className="w-48" />
            <Input placeholder="Disabled" disabled className="w-48" />
            <Input defaultValue="not-an-email" aria-invalid className="w-48" />
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">Full error field (with message)</p>
          <p className="text-sm text-muted-foreground">
            Wire the message to the input with{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code> so it is
            read out with the field.
          </p>
          <PreviewCode
            code={`<div className="grid gap-2">
  <Label htmlFor="po">PO number</Label>
  <Input
    id="po"
    defaultValue="00"
    aria-invalid
    aria-describedby="po-error"
  />
  <p id="po-error" className="text-sm text-destructive">
    PO number must be at least 4 digits.
  </p>
</div>`}
          >
            <div className="grid w-64 gap-2">
              <Label htmlFor="po">PO number</Label>
              <Input id="po" defaultValue="00" aria-invalid aria-describedby="po-error" />
              <p id="po-error" className="text-sm text-destructive">
                PO number must be at least 4 digits.
              </p>
            </div>
          </PreviewCode>
        </section>

        {/* ── Textarea ── */}
        <section className="space-y-4">
          <H2 id="textarea">Textarea</H2>
          <p className="text-sm text-muted-foreground">
            Multi-line entry. Auto-grows with content (
            <code className="rounded bg-muted px-1 py-0.5 text-xs">field-sizing-content</code>) and
            shares the exact focus and error treatment of{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Input&gt;</code>.
          </p>
          <PreviewCode
            install="textarea"
            previewClassName="items-start"
            code={`<div className="grid gap-2">
  <Label htmlFor="notes">Delivery notes</Label>
  <Textarea id="notes" placeholder="Gate code, dock hours, on-site contact…" />
</div>`}
          >
            <div className="grid w-72 gap-2">
              <Label htmlFor="notes">Delivery notes</Label>
              <Textarea id="notes" placeholder="Gate code, dock hours, on-site contact…" />
            </div>
          </PreviewCode>
        </section>

        {/* ── Checkbox ── */}
        <section className="space-y-4">
          <H2 id="checkbox">Checkbox</H2>
          <p className="text-sm text-muted-foreground">
            Binary on/off. Pair with a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Label&gt;</code> in a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">flex</code> row so the whole label
            is clickable.
          </p>
          <PreviewCode
            install="checkbox"
            previewClassName="items-start gap-6"
            code={`<div className="flex items-center gap-2">
  <Checkbox id="ship-default" defaultChecked />
  <Label htmlFor="ship-default">Ship to my default branch</Label>
</div>

<div className="flex items-center gap-2">
  <Checkbox id="tos" />
  <Label htmlFor="tos">I accept the freight terms</Label>
</div>

<div className="flex items-center gap-2">
  <Checkbox id="locked" className="peer" disabled defaultChecked />
  <Label htmlFor="locked">Tax exempt (on file)</Label>
</div>`}
          >
            <div className="flex items-center gap-2">
              <Checkbox id="ship-default" defaultChecked />
              <Label htmlFor="ship-default">Ship to my default branch</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="tos" />
              <Label htmlFor="tos">I accept the freight terms</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="locked" className="peer" disabled defaultChecked />
              <Label htmlFor="locked">Tax exempt (on file)</Label>
            </div>
          </PreviewCode>
        </section>

        {/* ── Radio group ── */}
        <section className="space-y-4">
          <H2 id="radio">Radio group</H2>
          <p className="text-sm text-muted-foreground">
            One choice from a small set. Use a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;RadioGroup&gt;</code> — never
            loose radios — so arrow keys move between options and only one can be selected.
          </p>
          <PreviewCode
            install="radio-group"
            previewClassName="items-start"
            code={`<RadioGroup defaultValue="delivery">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="delivery" id="m-delivery" />
    <Label htmlFor="m-delivery">Delivery</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="pickup" id="m-pickup" />
    <Label htmlFor="m-pickup">Branch pickup</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="will-call" id="m-will-call" disabled />
    <Label htmlFor="m-will-call" className="opacity-50">Will-call (unavailable)</Label>
  </div>
</RadioGroup>`}
          >
            <RadioGroup defaultValue="delivery">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="delivery" id="m-delivery" />
                <Label htmlFor="m-delivery">Delivery</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pickup" id="m-pickup" />
                <Label htmlFor="m-pickup">Branch pickup</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="will-call" id="m-will-call" disabled />
                <Label htmlFor="m-will-call" className="opacity-50">
                  Will-call (unavailable)
                </Label>
              </div>
            </RadioGroup>
          </PreviewCode>
        </section>

        {/* ── Select ── */}
        <section className="space-y-4">
          <H2 id="select">Select</H2>
          <p className="text-sm text-muted-foreground">
            One choice from a longer list. Reach for{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Select&gt;</code> over a radio
            group past ~6 options. Give the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;SelectTrigger&gt;</code> an{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">id</code> so the label points at
            it, and always set a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">placeholder</code>.
          </p>
          <PreviewCode
            install="select"
            previewClassName="items-start"
            code={`<div className="grid gap-2">
  <Label htmlFor="branch">Pickup branch</Label>
  <Select>
    <SelectTrigger id="branch" className="w-56">
      <SelectValue placeholder="Select a branch" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="miami">Miami, FL</SelectItem>
      <SelectItem value="dallas">Dallas, TX</SelectItem>
      <SelectItem value="atlanta">Atlanta, GA</SelectItem>
    </SelectContent>
  </Select>
</div>`}
          >
            <div className="grid gap-2">
              <Label htmlFor="branch">Pickup branch</Label>
              <Select>
                <SelectTrigger id="branch" className="w-56">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="miami">Miami, FL</SelectItem>
                  <SelectItem value="dallas">Dallas, TX</SelectItem>
                  <SelectItem value="atlanta">Atlanta, GA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">Error state</p>
          <p className="text-sm text-muted-foreground">
            Put <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid</code> on the
            trigger, exactly like an input.
          </p>
          <PreviewCode
            previewClassName="items-start"
            code={`<Select>
  <SelectTrigger className="w-56" aria-invalid>
    <SelectValue placeholder="Required — select a branch" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="miami">Miami, FL</SelectItem>
  </SelectContent>
</Select>`}
          >
            <Select>
              <SelectTrigger className="w-56" aria-invalid>
                <SelectValue placeholder="Required — select a branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="miami">Miami, FL</SelectItem>
              </SelectContent>
            </Select>
          </PreviewCode>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Pair every control with a <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Label htmlFor&gt;</code> tied to the control&apos;s <code className="rounded bg-muted px-1 py-0.5 text-xs">id</code>.</>,
              <>Signal errors with <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid</code>, and link the message with <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-describedby</code>.</>,
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;RadioGroup&gt;</code> for ≤6 mutually exclusive options; <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Select&gt;</code> beyond that.</>,
              <>Set the input <code className="rounded bg-muted px-1 py-0.5 text-xs">type</code> (email, number, search) so mobile keyboards and validation match.</>,
            ]}
            donts={[
              <>Ship a raw <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;input&gt;</code> / <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;select&gt;</code> with copied classes — it drifts from the library.</>,
              <>Fake an error with a red <code className="rounded bg-muted px-1 py-0.5 text-xs">border-destructive</code> class instead of <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-invalid</code>.</>,
              <>Use placeholder text as the label — it vanishes on input and fails screen readers.</>,
              <>Re-declare focus/ring classes; they&apos;re already in every control.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <p className="text-sm text-muted-foreground">
            All controls forward native props. These are the shared ones that drive state — they
            behave identically on Input, Textarea, Checkbox, RadioGroupItem, and the Select trigger.
          </p>
          <PropsTable
            caption="shared state props"
            rows={[
              { name: "aria-invalid", type: "boolean", description: "Turns the border + ring destructive and announces the field as invalid. The error state." },
              { name: "aria-describedby", type: "string (id)", description: "Points at the error/help text so it's read out with the field." },
              { name: "disabled", type: "boolean", description: "Dims to 50%, blocks pointer + keyboard. Its <Label> dims too." },
              { name: "placeholder", type: "string", description: "Muted hint inside empty inputs / the Select trigger. Not a substitute for a Label." },
            ]}
          />
          <PropsTable
            caption="controls"
            rows={[
              { name: "Input", type: "input", description: "Single-line text. Any native type — text, email, number, search." },
              { name: "Textarea", type: "textarea", description: "Multi-line text; auto-grows with content." },
              { name: "Label", type: "label", description: "htmlFor ties it to a control id; dims with a disabled peer." },
              { name: "Checkbox", type: "button[role=checkbox]", description: "Binary on/off; supports defaultChecked / checked + onCheckedChange." },
              { name: "RadioGroup / RadioGroupItem", type: "radiogroup", description: "One choice from a set; arrow-key navigable. value + onValueChange." },
              { name: "Select + Trigger/Content/Item/Value", type: "listbox", description: "One choice from a longer list; put aria-invalid on the Trigger." },
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where these controls ship. Compare against the library above.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Checkout — Shipping & PO", href: "/checkout?demo=1" },
              { label: "Store Locator — Search", href: "/store-locator" },
              { label: "PLP — Filters", href: "/search?q=blower%20motor&signedin=1" },
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
