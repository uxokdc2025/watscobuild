"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Info, Truck } from "lucide-react";
import { DashboardShell } from "./_components/dashboard-shell";
import { AccountSearchInput } from "./_components/account-table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle } from "@/components/ui/alert";

type Order = { number: string; date: string; total: string };

const ORDERS: Order[] = [
  { number: "10004", date: "Aug 15, 2026", total: "$605.00" },
  { number: "10003", date: "Aug 13, 2026", total: "$345.00" },
  { number: "10002", date: "Aug 13, 2026", total: "$345.00" },
  { number: "10001", date: "Aug 12, 2026", total: "$0.60" },
  { number: "10000", date: "Aug 12, 2026", total: "$102.90" },
];

function SectionHeading({ id, title, href }: { id: string; title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 id={id} className="text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {href ? (
        <Link href={href} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          View all <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const visibleOrders = useMemo(
    () => ORDERS.filter((order) => order.number.includes(orderQuery.trim())),
    [orderQuery],
  );

  const showList = "test".includes(listQuery.trim().toLowerCase());

  return (
    <DashboardShell title="Dashboard" description="A single place to manage your account, purchasing tools, and orders.">
      <div className="space-y-6">
        <section aria-labelledby="recent-orders-heading" className="rounded-lg border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeading id="recent-orders-heading" title="Recent Orders" href="/dashboard/orders" />
          <div className="mt-4">
            <AccountSearchInput value={orderQuery} onChange={setOrderQuery} placeholder="Search by Order # or PO #" />
          </div>
          <Alert className="mt-4">
            <Info aria-hidden="true" className="size-4 shrink-0" />
            <AlertTitle>{visibleOrders.length} Orders Available</AlertTitle>
          </Alert>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-[13px]">
              <thead><tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-2 py-3">Order</th><th className="px-2 py-3">Date</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Fulfillment</th><th className="px-2 py-3 text-right">Total</th></tr></thead>
              <tbody>
                {visibleOrders.length ? visibleOrders.map((order) => (
                  <tr key={order.number} className="border-b last:border-0">
                    <td className="px-2 py-3"><Link href="/dashboard/orders" className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{order.number}</Link></td>
                    <td className="px-2 py-3 whitespace-nowrap">{order.date}</td>
                    <td className="px-2 py-3"><Badge variant="secondary">open</Badge></td>
                    <td className="px-2 py-3"><Badge variant="outline"><Truck aria-hidden="true" className="size-4" /> Standard</Badge></td>
                    <td className="px-2 py-3 text-right font-semibold whitespace-nowrap">{order.total}</td>
                  </tr>
                )) : <tr><td colSpan={5} className="px-2 py-8 text-center text-sm text-muted-foreground">No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="shopping-lists-heading" className="rounded-lg border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeading id="shopping-lists-heading" title="My Shopping Lists" href="/dashboard/shopping-lists" />
          <div className="mt-4">
            <AccountSearchInput value={listQuery} onChange={setListQuery} placeholder="Search lists by name…" />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13px]"><colgroup><col className="w-[28%]" /><col /><col /><col /></colgroup>
              <thead><tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-2 py-3">Name</th><th className="px-2 py-3">Products</th><th className="px-2 py-3">Latest Activity</th><th className="px-2 py-3">Created By</th></tr></thead>
              <tbody>{showList ? <tr><td className="px-2 py-3 font-semibold text-primary">test</td><td className="px-2 py-3">4</td><td className="px-2 py-3 whitespace-nowrap">12/31/1969 at 6:00 PM</td><td className="px-2 py-3 whitespace-nowrap">David Whiteside</td></tr> : <tr><td colSpan={4} className="px-2 py-8 text-center text-muted-foreground">No shopping lists found.</td></tr>}</tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="recent-quotes-heading" className="rounded-lg border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeading id="recent-quotes-heading" title="Recent Quotes" href="/dashboard/quotes" />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-[13px]"><thead><tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-2 py-3">Quote #</th><th className="px-2 py-3">PO #</th><th className="px-2 py-3">Created</th><th className="px-2 py-3">Expires</th><th className="px-2 py-3">Last Updated</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Buyer</th><th className="px-2 py-3">Buyer Email</th><th className="px-2 py-3">Subtotal</th></tr></thead>
              <tbody><tr className="border-b"><td className="px-2 py-3 font-semibold text-primary">Q-2026-0184</td><td className="px-2 py-3">—</td><td className="px-2 py-3">Aug 20, 2026</td><td className="px-2 py-3">Sep 20, 2026</td><td className="px-2 py-3">Today</td><td className="px-2 py-3"><Badge variant="soft" color="green">Active</Badge></td><td className="px-2 py-3">David Whiteside</td><td className="px-2 py-3">—</td><td className="px-2 py-3 text-right font-semibold">$1,248.00</td></tr></tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
