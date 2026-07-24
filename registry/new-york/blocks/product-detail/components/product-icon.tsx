import { Layers, Package, Ruler, Shirt, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/registry/new-york/blocks/product-detail/lib/products";

const ICONS = {
  shirt: Shirt,
  sparkles: Sparkles,
  layers: Layers,
  ruler: Ruler,
  package: Package,
} as const;

/**
 * Placeholder visual for a product image. Renders a token-styled tile with a
 * lucide icon; swap for real imagery in a consumer app.
 */
export function ProductIcon({
  icon,
  className,
  iconClassName,
}: {
  icon: ProductImage["icon"];
  className?: string;
  iconClassName?: string;
}) {
  const Icon = ICONS[icon];
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}
    >
      <Icon className={cn("size-10", iconClassName)} aria-hidden />
    </div>
  );
}
