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
  { name: "Ybor City #2541", miles: 0.8, open: "Open · closes 6pm", phone: "(813) 555-2541" },
  { name: "Tampa #2531", miles: 6.6, open: "Open · closes 6pm", phone: "(813) 555-2531" },
  { name: "Clearwater #2521", miles: 8.6, open: "Open · closes 6pm", phone: "(727) 555-2521" },
  { name: "Lakeland #2551", miles: 12.4, open: "Open · closes 6pm", phone: "(863) 555-2551" },
  { name: "St. Petersburg #2544", miles: 14.9, open: "Open · closes 6pm", phone: "(727) 555-2544" },
  { name: "Bradenton #2557", miles: 18.3, open: "Open · closes 6pm", phone: "(941) 555-2557" },
  { name: "Sarasota #2559", miles: 24.7, open: "Open · closes 6pm", phone: "(941) 555-2559" },
  { name: "Ocala #2571", miles: 62.1, open: "Open · closes 6pm", phone: "(352) 555-2571" },
  { name: "Orlando SW #2612", miles: 74.4, open: "Open · closes 5pm", phone: "(407) 555-2612" },
  { name: "Kissimmee #2618", miles: 78.2, open: "Open · closes 5pm", phone: "(407) 555-2618" },
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

/** Phone + chat clustered together — talk-to-someone actions live as one unit. */
function ContactCluster({ phone }: { phone: string }) {
  return (
    <span className="inline-flex items-center gap-3 text-xs">
      <a
        href={`tel:${phone.replace(/[^\d]/g, "")}`}
        className="inline-flex items-center gap-1 font-medium text-primary"
      >
        <Phone className="size-3.5" />
        {phone}
      </a>
      <a href="#" className="inline-flex items-center gap-1 font-medium text-primary">
        <MessageSquare className="size-3.5" />
        Chat
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

/* ────────────────── Direction 1 — Ranked list, radio commit ─────────────
 * Row layout: radio | name / open / miles+directions / phone+chat
 * Stacking: distance-below-name (readable-first), contact cluster on its own line.
 */
export function DirectionADrawer() {
  return (
    <div className={DRAWER_SHELL}>
      <header className="flex shrink-0 items-center justify-between border-b bg-primary px-5 py-3 text-primary-foreground">
        <p className="text-base font-bold">Select a store</p>
        <button
          type="button"
          aria-label="Close"
          className="grid size-8 place-items-center rounded-md hover:bg-primary/80"
        >
          <X className="size-4" />
        </button>
      </header>
      <div className="shrink-0 border-b px-4 pt-4 pb-3">
        <p className="text-sm font-semibold">Enter zip code or city, state</p>
        <div className="mt-2 flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
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
        {BRANCHES.map((s, i) => (
          <li key={s.name}>
            <label className="flex cursor-pointer gap-3 px-5 py-4 transition-colors hover:bg-muted/40">
              <span
                aria-hidden
                className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2 ${
                  i === 0 ? "border-primary" : "border-muted-foreground/40"
                }`}
              >
                {i === 0 ? (
                  <span className="size-2 rounded-full bg-primary" />
                ) : null}
              </span>
              {/* Two-column row: identity left, miles + directions pinned
                  right so the whitespace on the right is used. */}
              <div className="flex flex-1 items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs font-medium text-emerald-700">{s.open}</p>
                  <ContactCluster phone={s.phone} />
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                  <span className="font-medium text-foreground">
                    {s.miles} mi
                  </span>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 font-medium text-primary"
                  >
                    <Navigation className="size-3.5" />
                    Directions
                  </a>
                </div>
              </div>
            </label>
          </li>
        ))}
      </ul>
      <div className="shrink-0 border-t p-3">
        <button
          type="button"
          className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Save selection
        </button>
      </div>
    </div>
  );
}

/* ────────────────── Direction 2 — Divider list, small blue commit ───────
 * No card boxes — rows are separated by hairline dividers so the eye moves
 * top-to-bottom without visual weight from row chrome. Small primary-blue
 * "Select" button per row. No numbering (didn't earn its space).
 */
export function DirectionBDrawer() {
  return (
    <div className={DRAWER_SHELL}>
      <header className="flex shrink-0 items-center justify-between border-b px-5 py-4">
        <div>
          <p className="text-base font-bold">Find a branch</p>
          <p className="text-xs text-muted-foreground">Sorted by distance</p>
        </div>
        <CloseX />
      </header>
      <div className="shrink-0 border-b px-4 pt-4 pb-3">
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
          <li key={s.name} className="px-5 py-4 transition-colors hover:bg-muted/40">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="mt-0.5 text-xs font-medium text-emerald-700">{s.open}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <MilesDirections miles={s.miles} />
                  <ContactCluster phone={s.phone} />
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
    <div className={`${DRAWER_SHELL} relative`}>
      {/* Floating close button — sits outside the drawer at the top-right,
          circle with drop shadow, so the header can be reserved entirely
          for the product context. */}
      <button
        type="button"
        aria-label="Close"
        className="absolute top-3 -right-4 z-10 grid size-8 translate-x-full place-items-center rounded-full border bg-background text-muted-foreground shadow-lg transition-colors hover:bg-accent hover:text-foreground"
      >
        <X className="size-4" />
      </button>
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
      <div className="shrink-0 border-b px-4 pt-4 pb-3">
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
        {BRANCHES.map((s, i) => (
          <li
            key={s.name}
            className="flex flex-col gap-1.5 px-5 py-4 transition-colors hover:bg-muted/40"
          >
            {i === 0 ? (
              <span className="inline-flex w-fit items-center rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                Currently shopping
              </span>
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="font-medium text-emerald-700">{s.open}</span>
                  <MilesDirections miles={s.miles} />
                </p>
                <div className="mt-1">
                  <ContactCluster phone={s.phone} />
                </div>
              </div>
              {i === 0 ? null : (
                <button
                  type="button"
                  className="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Select store
                </button>
              )}
            </div>
          </li>
        ))}
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
