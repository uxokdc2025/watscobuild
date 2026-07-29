"use client";

import * as React from "react";
import { MessageSquarePlus, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type QA = { id: string; q: string; a: string; custom?: boolean };

const STORAGE_KEY = "watsco-pdp-open-questions";

// Seeded design questions — the client / David can answer inline or add more.
const DEFAULTS: QA[] = [
  {
    id: "sections",
    q: 'Section treatment — do content sections need H2 headings (e.g. "About This Product", "Frequently Bought Together"), or do we use the tabbed / first-column approach?',
    a: "",
  },
  {
    id: "box-fill",
    q: "Should the related-product image tiles (Frequently Bought / Parts) have a white fill background?",
    a: "",
  },
  {
    id: "compare",
    q: 'Where should "Compare" live, and what weight?',
    a: 'Current: a low-emphasis ghost button directly under "Save to List" (toggles to "✓ Comparing"). Open to moving it or making it a checkbox on cards.',
  },
  {
    id: "packsize",
    q: "Pack-size control — segmented control or pills? Some BUs only have 1–2 options (Each, 12-pk). Consider pills.",
    a: "",
  },
  {
    id: "gating",
    q: 'Do we need "Sign in" copy on the button as well as inline?',
    a: "",
  },
];

export function OpenQuestions() {
  const [items, setItems] = React.useState<QA[]>(DEFAULTS);
  const [draft, setDraft] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);

  // Load saved answers / custom items and merge over the current defaults.
  React.useEffect(() => {
    try {
      const saved: QA[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (saved.length) {
        const byId = Object.fromEntries(saved.map((s) => [s.id, s]));
        const merged = DEFAULTS.map((d) => (byId[d.id] ? { ...d, a: byId[d.id].a } : d));
        const customs = saved.filter((s) => s.custom);
        setItems([...merged, ...customs]);
      }
    } catch {
      /* ignore malformed storage */
    }
    setLoaded(true);
  }, []);

  const persist = (next: QA[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage may be unavailable */
    }
  };

  const setAnswer = (id: string, a: string) =>
    persist(items.map((it) => (it.id === id ? { ...it, a } : it)));

  const addItem = () => {
    const q = draft.trim();
    if (!q) return;
    persist([...items, { id: `c-${items.length}-${q.slice(0, 8)}`, q, a: "", custom: true }]);
    setDraft("");
  };

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setItems(DEFAULTS);
  };

  return (
    <section aria-label="Open questions" className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Open questions & design decisions
        </h2>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Answer inline or add your own. Notes save in this browser
        {loaded ? "" : "…"} — for shared, cross-user comments we&apos;d wire a
        small backend.
      </p>

      <ol className="mt-4 flex flex-col gap-3">
        {items.map((it, i) => (
          <li key={it.id} className="rounded-xl border bg-card p-4">
            <div className="flex gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{it.q}</p>
                <textarea
                  value={it.a}
                  onChange={(e) => setAnswer(it.id, e.target.value)}
                  placeholder="Add an answer or comment…"
                  rows={it.a ? 3 : 1}
                  className="mt-2 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem();
          }}
          placeholder="Add a question or note…"
          className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
        <Button onClick={addItem} className="h-10">
          <MessageSquarePlus className="size-4" />
          Add
        </Button>
      </div>
    </section>
  );
}
