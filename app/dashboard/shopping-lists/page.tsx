"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { AccountTableToolbar, accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─────────────────────────── List data ───────────────────────────
 * Columns: Name · Label · Products · Type · Latest Activity · Created By ·
 * Actions. `id` is the route segment for /dashboard/shopping-lists/[id]. */
type ListType = "Personal" | "Shared";
type ShoppingList = {
  id: string;
  name: string;
  description: string;
  label: string;
  products: number;
  type: ListType;
  activity: string;
  createdBy: string;
};

const LABELS = ["Preventative", "Job supplies", "Project"] as const;
const NO_LABEL = "none";
const NO_LABEL_GROUP = "No label";

const INITIAL_LISTS: ShoppingList[] = [
  {
    id: "hvac-maintenance-kit",
    name: "HVAC maintenance kit",
    description: "Filters, capacitors and contactors for seasonal tune-ups.",
    label: "Preventative",
    products: 5,
    type: "Personal",
    activity: "Today",
    createdBy: "David Whiteside",
  },
  {
    id: "blower-motor-replacements",
    name: "Blower motor replacements",
    description: "ECM and PSC blower motors we swap most often.",
    label: "Job supplies",
    products: 4,
    type: "Personal",
    activity: "Yesterday",
    createdBy: "David Whiteside",
  },
  {
    id: "frequently-ordered-parts",
    name: "Frequently ordered parts",
    description: "Shared reorder list for the whole crew.",
    label: "",
    products: 18,
    type: "Shared",
    activity: "Aug 22, 2026",
    createdBy: "David Whiteside",
  },
  {
    id: "rooftop-unit-startup",
    name: "Rooftop unit startup",
    description: "Everything for commercial RTU commissioning.",
    label: "Project",
    products: 9,
    type: "Shared",
    activity: "Aug 14, 2026",
    createdBy: "Maria Alvarez",
  },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ── Create / edit list drawer (right side, same shell as Orders) ── */
type ListDraft = { name: string; description: string; label: string };
const EMPTY_DRAFT: ListDraft = { name: "", description: "", label: "" };

function ListDrawer({
  open,
  editing,
  draft,
  setDraft,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: boolean;
  draft: ListDraft;
  setDraft: (d: ListDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const valid = draft.name.trim().length > 0;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        drawerSide="right"
        className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]"
      >
        <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <DialogTitle>{editing ? "Edit list" : "Create list"}</DialogTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {editing
                ? "Update the name, description or label."
                : "Organize the products your team orders most."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </span>
            <Input
              className="h-11"
              placeholder="Enter list name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Description</span>
            <Textarea
              className="min-h-24"
              placeholder="Enter list description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </label>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Label</span>
            <Select
              value={draft.label || NO_LABEL}
              onValueChange={(v) => setDraft({ ...draft, label: v === NO_LABEL ? "" : v })}
            >
              <SelectTrigger className="h-11 w-full" aria-label="Label">
                <SelectValue placeholder="No label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_LABEL}>No label</SelectItem>
                {LABELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
          <Button variant="outline" className="min-h-11" onClick={onClose}>
            Cancel
          </Button>
          <Button className="min-h-11" disabled={!valid} onClick={onSave}>
            {editing ? "Save changes" : "Create list"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ShoppingListsPage() {
  const [lists, setLists] = useState<ShoppingList[]>(INITIAL_LISTS);
  const [q, setQ] = useState("");
  const [grouped, setGrouped] = useState(false);
  const [perPage, setPerPage] = useState(18);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ListDraft>(EMPTY_DRAFT);

  const filtered = useMemo(() => {
    const base = lists.filter((l) => l.name.toLowerCase().includes(q.trim().toLowerCase()));
    return grouped
      ? [...base].sort((a, b) =>
          (a.label || "￿").localeCompare(b.label || "￿"),
        )
      : base;
  }, [lists, q, grouped]);
  const visible = filtered.slice(0, perPage);

  const openCreate = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setDrawerOpen(true);
  };
  const openEdit = (l: ShoppingList) => {
    setEditingId(l.id);
    setDraft({ name: l.name, description: l.description, label: l.label });
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const save = () => {
    const name = draft.name.trim();
    if (!name) return;
    if (editingId) {
      setLists((xs) =>
        xs.map((l) =>
          l.id === editingId
            ? { ...l, name, description: draft.description, label: draft.label }
            : l,
        ),
      );
    } else {
      setLists((xs) => [
        {
          id: slugify(name) || `list-${xs.length + 1}`,
          name,
          description: draft.description,
          label: draft.label,
          products: 0,
          type: "Personal",
          activity: "Just now",
          createdBy: "David Whiteside",
        },
        ...xs,
      ]);
    }
    setDrawerOpen(false);
  };
  const remove = (id: string) => setLists((xs) => xs.filter((l) => l.id !== id));

  return (
    <DashboardShell
      title="Shopping Lists"
      description="Create, organize, and share the products your team orders most."
      actions={
        <Button className="min-h-11" onClick={openCreate}>
          <Plus size={16} />
          Create List
        </Button>
      }
    >
      <div className="space-y-4">
        <section className={accountTable.card}>
          <AccountTableToolbar
            value={q}
            onChange={setQ}
            placeholder="Search product lists by name"
          >
            <Button
              variant={grouped ? "secondary" : "outline"}
              className="min-h-11"
              aria-pressed={grouped}
              onClick={() => setGrouped((g) => !g)}
            >
              <Tag size={16} />
              Group by Label
            </Button>
          </AccountTableToolbar>

          <div className={accountTable.scroll}>
            <table className={`${accountTable.table} min-w-[860px]`}>
              <thead>
                <tr className={accountTable.headRow}>
                  <th className={accountTable.headCell}>Name</th>
                  <th className={accountTable.headCell}>Label</th>
                  <th className={accountTable.headCell}>Products</th>
                  <th className={accountTable.headCell}>Type</th>
                  <th className={accountTable.headCell}>Latest Activity</th>
                  <th className={accountTable.headCell}>Created By</th>
                  <th className={`${accountTable.headCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((l, i) => {
                  const groupName = l.label || NO_LABEL_GROUP;
                  const prevGroup = i > 0 ? visible[i - 1].label || NO_LABEL_GROUP : null;
                  const showGroup = grouped && groupName !== prevGroup;
                  return (
                    <Fragment key={l.id}>
                      {showGroup && (
                        <tr className="border-b bg-muted/20">
                          <td
                            colSpan={7}
                            className="px-5 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                          >
                            {groupName}
                          </td>
                        </tr>
                      )}
                      <tr className={accountTable.row}>
                        <td className={accountTable.cell}>
                          <Link
                            href={`/dashboard/shopping-lists/${l.id}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {l.name}
                          </Link>
                        </td>
                        <td className={accountTable.cell}>
                          {l.label ? (
                            <Badge variant="secondary">{l.label}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className={`${accountTable.cell} tabular-nums`}>{l.products}</td>
                        <td className={accountTable.cell}>
                          <Badge variant={l.type === "Shared" ? "secondary" : "outline"}>
                            {l.type}
                          </Badge>
                        </td>
                        <td className={`${accountTable.cell} whitespace-nowrap text-muted-foreground`}>
                          {l.activity}
                        </td>
                        <td className={`${accountTable.cell} whitespace-nowrap`}>{l.createdBy}</td>
                        <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${l.name}`}
                            onClick={() => openEdit(l)}
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${l.name}`}
                            className="ml-1 text-destructive hover:text-destructive/80"
                            onClick={() => remove(l.id)}
                          >
                            <Trash2 size={17} />
                          </Button>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <div className="p-12 text-center text-muted-foreground">No shopping lists found.</div>
          )}
          {/* Pagination — matches the reference "Show 18 / 36 / 54 Per page" */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
            <span>
              {filtered.length} list{filtered.length === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-2">
              <span>Show</span>
              {[18, 36, 54].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPerPage(n)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    perPage === n ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span>Per page</span>
            </div>
          </div>
        </section>
      </div>

      <ListDrawer
        open={drawerOpen}
        editing={editingId !== null}
        draft={draft}
        setDraft={setDraft}
        onClose={closeDrawer}
        onSave={save}
      />
    </DashboardShell>
  );
}
