"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, FileText, Truck, MapPin, CreditCard, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Shopping Lists", href: "/dashboard/shopping-lists", Icon: ListChecks },
  { label: "Saved Carts", href: "/dashboard/saved-carts", Icon: ShoppingCart },
  { label: "Quotes", href: "/dashboard/quotes", Icon: FileText },
  { label: "Open Orders", href: "/dashboard/orders?status=open", Icon: Truck },
  { label: "Address Book", href: "/dashboard/addresses", Icon: MapPin },
  { label: "Card Management", href: "/dashboard/card-management", Icon: CreditCard },
] as const;

export function DashboardShell({ title, actions, breadcrumb, children }: { title: string; description?: string; actions?: React.ReactNode; breadcrumb?: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="min-h-svh bg-muted/30 text-foreground">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-4 md:px-6 md:py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            {breadcrumb ?? <Link href="/search?q=blower%20motor&signedin=1" className="text-sm text-primary hover:underline">← Back to shopping</Link>}
            <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-[205px_1fr]">
          <nav aria-label="Account dashboard" className="h-fit rounded-md border border-border bg-background p-2 shadow-sm">
            {NAV.map(({ label, href, Icon }) => (
              <Link key={href} href={href} aria-current={pathname === href.split("?")[0] ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-muted hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${pathname === href.split("?")[0] ? "bg-primary/10 font-semibold text-primary" : ""}`}>
                <Icon aria-hidden="true" className={`size-4 ${pathname === href.split("?")[0] ? "text-primary" : "text-muted-foreground"}`} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}

export function EmptyState({ title, body, action, href }: { title: string; body: string; action?: string; href?: string }) {
  return <div className="rounded-md border border-dashed border-border bg-background px-6 py-14 text-center shadow-sm"><h2 className="text-xl font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>{action && href ? <Button asChild size="lg" className="mt-6 min-h-11"><Link href={href}>{action}</Link></Button> : null}</div>;
}
