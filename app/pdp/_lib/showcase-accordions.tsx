"use client";

import * as React from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { Accordion as AP } from "radix-ui";

import { SECTIONS } from "./showcase-data";

const CONTENT_ANIM =
  "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down";

/* A · Plus / minus separated cards */
export function PlusAccordion() {
  return (
    <AP.Root type="single" collapsible defaultValue="description" className="flex flex-col gap-3">
      {SECTIONS.map((s) => (
        <AP.Item key={s.id} value={s.id} className="rounded-xl border bg-card shadow-sm">
          <AP.Header className="flex">
            <AP.Trigger className="group flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              {s.label}
              <Plus className="size-5 shrink-0 text-primary group-data-[state=open]:hidden" />
              <Minus className="hidden size-5 shrink-0 text-primary group-data-[state=open]:block" />
            </AP.Trigger>
          </AP.Header>
          <AP.Content className={CONTENT_ANIM}>
            <div className="px-5 pb-5">
              <s.Body />
            </div>
          </AP.Content>
        </AP.Item>
      ))}
    </AP.Root>
  );
}

/* B · Status-dot step cards (left indicator + chevron) */
export function StepAccordion() {
  return (
    <AP.Root type="single" collapsible defaultValue="description" className="flex flex-col gap-3">
      {SECTIONS.map((s) => (
        <AP.Item key={s.id} value={s.id} className="rounded-xl border bg-card shadow-sm">
          <AP.Header className="flex">
            <AP.Trigger className="group flex flex-1 items-center gap-3 px-5 py-4 text-left text-base font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-primary">
                <span className="size-2 rounded-full bg-primary group-data-[state=open]:size-2.5" />
              </span>
              <span className="flex-1 group-data-[state=open]:text-primary">{s.label}</span>
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </AP.Trigger>
          </AP.Header>
          <AP.Content className={CONTENT_ANIM}>
            <div className="px-5 pt-1 pb-5 pl-[3.25rem]">
              <s.Body />
            </div>
          </AP.Content>
        </AP.Item>
      ))}
    </AP.Root>
  );
}

/* C · Circular chevron + left accent on the open item */
export function AccentAccordion() {
  return (
    <AP.Root type="single" collapsible defaultValue="description" className="flex flex-col gap-3">
      {SECTIONS.map((s) => (
        <AP.Item
          key={s.id}
          value={s.id}
          className="overflow-hidden rounded-xl border border-l-4 border-l-transparent bg-card shadow-sm data-[state=open]:border-l-primary data-[state=open]:bg-muted/40"
        >
          <AP.Header className="flex">
            <AP.Trigger className="group flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <span className="group-data-[state=open]:text-primary">{s.label}</span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full border text-muted-foreground transition-colors group-data-[state=open]:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
              </span>
            </AP.Trigger>
          </AP.Header>
          <AP.Content className={CONTENT_ANIM}>
            <div className="px-5 pb-5">
              <s.Body />
            </div>
          </AP.Content>
        </AP.Item>
      ))}
    </AP.Root>
  );
}
