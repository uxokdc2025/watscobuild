"use client";

import * as React from "react";
import { ChevronRight, X } from "lucide-react";

const SHIP_TO_OPTIONS = [
  "CASH 1248 · 613 MAIN STREET · ALL CASH SALES ARE FINAL",
  "150 WILLIAMS STREET · CASH 1248 · ALL CASH SALES ARE FINAL",
  "DION DEJESUS · 613 MAIN STREET · ALL CASH SALES ARE FINAL",
  "DRIEHAUS-ATHENS RESIDENCE · 613 MAIN STREET",
  "FAIRBANKS · 613 MAIN STREET · ALL CASH SALES ARE FINAL",
  "FALLON · 613 MAIN STREET · ALL CASH SALES ARE FINAL",
  "HENRY NGUYEN · 613 MAIN STREET · ALL CASH SALES ARE FINAL",
];

export function AccountFlyout({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [shipToOpen, setShipToOpen] = React.useState(false);

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
        <div className="fixed inset-0 z-50 bg-black/50" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <aside role="dialog" aria-modal="true" aria-label="My Account" className="drawer-panel-right-enter absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-background shadow-2xl">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold">My Account</h2>
              <button type="button" aria-label="Close account" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-md text-foreground transition-colors hover:bg-muted"><X className="size-5" /></button>
            </header>
            <div className="border-b px-5 py-4">
              <p className="font-semibold">Hello, David Whiteside</p>
              <p className="mt-2 text-xs text-muted-foreground">Account: #erp|HOM509973</p>
              <p className="text-xs text-muted-foreground">Ship To: 613 MAIN STREET · ALL CASH SALES ARE FINAL</p>
              <button type="button" onClick={() => setShipToOpen(true)} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Change Ship To <ChevronRight className="size-4" /></button>
            </div>
            <nav className="divide-y text-sm">
              {["Dashboard", "Buying Tools", "Quotes", "Orders", "Account"].map((item) => <button key={item} type="button" className="flex min-h-12 w-full items-center justify-between px-5 text-left hover:bg-muted"><span>{item}</span><ChevronRight className="size-4 text-muted-foreground" /></button>)}
            </nav>
            <div className="mt-auto border-t p-5"><button type="button" onClick={() => setOpen(false)} className="h-10 w-full rounded-md border border-border text-sm font-medium hover:bg-muted">Sign Out</button></div>
            {shipToOpen ? (
              <div className="absolute inset-x-0 bottom-0 z-20 max-h-[72%] overflow-y-auto rounded-t-xl border-t bg-background shadow-2xl drawer-panel-right-enter">
                <div className="sticky top-0 flex items-center justify-between border-b bg-background px-5 py-4"><h3 className="font-bold">Select Ship To</h3><button type="button" aria-label="Close ship-to" onClick={() => setShipToOpen(false)} className="grid size-8 place-items-center rounded-md hover:bg-muted"><X className="size-5" /></button></div>
                {SHIP_TO_OPTIONS.map((option) => <button key={option} type="button" onClick={() => setShipToOpen(false)} className="block w-full border-b px-5 py-3 text-left text-xs hover:bg-muted">{option}</button>)}
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}
