"use client";

import { useMemo, useState } from "react";
import { Eye, Printer, RotateCcw, Search, ShoppingCart, Truck, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─────────────────────────── Order data ───────────────────────────
 * Mirrors the Order History reference: Order # · Date · PO # · Ordered By ·
 * Total · Source · Status · Account, plus the full detail (shipping /
 * payment / billing / line items / totals) shown in the detail drawer. */
type OrderLine = { name: string; item: string; qty: number; price: number };
type OrderStatus = "OPEN" | "INVOICED" | "VOID";
type Order = {
  number: string;
  date: string;
  po: string;
  orderedBy: string;
  total: number;
  source: string;
  status: OrderStatus;
  account: string;
  store: string;
  carrier: string;
  shipTo: string;
  paymentType: string;
  billTo: string;
  lines: OrderLine[];
  tax: number;
  shipping: number;
};

const ORDERS: Order[] = [
  {
    number: "10012", date: "09/28/2026", po: "", orderedBy: "David Whiteside", total: 162.0,
    source: "Web", status: "OPEN", account: "cash 1248", store: "Store #0501",
    carrier: "Pickup", shipTo: "Store #0501",
    paymentType: "Invoice", billTo: "David Whiteside, 613 Main Street, Wilmington 01887",
    lines: [{ name: "Mitsubishi — Simple Direct Wired Controller", item: "1604089268183350", qty: 1, price: 162.0 }],
    tax: 0, shipping: 0,
  },
  {
    number: "10011", date: "09/22/2026", po: "JOB-4471", orderedBy: "David Whiteside", total: 420.1,
    source: "Web", status: "OPEN", account: "cash 1248", store: "Store #0501",
    carrier: "Standard", shipTo: "Manchester, NH #1248",
    paymentType: "Invoice", billTo: "David Whiteside, 613 Main Street, Wilmington 01887",
    lines: [
      { name: "TRADEPRO® Blower Motor, X-13 ECM, 1/2 HP", item: "54510A", qty: 2, price: 168.42 },
      { name: "TRADEPRO® Run Capacitor, 45/5 MFD", item: "11822", qty: 6, price: 12.21 },
    ],
    tax: 0, shipping: 0,
  },
  {
    number: "10010", date: "09/22/2026", po: "", orderedBy: "David Whiteside", total: 8410.0,
    source: "Branch", status: "INVOICED", account: "cash 1248", store: "Store #0501",
    carrier: "Standard", shipTo: "Manchester, NH #1248",
    paymentType: "Invoice", billTo: "David Whiteside, 613 Main Street, Wilmington 01887",
    lines: [{ name: "Goodman 3 Ton 14.3 SEER2 AC Condenser", item: "GSXH503610", qty: 2, price: 4205.0 }],
    tax: 0, shipping: 0,
  },
  {
    number: "10009", date: "09/22/2026", po: "", orderedBy: "David Whiteside", total: 7569.0,
    source: "Web", status: "OPEN", account: "cash 1248", store: "Store #0501",
    carrier: "Standard", shipTo: "Manchester, NH #1248",
    paymentType: "Invoice", billTo: "David Whiteside, 613 Main Street, Wilmington 01887",
    lines: [{ name: "Goodman 80% AFUE Gas Furnace, 100k BTU", item: "GD9S801005CN", qty: 3, price: 2523.0 }],
    tax: 0, shipping: 0,
  },
  {
    number: "10008", date: "09/16/2026", po: "", orderedBy: "David Whiteside", total: 2939.49,
    source: "Web", status: "INVOICED", account: "cash 1248", store: "Store #0501",
    carrier: "Pickup", shipTo: "Store #0501",
    paymentType: "Invoice", billTo: "David Whiteside, 613 Main Street, Wilmington 01887",
    lines: [{ name: "Cased Evaporator Coil, 3 Ton", item: "CAPTA4230C3", qty: 2, price: 1169.57 }],
    tax: 0, shipping: 0,
  },
  {
    number: "10006", date: "09/07/2026", po: "", orderedBy: "David Whiteside", total: 11.5,
    source: "Branch", status: "VOID", account: "cash 1248", store: "Store #0501",
    carrier: "Pickup", shipTo: "Store #0501",
    paymentType: "Invoice", billTo: "David Whiteside, 613 Main Street, Wilmington 01887",
    lines: [{ name: "Contactor, 2-Pole, 30 Amp, 24V Coil", item: "90313", qty: 1, price: 11.5 }],
    tax: 0, shipping: 0,
  },
];

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const STATUS_BADGE: Record<OrderStatus, "secondary" | "outline"> = {
  OPEN: "secondary",
  INVOICED: "outline",
  VOID: "outline",
};

/* ── Find an Order — the reference filter bar (Order# / PO# / Item# / Branch /
   date range / status), reused from the dashboard summary. ── */
function FindAnOrder({
  orderNo,
  setOrderNo,
  status,
  setStatus,
  onReset,
}: {
  orderNo: string;
  setOrderNo: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-lg border bg-background p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Order #">
          <Input value={orderNo} onChange={(e) => setOrderNo(e.target.value)} className="h-11" aria-label="Order number" />
        </Field>
        <Field label="PO #">
          <Input className="h-11" aria-label="Purchase order number" />
        </Field>
        <Field label="Item #">
          <Input className="h-11" aria-label="Item number" />
        </Field>
        <Field label="Branch name or branch #">
          <Input className="h-11" aria-label="Branch name or branch number" />
        </Field>
        <Field label="Start">
          <Input type="date" className="h-11" aria-label="Start date" />
        </Field>
        <Field label="End">
          <Input type="date" className="h-11" aria-label="End date" />
        </Field>
        <Field label="Order Status">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-11 w-full" aria-label="Order status">
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
          <Button variant="outline" className="min-h-11" onClick={onReset}>
            Reset
          </Button>
          <Button className="min-h-11 flex-1">
            <Search size={16} />
            Filter
          </Button>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

/* ── Order detail drawer — the reference order page, in a right-side drawer
   (shipping / payment / billing / line items / totals + Print + Reorder). ── */
function OrderDetailDrawer({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const open = order !== null;
  const subtotal = order ? order.lines.reduce((s, l) => s + l.price * l.qty, 0) : 0;
  const grand = order ? subtotal + order.tax + order.shipping : 0;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        drawerSide="right"
        className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]"
      >
        {order ? (
          <>
            <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  Order #{order.number}
                  <Badge variant={STATUS_BADGE[order.status]}>{order.status}</Badge>
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {order.date} · {order.orderedBy} · Account {order.account}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X size={18} />
              </button>
            </DialogHeader>

            <div className="space-y-6 px-5 py-5 sm:px-6">
              {/* Shipping + Payment */}
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailBlock title="Shipping">
                  <p className="flex items-center gap-1.5">
                    <Truck size={14} className="text-muted-foreground" /> {order.carrier}
                  </p>
                  <p className="text-muted-foreground">{order.shipTo}</p>
                </DetailBlock>
                <DetailBlock title="Payment">
                  <p>{order.paymentType}</p>
                  <p className="text-muted-foreground">{order.store}</p>
                </DetailBlock>
              </div>
              <DetailBlock title="Billing address">
                <p className="text-muted-foreground">{order.billTo}</p>
              </DetailBlock>

              {/* Line items — shared storefront row, compact */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">Items ordered</h4>
                <ul className="divide-y rounded-lg border">
                  {order.lines.map((l) => (
                    <li key={l.item} className="flex items-center gap-4 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug">{l.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Item: {l.item} · Qty {l.qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums">
                        {usd(l.price * l.qty)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Totals */}
              <dl className="ml-auto max-w-xs space-y-1.5 text-sm">
                <Total label="Subtotal" value={usd(subtotal)} />
                <Total label="Tax" value={usd(order.tax)} />
                <Total label="Shipping, Handling & Fees" value={usd(order.shipping)} />
                <div className="mt-1 border-t pt-2">
                  <Total label="Grand Total" value={usd(grand)} bold />
                </div>
              </dl>
            </div>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
              <Button variant="outline">
                <Printer size={16} /> Print
              </Button>
              <Button>
                <ShoppingCart size={16} /> Reorder
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5 text-sm">
      <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h4>
      {children}
    </div>
  );
}

function Total({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-6 ${bold ? "font-bold" : ""}`}>
      <dt className={bold ? "" : "text-muted-foreground"}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export default function OrdersPage() {
  const [orderNo, setOrderNo] = useState("");
  const [status, setStatus] = useState("all");
  const [perPage, setPerPage] = useState(18);
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      ORDERS.filter(
        (o) =>
          o.number.includes(orderNo.trim()) &&
          (status === "all" || o.status === status),
      ),
    [orderNo, status],
  );

  return (
    <DashboardShell
      title="Orders"
      description="Order history shows the last 90 days. Current pricing may differ from previous purchase price."
    >
      <div className="space-y-4">
        <FindAnOrder
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          status={status}
          setStatus={setStatus}
          onReset={() => {
            setOrderNo("");
            setStatus("all");
          }}
        />

        <section className={accountTable.card}>
          <div className={accountTable.scroll}>
            <table className={`${accountTable.table} min-w-[900px]`}>
              <thead>
                <tr className={accountTable.headRow}>
                  <th className={accountTable.headCell}>Order #</th>
                  <th className={accountTable.headCell}>Order Date</th>
                  <th className={accountTable.headCell}>PO #</th>
                  <th className={accountTable.headCell}>Ordered By</th>
                  <th className={`${accountTable.headCell} text-right`}>Order Total</th>
                  <th className={accountTable.headCell}>Source</th>
                  <th className={accountTable.headCell}>Status</th>
                  <th className={accountTable.headCell}>Account</th>
                  <th className={`${accountTable.headCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.number} className={accountTable.row}>
                    <td className={accountTable.cell}>
                      <button
                        type="button"
                        onClick={() => setSelected(o)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {o.number}
                      </button>
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{o.date}</td>
                    <td className={`${accountTable.cell} text-muted-foreground`}>{o.po || "—"}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{o.orderedBy}</td>
                    <td className={`${accountTable.cell} text-right font-semibold whitespace-nowrap tabular-nums`}>
                      {usd(o.total)}
                    </td>
                    <td className={`${accountTable.cell} text-muted-foreground`}>{o.source}</td>
                    <td className={accountTable.cell}>
                      <Badge variant={STATUS_BADGE[o.status]}>{o.status}</Badge>
                    </td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{o.account}</td>
                    <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                      <Button variant="ghost" size="icon" aria-label={`View order ${o.number}`} onClick={() => setSelected(o)}>
                        <Eye size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Reorder ${o.number}`} className="ml-1">
                        <RotateCcw size={17} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <div className="p-12 text-center text-muted-foreground">No orders found.</div>
          )}
          {/* Pagination — matches the reference "Show 18 / 36 / 54 Per page" */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
            <span>{filtered.length} order{filtered.length === 1 ? "" : "s"}</span>
            <div className="flex items-center gap-2">
              <span>Show</span>
              {[18, 36, 54].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPerPage(n)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    perPage === n
                      ? "border-primary bg-primary/5 text-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span>Per page</span>
            </div>
          </div>
        </section>
      </div>

      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />
    </DashboardShell>
  );
}
