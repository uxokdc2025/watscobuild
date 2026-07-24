"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { RelatedProduct } from "@/registry/new-york/blocks/product-detail/lib/products";
import { ProductCard } from "@/registry/new-york/blocks/product-detail/components/product-card";

export function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  return (
    <section aria-label="You may also like" className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          You May Also Like
        </h2>
      </div>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 pl-4 sm:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </section>
  );
}
