import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { ThemeToggle } from "../components/_showcase";
import { TypeSpecimen, type Spec } from "./_specimen";

export const metadata: Metadata = {
  title: "Typography — watscobuild",
  description: "The type scale, mapped to Tailwind classes with live samples.",
};

const TEXT: Spec[] = [
  {
    name: "Body",
    cls: "text-base font-normal",
    px: 16,
    weight: "Normal 400",
    sample:
      "The quick brown fox jumps over the lazy dog while the sun sets behind the distant hills.",
  },
  {
    name: "Small body",
    cls: "text-sm font-normal",
    px: 14,
    weight: "Normal 400",
    sample:
      "Secondary copy and supporting paragraphs sit comfortably one step down from body.",
  },
  {
    name: "Label",
    cls: "text-sm font-medium",
    px: 14,
    weight: "Medium 500",
    sample: "Email address",
  },
  {
    name: "Caption",
    cls: "text-xs font-normal",
    px: 12,
    weight: "Normal 400",
    sample: "Last updated 2 minutes ago",
  },
];

const HEADINGS: Spec[] = [
  {
    name: "Display",
    cls: "text-4xl font-bold",
    px: 36,
    weight: "Bold 700",
    sample: "Build the foundation first",
  },
  {
    name: "Page title",
    cls: "text-3xl font-bold",
    px: 30,
    weight: "Bold 700",
    sample: "Component Library",
  },
  {
    name: "Section heading",
    cls: "text-2xl font-semibold",
    px: 24,
    weight: "Semibold 600",
    sample: "Typography scale",
  },
  {
    name: "Subheading",
    cls: "text-lg font-semibold",
    px: 18,
    weight: "Semibold 600",
    sample: "Designed for clarity",
  },
];

function Scale({ title, specs }: { title: string; specs: Spec[] }) {
  return (
    <section className="scroll-mt-20">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight">{title}</h2>
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
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/components"
              aria-label="Back to components"
              className="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ChevronLeft className="size-4" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Typography</h1>
              <p className="text-xs text-muted-foreground">
                8 styles · mapped to Tailwind
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 md:px-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each style is rendered live at its real size and weight. Click any
          class chip to copy the Tailwind utilities.
        </p>
        <Scale title="Body & UI text" specs={TEXT} />
        <Scale title="Headings & Display" specs={HEADINGS} />
      </main>
    </div>
  );
}
