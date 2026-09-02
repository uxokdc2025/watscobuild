import type { Metadata } from "next";

import { OnThisPage } from "../_ds/sidebar";

export const metadata: Metadata = {
  title: "Color & tokens — Watsco DS",
  description:
    "Every color in the system is a semantic token. Reference the token (bg-primary, text-in-stock) — never a raw hex. Brand color lives only in the header/footer chrome.",
};

const TOC = [
  { id: "rule", label: "The rule" },
  { id: "semantic", label: "Semantic" },
  { id: "status", label: "Ecommerce status" },
  { id: "brand", label: "Brand chrome" },
];

type Token = {
  /** Tailwind utility a dev uses, e.g. bg-primary. */
  cls: string;
  /** The CSS variable that backs it. */
  varName: string;
  label: string;
  usage: string;
  /** Text color to render on the swatch for legibility. */
  on?: string;
  /** Show a thin border (for near-white swatches). */
  bordered?: boolean;
};

const SEMANTIC: Token[] = [
  { cls: "bg-background", varName: "--background", label: "Background", usage: "Page canvas.", on: "text-foreground", bordered: true },
  { cls: "bg-foreground", varName: "--foreground", label: "Foreground", usage: "Primary text.", on: "text-background" },
  { cls: "bg-card", varName: "--card", label: "Card", usage: "Raised surfaces, panels.", on: "text-card-foreground", bordered: true },
  { cls: "bg-muted", varName: "--muted", label: "Muted", usage: "Subtle fills, table stripes.", on: "text-foreground", bordered: true },
  { cls: "bg-muted-foreground", varName: "--muted-foreground", label: "Muted foreground", usage: "Secondary / helper text.", on: "text-background" },
  { cls: "bg-primary", varName: "--primary", label: "Primary", usage: "Main actions, links, focus ring.", on: "text-primary-foreground" },
  { cls: "bg-secondary", varName: "--secondary", label: "Secondary", usage: "Secondary fills.", on: "text-secondary-foreground", bordered: true },
  { cls: "bg-accent", varName: "--accent", label: "Accent", usage: "Hover surfaces, active nav.", on: "text-accent-foreground" },
  { cls: "bg-destructive", varName: "--destructive", label: "Destructive", usage: "Errors, delete, danger.", on: "text-white" },
  { cls: "bg-border", varName: "--border", label: "Border", usage: "Dividers, outlines.", on: "text-foreground", bordered: true },
  { cls: "bg-ring", varName: "--ring", label: "Ring", usage: "Focus-visible ring.", on: "text-primary-foreground" },
];

const STATUS: Token[] = [
  { cls: "bg-price", varName: "--price", label: "Price", usage: "Bold price text (text-price).", on: "text-white" },
  { cls: "bg-in-stock", varName: "--in-stock", label: "In stock", usage: "Available / success.", on: "text-white" },
  { cls: "bg-low-stock", varName: "--low-stock", label: "Low stock", usage: "Limited qty. AA 4.55:1 on white.", on: "text-white" },
  { cls: "bg-out-of-stock", varName: "--out-of-stock", label: "Out of stock", usage: "Unavailable / muted status.", on: "text-white" },
];

const BRAND: Token[] = [
  { cls: "bg-brand-carrier", varName: "--brand-carrier", label: "Carrier Enterprise", usage: "Header / footer only.", on: "text-white" },
  { cls: "bg-brand-gemaire", varName: "--brand-gemaire", label: "Gemaire", usage: "Header / footer only.", on: "text-white" },
  { cls: "bg-brand-homans", varName: "--brand-homans", label: "Homans", usage: "Header / footer only.", on: "text-white" },
  { cls: "bg-brand-peirce", varName: "--brand-peirce", label: "Peirce-Phelps", usage: "Header / footer only.", on: "text-white" },
  { cls: "bg-brand-ecmdi", varName: "--brand-ecmdi", label: "East Coast Metal", usage: "Header / footer only.", on: "text-white" },
  { cls: "bg-brand-dcne", varName: "--brand-dcne", label: "DCNE", usage: "Header / footer only.", on: "text-white" },
  { cls: "bg-brand-baker", varName: "--brand-baker", label: "Baker", usage: "Header / footer only.", on: "text-white" },
];

function Swatch({ t }: { t: Token }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div
        className={`flex h-20 items-end p-3 ${t.cls} ${t.on ?? "text-foreground"} ${
          t.bordered ? "border-b" : ""
        }`}
      >
        <span className="text-xs font-medium opacity-90">{t.label}</span>
      </div>
      <div className="flex flex-col gap-1 px-3 py-2.5">
        <code className="font-mono text-xs font-medium">{t.cls}</code>
        <code className="font-mono text-[11px] text-muted-foreground">{t.varName}</code>
        <p className="mt-0.5 text-xs text-muted-foreground">{t.usage}</p>
      </div>
    </div>
  );
}

function Grid({ tokens }: { tokens: Token[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {tokens.map((t) => (
        <Swatch key={t.cls} t={t} />
      ))}
    </div>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export default function ColorsPage() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Foundations
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Color &amp; tokens</h1>
          <p className="max-w-2xl text-muted-foreground">
            Every color is a semantic token. Reference the token utility
            (<code className="rounded bg-muted px-1 py-0.5 text-xs">bg-primary</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">text-in-stock</code>) — never a raw
            hex. All swatches below are live and follow light/dark automatically.
          </p>
        </header>

        <section className="space-y-3">
          <H2 id="rule">The rule</H2>
          <div className="rounded-xl border-l-4 border-l-primary bg-primary/5 p-4 text-sm">
            <p className="font-medium">One theme, one system.</p>
            <p className="mt-1 text-muted-foreground">
              Semantic and status tokens are identical across every Watsco brand. The{" "}
              <span className="font-medium text-foreground">only</span> place a brand&apos;s dominant
              color appears is the <span className="font-medium text-foreground">header / footer chrome</span>.
              A brand&apos;s color must never leak into buttons, cards, prices, or body — those always
              use the neutral tokens below.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <H2 id="semantic">Semantic</H2>
          <p className="text-sm text-muted-foreground">
            The core palette. These drive every component and page.
          </p>
          <Grid tokens={SEMANTIC} />
        </section>

        <section className="space-y-4">
          <H2 id="status">Ecommerce status</H2>
          <p className="text-sm text-muted-foreground">
            Merchandising signals. Contrast is tuned to WCAG AA on white.
          </p>
          <Grid tokens={STATUS} />
        </section>

        <section className="space-y-4">
          <H2 id="brand">Brand chrome</H2>
          <p className="text-sm text-muted-foreground">
            Header / footer only. Never use these on buttons, cards, or body content.
          </p>
          <Grid tokens={BRAND} />
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}
