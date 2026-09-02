import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Watsco Design System",
  description:
    "The Watsco design system — foundations, components, and composed ecommerce blocks. Preview, copy the exact code, ship.",
};

const FOUNDATIONS = [
  { label: "Color & tokens", href: "/components/colors", desc: "Semantic, status, and brand-chrome tokens." },
  { label: "Typography", href: "/components/typography", desc: "Type scale, weights, and usage." },
];

const COMPONENTS = [
  { label: "Button", href: "/components/button", desc: "Every variant, size, and state — with real code." },
  { label: "Badge", href: "/components/badge", desc: "Status labels, Pro Essentials, Best Value." },
  { label: "Product Card", href: "/components/product-card", desc: "The core PDP/PLP merchandising card." },
  { label: "PLP Patterns", href: "/components/plp", desc: "Search rows, filters, grid/list toggle." },
  { label: "Save + AHRI", href: "/components/save-ahri", desc: "Save, share, AHRI matched-system actions." },
  { label: "Forms", href: "/components/forms", desc: "Inputs, selects, checkboxes, quantity." },
  { label: "Feedback", href: "/components/feedback", desc: "Alerts, toasts, skeletons, empty states." },
  { label: "Overlays", href: "/components/overlays", desc: "Dialog, sheet, drawer, popover." },
];

const BLOCKS = [
  { label: "Buy Box", href: "/components/buy-box", desc: "The PDP purchase panel — badges, price, availability, Add to Cart." },
  { label: "Branch Selector", href: "/components/branch-selector", desc: "Global branch finder — slides in from the left." },
  { label: "Inventory Drawer", href: "/components/inventory-drawer", desc: "Per-branch stock — slides in from the right." },
  { label: "Account Drawer", href: "/components/account-drawer", desc: "Global account panel — switch account, ship-to, nav." },
  { label: "Checkout", href: "/components/checkout", desc: "Delivery / pickup routing and use cases." },
];

function CardGrid({
  items,
}: {
  items: { label: string; href: string; desc: string; soon?: boolean }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className="group flex flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            {c.label}
            {c.soon ? (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Soon
              </span>
            ) : (
              <ArrowRight className="size-3.5 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-60" />
            )}
          </span>
          <span className="text-sm text-muted-foreground">{c.desc}</span>
        </Link>
      ))}
    </div>
  );
}

export default function ComponentsOverview() {
  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-10 md:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Watsco Design System</h1>
        <p className="mt-2 text-muted-foreground">
          The single source of truth for the Watsco storefronts. Every component ships a
          live preview and the <span className="font-medium text-foreground">exact code</span> to
          paste — so what devs build always matches the library.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Foundations
        </h2>
        <CardGrid items={FOUNDATIONS} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Components
        </h2>
        <CardGrid items={COMPONENTS} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Blocks
        </h2>
        <CardGrid items={BLOCKS} />
      </section>
    </main>
  );
}
