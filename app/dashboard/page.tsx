"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Pencil, Search } from "lucide-react";
import { DashboardShell } from "./_components/dashboard-shell";
import { AccountSearchInput } from "./_components/account-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Order = {
  number: string;
  date: string;
  po: string;
  orderedBy: string;
  total: string;
  source: string;
  status: string;
  account: string;
};

const ORDERS: Order[] = [
  { number: "10004", date: "Aug 15, 2026", po: "N/A", orderedBy: "David Whiteside", total: "$605.00", source: "Web", status: "OPEN", account: "cash 1248" },
  { number: "10003", date: "Aug 13, 2026", po: "N/A", orderedBy: "David Whiteside", total: "$345.00", source: "Web", status: "OPEN", account: "cash 1248" },
  { number: "10002", date: "Aug 13, 2026", po: "N/A", orderedBy: "David Whiteside", total: "$345.00", source: "Branch", status: "OPEN", account: "cash 1248" },
  { number: "10001", date: "Aug 12, 2026", po: "N/A", orderedBy: "David Whiteside", total: "$0.60", source: "Web", status: "OPEN", account: "cash 1248" },
  { number: "10000", date: "Aug 12, 2026", po: "N/A", orderedBy: "David Whiteside", total: "$102.90", source: "Web", status: "OPEN", account: "cash 1248" },
];

type AccountInfo = {
  firstName: string;
  lastName: string;
  email: string;
  preferredLocation: string;
};

const INITIAL_ACCOUNT: AccountInfo = {
  firstName: "David",
  lastName: "Whiteside",
  email: "dwhiteside@watsco.com",
  preferredLocation: "Manchester, NH #1248",
};

const LOCATIONS = [
  "Manchester, NH #1248",
  "Nashua, NH #1302",
  "Williston, VT #0987",
  "Wilmington, MA #0501",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold">{value}</dd>
    </div>
  );
}

function AccountInformationCard({
  account,
  onSave,
}: {
  account: AccountInfo;
  onSave: (next: AccountInfo) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AccountInfo>(account);

  function openDrawer() {
    setDraft(account);
    setOpen(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
    setOpen(false);
  }

  return (
    <section
      aria-labelledby="account-info-heading"
      className="rounded-lg border bg-background px-4 py-3 shadow-sm sm:px-6 sm:py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="account-info-heading" className="text-lg font-semibold tracking-tight">
          Account Information
        </h2>
        <Button type="button" variant="outline" onClick={openDrawer} className="min-h-10">
          <Pencil aria-hidden="true" className="size-4" /> Edit
        </Button>
      </div>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem label="First Name" value={account.firstName} />
        <InfoItem label="Last Name" value={account.lastName} />
        <InfoItem label="Email" value={account.email} />
        <InfoItem label="Preferred Location" value={account.preferredLocation} />
      </dl>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          drawerSide="right"
          className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-5 sm:max-w-[480px] sm:p-6"
        >
          <DialogHeader>
            <DialogTitle>Edit Account Information</DialogTitle>
            <DialogDescription>Update your contact details and preferred branch.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="acct-first">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  required
                  id="acct-first"
                  autoComplete="given-name"
                  value={draft.firstName}
                  onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                  className="mt-2 min-h-11"
                />
              </div>
              <div>
                <Label htmlFor="acct-last">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  required
                  id="acct-last"
                  autoComplete="family-name"
                  value={draft.lastName}
                  onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                  className="mt-2 min-h-11"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="acct-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                required
                id="acct-email"
                type="email"
                autoComplete="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                className="mt-2 min-h-11"
              />
            </div>
            <div>
              <Label htmlFor="acct-location">Preferred Location</Label>
              <Select
                value={draft.preferredLocation}
                onValueChange={(v) => setDraft({ ...draft, preferredLocation: v })}
              >
                <SelectTrigger id="acct-location" className="mt-2 !h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="lg" className="sticky bottom-0 z-10 w-full">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

type OrderFilters = {
  orderNo: string;
  po: string;
  item: string;
  branch: string;
  start: string;
  end: string;
  status: string;
};

const EMPTY_FILTERS: OrderFilters = {
  orderNo: "",
  po: "",
  item: "",
  branch: "",
  start: "",
  end: "",
  status: "all",
};

/* Find an Order — same fields/layout as the Orders page filter bar. */
function FindAnOrder({
  filters,
  setFilters,
  onReset,
}: {
  filters: OrderFilters;
  setFilters: (next: OrderFilters) => void;
  onReset: () => void;
}) {
  const set = (patch: Partial<OrderFilters>) => setFilters({ ...filters, ...patch });
  return (
    <section
      aria-label="Find an order"
      className="rounded-lg border bg-background p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Order #">
          <Input value={filters.orderNo} onChange={(e) => set({ orderNo: e.target.value })} className="h-11" aria-label="Order number" />
        </Field>
        <Field label="PO #">
          <Input value={filters.po} onChange={(e) => set({ po: e.target.value })} className="h-11" aria-label="Purchase order number" />
        </Field>
        <Field label="Item #">
          <Input value={filters.item} onChange={(e) => set({ item: e.target.value })} className="h-11" aria-label="Item number" />
        </Field>
        <Field label="Branch name or branch #">
          <Input value={filters.branch} onChange={(e) => set({ branch: e.target.value })} className="h-11" aria-label="Branch name or branch number" />
        </Field>
        <Field label="Start">
          <Input type="date" value={filters.start} onChange={(e) => set({ start: e.target.value })} className="h-11" aria-label="Start date" />
        </Field>
        <Field label="End">
          <Input type="date" value={filters.end} onChange={(e) => set({ end: e.target.value })} className="h-11" aria-label="End date" />
        </Field>
        <Field label="Order Status">
          <Select value={filters.status} onValueChange={(v) => set({ status: v })}>
            <SelectTrigger className="!!h-11 w-full" aria-label="Order status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="INVOICED">Invoiced</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="VOID">Void</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-end gap-2">
          <Button type="button" variant="outline" className="min-h-11" onClick={onReset}>
            Reset
          </Button>
          <Button type="button" className="min-h-11 flex-1">
            <Search size={16} />
            Filter
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ id, title, href }: { id: string; title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 id={id} className="text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {href ? (
        <Link href={href} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          View All <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [account, setAccount] = useState<AccountInfo>(INITIAL_ACCOUNT);
  const [filters, setFilters] = useState<OrderFilters>(EMPTY_FILTERS);
  const visibleOrders = useMemo(
    () => ORDERS.filter((order) => order.number.includes(orderQuery.trim())),
    [orderQuery],
  );

  const showList = "test".includes(listQuery.trim().toLowerCase());

  return (
    <DashboardShell title="Dashboard" description="A single place to manage your account, purchasing tools, and orders.">
      <div className="space-y-6">
        <AccountInformationCard account={account} onSave={setAccount} />

        <FindAnOrder
          filters={filters}
          setFilters={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />

        <section aria-labelledby="recent-orders-heading" className="rounded-lg border bg-background px-4 py-3 shadow-sm sm:px-6 sm:py-4">
          <SectionHeading id="recent-orders-heading" title={`Recent Orders (${visibleOrders.length})`} href="/dashboard/orders" />
          <div className="mt-4">
            <AccountSearchInput value={orderQuery} onChange={setOrderQuery} placeholder="Search by Order # or PO #" />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-[13px]">
              <thead><tr className="border-b bg-secondary text-left text-xs font-semibold text-foreground"><th className="px-2 py-3">Order #</th><th className="px-2 py-3">Order Date</th><th className="px-2 py-3">PO #</th><th className="px-2 py-3">Ordered By</th><th className="px-2 py-3 text-right">Order Total</th><th className="px-2 py-3">Source</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Account</th></tr></thead>
              <tbody>
                {visibleOrders.length ? visibleOrders.map((order) => (
                  <tr key={order.number} className="border-b last:border-0">
                    <td className="px-2 py-3"><Link href="/dashboard/orders" className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{order.number}</Link></td>
                    <td className="px-2 py-3 whitespace-nowrap">{order.date}</td>
                    <td className="px-2 py-3 text-muted-foreground">{order.po}</td>
                    <td className="px-2 py-3 whitespace-nowrap">{order.orderedBy}</td>
                    <td className="px-2 py-3 text-right font-semibold whitespace-nowrap tabular-nums">{order.total}</td>
                    <td className="px-2 py-3 text-muted-foreground">{order.source}</td>
                    <td className="px-2 py-3"><Badge variant="soft" color="blue">{order.status}</Badge></td>
                    <td className="px-2 py-3 whitespace-nowrap">{order.account}</td>
                  </tr>
                )) : <tr><td colSpan={8} className="px-2 py-8 text-center text-sm text-muted-foreground">No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="shopping-lists-heading" className="rounded-lg border bg-background px-4 py-3 shadow-sm sm:px-6 sm:py-4">
          <SectionHeading id="shopping-lists-heading" title={`My Shopping Lists (${showList ? 1 : 0})`} href="/dashboard/shopping-lists" />
          <div className="mt-4">
            <AccountSearchInput value={listQuery} onChange={setListQuery} placeholder="Search lists by name…" />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13px]"><colgroup><col className="w-[28%]" /><col /><col /><col /></colgroup>
              <thead><tr className="border-b bg-secondary text-left text-xs font-semibold text-foreground"><th className="px-2 py-3">Name</th><th className="px-2 py-3">Products</th><th className="px-2 py-3">Latest Activity</th><th className="px-2 py-3">Created By</th></tr></thead>
              <tbody>{showList ? <tr><td className="px-2 py-3 font-semibold text-primary">test</td><td className="px-2 py-3">4</td><td className="px-2 py-3 whitespace-nowrap">12/31/1969 at 6:00 PM</td><td className="px-2 py-3 whitespace-nowrap">David Whiteside</td></tr> : <tr><td colSpan={4} className="px-2 py-8 text-center text-muted-foreground">No shopping lists found.</td></tr>}</tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="recent-quotes-heading" className="rounded-lg border bg-background px-4 py-3 shadow-sm sm:px-6 sm:py-4">
          <SectionHeading id="recent-quotes-heading" title="Recent Quotes (1)" href="/dashboard/quotes" />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-[13px]"><thead><tr className="border-b bg-secondary text-left text-xs font-semibold text-foreground"><th className="px-2 py-3">Quote #</th><th className="px-2 py-3">Name</th><th className="px-2 py-3">Job Account</th><th className="px-2 py-3">Job Name</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Created</th><th className="px-2 py-3">Expires</th><th className="px-2 py-3">Updated</th><th className="px-2 py-3 text-right">Subtotal</th></tr></thead>
              <tbody><tr className="border-b"><td className="px-2 py-3 font-semibold text-primary">Q-2026-0184</td><td className="px-2 py-3">Spring maintenance quote</td><td className="px-2 py-3">Acct 1248</td><td className="px-2 py-3">Rooftop RTU swap</td><td className="px-2 py-3"><Badge variant="soft" color="green">Active</Badge></td><td className="px-2 py-3 whitespace-nowrap">Aug 20, 2026</td><td className="px-2 py-3 whitespace-nowrap">Sep 20, 2026</td><td className="px-2 py-3 whitespace-nowrap">Today</td><td className="px-2 py-3 text-right font-semibold tabular-nums">$1,248.00</td></tr></tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
