"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aboutSections, type AboutSection } from "./about";
import { AhriLookup } from "./ahri-lookup";
import type { PdpProduct } from "./types";

const AHRI_TAB_ID = "ahri-lookup";

/**
 * About This Product — tabbed variant used on AHRI-matched PDPs. Reuses the
 * Style 2 "connected bar, soft blue active" tab pattern from /pdp/about-variants
 * and injects an "AHRI Lookup" tab (the in-page system builder) after
 * Specifications. The "Find an AHRI Matched System" CTA links to #ahri-lookup,
 * which selects this tab and scrolls it into view.
 */
export function AboutThisProductTabs({ product }: { product: PdpProduct }) {
  // Base sections (Description / Specifications / [Documents] / [Part List]).
  // Drop Documents here (this product shows documents inline in the buy box),
  // and slot AHRI Lookup right after Specifications to match the reference.
  const sections = React.useMemo<AboutSection[]>(() => {
    const base = aboutSections(product).filter((s) => s.id !== "documents");
    const ahri: AboutSection = {
      id: AHRI_TAB_ID,
      label: "AHRI Lookup",
      Icon: Search,
      Body: () => <AhriLookup />,
    };
    const specIdx = base.findIndex((s) => s.id === "specifications");
    const at = specIdx === -1 ? base.length : specIdx + 1;
    return [...base.slice(0, at), ahri, ...base.slice(at)];
  }, [product]);

  const [active, setActive] = React.useState(sections[0]?.id ?? "description");
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Activate the AHRI tab from the #ahri-lookup hash (the buy-box CTA) and
  // scroll it into view.
  React.useEffect(() => {
    function syncFromHash() {
      if (typeof window === "undefined") return;
      if (window.location.hash === `#${AHRI_TAB_ID}`) {
        setActive(AHRI_TAB_ID);
        requestAnimationFrame(() =>
          rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
      }
    }
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <section ref={rootRef} aria-label="About this product" className="flex scroll-mt-6 flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">About This Product</h2>
      <Tabs value={active} onValueChange={setActive}>
        <TabsList
          variant="segmented"
          className="h-11 w-full items-center gap-0 divide-x divide-border overflow-hidden rounded-md border border-border bg-white p-0"
        >
          {sections.map((s) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="h-full rounded-none border-0 px-4 text-sm font-medium text-muted-foreground after:hidden data-[state=active]:bg-[var(--blue-100)]! data-[state=active]:font-semibold data-[state=active]:text-[var(--blue-800)]! data-[state=active]:[&_svg]:text-[var(--blue-800)]! data-[state=active]:hover:bg-[var(--blue-100)] data-[state=active]:hover:text-[var(--blue-800)] data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground"
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
  );
}
