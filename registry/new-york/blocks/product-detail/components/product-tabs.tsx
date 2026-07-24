"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/registry/new-york/blocks/product-detail/components/star-rating";
import type { Product } from "@/registry/new-york/blocks/product-detail/lib/products";

export function ProductTabs({ product }: { product: Product }) {
  return (
    <section id="reviews" aria-label="Product details" className="scroll-mt-24">
      <Tabs defaultValue="description" className="gap-6">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">Specs</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Description */}
        <TabsContent
          value="description"
          className="flex max-w-prose flex-col gap-4 text-sm leading-relaxed text-muted-foreground"
        >
          {product.longDescription.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </TabsContent>

        {/* Specs */}
        <TabsContent value="specs">
          <dl className="max-w-prose divide-y">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
              >
                <dt className="text-sm font-medium">{spec.label}</dt>
                <dd className="text-sm text-muted-foreground">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>

        {/* Shipping */}
        <TabsContent value="shipping">
          <ul className="flex max-w-prose flex-col gap-2 text-sm text-muted-foreground">
            {product.shipping.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold">{product.rating.toFixed(1)}</span>
            <div className="flex flex-col gap-1">
              <StarRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">
                Based on {product.reviewCount} reviews
              </span>
            </div>
          </div>
          <ul className="flex max-w-prose flex-col divide-y">
            {product.reviews.map((review) => (
              <li key={review.id} className="flex flex-col gap-1.5 py-4 first:pt-0">
                <div className="flex items-center justify-between gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm font-medium">{review.title}</p>
                <p className="text-sm text-muted-foreground">{review.body}</p>
                <p className="text-xs text-muted-foreground">— {review.author}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </section>
  );
}
