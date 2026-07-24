import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatPrice,
  type RelatedProduct,
} from "@/registry/new-york/blocks/product-detail/lib/products";
import { ProductIcon } from "@/registry/new-york/blocks/product-detail/components/product-icon";
import { StarRating } from "@/registry/new-york/blocks/product-detail/components/star-rating";

export function ProductCard({ product }: { product: RelatedProduct }) {
  const onSale = product.originalPrice != null;

  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="flex flex-col gap-3 p-0">
        <a
          href="#"
          className="flex flex-col gap-3 rounded-xl outline-none"
          aria-label={product.name}
        >
          <div className="aspect-square overflow-hidden border-b bg-muted">
            <ProductIcon
              icon={product.icon}
              className="size-full rounded-none"
              iconClassName="size-12"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-4 pb-4">
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              {product.category}
            </span>
            <h3 className="text-sm font-medium">{product.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <StarRating rating={product.rating} starClassName="[&_svg]:size-3.5" />
              <span>({product.reviewCount})</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-semibold",
                  onSale ? "text-sale-price" : "text-price"
                )}
              >
                {formatPrice(product.price)}
              </span>
              {onSale ? (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              ) : null}
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}
