"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { AddressFormData, AddressFormErrors } from "../_lib/types";

type Props = {
  open: boolean;
  editingId: string | null;
  form: AddressFormData;
  errors: AddressFormErrors;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onChange: (patch: Partial<AddressFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function AddressFormDialog({
  open,
  editingId,
  form,
  errors,
  onOpenChange,
  onClose,
  onChange,
  onSubmit,
}: Props) {
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : onClose())}>
      <DialogContent drawerSide="right" className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-5 sm:max-w-[480px] sm:p-6">
        <DialogHeader>
          <DialogTitle>{editingId ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {editingId
              ? "Update the details for this shipping destination."
              : "Add a job site, warehouse, or pickup location for faster checkout."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="addr-label">
              Label <span aria-hidden="true" className="text-destructive">*</span>
            </Label>
            <Input
              id="addr-label"
              ref={firstFieldRef}
              placeholder="e.g. Nashua job site — Building B"
              value={form.label}
              onChange={(e) => onChange({ label: e.target.value })}
              aria-invalid={!!errors.label}
              aria-describedby={errors.label ? "err-label" : undefined}
              autoComplete="off"
            />
            {errors.label ? (
              <p id="err-label" className="text-xs text-destructive">
                {errors.label}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Shown on the card and at checkout.</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="addr-name">
                Recipient name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addr-name"
                placeholder="David Whiteside"
                value={form.name}
                onChange={(e) => onChange({ name: e.target.value })}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "err-name" : undefined}
                autoComplete="name"
              />
              {errors.name ? <p id="err-name" className="text-xs text-destructive">{errors.name}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-company">Company</Label>
              <Input
                id="addr-company"
                placeholder="Whiteside Mechanical LLC"
                value={form.company}
                onChange={(e) => onChange({ company: e.target.value })}
                autoComplete="organization"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-street1">
              Street address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="addr-street1"
              placeholder="613 Main Street"
              value={form.street1}
              onChange={(e) => onChange({ street1: e.target.value })}
              aria-invalid={!!errors.street1}
              aria-describedby={errors.street1 ? "err-street1" : undefined}
              autoComplete="street-address"
            />
            {errors.street1 ? <p id="err-street1" className="text-xs text-destructive">{errors.street1}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-street2">Apt, suite, dock</Label>
            <Input
              id="addr-street2"
              placeholder="Suite 200, Dock B, Building C"
              value={form.street2}
              onChange={(e) => onChange({ street2: e.target.value })}
              autoComplete="address-line2"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="space-y-1.5 sm:col-span-3">
              <Label htmlFor="addr-city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addr-city"
                placeholder="Manchester"
                value={form.city}
                onChange={(e) => onChange({ city: e.target.value })}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? "err-city" : undefined}
                autoComplete="address-level2"
              />
              {errors.city ? <p id="err-city" className="text-xs text-destructive">{errors.city}</p> : null}
            </div>
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="addr-state">
                State <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addr-state"
                placeholder="NH"
                maxLength={2}
                value={form.state}
                onChange={(e) => onChange({ state: e.target.value })}
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? "err-state" : undefined}
                autoComplete="address-level1"
                className="uppercase"
              />
              {errors.state ? <p id="err-state" className="text-xs text-destructive">{errors.state}</p> : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="addr-zip">
                ZIP <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addr-zip"
                placeholder="03102"
                value={form.zip}
                onChange={(e) => onChange({ zip: e.target.value })}
                aria-invalid={!!errors.zip}
                aria-describedby={errors.zip ? "err-zip" : undefined}
                autoComplete="postal-code"
              />
              {errors.zip ? <p id="err-zip" className="text-xs text-destructive">{errors.zip}</p> : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-phone">
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="addr-phone"
              placeholder="+1 603 555 0142"
              value={form.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "err-phone" : undefined}
              autoComplete="tel"
            />
            {errors.phone ? <p id="err-phone" className="text-xs text-destructive">{errors.phone}</p> : null}
            <p className="text-xs text-muted-foreground">Used for delivery updates and branch contact.</p>
          </div>

          <div className="sticky bottom-0 z-10 -mx-5 flex flex-col-reverse gap-3 border-t bg-background px-5 py-4 sm:-mx-6 sm:flex-row sm:justify-end sm:px-6">
            <Button type="button" variant="outline" className="min-h-11" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="min-h-11">
              {editingId ? "Save changes" : "Save address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
