"use client";

import { DashboardShell } from "../_components/dashboard-shell";
import { Badge } from "@/components/ui/badge";

const QUOTES = [
  { quote: "Q-2026-0184", po: "PO-4819", created: "Aug 20, 2026", expires: "Sep 20, 2026", updated: "Today", buyer: "David Whiteside", email: "david@whitesidemechanical.com", subtotal: "$1,248.00" },
  { quote: "Q-2026-0172", po: "PO-4798", created: "Aug 12, 2026", expires: "Sep 12, 2026", updated: "Aug 18, 2026", buyer: "David Whiteside", email: "david@whitesidemechanical.com", subtotal: "$605.00" },
  { quote: "Q-2026-0159", po: "—", created: "Aug 04, 2026", expires: "Sep 04, 2026", updated: "Aug 11, 2026", buyer: "David Whiteside", email: "david@whitesidemechanical.com", subtotal: "$345.00" },
];

export default function QuotesPage() {
  return (
    <DashboardShell title="Quotes" description="Review pricing and quote details in one clear, searchable view.">
      <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
        <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-semibold">Recent quotes</h2>
            <p className="mt-1 text-sm text-muted-foreground">Quotes saved for your account.</p>
          </div>
          <span className="text-sm text-muted-foreground">{QUOTES.length} quotes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b bg-muted/20 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 text-[11px]">Quote #</th><th className="px-5 py-3 text-[11px]">PO #</th><th className="px-5 py-3 text-[11px]">Created</th><th className="px-5 py-3 text-[11px]">Expires</th><th className="px-5 py-3 text-[11px]">Last Updated</th><th className="px-5 py-3 text-[11px]">Status</th><th className="px-5 py-3 text-[11px]">Buyer</th><th className="px-5 py-3 text-[11px]">Buyer Email</th><th className="px-5 py-3 text-right text-[11px]">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {QUOTES.map((item) => (
                <tr key={item.quote} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-5 py-3 font-semibold text-primary">{item.quote}</td><td className="px-5 py-3">{item.po}</td><td className="px-5 py-3 whitespace-nowrap">{item.created}</td><td className="px-5 py-3 whitespace-nowrap">{item.expires}</td><td className="px-5 py-3 whitespace-nowrap">{item.updated}</td><td className="px-5 py-3"><Badge variant="soft" color="green">Active</Badge></td><td className="px-5 py-3 whitespace-nowrap">{item.buyer}</td><td className="px-5 py-3">{item.email}</td><td className="px-5 py-3 text-right font-semibold whitespace-nowrap">{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-5 py-3 text-sm text-muted-foreground"><span>Showing 1–{QUOTES.length} of {QUOTES.length}</span><span>Updated today</span></div>
      </div>
    </DashboardShell>
  );
}
