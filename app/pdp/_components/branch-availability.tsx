import { Check, Store, Truck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { type Branch } from "../_data";

export function BranchAvailability({
  yourBranch,
  nearbyBranches,
}: {
  yourBranch: { name: string; stock: number };
  nearbyBranches: Branch[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Your branch */}
      <div className="flex flex-col rounded-lg border bg-card p-4">
        <h3 className="font-semibold">Your Branch</h3>
        <p className="mt-2 text-sm font-medium">{yourBranch.name}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-in-stock">
          <Check className="size-4" />
          {yourBranch.stock} in stock today
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Available for pickup or delivery from this branch.
        </p>
        <Separator className="my-4" />
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Store className="size-4" />
            Pick Up
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="size-4" />
            Delivery
          </span>
        </div>
      </div>

      {/* Nearby branches */}
      <div className="flex flex-col rounded-lg border bg-card p-4">
        <h3 className="font-semibold">Nearby Branches</h3>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {nearbyBranches.map((b) => (
            <li key={b.name} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{b.name}</span>
              <span
                className={cn(
                  "shrink-0 font-semibold tabular-nums",
                  b.qty > 0 ? "text-in-stock" : "text-muted-foreground"
                )}
              >
                {b.qty}
              </span>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="mt-4 w-fit rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          View All Branches
        </a>
      </div>
    </div>
  );
}
