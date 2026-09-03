"use client";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Pencil,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { AccountTableToolbar, accountTable } from "../_components/account-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
type ShoppingList = {
  name: string;
  label: string;
  products: number;
  type: "Personal" | "Shared";
  activity: string;
  owner: string;
};
type ListLabel = {
  name: string;
  color: string | null;
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
const INITIAL_LABELS: ListLabel[] = [
  { name: "Preventative", color: "#60a5fa" },
  { name: "Job supplies", color: "#f59e0b" },
  { name: "Project", color: "#8b5cf6" },
];
function LabelDot({ color }: { color: string | null }) {
  return (
    <span
      aria-hidden="true"
      className="size-2.5 shrink-0 rounded-full border border-current/30"
      style={{ backgroundColor: color ?? "transparent" }}
    />
  );
}
function LabelPill({ label, fallback }: { label?: ListLabel; fallback: string }) {
  return (
    <Badge
      variant="outline"
      style={
        label?.color
          ? {
              backgroundColor: `${label.color}20`,
              borderColor: `${label.color}55`,
              color: label.color,
            }
          : undefined
      }
    >
      <LabelDot color={label?.color ?? null} />
      {label?.name ?? fallback}
    </Badge>
  );
}
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
  const [color, setColor] = useState<string | null>(COLORS[4]);
  const [labelMode, setLabelMode] = useState<"create" | "edit">("create");
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [labels, setLabels] = useState<ListLabel[]>(INITIAL_LABELS);
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
    setLabelMode("create");
    setEditingLabel(null);
    setNewLabel("");
    setColor(COLORS[4]);
    setLabelModal(true);
    setMenu(null);
  };
  const editLabel = (label: ListLabel) => {
    setTarget(null);
    setLabelMode("edit");
    setEditingLabel(label.name);
    setNewLabel(label.name);
    setColor(label.color);
    setLabelModal(true);
    setMenu(null);
  };
  const makeLabel = () => {
    if (!newLabel.trim()) return;
    const l = newLabel.trim();
    if (labelMode === "edit" && editingLabel) {
      setLabels((x) =>
        x.map((label) =>
          label.name === editingLabel ? { name: l, color } : label,
        ),
      );
      if (l !== editingLabel) {
        setLists((x) =>
          x.map((v) => (v.label === editingLabel ? { ...v, label: l } : v)),
        );
      }
    } else {
      setLabels((x) =>
        x.some((label) => label.name === l)
          ? x
          : [...x, { name: l, color }],
      );
      if (target)
        setLists((x) =>
          x.map((v) =>
            v.name === target ? { ...v, label: l } : v,
          ),
        );
    }
    setSelected(l);
    setLabelModal(false);
    setTarget(null);
    setEditingLabel(null);
  };
  const assign = (n: string, l: string) => {
    setLists((x) => x.map((v) => (v.name === n ? { ...v, label: l } : v)));
    setMenu(null);
  };
  return (
    <DashboardShell title="Shopping Lists" description="Create, organize, and share the products your team orders most." actions={<Button className="min-h-10" onClick={() => setCreate(true)}>
      <Plus size={16} />
      Create list
    </Button>}>
      <div className="space-y-3">
        <section className={accountTable.card}>
          <AccountTableToolbar
            value={q}
            onChange={setQ}
            placeholder="Search lists by name…"
          >
            <Button variant="outline" className="min-h-11">
              <Tag size={16} />
              Group by label
            </Button>
          </AccountTableToolbar>
          <div className={accountTable.scroll}>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-h-10 text-muted-foreground"
                        onClick={() => setMenu(menu === v.name ? null : v.name)}
                      >
                        <Tag size={16} />
                        {v.label ? (
                          <LabelPill label={labels.find((label) => label.name === v.label)} fallback={v.label} />
                        ) : "Add label"}
                      </Button>
                      {menu === v.name && (
                        <div className="absolute left-4 top-16 z-20 w-56 rounded-md border bg-background p-1 shadow-lg">
                          {labels.map((l) => (
                            <div key={l.name} className="flex items-center gap-1 rounded hover:bg-muted">
                              <button
                                className="flex min-h-10 flex-1 items-center gap-2 px-3 py-2 text-left text-sm"
                                onClick={() => assign(v.name, l.name)}
                              >
                                <LabelDot color={l.color} />
                                {l.name}
                              </button>
                              <button
                                type="button"
                                aria-label={`Edit ${l.name} label`}
                                className="mr-1 grid size-8 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
                                onClick={() => editLabel(l)}
                              >
                                <Pencil size={14} />
                              </button>
                            </div>
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
                      <Badge variant="outline">{v.type}</Badge>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {v.activity}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {v.owner}
                    </td>
                    <td className="px-5 py-3">
                      <Button variant="ghost" size="icon" aria-label={`Edit ${v.name}`}>
                        <Pencil size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Delete ${v.name}`} className="ml-1">
                        <Trash2 size={17} />
                      </Button>
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
          <div className={accountTable.footer}>
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
              <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setCreate(false)}>
                <X />
              </Button>
            </div>
            <div className="space-y-4 py-5">
              <label className="block text-sm font-medium">
                Name <span className="text-destructive">*</span>
                <Input
                  autoFocus
                  className="mt-2 h-11"
                  placeholder="Enter list name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Description
                <Textarea
                  className="mt-2 min-h-24"
                  placeholder="Enter list description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <div>
                <Label>Label</Label>
                <div className="mt-2 flex gap-2">
                  <Select value={selected || "none"} onValueChange={(value) => setSelected(value === "none" ? "" : value)}>
                    <SelectTrigger className="h-11 w-full flex-1"><SelectValue placeholder="No label" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No label</SelectItem>
                      {labels.map((l) => <SelectItem key={l.name} value={l.name}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={() => openLabel(null)}
                  >
                    New label
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                className="min-h-11"
                onClick={() => setCreate(false)}
              >
                Cancel
              </Button>
              <Button
                className="min-h-11"
                disabled={!name.trim()}
                onClick={makeList}
              >
                Save
              </Button>
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
                  {labelMode === "edit" ? "Edit label" : "Create new label"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {labelMode === "edit"
                    ? "Update the label name or color used across your lists."
                    : "Add a new label to organize your products."}
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setLabelModal(false)}>
                <X />
              </Button>
            </div>
            <label className="mt-5 block text-sm font-medium">
              Label <span className="text-destructive">*</span>
              <Input
                autoFocus
                className="mt-2 h-12"
                placeholder="Enter label name"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </label>
            <fieldset className="mt-5">
              <legend className="text-sm font-medium">
                Color <span className="text-muted-foreground">(optional)</span>
              </legend>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  aria-label="Remove label color"
                  className={`grid h-9 w-9 place-items-center rounded-md border bg-muted text-xs text-muted-foreground ${color === null ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                  onClick={() => setColor(null)}
                >
                  <X size={15} />
                </button>
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
              <Button
                variant="ghost"
                className="min-h-11"
                onClick={() => setLabelModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="min-h-11"
                disabled={!newLabel.trim()}
                onClick={makeLabel}
              >
                {labelMode === "edit" ? "Update label" : "Save"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
