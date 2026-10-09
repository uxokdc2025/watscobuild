"use client";

import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Gauge,
  Package,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { AboutThisProduct } from "@/app/pdp/_lib/about";
import { getPdp } from "@/app/pdp/_lib/registry";
import { PreviewCode, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "sections", label: "Sections & Icons" },
  { id: "guidance", label: "Guidance" },
  { id: "in-production", label: "In Production" },
];

/** Rich sample so every section renders — specs, documents, and a part list. */
const SAMPLE = getPdp("uc-tabs-accordions");

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

const SECTIONS: { Icon: LucideIcon; label: string; when: string }[] = [
  { Icon: FileText, label: "Description", when: "Always — opens first." },
  { Icon: Gauge, label: "Specifications", when: "When the product carries spec data." },
  { Icon: BookOpen, label: "Documents", when: "When the product has documents (count shown)." },
  { Icon: Settings, label: "Part List", when: "Non-bundle products with a parts catalog or parts (count shown)." },
  { Icon: Package, label: "Bundle Components", when: "Bundle products — replaces Part List." },
];

const USAGE_CODE = `import { AboutThisProduct } from "@/app/pdp/_lib/about";
import { getPdp } from "@/app/pdp/_lib/registry";

const product = getPdp("uc-tabs-accordions")!;

// Every PDP renders this one component. Panels are data-driven from
// aboutSections(product) — icons, labels, and gating live in one place.
<AboutThisProduct product={product} />`;

export default function AboutReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">About This Product</h1>
          <p className="max-w-2xl text-muted-foreground">
            The single accordion every PDP renders below the buy box. Its panels
            are data-driven from{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">aboutSections(product)</code>{" "}
            — one source of truth for the section icons, labels, and when each
            shows — so the tabbed and accordion variants can never drift.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ AboutThisProduct }"} from &quot;@/app/pdp/_lib/about&quot;
            </code>
          </div>
        </header>

        {/* ── Usage ── */}
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <p className="text-sm text-muted-foreground">
            The live component, rendered with a real product that carries every
            section. Description opens first; one panel is open at a time.
          </p>
          <PreviewCode code={USAGE_CODE} previewClassName="block">
            <div className="w-full max-w-2xl">
              {SAMPLE ? (
                <AboutThisProduct product={SAMPLE} />
              ) : (
                <p className="text-sm text-muted-foreground">Sample product unavailable.</p>
              )}
            </div>
          </PreviewCode>
        </section>

        {/* ── Sections & icons ── */}
        <section className="space-y-4">
          <H2 id="sections">Sections &amp; icons</H2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The canonical section set and icons. Specifications uses a gauge and
            Part List a gear so neither reads like Description. Defined once in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">aboutSections</code>.
          </p>
          <ul className="divide-y rounded-xl border">
            {SECTIONS.map((s) => (
              <li key={s.label} className="flex items-center gap-4 px-4 py-3">
                <s.Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="w-40 shrink-0 text-sm font-semibold">{s.label}</span>
                <span className="text-sm text-muted-foreground">{s.when}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              "Render <AboutThisProduct /> on every PDP — it adapts to the product's data.",
              "Add or change a section in aboutSections() so both the accordion and tabbed variants update together.",
              "Keep the canonical icons: Description (file), Specifications (gauge), Documents (book), Part List (gear), Bundle (package).",
            ]}
            donts={[
              "Hardcode the panels or icons in a page — that is what let them drift before.",
              "Swap in a clipboard for Specifications or a wrench for Part List — they read like the wrong section.",
              "Build a second “about” component for one PDP; extend this one.",
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pdp/uc-tabs-accordions?signedin=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/60"
            >
              Live PDP (About Section)
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}
