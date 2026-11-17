import type { ReactNode } from "react";

import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * ProductListRow — the canonical list-view product card.
 *
 * ONE component for every product rendered as a row: the /search + PLP List
 * view, the replacement / substitute drawers, Quick Order matches. Four zones,
 * documented at /components/list-views:
 *
 *   [ image ] [ capped description ] [ availability (centered) ] [ price + action ]
 *
 * The availability zone only exists when `availability` is passed — drawers and
 * match lists keep the compact three-zone row. Commerce (price gating, cart
 * wiring, branch inventory) is caller-supplied through `availability` /
 * `actions`; the row owns the layout and the identity block.
 *
 * There is no Compare control on this row, by design: comparison lives on the
 * PDP, not in the results list.
 */
export function ProductListRow({
  image,
  imageAlt,
  brand,
  title,
  item,
  mfg,
  meta,
  availability,
  actions,
}: {
  image?: string;
  imageAlt: string;
  brand: string;
  title: ReactNode;
  item: string;
  mfg: string;
  /** Extra content in the middle column, under item/mfg (e.g. branch stock). */
  meta?: ReactNode;
  /**
   * Availability as its own centered column (the storefront List view).
   * Omitted keeps the compact three-zone row used by drawers and match lists.
   */
  availability?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <article
      className={cn(
        // Mobile: thumbnail beside the description, availability and actions
        // beneath across both columns. sm+: the zone grid, vertically centered.
        "grid grid-cols-[80px_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 sm:items-center sm:gap-4",
        // The availability column keeps a 10rem floor so the stock line stays
        // readable in the PLP's narrow content column at 1024; the capped
        // description gives up width first.
        availability
          ? "sm:grid-cols-[96px_minmax(0,340px)_minmax(10rem,1fr)_auto]"
          : "sm:grid-cols-[80px_1fr_auto]",
      )}
    >
      <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={imageAlt} loading="lazy" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
        ) : <ImageOff className="size-6 opacity-40" aria-hidden="true" />}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-primary">{brand}</p>
        <div className="line-clamp-3 text-sm font-semibold leading-snug">{title}</div>
        <p className="mt-1 text-xs text-muted-foreground">Item: {item} · MFG: {mfg}</p>
        {meta ? <div className="mt-2">{meta}</div> : null}
      </div>
      {availability ? (
        <div className="col-span-2 min-w-0 sm:col-span-1 sm:flex sm:justify-center">{availability}</div>
      ) : null}
      <div className="col-span-2 text-sm sm:col-span-1 sm:text-right">{actions}</div>
    </article>
  );
}
