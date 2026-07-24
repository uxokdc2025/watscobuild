import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  type RelatedProduct,
} from "@/registry/new-york/blocks/product-detail/lib/products";
import {
  FOCUS_RING,
  TRANSITION,
} from "@/registry/new-york/blocks/product-detail/lib/motion";
import { ProductIcon } from "@/registry/new-york/blocks/product-detail/components/product-icon";

export function ProductCard({ product }: { product: RelatedProduct }) {
  const onSale = product.originalPrice != null;
  const trending = product.badge?.toLowerCase() === "trending";

  return (
    <a
      href="#"
      aria-label={product.name}
      className={cn("group flex flex-col gap-3 rounded-2xl", FOCUS_RING)}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <ProductIcon
          icon={product.icon}
          className={cn(
            "size-full rounded-none",
            TRANSITION,
            "motion-safe:group-hover:scale-105"
          )}
          iconClassName="size-12"
        />
        {product.badge ? (
          <Badge
            className={cn(
              "absolute top-3 right-3",
              trending
                ? "bg-sale-price text-primary-foreground"
                : "bg-foreground text-background"
            )}
          >
            {product.badge}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {product.category}
          {product.subcategory ? ` • ${product.subcategory}` : ""}
        </span>
        <h3 className="font-semibold">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-price">
            {formatPrice(product.price)}
          </span>
          {onSale ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
