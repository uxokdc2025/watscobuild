import type { Metadata } from "next";

import { TypeSpecimen, type Spec } from "../../typography/_specimen";
import { OnThisPage } from "../_ds/sidebar";

export const metadata: Metadata = {
  title: "Typography — Watsco DS",
  description: "The type scale, mapped to Tailwind classes with live samples.",
};

const TEXT: Spec[] = [
  { name: "Body", cls: "text-base font-normal", px: 16, weight: "Normal 400", sample: "The quick brown fox jumps over the lazy dog while the sun sets behind the distant hills." },
  { name: "Small body", cls: "text-sm font-normal", px: 14, weight: "Normal 400", sample: "Secondary copy and supporting paragraphs sit comfortably one step down from body." },
  { name: "Label", cls: "text-sm font-medium", px: 14, weight: "Medium 500", sample: "Email address" },
  { name: "Caption", cls: "text-xs font-normal", px: 12, weight: "Normal 400", sample: "Last updated 2 minutes ago" },
];

const HEADINGS: Spec[] = [
  { name: "Display", cls: "text-4xl font-bold", px: 36, weight: "Bold 700", sample: "Build the foundation first" },
  { name: "Page title", cls: "text-3xl font-bold", px: 30, weight: "Bold 700", sample: "Component Library" },
  { name: "Section heading", cls: "text-2xl font-semibold", px: 24, weight: "Semibold 600", sample: "Typography scale" },
  { name: "Subheading", cls: "text-lg font-semibold", px: 18, weight: "Semibold 600", sample: "Designed for clarity" },
];

const TOC = [
  { id: "body", label: "Body & UI text" },
  { id: "headings", label: "Headings & Display" },
];

function Scale({ id, title, specs }: { id: string; title: string; specs: Spec[] }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="mb-2 text-xl font-semibold tracking-tight">{title}</h2>
      <div className="rounded-xl border bg-card px-5 text-card-foreground md:px-8">
        {specs.map((s) => (
          <TypeSpecimen key={s.name} spec={s} />
        ))}
      </div>
    </section>
  );
}

export default function TypographyPage() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Foundations
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Typography</h1>
          <p className="max-w-2xl text-muted-foreground">
            Each style is rendered live at its real size and weight. Click any class chip to copy the
            Tailwind utilities.
          </p>
        </header>
        <Scale id="body" title="Body & UI text" specs={TEXT} />
        <Scale id="headings" title="Headings & Display" specs={HEADINGS} />
      </main>
      <OnThisPage items={TOC} />
    </div>
  );
}
