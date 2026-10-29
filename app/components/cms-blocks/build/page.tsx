"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowDown, X, Plus, Trash2, Eye, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CMS_CATEGORIES, Preview } from "../cms-catalog";
import { FullBlock, FULL_BLEED } from "../cms-blocks-full";

type Item = { id: string; name: string; label: string };
const STORAGE_KEY = "watsco-cms-builder-v1";
const uid = () => Math.random().toString(36).slice(2, 9);

export default function BuildPage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [preview, setPreview] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // Restore / persist the composed page.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);
  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = (name: string, label: string) => setItems((p) => [...p, { id: uid(), name, label }]);
  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const move = (id: string, dir: -1 | 1) =>
    setItems((p) => {
      const idx = p.findIndex((i) => i.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= p.length) return p;
      const copy = [...p];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });

  return (
    <div className="min-h-svh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/components/cms-blocks" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="size-4" aria-hidden />
            Catalog
          </Link>
          <h1 className="text-lg font-bold tracking-tight">Build a Page</h1>
          <span className="text-sm text-muted-foreground">{items.length} block{items.length === 1 ? "" : "s"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreview((v) => !v)} disabled={!items.length} className="text-foreground">
            {preview ? <Pencil className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setItems([])}
            disabled={!items.length}
            className="text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
            Clear
          </Button>
        </div>
      </header>

      {preview ? (
        /* ── Clean render of the composed page ── */
        <RenderedPage items={items} />
      ) : (
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[280px_1fr] md:px-6">
          {/* Palette */}
          <aside className="h-fit md:sticky md:top-20">
            <p className="mb-2 text-sm font-semibold">Blocks</p>
            <div className="max-h-[75svh] space-y-4 overflow-y-auto rounded-xl border bg-card p-3">
              {CMS_CATEGORIES.map((cat) => (
                <div key={cat.id}>
                  <p className="px-1 pb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{cat.title}</p>
                  <div className="space-y-1.5">
                    {cat.blocks.map((b) => (
                      <button
                        key={b.name}
                        type="button"
                        onClick={() => add(b.name, b.label)}
                        className="group flex w-full items-center gap-2 rounded-lg border bg-background px-2.5 py-2 text-left text-sm transition hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-md border bg-card">
                          <span className="scale-[0.4]">
                            <span className="block w-40">
                              <Preview name={b.name} />
                            </span>
                          </span>
                        </span>
                        <span className="min-w-0 flex-1 truncate">{b.label}</span>
                        <Plus className="size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" aria-hidden />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Canvas */}
          <div>
            <p className="mb-2 text-sm font-semibold">Your page</p>
            {!items.length ? (
              <div className="grid min-h-[60svh] place-items-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
                <div>
                  <p className="font-medium">Start building</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click blocks on the left to stack them here. Reorder with the arrows, then hit Preview.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((it, i) => (
                  <li key={it.id} className="overflow-hidden rounded-xl border bg-card">
                    <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span className="grid size-5 place-items-center rounded bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                        {it.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconBtn label="Move up" onClick={() => move(it.id, -1)} disabled={i === 0}>
                          <ArrowUp className="size-4" />
                        </IconBtn>
                        <IconBtn label="Move down" onClick={() => move(it.id, 1)} disabled={i === items.length - 1}>
                          <ArrowDown className="size-4" />
                        </IconBtn>
                        <IconBtn label="Remove" onClick={() => remove(it.id)}>
                          <X className="size-4" />
                        </IconBtn>
                      </span>
                    </div>
                    <div className="bg-background p-5">
                      <FullBlock name={it.name} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-7 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  );
}

/* The composed page, rendered clean — each block in a page section, honoring
   full-bleed blocks. This is the "Go" result: a real sample landing page. */
function RenderedPage({ items }: { items: Item[] }) {
  return (
    <div className="pb-16">
      {items.map((it) => {
        const bleed = FULL_BLEED.has(it.name);
        return (
          <section key={it.id} className={cn("py-10", bleed ? "" : "px-4 md:px-6")}>
            <div className={cn(bleed ? "" : "mx-auto max-w-5xl")}>
              <FullBlock name={it.name} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
