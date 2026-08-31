"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaymentCard = {
  id: number;
  brand: string;
  name: string;
  last4: string;
  expires: string;
  holder: string;
  company: string;
  address: string;
  phone: string;
};

const INITIAL_CARDS: PaymentCard[] = [
  {
    id: 1,
    brand: "MASTERCARD",
    name: "Donut Fund",
    last4: "5100",
    expires: "07/2029",
    holder: "Homer Simpson",
    company: "Springfield Nuclear Power Plant",
    address: "742 Evergreen Terrace\nSpringfield, IL 49007",
    phone: "555–636–7663",
  },
  {
    id: 2,
    brand: "VISA",
    name: "Store Supplies",
    last4: "1111",
    expires: "05/2029",
    holder: "Apu Nahasapeemapetilon",
    company: "Kwik-E-Mart",
    address: "100 Main St\nUnit B\nSpringfield, IL 49007",
    phone: "555–843–7625",
  },
  {
    id: 3,
    brand: "AMEX",
    name: "Excellent Card",
    last4: "0005",
    expires: "05/2032",
    holder: "Charles Burns",
    company: "Burns Industries",
    address: "1000 Mammon Ln\nSpringfield, IL 49007",
    phone: "555–278–6726",
  },
  {
    id: 4,
    brand: "DISCOVER",
    name: "Business Card",
    last4: "9424",
    expires: "05/2031",
    holder: "Moe Szyslak",
    company: "Moe's Tavern",
    address: "57 Walnut St\nSpringfield, IL 49007",
    phone: "555–764–3947",
  },
  {
    id: 5,
    brand: "DINERS CLUB",
    name: "Diners Club",
    last4: "3600",
    expires: "11/2028",
    holder: "Krusty The Clown",
    company: "Krusty Burger",
    address: "1200 Clown Ave\nSpringfield, IL 49007",
    phone: "555–278–5869",
  },
];

function CardMark({ brand }: { brand: string }) {
  return (
    <span
      className={`inline-flex h-8 min-w-12 items-center justify-center rounded-sm px-1.5 text-[9px] font-bold ${brand === "VISA" ? "bg-blue-700 text-white" : brand === "AMEX" ? "bg-blue-700 text-white" : brand === "DISCOVER" ? "bg-zinc-700 text-white" : "bg-slate-700 text-white"}`}
    >
      {brand === "MASTERCARD" ? "●●" : brand}
    </span>
  );
}

export default function CardManagementPage() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [open, setOpen] = useState(false);
  function addCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCards((current) => [
      ...current,
      {
        id: Date.now(),
        brand: "VISA",
        name: "New payment card",
        last4: "3456",
        expires: "12/2029",
        holder: "David Whiteside",
        company: "Whiteside Mechanical LLC",
        address: "613 Main Street\nManchester, NH 03102",
        phone: "+1 978 657 8990",
      },
    ]);
    setOpen(false);
  }

  return (
    <DashboardShell
      title="Card Management"
      description="Manage payment methods securely for your account."
      actions={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus aria-hidden="true" className="size-4" /> Add New Card
        </button>
      }
    >
      <div className="space-y-2">
        <div className="grid gap-3 text-[13px] md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="flex min-h-[280px] flex-col rounded-lg border bg-background shadow-sm"
            >
              <div className="flex-1 p-4">
                <div className="flex items-start gap-3">
                  <CardMark brand={card.brand} />
                  <div>
                    <h2 className="text-[15px] font-semibold">{card.name}</h2>
                    <p className="text-[13px] text-muted-foreground">
                      XXXX–XXXX–XXXX–{card.last4}
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      Expires: {card.expires}
                    </p>
                  </div>
                </div>
                <div className="mt-4 whitespace-pre-line text-[13px] leading-5">
                  <p>{card.holder}</p>
                  <p>{card.company}</p>
                  <p>{card.address}</p>
                  <p className="text-primary">{card.phone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t p-3">
                <button
                  type="button"
                  onClick={() =>
                    setCards((current) =>
                      current.filter((item) => item.id !== card.id),
                    )
                  }
                  className="inline-flex min-h-10 items-center gap-1.5 px-2 text-[13px] font-medium hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 aria-hidden="true" className="size-4" /> Delete
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-[90px] items-center justify-center gap-1.5 rounded-md bg-primary px-2 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Pencil aria-hidden="true" className="size-3.5" /> Edit
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent drawerSide="right" className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-5 sm:max-w-[480px] sm:p-6">
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>
              Securely add a payment method for checkout.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addCard} className="space-y-5">
            <section className="space-y-4">
              <h2 className="font-semibold">Card Information</h2>
              <div>
                <label htmlFor="card-number" className="text-sm font-medium">
                  Card Number <span className="text-destructive">*</span>
                </label>
                <input
                  required
                  id="card-number"
                  placeholder="1234-5678-9012-3456"
                  className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="card-month" className="text-sm font-medium">
                    Exp Month *
                  </label>
                  <Select defaultValue="01">
                    <SelectTrigger className="mt-2 h-11 w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="01">01</SelectItem><SelectItem value="02">02</SelectItem><SelectItem value="03">03</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="card-year" className="text-sm font-medium">
                    Exp Year *
                  </label>
                  <Select defaultValue="2029">
                    <SelectTrigger className="mt-2 h-11 w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="2028">2028</SelectItem><SelectItem value="2029">2029</SelectItem><SelectItem value="2030">2030</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="card-cvv" className="text-sm font-medium">
                    CVV *
                  </label>
                  <input
                    required
                    id="card-cvv"
                    inputMode="numeric"
                    className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="card-nickname" className="text-sm font-medium">
                  Card Nickname *
                </label>
                <input
                  required
                  id="card-nickname"
                  placeholder="Store Supplies"
                  className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="font-semibold">Billing Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="billing-first"
                    className="text-sm font-medium"
                  >
                    First Name *
                  </label>
                  <input
                    required
                    id="billing-first"
                    className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="billing-last" className="text-sm font-medium">
                    Last Name *
                  </label>
                  <input
                    required
                    id="billing-last"
                    className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="billing-company"
                  className="text-sm font-medium"
                >
                  Company
                </label>
                <input
                  id="billing-company"
                  className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="billing-address"
                  className="text-sm font-medium"
                >
                  Street Address *
                </label>
                <input
                  required
                  id="billing-address"
                  className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="billing-address-2"
                  className="text-sm font-medium"
                >
                  Street Address 2
                </label>
                <input
                  id="billing-address-2"
                  className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="billing-city" className="text-sm font-medium">
                    City *
                  </label>
                  <input
                    required
                    id="billing-city"
                    className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="billing-state"
                    className="text-sm font-medium"
                  >
                    State *
                  </label>
                  <Select defaultValue="NH">
                    <SelectTrigger className="mt-2 h-11 w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="NH">NH</SelectItem><SelectItem value="MA">MA</SelectItem><SelectItem value="VT">VT</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="billing-zip" className="text-sm font-medium">
                    Zip Code *
                  </label>
                  <input
                    required
                    id="billing-zip"
                    className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="billing-country"
                    className="text-sm font-medium"
                  >
                    Country *
                  </label>
                  <Select defaultValue="United States of America">
                    <SelectTrigger className="mt-2 h-11 w-full"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="United States of America">United States of America</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label htmlFor="billing-phone" className="text-sm font-medium">
                  Phone *
                </label>
                <input
                  required
                  id="billing-phone"
                  className="mt-2 min-h-11 w-full rounded-md border px-3 text-sm"
                />
              </div>
            </section>
            <button
              type="submit"
              className="sticky bottom-0 z-10 min-h-11 w-full border-t bg-background py-4 text-sm font-semibold text-primary hover:text-primary/80"
            >
              Save Card
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
