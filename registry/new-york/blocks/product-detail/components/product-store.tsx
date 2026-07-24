"use client";

import * as React from "react";
import { toast } from "sonner";

import type { Product } from "@/registry/new-york/blocks/product-detail/lib/products";

type ProductStore = {
  product: Product;
  color: string | undefined;
  size: string | undefined;
  setColor: (id: string) => void;
  setSize: (id: string) => void;
  wishlisted: boolean;
  toggleWishlist: () => void;
  pending: boolean;
  /** True when a variant is chosen and the item is purchasable. */
  canAdd: boolean;
  addToCart: () => void;
};

const ProductStoreContext = React.createContext<ProductStore | null>(null);

export function ProductStoreProvider({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const [color, setColor] = React.useState<string | undefined>(
    product.colors[0]?.id
  );
  const [size, setSize] = React.useState<string>();
  const [wishlisted, setWishlisted] = React.useState(false);
  const wishlistedRef = React.useRef(false);
  const [pending, setPending] = React.useState(false);

  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const outOfStock = product.stock === "out-of-stock";
  const canAdd = Boolean(size) && !outOfStock;

  const addToCart = React.useCallback(() => {
    if (pending) return;
    if (outOfStock) {
      toast.error("This item is out of stock");
      return;
    }
    if (!size) {
      toast.error("Please choose a size first");
      return;
    }
    setPending(true);
    const colorName = product.colors.find((c) => c.id === color)?.name;
    timer.current = setTimeout(() => {
      setPending(false);
      toast.success("Added to cart", {
        description: `${product.name} · ${colorName} · Size ${size.toUpperCase()}`,
      });
    }, 1100);
  }, [pending, outOfStock, size, color, product]);

  const toggleWishlist = React.useCallback(() => {
    // Derive the next value from a ref (not inside the state updater) so the
    // toast side-effect fires exactly once — updaters double-invoke in Strict Mode.
    const next = !wishlistedRef.current;
    wishlistedRef.current = next;
    setWishlisted(next);
    if (next) {
      toast.success("Saved to wishlist", { description: product.name });
    } else {
      toast("Removed from wishlist");
    }
  }, [product.name]);

  const value = React.useMemo<ProductStore>(
    () => ({
      product,
      color,
      size,
      setColor,
      setSize,
      wishlisted,
      toggleWishlist,
      pending,
      canAdd,
      addToCart,
    }),
    [product, color, size, wishlisted, toggleWishlist, pending, canAdd, addToCart]
  );

  return (
    <ProductStoreContext.Provider value={value}>
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProductStore(): ProductStore {
  const ctx = React.useContext(ProductStoreContext);
  if (!ctx) {
    throw new Error(
      "useProductStore must be used within a ProductStoreProvider"
    );
  }
  return ctx;
}
