"use client";

import * as React from "react";
import { Building2, Check, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { AccountNav } from "@/components/ui/account-nav";
import { DRAWER_MOTION_MS, DrawerBackButton, DrawerCloseButton, DrawerPanel, drawerOverlayClassName } from "@/components/ui/drawer";

const SHIP_TO_OPTIONS = [
  "50 WILLIAMS STREET - CASH 1248 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "DION DEJESUS - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "DRIEHAUS-ATHENS RESIDENCE - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "FAIRBANKS - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "FALLON - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "HENRY NGUYEN - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "HM03 - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "CASH 1248 - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "INSULATION CONTRACTORS - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "HOSSELBARTH - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "KELLEY - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "MCFARLAND - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "MEREDITH 2 - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "MEREDITH - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
  "NORTH ESSEX COMMUNITY COLLEGE - 613 MAIN STREET ***ALL CASH SALES ARE FINAL***, WILMINGTON, US-MA, 01887",
];

const ACCOUNT_OPTIONS = [
  { id: "HOM509973", name: "Homans Associates", location: "Manchester, NH", role: "Current account" },
  { id: "HOM509974", name: "Homans Associates", location: "Wilmington, MA", role: "Commercial account" },
  { id: "HOM509975", name: "Homans Associates", location: "Nashua, NH", role: "Service account" },
];

export function AccountFlyout({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [shipToOpen, setShipToOpen] = React.useState(false);
  const [shipToClosing, setShipToClosing] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [accountClosing, setAccountClosing] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState("HOM509973");
  const selectedAccountDetails = ACCOUNT_OPTIONS.find((account) => account.id === selectedAccount) ?? ACCOUNT_OPTIONS[0];

  const closeAccount = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    // Reset `closing` too — otherwise the flyout stays flagged as closing and
    // can never reopen (open={!closing} stays false on the next open).
    window.setTimeout(() => { setOpen(false); setClosing(false); }, DRAWER_MOTION_MS);
  }, [closing]);

  const openAccount = React.useCallback(() => {
    setClosing(false);
    setOpen(true);
  }, []);

  const closeShipTo = React.useCallback(() => {
    if (shipToClosing) return;
    setShipToClosing(true);
    window.setTimeout(() => { setShipToOpen(false); setShipToClosing(false); }, DRAWER_MOTION_MS);
  }, [shipToClosing]);

  const closeAccountPicker = React.useCallback(() => {
    if (accountClosing) return;
    setAccountClosing(true);
    window.setTimeout(() => { setAccountOpen(false); setAccountClosing(false); }, DRAWER_MOTION_MS);
  }, [accountClosing]);

  if (!signedIn) {
    return <button type="button" className="hidden text-left text-xs leading-tight sm:block">Sign In</button>;
  }

  return (
    <>
      <button type="button" onClick={openAccount} className="hidden rounded-md px-2 py-1 text-left text-xs leading-tight transition-colors hover:bg-white/10 sm:block">
        <span className="block opacity-90">Hello, David</span>
        <span className="block font-bold">My Account</span>
      </button>
      {open ? (
        <div className={drawerOverlayClassName(closing)} onMouseDown={(event) => event.target === event.currentTarget && closeAccount()}>
          <DrawerPanel open={!closing} side="right" role="dialog" aria-modal="true" aria-label="My Account" className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-background text-foreground shadow-2xl">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-neutral-900">My Account</h2>
              <DrawerCloseButton label="Close account" onClick={closeAccount} />
            </header>
            <div className="border-b px-5 py-4">
              <p className="font-semibold">Hello, David Whiteside</p>
              <p className="mt-2 text-xs text-muted-foreground">Account: #erp|{selectedAccountDetails.id}</p>
              <button type="button" onClick={() => setShipToOpen(true)} className="mt-2 block w-full text-left text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <span className="block">Ship To:</span>
                <span className="block">613 MAIN STREET · ALL CASH SALES ARE FINAL</span>
              </button>
              <div className="mt-4 flex gap-2">
                <Button type="button" variant="outline" size="lg" onClick={() => setAccountOpen(true)} className="flex-1 text-xs font-semibold">Change account</Button>
                <Button type="button" size="lg" onClick={() => setShipToOpen(true)} className="flex-1 gap-1 text-xs font-semibold">Change ship to <ChevronRight className="size-4" /></Button>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 flex-col">
              <AccountNav onNavigate={closeAccount} />
              <div className="mt-auto border-t p-5"><Button type="button" variant="outline" size="lg" onClick={closeAccount} className="w-full">Sign Out</Button></div>
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

export function CartTrigger({ signedIn }: { signedIn: boolean }) {
  const { totalCount, openCart } = useCart();
  return (
    <button type="button" aria-label="Cart" onClick={openCart} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] leading-tight transition-colors hover:bg-white/10">
      <ShoppingCart className="size-6 shrink-0" />
      <span className="hidden text-left sm:block">
        {signedIn ? <span className="block font-semibold">{totalCount} Item{totalCount === 1 ? "" : "s"}</span> : null}
        <span className="block">Cart</span>
      </span>
    </button>
  );
}
