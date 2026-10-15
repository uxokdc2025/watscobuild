import { DashboardShell } from "./_components/dashboard-shell";
import { DashboardHome } from "./_components/dashboard-home";

export default function DashboardPage() {
  return (
    <DashboardShell title="Dashboard" description="A single place to manage your account, purchasing tools, and orders.">
      <DashboardHome />
    </DashboardShell>
  );
}
