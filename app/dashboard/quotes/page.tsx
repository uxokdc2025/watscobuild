"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Download, Eye } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { AccountTableToolbar, accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const QUOTES = [
  { quote: "Q-2026-0184", po: "PO-4819", created: "Aug 20, 2026", expires: "Sep 20, 2026", updated: "Today", buyer: "David Whiteside", email: "david@whitesidemechanical.com", subtotal: "$1,248.00" },
  { quote: "Q-2026-0172", po: "PO-4798", created: "Aug 12, 2026", expires: "Sep 12, 2026", updated: "Aug 18, 2026", buyer: "David Whiteside", email: "david@whitesidemechanical.com", subtotal: "$605.00" },
  { quote: "Q-2026-0159", po: "—", created: "Aug 04, 2026", expires: "Sep 04, 2026", updated: "Aug 11, 2026", buyer: "David Whiteside", email: "david@whitesidemechanical.com", subtotal: "$345.00" },
];

export default function QuotesPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return QUOTES;
    return QUOTES.filter((item) =>
      [item.quote, item.po, item.buyer].some((field) =>
        field.toLowerCase().includes(term),
      ),
    );
  }, [q]);

  return (
    <DashboardShell
      title="Quotes"
      description="Review pricing and quote details in one clear, searchable view."
    >
      <div className="space-y-3">
        <section className={accountTable.card}>
          <AccountTableToolbar
            value={q}
            onChange={setQ}
            placeholder="Search quotes by Quote #, PO #, or buyer…"
          />
          <div className={accountTable.scroll}>
            <table className={`${accountTable.table} min-w-[1180px]`}>
              <thead>
                <tr className={accountTable.headRow}>
                  <th className={accountTable.headCell}>Quote #</th>
                  <th className={accountTable.headCell}>PO #</th>
                  <th className={accountTable.headCell}>Created</th>
                  <th className={accountTable.headCell}>Expires</th>
                  <th className={accountTable.headCell}>Last Updated</th>
                  <th className={accountTable.headCell}>Status</th>
                  <th className={accountTable.headCell}>Buyer</th>
                  <th className={accountTable.headCell}>Buyer Email</th>
                  <th className={`${accountTable.headCell} text-right`}>Subtotal</th>
                  <th className={accountTable.headCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.quote} className={accountTable.row}>
                    <td className={`${accountTable.cell} font-semibold text-primary`}>
                      {item.quote}
                    </td>
                    <td className={accountTable.cell}>{item.po}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>
                      {item.created}
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>
                      {item.expires}
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>
                      {item.updated}
                    </td>
                    <td className={accountTable.cell}>
                      <Badge variant="soft" color="green">Active</Badge>
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>
                      {item.buyer}
                    </td>
                    <td className={accountTable.cell}>{item.email}</td>
                    <td className={`${accountTable.cell} text-right font-semibold whitespace-nowrap`}>
                      {item.subtotal}
                    </td>
                    <td className={accountTable.cell}>
                      <Button variant="ghost" size="icon" aria-label={`View quote ${item.quote}`}>
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Download quote ${item.quote}`}
                        className="ml-1"
                      >
                        <Download size={17} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <div className="p-12 text-center text-muted-foreground">
              No quotes found.
            </div>
          )}
          <div className={accountTable.footer}>
            <CheckCircle2 size={18} />
            No more quotes to load
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
