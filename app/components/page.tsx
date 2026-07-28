import type { Metadata } from "next";
import Link from "next/link";
import { Type } from "lucide-react";

import { ThemeToggle } from "./_showcase";
import { ActionsSection } from "./_sections/actions";
import { LabelsSection } from "./_sections/labels";
import { FormsSection } from "./_sections/forms";
import { FeedbackSection } from "./_sections/feedback";
import { OverlaysSection } from "./_sections/overlays";
import { DataSection } from "./_sections/data";
import { NavigationSection } from "./_sections/navigation";
import { MediaSection } from "./_sections/media";

export const metadata: Metadata = {
  title: "Components — watscobuild",
  description:
    "Every shadcn/ui component in the registry, shown across all its states.",
};

const NAV = [
  { id: "actions", label: "Actions" },
  { id: "labels", label: "Badges" },
  { id: "forms", label: "Forms" },
  { id: "feedback", label: "Feedback" },
  { id: "overlays", label: "Overlays" },
  { id: "data", label: "Data" },
  { id: "navigation", label: "Navigation" },
  { id: "media", label: "Media" },
];

export default function ComponentsPage() {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Components</h1>
              <p className="text-xs text-muted-foreground">
                27 components · every state
              </p>
            </div>
            <ThemeToggle />
          </div>
          <nav
            aria-label="Component categories"
            className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0"
          >
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {n.label}
              </a>
            ))}
            <span aria-hidden className="mx-1 w-px shrink-0 self-stretch bg-border" />
            <Link
              href="/typography"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Type className="size-3.5" />
              Typography
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-4 py-10 md:px-6">
        <ActionsSection />
        <LabelsSection />
        <FormsSection />
        <FeedbackSection />
        <OverlaysSection />
        <DataSection />
        <NavigationSection />
        <MediaSection />

        <footer className="border-t pt-6 text-sm text-muted-foreground">
          Click any <span className="font-mono text-xs">add …</span> chip to copy
          its install command.
        </footer>
      </main>
    </div>
  );
}
