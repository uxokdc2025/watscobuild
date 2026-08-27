import { DashboardShell } from "../_components/dashboard-shell";

export default function OrdersPage() {
  return <DashboardShell title="Open Orders" description="Track orders, delivery progress, and recent purchasing activity.">
    <div className="overflow-x-auto rounded-lg border bg-background shadow-sm"><table className="w-full min-w-[680px] text-sm"><thead><tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-5 py-4">Order</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Fulfillment</th><th className="px-5 py-4 text-right">Total</th></tr></thead><tbody>{[["10004", "Aug 15, 2026", "$605.00"], ["10003", "Aug 13, 2026", "$345.00"], ["10002", "Aug 13, 2026", "$345.00"]].map(([number, date, total]) => <tr key={number} className="border-b last:border-0"><td className="px-5 py-4 font-semibold text-primary">{number}</td><td className="px-5 py-4">{date}</td><td className="px-5 py-4"><span className="rounded bg-muted px-2 py-1 text-xs font-semibold">open</span></td><td className="px-5 py-4">Standard</td><td className="px-5 py-4 text-right font-semibold">{total}</td></tr>)}</tbody></table></div>
  </DashboardShell>;
}
