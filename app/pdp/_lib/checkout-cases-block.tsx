"use client";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CHECKOUT_USE_CASES } from "./checkout-use-cases";

type UseCase = (typeof CHECKOUT_USE_CASES)[number];

/** The Checkout Flow section: one baseline flow plus a card per use case, each
 *  with a real Button that opens that case's live checkout example. */
export function CheckoutCasesBlock({ cases }: { cases: readonly UseCase[] }) {
  return (
    <>
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold">One responsive checkout, scenario-based states</p>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              The comparison points to one best-practice flow: fulfillment first, payment second, and a
              final review before submission. Transfer, backorder, freight, pickup, terms, coupon, and
              special-handling cases remain visible states within that flow.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <a href="/checkout?demo=1&case=delivery-pickup-routing" target="_blank" rel="noopener noreferrer">
              Open baseline checkout
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 pb-2 md:grid-cols-2">
        {cases.map((useCase) => (
          <div
            key={useCase.title}
            className="flex flex-col rounded-lg border p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold tracking-wide text-primary uppercase">{useCase.phase}</span>
              <span className="text-xs text-muted-foreground">{useCase.sources}</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold">{useCase.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{useCase.pattern}</p>
            <p className="mt-2 border-t pt-2 text-sm">
              <span className="font-medium">Recommended:</span> {useCase.decision}
            </p>
            <div className="mt-3">
              <Button asChild variant="outline" size="sm">
                <a href={`/checkout?demo=1&case=${useCase.slug}`} target="_blank" rel="noopener noreferrer">
                  Open checkout example
                  <ArrowUpRight />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
