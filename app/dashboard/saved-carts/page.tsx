"use client";

import { useState } from "react";
import { Eye, Share2, ShoppingCart, Trash2, X } from "lucide-react";
import { DashboardShell } from "../_components/dashboard-shell";
import { RowAction, accountTable } from "../_components/account-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─────────────────────────── Saved cart data ───────────────────────────
 * Mirrors the Saved Carts reference: Name · Items Count · Expires · Shared ·
 * Actions, plus the cart's line items shown in the detail drawer. `itemCount`
 * is the cart's total item count; `lines` lists the items previewed in the
 * drawer. */
type CartLine = { name: string; item: string; qty: number; price: number };
type SavedCart = {
  id: string;
  name: string;
  itemCount: number;
  expires: string;
  shared: boolean;
  lines: CartLine[];
};

const INITIAL_CARTS: SavedCart[] = [
  {
    id: "cart-2222",
    name: "2222",
    itemCount: 1,
    expires: "11/01/2026",
    shared: true,
    lines: [{ name: "TRADEPRO® Run Capacitor, 45/5 MFD", item: "11822", qty: 4, price: 12.21 }],
  },
  {
    id: "cart-spring",
    name: "Spring maintenance order",
    itemCount: 12,
    expires: "12/15/2026",
    shared: false,
    lines: [
      { name: "TRADEPRO® Blower Motor, X-13 ECM, 1/2 HP", item: "54510A", qty: 2, price: 168.42 },
      { name: "Contactor, 2-Pole, 30 Amp, 24V Coil", item: "90313", qty: 6, price: 11.5 },
      { name: "Filter Drier, 3/8 in. Flare, 20 cu. in.", item: "FD-163", qty: 4, price: 24.75 },
    ],
  },
  {
    id: "cart-proemro",
    name: "proemro minicart",
    itemCount: 1,
    expires: "11/20/2026",
    shared: true,
    lines: [
      { name: "Mitsubishi — Simple Direct Wired Controller", item: "1604089268183350", qty: 1, price: 162.0 },
    ],
  },
  {
    id: "cart-promero",
    name: "promero",
    itemCount: 3,
    expires: "01/05/2027",
    shared: false,
    lines: [
      { name: "Goodman 3 Ton 14.3 SEER2 AC Condenser", item: "GSXH503610", qty: 1, price: 4205.0 },
      { name: "Cased Evaporator Coil, 3 Ton", item: "CAPTA4230C3", qty: 1, price: 1169.57 },
      { name: "Line Set, 3/8 x 3/4 in. x 25 ft.", item: "LS-3825", qty: 1, price: 119.0 },
    ],
  },
];

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const cartSubtotal = (cart: SavedCart) =>
  cart.lines.reduce((sum, l) => sum + l.price * l.qty, 0);

/* ── Cart detail drawer — name + shared/expires meta, line items, subtotal,
   and a sticky "Open cart" / "Add all to cart" action bar. ── */
function CartDetailDrawer({ cart, onClose }: { cart: SavedCart | null; onClose: () => void }) {
  const open = cart !== null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        drawerSide="right"
        className="top-0 right-0 left-auto h-svh max-h-none w-full max-w-none translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none p-0 sm:max-w-[560px]"
      >
        {cart ? (
          <>
            <DialogHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  {cart.name}
                  <Badge variant={cart.shared ? "default" : "secondary"}>
                    {cart.shared ? "Shared" : "Not shared"}
                  </Badge>
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Expires {cart.expires} · {cart.itemCount} item{cart.itemCount === 1 ? "" : "s"}
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
              {/* Line items — shared storefront row, compact */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">Items in cart</h4>
                <ul className="divide-y rounded-lg border">
                  {cart.lines.map((l) => (
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
                {cart.itemCount > cart.lines.length && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Showing {cart.lines.length} of {cart.itemCount} items. Open the cart to see all.
                  </p>
                )}
              </div>

              {/* Subtotal */}
              <dl className="ml-auto max-w-xs space-y-1.5 text-sm">
                <div className="flex justify-between gap-6 font-bold">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{usd(cartSubtotal(cart))}</dd>
                </div>
              </dl>
            </div>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">
              <Button variant="outline">Open Cart</Button>
              <Button>
                <ShoppingCart size={16} /> Add All to Cart
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default function SavedCartsPage() {
  const [carts, setCarts] = useState<SavedCart[]>(INITIAL_CARTS);
  const [perPage, setPerPage] = useState(18);
  const [selected, setSelected] = useState<SavedCart | null>(null);

  const visible = carts.slice(0, perPage);

  function toggleShare(id: string) {
    setCarts((prev) => prev.map((x) => (x.id === id ? { ...x, shared: !x.shared } : x)));
  }

  return (
    <DashboardShell
      title="Saved Carts"
      description="Save a cart now and return to it when you are ready to place the order."
    >
      <div className="space-y-4">
        <section className={accountTable.card}>
          <div className={accountTable.scroll}>
            <table className={`${accountTable.table} min-w-[760px]`}>
              <thead>
                <tr className={accountTable.headRow}>
                  <th className={accountTable.headCell}>Name</th>
                  <th className={accountTable.headCell}>Items Count</th>
                  <th className={accountTable.headCell}>Expires</th>
                  <th className={accountTable.headCell}>Shared</th>
                  <th className={`${accountTable.headCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c) => (
                  <tr key={c.id} className={accountTable.row}>
                    <td className={accountTable.cell}>
                      <button
                        type="button"
                        onClick={() => setSelected(c)}
                        className="text-left font-semibold text-primary hover:underline"
                      >
                        {c.name}
                      </button>
                    </td>
                    <td className={`${accountTable.cell} tabular-nums`}>{c.itemCount}</td>
                    <td className={`${accountTable.cell} whitespace-nowrap`}>{c.expires}</td>
                    <td className={accountTable.cell}>
                      <Badge variant={c.shared ? "default" : "secondary"}>
                        {c.shared ? "Shared" : "Not shared"}
                      </Badge>
                    </td>
                    <td className={`${accountTable.cell} text-right whitespace-nowrap`}>
                      <RowAction
                        icon={Eye}
                        label="View"
                        aria-label={`View cart ${c.name}`}
                        onClick={() => setSelected(c)}
                      />
                      <RowAction
                        icon={Share2}
                        label="Share"
                        aria-label={c.shared ? `Stop sharing ${c.name}` : `Share ${c.name}`}
                        className="ml-1"
                        onClick={() => toggleShare(c.id)}
                      />
                      <RowAction
                        icon={Trash2}
                        label="Delete"
                        remove
                        aria-label={`Delete cart ${c.name}`}
                        className="ml-1"
                        onClick={() => setCarts((prev) => prev.filter((x) => x.id !== c.id))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!carts.length && (
            <div className="p-12 text-center text-muted-foreground">No saved carts found.</div>
          )}
          {/* Pagination — matches the reference "Show 18 / 36 / 54 Per page" */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm text-muted-foreground">
            <span>
              {carts.length} cart{carts.length === 1 ? "" : "s"}
            </span>
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

      <CartDetailDrawer cart={selected} onClose={() => setSelected(null)} />
    </DashboardShell>
  );
}
