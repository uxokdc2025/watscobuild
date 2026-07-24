"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/registry/new-york/blocks/product-detail/lib/products";
import { ProductIcon } from "@/registry/new-york/blocks/product-detail/components/product-icon";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = React.useState(0);
  const current = images[active];

  return (
    // Rail below on mobile, beside on md+ (thumbnail rail returns at 768).
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnail rail — horizontal scroll on mobile, vertical column on md+ */}
      <ul
        className="flex shrink-0 gap-3 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
        aria-label="Product image thumbnails"
      >
        {images.map((image, i) => {
          const selected = i === active;
          return (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${image.alt}`}
                aria-pressed={selected}
                className={cn(
                  "size-16 overflow-hidden rounded-md border outline-none",
                  selected
                    ? "border-primary ring-2 ring-ring"
                    : "border-border"
                )}
              >
                <ProductIcon
                  icon={image.icon}
                  className="size-full rounded-none"
                  iconClassName="size-6"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Main image */}
      <div className="relative min-w-0 flex-1">
        <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
          <ProductIcon
            icon={current.icon}
            className="size-full rounded-none"
            iconClassName="size-20"
          />
        </div>
        <span className="absolute right-3 bottom-3 rounded-full border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
          {active + 1} / {images.length} · {current.alt}
        </span>
      </div>
    </div>
  );
}
