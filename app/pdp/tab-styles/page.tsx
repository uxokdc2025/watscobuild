import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShowcaseShell } from "../_lib/showcase";
import { SECTIONS } from "../_lib/showcase-data";

export const metadata: Metadata = {
  title: "Tab styles — PDP showcase",
  description: "Tab design patterns for PDP content sections.",
};

/** One tab bar rendered in a given style. */
function TabDemo({
  variant,
  listClassName,
  triggerClassName,
}: {
  variant?: "default" | "line" | "segmented";
  listClassName?: string;
  triggerClassName?: string;
}) {
  return (
    <Tabs defaultValue="description">
      <TabsList variant={variant} className={listClassName}>
        {SECTIONS.map((s) => (
          <TabsTrigger key={s.id} value={s.id} className={triggerClassName}>
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
  );
}

export default function TabStylesPage() {
  return (
    <ShowcaseShell>
      {/* Underline (line) */}
      <TabDemo variant="line" listClassName="gap-6 overflow-x-auto" />

      {/* Full-width segmented */}
      <TabDemo variant="segmented" listClassName="h-10 w-full max-w-2xl" />

      {/* Soft active — tinted blue background on the active tab */}
      <TabDemo
        listClassName="h-auto flex-wrap justify-start gap-1 bg-transparent p-0"
        triggerClassName="h-auto flex-none rounded-lg px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
      />

      {/* Solid filled active */}
      <TabDemo
        listClassName="h-auto flex-wrap justify-start gap-1 bg-transparent p-0"
        triggerClassName="h-auto flex-none rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
      />

      {/* Bordered segmented — outlined boxes, active filled */}
      <TabDemo
        listClassName="h-auto w-full max-w-3xl gap-0 overflow-hidden rounded-md border bg-transparent p-0"
        triggerClassName="h-auto flex-1 rounded-none border-r px-4 py-2.5 text-primary last:border-r-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
      />

      {/* Pill track · solid active pill */}
      <TabDemo
        listClassName="h-auto rounded-full p-1"
        triggerClassName="h-auto flex-none rounded-full px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
      />

      {/* Pill track · white active pill */}
      <TabDemo
        listClassName="h-auto rounded-full p-1"
        triggerClassName="h-auto flex-none rounded-full px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
      />
    </ShowcaseShell>
  );
}
