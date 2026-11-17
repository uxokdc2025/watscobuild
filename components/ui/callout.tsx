import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Callout — a static, in-flow note that frames a rule, a decision, or a
 * "what changed" summary. A coloured rail down the left edge, a lightly
 * tinted surface, a one-line title and an optional description.
 *
 * Not an Alert: an Alert is a live region (`role="alert"`) for something that
 * just happened and may need acting on. A Callout is editorial — it can sit
 * several-to-a-page, or inside a collapsed accordion, without a screen reader
 * announcing it on expand. */
const calloutVariants = cva(
  "rounded-xl border-l-4 px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        // The house default — a rule, a decision, a what-changed note.
        default: "border-l-primary bg-primary/5",
        // Quieter: history, context, something superseded.
        neutral: "border-l-muted-foreground/40 bg-muted/40",
        // Positive — green.
        success: "border-l-in-stock bg-in-stock/8",
        // Caution — yellow.
        warning: "border-l-yellow-500 bg-yellow-400/10",
        // Problem — red.
        danger: "border-l-destructive bg-destructive/8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Callout({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof calloutVariants>) {
  return (
    <div
      data-slot="callout"
      className={cn(calloutVariants({ variant }), className)}
      {...props}
    />
  )
}

function CalloutTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="callout-title"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  )
}

function CalloutDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="callout-description"
      className={cn(
        "text-muted-foreground [&:not(:first-child)]:mt-1",
        className
      )}
      {...props}
    />
  )
}

export { Callout, CalloutTitle, CalloutDescription, calloutVariants }
