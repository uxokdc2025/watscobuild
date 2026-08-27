import { CreditCard } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";

export default function CardManagementPage() {
  return <DashboardShell title="Card Management" description="Manage payment methods securely for your account.">
    <div className="max-w-xl rounded-lg border bg-background p-5 shadow-sm"><div className="flex items-start gap-4"><div className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary"><CreditCard aria-hidden="true" className="size-5" /></div><div><h2 className="font-semibold">Business Visa ending in 4242</h2><p className="mt-1 text-sm text-muted-foreground">Expires 08/28 · Default for checkout</p></div></div><div className="mt-5 border-t pt-4 text-sm text-muted-foreground">Payment details are securely managed for Homans account #509973.</div></div>
  </DashboardShell>;
}
