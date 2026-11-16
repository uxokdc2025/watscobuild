import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * ProductGrid — the one search / PLP product grid.
 *
 * Columns and gutter are tokens, not classes: `--layout-columns` and
 * `--layout-gutter` step per breakpoint in `app/globals.css`, so the grid is
 * at most 2 / 3 / 4 / 5 / 6 across (base / sm / lg / wide / xwide) and at most
 * 6 above the 1920px canvas, where `PageContainer` caps and centers the page.
 * From lg up a card never gets narrower than `--layout-card-min` (200px): the
 * grid shows one column fewer instead of overflowing its column.
 *
 * Pair it with `PageContainer` — the grid fills its column, the container
 * owns the width:
 *
 *   <PageContainer>
 *     <ProductGrid>
 *       {results.map((r) => <li key={r.id}><ProductCard … /></li>)}
 *     </ProductGrid>
 *   </PageContainer>
 *
 * `columns` overrides the token for one instance. It exists for the docs
 * demos (simulating a viewport width) and for CMS blocks that are capped
 * lower than the PLP — not for a page that just wants a different count.
 *
 * Documented at /components/grid.
 */
/*
 * Column logic: `--layout-columns` is the MAXIMUM per band, and
 * `--layout-card-min` the narrowest legible card. Each track is
 * max(card-min, an exact 1/N share of the row), auto-filled — so the grid
 * shows N columns when N cards fit at card-min or wider, and drops to N−1
 * (never overflows) when they don't, e.g. 1440px with the filter sidebar.
 * The −0.5px absorbs sub-pixel rounding so an exact fit isn't lost.
 * Below lg card-min is 0, so phones and tablets get exactly N.
 */
export const PRODUCT_GRID_CLASS =
  "grid grid-cols-[repeat(auto-fill,minmax(max(var(--layout-card-min),calc((100%_-_(var(--layout-columns)_-_1)_*_var(--layout-gutter))_/_var(--layout-columns)_-_0.5px)),1fr))] gap-[var(--layout-gutter)]"

function ProductGrid({
  className,
  columns,
  style,
  ...props
}: React.ComponentProps<"ul"> & { columns?: number }) {
  const resolvedStyle: React.CSSProperties | undefined =
    columns == null
      ? style
      : ({ ...(style ?? {}), "--layout-columns": columns } as React.CSSProperties)

  return (
    <ul
      data-slot="product-grid"
      className={cn(PRODUCT_GRID_CLASS, className)}
      style={resolvedStyle}
      {...props}
    />
  )
}

export { ProductGrid }
