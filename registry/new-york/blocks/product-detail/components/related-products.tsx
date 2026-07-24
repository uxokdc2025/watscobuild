import type { RelatedProduct } from "@/registry/new-york/blocks/product-detail/lib/products";
import { ProductCard } from "@/registry/new-york/blocks/product-detail/components/product-card";

export function RelatedProducts({
  products,
  title = "You May Also Like",
}: {
  products: RelatedProduct[];
  title?: string;
}) {
  return (
    <section aria-label="You may also like" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          You May Also Like
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-balance">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
