"use client";

import { useMemo, useState } from "react";
import { Download, Eye, FilePlus2, Plus, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { AccountTableToolbar, accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─────────────────────────── Proposal data ───────────────────────────
 * Columns: Proposal # · Name · Customer · Status · Created · Expires · Total ·
 * Actions. Detail drawer shows meta, line items and totals. */
type ProposalLine = { name: string; item: string; qty: number; price: number };
type ProposalStatus = "Draft" | "Sent" | "Accepted" | "Expired";
type Proposal = {
  number: string;
  name: string;
  customer: string;
  status: ProposalStatus;
  created: string;
  expires: string;
  taxRate: number;
  lines: ProposalLine[];
};

const PROPOSALS: Proposal[] = [
  {
    number: "P-2041",
    name: "Riverside Apartments — condenser swap",
    customer: "Riverside Property Group",
    status: "Sent",
    created: "09/30/2026",
    expires: "10/30/2026",
    taxRate: 0.0625,
    lines: [
      { name: "Goodman 3 Ton 14.3 SEER2 AC Condenser", item: "GSXH503610", qty: 4, price: 4205.0 },
      { name: "Cased Evaporator Coil, 3 Ton", item: "CAPTA4230C3", qty: 4, price: 1169.57 },
    ],
  },
  {
    number: "P-2038",
    name: "Greenfield School — furnace replacement",
    customer: "Greenfield Public Schools",
    status: "Accepted",
    created: "09/18/2026",
    expires: "10/18/2026",
    taxRate: 0,
    lines: [
      { name: "Goodman 80% AFUE Gas Furnace, 100k BTU", item: "GD9S801005CN", qty: 3, price: 2523.0 },
      { name: "Simple Direct Wired Controller", item: "1604089268183350", qty: 3, price: 162.0 },
    ],
  },
  {
    number: "P-2029",
    name: "Maple Street maintenance parts",
    customer: "Maple Street Dental",
    status: "Draft",
    created: "08/12/2026",
    expires: "09/12/2026",
    taxRate: 0.0625,
    lines: [
      { name: "TRADEPRO® Blower Motor, X-13 ECM, 1/2 HP", item: "54510A", qty: 2, price: 168.42 },
      { name: "TRADEPRO® Run Capacitor, 45/5 MFD", item: "11822", qty: 6, price: 12.21 },
    ],
  },
];

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const STATUS_BADGE: Record<ProposalStatus, "secondary" | "outline"> = {
  Draft: "outline",
  Sent: "secondary",
  Accepted: "secondary",
  Expired: "outline",
};

const subtotalOf = (p: Proposal) => p.lines.reduce((s, l) => s + l.price * l.qty, 0);
const taxOf = (p: Proposal) => subtotalOf(p) * p.taxRate;
const totalOf = (p: Proposal) => subtotalOf(p) + taxOf(p);

/* ── Right-side drawer shell (same markup as Orders) ── */
const DRAWER_CLASS =
  "top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]";

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <X size={18} />
    </button>
  );
}

/* ── Create proposal drawer ── */
type ProposalDraft = { name: string; customer: string; note: string };
const EMPTY_DRAFT: ProposalDraft = { name: "", customer: "", note: "" };

function CreateProposalDrawer({
  open,
  draft,
  setDraft,
  onClose,
  onSave,
}: {
  open: boolean;
  draft: ProposalDraft;
  setDraft: (d: ProposalDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const valid = draft.name.trim().length > 0 && draft.customer.trim().length > 0;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent drawerSide="right" className={DRAWER_CLASS}>
        <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <DialogTitle>Create proposal</DialogTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Start a draft, then add products and send it to your customer.
            </p>
          </div>
          <CloseButton onClose={onClose} />
        </DialogHeader>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">
              Proposal name <span className="text-destructive">*</span>
            </span>
            <Input
              className="h-11"
              placeholder="e.g. Riverside Apartments — condenser swap"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">
              Customer <span className="text-destructive">*</span>
            </span>
            <Input
              className="h-11"
              placeholder="Customer or company name"
              value={draft.customer}
              onChange={(e) => setDraft({ ...draft, customer: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Note</span>
            <Textarea
              className="min-h-28"
              placeholder="Add a note for your customer"
              value={draft.note}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            />
          </label>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
          <Button variant="outline" className="min-h-11" onClick={onClose}>
            Cancel
          </Button>
          <Button className="min-h-11" disabled={!valid} onClick={onSave}>
            <FilePlus2 size={16} /> Create proposal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Proposal detail drawer ── */
function ProposalDetailDrawer({
  proposal,
  onClose,
}: {
  proposal: Proposal | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={proposal !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent drawerSide="right" className={DRAWER_CLASS}>
        {proposal ? (
          <>
            <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  Proposal {proposal.number}
                  <Badge variant={STATUS_BADGE[proposal.status]}>{proposal.status}</Badge>
                </DialogTitle>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{proposal.name}</p>
              </div>
              <CloseButton onClose={onClose} />
            </DialogHeader>

            <div className="space-y-6 px-5 py-5 sm:px-6">
              <div className="grid gap-5 sm:grid-cols-3">
                <DetailBlock title="Customer">
                  <p>{proposal.customer}</p>
                </DetailBlock>
                <DetailBlock title="Created">
                  <p>{proposal.created}</p>
                </DetailBlock>
                <DetailBlock title="Expires">
                  <p>{proposal.expires}</p>
                </DetailBlock>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">Line items</h4>
                <ul className="divide-y rounded-lg border">
                  {proposal.lines.map((l) => (
                    <li key={l.item} className="flex items-center gap-4 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug">{l.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Item: {l.item} · Qty {l.qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums">
                        {usd(l.price * l.qty)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="ml-auto max-w-xs space-y-1.5 text-sm">
                <Total label="Subtotal" value={usd(subtotalOf(proposal))} />
                <Total label="Tax" value={usd(taxOf(proposal))} />
                <div className="mt-1 border-t pt-2">
                  <Total label="Grand Total" value={usd(totalOf(proposal))} bold />
                </div>
              </dl>
            </div>

            <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
              <Button variant="outline" className="min-h-11">
                <Download size={16} /> Download PDF
              </Button>
              <Button className="min-h-11">Convert to order</Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
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

function Total({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-6 ${bold ? "font-bold" : ""}`}>
      <dt className={bold ? "" : "text-muted-foreground"}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export default function ProposalsPage() {
  const [q, setQ] = useState("");
  const [perPage, setPerPage] = useState(18);
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState<ProposalDraft>(EMPTY_DRAFT);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PROPOSALS.filter(
      (p) =>
        !term ||
        p.number.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        p.customer.toLowerCase().includes(term),
    );
  }, [q]);
  const visible = filtered.slice(0, perPage);

  const openCreate = () => {
    setDraft(EMPTY_DRAFT);
    setCreateOpen(true);
  };

  return (
    <DashboardShell
      title="Proposals"
      description="Build, send and convert customer proposals."
      actions={
        <Button className="min-h-11" onClick={openCreate}>
          <Plus size={16} />
          Create Proposal
        </Button>
      }
    >
      <div className="space-y-4">
        <section className={accountTable.card}>
          <AccountTableToolbar
            value={q}
            onChange={setQ}
            placeholder="Search proposals by number, name or customer"
          />
          <div className={accountTable.scroll}>
            <table className={`${accountTable.table} min-w-[960px]`}>
              <thead>
                <tr className={accountTable.headRow}>
                  <th className={accountTable.headCell}>Proposal #</th>
                  <th className={accountTable.headCell}>Name</th>
                  <th className={accountTable.headCell}>Customer</th>
                  <th className={accountTable.headCell}>Status</th>
                  <th className={accountTable.headCell}>Created</th>
                  <th className={accountTable.headCell}>Expires</th>
                  <th className={`${accountTable.headCell} text-right`}>Total</th>
                  <th className={`${accountTable.headCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.number} className={accountTable.row}>
                    <td className={accountTable.cell}>
                      <button
                        type="button"
                        onClick={() => setSelected(p)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {p.number}
                      </button>
                    </td>
                    <td className={accountTable.cell}>{p.name}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{p.customer}</td>
                    <td className={accountTable.cell}>
                      <Badge variant={STATUS_BADGE[p.status]}>{p.status}</Badge>
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{p.created}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{p.expires}</td>
                    <td className={`${accountTable.cell} text-right font-semibold whitespace-nowrap tabular-nums`}>
                      {usd(totalOf(p))}
                    </td>
                    <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View proposal ${p.number}`}
                        onClick={() => setSelected(p)}
                      >
                        <Eye size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <div className="p-12 text-center text-muted-foreground">No proposals found.</div>
          )}
          {/* Pagination — matches the reference "Show 18 / 36 / 54 Per page" */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
            <span>
              {filtered.length} proposal{filtered.length === 1 ? "" : "s"}
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

      <CreateProposalDrawer
        open={createOpen}
        draft={draft}
        setDraft={setDraft}
        onClose={() => setCreateOpen(false)}
        onSave={() => setCreateOpen(false)}
      />
      <ProposalDetailDrawer proposal={selected} onClose={() => setSelected(null)} />
    </DashboardShell>
  );
}
