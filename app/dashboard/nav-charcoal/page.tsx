"use client";

import Link from "next/link";
import { ArrowUpRight, Package, ShoppingCart, FileText } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { accountTable } from "../_components/account-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* Second navigation style — the dashboard side nav reversed out on a charcoal
   panel (white text + icons, AA-compliant). Everything to the right of the nav
   is the standard account UI, shown here so the dark nav reads in real context.
   The only difference from the live dashboard is navVariant="charcoal". */

type Stat = { label: string; value: string; Icon: typeof Package };
const STATS: Stat[] = [
  { label: "Open Orders", value: "4", Icon: Package },
  { label: "Saved Carts", value: "3", Icon: ShoppingCart },
  { label: "Open Quotes", value: "2", Icon: FileText },
];

type Order = { number: string; date: string; total: string; status: string };
const ORDERS: Order[] = [
  { number: "10004", date: "Aug 15, 2026", total: "$605.00", status: "OPEN" },
  { number: "10003", date: "Aug 13, 2026", total: "$345.00", status: "OPEN" },
  { number: "10001", date: "Aug 08, 2026", total: "$1,240.00", status: "INVOICED" },
];

export default function NavCharcoalPreview() {
  return (
    <DashboardShell
      navVariant="charcoal"
      activeHref="/dashboard"
      title="Dashboard"
      actions={
        <Button asChild variant="outline">
          <Link href="/dashboard?signedin=1">
            View Default Nav
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Second navigation style.</span>{" "}
          The side nav is reversed out on a charcoal panel — white text and icons,
          AA-compliant contrast. The rest of the account UI is unchanged.
        </div>

        {/* Summary stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-md border bg-background p-4 shadow-sm">
              <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                <s.Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-2xl font-bold leading-none">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <section className="rounded-md border bg-background shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Recent Orders</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/orders?signedin=1">View All</Link>
            </Button>
          </div>
          <table className={accountTable.table}>
            <thead>
              <tr className={accountTable.headRow}>
                <th className={accountTable.headCell}>Order #</th>
                <th className={accountTable.headCell}>Date</th>
                <th className={accountTable.headCell}>Total</th>
                <th className={accountTable.headCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.number} className={accountTable.row}>
                  <td className={`${accountTable.cell} font-semibold text-primary`}>{o.number}</td>
                  <td className={`${accountTable.cell} whitespace-nowrap text-muted-foreground`}>{o.date}</td>
                  <td className={accountTable.cell}>{o.total}</td>
                  <td className={accountTable.cell}>
                    <Badge variant="soft" color={o.status === "OPEN" ? "blue" : "green"}>{o.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardShell>
  );
}
