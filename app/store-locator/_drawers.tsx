"use client";

import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Navigation,
  Phone,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { closeDrawer } from "./_drawer-overlay";

/** Ten mock branches — same list across all three variants so scroll and
 *  layout tradeoffs are comparable apples-to-apples. */
export const BRANCHES = [
  { name: "Ybor City #2541", miles: 0.8, open: "Open · closes 6pm", phone: "(813) 555-2541", qty: 12 },
  { name: "Tampa #2531", miles: 6.6, open: "Open · closes 6pm", phone: "(813) 555-2531", qty: 8 },
  { name: "Clearwater #2521", miles: 8.6, open: "Open · closes 6pm", phone: "(727) 555-2521", qty: 4 },
  { name: "Lakeland #2551", miles: 12.4, open: "Open · closes 6pm", phone: "(863) 555-2551", qty: 2 },
  { name: "St. Petersburg #2544", miles: 14.9, open: "Open · closes 6pm", phone: "(727) 555-2544", qty: 50 },
  { name: "Bradenton #2557", miles: 18.3, open: "Open · closes 6pm", phone: "(941) 555-2557", qty: 10 },
  { name: "Sarasota #2559", miles: 24.7, open: "Open · closes 6pm", phone: "(941) 555-2559", qty: 1 },
  { name: "Ocala #2571", miles: 62.1, open: "Open · closes 6pm", phone: "(352) 555-2571", qty: 6 },
  { name: "Orlando SW #2612", miles: 74.4, open: "Open · closes 5pm", phone: "(407) 555-2612", qty: 22 },
  { name: "Kissimmee #2618", miles: 78.2, open: "Open · closes 5pm", phone: "(407) 555-2618", qty: 3 },
];

/** Directions + miles as a single unit — David's rule: distance and directions
 *  belong together (miles is the answer, directions is the action). */
function MilesDirections({ miles }: { miles: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className="text-muted-foreground">{miles} mi</span>
      <span className="text-muted-foreground/40">·</span>
      <a href="#" className="inline-flex items-center gap-1 font-medium text-primary">
        <Navigation className="size-3.5" />
        Get directions
      </a>
    </span>
  );
}

function CloseX() {
  return (
    <button
      type="button"
      aria-label="Close"
      className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <X className="size-4" />
    </button>
  );
}

/** Drawer shell — flexes to whatever height its parent provides. In the
 *  gallery each column pins 720px; in the /in-plp overlay it stretches
 *  to inset-y-0 for full viewport height. */
const DRAWER_SHELL =
  "flex h-full w-[404px] flex-col overflow-hidden border bg-background shadow-xl";

/* ────────────────── Direction 2 — Divider list, small blue commit ───────
 * No card boxes — rows are separated by hairline dividers so the eye moves
 * top-to-bottom without visual weight from row chrome. Small primary-blue
 * "Select" button per row. No numbering (didn't earn its space).
 */
export function DirectionBDrawer() {
  return (
    <div className={DRAWER_SHELL}>
      <header className="flex shrink-0 items-center justify-between border-b px-5 py-3.5">
        <div>
          <p className="text-base font-bold">Find a branch</p>
          <p className="text-xs text-muted-foreground">Sorted by distance</p>
        </div>
        <CloseX />
      </header>
      <div className="shrink-0 border-b px-4 pt-3.5 pb-2.5">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <Search className="size-4 text-muted-foreground" />
          <span className="flex-1 text-foreground">Tampa, FL 33605</span>
        </div>
        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Navigation className="size-4" />
          Use my location
        </a>
      </div>
      <ul className="flex flex-1 flex-col divide-y overflow-y-auto">
        {BRANCHES.map((s) => (
          <li
            key={s.name}
            className="flex flex-col gap-1 px-5 py-2.5 transition-colors hover:bg-muted/40"
          >
            {/* Branch identity and availability stay on the top rail. */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs font-medium text-emerald-700">{s.open}</p>
              </div>
              {/* Right column — miles + Get directions stay grouped together. */}
              <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                <span className="text-muted-foreground tabular-nums">
                  {s.miles} mi
                </span>
                <a
                  href="#"
                  aria-label={`Directions to ${s.name}`}
                  className="inline-flex items-center gap-1 font-medium text-primary"
                >
                  <Navigation className="size-3.5" />
                  Get directions
                </a>
              </div>
            </div>
            {/* Contact actions share a rail with Select so their labels align. */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <a
                  href={`tel:${s.phone.replace(/[^\d]/g, "")}`}
                  aria-label={`Call ${s.name}`}
                  className="inline-flex items-center gap-1 font-medium text-primary"
                >
                  <Phone className="size-3.5" />
                  {s.phone}
                </a>
                <a
                  href="#"
                  aria-label={`Chat with ${s.name}`}
                  className="inline-flex items-center gap-1 font-medium text-primary"
                >
                  <MessageSquare className="size-3.5" />
                  Chat
                </a>
              </div>
              <button
                type="button"
                className="inline-flex h-7 shrink-0 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Select
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="shrink-0 border-t p-3">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-foreground bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          See More Branches
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ────────────────── Direction 3 — Product-aware inventory drawer ─────────
 * Row layout: currently-shopping tag → name → open+miles+directions on one
 * inline rail → phone+chat rail below → Select store primary button.
 * Stacking: product context up top, per-row commit inline.
 */
export function DirectionCDrawer() {
  return (
    <div className="relative h-full w-[444px]">
      <div className={DRAWER_SHELL}>
        <header className="flex shrink-0 items-center border-b px-5 py-3.5">
          <div>
            <p className="text-base font-bold">Find a branch</p>
            <p className="text-xs text-muted-foreground">Sorted by distance</p>
          </div>
        </header>
        {/* Search + change-location — same primitive the other drawers use so
            switching branches is discoverable in the product-aware mode too. */}
        <div className="shrink-0 border-b px-4 pt-3.5 pb-2.5">
          <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
            <Search className="size-4 text-muted-foreground" />
            <span className="flex-1 text-foreground">33605</span>
          </div>
          <a
            href="#"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            <Navigation className="size-4" />
            Use my current location
          </a>
        </div>
        <ul className="flex flex-1 flex-col divide-y overflow-y-auto">
        {BRANCHES.map((s, i) => {
          const isCurrent = i === 0;
          return (
            <li
              key={s.name}
              className="relative flex flex-col gap-2 px-5 py-3 transition-colors hover:bg-muted/40"
            >
              {/* Row 1 — branch name. */}
              <div className="flex items-baseline gap-3">
                <p className="text-sm font-semibold">{s.name}</p>
              </div>
              <details className="group text-xs">
                <summary className="flex w-fit cursor-pointer list-none items-center gap-1 font-medium text-black/70 outline-none focus-visible:underline [&::-webkit-details-marker]:hidden">
                  Store Hours
                  <ChevronDown className="size-3.5 text-black/70 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-1 text-muted-foreground">
                  Mon–Fri 7am–6pm · Sat 8am–12pm · Sun Closed
                </p>
              </details>
              {/* Row 2 — miles + Get directions, LEFT-aligned. */}
              <div className="flex translate-y-px items-center text-xs">
                <MilesDirections miles={s.miles} />
              </div>
              {/* Row 3 — phone + chat (left) + commit (right). Current-store
                  row swaps the commit for a locked green "Current store"
                  button-style tag in the same slot for alignment. */}
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs">
                  <a
                    href={`tel:${s.phone.replace(/[^\d]/g, "")}`}
                    aria-label={`Call ${s.name}`}
                    className="inline-flex items-center gap-1 font-medium text-primary"
                  >
                    <Phone className="size-3.5" />
                    {s.phone}
                  </a>
                  <a
                    href="#"
                    aria-label={`Chat with ${s.name}`}
                    className="inline-flex items-center gap-1 font-medium text-primary"
                  >
                    <MessageSquare className="size-3.5" />
                    Chat
                  </a>
                </span>
                {isCurrent ? (
                  <span className="absolute top-1/2 right-5 inline-flex h-7 -translate-y-1/2 items-center rounded-md bg-emerald-600 px-3 text-xs font-semibold text-white">
                    Current Store
                  </span>
                ) : (
                  <Button size="sm" className="absolute top-1/2 right-5 h-7 -translate-y-1/2 px-3 text-xs">
                    Select Store
                  </Button>
                )}
              </div>
            </li>
          );
        })}
        </ul>
        <div className="shrink-0 border-t p-3">
          <Button variant="secondary" className="h-10 w-full">
            Find Other Branches
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      {/* The close control sits on the scrim, outside the drawer edge. */}
      <Button
        type="button"
        aria-label="Close"
        onClick={closeDrawer}
        variant="outline"
        size="icon-sm"
        className="absolute top-4 left-[428px] rounded-full shadow-lg"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
