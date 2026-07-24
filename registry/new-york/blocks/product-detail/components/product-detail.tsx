"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

import {
  formatPrice,
  product as defaultProduct,
  relatedProducts as defaultRelated,
  type Product,
  type RelatedProduct,
} from "@/registry/new-york/blocks/product-detail/lib/products";
import { ProductGallery } from "@/registry/new-york/blocks/product-detail/components/product-gallery";
import { ProductSummary } from "@/registry/new-york/blocks/product-detail/components/product-summary";
import { ProductTabs } from "@/registry/new-york/blocks/product-detail/components/product-tabs";
import { RelatedProducts } from "@/registry/new-york/blocks/product-detail/components/related-products";

export function ProductDetail({
  product = defaultProduct,
  related = defaultRelated,
}: {
  product?: Product;
  related?: RelatedProduct[];
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6 md:pb-12">
      {/* Breadcrumb */}
      <Breadcrumb className="py-4">
        <BreadcrumbList>
          {product.breadcrumb.map((crumb, i) => {
            const last = i === product.breadcrumb.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                <BreadcrumbItem>
                  {last ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {last ? null : <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Gallery + summary: single column on mobile, two columns on md+ */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} />
        <ProductSummary product={product} />
      </div>

      {/* Details tabs */}
      <div className="mt-12 md:mt-16">
        <ProductTabs product={product} />
      </div>

      {/* Related */}
      <div className="mt-12 md:mt-16">
        <RelatedProducts products={related} />
      </div>

      {/* Mobile sticky buy bar (respects safe-area) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t bg-background/95 px-4 py-3 pb-[max(var(--space-3),env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-sale-price">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(product.originalPrice, product.currency)}
          </span>
        </div>
        <Button size="lg" className="h-12 flex-1 text-base">
          <ShoppingCart />
          Add to cart
        </Button>
      </div>
    </div>
  );
}
