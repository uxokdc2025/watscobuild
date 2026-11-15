import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * ProductGrid — the one search / PLP product grid.
 *
 * Columns and gutter are tokens, not classes: `--layout-columns` and
 * `--layout-gutter` step per breakpoint in `app/globals.css`, so the grid is
 * 2 / 3 / 4 / 5 / 6 across (base / sm / lg / wide / xwide) and stays 6 above
 * the 1920px canvas, where `PageContainer` caps and centers the page.
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
export const PRODUCT_GRID_CLASS =
  "grid grid-cols-[repeat(var(--layout-columns),minmax(0,1fr))] gap-[var(--layout-gutter)]"

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
