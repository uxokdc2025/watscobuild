"use client";

import { AccountFlyout } from "../../pdp/_lib/account-flyout";

export default function AccountDrawerReference() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blocks</p>
        <h1 className="text-3xl font-bold tracking-tight">Account Drawer</h1>
        <p className="max-w-2xl text-muted-foreground">
          The global account panel, identical on every brand&apos;s header. It slides in from the{" "}
          <span className="font-medium text-foreground">right</span> and holds account switching,
          ship-to, and the account navigation. Trigger it from the header control below.
        </p>
      </header>
      <div className="rounded-xl border bg-card p-6">
        <p className="mb-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Header control
        </p>
        <div className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground">
          <AccountFlyout signedIn />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Click <span className="font-medium text-foreground">My Account</span> to open the drawer.
        </p>
      </div>
    </main>
  );
}
