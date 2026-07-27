"use client";

import * as React from "react";
import {
  ListPlus,
  Loader2,
  Minus,
  Plus,
  Shield,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BranchAvailability } from "./branch-availability";
import { PackSize } from "./pack-size";
import { formatUSD, product } from "../_data";

const FOCUS =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const PRESS = "motion-safe:active:scale-[0.97]";
const TRANSITION =
  "transition-[transform,color,background-color,border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none";

function QuantityStepper({
  quantity,
  onDec,
  onInc,
}: {
  quantity: number;
  onDec: () => void;
  onInc: () => void;
}) {
  const btn = cn(
    "grid h-full w-11 cursor-pointer place-items-center text-foreground hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground",
    TRANSITION,
    PRESS,
    FOCUS
  );
  return (
    <div
      role="group"
      aria-label="Quantity"
      className="inline-flex h-11 shrink-0 items-center rounded-md border"
    >
      <button
        type="button"
        onClick={onDec}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className={cn(btn, "rounded-l-md")}
      >
        <Minus className="size-4" />
      </button>
      <span
        aria-live="polite"
        className="grid h-full w-12 place-items-center border-x text-sm font-medium tabular-nums"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onInc}
        aria-label="Increase quantity"
        className={cn(btn, "rounded-r-md")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function PdpSummary() {
  const [pack, setPack] = React.useState(product.packSizes[0]);
  const [quantity, setQuantity] = React.useState(1);
  const [pending, setPending] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  function addToCart() {
    if (pending) return;
    setPending(true);
    timer.current = setTimeout(() => {
      setPending(false);
      toast.success("Added to cart", {
        description: `${quantity} × ${product.item} · ${pack}`,
      });
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Brand */}
      <a
        href="#"
        className={cn(
          "w-fit rounded-sm text-lg font-bold text-primary underline-offset-4 hover:underline",
          FOCUS
        )}
      >
        {product.brand}
      </a>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {product.badges.map((b) => (
          <Badge key={b.label} variant={b.tone} color={b.color}>
            {b.label === "Pro Essentials" ? <Shield /> : null}
            {b.label}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight text-balance">
        {product.title}
      </h1>

      {/* Item / MFG */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span>
          Item: <span className="text-foreground">{product.item}</span>
        </span>
        <span>
          MFG: <span className="text-foreground">{product.mfg}</span>
        </span>
      </div>

      {/* Buy more and save */}
      <a
        href="#"
        className={cn(
          "flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-foreground hover:text-primary",
          TRANSITION,
          FOCUS
        )}
      >
        <Tag className="size-5 text-primary" />
        Buy more and save
      </a>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-price">
          {formatUSD(product.price)}
        </span>
        <span className="text-sm text-muted-foreground">/{product.uom}</span>
      </div>

      {/* Branch availability */}
      <BranchAvailability
        yourBranch={product.yourBranch}
        nearbyBranches={product.nearbyBranches}
      />

      {/* Pack size */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Pack Size</Label>
        <PackSize options={product.packSizes} value={pack} onValueChange={setPack} />
      </div>

      {/* Quantity + actions */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Quantity</Label>
        <div className="flex flex-wrap items-stretch gap-3">
          <QuantityStepper
            quantity={quantity}
            onDec={() => setQuantity((q) => Math.max(1, q - 1))}
            onInc={() => setQuantity((q) => Math.min(999, q + 1))}
          />
          <Button
            size="lg"
            onClick={addToCart}
            disabled={pending}
            aria-busy={pending}
            className={cn("h-12 min-w-48 flex-1 px-8 text-base", PRESS)}
          >
            {pending ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
            {pending ? "Adding…" : "Add to Cart"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              toast.success("Saved to list", { description: product.item })
            }
            className={cn("h-12 px-5", PRESS)}
          >
            <ListPlus />
            Save to List
          </Button>
        </div>
      </div>
    </div>
  );
}
