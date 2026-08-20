"use client";

import {
  Building2,
  ChevronRight,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Search,
  Truck,
  X,
} from "lucide-react";

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

const SECONDARY_BTN =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80";

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
            className="flex flex-col gap-1 px-5 py-3.5 transition-colors hover:bg-muted/40"
          >
            {/* Row 1 — branch name (left) + miles + Get directions (right). */}
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold">{s.name}</p>
              <span className="flex shrink-0 items-center gap-2 text-xs">
                <span className="text-muted-foreground tabular-nums">
                  {s.miles} mi
                </span>
                <a
                  href="#"
                  aria-label={`Directions to ${s.name}`}
                  className="inline-flex min-h-11 items-center gap-1 px-1 font-medium text-primary"
                >
                  <Navigation className="size-3.5" />
                  Get directions
                </a>
              </span>
            </div>
            {/* Row 2 — Open status. */}
            <p className="text-xs font-medium text-emerald-700">{s.open}</p>
            {/* Row 3 — Phone + Chat (mobile-friendly 44px targets) + inline
                Select store CTA on the right, sharing the line. */}
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-xs">
                <a
                  href={`tel:${s.phone.replace(/[^\d]/g, "")}`}
                  aria-label={`Call ${s.name}`}
                  className="inline-flex min-h-11 items-center gap-1 px-1 font-medium text-primary"
                >
                  <Phone className="size-3.5" />
                  {s.phone}
                </a>
                <a
                  href="#"
                  aria-label={`Chat with ${s.name}`}
                  className="inline-flex min-h-11 items-center gap-1 px-1 font-medium text-primary"
                >
                  <MessageSquare className="size-3.5" />
                  Chat
                </a>
              </span>
              <button
                type="button"
                className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
          See more branches
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
    <div className={DRAWER_SHELL}>
      {/* No inline header — product context row is the top of the drawer.
          The Close X floats OUTSIDE this drawer on the scrim; it lives in
          the /in-plp overlay page, not in this component. */}
      <div className="flex shrink-0 items-start gap-3 border-b bg-muted/40 p-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-md border bg-background">
          <MapPin className="size-6 text-muted-foreground/60" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Carrier
          </p>
          <p className="mt-0.5 text-sm leading-tight font-semibold">
            2.5 Ton 14.3 SEER2 Residential Heat Pump Condensing Unit (R-454B)
          </p>
        </div>
      </div>
      <div className="flex shrink-0 border-b">
        <button
          type="button"
          className="relative flex flex-1 items-center justify-center gap-1.5 border-b-2 border-primary py-3 text-sm font-semibold text-primary"
        >
          <Building2 className="size-4" />
          Branch pickup
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Truck className="size-4" />
          Delivery
        </button>
      </div>
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
              className="flex flex-col gap-1.5 px-5 py-3.5 transition-colors hover:bg-muted/40"
            >
              {/* Row 1 — branch name (left) + availability count (right). */}
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold">{s.name}</p>
                <span className="text-xs font-semibold tabular-nums text-emerald-700">
                  {s.qty} available
                </span>
              </div>
              {/* Row 2 — open status + miles/directions. */}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="font-medium text-emerald-700">{s.open}</span>
                <MilesDirections miles={s.miles} />
              </p>
              {/* Row 3 — phone + chat + commit button (inline). Currently
                  shopping row swaps the commit for a locked "Currently
                  shopping" button-style badge in the same slot so alignment
                  matches across all rows. */}
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs">
                  <a
                    href={`tel:${s.phone.replace(/[^\d]/g, "")}`}
                    aria-label={`Call ${s.name}`}
                    className="inline-flex min-h-11 items-center gap-1 px-1 font-medium text-primary"
                  >
                    <Phone className="size-3.5" />
                    {s.phone}
                  </a>
                  <a
                    href="#"
                    aria-label={`Chat with ${s.name}`}
                    className="inline-flex min-h-11 items-center gap-1 px-1 font-medium text-primary"
                  >
                    <MessageSquare className="size-3.5" />
                    Chat
                  </a>
                </span>
                {isCurrent ? (
                  <span className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-emerald-600 px-3 text-xs font-semibold tracking-wide text-white uppercase">
                    Currently shopping
                  </span>
                ) : (
                  <button
                    type="button"
                    className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Select store
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="shrink-0 border-t p-3">
        <button type="button" className={SECONDARY_BTN}>
          Find other branches
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
