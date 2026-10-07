"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Address } from "../_lib/types";

type Props = {
  addr: Address;
  onEdit: () => void;
  onRemove: () => void;
};

/** Saved (user-managed) address card — mirrors the card-management grid card. */
export function SavedAddressCard({ addr, onEdit, onRemove }: Props) {
  const telHref = `tel:${addr.phone.replace(/[^\d+]/g, "")}`;
  return (
    <article className="flex min-h-[240px] flex-col rounded-lg border bg-background text-[13px] shadow-sm">
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-snug">{addr.label}</h3>
          {addr.isDefault ? <Badge variant="secondary">Default</Badge> : null}
        </div>
        <div className="mt-3 leading-5">
          <p className="font-medium">{addr.name}</p>
          {addr.company ? <p>{addr.company}</p> : null}
          <p>{addr.street1}</p>
          {addr.street2 ? <p>{addr.street2}</p> : null}
          <p>
            {addr.city}, {addr.state} {addr.zip}
          </p>
          <a
            href={telHref}
            className="mt-1 inline-flex min-h-8 items-center text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {addr.phone}
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between border-t p-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          aria-label={`Remove ${addr.label}`}
          className="min-h-10 text-[13px] text-destructive hover:text-destructive/80"
        >
          <Trash2 aria-hidden="true" className="size-4" /> Remove
        </Button>
        <Button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${addr.label}`}
          className="h-10 w-[90px] text-[13px]"
        >
          <Pencil aria-hidden="true" className="size-3.5" /> Edit
        </Button>
      </div>
    </article>
  );
}
