"use client";

import * as React from "react";
import { Check, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/app/pdp/_lib/types";

export type CartItem = {
  id: string;
  title: string;
  brand?: string;
  image?: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

function CartDrawer() {
  const { items, totalCount, totalPrice, removeItem, setQuantity, closeCart, addItem, open } = useCart();

  if (!open || !items.length) return null;
  const added = items[items.length - 1];
  const recommendations = [
    { id: `${added.id}-filter`, title: "Replacement filter", price: 12.5 },
    { id: `${added.id}-bracket`, title: "Universal mounting bracket", price: 18.75 },
  ];

  return (
    <div className="fixed inset-0 z-[70]">
      <button aria-label="Close cart" className="absolute inset-0 cursor-default bg-black/50" onClick={closeCart} />
      <aside role="dialog" aria-modal="true" aria-label="Shopping cart" className="drawer-panel-right-enter absolute inset-y-0 right-0 flex w-full max-w-[430px] flex-col border-l bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold"><ShoppingCart className="size-5" /> Cart ({totalCount})</div>
          <Button variant="outline" size="icon-sm" aria-label="Close cart" onClick={closeCart}><X /></Button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-5 flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"><Check className="size-4 text-emerald-600" /> Added to cart</div>
          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-5">
                <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-md bg-muted">
                  {item.image ? <img src={item.image} alt="" className="max-h-full max-w-full object-contain" /> : <ShoppingCart className="size-6 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{item.brand ?? "Watsco"}</p>
                  <p className="line-clamp-2 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 font-semibold">{formatUSD(item.price * item.quantity)}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="inline-flex h-8 items-center rounded-md border" role="group" aria-label={`Quantity for ${item.title}`}>
                      <button className="grid size-8 place-items-center" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity"><Minus className="size-3.5" /></button>
                      <span className="grid h-full w-8 place-items-center border-x text-sm">{item.quantity}</span>
                      <button className="grid size-8 place-items-center" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity"><Plus className="size-3.5" /></button>
                    </div>
                    <button className="text-sm text-primary underline-offset-4 hover:underline" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <section className="pt-6">
            <h2 className="text-lg font-semibold">You may also need</h2>
            <div className="mt-3 flex flex-col gap-3">
              {recommendations.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                  <div><p className="text-sm font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{formatUSD(item.price)}</p></div>
                  <button className="text-sm font-semibold text-primary underline-offset-4 hover:underline" onClick={() => addItem(item)}>Add</button>
                </div>
              ))}
            </div>
          </section>
        </div>
        <footer className="mt-auto border-t bg-background p-5">
          <div className="mb-3 flex items-center justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{formatUSD(totalPrice)}</span></div>
          <div className="flex items-center gap-3">
          <Button className="flex-1 justify-between" onClick={closeCart}><span>View Cart</span><span>{formatUSD(totalPrice)}</span></Button>
            <Button variant="outline" onClick={closeCart}>Keep shopping</Button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const addItem = React.useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) return current.map((entry) => entry.id === item.id ? { ...entry, quantity: Math.min(99, entry.quantity + quantity) } : entry);
      return [...current, { ...item, quantity }];
    });
    setOpen(true);
  }, []);
  const removeItem = React.useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const setQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item));
  }, [removeItem]);
  const closeCart = React.useCallback(() => setOpen(false), []);
  const value = React.useMemo(() => ({ items, totalCount: items.reduce((sum, item) => sum + item.quantity, 0), totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0), addItem, removeItem, setQuantity, open, openCart: () => setOpen(true), closeCart }), [items, addItem, removeItem, setQuantity, open, closeCart]);
  return <CartContext.Provider value={value}><>{children}</><CartDrawer /></CartContext.Provider>;
}
