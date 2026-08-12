"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  BranchRow,
  CertBadge,
  FlagBadge,
  HighlightBadge,
  NoImage,
  PointsBadge,
  StockStatus,
} from "@/components/ui/label-badges";
import { Category } from "../_showcase";

/** Local card (like Demo, but no install chip — these are Watsco label styles). */
function Group({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <header className="border-b px-5 py-4">
        <h3 className="font-semibold">{title}</h3>
        {note ? <p className="mt-1 text-sm text-muted-foreground">{note}</p> : null}
      </header>
      <div className={cn("flex flex-1 flex-wrap items-center gap-3 p-5", className)}>
        {children}
      </div>
    </div>
  );
}

export function LabelsSection() {
  return (
    <Category
      id="labels"
      title="Badges & Labels"
      description="Watsco merchandising badges and status labels. Color intents: blue = new, green = sale/promo, orange = online only, red = clearance/ESD, teal = rebate."
    >
      {/* Position pattern — canonical placement on any product surface */}
      <Group
        title="Badge position pattern"
        note='Every product surface — PDP buy-box, PLP card — places badges in one slot: directly under the brand line, above the title. Same slot regardless of tone or intent. Source: `app/pdp/_lib/summary.tsx` "Brand + badges + title" block. See docs/design-system.md §4 Badges/Labels.'
        className="flex-col items-stretch gap-3"
      >
        <div className="flex max-w-md flex-col gap-2 rounded-lg border bg-background p-4">
          <a href="#" className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Daikin
          </a>
          <div className="flex flex-wrap gap-2">
            <Badge variant="solid" color="red">Sale</Badge>
          </div>
          <h4 className="text-lg font-bold tracking-tight">
            CIRRA 2-Port High-Efficiency Multi-Split Outdoor Heat Pump - 18,000 BTU
          </h4>
          <p className="text-xs text-muted-foreground">
            Item #: 361067A · MFG #: 2MX18AXVJU
          </p>
        </div>
      </Group>

      {/* Color intents (solid) */}
      <Group title="Color intents" note="Solid badges mapped to the merchandising legend.">
        <Badge variant="solid" color="blue">New</Badge>
        <Badge variant="solid" color="green">Sale / Promo</Badge>
        <Badge variant="solid" color="orange">Online Only</Badge>
        <Badge variant="solid" color="red">Clearance / ESD</Badge>
        <Badge variant="solid" color="teal">Rebate</Badge>
      </Group>

      {/* Loyalty points */}
      <Group title="Loyalty points" note="CE Rewards points earned on purchase — violet badge, shown in the price cluster and on recommendation cards.">
        <PointsBadge points={1} />
        <PointsBadge points={2} />
        <PointsBadge points={25} />
      </Group>

      {/* Promo badges (colored outline) */}
      <Group title="Promo" note="Colored-outline chips.">
        <Badge variant="outline-color" color="green">GREAT PRICE – CALL FOR DETAILS</Badge>
        <Badge variant="outline-color" color="green">BUNDLE AND SAVE</Badge>
        <Badge variant="outline-color" color="green">SOLD 5 PER PACK</Badge>
        <Badge variant="outline-color" color="green">PRESS INTO SAVINGS</Badge>
        <Badge variant="outline-color" color="red">CLOSEOUT SPECIAL – WHILE SUPPLIES LAST</Badge>
      </Group>

      {/* Product attributes */}
      <Group title="Product attributes" note="Color-coded attribute chips (e.g. refrigerant type).">
        <Badge variant="outline-color" color="red">R-410A</Badge>
        <Badge variant="outline-color" color="blue">R-454B</Badge>
      </Group>

      {/* Flag / ribbon */}
      <Group title="Flag / ribbon" note="White fill, dark text, colored corner notch.">
        <FlagBadge tone="red">Direct Ship</FlagBadge>
        <FlagBadge tone="red">No Returns</FlagBadge>
        <FlagBadge tone="orange">Online Only</FlagBadge>
      </Group>

      {/* Highlighter */}
      <Group title="Highlighter" note="Two-tone marker style for seasonal / promo.">
        <HighlightBadge
          segments={[
            { text: "PRO", className: "bg-green-200 text-green-950" },
            { text: "Essentials", className: "bg-yellow-300 text-yellow-950" },
          ]}
        />
        <HighlightBadge
          segments={[
            { text: "FALL", className: "bg-red-200 text-red-950" },
            { text: "PROMO", className: "text-muted-foreground" },
          ]}
        />
        <HighlightBadge
          segments={[
            { text: "Spring", className: "bg-green-200 text-green-950", italic: true },
            { text: "Preseason", className: "text-muted-foreground" },
          ]}
        />
      </Group>

      {/* Stock status */}
      <Group title="Stock status" note="Dot + label; drives the inventory states." className="!flex-col !items-start gap-2.5">
        <StockStatus tone="green">In stock at current store</StockStatus>
        <StockStatus tone="red">Out of stock here and at nearby branches</StockStatus>
        <StockStatus tone="amber">Out of stock here — in stock at a nearby store</StockStatus>
        <StockStatus tone="slate">Non-transactional (replacement available)</StockStatus>
        <StockStatus tone="slate">No returns</StockStatus>
        <StockStatus tone="slate">Non-sellable</StockStatus>
      </Group>

      {/* Quantity-driven color: green when available, red at zero. */}
      <Group title="Branch quantity" note="Color follows the number — green when available, red at 0." className="!flex-col !items-start gap-2.5">
        <StockStatus qty={12}>12 in stock today</StockStatus>
        <StockStatus qty={1}>1 in stock today</StockStatus>
        <StockStatus qty={0}>0 in stock today</StockStatus>
      </Group>

      {/* Ecommerce status text colors — all AA 4.5:1 on white. */}
      <Group title="Status colors" note="Fulfillment & inventory text — all AA 4.5:1 on white." className="!flex-col !items-start gap-1.5">
        <span className="text-sm font-bold text-price">
          $1,548.95 <span className="text-xs font-normal text-muted-foreground">/ EA</span>
        </span>
        <span className="text-sm font-medium text-in-stock">In stock today</span>
        <span className="text-sm font-medium text-low-stock">Call for availability</span>
        <span className="text-sm font-medium text-out-of-stock">Out of stock</span>
      </Group>

      {/* Branch availability row — left-aligned qty + name. */}
      <Group title="Branch row" note="Left-aligned quantity (colored by stock) + branch name." className="!flex-col !items-start gap-1">
        <BranchRow qty={107} name="Baker Jacksonville #301" />
        <BranchRow qty={7} name="Baker Orange Park #358" />
        <BranchRow qty={0} name="Baker St Augustine #367" />
      </Group>

      {/* Certification */}
      <Group title="Certification" note="Placeholder chip — swap for the real logo when provided.">
        <CertBadge>ENERGY STAR</CertBadge>
      </Group>

      {/* No image */}
      <Group title="No image" note="Gallery empty state when a product has no photo.">
        <NoImage className="w-48" />
      </Group>
    </Category>
  );
}
