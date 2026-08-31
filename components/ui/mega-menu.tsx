"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Command, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCT_TAXONOMY, taxonomyHref, type TaxonomyNode } from "./mega-taxonomy";

function TaxonomyLink({ node, active = false }: { node: TaxonomyNode; active?: boolean }) {
  return <Link role="menuitem" href={taxonomyHref(node)} className={cn("flex min-h-10 items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active && "bg-accent font-semibold text-primary")}>
    <span>{node.label}</span>{node.children?.length ? <ChevronRight aria-hidden="true" className="size-3.5 text-muted-foreground" /> : null}
  </Link>;
}

export function MegaMenu({ label = "Products", className }: { label?: string; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState<TaxonomyNode | null>(null);
  const [subcategory, setSubcategory] = React.useState<TaxonomyNode | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const close = React.useCallback(() => { setOpen(false); setCategory(null); setSubcategory(null); }, []);

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) close(); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("pointerdown", onPointerDown); document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [close]);

  function selectCategory(next: TaxonomyNode) {
    setCategory(next); setSubcategory(next.children?.find((item) => item.children?.length) ?? null);
  }
  const subcategories = category?.children ?? [];
  const details = subcategory?.children ?? [];

  return <div ref={rootRef} className={cn("relative", className)} onMouseEnter={() => setOpen(true)}>
    <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-1 px-3 py-3 text-sm font-medium whitespace-nowrap text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
      {label}<ChevronDown aria-hidden="true" className={cn("size-3.5 transition-transform", open && "rotate-180")} />
    </button>
    {open ? <div role="menu" aria-label="Product categories" className="absolute top-full left-0 z-[60] max-h-[calc(100svh-8rem)] w-[min(920px,calc(100vw-2rem))] overflow-y-auto rounded-b-md border bg-popover text-popover-foreground shadow-2xl">
      <div className="grid grid-cols-1 md:min-h-[390px] md:grid-cols-[220px_300px_1fr]">
        <div className="border-r bg-muted/30 p-2">
          <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Shop products</p>
          {PRODUCT_TAXONOMY.map((node) => <div key={node.slug} onFocus={() => selectCategory(node)} onMouseEnter={() => selectCategory(node)}><TaxonomyLink node={node} active={category?.slug === node.slug} /></div>)}
        </div>
        <div className="border-r p-2">
          {category ? <><div className="flex items-center justify-between border-b px-3 py-3"><Link role="menuitem" href={taxonomyHref(category)} className="text-sm font-semibold text-primary hover:underline">{category.label}</Link><span className="text-xs text-muted-foreground">{subcategories.length} groups</span></div><div className="pt-2">{subcategories.map((node) => <div key={node.slug} onFocus={() => setSubcategory(node.children?.length ? node : null)} onMouseEnter={() => setSubcategory(node.children?.length ? node : null)}><TaxonomyLink node={node} active={subcategory?.slug === node.slug} /></div>)}</div></> : <div className="flex h-full flex-col justify-center px-4"><Command aria-hidden="true" className="size-5 text-primary" /><p className="mt-3 text-lg font-semibold">Find the right products</p><p className="mt-1 text-sm text-muted-foreground">Browse equipment, parts, and supplies by category.</p></div>}
        </div>
        <div className="p-5">
          {subcategory ? <div><div className="flex items-center justify-between border-b pb-3"><Link role="menuitem" href={taxonomyHref(subcategory)} className="text-base font-semibold text-primary hover:underline">{subcategory.label}</Link><span className="text-xs text-muted-foreground">{details.length} options</span></div><div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-3">{details.map((node) => <TaxonomyLink key={node.slug} node={node} />)}</div><Link role="menuitem" href={taxonomyHref(subcategory)} className="mt-5 inline-flex items-center gap-1 px-3 text-sm font-semibold text-primary hover:underline">View all {subcategory.label.toLowerCase()} <ChevronRight aria-hidden="true" className="size-4" /></Link></div> : <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"><Search aria-hidden="true" className="size-6 text-muted-foreground" /><p className="mt-3 text-base font-semibold">Choose a product group</p><p className="mt-1 max-w-xs text-sm text-muted-foreground">Hover a category to explore its product groups and subcategories.</p></div>}
        </div>
      </div>
      <div className="flex items-center justify-between border-t bg-muted/20 px-5 py-3 text-sm"><span className="text-muted-foreground">Need help choosing?</span><Link role="menuitem" href="/store-locator" onClick={close} className="font-semibold text-primary hover:underline">Talk to an expert</Link></div>
    </div> : null}
  </div>;
}
