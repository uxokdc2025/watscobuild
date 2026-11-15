import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * PageContainer — the one page container.
 *
 * Content stretches fluidly up to the 1920px canvas, then stops and centers.
 * Side margin comes from `--layout-margin`, which steps per breakpoint in
 * `app/globals.css` (16 → 24 → 32 → 40 → 48px). Nothing about the width is
 * set here, so changing the canvas or a margin is a one-line token change.
 *
 * Use it for every page shell, band inner, and section. Full-bleed bands put
 * the background on the outer element and the container inside it:
 *
 *   <div className="border-b bg-muted/40">
 *     <PageContainer className="py-4">…</PageContainer>
 *   </div>
 *
 * `asChild` renders the container's classes on your own element, so semantic
 * tags keep their tag:
 *
 *   <PageContainer asChild>
 *     <nav aria-label="Breadcrumb" className="flex items-center gap-2">…</nav>
 *   </PageContainer>
 *
 * Documented at /components/grid.
 */
export const PAGE_CONTAINER_CLASS =
  "mx-auto w-full max-w-[var(--layout-max-width)] px-[var(--layout-margin)]"

function PageContainer({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="page-container"
      className={cn(PAGE_CONTAINER_CLASS, className)}
      {...props}
    />
  )
}

export { PageContainer }
