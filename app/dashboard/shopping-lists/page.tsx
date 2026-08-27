"use client";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Filter,
  Pencil,
  Plus,
  Search,
  Settings2,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type ShoppingList = {
  name: string;
  label: string;
  products: number;
  type: "Personal" | "Shared";
  activity: string;
  owner: string;
};
const INITIAL: ShoppingList[] = [
  {
    name: "HVAC maintenance kit",
    label: "Preventative",
    products: 12,
    type: "Personal",
    activity: "Today",
    owner: "David Whiteside",
  },
  {
    name: "Blower motor replacements",
    label: "Job supplies",
    products: 4,
    type: "Personal",
    activity: "Yesterday",
    owner: "David Whiteside",
  },
  {
    name: "Frequently ordered parts",
    label: "",
    products: 18,
    type: "Shared",
    activity: "Aug 22, 2026",
    owner: "David Whiteside",
  },
];
const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#facc15",
  "#4ade80",
  "#60a5fa",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
];
export default function ShoppingListsPage() {
  const [q, setQ] = useState("");
  const [create, setCreate] = useState(false);
  const [labelModal, setLabelModal] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [selected, setSelected] = useState("");
  const [color, setColor] = useState(COLORS[4]);
  const [labels, setLabels] = useState([
    "Preventative",
    "Job supplies",
    "Project",
  ]);
  const [lists, setLists] = useState(INITIAL);
  const filtered = useMemo(
    () => lists.filter((x) => x.name.toLowerCase().includes(q.toLowerCase())),
    [lists, q],
  );
  const makeList = () => {
    if (!name.trim()) return;
    setLists((x) => [
      {
        name: name.trim(),
        label: selected,
        products: 0,
        type: "Personal",
        activity: "Just now",
        owner: "David Whiteside",
      },
      ...x,
    ]);
    setName("");
    setDescription("");
    setSelected("");
    setCreate(false);
  };
  const openLabel = (t: string | null) => {
    setTarget(t);
    setNewLabel("");
    setLabelModal(true);
    setMenu(null);
  };
  const makeLabel = () => {
    if (!newLabel.trim()) return;
    const l = newLabel.trim();
    setLabels((x) => (x.includes(l) ? x : [...x, l]));
    if (target)
      setLists((x) =>
        x.map((v) => (v.name === target ? { ...v, label: l } : v)),
      );
    setSelected(l);
    setLabelModal(false);
    setTarget(null);
  };
  const assign = (n: string, l: string) => {
    setLists((x) => x.map((v) => (v.name === n ? { ...v, label: l } : v)));
    setMenu(null);
  };
  return (
    <DashboardShell title="Shopping Lists" description="Create, organize, and share the products your team orders most." actions={<button
      className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => setCreate(true)}
    >
      <Plus size={16} />
      Create list
    </button>}>
      <div className="space-y-3">
        <section className="rounded-lg border bg-background shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b p-4">
            <label className="relative min-w-[240px] flex-1">
              <Search
                size={16}
                className="absolute left-3 top-3.5 text-muted-foreground"
              />
              <input
                className="h-11 w-full rounded-md border pl-9 pr-3 text-sm"
                placeholder="Search lists by name…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm">
              <Filter size={16} />
              Filter
              <ChevronDown size={15} />
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm">
              <Tag size={16} />
              Group by label
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm">
              <Settings2 size={16} />
              Sort
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13px]">
              <thead>
                <tr className="border-b bg-muted/30 text-muted-foreground">
                  <th className="w-[24%] px-5 py-3 font-medium text-[11px]">Name</th>
                  <th className="px-5 py-3 font-medium text-[11px]">Label</th>
                  <th className="px-5 py-3 font-medium text-[11px]">Products</th>
                  <th className="px-5 py-3 font-medium text-[11px]">Type</th>
                  <th className="px-5 py-3 font-medium text-[11px]">Latest activity</th>
                  <th className="px-5 py-3 font-medium text-[11px]">Created by</th>
                  <th className="px-5 py-3 font-medium text-[11px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.name} className="border-b last:border-0">
                    <td className="px-5 py-3 font-medium">
                      <span className="flex items-start gap-3">
                        <span aria-hidden="true" className="shrink-0 text-primary">⠿</span>
                        <span>{v.name}</span>
                      </span>
                    </td>
                    <td className="relative px-5 py-3">
                      <button
                        className="inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground hover:bg-muted"
                        onClick={() => setMenu(menu === v.name ? null : v.name)}
                      >
                        <Tag size={16} />
                        {v.label || "Add label"}
                      </button>
                      {menu === v.name && (
                        <div className="absolute left-4 top-16 z-20 w-56 rounded-md border bg-background p-1 shadow-lg">
                          {labels.map((l) => (
                            <button
                              key={l}
                              className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
                              onClick={() => assign(v.name, l)}
                            >
                              {l}
                            </button>
                          ))}
                          <button
                            className="flex w-full items-center gap-2 border-t px-3 py-2 text-left text-sm font-medium text-primary"
                            onClick={() => openLabel(v.name)}
                          >
                            <Plus size={15} />
                            Create new label
                          </button>
                          {v.label && (
                            <button
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted-foreground"
                              onClick={() => assign(v.name, "")}
                            >
                              <X size={15} />
                              Remove label
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">{v.products}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full border px-2.5 py-1 text-xs">
                        {v.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {v.activity}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {v.owner}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        aria-label={`Edit ${v.name}`}
                        className="rounded p-2 hover:bg-muted"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        aria-label={`Delete ${v.name}`}
                        className="ml-1 rounded p-2 hover:bg-muted"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <div className="p-12 text-center text-muted-foreground">
              No shopping lists found.
            </div>
          )}
          <div className="flex items-center justify-center gap-2 p-5 text-sm text-muted-foreground">
            <CheckCircle2 size={18} />
            No more lists to load
          </div>
        </section>
      </div>
      {create && (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4"
          onMouseDown={() => setCreate(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-list-title"
            className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4">
              <h2 id="create-list-title" className="text-xl font-semibold">
                Create list
              </h2>
              <button aria-label="Close" onClick={() => setCreate(false)}>
                <X />
              </button>
            </div>
            <div className="space-y-4 py-5">
              <label className="block text-sm font-medium">
                Name <span className="text-destructive">*</span>
                <input
                  autoFocus
                  className="mt-2 h-11 w-full rounded-md border px-3"
                  placeholder="Enter list name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Description
                <textarea
                  className="mt-2 min-h-24 w-full rounded-md border p-3"
                  placeholder="Enter list description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <div>
                <label className="text-sm font-medium">Label</label>
                <div className="mt-2 flex gap-2">
                  <Select value={selected || "none"} onValueChange={(value) => setSelected(value === "none" ? "" : value)}>
                    <SelectTrigger className="h-11 w-full flex-1"><SelectValue placeholder="No label" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No label</SelectItem>
                      {labels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <button
                    className="min-h-11 rounded-md border px-3 text-sm"
                    onClick={() => openLabel(null)}
                  >
                    New label
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="min-h-11 rounded-md px-4 text-sm"
                onClick={() => setCreate(false)}
              >
                Cancel
              </button>
              <button
                className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                disabled={!name.trim()}
                onClick={makeList}
              >
                Save
              </button>
            </div>
          </section>
        </div>
      )}
      {labelModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onMouseDown={() => setLabelModal(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-label-title"
            className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 id="new-label-title" className="text-xl font-semibold">
                  Create new label
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a new label to organize your products.
                </p>
              </div>
              <button aria-label="Close" onClick={() => setLabelModal(false)}>
                <X />
              </button>
            </div>
            <label className="mt-5 block text-sm font-medium">
              Label <span className="text-destructive">*</span>
              <input
                autoFocus
                className="mt-2 h-12 w-full rounded-md border px-3"
                placeholder="Enter label name"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </label>
            <fieldset className="mt-5">
              <legend className="text-sm font-medium">
                Color <span className="text-destructive">*</span>
              </legend>
              <div className="mt-3 flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Choose ${c}`}
                    className={`h-9 w-9 rounded-md ${color === c ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </fieldset>
            <div className="mt-7 flex justify-end gap-3">
              <button
                className="min-h-11 rounded-md px-4 text-sm"
                onClick={() => setLabelModal(false)}
              >
                Cancel
              </button>
              <button
                className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                disabled={!newLabel.trim()}
                onClick={makeLabel}
              >
                Save
              </button>
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
