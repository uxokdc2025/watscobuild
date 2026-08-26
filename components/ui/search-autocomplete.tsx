"use client";

import * as React from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type SearchSuggestion = { text: string; context: string };
type SuggestedProduct = { title: string; item: string; mfg: string; image: string };

const SUGGESTIONS: SearchSuggestion[] = [
  { text: "blower motor", context: "in Motors & Parts" },
  { text: "blower motor 1/2 hp", context: "in Motors & Parts" },
  { text: "blower wheel", context: "in HVAC Components" },
];

const PRODUCTS: SuggestedProduct[] = [
  { title: "Blower Motor 1/2 HP · 120/240 V", item: "58MV660006", mfg: "58MV 660 006", image: "/peirce-search/blower-motor-01.avif" },
  { title: "Blower Motor 1/2 HP · 120/240 V", item: "58MV660004", mfg: "58MV 660 004", image: "/peirce-search/blower-motor-02.avif" },
  { title: "Blower Motor 1/5 HP · 115 V", item: "HC37AE114", mfg: "HC 37AE 114", image: "/peirce-search/blower-motor-03.avif" },
];

export function SearchAutocomplete({
  placeholder = "Search item # or name",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q");
    if (query) setValue(query);
    // The query only seeds the controlled input on mount; after that, clearing
    // or editing the field remains user-controlled.
  }, []);

  React.useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const submit = (query = value) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}&signedin=1`);
  };

  const show = open && value.trim().length > 0;
  const query = value.trim().toLowerCase();
  const filtered = SUGGESTIONS.filter((item) => item.text.includes(query));
  const suggestions = filtered.length ? filtered : SUGGESTIONS;

  return (
    <div ref={rootRef} className={cn("relative min-w-0 flex-1", className)}>
      <form onSubmit={(event) => { event.preventDefault(); submit(); }} role="search">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value}
          onChange={(event) => { setValue(event.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => { if (value.trim()) setOpen(true); }}
          onKeyDown={(event) => {
            if (event.key === "Escape") { setOpen(false); return; }
            if (!show) return;
            if (event.key === "ArrowDown") { event.preventDefault(); setActive((current) => Math.min(current + 1, suggestions.length - 1)); }
            if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => Math.max(current - 1, -1)); }
            if (event.key === "Enter" && active >= 0) { event.preventDefault(); submit(suggestions[active].text); }
          }}
          role="combobox"
          aria-label="Search"
          aria-expanded={show}
          aria-controls="search-autocomplete-panel"
          placeholder={placeholder}
          className="h-10 w-full rounded-sm border-0 bg-white pr-10 pl-9 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
        {value ? <button type="button" aria-label="Clear search" onClick={() => { setValue(""); setOpen(false); }} className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button> : null}
      </form>

      {show ? (
        <div id="search-autocomplete-panel" role="listbox" aria-label="Search suggestions" className="absolute top-[calc(100%+8px)] right-0 left-0 z-[80] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-xl">
          <div className="grid max-h-[min(420px,70vh)] grid-cols-1 overflow-y-auto md:grid-cols-[minmax(0,1fr)_minmax(260px,1fr)]">
            <section className="border-b p-3 md:border-r md:border-b-0">
              <p className="px-2 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Search suggestions</p>
              <div className="space-y-1">
                {suggestions.map((item, index) => (
                  <button key={item.text} type="button" role="option" aria-selected={index === active} onMouseEnter={() => setActive(index)} onClick={() => submit(item.text)} className={cn("flex w-full items-center justify-between gap-3 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent", index === active && "bg-accent")}>
                    <span><span className="block font-medium">{item.text}</span><span className="text-xs text-muted-foreground">{item.context}</span></span><ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => submit()} className="mt-2 px-2 text-sm font-medium text-primary underline-offset-4 hover:underline">View all results</button>
            </section>
            <section className="p-3">
              <p className="px-2 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Suggested products</p>
              <div className="space-y-1">
                {PRODUCTS.map((product) => (
                  <button key={product.item} type="button" onClick={() => submit(product.title)} className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left hover:bg-accent">
                    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-sm bg-muted"><img src={product.image} alt="" className="max-h-full max-w-full object-contain" /></span>
                    <span className="min-w-0"><span className="block line-clamp-2 text-xs font-medium">{product.title}</span><span className="block text-[11px] text-muted-foreground">Item {product.item} · MFG {product.mfg}</span></span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}
