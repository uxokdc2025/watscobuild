"use client";

import { AccountFlyout } from "@/app/pdp/_lib/account-flyout";
import { AccountFlyoutNested } from "@/app/pdp/_lib/account-flyout-nested";
import {
  DashboardNavFlat,
  DashboardNavNested,
} from "@/app/dashboard/_components/dashboard-nav";
import { InlineAccountMenu } from "./_inline-account-menu";

function ColumnLabel({ version, children }: { version: string; children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground">{version}</span>
      {children}
    </p>
  );
}

/* The brand-chrome strip that hosts a header account control, matching the
 * account-drawer reference page. Brand color lives only here, in the chrome. */
function HeaderControl({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground">
      {children}
    </div>
  );
}

export function AccountMenusCompare() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <header className="mb-10 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blocks</p>
        <h1 className="text-3xl font-bold tracking-tight">Account menus — v1 vs v2</h1>
        <p className="max-w-2xl text-muted-foreground">
          A choice for the account menus: keep the{" "}
          <span className="font-medium text-foreground">current flat</span> lists (v1), or{" "}
          <span className="font-medium text-foreground">nest</span> Shopping Lists and Saved Carts
          under a single <span className="font-medium text-foreground">Buying Tools</span> parent
          (v2) — the pattern the live Homans site uses. Both surfaces are shown below, current
          next to nested.
        </p>
      </header>

      {/* ── Account fly-out ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Account fly-out</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          The My Account panel from the storefront header. In v2, tapping{" "}
          <span className="font-medium text-foreground">Buying Tools</span> slides to a sub-panel
          with a Back control listing Shopping Lists + Saved Carts. Everything else is unchanged.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <ColumnLabel version="Version 1">current — flat</ColumnLabel>
            <InlineAccountMenu />
            <div className="mt-4 border-t pt-4">
              <p className="mb-3 text-xs text-muted-foreground">Open the real header drawer:</p>
              <HeaderControl>
                <AccountFlyout signedIn />
              </HeaderControl>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <ColumnLabel version="Version 2">nested — Buying Tools</ColumnLabel>
            <InlineAccountMenu nested />
            <div className="mt-4 border-t pt-4">
              <p className="mb-3 text-xs text-muted-foreground">Open the real header drawer:</p>
              <HeaderControl>
                <AccountFlyoutNested signedIn />
              </HeaderControl>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard nav ──────────────────────────────────────────────── */}
      <section className="mt-14 space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Dashboard nav</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          The account dashboard&apos;s left sidebar. In v2, Buying Tools is a group header with
          Shopping Lists + Saved Carts indented beneath it; the rest of the nav stays flat.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <ColumnLabel version="Version 1">current — flat</ColumnLabel>
            <div className="max-w-[240px]">
              <DashboardNavFlat active="/dashboard" />
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <ColumnLabel version="Version 2">nested — Buying Tools</ColumnLabel>
            <div className="max-w-[240px]">
              <DashboardNavNested active="/dashboard" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
