"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "../_showcase";

/* The design-system IA. One sidebar, three tiers: Foundations (tokens),
 * Components (atoms), Blocks (composed ecommerce patterns). Each leaf is
 * its own page — the shadcn model. `href` may be a route or a legacy
 * anchor on /components/all so every existing section stays reachable. */
type NavItem = { label: string; href: string; soon?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "Foundations",
    items: [
      { label: "Overview", href: "/components" },
      { label: "Color & tokens", href: "/components/colors" },
      { label: "Typography", href: "/typography" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "Badge", href: "/components/all#labels" },
      { label: "Product Card", href: "/components/all#product-cards" },
      { label: "PLP Patterns", href: "/components/all#plp" },
      { label: "Save + AHRI", href: "/components/all#pdp-actions" },
      { label: "Forms", href: "/components/all#forms" },
      { label: "Feedback", href: "/components/all#feedback" },
      { label: "Overlays", href: "/components/all#overlays" },
      { label: "Data", href: "/components/all#data" },
      { label: "Navigation", href: "/components/all#navigation" },
      { label: "Media", href: "/components/all#media" },
    ],
  },
  {
    title: "Blocks",
    items: [
      { label: "PDP buy-box", href: "/components/all", soon: true },
      { label: "Store Locator", href: "/store-locator" },
      { label: "Checkout", href: "/checkout?demo=1" },
    ],
  },
];

export function DsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b md:h-svh md:w-60 md:border-r md:border-b-0">
      <div className="flex h-full flex-col md:sticky md:top-0">
        <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
          <Link href="/components" className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Watsco DS</span>
            <span className="text-xs text-muted-foreground">Design system</span>
          </Link>
          <ThemeToggle />
        </div>
        <nav
          aria-label="Design system"
          className="flex gap-6 overflow-x-auto px-5 py-4 md:flex-col md:gap-6 md:overflow-y-auto"
        >
          {NAV.map((group) => (
            <div key={group.title} className="min-w-max md:min-w-0">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group.title}
              </p>
              <ul className="flex gap-1 md:flex-col">
                {group.items.map((item) => {
                  const active =
                    item.href === pathname ||
                    (item.href.startsWith(pathname + "#") && pathname !== "/components");
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                          active
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        {item.label}
                        {item.soon ? (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                            Soon
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

/* Right-hand "On this page" table of contents — the third column a dev
 * uses to jump between a component's states. */
export function OnThisPage({ items }: { items: { id: string; label: string }[] }) {
  return (
    <aside className="hidden w-48 shrink-0 xl:block">
      <div className="sticky top-8">
        <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          On this page
        </p>
        <ul className="flex flex-col gap-1.5 border-l">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className="-ml-px block border-l border-transparent py-0.5 pl-3 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
