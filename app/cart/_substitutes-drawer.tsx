"use client";

import * as React from "react";
import { Replace, Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductListRow } from "@/components/ui/product-list-row";
import { StockStatus } from "@/components/ui/label-badges";
import {
  DRAWER_MOTION_MS,
  DrawerCloseButton,
  DrawerPanel,
  drawerOverlayClassName,
} from "@/components/ui/drawer";
import { formatUSD } from "@/app/pdp/_lib/types";
import type { AltProduct, CartLine } from "./_cart-data";

/* Right-side substitutes drawer — the SAME pattern the shopping-list detail
 * uses (product being replaced on top, then Replacements, then Substitutes),
 * built from the shared DS primitives (DrawerPanel, ProductListRow,
 * StockStatus). Replacements use the blue `Replace` icon; substitutes use the
 * green `Shuffle` icon, kept visually distinct so the two never read alike. */

function AltRow({
  product,
  kind,
  onChoose,
}: {
  product: AltProduct;
  kind: "replacement" | "substitute";
  onChoose: (product: AltProduct, kind: "replacement" | "substitute") => void;
}) {
  return (
    <div className="rounded-md border">
      <ProductListRow
        image={product.image}
        imageAlt={product.title}
        brand={product.brand}
        title={product.title}
        item={product.item}
        mfg={product.mfg}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <StockStatus qty={product.qty}>
              {product.qty > 0 ? "In stock" : "Out of stock"}
            </StockStatus>
            <span className="text-sm font-semibold">{formatUSD(product.price)}</span>
          </div>
        }
        actions={
          <Button size="sm" className="min-h-11" disabled={product.qty <= 0} onClick={() => onChoose(product, kind)}>
            {kind === "replacement" ? (
              <>
                <Replace className="size-3.5" />
                Replace
              </>
            ) : (
              <>
                <Shuffle className="size-3.5" />
                Substitute
              </>
            )}
          </Button>
        }
      />
    </div>
  );
}

export function SubstitutesDrawer({
  line,
  onClose,
  onChoose,
}: {
  line: CartLine | null;
  onClose: () => void;
  onChoose: (product: AltProduct, kind: "replacement" | "substitute") => void;
}) {
  const [closing, setClosing] = React.useState(false);

  const requestClose = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, DRAWER_MOTION_MS);
  }, [closing, onClose]);

  if (!line?.replacement) return null;
  const { replacements, substitutes } = line.replacement;

  return (
    <div
      className={drawerOverlayClassName(closing)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <DrawerPanel
        open={!closing}
        side="right"
        role="dialog"
        aria-modal="true"
        aria-label="Substitutes"
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-background text-foreground shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-5 py-4">
          <h2 className="text-lg font-bold">Substitutes</h2>
          <DrawerCloseButton label="Close substitutes" onClick={requestClose} />
        </header>
        <div className="flex-1 overflow-y-auto">
          {/* The product being replaced. */}
          <section className="border-b bg-muted/30 px-5 py-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              You&rsquo;re replacing
            </p>
            <div className="rounded-md border bg-background">
              <ProductListRow
                image={line.image}
                imageAlt={line.title}
                brand={line.brand ?? "Watsco"}
                title={line.title}
                item={line.item}
                mfg={line.mfg}
                meta={<p className="text-xs text-muted-foreground">{line.replacement.note}</p>}
                actions={<span className="text-sm font-semibold">{formatUSD(line.price)}</span>}
              />
            </div>
          </section>

          {replacements.length > 0 ? (
            <section className="px-5 py-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Replace className="size-4 text-muted-foreground" />
                Replacements
              </h3>
              <div className="space-y-3">
                {replacements.map((r) => (
                  <AltRow key={r.id} product={r} kind="replacement" onChoose={onChoose} />
                ))}
              </div>
            </section>
          ) : null}

          {substitutes.length > 0 ? (
            <section className="border-t px-5 py-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Shuffle className="size-4 text-muted-foreground" />
                Substitutes
              </h3>
              <div className="space-y-3">
                {substitutes.map((s) => (
                  <AltRow key={s.id} product={s} kind="substitute" onChoose={onChoose} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </DrawerPanel>
    </div>
  );
}
