"use client";

import { FormEvent, useMemo, useState } from "react";
import { Info, RotateCcw, Search, Truck } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";

const ORDERS = [
  ["10004", "Aug 16, 2026", "$605.00"],
  ["10003", "Aug 14, 2026", "$345.00"],
  ["10002", "Aug 14, 2026", "$345.00"],
  ["10001", "Aug 13, 2026", "$0.60"],
  ["10000", "Aug 13, 2026", "$102.90"],
];

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const visibleOrders = useMemo(() => ORDERS.filter(([number]) => number.includes(submittedQuery.trim())), [submittedQuery]);
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmittedQuery(query); }
  function reset() { setQuery(""); setSubmittedQuery(""); }

  return (
    <DashboardShell title="Open Orders" description="Track orders, delivery progress, and recent purchasing activity.">
      <div className="space-y-4">
        <section aria-labelledby="order-search-heading" className="w-full max-w-2xl rounded-lg border bg-background p-4 shadow-sm sm:p-5">
          <h2 id="order-search-heading" className="sr-only">Find an order</h2>
          <form onSubmit={search} className="max-w-md">
            <label htmlFor="open-order-search" className="sr-only">Search orders by Order # or PO #</label>
            <div className="relative mt-2"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="open-order-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by Order # or PO #" className="min-h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /></div>
            <div className="mt-4 flex flex-wrap gap-3"><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Search aria-hidden="true" className="size-4" /> Search</button><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary px-5 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RotateCcw aria-hidden="true" className="size-4" /> Reset</button></div>
          </form>
        </section>
        <section aria-labelledby="open-orders-heading" className="rounded-lg border bg-background p-4 shadow-sm sm:p-6">
          <h2 id="open-orders-heading" className="sr-only">Open order results</h2>
          <div className="flex items-center gap-3 rounded-md bg-brand-homans px-4 py-4 text-sm font-semibold text-brand-homans-foreground"><Info aria-hidden="true" className="size-4 shrink-0" /> {visibleOrders.length} Orders Available</div>
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] table-fixed border-collapse text-[13px]"><colgroup><col className="w-1/5" /><col className="w-1/5" /><col className="w-1/5" /><col className="w-1/5" /><col className="w-1/5" /></colgroup><thead><tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-2 py-3">Order</th><th className="px-2 py-3">Date</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Fulfillment</th><th className="px-2 py-3 text-right">Total</th></tr></thead><tbody>{visibleOrders.map(([number, date, total]) => <tr key={number} className="border-b last:border-0"><td className="px-2 py-3 font-semibold text-primary">{number}</td><td className="px-2 py-3 whitespace-nowrap">{date}</td><td className="px-2 py-3"><span className="rounded bg-muted px-2 py-1 text-xs font-semibold">open</span></td><td className="px-2 py-3"><span className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold"><Truck aria-hidden="true" className="size-4" /> Standard</span></td><td className="px-2 py-3 text-right font-semibold whitespace-nowrap">{total}</td></tr>)}</tbody></table></div>
          <div className="flex justify-end gap-2 pt-4 text-sm text-muted-foreground"><span>Show</span><span className="font-medium text-foreground">18</span><span>⌄</span><span>Per page</span></div>
        </section>
      </div>
    </DashboardShell>
  );
}
