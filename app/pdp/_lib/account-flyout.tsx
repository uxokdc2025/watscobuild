"use client";

import * as React from "react";
import { ArrowLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { AccountNav } from "@/components/ui/account-nav";
import { DrawerBackButton, DrawerCloseButton, drawerOverlayClassName, drawerPanelClassName } from "@/components/ui/drawer";

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

const NESTED_MENU_ITEMS = {
  "Buying Tools": ["Shopping Lists", "Saved Carts"],
  Orders: ["Open Orders"],
  Account: ["Address Book", "Card Management"],
} as const;
type NestedMenu = keyof typeof NESTED_MENU_ITEMS;

export function AccountFlyout({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [shipToOpen, setShipToOpen] = React.useState(false);
  const [shipToClosing, setShipToClosing] = React.useState(false);
  const [nestedMenu, setNestedMenu] = React.useState<NestedMenu | null>(null);
  const [nestedMenuClosing, setNestedMenuClosing] = React.useState(false);

  const closeAccount = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => setOpen(false), 520);
  }, [closing]);

  const closeShipTo = React.useCallback(() => {
    if (shipToClosing) return;
    setShipToClosing(true);
    window.setTimeout(() => { setShipToOpen(false); setShipToClosing(false); }, 520);
  }, [shipToClosing]);

  const openNestedMenu = React.useCallback((label: string) => {
    if (label in NESTED_MENU_ITEMS) setNestedMenu(label as NestedMenu);
  }, []);

  const closeNestedMenu = React.useCallback(() => {
    if (nestedMenuClosing) return;
    setNestedMenuClosing(true);
    window.setTimeout(() => { setNestedMenu(null); setNestedMenuClosing(false); }, 520);
  }, [nestedMenuClosing]);

  if (!signedIn) {
    return <button type="button" className="hidden text-left text-xs leading-tight sm:block">Sign In</button>;
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="hidden text-left text-xs leading-tight sm:block">
        <span className="block opacity-90">Hello, David</span>
        <span className="block font-bold">My Account</span>
      </button>
      {open ? (
        <div className={drawerOverlayClassName(closing)} onMouseDown={(event) => event.target === event.currentTarget && closeAccount()}>
          <aside role="dialog" aria-modal="true" aria-label="My Account" className={drawerPanelClassName("right", closing, "absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-background text-foreground shadow-2xl")}>
            <header className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-neutral-900">My Account</h2>
              <DrawerCloseButton label="Close account" onClick={closeAccount} />
            </header>
            <div className="border-b px-5 py-4">
              <p className="font-semibold">Hello, David Whiteside</p>
              <p className="mt-2 text-xs text-muted-foreground">Account: #erp|HOM509973</p>
              <p className="text-xs text-muted-foreground">Ship To:</p>
              <p className="text-xs text-muted-foreground">613 MAIN STREET · ALL CASH SALES ARE FINAL</p>
              <button type="button" onClick={() => setShipToOpen(true)} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Change Ship To <ChevronRight className="size-4" /></button>
            </div>
            <div className="relative flex min-h-0 flex-1 flex-col">
              <AccountNav onSelect={openNestedMenu} />
              <div className="mt-auto border-t p-5"><button type="button" onClick={() => setOpen(false)} className="h-10 w-full rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted">Sign Out</button></div>
            {nestedMenu ? (
              <section aria-label={`${nestedMenu} menu`} className={`absolute inset-0 z-30 flex flex-col bg-background ${nestedMenuClosing ? "drawer-panel-right-exit" : "drawer-panel-right-enter"}`}>
                <header className="flex shrink-0 items-center justify-between border-b bg-background px-5 py-4">
                  <h3 className="text-xs font-bold uppercase tracking-wide">{nestedMenu}</h3>
                  <DrawerBackButton label={`Back from ${nestedMenu}`} onClick={closeNestedMenu} />
                </header>
                <nav aria-label={`${nestedMenu} navigation`} className="divide-y divide-border border-b border-border bg-background text-sm text-foreground">
                  {NESTED_MENU_ITEMS[nestedMenu].map((item) => <button key={item} type="button" className="flex min-h-12 w-full items-center px-5 text-left text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">{item}</button>)}
                </nav>
              </section>
            ) : null}
            {shipToOpen ? (
              <div className={`absolute inset-0 z-20 flex flex-col overflow-y-auto bg-background shadow-2xl drawer-panel-right-enter ${shipToClosing ? "drawer-panel-right-exit" : ""}`}>
                <div className="sticky top-0 flex shrink-0 items-center gap-3 border-b bg-background px-5 py-4"><button type="button" aria-label="Back to account" onClick={closeShipTo} className="grid size-8 place-items-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="size-5" /></button><h3 className="font-bold">Select Ship To</h3></div>
                {SHIP_TO_OPTIONS.map((option) => <button key={option} type="button" onClick={closeShipTo} className="block w-full border-b px-5 py-3 text-left text-xs hover:bg-muted">{option}</button>)}
              </div>
            ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function CartTrigger({ signedIn }: { signedIn: boolean }) {
  const { totalCount, openCart } = useCart();
  return (
    <button type="button" aria-label="Cart" onClick={openCart} className="flex items-center gap-1.5 text-[11px] leading-tight">
      <ShoppingCart className="size-6 shrink-0" />
      <span className="hidden text-left sm:block">
        {signedIn ? <span className="block font-semibold">{totalCount} Item{totalCount === 1 ? "" : "s"}</span> : null}
        <span className="block">Cart</span>
      </span>
    </button>
  );
}
