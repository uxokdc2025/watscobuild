"use client";

import * as React from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AboutThisProduct, aboutSections } from "../_lib/about";
import type { PdpProduct } from "../_lib/types";

function StyleHeading({
  n,
  title,
  note,
}: {
  n: number;
  title: string;
  note: string;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold tracking-tight">
        <span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-primary align-middle text-xs font-bold text-primary-foreground">
          {n}
        </span>
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

/**
 * Three blue-active accordion styles over the real About content of `product`
 * (Description / Specifications / Documents / Part List). Client review
 * showcase — Style 1 is the existing AboutThisProduct accordion as-is;
 * Styles 2 and 3 re-render the same `aboutSections` content with different
 * shells.
 */
export function AboutAccordionVariants({ product }: { product: PdpProduct }) {
  const sections = React.useMemo(() => aboutSections(product), [product]);
  const defaultValue = sections[0]?.id ?? "description";

  return (
    <div className="flex flex-col gap-14">
      {/* ── Style 1 — Reference accordion (source of truth) ── */}
      <section aria-label="Style 1 — Reference accordion">
        <StyleHeading
          n={1}
          title="Style 1 — Reference accordion"
          note="The current default About This Product accordion, unchanged — the reference the other styles are judged against."
        />
        <AboutThisProduct product={product} />
      </section>

      {/* ── Style 2 — Separated cards ── */}
      <section aria-label="Style 2 — Separated cards">
        <StyleHeading
          n={2}
          title="Style 2 — Separated cards"
          note="Each section is its own bordered card; the expanded header title turns primary blue."
        />
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultValue}
          className="flex w-full flex-col gap-3"
        >
          {sections.map((s) => (
            <AccordionItem
              key={s.id}
              value={s.id}
              className="rounded-lg border bg-card px-4 last:border-b"
            >
              <AccordionTrigger className="group py-4 text-base hover:no-underline data-[state=open]:text-primary [&>svg:last-child]:hidden">
                <span className="flex items-center gap-3">
                  <s.Icon className="size-4 shrink-0 text-muted-foreground group-data-[state=open]:text-primary" />
                  <span className="font-semibold">
                    {s.label}
                    {s.count !== undefined ? (
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        ({s.count})
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className="grid size-6 shrink-0 place-items-center">
                  <Plus className="size-4 group-data-[state=open]:hidden" />
                  <Minus className="size-4 hidden group-data-[state=open]:block" />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <s.Body />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Style 3 — Boxed, accent bar + circular toggle ── */}
      <section aria-label="Style 3 — Boxed, accent bar + circular toggle">
        <StyleHeading
          n={3}
          title="Style 3 — Boxed, accent bar + circular toggle"
          note="One rounded bordered box with divider-split rows; the open row shows a left blue accent bar with a subtle tint, and a filled circular chevron toggle."
        />
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultValue}
          className="w-full overflow-visible rounded-lg border bg-card"
        >
          {sections.map((s) => (
            <AccordionItem
              key={s.id}
              value={s.id}
              className="group relative overflow-hidden border-b-0 border-t px-4 first:rounded-t-lg first:border-t-0 last:rounded-b-lg data-[state=open]:bg-primary/5"
            >
              {/* Open-state "you are here" marker — visible only on the expanded row. */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 hidden w-1 bg-primary group-data-[state=open]:block"
              />
              <AccordionTrigger className="group/trigger min-h-11 py-3 pl-2 text-base hover:no-underline data-[state=open]:text-primary [&>svg:last-child]:hidden">
                <span className="flex items-center gap-3">
                  <s.Icon className="size-4 shrink-0 text-muted-foreground group-data-[state=open]:text-primary" />
                  <span className="font-semibold">
                    {s.label}
                    {s.count !== undefined ? (
                      <Badge variant="secondary" className="ml-2">
                        {s.count}
                      </Badge>
                    ) : null}
                  </span>
                </span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <ChevronDown
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180"
                  />
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-9">
                <s.Body />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
