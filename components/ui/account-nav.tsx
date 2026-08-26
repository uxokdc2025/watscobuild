import type { LucideIcon } from "lucide-react";
import { ChevronRight, FileText, LayoutDashboard, ListChecks, Truck, User } from "lucide-react";

import { cn } from "@/lib/utils";

export const ACCOUNT_NAV_ITEMS: ReadonlyArray<{ label: string; Icon: LucideIcon }> = [
  { label: "Dashboard", Icon: LayoutDashboard },
  { label: "Buying Tools", Icon: ListChecks },
  { label: "Quotes", Icon: FileText },
  { label: "Orders", Icon: Truck },
  { label: "Account", Icon: User },
];

export function AccountNav({
  ariaLabel = "Account navigation",
  onSelect,
  compact = false,
}: {
  ariaLabel?: string;
  onSelect?: (label: string) => void;
  compact?: boolean;
}) {
  return (
    <nav aria-label={ariaLabel} className="divide-y divide-border bg-background text-sm text-neutral-900">
      {ACCOUNT_NAV_ITEMS.map(({ label, Icon }) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect?.(label)}
          className={cn(
            "flex min-h-12 w-full items-center justify-between bg-background text-left text-neutral-900 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            compact ? "px-5" : "px-5",
          )}
        >
          <span className={cn("inline-flex items-center", compact ? "gap-3" : "gap-2")}>
            <Icon aria-hidden="true" className={cn("text-muted-foreground", compact ? "size-5" : "size-4")} />
            {label}
          </span>
          <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
        </button>
      ))}
    </nav>
  );
}
