"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aboutSections, type AboutSection } from "../_lib/about";
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
 * Style 3 — Folder tab, blue active.
 *
 * Self-contained tab group using plain <button> elements + local state
 * (NOT the shared Tabs/TabsTrigger primitive), so the exact folder-tab
 * markup renders verbatim: the primitive rounds all four corners and
 * collapses the tab height, while this keeps top-only radius
 * (rounded-t-md, square bottom corners) and a 44–48px tab height
 * (px-6 py-3 text-sm). Uses the primary blue token to match the repo.
 */
function Style3FolderTabs({
  sections,
  defaultValue,
}: {
  sections: AboutSection[];
  defaultValue: string;
}) {
  const [active, setActive] = React.useState(defaultValue);
  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <div>
      <div className="w-full border-b border-gray-200">
        <div className="flex items-end gap-2" role="tablist" aria-label="About sections">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active === s.id}
              onClick={() => setActive(s.id)}
              className={
                active === s.id
                  ? "relative -mb-px rounded-t-md border border-b-0 border-primary/40 border-t-[3px] border-t-primary bg-white px-6 py-3 text-sm font-semibold text-primary"
                  : "px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700"
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-6" role="tabpanel">
        {current ? <current.Body /> : null}
      </div>
    </div>
  );
}

/**
 * Four blue-active tab styles over the real About content of `product`
 * (Description / Specifications / Documents / Part List). Client review
 * showcase — styles 1–2 and 4 are full Tabs instances differing only in
 * classNames; style 3 is a self-contained button group (see above).
 */
export function AboutVariants({ product }: { product: PdpProduct }) {
  const sections = React.useMemo(() => aboutSections(product), [product]);
  const defaultValue = sections[0]?.id ?? "description";

  return (
    <div className="flex flex-col gap-14">
      {/* ── Style 1 — Connected segment bar, solid blue active ── */}
      <section aria-label="Style 1 — Connected segment bar, solid blue active">
        <StyleHeading
          n={1}
          title="Style 1 — Connected segment bar, solid blue active"
          note="One bordered bar split into equal segments; the active segment is a solid blue block — no caret, icons kept."
        />
        <Tabs defaultValue={defaultValue}>
          <TabsList
            variant="segmented"
            className="h-11 w-full items-center gap-0 divide-x divide-border overflow-hidden rounded-md border border-border bg-white p-0"
          >
            {sections.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="h-full rounded-none border-0 px-4 text-sm font-medium text-muted-foreground after:hidden data-[state=active]:bg-primary data-[state=active]:font-semibold data-[state=active]:text-primary-foreground data-[state=active]:[&_svg]:text-primary-foreground data-[state=active]:hover:bg-primary data-[state=active]:hover:text-primary-foreground data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground"
              >
                <s.Icon className="size-4" />
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id} className="pt-6">
              <s.Body />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* ── Style 2 — Segmented pill with counts ── */}
      <section aria-label="Style 2 — Segmented pill with counts">
        <StyleHeading
          n={2}
          title="Style 2 — Segmented pill with counts"
          note="Grey track, white active pill; section counts stay muted, hover stays blue."
        />
        <Tabs defaultValue={defaultValue}>
          <TabsList className="h-11 w-full rounded-md">
            {sections.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="py-2 text-muted-foreground hover:text-primary data-[state=active]:!bg-background data-[state=active]:font-semibold data-[state=active]:!text-primary data-[state=active]:[&_svg]:!text-primary data-[state=active]:hover:text-primary"
              >
                <s.Icon className="size-4" />
                {s.label}
                {s.count !== undefined ? (
                  <span className="text-xs font-normal text-muted-foreground">
                    {s.count}
                  </span>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id} className="pt-6">
              <s.Body />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* ── Style 3 — Folder tab, blue active ── */}
      <section aria-label="Style 3 — Folder tab, blue active">
        <StyleHeading
          n={3}
          title="Style 3 — Folder tab, blue active"
          note="The active tab connects to the content panel with a blue top accent."
        />
        <Style3FolderTabs
          sections={sections}
          defaultValue={defaultValue}
        />
      </section>

      {/* ── Style 4 — Soft blue active (no outline) ── */}
      <section aria-label="Style 4 — Soft blue active (no outline)">
        <StyleHeading
          n={4}
          title="Style 4 — Soft blue active (no outline)"
          note="Active tab is a soft 20% blue fill with blue icon and label — no outline."
        />
        <Tabs defaultValue={defaultValue}>
          <TabsList className="h-11 w-full justify-start gap-1 border-0 bg-transparent p-0">
            {sections.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="h-full flex-1 rounded-md border-0 px-4 text-sm font-medium text-muted-foreground after:hidden data-[state=active]:bg-primary/20 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:[&_svg]:text-primary data-[state=inactive]:bg-transparent data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground"
              >
                <s.Icon className="size-4" />
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id} className="pt-6">
              <s.Body />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
