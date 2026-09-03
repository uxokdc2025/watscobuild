"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { DRAWER_SPRING } from "@/components/ui/drawer";
import {
  PRODUCT_TAXONOMY,
  taxonomyHref,
  type TaxonomyNode,
} from "./mega-taxonomy";

/* ────────────────────────────────────────────────────────────────────────
   Ulta-style cascading mega menu.

   Click-driven (never hover): clicking "Products" opens a full-page dimmed
   scrim with a left-docked panel that slides in. Tier-1 categories live in a
   white column; clicking one slides out a tinted Tier-2 column to its right;
   clicking a Tier-2 with children slides out a Tier-3 column. Separation is by
   tint only — no vertical divider rules. Neutral surfaces throughout: the
   brand color lives on the header bar, never inside the panel body.
   ──────────────────────────────────────────────────────────────────────── */

/** Soft column reveal — same easing curve as the system drawers, quicker. */
const COLUMN_MOTION = {
  type: "tween" as const,
  duration: 0.3,
  ease: [0.32, 0.72, 0, 1] as const,
};

const itemBase =
  "flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** A leaf category (no children): a real navigation link. */
function LeafLink({
  node,
  onNavigate,
}: {
  node: TaxonomyNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      role="menuitem"
      href={taxonomyHref(node)}
      onClick={onNavigate}
      className={cn(itemBase, "text-foreground/90")}
    >
      <span>{node.label}</span>
    </Link>
  );
}

/** A branch category: a button that drills into the next column. */
function BranchButton({
  node,
  active,
  onSelect,
}: {
  node: TaxonomyNode;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-haspopup="true"
      aria-expanded={active}
      onClick={onSelect}
      className={cn(
        itemBase,
        "font-medium",
        active && "bg-accent font-semibold text-foreground",
      )}
    >
      <span>{node.label}</span>
      <ChevronRight
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0 text-muted-foreground",
          active && "text-foreground",
        )}
      />
    </button>
  );
}

/** Renders one taxonomy node either as a branch button or a leaf link. */
function ColumnItem({
  node,
  active,
  onSelect,
  onNavigate,
}: {
  node: TaxonomyNode;
  active: boolean;
  onSelect: () => void;
  onNavigate: () => void;
}) {
  return node.children?.length ? (
    <BranchButton node={node} active={active} onSelect={onSelect} />
  ) : (
    <LeafLink node={node} onNavigate={onNavigate} />
  );
}

/** "View all …" link that heads a drilled column. */
function ColumnHeader({
  node,
  onNavigate,
}: {
  node: TaxonomyNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={taxonomyHref(node)}
      onClick={onNavigate}
      className="mb-1 flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      View all {node.label.toLowerCase()}
      <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
    </Link>
  );
}

export function MegaMenu({
  label = "Products",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState<TaxonomyNode | null>(null);
  const [subcategory, setSubcategory] = React.useState<TaxonomyNode | null>(null);
  const [topOffset, setTopOffset] = React.useState(0);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    setCategory(null);
    setSubcategory(null);
  }, []);

  React.useEffect(() => setMounted(true), []);

  // Dock the scrim + panel directly beneath the header (the trigger sits in the
  // last header row), so the whole header stays visible above the dim.
  const measure = React.useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setTopOffset(rect.bottom);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("resize", measure);
    window.addEventListener("keydown", onKeyDown);
    // Lock body scroll while the menu owns the viewport.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, measure, close]);

  function toggle() {
    if (open) {
      close();
      return;
    }
    measure(); // set the dock offset before the panel mounts — no first-frame flash
    setOpen(true);
  }

  function selectCategory(next: TaxonomyNode) {
    // One panel per click: selecting a Tier-1 category reveals ONLY Tier-2.
    // Nothing in Tier-2 is pre-expanded — Tier-3 waits for an explicit click.
    if (category?.slug === next.slug) return;
    setCategory(next);
    setSubcategory(null);
  }

  const subcategories = category?.children ?? [];
  const details = subcategory?.children ?? [];

  // Roving keyboard support inside the panel (nice-to-have).
  function onPanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const { key } = event;
    if (key !== "ArrowDown" && key !== "ArrowUp") return;
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    event.preventDefault();
    const nextIndex =
      key === "ArrowDown"
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  const overlay = mounted
    ? createPortal(
        <AnimatePresence>
          {/* Scrim — dims the page below the header. */}
          {open ? (
            <motion.div
              key="mega-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={close}
              aria-hidden="true"
              className="fixed inset-x-0 bottom-0 z-[70] bg-black/40"
              style={{ top: topOffset }}
            />
          ) : null}
          {/* Panel — slides in from the left. */}
          {open ? (
              <motion.div
                key="mega-panel"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={DRAWER_SPRING}
                role="menu"
                aria-label="Product categories"
                onKeyDown={onPanelKeyDown}
                className="fixed left-0 z-[71] flex w-[min(940px,100vw)] flex-col overflow-hidden bg-popover text-popover-foreground shadow-2xl md:flex-row"
                style={{
                  top: topOffset,
                  height: `calc(100dvh - ${topOffset}px)`,
                }}
              >
                {/* Tier 1 — white column. */}
                <div className="w-full shrink-0 overflow-y-auto bg-popover p-2 md:w-64">
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Shop products
                  </p>
                  {PRODUCT_TAXONOMY.map((node) => (
                    <ColumnItem
                      key={node.slug}
                      node={node}
                      active={category?.slug === node.slug}
                      onSelect={() => selectCategory(node)}
                      onNavigate={close}
                    />
                  ))}
                </div>

                {/* Tier 2 — tinted column, no divider rule. */}
                <AnimatePresence mode="wait">
                  {category ? (
                    <motion.div
                      key={category.slug}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={COLUMN_MOTION}
                      className="w-full shrink-0 overflow-y-auto bg-muted/40 p-2 md:w-72"
                    >
                      <ColumnHeader node={category} onNavigate={close} />
                      {subcategories.map((node) => (
                        <ColumnItem
                          key={node.slug}
                          node={node}
                          active={subcategory?.slug === node.slug}
                          onSelect={() =>
                            setSubcategory(node.children?.length ? node : null)
                          }
                          onNavigate={close}
                        />
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Tier 3 — deeper tint, still borderless. */}
                <AnimatePresence mode="wait">
                  {subcategory && details.length ? (
                    <motion.div
                      key={subcategory.slug}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={COLUMN_MOTION}
                      className="w-full flex-1 overflow-y-auto bg-muted/60 p-2"
                    >
                      <ColumnHeader node={subcategory} onNavigate={close} />
                      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                        {details.map((node) => (
                          <LeafLink
                            key={node.slug}
                            node={node}
                            onNavigate={close}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={toggle}
        className={cn(
          "group my-1.5 inline-flex min-h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
          open && "bg-white/10 text-white",
        )}
      >
        <span className="underline-offset-4 group-hover:underline">{label}</span>
        {/* Caret nudges UP on hover and stays up while open — it never rotates.
            Wrapped in an inline-flex span because CSS transforms don't move the
            <svg> root itself reliably. */}
        <span
          className={cn(
            "inline-flex transition-transform duration-200 group-hover:[transform:translateY(-2px)]",
            open && "[transform:translateY(-2px)]",
          )}
        >
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </span>
      </button>
      {overlay}
    </div>
  );
}
