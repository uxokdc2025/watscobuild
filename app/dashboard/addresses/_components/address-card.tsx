"use client";

import { Check, MapPin, Building2, Phone, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Address } from "../_lib/types";

type UserCardProps = {
  addr: Address;
  onSetDefault: () => void;
  onEdit: () => void;
  onRemove: () => void;
};

type AccountCardProps = {
  addr: Address;
  onSetDefault: () => void;
};

type Props = (UserCardProps | AccountCardProps) & { addr: Address };

function isUserProps(p: Props): p is UserCardProps {
  return p.addr.kind === "user";
}

export function AddressCard(props: Props) {
  const { addr, onSetDefault } = props;
  const isAccount = addr.kind === "account";
  const isUser = isUserProps(props);
  const onEdit = isUser ? props.onEdit : undefined;
  const onRemove = isUser ? props.onRemove : undefined;

  return (
    <div
      className={`flex flex-col rounded-lg border bg-background p-3 shadow-sm ${addr.isDefault ? "border-l-2 border-l-primary" : ""}`}
    >
      {/* Badge row — default vs kind */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {addr.isDefault ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
              <Check aria-hidden="true" className="size-3.5" />
              Default
              <span className="sr-only"> — default shipping address</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {isAccount ? "Account" : "Saved for checkout"}
            </span>
          )}
        </div>
        {/* Keep top-right minimal; account ID is secondary and also shown at bottom */}
        {!isAccount ? (
          <span className="shrink-0 text-[11px] font-medium tracking-tight text-muted-foreground">
            Saved
          </span>
        ) : null}
      </div>

      {/* Primary: label */}
      <h3 className="mt-3 text-[13px] font-semibold leading-tight">{addr.label}</h3>

      {/* Scannable body: recipient/company, address, phone */}
      <div className="mt-3 space-y-1.5 text-[13px] leading-5">
        <p className="flex items-start gap-2">
          <Building2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span>
            <span className="font-medium">{addr.name}</span>
            {addr.company ? (
              <span className="text-muted-foreground"> — {addr.company}</span>
            ) : null}
          </span>
        </p>
        <p className="flex items-start gap-2">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span>
            {addr.street1}
            {addr.street2 ? `, ${addr.street2}` : ""}
            <br />
            {addr.city}, {addr.state} {addr.zip}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Phone aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span>{addr.phone}</span>
        </p>
      </div>

      {/* Actions — account vs user distinction */}
      <div className="mt-auto flex min-h-11 flex-wrap items-center gap-2 border-t pt-3">
        {!addr.isDefault ? (
          <Button
            variant="outline"
            size="sm"
            className="h-10 min-w-[132px] justify-center text-[13px]"
            onClick={onSetDefault}
            aria-label={`Set ${addr.label} as default`}
          >
            <Star aria-hidden="true" className="size-4" />
            Set as default
          </Button>
        ) : (
            <span className="inline-flex h-10 min-w-[132px] items-center justify-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 text-[13px] font-medium text-primary">
            <Check aria-hidden="true" className="size-4" />
            Default address
          </span>
        )}

        {isUser && onEdit ? (
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11 text-[13px]"
            onClick={onEdit}
            aria-label={`Edit ${addr.label}`}
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit
          </Button>
        ) : null}
        {isUser && onRemove ? (
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11 text-[13px] text-destructive hover:text-destructive/80"
            onClick={onRemove}
            aria-label={`Remove ${addr.label}`}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}

// Convenience re-exports for caller ergonomics — keep call sites explicit.
export function UserAddressCard(p: UserCardProps) {
  return <AddressCard {...p} />;
}

export function AccountAddressCard(p: AccountCardProps) {
  return <AddressCard {...p} />;
}
