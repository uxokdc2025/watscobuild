"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { DashboardHome } from "../_components/dashboard-home";
import { Button } from "@/components/ui/button";

/* Second navigation style — the dashboard side nav reversed out on a charcoal
   panel (white text + icons, AA-compliant). The body is the REAL dashboard
   (shared DashboardHome), so nothing is missing; only navVariant differs. */

export default function NavCharcoalPreview() {
  return (
    <DashboardShell
      navVariant="charcoal"
      activeHref="/dashboard"
      title="Dashboard"
      description="A single place to manage your account, purchasing tools, and orders."
      actions={
        <Button asChild variant="outline">
          <Link href="/dashboard?signedin=1">
            View Default Nav
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Second navigation style.</span>{" "}
          The side nav is reversed out on a charcoal panel — white text and icons,
          AA-compliant contrast. The rest of the account UI is unchanged.
        </div>
        <DashboardHome />
      </div>
    </DashboardShell>
  );
}
