import { DashboardShell } from "./_components/dashboard-shell";

export default function DashboardPage() {
  return <DashboardShell title="Dashboard" description="A single place to manage your account, purchasing tools, and orders.">
    <div className="rounded-md border border-border bg-background p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-semibold">Welcome back</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">Use the account navigation to manage purchasing tools, orders, addresses, and payment methods.</p>
      <div className="mt-8 divide-y divide-border border-y border-border">
        <div className="flex items-center justify-between py-4 text-sm"><span className="text-muted-foreground">Account status</span><span className="font-medium">Active</span></div>
        <div className="flex items-center justify-between py-4 text-sm"><span className="text-muted-foreground">Default ship-to</span><span className="font-medium">Manchester, NH - Homans</span></div>
        <div className="flex items-center justify-between py-4 text-sm"><span className="text-muted-foreground">Current store</span><span className="font-medium">Manchester, NH</span></div>
      </div>
    </div>
  </DashboardShell>;
}
