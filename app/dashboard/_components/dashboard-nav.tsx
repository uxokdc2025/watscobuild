import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  ListChecks,
  MapPin,
  ShoppingCart,
  Truck,
  Wrench,
} from "lucide-react";

/* ─────────────────────────── Dashboard sidebar nav — v1 / v2 ───────────────────────────
 * Presentational variants used by the /components/account-menus comparison page.
 * v1 (flat) mirrors the live nav in dashboard-shell.tsx exactly; that file stays
 * untouched. v2 (nested) groups "Shopping Lists" + "Saved Carts" under a static
 * "Buying Tools" group header with the two children indented beneath — matching the
 * real Homans dashboard sidebar. Everything else stays flat. Icons + active-state kept. */

type NavItem = { label: string; href: string; Icon: LucideIcon };

/* Flat list — identical to dashboard-shell.tsx's NAV. */
const FLAT: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Shopping Lists", href: "/dashboard/shopping-lists", Icon: ListChecks },
  { label: "Saved Carts", href: "/dashboard/saved-carts", Icon: ShoppingCart },
  { label: "Quotes", href: "/dashboard/quotes", Icon: FileText },
  { label: "Open Orders", href: "/dashboard/orders?status=open", Icon: Truck },
  { label: "Address Book", href: "/dashboard/addresses", Icon: MapPin },
  { label: "Card Management", href: "/dashboard/card-management", Icon: CreditCard },
];

/* Buying Tools children — the two rows that indent under the group header in v2. */
const BUYING_TOOLS: NavItem[] = [
  { label: "Shopping Lists", href: "/dashboard/shopping-lists", Icon: ListChecks },
  { label: "Saved Carts", href: "/dashboard/saved-carts", Icon: ShoppingCart },
];

/* Top-level rows for v2, with Buying Tools children removed. */
const NESTED_TOP: NavItem[] = FLAT.filter(
  (item) => !BUYING_TOOLS.some((child) => child.href === item.href),
);

function isActive(href: string, active: string) {
  return href.split("?")[0] === active;
}

function rowClass(active: boolean, indented = false) {
  return [
    "flex min-h-11 items-center gap-3 rounded-sm py-2 text-sm transition-colors hover:bg-muted hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    indented ? "pl-9 pr-3" : "px-3",
    active ? "bg-primary/10 font-semibold text-primary" : "",
  ].join(" ");
}

function Row({ item, active, indented }: { item: NavItem; active: boolean; indented?: boolean }) {
  const { label, href, Icon } = item;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={rowClass(active, indented)}
    >
      <Icon aria-hidden="true" className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <span>{label}</span>
    </Link>
  );
}

/** Version 1 — current flat dashboard sidebar. */
export function DashboardNavFlat({ active = "/dashboard" }: { active?: string }) {
  return (
    <nav aria-label="Account dashboard" className="h-fit rounded-md border border-border bg-background p-2 shadow-sm">
      {FLAT.map((item) => (
        <Row key={item.label} item={item} active={isActive(item.href, active)} />
      ))}
    </nav>
  );
}

/** Version 2 — nested: Buying Tools group header with the two children indented. */
export function DashboardNavNested({ active = "/dashboard" }: { active?: string }) {
  const childActive = BUYING_TOOLS.some((child) => isActive(child.href, active));
  return (
    <nav aria-label="Account dashboard" className="h-fit rounded-md border border-border bg-background p-2 shadow-sm">
      {NESTED_TOP.map((item, i) => (
        <div key={item.label}>
          <Row item={item} active={isActive(item.href, active)} />
          {/* Buying Tools group sits where Shopping Lists used to (after Dashboard). */}
          {i === 0 ? (
            <div className="mt-1">
              <p
                className={`flex min-h-11 items-center gap-3 rounded-sm px-3 py-2 text-sm font-semibold ${childActive ? "text-primary" : "text-foreground"}`}
              >
                <Wrench aria-hidden="true" className={`size-4 ${childActive ? "text-primary" : "text-muted-foreground"}`} />
                <span>Buying Tools</span>
              </p>
              {BUYING_TOOLS.map((child) => (
                <Row key={child.label} item={child} active={isActive(child.href, active)} indented />
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </nav>
  );
}
