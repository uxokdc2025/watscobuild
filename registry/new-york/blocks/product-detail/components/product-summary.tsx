"use client";

import {
  Check,
  Heart,
  Loader2,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  type Product,
  type StockStatus,
} from "@/registry/new-york/blocks/product-detail/lib/products";
import {
  FOCUS_RING,
  PRESS,
  TRANSITION,
} from "@/registry/new-york/blocks/product-detail/lib/motion";
import { StarRating } from "@/registry/new-york/blocks/product-detail/components/star-rating";
import { useProductStore } from "@/registry/new-york/blocks/product-detail/components/product-store";

const STOCK_LABELS: Record<StockStatus, { label: string; className: string }> = {
  "in-stock": { label: "In stock", className: "text-in-stock" },
  "low-stock": { label: "Low stock — order soon", className: "text-low-stock" },
  "out-of-stock": { label: "Out of stock", className: "text-out-of-stock" },
};

const TRUST_BADGES = [
  { icon: Truck, title: "Free shipping", detail: "On orders over $75" },
  { icon: ShieldCheck, title: "2-year warranty", detail: "Craftsmanship covered" },
  { icon: RotateCcw, title: "30-day returns", detail: "No-questions refunds" },
];

export function ProductSummary({ product }: { product: Product }) {
  const {
    color,
    size,
    setColor,
    setSize,
    wishlisted,
    toggleWishlist,
    pending,
    canAdd,
    addToCart,
  } = useProductStore();

  const stock = STOCK_LABELS[product.stock];
  const selectedColor = product.colors.find((c) => c.id === color);

  return (
    <div className="flex flex-col gap-6">
      {/* Category + title + rating */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <StarRating rating={product.rating} />
          <span className="font-medium">{product.rating.toFixed(1)}</span>
          <a
            href="#reviews"
            className={cn(
              "rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
              TRANSITION,
              FOCUS_RING
            )}
          >
            {product.reviewCount} reviews
          </a>
        </div>
      </div>

      {/* Short description */}
      <p className="text-sm text-muted-foreground">{product.shortDescription}</p>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-3xl font-bold text-sale-price">
          {formatPrice(product.price, product.currency)}
        </span>
        <span className="text-lg text-muted-foreground line-through">
          {formatPrice(product.originalPrice, product.currency)}
        </span>
        <Badge className="bg-sale-price text-primary-foreground">
          -{product.discountPercent}%
        </Badge>
      </div>

      {/* Stock */}
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          stock.className
        )}
      >
        <span className="size-2 rounded-full bg-current" aria-hidden />
        {stock.label}
      </div>

      <Separator />

      {/* Color selector */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Color</Label>
          <span className="text-sm text-muted-foreground">
            {selectedColor?.name}
          </span>
        </div>
        <RadioGroup
          value={color}
          onValueChange={setColor}
          className="flex flex-wrap gap-3"
          aria-label="Color"
        >
          {product.colors.map((c) => (
            <Label
              key={c.id}
              htmlFor={`color-${c.id}`}
              className="group relative grid size-9 cursor-pointer place-items-center rounded-full"
            >
              <RadioGroupItem
                id={`color-${c.id}`}
                value={c.id}
                aria-label={c.name}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "size-7 rounded-full border",
                  TRANSITION,
                  "motion-safe:group-hover:scale-110 motion-safe:group-active:scale-95",
                  "peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-2 peer-data-[state=checked]:ring-offset-background",
                  "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
                )}
                style={{ backgroundColor: c.swatch }}
                aria-hidden
              />
              <Check
                className={cn(
                  "pointer-events-none absolute size-4 text-primary-foreground opacity-0",
                  "transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none",
                  "peer-data-[state=checked]:opacity-100"
                )}
                aria-hidden
              />
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Size selector */}
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Size</Label>
        <RadioGroup
          value={size}
          onValueChange={setSize}
          className="flex flex-wrap gap-2"
          aria-label="Size"
        >
          {product.sizes.map((s) => (
            <Label
              key={s.id}
              htmlFor={`size-${s.id}`}
              className={cn(
                "inline-flex h-11 min-w-11 select-none items-center justify-center rounded-md border px-3 text-sm font-medium",
                TRANSITION,
                s.available
                  ? cn(
                      "cursor-pointer hover:border-primary hover:bg-accent hover:text-accent-foreground",
                      "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground has-[[data-state=checked]]:hover:bg-primary",
                      "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                      PRESS
                    )
                  : "cursor-not-allowed border-dashed text-muted-foreground/40 line-through"
              )}
            >
              <RadioGroupItem
                id={`size-${s.id}`}
                value={s.id}
                disabled={!s.available}
                className="sr-only"
              />
              {s.label}
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Buy actions */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row">
          <span className={cn("flex-1", !canAdd && "cursor-not-allowed")}>
            <Button
              size="lg"
              onClick={addToCart}
              disabled={!canAdd || pending}
              aria-busy={pending}
              className={cn("h-12 w-full text-base", PRESS)}
            >
              {pending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ShoppingCart />
              )}
              {pending ? "Adding…" : "Add to cart"}
            </Button>
          </span>
          <Button
            size="lg"
            variant="outline"
            onClick={toggleWishlist}
            aria-pressed={wishlisted}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "h-12 sm:w-12",
              PRESS,
              wishlisted && "border-primary text-primary hover:text-primary"
            )}
          >
            <Heart
              className={cn(
                TRANSITION,
                wishlisted && "fill-primary text-primary"
              )}
            />
            <span className="sm:hidden">
              {wishlisted ? "Wishlisted" : "Wishlist"}
            </span>
          </Button>
        </div>
        {!size ? (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Select a size to add to cart.
          </p>
        ) : null}
      </div>

      {/* Trust badges */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TRUST_BADGES.map((badge) => (
          <li
            key={badge.title}
            className="flex items-center gap-3 rounded-lg border p-3 sm:flex-col sm:items-start sm:gap-1.5"
          >
            <badge.icon
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-sm font-medium">{badge.title}</p>
              <p className="text-xs text-muted-foreground">{badge.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
