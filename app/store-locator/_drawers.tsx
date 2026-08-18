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

/** Ten mock branches, same list across all three drawers so the scroller
 *  behavior can be compared apples-to-apples. */
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

/** Row-level action links shared by all three variants. Phone · Chat · Directions
 *  render as a single flex row of anchor buttons — every anchor picks up
 *  the global hover-underline rule from globals.css. */
function RowLinks({ phone }: { phone: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
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
      <a href="#" className="inline-flex items-center gap-1 font-medium text-primary">
        <Navigation className="size-3.5" />
        Get directions
      </a>
    </p>
  );
}

/** Shared secondary-button style for the drawer footer CTAs
 *  (Find other / See more). Used across all three variants for consistency. */
const SECONDARY_BTN =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80";

/** Shared drawer close-X. */
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

/** Card shell — 340px wide, subtle hover (background only, no border shift so
 *  the row doesn't visually jump). Used by every variant. */
const ROW_CARD =
  "flex w-[340px] flex-col gap-2 rounded-lg border bg-card p-4 transition-colors duration-150 ease-out hover:bg-muted/40";

/* ────────────────── Direction A — Ranked list, radio commit ────────────── */

export function DirectionADrawer() {
  return (
    <div className="flex h-[720px] w-[404px] flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
      <header className="flex items-center justify-between border-b bg-primary px-5 py-3 text-primary-foreground">
        <p className="text-base font-bold">Select a store</p>
        <button
          type="button"
          aria-label="Close"
          className="grid size-8 place-items-center rounded-md hover:bg-primary/80"
        >
          <X className="size-4" />
        </button>
      </header>
      <div className="border-b p-4">
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
      <div className="flex flex-1 flex-col items-center gap-3 overflow-y-auto p-4">
        {BRANCHES.map((s, i) => (
          <label key={s.name} className={`${ROW_CARD} cursor-pointer flex-row gap-3`}>
            <span
              aria-hidden
              className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2 ${
                i === 0 ? "border-primary" : "border-muted-foreground/40"
              }`}
            >
              {i === 0 ? <span className="size-2 rounded-full bg-primary" /> : null}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="mt-1 flex items-center gap-3 text-xs">
                <span className="font-medium text-emerald-700">{s.open}</span>
                <span className="text-muted-foreground">{s.miles} mi</span>
              </p>
              <div className="mt-1">
                <RowLinks phone={s.phone} />
              </div>
            </div>
          </label>
        ))}
      </div>
      <div className="border-t p-3">
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

/* ────────────────── Direction B — Numbered ranking, inline commit ─────── */

export function DirectionBDrawer() {
  return (
    <div className="flex h-[720px] w-[404px] flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
      <header className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <p className="text-base font-bold">Find a branch</p>
          <p className="text-xs text-muted-foreground">Sorted by distance</p>
        </div>
        <CloseX />
      </header>
      <div className="border-b p-4">
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
      <ul className="flex flex-1 flex-col items-center gap-3 overflow-y-auto p-4">
        {BRANCHES.map((s, i) => (
          <li key={s.name} className={ROW_CARD}>
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold tracking-wide uppercase">{s.name}</p>
                <p className="mt-0.5 text-xs font-medium text-emerald-700">{s.open}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.miles} mi</p>
                <div className="mt-1">
                  <RowLinks phone={s.phone} />
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Select store
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t p-3">
        <button type="button" className={SECONDARY_BTN}>
          See more branches
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ───────── Direction C — Product-aware inventory drawer ────────────────── */

export function DirectionCDrawer() {
  return (
    <div className="flex h-[720px] w-[404px] flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
      <header className="flex items-center justify-between border-b px-5 py-3">
        <p className="text-base font-bold">Check Availability</p>
        <CloseX />
      </header>
      <div className="flex items-start gap-3 border-b bg-muted/40 p-4">
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
      <div className="flex border-b">
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
      <ul className="flex flex-1 flex-col items-center gap-3 overflow-y-auto p-4">
        {BRANCHES.map((s, i) => (
          <li key={s.name} className={ROW_CARD}>
            {i === 0 ? (
              <span className="inline-flex w-fit items-center rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                Currently shopping
              </span>
            ) : null}
            <p className="text-sm font-bold">{s.name}</p>
            <p className="text-xs font-medium text-emerald-700">{s.open}</p>
            <p className="text-xs text-muted-foreground">{s.miles} mi</p>
            <RowLinks phone={s.phone} />
            {i === 0 ? null : (
              <button
                type="button"
                className="mt-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Select store
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="border-t p-3">
        <button type="button" className={SECONDARY_BTN}>
          Find other branches
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
