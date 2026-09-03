"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Eye, RotateCcw, Truck } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { AccountTableToolbar, accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ORDERS = [
  ["10004", "Aug 16, 2026", "$605.00"],
  ["10003", "Aug 14, 2026", "$345.00"],
  ["10002", "Aug 14, 2026", "$345.00"],
  ["10001", "Aug 13, 2026", "$0.60"],
  ["10000", "Aug 13, 2026", "$102.90"],
];

export default function OrdersPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => ORDERS.filter(([number]) => number.includes(q.trim())),
    [q],
  );

  return (
    <DashboardShell
      title="Open Orders"
      description="Track orders, delivery progress, and recent purchasing activity."
    >
      <div className="space-y-3">
        <section className={accountTable.card}>
          <AccountTableToolbar
            value={q}
            onChange={setQ}
            placeholder="Search orders by Order # or PO #…"
          />
          <div className={accountTable.scroll}>
            <table className={`${accountTable.table} min-w-[760px]`}>
              <thead>
                <tr className={accountTable.headRow}>
                  <th className={accountTable.headCell}>Order</th>
                  <th className={accountTable.headCell}>Date</th>
                  <th className={accountTable.headCell}>Status</th>
                  <th className={accountTable.headCell}>Fulfillment</th>
                  <th className={`${accountTable.headCell} text-right`}>Total</th>
                  <th className={accountTable.headCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(([number, date, total]) => (
                  <tr key={number} className={accountTable.row}>
                    <td className={`${accountTable.cell} font-semibold text-primary`}>
                      {number}
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>
                      {date}
                    </td>
                    <td className={accountTable.cell}>
                      <Badge variant="secondary">open</Badge>
                    </td>
                    <td className={accountTable.cell}>
                      <Badge variant="outline">
                        <Truck aria-hidden="true" className="size-4" /> Standard
                      </Badge>
                    </td>
                    <td className={`${accountTable.cell} text-right font-semibold whitespace-nowrap`}>
                      {total}
                    </td>
                    <td className={accountTable.cell}>
                      <Button variant="ghost" size="icon" aria-label={`View order ${number}`}>
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Reorder ${number}`}
                        className="ml-1"
                      >
                        <RotateCcw size={17} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <div className="p-12 text-center text-muted-foreground">
              No orders found.
            </div>
          )}
          <div className={accountTable.footer}>
            <CheckCircle2 size={18} />
            No more orders to load
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
