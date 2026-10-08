import Image from "next/image";
import {
  Fan,
  Flame,
  Home,
  Snowflake,
  Wind,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { ComponentKind, SystemType } from "./data";

/* System-type icon (builder cards). */
const SYSTEM_ICON: Record<SystemType["icon"], LucideIcon> = {
  flame: Flame,
  fan: Fan,
  snowflake: Snowflake,
  home: Home,
};

export function SystemTypeIcon({
  icon,
  className,
}: {
  icon: SystemType["icon"];
  className?: string;
}) {
  const Icon = SYSTEM_ICON[icon];
  return <Icon className={className} aria-hidden />;
}

/* Component-kind icon (thumb fallback + role chips). */
const KIND_ICON: Record<ComponentKind, LucideIcon> = {
  outdoor: Wind,
  coil: Snowflake,
  furnace: Flame,
  "air-handler": Fan,
};

/** Product thumbnail — real image when we have one, otherwise an elegant soft
 *  tile with the component-kind glyph (never a broken image or empty box). */
export function ThumbTile({
  kind,
  src,
  alt,
  className,
}: {
  kind: ComponentKind;
  src?: string;
  alt: string;
  className?: string;
}) {
  const Icon = KIND_ICON[kind];
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-xl border bg-gradient-to-br from-muted/40 to-muted/70",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="160px"
          className="object-contain p-2"
        />
      ) : (
        <Icon className="size-1/3 text-muted-foreground/50" aria-hidden />
      )}
    </div>
  );
}

/** A compact rating pill: label over value, used in the spec strip. */
export function SpecPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[4.5rem] flex-col rounded-lg border px-3 py-2",
        accent
          ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40"
          : "bg-muted/30",
      )}
    >
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-bold tabular-nums",
          accent && "text-blue-800 dark:text-blue-300",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** Inventory line — the canonical two-line stock block shared by product cards
 *  and every list view: green "N in {branch}" on-hand line + a primary-blue
 *  "N Nearby Branch" link. Mirrors <ProductCard> exactly so stock reads
 *  identically across the storefront. */
export function InventoryLine({
  branchQty,
  branchName,
  allBranchesQty,
  className,
}: {
  branchQty: number;
  branchName: string;
  allBranchesQty: number;
  className?: string;
}) {
  const inStock = branchQty > 0;
  return (
    <div className={cn("flex flex-col gap-0.5 text-xs font-medium leading-4", className)}>
      <span className={cn("truncate", inStock ? "text-in-stock" : "text-low-stock")}>
        {inStock
          ? `${branchQty.toLocaleString()} in ${branchName}`
          : `Available to order · ${branchName}`}
      </span>
      <a
        href="/store-locator/inventory/in-plp?v=c"
        className="truncate text-primary underline-offset-2 transition-colors hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {allBranchesQty.toLocaleString()} Nearby Branch
      </a>
    </div>
  );
}
