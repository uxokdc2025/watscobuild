import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════════
   Category Thumbnails — the shared "shop by category" strip that sits at
   the top of search and category (PLP) results.

   One component, every surface: search, category results, and any future
   PLP that needs a category jump. The tile is a SQUARE card on the small
   corner-radius token (`rounded-sm` → var(--radius), 4px flat across the
   system) — matching the ecmdi.com reference tiles (Residential,
   Commercial, Mobile Homes, PTAC) and the square tiles already used by
   Category Landing and the brand homepages. Not circles.

   Built from design-system tokens only: `bg-card` + `border` for the tile,
   `shadow-md` on hover, `ring-ring` on focus.
   ════════════════════════════════════════════════════════════════════════ */

export type CategoryThumbnailItem = {
  label: string;
  /** Destination. Falls back to the strip's `href` when omitted. */
  href?: string;
  /** Product/category art, centered and contained in the square tile. */
  image?: string;
  /** Placeholder shown on a tinted tile until the image set is built. */
  Icon?: LucideIcon;
};

/* ── One tile ──────────────────────────────────────────────────────────
 * A square card with the category art centered inside and the label
 * below. Sized to sit in a horizontally-scrolling row. */
export function CategoryThumbnail({
  item,
  href,
  className,
}: {
  item: CategoryThumbnailItem;
  /** Fallback destination when the item carries no `href`. */
  href?: string;
  className?: string;
}) {
  const { label, image, Icon } = item;
  return (
    <Link
      href={item.href ?? href ?? "#"}
      aria-label={`Shop ${label}`}
      className={cn(
        "group flex w-28 shrink-0 flex-col items-center gap-2 rounded-sm text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        className={cn(
          // A border (not a ring) draws inside the box, so the scroll
          // container's overflow:auto can never clip it flat at the top.
          "grid aspect-square w-full place-items-center overflow-hidden rounded-sm border p-3 transition group-hover:border-primary group-hover:shadow-md",
          image ? "bg-card" : "bg-muted",
        )}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
        ) : Icon ? (
          <Icon className="size-9 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" />
        ) : null}
      </span>
      <span className="text-xs font-medium leading-snug text-foreground group-hover:text-primary">
        {label}
      </span>
    </Link>
  );
}

/* ── The strip ─────────────────────────────────────────────────────────
 * A horizontally-scrolling, snapping row of category tiles. Mobile-first:
 * it scrolls at every width rather than wrapping or shrinking the tiles. */
export function CategoryThumbnails({
  items,
  href,
  label = "Shop by category",
  className,
}: {
  items: CategoryThumbnailItem[];
  /** Fallback destination for items without their own `href`. */
  href?: string;
  /** Accessible name for the strip. */
  label?: string;
  className?: string;
}) {
  return (
    <section aria-label={label} className={cn("mb-5 border-b pb-4", className)}>
      <ul className="flex snap-x gap-5 overflow-x-auto pb-3 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
        {items.map((it) => (
          <li key={it.label} className="snap-start">
            <CategoryThumbnail item={it} href={href} />
          </li>
        ))}
      </ul>
    </section>
  );
}
