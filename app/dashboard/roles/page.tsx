"use client";

import { useState } from "react";
import { Copy, Lock, MoreHorizontal, Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─────────────────────────── Permission model ───────────────────────────
 * Capabilities are grouped; each role stores the set of granted permission ids.
 * The Create / Edit drawer renders the groups as a matrix of checkbox rows. */
type PermissionId =
  | "orders.view"
  | "orders.place"
  | "orders.approve"
  | "orders.reorder"
  | "pricing.view"
  | "pricing.hide"
  | "lists.view"
  | "lists.edit"
  | "lists.share"
  | "company.users"
  | "company.roles"
  | "company.accounts"
  | "quotes.view"
  | "quotes.request";

type PermissionItem = { id: PermissionId; label: string; hint: string };
type PermissionGroup = { title: string; items: PermissionItem[] };

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    title: "Orders",
    items: [
      { id: "orders.view", label: "View orders", hint: "See order history and details" },
      { id: "orders.place", label: "Place orders", hint: "Check out and submit orders" },
      { id: "orders.approve", label: "Approve orders", hint: "Approve orders over the spend limit" },
      { id: "orders.reorder", label: "Reorder", hint: "Reorder from past orders" },
    ],
  },
  {
    title: "Pricing",
    items: [
      { id: "pricing.view", label: "View pricing", hint: "Show account pricing across the site" },
      { id: "pricing.hide", label: "Hide prices", hint: "Mask prices from this role" },
    ],
  },
  {
    title: "Lists & Carts",
    items: [
      { id: "lists.view", label: "View lists", hint: "See shopping lists and saved carts" },
      { id: "lists.edit", label: "Create/edit lists", hint: "Add, rename and remove list items" },
      { id: "lists.share", label: "Share lists", hint: "Share lists with other users" },
    ],
  },
  {
    title: "Company",
    items: [
      { id: "company.users", label: "Manage users", hint: "Invite, edit and deactivate users" },
      { id: "company.roles", label: "Manage roles", hint: "Create and edit roles and permissions" },
      { id: "company.accounts", label: "Manage linked accounts", hint: "Link and unlink branch accounts" },
    ],
  },
  {
    title: "Quotes",
    items: [
      { id: "quotes.view", label: "View quotes", hint: "See quotes and their status" },
      { id: "quotes.request", label: "Request quotes", hint: "Ask a branch for a quote" },
    ],
  },
];

const ALL_PERMISSIONS: PermissionId[] = PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.id));

type Role = {
  id: string;
  name: string;
  users: number;
  permissions: PermissionId[];
};

const INITIAL_ROLES: Role[] = [
  { id: "r1", name: "Admin", users: 1, permissions: ALL_PERMISSIONS.filter((p) => p !== "pricing.hide") },
  {
    id: "r2",
    name: "Buyer",
    users: 2,
    permissions: [
      "orders.view", "orders.place", "orders.reorder", "pricing.view",
      "lists.view", "lists.edit", "lists.share", "quotes.view", "quotes.request",
    ],
  },
  {
    id: "r3",
    name: "Buyer (hide prices)",
    users: 0,
    permissions: [
      "orders.view", "orders.place", "orders.reorder", "pricing.hide",
      "lists.view", "lists.edit", "quotes.view", "quotes.request",
    ],
  },
  {
    id: "r4",
    name: "Manager",
    users: 8,
    permissions: [
      "orders.view", "orders.place", "orders.approve", "orders.reorder", "pricing.view",
      "lists.view", "lists.edit", "lists.share", "company.users", "quotes.view", "quotes.request",
    ],
  },
  { id: "r5", name: "Viewer", users: 0, permissions: ["orders.view", "pricing.view", "lists.view", "quotes.view"] },
];

const PAGE_SIZES = [18, 36, 54] as const;

type DrawerState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; role: Role };

/* ── Create / edit role drawer — name + permission matrix. ── */
function RoleDrawer({
  state,
  onClose,
  onSave,
}: {
  state: DrawerState;
  onClose: () => void;
  onSave: (name: string, permissions: PermissionId[], id: string | null) => void;
}) {
  const open = state.mode !== "closed";
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        drawerSide="right"
        className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]"
      >
        {state.mode !== "closed" ? (
          <RoleDrawerBody
            // Remount per target so the form resets cleanly.
            key={state.mode === "edit" ? state.role.id : "create"}
            state={state}
            onClose={onClose}
            onSave={onSave}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RoleDrawerBody({
  state,
  onClose,
  onSave,
}: {
  state: Exclude<DrawerState, { mode: "closed" }>;
  onClose: () => void;
  onSave: (name: string, permissions: PermissionId[], id: string | null) => void;
}) {
  const editing = state.mode === "edit";
  const [name, setName] = useState(state.mode === "edit" ? state.role.name : "");
  const [granted, setGranted] = useState<Set<PermissionId>>(
    new Set(state.mode === "edit" ? state.role.permissions : []),
  );

  const toggle = (id: PermissionId, on: boolean) =>
    setGranted((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const toggleGroup = (group: PermissionGroup, on: boolean) =>
    setGranted((prev) => {
      const next = new Set(prev);
      group.items.forEach((i) => (on ? next.add(i.id) : next.delete(i.id)));
      return next;
    });

  const valid = name.trim() !== "";

  return (
    <>
      <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <DialogTitle>{editing ? `Edit permissions — ${state.role.name}` : "Create Role"}</DialogTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {granted.size} of {ALL_PERMISSIONS.length} permissions granted
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

      <form
        id="role-form"
        className="space-y-6 px-5 py-5 sm:px-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          onSave(name.trim(), ALL_PERMISSIONS.filter((p) => granted.has(p)), editing ? state.role.id : null);
        }}
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Role name</span>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
            autoComplete="off"
            aria-label="Role name"
          />
        </label>

        {/* Permission matrix */}
        <div className="space-y-5">
          {PERMISSION_GROUPS.map((group) => {
            const count = group.items.filter((i) => granted.has(i.id)).length;
            const allOn = count === group.items.length;
            return (
              <fieldset key={group.title}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <legend className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {group.title}
                  </legend>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group, !allOn)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {allOn ? "Clear all" : "Select all"}
                  </button>
                </div>
                <ul className="divide-y rounded-lg border">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 px-4 py-3 hover:bg-muted/40">
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{item.label}</span>
                          <span className="block text-xs text-muted-foreground">{item.hint}</span>
                        </span>
                        <Checkbox
                          checked={granted.has(item.id)}
                          onCheckedChange={(v) => toggle(item.id, v === true)}
                          aria-label={item.label}
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            );
          })}
        </div>
      </form>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
        <Button type="button" variant="outline" className="min-h-11" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="role-form" className="min-h-11" disabled={!valid}>
          Save role
        </Button>
      </div>
    </>
  );
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [perPage, setPerPage] = useState<number>(18);
  const [drawer, setDrawer] = useState<DrawerState>({ mode: "closed" });

  const visible = roles.slice(0, perPage);

  const handleSave = (name: string, permissions: PermissionId[], id: string | null) => {
    setRoles((prev) =>
      id
        ? prev.map((r) => (r.id === id ? { ...r, name, permissions } : r))
        : [...prev, { id: `r${Date.now()}`, name, users: 0, permissions }],
    );
    setDrawer({ mode: "closed" });
  };

  const duplicate = (role: Role) =>
    setRoles((prev) => [
      ...prev,
      { ...role, id: `r${Date.now()}`, name: `${role.name} (copy)`, users: 0 },
    ]);

  const remove = (role: Role) => setRoles((prev) => prev.filter((r) => r.id !== role.id));

  return (
    <DashboardShell
      title="Roles & Permissions"
      actions={
        <Button className="min-h-11" onClick={() => setDrawer({ mode: "create" })}>
          <Plus size={16} />
          Create Role
        </Button>
      }
    >
      <section className={accountTable.card}>
        <div className={accountTable.scroll}>
          <table className={`${accountTable.table} min-w-[520px]`}>
            <thead>
              <tr className={accountTable.headRow}>
                <th className={accountTable.headCell}>Role</th>
                <th className={accountTable.headCell}>Users</th>
                <th className={`${accountTable.headCell} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const Icon = r.name === "Admin" ? ShieldCheck : Lock;
                return (
                  <tr key={r.id} className={accountTable.row}>
                    <td className={accountTable.cell}>
                      <button
                        type="button"
                        onClick={() => setDrawer({ mode: "edit", role: r })}
                        className="inline-flex items-center gap-2.5 font-semibold text-primary hover:underline"
                      >
                        <Icon size={16} aria-hidden="true" className="shrink-0 text-muted-foreground" />
                        {r.name}
                      </button>
                    </td>
                    <td className={`${accountTable.cell} tabular-nums`}>{r.users}</td>
                    <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${r.name}`}>
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="min-h-11"
                            onSelect={() => setDrawer({ mode: "edit", role: r })}
                          >
                            <Pencil size={15} /> Edit permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="min-h-11" onSelect={() => duplicate(r)}>
                            <Copy size={15} /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="min-h-11 text-destructive focus:text-destructive"
                            onSelect={() => remove(r)}
                          >
                            <Trash2 size={15} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <div className="p-12 text-center text-muted-foreground">No roles found.</div>
        )}
        {/* Pagination — "Show 18 / 36 / 54 Per page" */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
          <span>
            {visible.length} role{visible.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <span>Show</span>
            {PAGE_SIZES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPerPage(n)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  perPage === n
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:bg-accent"
                }`}
              >
                {n}
              </button>
            ))}
            <span>Per page</span>
          </div>
        </div>
      </section>

      <RoleDrawer
        state={drawer}
        onClose={() => setDrawer({ mode: "closed" })}
        onSave={handleSave}
      />
    </DashboardShell>
  );
}
