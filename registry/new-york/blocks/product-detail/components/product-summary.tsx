"use client";

import * as React from "react";
import { Heart, RotateCcw, ShieldCheck, ShoppingCart, Truck } from "lucide-react";

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
import { StarRating } from "@/registry/new-york/blocks/product-detail/components/star-rating";

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
  const [color, setColor] = React.useState(product.colors[0]?.id);
  const [size, setSize] = React.useState<string>();

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
            className="text-muted-foreground underline-offset-4 hover:underline"
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
      <div className={cn("flex items-center gap-2 text-sm font-medium", stock.className)}>
        <span
          className="size-2 rounded-full bg-current"
          aria-hidden
        />
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
              className="grid size-9 cursor-pointer place-items-center rounded-full ring-offset-2 ring-offset-background has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-ring"
            >
              <RadioGroupItem
                id={`color-${c.id}`}
                value={c.id}
                aria-label={c.name}
                className="sr-only"
              />
              <span
                className="size-7 rounded-full border"
                style={{ backgroundColor: c.swatch }}
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
              data-disabled={!s.available || undefined}
              className={cn(
                "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium",
                "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground",
                "data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground/50 data-[disabled]:line-through"
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="h-12 flex-1 text-base">
          <ShoppingCart />
          Add to cart
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-12 sm:w-12"
          aria-label="Add to wishlist"
        >
          <Heart />
          <span className="sm:hidden">Wishlist</span>
        </Button>
      </div>

      {/* Trust badges */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TRUST_BADGES.map((badge) => (
          <li
            key={badge.title}
            className="flex items-center gap-3 rounded-lg border p-3 sm:flex-col sm:items-start sm:gap-1.5"
          >
            <badge.icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
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
