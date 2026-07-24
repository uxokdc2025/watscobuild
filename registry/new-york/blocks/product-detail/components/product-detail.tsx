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

import {
  product as defaultProduct,
  relatedProducts as defaultRelated,
  type Product,
  type RelatedProduct,
} from "@/registry/new-york/blocks/product-detail/lib/products";
import { ProductStoreProvider } from "@/registry/new-york/blocks/product-detail/components/product-store";
import { ProductGallery } from "@/registry/new-york/blocks/product-detail/components/product-gallery";
import { ProductSummary } from "@/registry/new-york/blocks/product-detail/components/product-summary";
import { ProductTabs } from "@/registry/new-york/blocks/product-detail/components/product-tabs";
import { RelatedProducts } from "@/registry/new-york/blocks/product-detail/components/related-products";
import { StickyBuyBar } from "@/registry/new-york/blocks/product-detail/components/sticky-buy-bar";

export function ProductDetail({
  product = defaultProduct,
  related = defaultRelated,
}: {
  product?: Product;
  related?: RelatedProduct[];
}) {
  return (
    <ProductStoreProvider product={product}>
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
          <RelatedProducts
            products={related}
            title={`Pairs Well With ${product.name
              .split(" ")
              .slice(0, 2)
              .join(" ")}`}
          />
        </div>

        {/* Mobile sticky buy bar (shares the product store) */}
        <StickyBuyBar />
      </div>
    </ProductStoreProvider>
  );
}
