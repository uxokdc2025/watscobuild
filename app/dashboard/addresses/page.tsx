"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "../_components/dashboard-shell";
import type { Address } from "./_lib/types";
import { ACCOUNT_ADDRESSES, ACCOUNT_ID } from "./_lib/fixtures";
import { AddressCard } from "./_components/address-card";

export default function AddressesPage() {
  const [accountAddresses, setAccountAddresses] = useState<Address[]>(ACCOUNT_ADDRESSES);

  function handleSetDefault(id: string) {
    setAccountAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    const target = accountAddresses.find((a) => a.id === id);
    toast.success(`Default updated — ${target?.label ?? "address"} is now your default.`);
  }

  return (
    <DashboardShell
      title="Address Book"
      description="Manage your saved addresses and review the locations on file with your Homans account."
    >
      <div className="space-y-6">
        {/* Account addresses — read-only with checkout preference */}
        <section
          aria-labelledby="account-addresses-heading"
          className="space-y-3"
        >
          <div>
            <div className="flex flex-col items-start gap-2">
              <span className="inline-flex w-fit shrink-0 items-center rounded-md border bg-background px-2.5 py-1 font-mono text-xs">
                {ACCOUNT_ID} homans
              </span>
              <h2 id="account-addresses-heading" className="text-base font-semibold">
                Account addresses
              </h2>
            </div>
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

    </DashboardShell>
  );
}
