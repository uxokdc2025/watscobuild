"use client";

import * as React from "react";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fbt, type FbtProduct } from "../_data";

const TRANSITION =
  "transition-[transform,color,background-color,border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none";
const FOCUS =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function ImagePlaceholder() {
  return (
    <div
      className="grid aspect-[4/3] w-full place-items-center rounded-md text-xs text-muted-foreground"
      style={{
        backgroundColor: "var(--muted)",
        backgroundImage:
          "repeating-linear-gradient(45deg, color-mix(in oklch, var(--muted-foreground) 12%, transparent) 0 8px, transparent 8px 16px)",
      }}
      aria-hidden
    >
      <span className="font-mono">[ Product Image ]</span>
    </div>
  );
}

function FbtCard({ p }: { p: FbtProduct }) {
  const [qty, setQty] = React.useState(1);
  const [pending, setPending] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  function add() {
    if (pending) return;
    setPending(true);
    timer.current = setTimeout(() => {
      setPending(false);
      toast.success("Added to cart", { description: `${qty} × ${p.item}` });
    }, 900);
  }

  const stepBtn = cn(
    "grid h-full w-9 cursor-pointer place-items-center text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
    TRANSITION,
    FOCUS
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <ImagePlaceholder />
      <h3 className="text-sm font-semibold text-balance">{p.title}</h3>
      <div className="text-xs text-muted-foreground">
        <div>Item: {p.item}</div>
        <div>MFG: {p.mfg}</div>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-in-stock tabular-nums">
            {p.branchQty}
          </span>
          <span className="text-foreground">{p.branchName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-in-stock tabular-nums">
            {p.nearbyQty}
          </span>
          <a
            href="#"
            className={cn(
              "rounded-sm text-primary underline-offset-4 hover:underline",
              FOCUS
            )}
          >
            Check Nearby Branches
          </a>
        </div>
      </div>
      <a
        href="#"
        className={cn(
          "w-fit rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline",
          FOCUS
        )}
      >
        Sign in to view pricing
      </a>
      <div className="mt-1 flex items-stretch gap-3">
        <div
          role="group"
          aria-label="Quantity"
          className="inline-flex h-10 shrink-0 items-center rounded-md border"
        >
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className={cn(stepBtn, "rounded-l-md")}
          >
            <Minus className="size-4" />
          </button>
          <span className="grid h-full w-10 place-items-center border-x text-sm font-medium tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            aria-label="Increase quantity"
            className={cn(stepBtn, "rounded-r-md")}
          >
            <Plus className="size-4" />
          </button>
        </div>
        <Button
          onClick={add}
          disabled={pending}
          aria-busy={pending}
          className="h-10 flex-1"
        >
          {pending ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
          {pending ? "Adding…" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

const TABS: { value: "equipment" | "parts" | "supplies"; label: string }[] = [
  { value: "equipment", label: "Equipment" },
  { value: "parts", label: "Parts" },
  { value: "supplies", label: "Supplies" },
];

export function FrequentlyBoughtTogether() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">
        Frequently Bought Together
      </h2>
      <Tabs defaultValue="equipment">
        <TabsList variant="line">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value} className="pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fbt[t.value].map((p) => (
                <FbtCard key={p.id} p={p} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
