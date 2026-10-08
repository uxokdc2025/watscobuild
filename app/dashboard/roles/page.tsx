"use client";

import { useState } from "react";
import { Eye, Lock, Plus, ShieldCheck, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─────────────────────────── Permission model ───────────────────────────
 * Capabilities are grouped; each role stores the set of granted permission ids.
 * The Create / Edit drawer renders the groups as a matrix of checkbox rows. */
type PermissionId = string;

type PermissionItem = { id: PermissionId; label: string; hint?: string };
type PermissionGroup = { title: string; items: PermissionItem[] };

/* Permission tree mirrors the reference role editor exactly. */
const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    title: "Employee management",
    items: [
      { id: "emp.view", label: "View employees" },
      { id: "emp.edit", label: "Edit employees" },
      { id: "emp.create", label: "Create employees" },
      { id: "emp.delete", label: "Delete employees" },
    ],
  },
  {
    title: "Role management",
    items: [
      { id: "role.view", label: "View roles" },
      { id: "role.edit", label: "Edit roles" },
      { id: "role.create", label: "Create roles" },
      { id: "role.delete", label: "Delete roles" },
    ],
  },
  {
    title: "Orders",
    items: [
      { id: "orders.viewOwn", label: "View own orders" },
      { id: "orders.viewOrg", label: "View all orders from assigned organisation unit" },
      { id: "orders.viewAll", label: "View all orders" },
    ],
  },
  {
    title: "Approval Rule Management",
    items: [
      { id: "approvalRules.create", label: "Create approval rules" },
      { id: "approvalRules.edit", label: "Edit approval rules" },
      { id: "approvalRules.delete", label: "Delete approval rules" },
      { id: "approvalRules.view", label: "View approval rules" },
    ],
  },
  {
    title: "Pending Order Management",
    items: [
      { id: "pending.approveAssigned", label: "Approve and decline assigned pending orders" },
      { id: "pending.viewAll", label: "View all pending orders" },
      { id: "pending.approveAny", label: "Approve and decline any pending orders" },
    ],
  },
  {
    title: "Pricing",
    items: [{ id: "pricing.see", label: "See pricing" }],
  },
  {
    title: "Company accounts",
    items: [
      { id: "accounts.view", label: "View linked accounts" },
      { id: "accounts.creditRead", label: "credit.read" },
      { id: "accounts.link", label: "Link and unlink accounts" },
    ],
  },
  {
    title: "Features",
    items: [
      { id: "features.rewards", label: "View rewards" },
      { id: "features.invoices", label: "View invoices and statements" },
      { id: "features.lists", label: "View lists" },
      { id: "features.manageLists", label: "Create and manage lists" },
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

const BUYER_PERMS = [
  "emp.view", "orders.viewOrg", "orders.viewAll", "pricing.see",
  "accounts.view", "features.lists", "features.manageLists",
];

const INITIAL_ROLES: Role[] = [
  { id: "r1", name: "Admin", users: 1, permissions: ALL_PERMISSIONS },
  { id: "r2", name: "Buyer", users: 2, permissions: BUYER_PERMS },
  { id: "r3", name: "Buyer (hide prices)", users: 0, permissions: BUYER_PERMS.filter((p) => p !== "pricing.see") },
  {
    id: "r4",
    name: "Manager",
    users: 8,
    permissions: [
      "emp.view", "emp.edit", "role.view",
      "orders.viewOwn", "orders.viewOrg", "orders.viewAll",
      "approvalRules.view", "pending.viewAll", "pending.approveAssigned",
      "pricing.see", "accounts.view", "features.lists", "features.manageLists", "features.invoices",
    ],
  },
  { id: "r5", name: "Viewer", users: 0, permissions: ["emp.view", "orders.viewOwn", "pricing.see", "features.lists"] },
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
                          {item.hint ? (
                            <span className="block text-xs text-muted-foreground">{item.hint}</span>
                          ) : null}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${r.name}`}
                        onClick={() => setDrawer({ mode: "edit", role: r })}
                      >
                        <Eye size={18} />
                      </Button>
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
