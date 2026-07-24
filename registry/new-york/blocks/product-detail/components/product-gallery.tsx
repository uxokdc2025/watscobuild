"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/registry/new-york/blocks/product-detail/lib/products";
import {
  PRESS,
  TRANSITION,
} from "@/registry/new-york/blocks/product-detail/lib/motion";
import { ProductIcon } from "@/registry/new-york/blocks/product-detail/components/product-icon";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = React.useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
        <ProductIcon
          icon={current.icon}
          className="size-full rounded-none"
          iconClassName="size-20"
        />
      </div>

      {/* Thumbnail row — below the main photo, scrolls horizontally on small screens */}
      <ul
        className="flex gap-3 overflow-x-auto pb-1"
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
                  // Constant 2px border avoids layout shift between states.
                  "size-16 cursor-pointer overflow-hidden rounded-md border-2 outline-none",
                  TRANSITION,
                  PRESS,
                  // Focus: ring (keyboard). Selection: thin solid black frame.
                  "focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "border-foreground"
                    : "border-transparent hover:border-foreground/30"
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
    </div>
  );
}
