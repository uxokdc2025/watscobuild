"use client";

import { Loader2, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/registry/new-york/blocks/product-detail/lib/products";
import { PRESS } from "@/registry/new-york/blocks/product-detail/lib/motion";
import { useProductStore } from "@/registry/new-york/blocks/product-detail/components/product-store";

/**
 * Mobile-only sticky purchase bar. Shares the product store, so its Add to
 * cart drives the same pending → toast flow as the summary. It stays tappable
 * without a size and surfaces a toast prompting selection (never silent).
 */
export function StickyBuyBar() {
  const { product, pending, addToCart } = useProductStore();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t bg-background/95 px-4 py-3 pb-[max(var(--space-3),env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="flex flex-col">
        <span className="text-lg font-bold text-sale-price">
          {formatPrice(product.price, product.currency)}
        </span>
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(product.originalPrice, product.currency)}
        </span>
      </div>
      <Button
        size="lg"
        onClick={addToCart}
        disabled={pending}
        aria-busy={pending}
        className={cn("h-12 flex-1 text-base", PRESS)}
      >
        {pending ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
        {pending ? "Adding…" : "Add to cart"}
      </Button>
    </div>
  );
}
