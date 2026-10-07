"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "../_components/dashboard-shell";
import { Button } from "@/components/ui/button";
import type { Address, AddressFormData, AddressFormErrors } from "./_lib/types";
import {
  ACCOUNT_ADDRESSES,
  ACCOUNT_ID,
  EMPTY_FORM,
  SAVED_ADDRESSES,
  validateAddressForm,
} from "./_lib/fixtures";
import { AddressCard } from "./_components/address-card";
import { SavedAddressCard } from "./_components/saved-address-card";
import { AddressFormDialog } from "./_components/address-form-dialog";
import { ConfirmRemoveDialog } from "./_components/confirm-remove-dialog";

function toFormData(addr: Address): AddressFormData {
  const [firstName = "", ...rest] = addr.name.split(" ");
  return {
    label: addr.label,
    firstName,
    lastName: rest.join(" "),
    company: addr.company,
    street1: addr.street1,
    street2: addr.street2 ?? "",
    city: addr.city,
    state: addr.state,
    zip: addr.zip,
    phone: addr.phone,
    isDefault: addr.isDefault,
  };
}

export default function AddressesPage() {
  const [accountAddresses, setAccountAddresses] = useState<Address[]>(ACCOUNT_ADDRESSES);
  const [saved, setSaved] = useState<Address[]>(SAVED_ADDRESSES);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [removing, setRemoving] = useState<Address | null>(null);

  function handleSetDefault(id: string) {
    setAccountAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    const target = accountAddresses.find((a) => a.id === id);
    toast.success(`Default updated — ${target?.label ?? "address"} is now your default.`);
  }

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, isDefault: saved.length === 0 });
    setErrors({});
    setFormOpen(true);
  }

  function openEdit(addr: Address) {
    setEditingId(addr.id);
    setForm(toFormData(addr));
    setErrors({});
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validateAddressForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload: Omit<Address, "id"> = {
      kind: "user",
      label: form.label.trim(),
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      company: form.company.trim(),
      street1: form.street1.trim(),
      street2: form.street2.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      zip: form.zip.trim(),
      phone: form.phone.trim(),
      isDefault: form.isDefault,
    };
    const id = editingId ?? `saved-${Date.now()}`;

    setSaved((prev) => {
      const next = editingId
        ? prev.map((a) => (a.id === editingId ? { ...a, ...payload } : a))
        : [...prev, { id, ...payload }];
      // Only one default at a time; fall back to keeping the previous default.
      return payload.isDefault
        ? next.map((a) => ({ ...a, isDefault: a.id === id }))
        : next;
    });
    toast.success(editingId ? "Address updated." : "Address saved.");
    setFormOpen(false);
  }

  function handleRemove(addr: Address) {
    setSaved((prev) => prev.filter((a) => a.id !== addr.id));
    setRemoving(null);
    toast.success(`Removed ${addr.label}.`);
  }

  return (
    <DashboardShell
      title="Address Book"
      description="Manage your saved addresses and review the locations on file with your Homans account."
      actions={
        <Button type="button" onClick={openAdd} className="min-h-10">
          <Plus aria-hidden="true" className="size-4" /> Add address
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Saved addresses — user-managed card grid */}
        <section aria-labelledby="saved-addresses-heading" className="space-y-3">
          <h2 id="saved-addresses-heading" className="text-base font-semibold">
            Saved addresses
          </h2>
          {saved.length ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {saved.map((addr) => (
                <SavedAddressCard
                  key={addr.id}
                  addr={addr}
                  onEdit={() => openEdit(addr)}
                  onRemove={() => setRemoving(addr)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed bg-background px-6 py-12 text-center text-sm text-muted-foreground shadow-sm">
              No saved addresses yet. Use “Add address” to save a job site or shop.
            </div>
          )}
        </section>

        {/* Account addresses — read-only with checkout preference */}
        <section aria-labelledby="account-addresses-heading" className="space-y-3">
          <div className="flex flex-col items-start gap-2">
            <span className="inline-flex w-fit shrink-0 items-center rounded-md border bg-background px-2.5 py-1 font-mono text-xs">
              {ACCOUNT_ID} homans
            </span>
            <h2 id="account-addresses-heading" className="text-base font-semibold">
              Account addresses
            </h2>
          </div>

          <div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {accountAddresses.map((addr) => (
                <AddressCard key={addr.id} addr={addr} onSetDefault={() => handleSetDefault(addr.id)} />
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Account addresses are managed by your distributor. Setting a default here updates your
              checkout preference; billing changes require branch approval.
            </p>
          </div>
        </section>
      </div>

      <AddressFormDialog
        open={formOpen}
        editingId={editingId}
        form={form}
        errors={errors}
        onOpenChange={setFormOpen}
        onClose={closeForm}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        onSubmit={handleSubmit}
      />
      <ConfirmRemoveDialog
        address={removing}
        onCancel={() => setRemoving(null)}
        onConfirm={handleRemove}
      />
    </DashboardShell>
  );
}
