import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShowcaseShell } from "../_lib/showcase";
import { SECTIONS } from "../_lib/showcase-data";
import {
  AccentAccordion,
  PlusAccordion,
  StepAccordion,
} from "../_lib/showcase-accordions";

export const metadata: Metadata = {
  title: "Accordion styles — PDP showcase",
  description: "Three accordion design patterns for PDP content sections.",
};

export default function AccordionStylesPage() {
  return (
    <ShowcaseShell>
      {/* 1 · Default (shadcn) */}
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

      {/* 2 · Separated cards */}
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

      {/* 3 · Filled bars · left accent */}
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

      {/* 4 · Plus / minus separated cards */}
      <PlusAccordion />

      {/* 5 · Status-dot step cards */}
      <StepAccordion />

      {/* 6 · Circular chevron + left accent */}
      <AccentAccordion />
    </ShowcaseShell>
  );
}
