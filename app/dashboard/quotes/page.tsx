"use client";

import { useMemo, useState } from "react";
import { Download, Eye, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { AccountTableToolbar, RowAction, accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─────────────────────────── Quote data ───────────────────────────
 * Mirrors the Quotes reference: Quote # · Name · Job Account · Job Name ·
 * Status · Created · Expires · Updated · Subtotal · Actions, plus the line
 * items and totals shown in the detail drawer. */
type QuoteLine = { name: string; item: string; qty: number; price: number };
type QuoteStatus = "Active" | "Expired";
type Quote = {
  number: string;
  name: string;
  jobAccount: string;
  jobName: string;
  status: QuoteStatus;
  created: string;
  expires: string;
  updated: string;
  lines: QuoteLine[];
  taxRate: number;
};

const QUOTES: Quote[] = [
  {
    number: "Q-2026-0184",
    name: "Whiteside — 3 Ton replacement",
    jobAccount: "cash 1248",
    jobName: "Anderson Residence Retrofit",
    status: "Active",
    created: "09/20/2026",
    expires: "10/20/2026",
    updated: "Today",
    taxRate: 0,
    lines: [
      { name: "Goodman 3 Ton 14.3 SEER2 AC Condenser", item: "GSXH503610", qty: 1, price: 4205.0 },
      { name: "Cased Evaporator Coil, 3 Ton", item: "CAPTA4230C3", qty: 1, price: 1169.57 },
    ],
  },
  {
    number: "Q-2026-0172",
    name: "Furnace swap-out, Unit 4B",
    jobAccount: "cash 1248",
    jobName: "Maple Court Apartments",
    status: "Active",
    created: "09/12/2026",
    expires: "10/12/2026",
    updated: "09/18/2026",
    taxRate: 0,
    lines: [
      { name: "Goodman 80% AFUE Gas Furnace, 100k BTU", item: "GD9S801005CN", qty: 1, price: 2523.0 },
      { name: "TRADEPRO® Blower Motor, X-13 ECM, 1/2 HP", item: "54510A", qty: 1, price: 168.42 },
    ],
  },
  {
    number: "Q-2026-0159",
    name: "Service parts stock-up",
    jobAccount: "cash 1248",
    jobName: "Service Van Restock",
    status: "Expired",
    created: "08/04/2026",
    expires: "09/04/2026",
    updated: "08/11/2026",
    taxRate: 0,
    lines: [
      { name: "TRADEPRO® Run Capacitor, 45/5 MFD", item: "11822", qty: 12, price: 12.21 },
      { name: "Contactor, 2-Pole, 30 Amp, 24V Coil", item: "90313", qty: 10, price: 11.5 },
    ],
  },
];

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const STATUS_BADGE: Record<QuoteStatus, "secondary" | "outline"> = {
  Active: "secondary",
  Expired: "outline",
};

const quoteSubtotal = (quote: Quote) =>
  quote.lines.reduce((sum, l) => sum + l.price * l.qty, 0);

/* ── Quote detail drawer — quote # + status + dates, job info, line items,
   totals, and a sticky "Download" / "Convert to order" action bar. ── */
function QuoteDetailDrawer({ quote, onClose }: { quote: Quote | null; onClose: () => void }) {
  const open = quote !== null;
  const subtotal = quote ? quoteSubtotal(quote) : 0;
  const tax = quote ? subtotal * quote.taxRate : 0;
  const grand = subtotal + tax;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        drawerSide="right"
        className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]"
      >
        {quote ? (
          <>
            <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  Quote {quote.number}
                  <Badge variant={STATUS_BADGE[quote.status]}>{quote.status}</Badge>
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Created {quote.created} · Expires {quote.expires}
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
              {/* Job info */}
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailBlock title="Job account">
                  <p>{quote.jobAccount}</p>
                </DetailBlock>
                <DetailBlock title="Job name">
                  <p>{quote.jobName}</p>
                </DetailBlock>
              </div>

              {/* Line items — shared storefront row, compact */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">Quoted items</h4>
                <ul className="divide-y rounded-lg border">
                  {quote.lines.map((l) => (
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

              {/* Totals */}
              <dl className="ml-auto max-w-xs space-y-1.5 text-sm">
                <Total label="Subtotal" value={usd(subtotal)} />
                <Total label="Tax" value={usd(tax)} />
                <div className="mt-1 border-t pt-2">
                  <Total label="Grand Total" value={usd(grand)} bold />
                </div>
              </dl>
            </div>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
              <Button variant="outline">
                <Download size={16} /> Download
              </Button>
              <Button disabled={quote.status === "Expired"}>Convert to Order</Button>
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

export default function QuotesPage() {
  const [q, setQ] = useState("");
  const [perPage, setPerPage] = useState(18);
  const [selected, setSelected] = useState<Quote | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return QUOTES;
    return QUOTES.filter((item) =>
      [item.number, item.name, item.jobAccount, item.jobName].some((field) =>
        field.toLowerCase().includes(term),
      ),
    );
  }, [q]);

  const visible = filtered.slice(0, perPage);

  return (
    <DashboardShell
      title="Quotes"
      description="Review pricing and quote details in one clear, searchable view."
    >
      <div className="space-y-4">
        <section className={accountTable.card}>
          <AccountTableToolbar
            value={q}
            onChange={setQ}
            placeholder="Search quotes by Quote #, name, or job…"
          />
          <div className={accountTable.scroll}>
            <table className={`${accountTable.table} min-w-[1200px]`}>
              <thead>
                <tr className={accountTable.headRow}>
                  <th className={accountTable.headCell}>Quote #</th>
                  <th className={accountTable.headCell}>Name</th>
                  <th className={accountTable.headCell}>Job Account</th>
                  <th className={accountTable.headCell}>Job Name</th>
                  <th className={accountTable.headCell}>Status</th>
                  <th className={accountTable.headCell}>Created</th>
                  <th className={accountTable.headCell}>Expires</th>
                  <th className={accountTable.headCell}>Updated</th>
                  <th className={`${accountTable.headCell} text-right`}>Subtotal</th>
                  <th className={`${accountTable.headCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.number} className={accountTable.row}>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {item.number}
                      </button>
                    </td>
                    <td className={accountTable.cell}>{item.name}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{item.jobAccount}</td>
                    <td className={accountTable.cell}>{item.jobName}</td>
                    <td className={accountTable.cell}>
                      <Badge variant={STATUS_BADGE[item.status]}>{item.status}</Badge>
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{item.created}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{item.expires}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{item.updated}</td>
                    <td className={`${accountTable.cell} text-right font-semibold whitespace-nowrap tabular-nums`}>
                      {usd(quoteSubtotal(item))}
                    </td>
                    <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                      <RowAction
                        icon={Eye}
                        label="View"
                        aria-label={`View quote ${item.number}`}
                        onClick={() => setSelected(item)}
                      />
                      <RowAction
                        icon={Download}
                        label="Download"
                        aria-label={`Download quote ${item.number}`}
                        className="ml-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <div className="p-12 text-center text-muted-foreground">No quotes found.</div>
          )}
          {/* Pagination — matches the reference "Show 18 / 36 / 54 Per page" */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
            <span>
              {filtered.length} quote{filtered.length === 1 ? "" : "s"}
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

      <QuoteDetailDrawer quote={selected} onClose={() => setSelected(null)} />
    </DashboardShell>
  );
}
