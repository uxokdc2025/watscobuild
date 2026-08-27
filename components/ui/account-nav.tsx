import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { CreditCard, FileText, LayoutDashboard, ListChecks, MapPin, ShoppingCart, Truck } from "lucide-react";

import { cn } from "@/lib/utils";

export const ACCOUNT_NAV_ITEMS: ReadonlyArray<{ label: string; href: string; Icon: LucideIcon }> = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Shopping Lists", href: "/dashboard/shopping-lists", Icon: ListChecks },
  { label: "Saved Carts", href: "/dashboard/saved-carts", Icon: ShoppingCart },
  { label: "Quotes", href: "/dashboard/quotes", Icon: FileText },
  { label: "Open Orders", href: "/dashboard/orders?status=open", Icon: Truck },
  { label: "Address Book", href: "/dashboard/addresses", Icon: MapPin },
  { label: "Card Management", href: "/dashboard/card-management", Icon: CreditCard },
];

export function AccountNav({
  ariaLabel = "Account navigation",
  onNavigate,
  compact = false,
}: {
  ariaLabel?: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <nav aria-label={ariaLabel} className="divide-y divide-border border-b border-border bg-background text-sm text-foreground">
      {ACCOUNT_NAV_ITEMS.map(({ label, href, Icon }) => (
        <Link
          key={label}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex min-h-12 w-full items-center justify-between bg-background text-left text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            compact ? "px-5" : "px-5",
          )}
        >
          <span className={cn("inline-flex items-center text-foreground", compact ? "gap-3" : "gap-2")}>
            <Icon aria-hidden="true" className={cn("text-muted-foreground", compact ? "size-5" : "size-4")} />
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
