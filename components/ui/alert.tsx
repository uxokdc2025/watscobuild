import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        // Neutral, lightly filled.
        default:
          "bg-muted/50 border-border text-foreground *:data-[slot=alert-description]:text-muted-foreground",
        // Informational — blue.
        info:
          "bg-blue-500/8 border-blue-500/30 text-blue-800 dark:text-blue-300 *:data-[slot=alert-description]:text-foreground/70",
        // Positive — green.
        success:
          "bg-in-stock/10 border-in-stock/35 text-in-stock *:data-[slot=alert-description]:text-foreground/70",
        // Caution — yellow.
        warning:
          "bg-yellow-400/12 border-yellow-500/40 text-yellow-800 dark:text-yellow-300 *:data-[slot=alert-description]:text-foreground/70",
        // Stronger caution — orange.
        caution:
          "bg-orange-400/12 border-orange-500/40 text-orange-800 dark:text-orange-300 *:data-[slot=alert-description]:text-foreground/70",
        // Error — red.
        destructive:
          "bg-destructive/10 border-destructive/30 text-destructive *:data-[slot=alert-description]:text-destructive/80 [&>svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
