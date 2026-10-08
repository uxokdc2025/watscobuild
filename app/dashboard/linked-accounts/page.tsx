"use client";

import { useState } from "react";
import { Eye, Link2, MoreHorizontal, Plus, Repeat, Unlink, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

/* ─────────────────────────── Linked account data ───────────────────────────
 * Columns: Account Name · Account # · Role · Status · Actions. */
type AccountRole = "Administrator" | "Buyer" | "Approver" | "Viewer";
type AccountStatus = "Active" | "Pending";
type LinkedAccount = {
  name: string;
  number: string;
  role: AccountRole;
  status: AccountStatus;
};

const ROLES: AccountRole[] = ["Administrator", "Buyer", "Approver", "Viewer"];

const INITIAL_ACCOUNTS: LinkedAccount[] = [
  { name: "Homans Associates — Manchester, NH", number: "cash 1248", role: "Administrator", status: "Active" },
  { name: "Homans Associates — Wilmington, MA", number: "cash 2093", role: "Buyer", status: "Pending" },
];

const STATUS_BADGE: Record<AccountStatus, "secondary" | "outline"> = {
  Active: "secondary",
  Pending: "outline",
};

const DRAWER_CLASS =
  "top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]";

/* ── Link Account drawer — small form + sticky "Link account". ── */
function LinkAccountDrawer({
  open,
  onClose,
  onLink,
}: {
  open: boolean;
  onClose: () => void;
  onLink: (account: LinkedAccount) => void;
}) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AccountRole>("Buyer");
  const valid = number.trim().length > 0 && name.trim().length > 0;

  const reset = () => {
    setNumber("");
    setName("");
    setRole("Buyer");
  };
  const close = () => {
    reset();
    onClose();
  };
  const submit = () => {
    if (!valid) return;
    onLink({ name: name.trim(), number: number.trim(), role, status: "Pending" });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent drawerSide="right" className={DRAWER_CLASS}>
        <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <DialogTitle>Link account</DialogTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Add another Watsco account to your profile.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        <form
          id="link-account-form"
          className="space-y-5 px-5 py-5 sm:px-6"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Field label="Account number">
            <Input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="h-11"
              placeholder="e.g. cash 1248"
              aria-label="Account number"
              autoComplete="off"
            />
          </Field>
          <Field label="Account name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              placeholder="e.g. Homans Associates — Manchester, NH"
              aria-label="Account name"
              autoComplete="off"
            />
          </Field>
          <Field label="Role">
            <Select value={role} onValueChange={(v) => setRole(v as AccountRole)}>
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
        </form>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
          <Button variant="outline" className="min-h-11" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="link-account-form" className="min-h-11" disabled={!valid}>
            <Link2 size={16} /> Link account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Account detail drawer — Switch to this account / Unlink. ── */
function AccountDetailDrawer({
  account,
  isCurrent,
  onClose,
  onSwitch,
  onUnlink,
}: {
  account: LinkedAccount | null;
  isCurrent: boolean;
  onClose: () => void;
  onSwitch: (number: string) => void;
  onUnlink: (number: string) => void;
}) {
  return (
    <Dialog open={account !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent drawerSide="right" className={DRAWER_CLASS}>
        {account ? (
          <>
            <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  {account.name}
                  <Badge variant={STATUS_BADGE[account.status]}>{account.status}</Badge>
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Account {account.number}</p>
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

            <div className="space-y-6 px-5 py-5 sm:px-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailBlock title="Account name">
                  <p>{account.name}</p>
                </DetailBlock>
                <DetailBlock title="Account #">
                  <p>{account.number}</p>
                </DetailBlock>
                <DetailBlock title="Role">
                  <p>{account.role}</p>
                </DetailBlock>
                <DetailBlock title="Status">
                  <p>{account.status}</p>
                </DetailBlock>
              </div>
              {isCurrent ? (
                <p className="text-sm text-muted-foreground">
                  This is the account you are currently shopping with.
                </p>
              ) : null}
            </div>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
              <Button
                variant="outline"
                className="min-h-11"
                onClick={() => onUnlink(account.number)}
              >
                <Unlink size={16} /> Unlink
              </Button>
              <Button
                className="min-h-11"
                disabled={isCurrent || account.status !== "Active"}
                onClick={() => onSwitch(account.number)}
              >
                <Repeat size={16} /> Switch to this account
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
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

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5 text-sm">
      <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h4>
      {children}
    </div>
  );
}

export default function LinkedAccountsPage() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>(INITIAL_ACCOUNTS);
  const [currentNumber, setCurrentNumber] = useState<string>(INITIAL_ACCOUNTS[0].number);
  const [perPage, setPerPage] = useState(18);
  const [linkOpen, setLinkOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const visible = accounts.slice(0, perPage);
  const selected = accounts.find((a) => a.number === selectedNumber) ?? null;

  const link = (account: LinkedAccount) => {
    setAccounts((prev) => [...prev, account]);
    setLinkOpen(false);
  };
  const unlink = (number: string) => {
    setAccounts((prev) => prev.filter((a) => a.number !== number));
    setSelectedNumber(null);
  };
  const switchTo = (number: string) => {
    setCurrentNumber(number);
    setSelectedNumber(null);
  };

  return (
    <DashboardShell
      title="Linked Accounts"
      actions={
        <Button className="min-h-11" onClick={() => setLinkOpen(true)}>
          <Plus size={16} /> Link Account
        </Button>
      }
    >
      <section className={accountTable.card}>
        <div className={accountTable.scroll}>
          <table className={`${accountTable.table} min-w-[720px]`}>
            <thead>
              <tr className={accountTable.headRow}>
                <th className={accountTable.headCell}>Account Name</th>
                <th className={accountTable.headCell}>Account #</th>
                <th className={accountTable.headCell}>Role</th>
                <th className={accountTable.headCell}>Status</th>
                <th className={`${accountTable.headCell} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.number} className={accountTable.row}>
                  <td className={accountTable.cell}>
                    <button
                      type="button"
                      onClick={() => setSelectedNumber(a.number)}
                      className="text-left font-semibold text-primary hover:underline"
                    >
                      {a.name}
                    </button>
                    {a.number === currentNumber ? (
                      <Badge variant="outline" className="ml-2">
                        Current
                      </Badge>
                    ) : null}
                  </td>
                  <td className={`${accountTable.cell} whitespace-nowrap`}>{a.number}</td>
                  <td className={`${accountTable.cell} whitespace-nowrap`}>{a.role}</td>
                  <td className={accountTable.cell}>
                    <Badge variant={STATUS_BADGE[a.status]}>{a.status}</Badge>
                  </td>
                  <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`View account ${a.number}`}
                      onClick={() => setSelectedNumber(a.number)}
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`More actions for ${a.number}`}
                      className="ml-1"
                    >
                      <MoreHorizontal size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!accounts.length && (
          <div className="p-12 text-center text-muted-foreground">
            No accounts are linked to your profile.
          </div>
        )}
        {/* Pagination — "Show 18 / 36 / 54 Per page" */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
          <span>
            {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <span>Show</span>
            {[18, 36, 54].map((n) => (
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

      <LinkAccountDrawer open={linkOpen} onClose={() => setLinkOpen(false)} onLink={link} />
      <AccountDetailDrawer
        account={selected}
        isCurrent={selected?.number === currentNumber}
        onClose={() => setSelectedNumber(null)}
        onSwitch={switchTo}
        onUnlink={unlink}
      />
    </DashboardShell>
  );
}
