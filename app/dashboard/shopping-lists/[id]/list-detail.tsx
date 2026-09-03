"use client";

import * as React from "react";
import Link from "next/link";
import {
  Copy,
  FolderInput,
  Minus,
  Plus,
  Replace,
  Settings2,
  Shuffle,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react";

import { DashboardShell } from "../../_components/dashboard-shell";
import { AccountSearchInput } from "../../_components/account-table";
import { getListMeta } from "../_list-meta";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ProductListRow } from "@/components/ui/product-list-row";
import { StockStatus } from "@/components/ui/label-badges";
import {
  DRAWER_MOTION_MS,
  DrawerCloseButton,
  DrawerPanel,
  drawerOverlayClassName,
} from "@/components/ui/drawer";
import { useCart } from "@/components/cart/cart-context";
import { formatUSD } from "@/app/pdp/_lib/types";

/* ─────────────────────────── Demo data ─────────────────────────── */

type AltProduct = {
  id: string;
  brand: string;
  title: string;
  item: string;
  mfg: string;
  image: string;
  price: number;
  qty: number;
};

type Product = AltProduct & {
  label?: string;
  /** When present, the row carries a replacement/substitute set. */
  replacement?: {
    note: string;
    replacements: AltProduct[];
    substitutes: AltProduct[];
  };
};

const img = (n: string) => `/peirce-search/blower-motor-${n}.avif`;

const PRODUCTS: Product[] = [
  {
    id: "tp-ec13-50",
    brand: "TRADEPRO®",
    title:
      "TP-EC13-50 — Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230V, 1/2 HP",
    item: "54510A",
    mfg: "TP-EC13-50",
    image: img("01"),
    price: 168.42,
    qty: 8,
    label: "Preventative",
    replacement: {
      note: "This motor has a newer revision and cross-compatible options.",
      replacements: [
        {
          id: "tp-ec13-50r2",
          brand: "TRADEPRO®",
          title: "TP-EC13-50-R2 — Blower Motor, X-13 ECM (updated control board)",
          item: "54511A",
          mfg: "TP-EC13-50-R2",
          image: img("02"),
          price: 172.0,
          qty: 21,
        },
      ],
      substitutes: [
        {
          id: "us-5462",
          brand: "US MOTORS",
          title: "5462 — ECM Blower Motor, 1/2 HP, 1075 RPM, 208-230V",
          item: "88245",
          mfg: "5462",
          image: img("03"),
          price: 189.9,
          qty: 5,
        },
        {
          id: "gen-mtr-050",
          brand: "GENTEQ",
          title: "Evergreen 1/2 HP ECM Replacement Motor, 208-230V",
          item: "6205E",
          mfg: "GEN-EVG-050",
          image: img("04"),
          price: 214.5,
          qty: 12,
        },
      ],
    },
  },
  {
    id: "run-cap-45",
    brand: "TITAN PRO®",
    title: "TRCFD455 — Dual Run Capacitor, 45/5 MFD, 440V, Round",
    item: "12045D",
    mfg: "TRCFD455",
    image: img("06"),
    price: 14.28,
    qty: 40,
    label: "Job supplies",
  },
  {
    id: "contactor-2p",
    brand: "TRADEPRO®",
    title: "TP-CON-2P30A — Definite Purpose Contactor, 2 Pole, 30 Amp, 24V Coil",
    item: "34530C",
    mfg: "TP-CON-2P30A",
    image: img("09"),
    price: 22.75,
    qty: 0,
    replacement: {
      note: "Out of stock — a form-fit-function equivalent ships today.",
      replacements: [
        {
          id: "tp-con-2p40a",
          brand: "TRADEPRO®",
          title: "TP-CON-2P40A — Definite Purpose Contactor, 2 Pole, 40 Amp, 24V Coil",
          item: "34540C",
          mfg: "TP-CON-2P40A",
          image: img("11"),
          price: 24.9,
          qty: 33,
        },
      ],
      substitutes: [
        {
          id: "packard-c230b",
          brand: "PACKARD",
          title: "C230B — Contactor, 2 Pole, 30 Amp, 24V Coil",
          item: "77230",
          mfg: "C230B",
          image: img("13"),
          price: 19.99,
          qty: 60,
        },
      ],
    },
  },
  {
    id: "hard-start-kit",
    brand: "SUPCO®",
    title: "SPP6 — Hard Start Kit, Universal Relay + Start Capacitor",
    item: "45510S",
    mfg: "SPP6",
    image: img("17"),
    price: 18.6,
    qty: 15,
    label: "Preventative",
  },
  {
    id: "txv-valve",
    brand: "EMERSON®",
    title: "TXV-R410A-3T — Thermostatic Expansion Valve, R-410A, 3 Ton",
    item: "66103T",
    mfg: "TXV-R410A-3T",
    image: img("21"),
    price: 96.0,
    qty: 4,
  },
];

/* ─────────────────────────── Quantity stepper ─────────────────────────── */
/* Mirrors the cart drawer's stepper markup so the control reads identically. */

function QtyStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div
      className="inline-flex h-9 items-center rounded-md border"
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        className="grid size-9 place-items-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="grid h-full w-9 place-items-center border-x text-sm tabular-nums">
        {value}
      </span>
      <button
        type="button"
        className="grid size-9 place-items-center text-muted-foreground transition-colors hover:bg-muted"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

/* ─────────────────────────── Replacement badge ───────────────────────────
 * Replacement theme uses the `Replace` icon (blue); substitutes use `Shuffle`
 * (green). Kept visually distinct so the two never read as the same thing. */

function ReplacementBadge() {
  return (
    <Badge variant="soft" color="blue">
      <Replace className="size-3" />
      Replacement
    </Badge>
  );
}

/* ─────────────────────────── Availability drawer row ─────────────────────────── */
/* Reuses ProductListRow for the substitute/replacement drawer entries. The CTA
 * reads "Replace" (Replace icon) or "Substitute" (Shuffle icon) per `kind`. */

function AltRow({
  product,
  kind,
  onAdd,
}: {
  product: AltProduct;
  kind: "replacement" | "substitute";
  onAdd: (product: AltProduct) => void;
}) {
  return (
    <div className="rounded-md border">
      <ProductListRow
        image={product.image}
        imageAlt={product.title}
        brand={product.brand}
        title={product.title}
        item={product.item}
        mfg={product.mfg}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <StockStatus qty={product.qty}>
              {product.qty > 0 ? "In stock" : "Out of stock"}
            </StockStatus>
            <span className="text-sm font-semibold">
              {formatUSD(product.price)}
            </span>
          </div>
        }
        actions={
          <Button
            size="sm"
            className="min-h-11"
            disabled={product.qty <= 0}
            onClick={() => onAdd(product)}
          >
            {kind === "replacement" ? (
              <>
                <Replace className="size-3.5" />
                Replace
              </>
            ) : (
              <>
                <Shuffle className="size-3.5" />
                Substitute
              </>
            )}
          </Button>
        }
      />
    </div>
  );
}

/* ─────────────────────────── Replacements left drawer ─────────────────────────── */

function ReplacementsDrawer({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: AltProduct) => void;
}) {
  const [closing, setClosing] = React.useState(false);

  const requestClose = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    // Reset `closing` after the exit so the drawer can reopen for another row.
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, DRAWER_MOTION_MS);
  }, [closing, onClose]);

  if (!product?.replacement) return null;
  const { replacements, substitutes } = product.replacement;

  return (
    <div
      className={drawerOverlayClassName(closing)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <DrawerPanel
        open={!closing}
        side="right"
        role="dialog"
        aria-modal="true"
        aria-label="Replacements"
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-background text-foreground shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-5 py-4">
          <h1 className="text-lg font-bold">Replacements</h1>
          <DrawerCloseButton label="Close replacements" onClick={requestClose} />
        </header>
        <div className="flex-1 overflow-y-auto">
          {/* The product being replaced. */}
          <section className="border-b bg-muted/30 px-5 py-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              You&rsquo;re replacing
            </p>
            <div className="rounded-md border bg-background">
              <ProductListRow
                image={product.image}
                imageAlt={product.title}
                brand={product.brand}
                title={product.title}
                item={product.item}
                mfg={product.mfg}
                meta={
                  <StockStatus qty={product.qty}>
                    {product.qty > 0 ? "In stock" : "Out of stock"}
                  </StockStatus>
                }
                actions={
                  <span className="text-sm font-semibold">
                    {formatUSD(product.price)}
                  </span>
                }
              />
            </div>
          </section>

          {replacements.length > 0 ? (
            <section className="px-5 py-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Replace className="size-4 text-muted-foreground" />
                Replacements
              </h2>
              <div className="space-y-3">
                {replacements.map((r) => (
                  <AltRow key={r.id} product={r} kind="replacement" onAdd={onAdd} />
                ))}
              </div>
            </section>
          ) : null}

          {substitutes.length > 0 ? (
            <section className="border-t px-5 py-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Shuffle className="size-4 text-muted-foreground" />
                Substitutes
              </h2>
              <div className="space-y-3">
                {substitutes.map((s) => (
                  <AltRow key={s.id} product={s} kind="substitute" onAdd={onAdd} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </DrawerPanel>
    </div>
  );
}

/* ─────────────────────────── Product row ─────────────────────────── */

function DetailRow({
  product,
  qty,
  selected,
  onToggle,
  onQty,
  onAdd,
  onRemove,
  onViewSubstitutes,
}: {
  product: Product;
  qty: number;
  selected: boolean;
  onToggle: (checked: boolean) => void;
  onQty: (next: number) => void;
  onAdd: () => void;
  onRemove: () => void;
  onViewSubstitutes: () => void;
}) {
  const [showComment, setShowComment] = React.useState(false);
  const [comment, setComment] = React.useState("");

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start border-b last:border-0">
      <div className="flex flex-col items-center gap-2 pt-4 pl-4">
        <Checkbox
          checked={selected}
          onCheckedChange={(v) => onToggle(v === true)}
          aria-label={`Select ${product.mfg}`}
        />
        <span
          aria-hidden="true"
          className="cursor-grab text-base leading-none text-muted-foreground"
          title="Drag to reorder"
        >
          ⠿
        </span>
      </div>
      <ProductListRow
        image={product.image}
        imageAlt={product.title}
        brand={product.brand}
        title={
          <div className="space-y-1">
            <Link
              href={`/pdp/${product.id}`}
              className="text-sm font-semibold leading-snug hover:underline"
            >
              {product.title}
            </Link>
            <div>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto px-0"
                onClick={() => setShowComment((v) => !v)}
              >
                {comment ? "Edit comment" : "Add comment"}
              </Button>
            </div>
            {showComment ? (
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a note for this line item…"
                className="mt-1 min-h-16"
                aria-label={`Comment for ${product.mfg}`}
              />
            ) : null}
          </div>
        }
        item={product.item}
        mfg={product.mfg}
        meta={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* Label column */}
            {product.label ? (
              <Badge variant="soft" color="slate">
                <Tag className="size-3" />
                {product.label}
              </Badge>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-muted-foreground"
              >
                <Tag className="size-3.5" />
                Add label
              </Button>
            )}
            {/* Availability column */}
            <StockStatus qty={product.qty}>
              {product.qty > 0 ? "In stock" : "Out of stock"}
            </StockStatus>
            {product.replacement ? <ReplacementBadge /> : null}
          </div>
        }
        actions={
          <div className="flex w-full flex-col items-start gap-2.5 sm:w-auto sm:items-end">
            <span className="text-base font-semibold">
              {formatUSD(product.price)}
            </span>
            <div className="flex items-center gap-2">
              <QtyStepper value={qty} onChange={onQty} label={product.mfg} />
              <Button size="sm" className="min-h-11" onClick={onAdd}>
                <Plus />
                Add
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${product.mfg}`}
                onClick={onRemove}
              >
                <Trash2 />
              </Button>
              {product.replacement ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto px-0"
                  onClick={onViewSubstitutes}
                >
                  <Replace className="size-3.5" />
                  View substitutes
                </Button>
              ) : null}
            </div>
          </div>
        }
      />
    </div>
  );
}

/* ─────────────────────────── Detail view ─────────────────────────── */

export function ListDetail({ id }: { id: string }) {
  const meta = getListMeta(id);
  const { addItem, openCart } = useCart();

  const [q, setQ] = React.useState("");
  const [rows, setRows] = React.useState<Product[]>(PRODUCTS);
  const [qtys, setQtys] = React.useState<Record<string, number>>(
    () => Object.fromEntries(PRODUCTS.map((p) => [p.id, 1])),
  );
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  // IDs still surfaced in the "Replacements available" review banner.
  const [banner, setBanner] = React.useState<string[]>(
    () => PRODUCTS.filter((p) => p.replacement).map((p) => p.id),
  );
  const [drawerFor, setDrawerFor] = React.useState<Product | null>(null);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.item.toLowerCase().includes(needle) ||
        p.mfg.toLowerCase().includes(needle),
    );
  }, [rows, q]);

  const total = React.useMemo(
    () => rows.reduce((sum, p) => sum + p.price * (qtys[p.id] ?? 1), 0),
    [rows, qtys],
  );

  const selectedIds = rows.filter((p) => selected[p.id]).map((p) => p.id);
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;

  const toCartItem = (p: Product | AltProduct) => ({
    id: p.id,
    title: p.title,
    brand: p.brand,
    image: p.image,
    price: p.price,
  });

  const addOne = (p: Product) => {
    addItem(toCartItem(p), qtys[p.id] ?? 1);
    openCart();
  };
  const addAlt = (p: AltProduct) => {
    addItem(toCartItem(p), 1);
    openCart();
  };
  const addAll = () => {
    rows.forEach((p) => addItem(toCartItem(p), qtys[p.id] ?? 1));
    openCart();
  };
  const addSelected = () => {
    rows
      .filter((p) => selected[p.id])
      .forEach((p) => addItem(toCartItem(p), qtys[p.id] ?? 1));
    openCart();
  };

  const removeRow = (rid: string) => {
    setRows((prev) => prev.filter((p) => p.id !== rid));
    setSelected((prev) => {
      const next = { ...prev };
      delete next[rid];
      return next;
    });
    setBanner((prev) => prev.filter((b) => b !== rid));
  };

  const bannerProducts = rows.filter((p) => banner.includes(p.id));

  return (
    <DashboardShell
      title={meta.name}
      description="Review, restock, and reorder the products saved to this list."
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/shopping-lists">Shopping Lists</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{meta.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <div className="space-y-3">
        {/* Meta row — left: created · type · count · right: primary action + total. */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span>Created {meta.created}</span>
            <span aria-hidden="true">·</span>
            <Badge variant="outline">{meta.type}</Badge>
            <span aria-hidden="true">·</span>
            <span>
              {rows.length} product{rows.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <Button className="min-h-11" onClick={addAll}>
              <ShoppingCart size={16} />
              Add all items to cart
            </Button>
            <span className="text-sm text-muted-foreground">
              List total{" "}
              <span className="font-semibold text-foreground">
                {formatUSD(total)}
              </span>
            </span>
          </div>
        </div>

        {/* Replacements review banner (yellow warning tone). */}
        {bannerProducts.length > 0 ? (
          <Alert variant="warning">
            <Replace />
            <AlertTitle>Replacements available</AlertTitle>
            <AlertDescription>
              <p>The following items have a replacement or substitute.</p>
              <div className="mt-3 w-full space-y-3">
                {bannerProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-3 rounded-md border border-yellow-500/40 bg-background/70 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="grid size-12 shrink-0 place-items-center rounded-md bg-muted/40 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-primary">
                        {p.brand}
                      </p>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Item: {p.item} · MFG: {p.mfg} · Replacement available
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-h-11 text-muted-foreground"
                        onClick={() =>
                          setBanner((prev) => prev.filter((b) => b !== p.id))
                        }
                      >
                        Dismiss
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="min-h-11"
                        onClick={() => setDrawerFor(p)}
                      >
                        <Replace className="size-3.5" />
                        View substitutes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Card: toolbar + bulk actions + rows */}
        <section className="rounded-lg border bg-background shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b p-4">
            <AccountSearchInput
              value={q}
              onChange={setQ}
              placeholder="Search products by name or SKU"
              className="min-w-[240px] flex-1"
            />
            <Button variant="outline" className="min-h-11">
              <Settings2 size={16} />
              Sort
            </Button>
          </div>

          {/* Bulk action row */}
          <div className="flex flex-wrap items-center gap-2 border-b bg-muted/30 px-4 py-3">
            <label className="flex min-h-11 items-center gap-2 text-sm font-medium">
              <Checkbox
                checked={
                  allSelected ? true : selectedIds.length > 0 ? "indeterminate" : false
                }
                onCheckedChange={(v) =>
                  setSelected(
                    v === true
                      ? Object.fromEntries(rows.map((p) => [p.id, true]))
                      : {},
                  )
                }
                aria-label="Select all products"
              />
              Select all
            </label>
            <span className="mx-1 hidden text-sm text-muted-foreground sm:inline">
              {selectedIds.length} selected
            </span>
            <div className="ml-auto flex flex-wrap items-center gap-1">
              <Button
                size="sm"
                className="min-h-11"
                disabled={selectedIds.length === 0}
                onClick={addSelected}
              >
                <ShoppingCart className="size-4" />
                Add selected to cart
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 text-muted-foreground"
                disabled={selectedIds.length === 0}
              >
                <FolderInput className="size-4" />
                Move to
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 text-muted-foreground"
                disabled={selectedIds.length === 0}
              >
                <Copy className="size-4" />
                Copy to
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 text-muted-foreground"
                disabled={selectedIds.length === 0}
                onClick={() => selectedIds.forEach(removeRow)}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
          </div>

          {/* Product rows */}
          <div>
            {filtered.map((p) => (
              <DetailRow
                key={p.id}
                product={p}
                qty={qtys[p.id] ?? 1}
                selected={!!selected[p.id]}
                onToggle={(checked) =>
                  setSelected((prev) => ({ ...prev, [p.id]: checked }))
                }
                onQty={(next) => setQtys((prev) => ({ ...prev, [p.id]: next }))}
                onAdd={() => addOne(p)}
                onRemove={() => removeRow(p.id)}
                onViewSubstitutes={() => setDrawerFor(p)}
              />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No products match &ldquo;{q}&rdquo;.
            </div>
          ) : null}
        </section>
      </div>

      <ReplacementsDrawer
        product={drawerFor}
        onClose={() => setDrawerFor(null)}
        onAdd={addAlt}
      />
    </DashboardShell>
  );
}
