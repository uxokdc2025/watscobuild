"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  ListChecks,
  MapPin,
  ShoppingCart,
  Truck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DRAWER_MOTION_MS,
  DrawerBackButton,
  DrawerCloseButton,
  DrawerPanel,
  drawerOverlayClassName,
} from "@/components/ui/drawer";

/* ─────────────────────────── v2 (nested) account fly-out ───────────────────────────
 * A variant of the My Account right-drawer (see account-flyout.tsx = v1). The only
 * change from v1: the flat "Shopping Lists" + "Saved Carts" rows are collapsed into a
 * single "Buying Tools" parent row (chevron). Tapping it SLIDES to a sub-panel headed
 * "Buying Tools" with a Back control — exactly the same slide+Back interaction the v1
 * Change account / Change ship-to sub-panels already use. Everything else is v1. */

// Mirrors the v1 fixtures — kept local so account-flyout.tsx (v1) stays untouched.
const SHIP_TO_OPTIONS = [
  "50 WILLIAMS STREET - CASH 1248 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "DION DEJESUS - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "DRIEHAUS-ATHENS RESIDENCE - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "FAIRBANKS - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "HENRY NGUYEN - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "HM03 - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "KELLEY - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "MEREDITH - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
];

const ACCOUNT_OPTIONS = [
  { id: "HOM509973", name: "Homans Associates", location: "Manchester, NH", role: "Current account" },
  { id: "HOM509974", name: "Homans Associates", location: "Wilmington, MA", role: "Commercial account" },
  { id: "HOM509975", name: "Homans Associates", location: "Nashua, NH", role: "Service account" },
];

/* The two rows that move under "Buying Tools" in v2. */
export const BUYING_TOOLS_ITEMS = [
  { label: "Shopping Lists", href: "/dashboard/shopping-lists", Icon: ListChecks },
  { label: "Saved Carts", href: "/dashboard/saved-carts", Icon: ShoppingCart },
] as const;

/* Top-level nav for v2: same order as v1, but the two Buying Tools children are
 * replaced by a single parent row placed where "Shopping Lists" used to sit. */
const TOP_LINKS = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Quotes", href: "/dashboard/quotes", Icon: FileText },
  { label: "Open Orders", href: "/dashboard/orders?status=open", Icon: Truck },
  { label: "Address Book", href: "/dashboard/addresses", Icon: MapPin },
  { label: "Card Management", href: "/dashboard/card-management", Icon: CreditCard },
] as const;

const ROW_BASE =
  "flex min-h-12 w-full items-center justify-between bg-background px-5 text-left text-sm text-foreground transition-colors hover:bg-muted hover:no-underline focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

/** v2 top-level account nav — flat rows, plus the "Buying Tools" parent that opens
 *  the sub-panel. Shared by the real drawer and the inline comparison demo. */
export function NestedAccountNav({
  onNavigate,
  onOpenBuyingTools,
  buyingToolsOpen,
}: {
  onNavigate?: () => void;
  onOpenBuyingTools: () => void;
  buyingToolsOpen: boolean;
}) {
  return (
    <nav
      aria-label="Account navigation"
      className="divide-y divide-border border-b border-border bg-background"
    >
      <Link href="/dashboard" onClick={onNavigate} className={ROW_BASE}>
        <span className="inline-flex items-center gap-2">
          <LayoutDashboard aria-hidden="true" className="size-4 text-muted-foreground" />
          Dashboard
        </span>
      </Link>
      <button
        type="button"
        onClick={onOpenBuyingTools}
        aria-expanded={buyingToolsOpen}
        aria-controls="buying-tools-subpanel"
        className={ROW_BASE}
      >
        <span className="inline-flex items-center gap-2">
          <Wrench aria-hidden="true" className="size-4 text-muted-foreground" />
          Buying Tools
        </span>
        <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
      </button>
      {TOP_LINKS.slice(1).map(({ label, href, Icon }) => (
        <Link key={label} href={href} onClick={onNavigate} className={ROW_BASE}>
          <span className="inline-flex items-center gap-2">
            <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

/** The slide-in "Buying Tools" sub-panel: Back control + the two grouped children. */
export function BuyingToolsSubPanel({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div id="buying-tools-subpanel" className="flex h-full flex-col bg-background">
      <div className="sticky top-0 flex shrink-0 items-center gap-3 border-b bg-background px-5 py-4">
        <DrawerBackButton label="Back to account" onClick={onBack} />
        <h3 className="text-[15px] leading-5 font-bold">Buying Tools</h3>
      </div>
      <nav aria-label="Buying Tools" className="divide-y divide-border">
        {BUYING_TOOLS_ITEMS.map(({ label, href, Icon }) => (
          <Link key={label} href={href} onClick={onNavigate} className={ROW_BASE}>
            <span className="inline-flex items-center gap-2">
              <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function AccountFlyoutNested({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [shipToOpen, setShipToOpen] = React.useState(false);
  const [shipToClosing, setShipToClosing] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [accountClosing, setAccountClosing] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [toolsClosing, setToolsClosing] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState("HOM509973");
  const selectedAccountDetails =
    ACCOUNT_OPTIONS.find((account) => account.id === selectedAccount) ?? ACCOUNT_OPTIONS[0];

  const closeAccount = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, DRAWER_MOTION_MS);
  }, [closing]);

  const closeShipTo = React.useCallback(() => {
    if (shipToClosing) return;
    setShipToClosing(true);
    window.setTimeout(() => {
      setShipToOpen(false);
      setShipToClosing(false);
    }, DRAWER_MOTION_MS);
  }, [shipToClosing]);

  const closeAccountPicker = React.useCallback(() => {
    if (accountClosing) return;
    setAccountClosing(true);
    window.setTimeout(() => {
      setAccountOpen(false);
      setAccountClosing(false);
    }, DRAWER_MOTION_MS);
  }, [accountClosing]);

  const closeTools = React.useCallback(() => {
    if (toolsClosing) return;
    setToolsClosing(true);
    window.setTimeout(() => {
      setToolsOpen(false);
      setToolsClosing(false);
    }, DRAWER_MOTION_MS);
  }, [toolsClosing]);

  if (!signedIn) {
    return <button type="button" className="hidden text-left text-xs leading-tight sm:block">Sign In</button>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setClosing(false); setOpen(true); }}
        className="hidden rounded-md px-2 py-1 text-left text-xs leading-tight transition-colors hover:bg-white/10 sm:block"
      >
        <span className="block opacity-90">Hello, David</span>
        <span className="block font-bold">My Account</span>
      </button>
      {open ? (
        <div
          className={drawerOverlayClassName(closing)}
          onMouseDown={(event) => event.target === event.currentTarget && closeAccount()}
        >
          <DrawerPanel
            open={!closing}
            side="right"
            role="dialog"
            aria-modal="true"
            aria-label="My Account"
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-background text-foreground shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-neutral-900">My Account</h2>
              <DrawerCloseButton label="Close account" onClick={closeAccount} />
            </header>
            <div className="border-b px-5 py-4">
              <p className="font-semibold">Hello, David Whiteside</p>
              <p className="mt-2 text-xs text-muted-foreground">Account: #erp|{selectedAccountDetails.id}</p>
              <button
                type="button"
                onClick={() => setShipToOpen(true)}
                className="mt-2 block w-full text-left text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="block">Ship To:</span>
                <span className="block">613 MAIN STREET · ALL CASH SALES ARE FINAL</span>
              </button>
              <div className="mt-4 flex gap-2">
                <Button type="button" variant="outline" size="lg" onClick={() => setAccountOpen(true)} className="flex-1 text-xs font-semibold">Change account</Button>
                <Button type="button" size="lg" onClick={() => setShipToOpen(true)} className="flex-1 gap-1 text-xs font-semibold">Change ship to <ChevronRight className="size-4" /></Button>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 flex-col">
              <NestedAccountNav
                onNavigate={closeAccount}
                onOpenBuyingTools={() => setToolsOpen(true)}
                buyingToolsOpen={toolsOpen}
              />
              <div className="mt-auto border-t p-5"><Button type="button" variant="outline" size="lg" onClick={closeAccount} className="w-full">Sign Out</Button></div>
              {toolsOpen ? (
                <DrawerPanel open={!toolsClosing} side="right" className="absolute inset-0 z-20 flex flex-col overflow-y-auto bg-background shadow-2xl">
                  <BuyingToolsSubPanel onBack={closeTools} onNavigate={closeAccount} />
                </DrawerPanel>
              ) : null}
              {shipToOpen ? (
                <DrawerPanel open={!shipToClosing} side="right" className="absolute inset-0 z-20 flex flex-col overflow-y-auto bg-background shadow-2xl">
                  <div className="sticky top-0 flex shrink-0 items-center gap-3 border-b bg-background px-5 py-4"><DrawerBackButton label="Back to account" onClick={closeShipTo} /><h3 className="text-[15px] leading-5 font-bold">Select Ship To</h3></div>
                  {SHIP_TO_OPTIONS.map((option) => <button key={option} type="button" onClick={closeShipTo} className="block w-full border-b px-5 py-3 text-left text-xs hover:bg-muted">{option}</button>)}
                </DrawerPanel>
              ) : null}
              {accountOpen ? (
                <DrawerPanel open={!accountClosing} side="right" className="absolute inset-0 z-20 flex flex-col overflow-y-auto bg-background shadow-2xl">
                  <div className="sticky top-0 flex shrink-0 items-center gap-3 border-b bg-background px-5 py-4"><DrawerBackButton label="Back to account" onClick={closeAccountPicker} /><h3 className="text-[15px] leading-5 font-bold">Select account</h3></div>
                  <div className="space-y-3 p-5">
                    <p className="text-xs text-muted-foreground">Choose the account you want to use for this session.</p>
                    {ACCOUNT_OPTIONS.map((account) => {
                      const selected = account.id === selectedAccount;
                      return (
                        <button key={account.id} type="button" onClick={() => { setSelectedAccount(account.id); closeAccountPicker(); }} className={`w-full rounded-md border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                          <span className="flex items-start justify-between gap-3">
                            <span className="flex items-start gap-3">
                              <Building2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                              <span>
                                <span className="block text-sm font-semibold">{account.name}</span>
                                <span className="mt-1 block text-xs text-muted-foreground">{account.location} · {account.role}</span>
                                <span className="mt-2 block font-mono text-xs text-muted-foreground">#{account.id}</span>
                              </span>
                            </span>
                            {selected ? <Check aria-hidden="true" className="size-4 shrink-0 text-primary" /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </DrawerPanel>
              ) : null}
            </div>
          </DrawerPanel>
        </div>
      ) : null}
    </>
  );
}
