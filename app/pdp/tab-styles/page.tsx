import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShowcaseShell } from "../_lib/showcase";
import { SECTIONS, VariantBlock } from "../_lib/showcase-data";

export const metadata: Metadata = {
  title: "Tab styles — PDP showcase",
  description: "Three tab design patterns for PDP content sections.",
};

export default function TabStylesPage() {
  return (
    <ShowcaseShell
      eyebrow="Design showcase"
      heading="Tab styles"
      intro="Three tab patterns for the PDP content sections — Description, Documents, Features, Specifications. Scroll past the buy box to see the sticky Add-to-Cart bar."
    >
      {/* 1 · Underline (line) */}
      <VariantBlock
        n={1}
        name="Underline (line)"
        note="Brand-colored active tab with an underline — the PDP default, best for 3–5 sections."
      >
        <Tabs defaultValue="description">
          <TabsList variant="line" className="gap-6 overflow-x-auto">
            {SECTIONS.map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {SECTIONS.map((s) => (
            <TabsContent key={s.id} value={s.id} className="pt-6">
              <s.Body />
            </TabsContent>
          ))}
        </Tabs>
      </VariantBlock>

      {/* 2 · Segmented pills */}
      <VariantBlock
        n={2}
        name="Segmented control"
        note="Primary-filled active pill on a muted track — feels app-like, best for exactly 2–4 sections."
      >
        <Tabs defaultValue="description">
          <TabsList variant="segmented" className="h-10 w-full max-w-2xl">
            {SECTIONS.map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {SECTIONS.map((s) => (
            <TabsContent key={s.id} value={s.id} className="pt-6">
              <s.Body />
            </TabsContent>
          ))}
        </Tabs>
      </VariantBlock>

      {/* 3 · Vertical (sidebar) */}
      <VariantBlock
        n={3}
        name="Vertical · sidebar"
        note="Tabs stack on the left, content on the right — scales to many sections without wrapping."
      >
        <Tabs
          defaultValue="description"
          orientation="vertical"
          className="gap-6 sm:gap-8"
        >
          <TabsList
            variant="default"
            className="h-fit w-full flex-col p-1.5 sm:w-52 sm:shrink-0"
          >
            {SECTIONS.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="w-full justify-start">
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1">
            {SECTIONS.map((s) => (
              <TabsContent key={s.id} value={s.id}>
                <s.Body />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </VariantBlock>
    </ShowcaseShell>
  );
}
