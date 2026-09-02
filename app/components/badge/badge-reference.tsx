"use client";

import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  PointsBadge,
  ProEssentialsBadge,
  SubstituteBadge,
} from "@/components/ui/label-badges";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "variants", label: "Variants" },
  { id: "colors", label: "Colors" },
  { id: "status", label: "Status & domain" },
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

export default function BadgeReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Badge</h1>
          <p className="max-w-2xl text-muted-foreground">
            A compact status or merchandising label. Every badge in the storefront must be this
            component — never a hand-rolled <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;span&gt;</code>{" "}
            with copied pill classes. The <code className="rounded bg-muted px-1 py-0.5 text-xs">variant</code> sets the
            shape and emphasis; <code className="rounded bg-muted px-1 py-0.5 text-xs">color</code> maps to the
            merchandising legend so blue always means the same thing everywhere.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Badge }"} from &quot;@/components/ui/badge&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              npx shadcn add badge
            </code>
          </div>
        </header>

        {/* ── Usage ── */}
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <p className="text-sm text-muted-foreground">
            A bare <code className="rounded bg-muted px-1 py-0.5 text-xs">Badge</code> is the primary pill. The
            preview renders the live component, not a screenshot.
          </p>
          <PreviewCode install="badge" code={`<Badge>New</Badge>`}>
            <Badge>New</Badge>
          </PreviewCode>
        </section>

        {/* ── Variants ── */}
        <section className="space-y-4">
          <H2 id="variants">Variants</H2>
          <p className="text-sm text-muted-foreground">
            Six semantic variants set shape and emphasis on their own. The two appearance modes —{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">soft</code> and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">solid</code> — must be paired with a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">color</code> (see below), plus{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">outline-color</code> for squared promo / attribute
            chips.
          </p>
          <PreviewCode
            code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="soft" color="violet">Soft</Badge>
<Badge variant="solid" color="violet">Solid</Badge>`}
          >
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="soft" color="violet">
              Soft
            </Badge>
            <Badge variant="solid" color="violet">
              Solid
            </Badge>
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">Colored outline (promo / attribute chips)</p>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 py-0.5 text-xs">outline-color</code> is squared, transparent-filled,
            and colored — the merchandising promo lines and refrigerant-type attribute chips.
          </p>
          <PreviewCode
            code={`<Badge variant="outline-color" color="green">BUNDLE AND SAVE</Badge>
<Badge variant="outline-color" color="red">CLOSEOUT SPECIAL</Badge>
<Badge variant="outline-color" color="blue">R-454B</Badge>`}
          >
            <Badge variant="outline-color" color="green">
              BUNDLE AND SAVE
            </Badge>
            <Badge variant="outline-color" color="red">
              CLOSEOUT SPECIAL
            </Badge>
            <Badge variant="outline-color" color="blue">
              R-454B
            </Badge>
          </PreviewCode>
        </section>

        {/* ── Colors ── */}
        <section className="space-y-4">
          <H2 id="colors">Colors</H2>
          <p className="text-sm text-muted-foreground">
            The <code className="rounded bg-muted px-1 py-0.5 text-xs">color</code> prop pairs with{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">soft</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">solid</code>, or{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">outline-color</code>. Use color for meaning, not
            decoration — blue = new, green = sale/promo, orange = online only, red = clearance/ESD, teal = rebate,
            violet = loyalty. All tints are AA-legible in both themes.
          </p>
          <p className="text-sm font-medium">Soft</p>
          <PreviewCode
            code={`<Badge variant="soft" color="blue">Blue</Badge>
<Badge variant="soft" color="violet">Violet</Badge>
<Badge variant="soft" color="green">Green</Badge>
<Badge variant="soft" color="amber">Amber</Badge>
<Badge variant="soft" color="red">Red</Badge>
<Badge variant="soft" color="slate">Slate</Badge>`}
          >
            <Badge variant="soft" color="blue">
              Blue
            </Badge>
            <Badge variant="soft" color="violet">
              Violet
            </Badge>
            <Badge variant="soft" color="green">
              Green
            </Badge>
            <Badge variant="soft" color="amber">
              Amber
            </Badge>
            <Badge variant="soft" color="red">
              Red
            </Badge>
            <Badge variant="soft" color="slate">
              Slate
            </Badge>
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">Solid</p>
          <PreviewCode
            code={`<Badge variant="solid" color="blue">Blue</Badge>
<Badge variant="solid" color="violet">Violet</Badge>
<Badge variant="solid" color="green">Green</Badge>
<Badge variant="solid" color="amber">Amber</Badge>
<Badge variant="solid" color="red">Red</Badge>
<Badge variant="solid" color="slate">Slate</Badge>`}
          >
            <Badge variant="solid" color="blue">
              Blue
            </Badge>
            <Badge variant="solid" color="violet">
              Violet
            </Badge>
            <Badge variant="solid" color="green">
              Green
            </Badge>
            <Badge variant="solid" color="amber">
              Amber
            </Badge>
            <Badge variant="solid" color="red">
              Red
            </Badge>
            <Badge variant="solid" color="slate">
              Slate
            </Badge>
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">Merchandising legend (solid)</p>
          <p className="text-sm text-muted-foreground">
            The canonical intent mapping used on product surfaces. <code className="rounded bg-muted px-1 py-0.5 text-xs">orange</code>{" "}
            and <code className="rounded bg-muted px-1 py-0.5 text-xs">teal</code> exist for online-only and rebate.
          </p>
          <PreviewCode
            code={`<Badge variant="solid" color="blue">New</Badge>
<Badge variant="solid" color="green">Sale / Promo</Badge>
<Badge variant="solid" color="orange">Online Only</Badge>
<Badge variant="solid" color="red">Clearance / ESD</Badge>
<Badge variant="solid" color="teal">Rebate</Badge>`}
          >
            <Badge variant="solid" color="blue">
              New
            </Badge>
            <Badge variant="solid" color="green">
              Sale / Promo
            </Badge>
            <Badge variant="solid" color="orange">
              Online Only
            </Badge>
            <Badge variant="solid" color="red">
              Clearance / ESD
            </Badge>
            <Badge variant="solid" color="teal">
              Rebate
            </Badge>
          </PreviewCode>
        </section>

        {/* ── Status & domain ── */}
        <section className="space-y-4">
          <H2 id="status">Status &amp; domain badges</H2>
          <p className="text-sm text-muted-foreground">
            Purpose-built Watsco badges. <code className="rounded bg-muted px-1 py-0.5 text-xs">ProEssentialsBadge</code>{" "}
            and <code className="rounded bg-muted px-1 py-0.5 text-xs">SubstituteBadge</code> are locked attribute
            marks; <code className="rounded bg-muted px-1 py-0.5 text-xs">PointsBadge</code> renders CE Rewards
            loyalty; the selected / active state uses the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">in-stock</code> token, never a raw hex.
          </p>
          <PreviewCode
            code={`import {
  ProEssentialsBadge,
  SubstituteBadge,
  PointsBadge,
} from "@/components/ui/label-badges"

<ProEssentialsBadge />
<SubstituteBadge />
<PointsBadge points={25} />

{/* Selected / active — in-stock token, not a raw green hex */}
<Badge className="bg-in-stock text-white">
  <Check className="size-3" />
  Active
</Badge>`}
          >
            <ProEssentialsBadge />
            <SubstituteBadge />
            <PointsBadge points={25} />
            <Badge className="bg-in-stock text-white">
              <Check className="size-3" />
              Active
            </Badge>
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">Position pattern</p>
          <p className="text-sm text-muted-foreground">
            On every product surface — PDP buy-box, PLP card — the badge sits in one slot: directly under the brand
            line, above the title. Same slot regardless of tone or intent.
          </p>
          <PreviewCode
            previewClassName="!items-stretch"
            code={`<div className="flex max-w-md flex-col gap-2 rounded-lg border bg-background p-4">
  <a href="#" className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline">
    Daikin
  </a>
  <div className="flex flex-wrap gap-2">
    <Badge variant="solid" color="red">Sale</Badge>
  </div>
  <h4 className="text-lg font-bold tracking-tight">
    CIRRA 2-Port High-Efficiency Multi-Split Outdoor Heat Pump - 18,000 BTU
  </h4>
  <p className="text-xs text-muted-foreground">Item #: 361067A · MFG #: 2MX18AXVJU</p>
</div>`}
          >
            <div className="flex max-w-md flex-col gap-2 rounded-lg border bg-background p-4">
              <a
                href="#status"
                className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Daikin
              </a>
              <div className="flex flex-wrap gap-2">
                <Badge variant="solid" color="red">
                  Sale
                </Badge>
              </div>
              <h4 className="text-lg font-bold tracking-tight">
                CIRRA 2-Port High-Efficiency Multi-Split Outdoor Heat Pump - 18,000 BTU
              </h4>
              <p className="text-xs text-muted-foreground">Item #: 361067A · MFG #: 2MX18AXVJU</p>
            </div>
          </PreviewCode>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Pair <code className="rounded bg-muted px-1 py-0.5 text-xs">soft</code>/<code className="rounded bg-muted px-1 py-0.5 text-xs">solid</code> with a <code className="rounded bg-muted px-1 py-0.5 text-xs">color</code> from the merchandising legend so intent stays consistent.</>,
              <>Use the <code className="rounded bg-muted px-1 py-0.5 text-xs">in-stock</code> token for stock/active status — <code className="rounded bg-muted px-1 py-0.5 text-xs">bg-in-stock</code>, never <code className="rounded bg-muted px-1 py-0.5 text-xs">bg-green-500</code>.</>,
              <>Use the locked <code className="rounded bg-muted px-1 py-0.5 text-xs">ProEssentialsBadge</code> / <code className="rounded bg-muted px-1 py-0.5 text-xs">SubstituteBadge</code> for those marks instead of re-styling a Badge.</>,
              <>Place product badges in the one slot — under the brand line, above the title.</>,
            ]}
            donts={[
              <>Hand-roll a <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;span className=&quot;rounded-full px-2…&quot;&gt;</code> — it drifts from the library.</>,
              <>Hard-code a raw hex or <code className="rounded bg-muted px-1 py-0.5 text-xs">bg-green-500</code> for stock — always the <code className="rounded bg-muted px-1 py-0.5 text-xs">in-stock</code> token.</>,
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">soft</code>/<code className="rounded bg-muted px-1 py-0.5 text-xs">solid</code> without a <code className="rounded bg-muted px-1 py-0.5 text-xs">color</code> — the fill stays transparent.</>,
              <>Stack many colors on one surface; keep to one intent per product.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="variant"
            rows={[
              { name: "default", type: "primary", description: "The primary pill — filled with the brand primary." },
              { name: "secondary", type: "muted", description: "Low-emphasis neutral pill." },
              { name: "outline", type: "bordered", description: "Neutral bordered pill, transparent fill." },
              { name: "destructive", type: "danger", description: "Error / removal status." },
              { name: "ghost", type: "text", description: "No border or fill until hovered (link badges)." },
              { name: "link", type: "text", description: "Reads as an inline link." },
              { name: "soft", type: "tinted + color", description: "Tinted fill; requires a color. Merchandising + status." },
              { name: "solid", type: "filled + color", description: "Saturated fill; requires a color. Merchandising legend." },
              { name: "outline-color", type: "squared + color", description: "Transparent, colored border + text; promo / attribute chips." },
            ]}
          />
          <PropsTable
            caption="color (with soft / solid / outline-color)"
            rows={[
              { name: "blue", type: "intent", description: "New." },
              { name: "violet", type: "intent", description: "Loyalty / best value (CE Rewards)." },
              { name: "green", type: "intent", description: "Sale / promo / substitute." },
              { name: "amber", type: "intent", description: "Caution / low emphasis warning." },
              { name: "orange", type: "intent", description: "Online only." },
              { name: "red", type: "intent", description: "Clearance / ESD / closeout." },
              { name: "teal", type: "intent", description: "Rebate." },
              { name: "slate", type: "intent", description: "Neutral / non-transactional." },
            ]}
          />
          <PropsTable
            caption="props"
            rows={[
              { name: "asChild", type: "boolean", description: "Render as the child element (e.g. an <a>) via Slot, keeping styles." },
              { name: "className", type: "string", description: "Extra classes — token utilities like bg-in-stock, not raw hex." },
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
              { label: "Badges & Labels (full)", href: "/components/all#labels" },
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
