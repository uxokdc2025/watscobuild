"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ClipboardCheck,
  CreditCard,
  FileSignature,
  FileText,
  LayoutDashboard,
  Link2,
  ListChecks,
  MapPin,
  PackageSearch,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavLeaf = { label: string; href: string; Icon?: LucideIcon };
type NavGroup = { group: string; Icon: LucideIcon; href?: string; children: NavLeaf[] };
type NavEntry = NavLeaf | NavGroup;

/* Grouped account nav — mirrors the Homans reference sidebar:
   Dashboard · Buying Tools · Quotes · Orders · Account · Company. */
const NAV: NavEntry[] = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  {
    group: "Buying Tools",
    Icon: Wrench,
    children: [
      { label: "Shopping Lists", href: "/dashboard/shopping-lists", Icon: ListChecks },
      { label: "Saved Carts", href: "/dashboard/saved-carts", Icon: ShoppingCart },
      { label: "Proposals", href: "/dashboard/proposals", Icon: FileSignature },
      { label: "Order Approval", href: "/dashboard/pending-orders", Icon: ClipboardCheck },
    ],
  },
  { label: "Quotes", href: "/dashboard/quotes", Icon: FileText },
  {
    group: "Orders",
    Icon: Truck,
    href: "/dashboard/orders",
    children: [{ label: "Open Orders", href: "/dashboard/orders?status=open", Icon: PackageSearch }],
  },
  {
    group: "Account",
    Icon: User,
    children: [
      { label: "Address Book", href: "/dashboard/addresses", Icon: MapPin },
      { label: "Card Management", href: "/dashboard/card-management", Icon: CreditCard },
    ],
  },
  {
    group: "Company",
    Icon: Building2,
    children: [
      { label: "Linked Accounts", href: "/dashboard/linked-accounts", Icon: Link2 },
      { label: "Company Users", href: "/dashboard/company-users", Icon: Users },
      { label: "Roles and Permissions", href: "/dashboard/roles", Icon: ShieldCheck },
    ],
  },
];

function isGroup(e: NavEntry): e is NavGroup {
  return (e as NavGroup).children !== undefined;
}

function NavRow({
  label,
  href,
  Icon,
  active,
  indented,
}: {
  label: string;
  href: string;
  Icon?: LucideIcon;
  active: boolean;
  indented?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-sm py-2 text-sm transition-colors hover:bg-muted hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${indented ? "pl-9 pr-3" : "px-3"} ${active ? "bg-primary/10 font-semibold text-primary" : ""}`}
    >
      {Icon ? (
        <Icon aria-hidden="true" className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
      ) : (
        <span aria-hidden="true" className="size-4" />
      )}
      <span>{label}</span>
    </Link>
  );
}

export function DashboardShell({ title, actions, breadcrumb, children }: { title: string; description?: string; actions?: React.ReactNode; breadcrumb?: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href.split("?")[0];
  return (
    <main className="min-h-svh bg-muted/30 text-foreground">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-3 md:px-6 md:py-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            {breadcrumb ?? <Link href="/search?q=blower%20motor&signedin=1" className="text-sm text-primary hover:underline">← Back to shopping</Link>}
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Account dashboard" className="h-fit rounded-md border border-border bg-background p-2 shadow-sm">
            {NAV.map((entry) => {
              if (!isGroup(entry)) {
                return <NavRow key={entry.href} {...entry} active={isActive(entry.href)} />;
              }
              const { group, Icon, href, children } = entry;
              const childActive = children.some((c) => isActive(c.href));
              const headerActive = href ? isActive(href) : false;
              return (
                <div key={group} className="mt-1 first:mt-0">
                  {href ? (
                    <NavRow label={group} href={href} Icon={Icon} active={headerActive} />
                  ) : (
                    <p className={`flex min-h-11 items-center gap-3 rounded-sm px-3 py-2 text-sm font-semibold ${childActive ? "text-primary" : "text-foreground"}`}>
                      <Icon aria-hidden="true" className={`size-4 ${childActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{group}</span>
                    </p>
                  )}
                  {children.map((c) => (
                    <NavRow key={c.href} {...c} active={isActive(c.href)} indented />
                  ))}
                </div>
              );
            })}
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
