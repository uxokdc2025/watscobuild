"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FilterPill({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
      {label}
      {onRemove ? (
        <button type="button" aria-label={`Remove ${label} filter`} onClick={onRemove} className="rounded-full p-0.5 hover:bg-primary-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground">
          <X aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </span>
  );
}

export function RadiusControl({ value = "50", onChange }: { value?: string; onChange?: (value: string) => void }) {
  return (
    <div className="flex items-center gap-2" aria-label="Search radius">
      <Input value={value} onChange={(event) => onChange?.(event.target.value)} inputMode="numeric" className="h-9 w-20" aria-label="Radius in miles" />
      <span className="text-sm text-muted-foreground">miles</span>
      <Button type="button" size="sm" variant="outline">Apply</Button>
    </div>
  );
}

export function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between border-b border-border pb-3 font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

export function FilterOption({ id, label, count, checked, onCheckedChange }: { id: string; label: string; count?: number; checked?: boolean; onCheckedChange?: (checked: boolean) => void }) {
  return (
    <label htmlFor={id} className={cn("flex min-h-9 items-center justify-between gap-2 text-sm", checked && "font-medium")}>
      <span className="flex items-center gap-2"><Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />{label}</span>
      {count == null ? null : <span className="text-xs text-muted-foreground">({count})</span>}
    </label>
  );
}
