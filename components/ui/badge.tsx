import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        // Appearance modes — pair with `color` (see compoundVariants below).
        // soft  = tinted bg + colored text + subtle same-hue border ("Pro Essentials")
        // solid = filled bg + white text ("Best Value")
        soft: "border-transparent",
        solid: "border-transparent",
      },
      color: {
        blue: "",
        violet: "",
        green: "",
        amber: "",
        red: "",
        slate: "",
      },
    },
    compoundVariants: [
      // ── Soft (tinted) ──
      {
        variant: "soft",
        color: "blue",
        className:
          "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900 [a&]:hover:bg-blue-200/70 dark:[a&]:hover:bg-blue-900",
      },
      {
        variant: "soft",
        color: "violet",
        className:
          "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-900 [a&]:hover:bg-violet-200/70 dark:[a&]:hover:bg-violet-900",
      },
      {
        variant: "soft",
        color: "green",
        className:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900 [a&]:hover:bg-green-200/70 dark:[a&]:hover:bg-green-900",
      },
      {
        variant: "soft",
        color: "amber",
        className:
          "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900 [a&]:hover:bg-amber-200/70 dark:[a&]:hover:bg-amber-900",
      },
      {
        variant: "soft",
        color: "red",
        className:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900 [a&]:hover:bg-red-200/70 dark:[a&]:hover:bg-red-900",
      },
      {
        variant: "soft",
        color: "slate",
        className:
          "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 [a&]:hover:bg-slate-200/70 dark:[a&]:hover:bg-slate-700",
      },
      // ── Solid (filled) ──
      {
        variant: "solid",
        color: "blue",
        className: "bg-blue-600 text-white [a&]:hover:bg-blue-600/90",
      },
      {
        variant: "solid",
        color: "violet",
        className: "bg-violet-600 text-white [a&]:hover:bg-violet-600/90",
      },
      {
        variant: "solid",
        color: "green",
        className: "bg-green-600 text-white [a&]:hover:bg-green-600/90",
      },
      {
        variant: "solid",
        color: "amber",
        className: "bg-amber-500 text-amber-950 [a&]:hover:bg-amber-500/90",
      },
      {
        variant: "solid",
        color: "red",
        className: "bg-red-600 text-white [a&]:hover:bg-red-600/90",
      },
      {
        variant: "solid",
        color: "slate",
        className:
          "bg-slate-800 text-white dark:bg-slate-700 [a&]:hover:bg-slate-800/90",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "blue",
    },
  }
)

function Badge({
  className,
  variant = "default",
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, color }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
