"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Send, UserX, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { AccountSearchInput, accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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

/* ─────────────────────────── User data ───────────────────────────
 * Company Users: Name · Email · Role · Status · Actions. Invite and edit
 * share one right-side drawer (same shell as the Orders detail drawer). */
type UserRole = "Admin" | "Buyer" | "Manager" | "Viewer";
type UserStatus = "Active" | "Invited" | "Disabled";
type CompanyUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

const ROLES: UserRole[] = ["Admin", "Buyer", "Manager", "Viewer"];

const USERS: CompanyUser[] = [
  { id: "u1", firstName: "David", lastName: "Whiteside", email: "dwhiteside@watsco.com", role: "Admin", status: "Active" },
  { id: "u2", firstName: "Maria", lastName: "Alvarez", email: "malvarez@northstarhvac.com", role: "Buyer", status: "Active" },
  { id: "u3", firstName: "Tom", lastName: "Keegan", email: "tkeegan@northstarhvac.com", role: "Manager", status: "Active" },
  { id: "u4", firstName: "Priya", lastName: "Natarajan", email: "pnatarajan@northstarhvac.com", role: "Buyer", status: "Invited" },
  { id: "u5", firstName: "Luis", lastName: "Ortega", email: "lortega@northstarhvac.com", role: "Viewer", status: "Disabled" },
  { id: "u6", firstName: "Jenna", lastName: "Caldwell", email: "jcaldwell@northstarhvac.com", role: "Manager", status: "Active" },
];

const ROLE_COLOR = {
  Admin: "violet",
  Buyer: "blue",
  Manager: "teal",
  Viewer: "slate",
} as const satisfies Record<UserRole, "violet" | "blue" | "teal" | "slate">;

const STATUS_COLOR: Record<UserStatus, "green" | "amber" | "slate"> = {
  Active: "green",
  Invited: "amber",
  Disabled: "slate",
};

const STATUSES: UserStatus[] = ["Active", "Invited", "Disabled"];

/* Reference tabs: Active users · Inactive users · All approved users · Pending users. */
type UserTab = "Active" | "Inactive" | "Approved" | "Pending";
const USER_TABS: { key: UserTab; label: string }[] = [
  { key: "Active", label: "Active users" },
  { key: "Inactive", label: "Inactive users" },
  { key: "Approved", label: "All approved users" },
  { key: "Pending", label: "Pending users" },
];
const matchesUserTab = (u: CompanyUser, tab: UserTab): boolean =>
  tab === "Active"
    ? u.status === "Active"
    : tab === "Inactive"
      ? u.status === "Disabled"
      : tab === "Pending"
        ? u.status === "Invited"
        : u.status !== "Invited";

const PAGE_SIZES = [18, 36, 54] as const;

type DrawerState =
  | { mode: "closed" }
  | { mode: "invite" }
  | { mode: "edit"; user: CompanyUser };

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

function RoleChip({ role }: { role: UserRole }) {
  return (
    <Badge variant="soft" color={ROLE_COLOR[role]}>
      {role}
    </Badge>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

/* ── Invite / edit drawer — one right-side shell, two modes. ── */
function UserDrawer({
  state,
  onClose,
}: {
  state: DrawerState;
  onClose: () => void;
}) {
  const open = state.mode !== "closed";
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        drawerSide="right"
        className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]"
      >
        {state.mode !== "closed" ? (
          <UserDrawerBody
            // Remount per target so the form pre-fills fresh each time.
            key={state.mode === "edit" ? state.user.id : "invite"}
            state={state}
            onClose={onClose}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function UserDrawerBody({
  state,
  onClose,
}: {
  state: Exclude<DrawerState, { mode: "closed" }>;
  onClose: () => void;
}) {
  const editing = state.mode === "edit";
  const [form, setForm] = useState<FormValues>(
    state.mode === "edit"
      ? {
          firstName: state.user.firstName,
          lastName: state.user.lastName,
          email: state.user.email,
          role: state.user.role,
          status: state.user.status,
        }
      : { firstName: "", lastName: "", email: "", role: "Buyer", status: "Invited" },
  );
  const patch = (p: Partial<FormValues>) => setForm((f) => ({ ...f, ...p }));
  const valid =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    /^\S+@\S+\.\S+$/.test(form.email.trim());

  return (
    <>
      <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <DialogTitle className="flex flex-wrap items-center gap-2">
            {editing ? `${state.user.firstName} ${state.user.lastName}` : "Invite User"}
            {editing ? (
              <Badge variant="soft" color={STATUS_COLOR[state.user.status]}>{state.user.status}</Badge>
            ) : null}
          </DialogTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {editing
              ? "Update this user's details and role."
              : "They will receive an email to set up their account."}
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
        id="user-form"
        className="space-y-5 px-5 py-5 sm:px-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onClose();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <Input
              value={form.firstName}
              onChange={(e) => patch({ firstName: e.target.value })}
              className="h-11"
              autoComplete="off"
              aria-label="First name"
            />
          </Field>
          <Field label="Last name">
            <Input
              value={form.lastName}
              onChange={(e) => patch({ lastName: e.target.value })}
              className="h-11"
              autoComplete="off"
              aria-label="Last name"
            />
          </Field>
        </div>
        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => patch({ email: e.target.value })}
            className="h-11"
            autoComplete="off"
            aria-label="Email"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Role">
            <Select value={form.role} onValueChange={(v) => patch({ role: v as UserRole })}>
              <SelectTrigger className="!h-11 w-full" aria-label="Role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {editing ? (
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => patch({ status: v as UserStatus })}>
                <SelectTrigger className="!h-11 w-full" aria-label="Status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          ) : null}
        </div>
      </form>

      {/* Sticky action bar — destructive (Deactivate) kept on the left, away from the primary. */}
      <div className={`sticky bottom-0 flex items-center gap-2 border-t bg-background px-5 py-3 sm:px-6 ${editing ? "justify-between" : "justify-end"}`}>
        {editing ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 text-destructive hover:text-destructive"
              onClick={onClose}
            >
              <UserX size={16} /> Deactivate
            </Button>
            <Button type="submit" form="user-form" className="min-h-11" disabled={!valid}>
              Save changes
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" className="min-h-11" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="user-form" className="min-h-11" disabled={!valid}>
              <Send size={16} /> Send invite
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default function CompanyUsersPage() {
  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState<number>(18);
  const [tab, setTab] = useState<UserTab>("Approved");
  const [drawer, setDrawer] = useState<DrawerState>({ mode: "closed" });

  const tabCounts = useMemo(
    () =>
      USER_TABS.reduce(
        (acc, t) => ({ ...acc, [t.key]: USERS.filter((u) => matchesUserTab(u, t.key)).length }),
        {} as Record<UserTab, number>,
      ),
    [],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return USERS.filter(
      (u) =>
        matchesUserTab(u, tab) &&
        (q === "" ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)),
    ).slice(0, perPage);
  }, [query, perPage, tab]);

  return (
    <DashboardShell
      title="Company Users"
      actions={
        <Button className="min-h-11" onClick={() => setDrawer({ mode: "invite" })}>
          <Plus size={16} />
          Invite User
        </Button>
      }
    >
      <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as UserTab)}>
        <TabsList className="h-11 w-fit items-center gap-0 divide-x divide-border overflow-hidden rounded-md border border-border bg-white p-0">
          {USER_TABS.map((t) => (
            <TabsTrigger
              key={t.key}
              value={t.key}
              className="h-full rounded-none border-0 px-4 text-sm font-medium text-muted-foreground after:hidden data-[state=active]:bg-[var(--blue-100)]! data-[state=active]:font-semibold data-[state=active]:text-[var(--blue-800)]! data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground"
            >
              {t.label}
              <span className="ml-1.5 tabular-nums text-xs text-muted-foreground">{tabCounts[t.key]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <section className={accountTable.card}>
        <div className="border-b p-4">
          <AccountSearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by name or email"
            className="w-full"
          />
        </div>
        <div className={accountTable.scroll}>
          <table className={`${accountTable.table} min-w-[760px]`}>
            <thead>
              <tr className={accountTable.headRow}>
                <th className={accountTable.headCell}>Name</th>
                <th className={accountTable.headCell}>Email</th>
                <th className={accountTable.headCell}>Role</th>
                <th className={accountTable.headCell}>Status</th>
                <th className={`${accountTable.headCell} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const fullName = `${u.firstName} ${u.lastName}`;
                return (
                  <tr key={u.id} className={accountTable.row}>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>
                      <button
                        type="button"
                        onClick={() => setDrawer({ mode: "edit", user: u })}
                        className="font-semibold text-primary hover:underline"
                      >
                        {fullName}
                      </button>
                    </td>
                    <td className={`${accountTable.cell} text-muted-foreground`}>{u.email}</td>
                    <td className={accountTable.cell}>
                      <RoleChip role={u.role} />
                    </td>
                    <td className={accountTable.cell}>
                      <Badge variant="soft" color={STATUS_COLOR[u.status]}>{u.status}</Badge>
                    </td>
                    <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${fullName}`}
                        onClick={() => setDrawer({ mode: "edit", user: u })}
                      >
                        <Pencil size={17} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="p-12 text-center text-muted-foreground">No users found.</div>
        )}
        {/* Pagination — "Show 18 / 36 / 54 Per page" */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
          <span>
            {filtered.length} user{filtered.length === 1 ? "" : "s"}
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
      </div>

      <UserDrawer state={drawer} onClose={() => setDrawer({ mode: "closed" })} />
    </DashboardShell>
  );
}
