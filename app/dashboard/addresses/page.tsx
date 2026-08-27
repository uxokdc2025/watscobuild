"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "../_components/dashboard-shell";
import { Button } from "@/components/ui/button";
import type { Address, AddressFormData, AddressFormErrors } from "./_lib/types";
import { ACCOUNT_ADDRESSES, ACCOUNT_ID, EMPTY_FORM, validateAddressForm } from "./_lib/fixtures";
import { AddressCard } from "./_components/address-card";
import { AddressFormDialog } from "./_components/address-form-dialog";
import { ConfirmRemoveDialog } from "./_components/confirm-remove-dialog";

export default function AddressesPage() {
  const [userAddresses, setUserAddresses] = useState<Address[]>([
    {
      id: "user-1",
      kind: "user",
      label: "Nashua job site",
      name: "David Whiteside",
      company: "Whiteside Mechanical LLC",
      street1: "1248 Daniel Webster Hwy",
      city: "Nashua",
      state: "NH",
      zip: "03060",
      phone: "+1 978 657 8990",
      isDefault: false,
    },
  ]);
  const [accountAddresses, setAccountAddresses] = useState<Address[]>(ACCOUNT_ADDRESSES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [confirmRemove, setConfirmRemove] = useState<Address | null>(null);

  const allAddresses = [...userAddresses, ...accountAddresses];

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, name: "David Whiteside", phone: "+1 978 657 8990" });
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(addr: Address) {
    // Only user-saved addresses are editable; account cards do not expose this.
    if (addr.kind !== "user") return;
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      name: addr.name,
      company: addr.company,
      street1: addr.street1,
      street2: addr.street2 ?? "",
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      phone: addr.phone,
    });
    setErrors({});
    setDialogOpen(true);
  }

  function handleSetDefault(id: string) {
    setUserAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    setAccountAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    const target = [...userAddresses, ...accountAddresses].find((a) => a.id === id);
    toast.success(`Default updated — ${target?.label ?? "address"} is now your default.`);
  }

  function handleRemove(addr: Address) {
    // User-saved removal; account addresses are read-only and do not expose this.
    setUserAddresses((prev) => prev.filter((a) => a.id !== addr.id));
    setAccountAddresses((prev) => prev.filter((a) => a.id !== addr.id));
    const remaining = [...userAddresses, ...accountAddresses].filter((a) => a.id !== addr.id);
    if (addr.isDefault && remaining.length) {
      const nextId = remaining[0].id;
      setTimeout(() => {
        setUserAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === nextId })));
        setAccountAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === nextId })));
      }, 0);
    }
    toast.success(`Removed ${addr.label}.`);
    setConfirmRemove(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateAddressForm(form);
    setErrors(v);
    if (Object.keys(v).length) {
      toast.error("Check the highlighted fields.");
      return;
    }
    if (editingId) {
      const patch = {
        label: form.label.trim(),
        name: form.name.trim(),
        company: form.company.trim(),
        street1: form.street1.trim(),
        street2: form.street2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        zip: form.zip.trim(),
        phone: form.phone.trim(),
      };
      setUserAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...patch } : a)));
      // Account records are read-only; no edit path for account kind.
      toast.success(`Address updated — ${patch.label} saved.`);
    } else {
      const newAddr: Address = {
        id: `user-${Date.now()}`,
        kind: "user",
        label: form.label.trim(),
        name: form.name.trim(),
        company: form.company.trim(),
        street1: form.street1.trim(),
        street2: form.street2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        zip: form.zip.trim(),
        phone: form.phone.trim(),
        isDefault: allAddresses.length === 0,
      };
      setUserAddresses((prev) => [newAddr, ...prev]);
      toast.success(`Address added — ${newAddr.label} is ready for checkout.`);
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    setErrors({});
  }

  function handleFormChange(patch: Partial<AddressFormData>) {
    setForm((f) => ({ ...f, ...patch }));
  }

  return (
    <DashboardShell
      title="Address Book"
      description="Keep job sites, warehouses, and branch pickups ready for checkout. Manage your saved addresses and review the locations on file with your Homans account."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={openAdd} className="min-h-10 w-full px-3.5 sm:w-auto">
            <Plus aria-hidden="true" className="size-4" />
            Add new address
          </Button>
        </div>

        {/* User addresses — editable */}
        <section
          aria-labelledby="user-addresses-heading"
          className="space-y-3"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="user-addresses-heading" className="text-base font-semibold">
                Your addresses
              </h2>
              <p className="text-sm text-muted-foreground">
                Saved by you for faster checkout and deliveries.
              </p>
            </div>
            <span
              aria-label={`${userAddresses.length} saved addresses`}
              className="inline-flex w-fit items-center rounded-full border bg-background px-3 py-1 text-xs font-medium"
            >
              {userAddresses.length} saved
            </span>
          </div>

          <div>
            {userAddresses.length === 0 ? (
              <div className="rounded-md border border-dashed bg-muted/20 px-6 py-12 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-background shadow-xs">
                  <MapPin aria-hidden="true" className="size-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-base font-semibold">No saved addresses yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Add a job site, warehouse, or branch pickup you use often. Saved addresses appear
                  at checkout and can be set as your default for faster ordering.
                </p>
                <Button onClick={openAdd} variant="outline" className="mt-6 min-h-11">
                  <Plus aria-hidden="true" className="size-4" />
                  Add new address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {userAddresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    addr={addr}
                    onSetDefault={() => handleSetDefault(addr.id)}
                    onEdit={() => openEdit(addr)}
                    onRemove={() => setConfirmRemove(addr)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Account addresses — read-only with checkout preference */}
        <section
          aria-labelledby="account-addresses-heading"
          className="space-y-3"
        >
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 id="account-addresses-heading" className="text-base font-semibold">
                  Account addresses
                </h2>
                <p className="text-sm text-muted-foreground">
                  Locations on file with your Homans account. Contact your branch to update billing
                  details.
                </p>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center rounded-md border bg-background px-2.5 py-1 font-mono text-xs">
                {ACCOUNT_ID} homans
              </span>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
        open={dialogOpen}
        editingId={editingId}
        form={form}
        errors={errors}
        onOpenChange={setDialogOpen}
        onClose={closeDialog}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      <ConfirmRemoveDialog
        address={confirmRemove}
        onCancel={() => setConfirmRemove(null)}
        onConfirm={handleRemove}
      />
    </DashboardShell>
  );
}
