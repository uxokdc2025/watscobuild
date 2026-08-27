"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Info, RotateCcw, Search, Truck } from "lucide-react";
import { DashboardShell } from "./_components/dashboard-shell";

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
  const [submittedOrderQuery, setSubmittedOrderQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const visibleOrders = useMemo(
    () => ORDERS.filter((order) => order.number.includes(submittedOrderQuery.trim())),
    [submittedOrderQuery],
  );

  function searchOrders(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedOrderQuery(orderQuery);
  }

  function resetOrders() {
    setOrderQuery("");
    setSubmittedOrderQuery("");
  }

  const showList = "test".includes(listQuery.trim().toLowerCase());

  return (
    <DashboardShell title="Dashboard" description="A single place to manage your account, purchasing tools, and orders.">
      <div className="space-y-6">
        <section aria-labelledby="find-order-heading" className="rounded-lg border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeading id="find-order-heading" title="Find an Order" />
          <form onSubmit={searchOrders} className="mt-5 max-w-xl">
            <label htmlFor="order-search" className="text-sm font-medium">Search</label>
            <div className="relative mt-2">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input id="order-search" value={orderQuery} onChange={(event) => setOrderQuery(event.target.value)} placeholder="Search by Order # or PO #" className="min-h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Search aria-hidden="true" className="size-4" /> Search
              </button>
              <button type="button" onClick={resetOrders} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <RotateCcw aria-hidden="true" className="size-4" /> Reset
              </button>
            </div>
          </form>
        </section>

        <section aria-labelledby="recent-orders-heading" className="rounded-lg border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeading id="recent-orders-heading" title="Recent Orders" href="/dashboard/orders" />
          <div className="mt-4 flex items-center gap-3 rounded-md bg-primary px-4 py-4 text-sm font-semibold text-primary-foreground">
            <Info aria-hidden="true" className="size-4 shrink-0" /> {visibleOrders.length} Orders Available
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead><tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-2 py-3">Order</th><th className="px-2 py-3">Date</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Fulfillment</th><th className="px-2 py-3 text-right">Total</th></tr></thead>
              <tbody>
                {visibleOrders.length ? visibleOrders.map((order) => (
                  <tr key={order.number} className="border-b last:border-0">
                    <td className="px-2 py-4"><Link href="/dashboard/orders" className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{order.number}</Link></td>
                    <td className="px-2 py-4 whitespace-nowrap">{order.date}</td>
                    <td className="px-2 py-4"><span className="inline-flex rounded bg-muted px-2 py-1 text-xs font-semibold">open</span></td>
                    <td className="px-2 py-4"><span className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold"><Truck aria-hidden="true" className="size-4" /> Standard</span></td>
                    <td className="px-2 py-4 text-right font-semibold whitespace-nowrap">{order.total}</td>
                  </tr>
                )) : <tr><td colSpan={5} className="px-2 py-8 text-center text-sm text-muted-foreground">No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="shopping-lists-heading" className="rounded-lg border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeading id="shopping-lists-heading" title="My Shopping Lists" href="/dashboard/shopping-lists" />
          <form onSubmit={(event) => event.preventDefault()} className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <label htmlFor="list-search" className="sr-only">Search lists by name</label>
            <input id="list-search" value={listQuery} onChange={(event) => setListQuery(event.target.value)} placeholder="Search lists by name..." className="min-h-11 rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring sm:w-64" />
            <button type="submit" className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Search</button>
          </form>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead><tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-2 py-3">Name</th><th className="px-2 py-3">Products</th><th className="px-2 py-3">Latest Activity</th><th className="px-2 py-3">Created By</th></tr></thead>
              <tbody>{showList ? <tr><td className="px-2 py-4 font-semibold text-primary">test</td><td className="px-2 py-4">4</td><td className="px-2 py-4 whitespace-nowrap">12/31/1969 at 6:00 PM</td><td className="px-2 py-4 whitespace-nowrap">David Whiteside</td></tr> : <tr><td colSpan={4} className="px-2 py-8 text-center text-muted-foreground">No shopping lists found.</td></tr>}</tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="recent-quotes-heading" className="rounded-lg border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeading id="recent-quotes-heading" title="Recent Quotes" href="/dashboard/quotes" />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead><tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-2 py-3">Quote #</th><th className="px-2 py-3">PO #</th><th className="px-2 py-3">Created</th><th className="px-2 py-3">Expires</th><th className="px-2 py-3">Last Updated</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Buyer</th><th className="px-2 py-3">Buyer Email</th><th className="px-2 py-3">Subtotal</th></tr></thead>
              <tbody><tr className="border-b"><td className="px-2 py-4 font-semibold text-primary">Q-2026-0184</td><td className="px-2 py-4">—</td><td className="px-2 py-4">Aug 20, 2026</td><td className="px-2 py-4">Sep 20, 2026</td><td className="px-2 py-4">Today</td><td className="px-2 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Active</span></td><td className="px-2 py-4">David Whiteside</td><td className="px-2 py-4">—</td><td className="px-2 py-4 text-right font-semibold">$1,248.00</td></tr></tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
