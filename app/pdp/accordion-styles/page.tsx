import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShowcaseShell } from "../_lib/showcase";
import { SECTIONS, VariantBlock } from "../_lib/showcase-data";

export const metadata: Metadata = {
  title: "Accordion styles — PDP showcase",
  description: "Three accordion design patterns for PDP content sections.",
};

export default function AccordionStylesPage() {
  return (
    <ShowcaseShell
      eyebrow="Design showcase"
      heading="Accordion styles"
      intro="Three accordion patterns for the PDP content sections — Description, Documents, Features, Specifications. Scroll past the buy box to see the sticky Add-to-Cart bar."
    >
      {/* 1 · shadcn default */}
      <VariantBlock
        n={1}
        name="Default (shadcn)"
        note="Underlined rows, chevron, single-open. The safe baseline."
      >
        <Accordion type="single" collapsible defaultValue="description" className="w-full">
          {SECTIONS.map((s) => (
            <AccordionItem key={s.id} value={s.id}>
              <AccordionTrigger className="text-base">{s.label}</AccordionTrigger>
              <AccordionContent>
                <s.Body />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </VariantBlock>

      {/* 2 · Separated cards */}
      <VariantBlock
        n={2}
        name="Separated cards"
        note="Each section is its own rounded card — clearer grouping, multiple can stay open."
      >
        <Accordion
          type="multiple"
          defaultValue={["description"]}
          className="flex w-full flex-col gap-3"
        >
          {SECTIONS.map((s) => (
            <AccordionItem
              key={s.id}
              value={s.id}
              className="rounded-xl border border-b bg-card px-4 shadow-sm"
            >
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                {s.label}
              </AccordionTrigger>
              <AccordionContent>
                <s.Body />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </VariantBlock>

      {/* 3 · Filled bars with left accent */}
      <VariantBlock
        n={3}
        name="Filled bars · left accent"
        note="Bold filled headers with a primary accent — high-scannability for spec-heavy pages."
      >
        <Accordion
          type="multiple"
          defaultValue={["description"]}
          className="flex w-full flex-col gap-2"
        >
          {SECTIONS.map((s) => (
            <AccordionItem
              key={s.id}
              value={s.id}
              className="overflow-hidden rounded-lg border-0 border-l-4 border-l-primary bg-muted/40"
            >
              <AccordionTrigger className="px-4 text-base font-bold hover:no-underline data-[state=open]:bg-muted">
                {s.label}
              </AccordionTrigger>
              <AccordionContent className="bg-background px-4 pt-4">
                <s.Body />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </VariantBlock>
    </ShowcaseShell>
  );
}
