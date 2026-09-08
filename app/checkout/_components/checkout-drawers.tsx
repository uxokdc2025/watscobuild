"use client";

import * as React from "react";
import { Building2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DrawerPanel,
  DrawerCloseButton,
  DRAWER_MOTION_MS,
  drawerOverlayClassName,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  InventoryStoreLocatorDrawer,
  type LocatorBranch,
} from "@/app/store-locator/_inventory-drawers";
import type {
  BrandAddress,
  BrandAddressGroup,
  BrandBranch,
  BrandCheckoutConfig,
} from "../_lib/brand-checkout";

/* ───────────────────────── Shared right-drawer shell ─────────────────────────
 * Every centered checkout Dialog is now a right drawer. This shell owns the
 * exit animation (self-managed `closing` so a drawer can reopen), the scrim,
 * focus-trappable panel, header, and an optional sticky footer. It mirrors the
 * in-page drawer pattern the shopping-list "Replacements" drawer uses. */

export function CheckoutDrawer({
  open,
  onClose,
  title,
  description,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [closing, setClosing] = React.useState(false);

  const requestClose = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, DRAWER_MOTION_MS);
  }, [closing, onClose]);

  if (!open) return null;

  return (
    <div
      className={drawerOverlayClassName(closing)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <DrawerPanel
        open={!closing}
        side="right"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-background text-foreground shadow-2xl"
      >
        <header className="sticky top-0 z-10 shrink-0 border-b bg-background px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{title}</h2>
            <DrawerCloseButton label={`Close ${title.toLowerCase()}`} onClick={requestClose} />
          </div>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 shrink-0 border-t bg-background p-4">{footer}</div>
        ) : null}
      </DrawerPanel>
    </div>
  );
}

/* Small labeled field, shared by the add-address and card drawers. */
function TextField({
  id,
  label,
  required = false,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { id: string; label: string; required?: boolean; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      <Input id={id} required={required} {...props} />
    </div>
  );
}

/* ───────────────────────── Grouped address book (shared) ───────────────────────── */

export const GROUP_LABEL: Record<BrandAddressGroup, string> = {
  job: "Job account",
  account: "Account",
  billing: "Billing",
};

export const GROUP_ORDER: BrandAddressGroup[] = ["job", "account", "billing"];

/** One selectable address row — Default badge + Outside-radius flag preserved. */
export function AddressRow({ address, selected }: { address: BrandAddress; selected: boolean }) {
  return (
    <Label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
      )}
    >
      <RadioGroupItem value={address.id} className="mt-0.5" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{address.name}</span>
          {address.isDefault ? (
            <span className="rounded-sm bg-in-stock/12 px-1.5 py-0.5 text-[11px] font-semibold text-in-stock">
              Default
            </span>
          ) : null}
          {address.outOfRadius ? (
            <span className="rounded-sm bg-yellow-400/20 px-1.5 py-0.5 text-[11px] font-semibold text-yellow-800 dark:text-yellow-300">
              Outside radius
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground">
          {address.line1}, {address.city}, {address.state} {address.zip}
        </span>
        {address.contact ? (
          <span className="block text-xs text-muted-foreground">{address.contact}</span>
        ) : null}
      </span>
    </Label>
  );
}

/* ───────────────────────── Store finder (real store-locator picker) ─────────────────────────
 * The pickup "Change" branch picker REUSES the real store-locator drawer,
 * seeded with the brand's own branches. No bespoke store-finder dialog. */

export function StoreFinderDrawer({
  open,
  onClose,
  branches,
  current,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  branches: BrandBranch[];
  current: BrandBranch;
  onSelect: (branch: BrandBranch) => void;
}) {
  const [closing, setClosing] = React.useState(false);

  const requestClose = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, DRAWER_MOTION_MS);
  }, [closing, onClose]);

  if (!open) return null;

  const locatorBranches: LocatorBranch[] = branches.map((b) => ({
    name: b.name,
    miles: b.miles,
    hours: b.hours,
    tag: b.current ? "current" : undefined,
    address: b.address,
  }));

  return (
    <div
      className={drawerOverlayClassName(closing)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <DrawerPanel
        open={!closing}
        side="right"
        role="dialog"
        aria-modal="true"
        aria-label="Find a branch"
        className="absolute inset-y-0 right-0 flex"
      >
        <InventoryStoreLocatorDrawer
          heading="Find a branch"
          showProductHeader={false}
          showStock={false}
          branches={locatorBranches}
          selectedStore={current.name}
          onSelectStore={(name) => {
            const picked = branches.find((b) => b.name === name);
            if (picked) onSelect(picked);
            requestClose();
          }}
          onClose={requestClose}
        />
      </DrawerPanel>
    </div>
  );
}

/* ───────────────────────── Add delivery address (was a centered Dialog) ───────────────────────── */

export function AddAddressDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const formId = "add-address-form";
  return (
    <CheckoutDrawer
      open={open}
      onClose={onClose}
      title="Add a delivery address"
      description="Add a one-time address or save it to your address book."
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            Save address
          </Button>
        </div>
      }
    >
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="new-first" label="First name" required placeholder="First name" autoFocus />
          <TextField id="new-last" label="Last name" required placeholder="Last name" />
          <TextField id="new-company" label="Company" placeholder="Company (optional)" className="sm:col-span-2" />
          <TextField id="new-phone" label="Phone" required placeholder="(603) 555-0100" type="tel" />
          <TextField id="new-country" label="Country" required defaultValue="United States" />
          <TextField id="new-street1" label="Street address" required placeholder="Street address" className="sm:col-span-2" />
          <TextField id="new-street2" label="Street address 2" placeholder="Suite, unit, building (optional)" className="sm:col-span-2" />
          <TextField id="new-city" label="City" required placeholder="City" />
          <TextField id="new-state" label="State" required placeholder="State" />
          <TextField id="new-zip" label="ZIP code" required placeholder="ZIP" />
        </div>
        <Label className="flex items-center gap-3 rounded-md border p-3 text-sm font-normal">
          <Checkbox defaultChecked />
          Save this address to my address book
        </Label>
      </form>
    </CheckoutDrawer>
  );
}

/* ───────────────────────── Address book "See all (N)" ─────────────────────────
 * Full account address book — searchable, radio-select; selecting applies the
 * choice back and closes. Peirce-type accounts carry 40+, so never dump inline. */

export function AddressBookDrawer({
  open,
  onClose,
  addresses,
  addressId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  addresses: BrandAddress[];
  addressId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return addresses;
    return addresses.filter((a) =>
      [a.name, a.line1, a.city, a.state, a.zip, a.contact].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [addresses, query]);

  return (
    <CheckoutDrawer open={open} onClose={onClose} title="Address book" description={`${addresses.length} saved addresses`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search addresses"
            aria-label="Search addresses"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
        <RadioGroup
          value={addressId}
          onValueChange={(id) => {
            onSelect(id);
            onClose();
          }}
          className="gap-4"
        >
          {GROUP_ORDER.map((group) => {
            const rows = filtered.filter((a) => a.group === group);
            if (!rows.length) return null;
            return (
              <div key={group} className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {GROUP_LABEL[group]}
                </p>
                <div className="grid gap-2">
                  {rows.map((a) => (
                    <AddressRow key={a.id} address={a} selected={a.id === addressId} />
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 ? (
            <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              No addresses match “{query}”.
            </p>
          ) : null}
        </RadioGroup>
      </div>
    </CheckoutDrawer>
  );
}

/* ───────────────────────── Switch account (was a centered Dialog) ───────────────────────── */

export function SwitchAccountDrawer({
  open,
  onClose,
  accounts,
  currentId,
  defaultId,
  onSelect,
  onSetDefault,
}: {
  open: boolean;
  onClose: () => void;
  accounts: BrandCheckoutConfig["switchAccounts"];
  currentId: string;
  defaultId: string;
  onSelect: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  return (
    <CheckoutDrawer
      open={open}
      onClose={onClose}
      title="Switch account"
      description="Choose the account, ship-to, company, or location for this order."
    >
      <ul className="space-y-2">
        {accounts.map((a) => {
          const isCurrent = a.id === currentId;
          const isDefault = a.id === defaultId;
          return (
            <li key={a.id}>
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3 rounded-md border p-3",
                  isCurrent && "border-primary bg-primary/5"
                )}
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    <Building2 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {a.name}
                    <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {a.kind}
                    </span>
                    {isDefault ? (
                      <span className="rounded-sm bg-in-stock/12 px-1.5 py-0.5 text-[11px] font-semibold text-in-stock">
                        Default
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{a.detail}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!isDefault ? (
                    <Button size="sm" variant="tertiary" onClick={() => onSetDefault(a.id)}>
                      Set default
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent}
                    onClick={() => {
                      onSelect(a.id);
                      onClose();
                    }}
                  >
                    {isCurrent ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </CheckoutDrawer>
  );
}

/* ───────────────────────── Credit-card entry (was inline fields) ───────────────────────── */

export function CreditCardDrawer({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  /** Returns the last-4 of the entered card so the parent can list + select it. */
  onSave: (tail: string) => void;
}) {
  const [number, setNumber] = React.useState("");
  const formId = "add-card-form";
  const tail = number.replace(/\D/g, "").slice(-4);

  return (
    <CheckoutDrawer
      open={open}
      onClose={onClose}
      title="Add a card"
      description="Your card is encrypted and stored securely."
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={tail.length < 4}>
            Save card
          </Button>
        </div>
      }
    >
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          onSave(tail);
          setNumber("");
          onClose();
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <TextField
          id="card-number"
          label="Card number"
          required
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          autoComplete="cc-number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="sm:col-span-2"
        />
        <TextField id="card-name" label="Name on card" required placeholder="Full name" autoComplete="cc-name" className="sm:col-span-2" />
        <TextField id="card-exp" label="Expiration" required placeholder="MM / YY" autoComplete="cc-exp" />
        <TextField id="card-cvv" label="CVV" required placeholder="123" inputMode="numeric" autoComplete="cc-csc" />
        <TextField id="card-zip" label="Billing ZIP" required placeholder="ZIP" inputMode="numeric" className="sm:col-span-2" />
      </form>
    </CheckoutDrawer>
  );
}
