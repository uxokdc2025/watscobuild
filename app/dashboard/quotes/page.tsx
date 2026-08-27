import { DashboardShell } from "../_components/dashboard-shell";

export default function QuotesPage() {
  return <DashboardShell title="Quotes" description="Review pricing and quote details in one clear, searchable view.">
    <div className="overflow-x-auto rounded-lg border bg-background shadow-sm"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-5 py-4">Quote #</th><th className="px-5 py-4">Created</th><th className="px-5 py-4">Expires</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Buyer</th><th className="px-5 py-4 text-right">Subtotal</th></tr></thead><tbody><tr><td className="px-5 py-4 font-semibold text-primary">Q-2026-0184</td><td className="px-5 py-4">Aug 20, 2026</td><td className="px-5 py-4">Sep 20, 2026</td><td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Active</span></td><td className="px-5 py-4">David Whiteside</td><td className="px-5 py-4 text-right font-semibold">$1,248.00</td></tr></tbody></table></div>
  </DashboardShell>;
}
