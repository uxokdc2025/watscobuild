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
 * Style 4 — Folder tab, blue active.
 *
 * Self-contained tab group using plain <button> elements + local state
 * (NOT the shared Tabs/TabsTrigger primitive), so the exact folder-tab
 * markup renders verbatim: the primitive rounds all four corners and
 * collapses the tab height, while this keeps top-only radius
 * (rounded-t-md, square bottom corners) and a 44–48px tab height
 * (px-6 py-3 text-sm). Uses the primary blue token to match the repo.
 */
function Style4FolderTabs({
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
                  ? "relative -mb-px rounded-t-md border border-b-0 border-primary/40 bg-white px-6 py-3 text-sm font-semibold text-primary"
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
 * showcase — styles 1–3 are full Tabs instances differing only in
 * classNames; style 4 is a self-contained button group (see above).
 */
export function AboutVariants({ product }: { product: PdpProduct }) {
  const sections = React.useMemo(() => aboutSections(product), [product]);
  const defaultValue = sections[0]?.id ?? "description";

  return (
    <div className="flex flex-col gap-14">
      {/* ── Style 1 — Icon-over-label with blue underline ── */}
      <section aria-label="Style 1 — Icon tabs, blue underline">
        <StyleHeading
          n={1}
          title="Style 1 — Icon tabs, blue underline"
          note="Icon inline left of the label on a single line; the active tab is primary blue with an underline bar."
        />
        <Tabs defaultValue={defaultValue} className="rounded-xl border bg-card shadow-sm">
          <TabsList variant="line" className="gap-8 rounded-t-xl px-6">
            {sections.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="flex-row items-center gap-2 whitespace-nowrap px-2 py-3 text-muted-foreground data-[state=active]:font-semibold data-[state=active]:text-primary"
              >
                <s.Icon className="size-5" />
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id} className="p-6 pt-4">
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
          <TabsList className="h-10 w-full rounded-md">
            {sections.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="text-muted-foreground data-[state=active]:font-semibold hover:text-primary data-[state=active]:hover:text-foreground"
              >
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

      {/* ── Style 3 — Segmented icon + bold pill ── */}
      <section aria-label="Style 3 — Segmented icon and bold pill">
        <StyleHeading
          n={3}
          title="Style 3 — Segmented icon + bold pill"
          note="Larger icon + label triggers on a padded grey track; the active pill is primary blue with white text."
        />
        <Tabs defaultValue={defaultValue}>
          <TabsList variant="segmented" className="h-auto w-full gap-2 rounded-xl p-3">
            {sections.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="!h-auto self-center rounded-lg px-4 py-2.5 text-muted-foreground data-[state=active]:bg-primary data-[state=active]:font-bold data-[state=active]:text-primary-foreground data-[state=active]:hover:text-primary-foreground data-[state=active]:[&_svg]:text-primary-foreground data-[state=inactive]:hover:text-primary"
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

      {/* ── Style 4 — Folder tab, blue active ── */}
      <section aria-label="Style 4 — Folder tab, blue active">
        <StyleHeading
          n={4}
          title="Style 4 — Folder tab, blue active"
          note="The active tab connects to the content panel with a blue top accent."
        />
        <Style4FolderTabs
          sections={sections}
          defaultValue={defaultValue}
        />
      </section>
    </div>
  );
}
