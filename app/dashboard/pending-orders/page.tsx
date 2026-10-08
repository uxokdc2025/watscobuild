"use client";

import { useMemo, useState } from "react";
import { Check, Eye, X, XCircle } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─────────────────────────── Approval data ───────────────────────────
 * Order Approval: carts that tripped an approval rule and need a manager's
 * sign-off before they become orders. Columns: Approval # · Approval Rule ·
 * Requested By · Date · Cart Value · Items · Payment Method · Status. */
type ApprovalLine = { name: string; item: string; qty: number; price: number };
type ApprovalStatus = "Pending" | "Approved" | "Declined";
type ApprovalRequest = {
  number: string;
  rule: string;
  requestedBy: string;
  requestedByRole: string;
  date: string;
  paymentMethod: string;
  status: ApprovalStatus;
  lines: ApprovalLine[];
};
type TabKey = ApprovalStatus;

/** The signed-in user who submitted some of these requests. */
const CURRENT_USER = "David Whiteside";

const TABS: TabKey[] = ["Pending", "Approved", "Declined"];

const INITIAL_REQUESTS: ApprovalRequest[] = [
  {
    number: "AP-20418",
    rule: "Orders over $5,000",
    requestedBy: "Marcus Delgado",
    requestedByRole: "Manager",
    date: "10/06/2026",
    paymentMethod: "Invoice — Net 30",
    status: "Pending",
    lines: [
      { name: "Goodman 3 Ton 14.3 SEER2 AC Condenser", item: "GSXH503610", qty: 2, price: 4205.0 },
      { name: "Cased Evaporator Coil, 3 Ton", item: "CAPTA4230C3", qty: 2, price: 1169.57 },
      { name: "TRADEPRO® Refrigerant Line Set, 3/8 x 3/4 x 25 ft", item: "TP-LS3834-25", qty: 2, price: 89.5 },
    ],
  },
  {
    number: "AP-20415",
    rule: "All orders",
    requestedBy: CURRENT_USER,
    requestedByRole: "Buyer",
    date: "10/05/2026",
    paymentMethod: "Visa ending 4417",
    status: "Pending",
    lines: [
      { name: "TRADEPRO® Blower Motor, X-13 ECM, 1/2 HP", item: "54510A", qty: 2, price: 168.42 },
      { name: "TRADEPRO® Run Capacitor, 45/5 MFD", item: "11822", qty: 6, price: 12.21 },
    ],
  },
  {
    number: "AP-20407",
    rule: "Orders over $5,000",
    requestedBy: "Priya Natarajan",
    requestedByRole: "Project Lead",
    date: "10/01/2026",
    paymentMethod: "Invoice — Net 30",
    status: "Approved",
    lines: [
      { name: "Goodman 80% AFUE Gas Furnace, 100k BTU", item: "GD9S801005CN", qty: 3, price: 2523.0 },
    ],
  },
  {
    number: "AP-20399",
    rule: "All orders",
    requestedBy: CURRENT_USER,
    requestedByRole: "Buyer",
    date: "09/26/2026",
    paymentMethod: "Mastercard ending 0932",
    status: "Declined",
    lines: [
      { name: "Mitsubishi — Simple Direct Wired Controller", item: "1604089268183350", qty: 4, price: 162.0 },
      { name: "Contactor, 2-Pole, 30 Amp, 24V Coil", item: "90313", qty: 10, price: 11.5 },
    ],
  },
];

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const cartValue = (r: ApprovalRequest) =>
  r.lines.reduce((s, l) => s + l.price * l.qty, 0);

const itemCount = (r: ApprovalRequest) =>
  r.lines.reduce((s, l) => s + l.qty, 0);

const STATUS_COLOR: Record<ApprovalStatus, "amber" | "green" | "red"> = {
  Pending: "amber",
  Approved: "green",
  Declined: "red",
};

const matchesTab = (r: ApprovalRequest, tab: TabKey): boolean => r.status === tab;

/* ── Status tabs — the Style-2 "connected bar, soft-blue active" pattern
   (our established tabs, from /pdp/about-variants). ── */
function StatusTabs({
  active,
  counts,
  onChange,
}: {
  active: TabKey;
  counts: Record<TabKey, number>;
  onChange: (t: TabKey) => void;
}) {
  return (
    <Tabs value={active} onValueChange={(v) => onChange(v as TabKey)}>
      <TabsList
        aria-label="Approval status"
        className="h-11 w-fit items-center gap-0 divide-x divide-border overflow-hidden rounded-md border border-border bg-white p-0"
      >
        {TABS.map((t) => (
          <TabsTrigger
            key={t}
            value={t}
            className="h-full rounded-none border-0 px-4 text-sm font-medium text-muted-foreground after:hidden data-[state=active]:bg-[var(--blue-100)]! data-[state=active]:font-semibold data-[state=active]:text-[var(--blue-800)]! data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground"
          >
            {t}
            <span className="ml-1.5 tabular-nums text-xs text-muted-foreground">{counts[t]}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

/* ── Approval detail drawer — cart line items + Decline / Approve. ── */
function ApprovalDrawer({
  request,
  onClose,
  onDecide,
}: {
  request: ApprovalRequest | null;
  onClose: () => void;
  onDecide: (number: string, status: "Approved" | "Declined") => void;
}) {
  const open = request !== null;
  const actionable = request?.status === "Pending";
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        drawerSide="right"
        className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]"
      >
        {request ? (
          <>
            <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  Approval #{request.number}
                  <Badge variant="soft" color={STATUS_COLOR[request.status]}>{request.status}</Badge>
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {request.requestedBy} ({request.requestedByRole}) · {request.date}
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

            <div className="space-y-6 px-5 py-5 sm:px-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailBlock title="Approval rule">
                  <p>{request.rule}</p>
                </DetailBlock>
                <DetailBlock title="Payment method">
                  <p>{request.paymentMethod}</p>
                </DetailBlock>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">
                  Cart items ({itemCount(request)})
                </h4>
                <ul className="divide-y rounded-lg border">
                  {request.lines.map((l) => (
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

              <dl className="ml-auto max-w-xs text-sm">
                <div className="flex justify-between gap-6 font-bold">
                  <dt>Cart value</dt>
                  <dd className="tabular-nums">{usd(cartValue(request))}</dd>
                </div>
              </dl>
            </div>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
              <Button
                variant="outline"
                className="min-h-11 text-destructive hover:text-destructive"
                disabled={!actionable}
                onClick={() => onDecide(request.number, "Declined")}
              >
                <XCircle size={16} /> Decline
              </Button>
              <Button
                className="min-h-11"
                disabled={!actionable}
                onClick={() => onDecide(request.number, "Approved")}
              >
                <Check size={16} /> Approve
              </Button>
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

export default function PendingOrdersPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(INITIAL_REQUESTS);
  const [tab, setTab] = useState<TabKey>("Pending");
  const [perPage, setPerPage] = useState(18);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const counts = useMemo(
    () =>
      TABS.reduce(
        (acc, t) => ({ ...acc, [t]: requests.filter((r) => matchesTab(r, t)).length }),
        {} as Record<TabKey, number>,
      ),
    [requests],
  );

  const filtered = useMemo(
    () => requests.filter((r) => matchesTab(r, tab)),
    [requests, tab],
  );
  const visible = filtered.slice(0, perPage);
  const selected = requests.find((r) => r.number === selectedNumber) ?? null;

  const decide = (number: string, status: "Approved" | "Declined") => {
    setRequests((prev) => prev.map((r) => (r.number === number ? { ...r, status } : r)));
    setSelectedNumber(null);
  };

  return (
    <DashboardShell title="Order Approval">
      <div className="space-y-4">
        <StatusTabs active={tab} counts={counts} onChange={setTab} />

        <section className={accountTable.card}>
          <div className={accountTable.scroll}>
            <table className={`${accountTable.table} min-w-[960px]`}>
              <thead>
                <tr className={accountTable.headRow}>
                  <th className={accountTable.headCell}>Approval #</th>
                  <th className={accountTable.headCell}>Approval Rule</th>
                  <th className={accountTable.headCell}>Requested By</th>
                  <th className={accountTable.headCell}>Date</th>
                  <th className={`${accountTable.headCell} text-right`}>Cart Value</th>
                  <th className={`${accountTable.headCell} text-right`}>Items</th>
                  <th className={accountTable.headCell}>Payment Method</th>
                  <th className={accountTable.headCell}>Status</th>
                  <th className={`${accountTable.headCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.number} className={accountTable.row}>
                    <td className={accountTable.cell}>
                      <button
                        type="button"
                        onClick={() => setSelectedNumber(r.number)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {r.number}
                      </button>
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{r.rule}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>
                      {r.requestedBy}
                      <span className="ml-1.5 text-muted-foreground">({r.requestedByRole})</span>
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{r.date}</td>
                    <td className={`${accountTable.cell} text-right font-semibold whitespace-nowrap tabular-nums`}>
                      {usd(cartValue(r))}
                    </td>
                    <td className={`${accountTable.cell} text-right tabular-nums`}>{itemCount(r)}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap text-muted-foreground`}>
                      {r.paymentMethod}
                    </td>
                    <td className={accountTable.cell}>
                      <Badge variant="soft" color={STATUS_COLOR[r.status]}>{r.status}</Badge>
                    </td>
                    <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View approval ${r.number}`}
                        onClick={() => setSelectedNumber(r.number)}
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
            <div className="p-12 text-center text-muted-foreground">
              No orders are waiting for your approval.
            </div>
          )}
          {/* Pagination — "Show 18 / 36 / 54 Per page" */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
            <span>
              {filtered.length} approval{filtered.length === 1 ? "" : "s"}
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
      </div>

      <ApprovalDrawer
        request={selected}
        onClose={() => setSelectedNumber(null)}
        onDecide={decide}
      />
    </DashboardShell>
  );
}
