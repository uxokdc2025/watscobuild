import Link from "next/link";
import { DashboardShell } from "./_components/dashboard-shell";

export default function DashboardPage() {
  return <DashboardShell title="Dashboard" description="A single place to manage your account, purchasing tools, and orders.">
    <div className="grid gap-4 sm:grid-cols-2">
      {[['Shopping Lists','Save frequently ordered products for faster reordering.','/dashboard/shopping-lists'],['Saved Carts','Pick up where you left off with saved product selections.','/dashboard/saved-carts'],['Quotes','Review quotes shared with your account.','/dashboard/quotes'],['Open Orders','Track current orders and delivery status.','/dashboard/orders?status=open']].map(([title, body, href]) => <Link key={href} href={href} className="rounded-md border border-border bg-background p-5 shadow-sm transition-colors hover:border-primary"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{body}</p><span className="mt-5 inline-block text-sm font-semibold text-primary">Open {title} →</span></Link>)}
    </div>
  </DashboardShell>;
}
