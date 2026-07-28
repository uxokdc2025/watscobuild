"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  CertBadge,
  FlagBadge,
  HighlightBadge,
  NoImage,
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
      {/* Color intents (solid) */}
      <Group title="Color intents" note="Solid badges mapped to the merchandising legend.">
        <Badge variant="solid" color="blue">New</Badge>
        <Badge variant="solid" color="green">Sale / Promo</Badge>
        <Badge variant="solid" color="orange">Online Only</Badge>
        <Badge variant="solid" color="red">Clearance / ESD</Badge>
        <Badge variant="solid" color="teal">Rebate</Badge>
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
