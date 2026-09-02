"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  const color = brand === "VISA" || brand === "AMEX" ? "blue" : "slate";
  return (
    <Badge variant="solid" color={color} className="h-8 min-w-12 rounded-sm px-1.5 text-[9px] font-bold">
      {brand === "MASTERCARD" ? "●●" : brand}
    </Badge>
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
        <Button type="button" onClick={() => setOpen(true)} className="min-h-10">
          <Plus aria-hidden="true" className="size-4" /> Add New Card
        </Button>
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setCards((current) =>
                      current.filter((item) => item.id !== card.id),
                    )
                  }
                  className="min-h-10 text-[13px] text-muted-foreground hover:text-destructive"
                >
                  <Trash2 aria-hidden="true" className="size-4" /> Delete
                </Button>
                <Button type="button" className="h-10 w-[90px] text-[13px]">
                  <Pencil aria-hidden="true" className="size-3.5" /> Edit
                </Button>
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
                <Label htmlFor="card-number">
                  Card Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  required
                  id="card-number"
                  placeholder="1234-5678-9012-3456"
                  className="mt-2 min-h-11"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="card-month">
                    Exp Month *
                  </Label>
                  <Select defaultValue="01">
                    <SelectTrigger className="mt-2 h-11 w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="01">01</SelectItem><SelectItem value="02">02</SelectItem><SelectItem value="03">03</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="card-year">
                    Exp Year *
                  </Label>
                  <Select defaultValue="2029">
                    <SelectTrigger className="mt-2 h-11 w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="2028">2028</SelectItem><SelectItem value="2029">2029</SelectItem><SelectItem value="2030">2030</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="card-cvv">
                    CVV *
                  </Label>
                  <Input
                    required
                    id="card-cvv"
                    inputMode="numeric"
                    className="mt-2 min-h-11"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="card-nickname">
                  Card Nickname *
                </Label>
                <Input
                  required
                  id="card-nickname"
                  placeholder="Store Supplies"
                  className="mt-2 min-h-11"
                />
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="font-semibold">Billing Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="billing-first">
                    First Name *
                  </Label>
                  <Input
                    required
                    id="billing-first"
                    className="mt-2 min-h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="billing-last">
                    Last Name *
                  </Label>
                  <Input
                    required
                    id="billing-last"
                    className="mt-2 min-h-11"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="billing-company">
                  Company
                </Label>
                <Input
                  id="billing-company"
                  className="mt-2 min-h-11"
                />
              </div>
              <div>
                <Label htmlFor="billing-address">
                  Street Address *
                </Label>
                <Input
                  required
                  id="billing-address"
                  className="mt-2 min-h-11"
                />
              </div>
              <div>
                <Label htmlFor="billing-address-2">
                  Street Address 2
                </Label>
                <Input
                  id="billing-address-2"
                  className="mt-2 min-h-11"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="billing-city">
                    City *
                  </Label>
                  <Input
                    required
                    id="billing-city"
                    className="mt-2 min-h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="billing-state">
                    State *
                  </Label>
                  <Select defaultValue="NH">
                    <SelectTrigger className="mt-2 h-11 w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="NH">NH</SelectItem><SelectItem value="MA">MA</SelectItem><SelectItem value="VT">VT</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="billing-zip">
                    Zip Code *
                  </Label>
                  <Input
                    required
                    id="billing-zip"
                    className="mt-2 min-h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="billing-country">
                    Country *
                  </Label>
                  <Select defaultValue="United States of America">
                    <SelectTrigger className="mt-2 h-11 w-full"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="United States of America">United States of America</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="billing-phone">
                  Phone *
                </Label>
                <Input
                  required
                  id="billing-phone"
                  className="mt-2 min-h-11"
                />
              </div>
            </section>
            <Button type="submit" size="lg" className="sticky bottom-0 z-10 w-full">
              Save Card
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
