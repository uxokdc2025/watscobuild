"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const MENU = {
  Residential: ["Air Conditioners", "Air Handlers", "Heat Pumps", "Mini Splits"],
  Commercial: ["Packaged Units", "Rooftop Systems", "Commercial Parts", "Controls"],
  "Parts & Supplies": ["Motors", "Filters", "Electrical", "Refrigeration"],
  Tools: ["Hand Tools", "Testing Equipment", "Safety Gear", "Jobsite Supplies"],
};

export function MegaMenu({ label = "Products", className }: { label?: string; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) { setOpen(false); setSelected(null); }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const categories = Object.keys(MENU);
  const children = selected ? MENU[selected as keyof typeof MENU] : [];

  return (
    <div ref={rootRef} className={cn("relative", className)} onMouseEnter={() => setOpen(true)}>
      <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-1 px-3 py-3 text-sm font-medium whitespace-nowrap text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
        {label}<ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div role="menu" className="absolute top-full left-0 z-[60] w-[min(680px,calc(100vw-2rem))] overflow-hidden rounded-b-md border bg-popover text-popover-foreground shadow-2xl" onMouseLeave={() => { /* keep open for keyboard/click users */ }}>
          <div className="relative grid min-h-[270px] grid-cols-[210px_1fr]">
            <div className="border-r bg-muted/30 p-2">
              <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Shop products</p>
              {categories.map((category) => (
                <button key={category} type="button" role="menuitem" onClick={() => setSelected(category)} onMouseEnter={() => setSelected(category)} className={cn("flex w-full items-center justify-between rounded-sm px-3 py-3 text-left text-sm font-medium hover:bg-accent", selected === category && "bg-accent text-primary")}>
                  {category}<ChevronRight className="size-4" />
                </button>
              ))}
            </div>
            <div className="p-5">
              {selected ? (
                <div key={selected} className="animate-in slide-in-from-right-2 duration-300">
                  <div className="flex items-center gap-2 border-b pb-3"><button type="button" onClick={() => setSelected(null)} className="grid size-8 place-items-center rounded-sm hover:bg-accent" aria-label="Back to product categories"><ChevronLeft className="size-4" /></button><h2 className="text-base font-semibold">{selected}</h2></div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 pt-3">{children.map((item) => <a key={item} href="#" className="rounded-sm px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">{item}</a>)}</div>
                  <a href="#" className="mt-5 inline-flex items-center gap-1 px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">View all {selected.toLowerCase()} <ChevronRight className="size-4" /></a>
                </div>
              ) : <div className="flex h-full min-h-[230px] flex-col justify-center px-4"><p className="text-lg font-semibold">Find the right products</p><p className="mt-1 max-w-xs text-sm text-muted-foreground">Browse equipment, parts, and supplies by category.</p></div>}
            </div>
          </div>
          <div className="flex items-center justify-between border-t bg-muted/20 px-5 py-3 text-sm"><span className="text-muted-foreground">Need help choosing?</span><a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">Talk to an expert</a></div>
        </div>
      ) : null}
    </div>
  );
}
