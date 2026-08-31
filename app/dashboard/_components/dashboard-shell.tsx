"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, FileText, Truck, MapPin, CreditCard, ShoppingCart } from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Shopping Lists", href: "/dashboard/shopping-lists", Icon: ListChecks },
  { label: "Saved Carts", href: "/dashboard/saved-carts", Icon: ShoppingCart },
  { label: "Quotes", href: "/dashboard/quotes", Icon: FileText },
  { label: "Open Orders", href: "/dashboard/orders?status=open", Icon: Truck },
  { label: "Address Book", href: "/dashboard/addresses", Icon: MapPin },
  { label: "Card Management", href: "/dashboard/card-management", Icon: CreditCard },
] as const;

export function DashboardShell({ title, description, actions, children }: { title: string; description: string; actions?: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="min-h-svh bg-brand-homans-bg text-foreground">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-4 md:px-6 md:py-8">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <Link href="/search?q=blower%20motor&signedin=1" className="text-sm text-primary hover:underline">← Back to shopping</Link>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {actions ? <div className="shrink-0 translate-y-4">{actions}</div> : null}
          </div>
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
  return <div className="rounded-md border border-dashed border-border bg-background px-6 py-14 text-center shadow-sm"><h2 className="text-xl font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>{action && href ? <Link href={href} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{action}</Link> : null}</div>;
}
