"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
              className="rounded-lg border border-b bg-card px-4"
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

      {/* ── Style 3 — Flush minimal ── */}
      <section aria-label="Style 3 — Flush minimal">
        <StyleHeading
          n={3}
          title="Style 3 — Flush minimal"
          note="Borderless sections split by a thin divider; the open label is blue and semibold."
        />
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultValue}
          className="w-full"
        >
          {sections.map((s) => (
            <AccordionItem
              key={s.id}
              value={s.id}
              className="rounded-none border-0 border-b px-0 last:border-b"
            >
              <AccordionTrigger className="group py-5 text-base hover:no-underline data-[state=open]:font-semibold data-[state=open]:text-primary [&>svg]:text-primary">
                <span className="flex items-center gap-3">
                  <s.Icon className="size-4 shrink-0 text-muted-foreground group-data-[state=open]:text-primary" />
                  <span className="font-medium group-data-[state=open]:font-semibold">
                    {s.label}
                    {s.count !== undefined ? (
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        ({s.count})
                      </span>
                    ) : null}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <s.Body />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
