import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Phone,
  Search,
  Truck,
  X,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Store Locator + Inventory Drawer — Watsco Design Templates",
  description:
    "Three UX/UI directions for the shared Store Locator + Inventory Drawer pattern.",
};

/* ─────────────────────────── Shared scaffolding ─────────────────────────── */

function DirectionCard({
  id,
  eyebrow,
  title,
  premise,
  strengths,
  tradeoffs,
  bestFor,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  premise: string;
  strengths: string[];
  tradeoffs: string[];
  bestFor: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 rounded-2xl border-2 border-primary/20 bg-card"
    >
      <header className="border-b p-6">
        <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground uppercase">
          {eyebrow}
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {premise}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
              Strengths
            </p>
            <ul className="mt-1.5 flex flex-col gap-1 text-muted-foreground">
              {strengths.map((s) => (
                <li key={s} className="flex gap-1.5">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
              Tradeoffs
            </p>
            <ul className="mt-1.5 flex flex-col gap-1 text-muted-foreground">
              {tradeoffs.map((t) => (
                <li key={t} className="flex gap-1.5">
                  <X className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              Best for
            </p>
            <p className="mt-1.5 text-muted-foreground">{bestFor}</p>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Preview
          </p>
          <div className="flex justify-center rounded-xl border bg-muted/40 p-6">
            {children}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            When it opens
          </p>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2 rounded-lg border bg-background p-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Header, every page</strong>
                {" — "}
                Contains the current store; opens the drawer as store locator.
              </span>
            </li>
            <li className="flex items-start gap-2 rounded-lg border bg-background p-3">
              <Package className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">PDP nearby-branch link</strong>
                {" — "}
                Opens the drawer as inventory-per-branch, product context pinned.
              </span>
            </li>
            <li className="flex items-start gap-2 rounded-lg border bg-background p-3">
              <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Cart & PLP</strong>
                {" — "}
                Same drawer, filtered to the item(s) in scope.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── Direction A — Split Map + List ─────────────── */

function DirectionA() {
  return (
    <div className="w-full max-w-[860px] overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b bg-primary px-5 py-3 text-primary-foreground">
        <p className="text-base font-bold">Select a store</p>
        <button
          type="button"
          aria-label="Close"
          className="grid size-8 place-items-center rounded-md hover:bg-primary/80"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,340px)_1fr]">
        {/* List column */}
        <div className="flex max-h-[520px] flex-col border-r">
          <div className="border-b p-4">
            <p className="text-sm font-semibold">Enter zip code or city, state</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                <Search className="size-4 text-muted-foreground" />
                <span className="flex-1 text-foreground">74066</span>
                <X className="size-3.5 text-muted-foreground" />
              </div>
              <button
                type="button"
                aria-label="Map view"
                className="grid size-9 place-items-center rounded-md border text-primary hover:bg-primary/5"
              >
                <MapPin className="size-4" />
              </button>
            </div>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <Navigation className="size-4" />
              Use my current location
            </button>
          </div>
          <div className="flex flex-1 flex-col divide-y overflow-y-auto">
            {[
              {
                selected: true,
                name: "Ybor City #2541",
                addr: "1502 E 5th Ave, Tampa, FL 33605",
                miles: 0.8,
                openUntil: "6pm",
              },
              {
                selected: false,
                name: "Tampa #2531",
                addr: "3200 W Cypress St, Tampa, FL 33607",
                miles: 6.6,
                openUntil: "6pm",
              },
              {
                selected: false,
                name: "Clearwater #2521",
                addr: "18325 US Highway 19 N, Clearwater, FL 33764",
                miles: 8.6,
                openUntil: "6pm",
              },
            ].map((s) => (
              <label
                key={s.name}
                className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-accent"
              >
                <span
                  aria-hidden
                  className={`mt-0.5 grid size-4 place-items-center rounded-full border-2 ${
                    s.selected ? "border-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {s.selected ? (
                    <span className="size-2 rounded-full bg-primary" />
                  ) : null}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {s.addr}
                  </p>
                  <p className="mt-1.5 flex items-center gap-3 text-xs">
                    <span className="font-medium text-emerald-700">
                      Open · until {s.openUntil}
                    </span>
                    <span className="text-muted-foreground">
                      {s.miles} miles away
                    </span>
                  </p>
                  <button
                    type="button"
                    className="mt-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Store details
                  </button>
                </div>
              </label>
            ))}
          </div>
          <div className="border-t p-3">
            <button
              type="button"
              className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Save selection
            </button>
          </div>
        </div>
        {/* Map column (stylized placeholder) */}
        <div
          className="hidden min-h-[520px] flex-col md:flex"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, color-mix(in oklch, var(--muted-foreground) 8%, transparent) 0 8px, transparent 8px 22px), radial-gradient(circle at 40% 45%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 60%)",
            backgroundColor: "var(--muted)",
          }}
        >
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-lg border bg-background/90 px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Map view
              </p>
              <p className="mt-1 text-sm">
                Pins mirror the ranked list — click a pin to select.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Direction B — Numbered ranked, list-only ────────────── */

function DirectionB() {
  return (
    <div className="w-full max-w-[720px] overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <p className="text-base font-bold">Find a branch</p>
          <p className="text-xs text-muted-foreground">
            Sorted by distance from your search
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          className="grid size-8 place-items-center rounded-md hover:bg-accent"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="border-b p-5">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2.5 text-sm">
          <Search className="size-4 text-muted-foreground" />
          <span className="flex-1 text-foreground">Tampa, FL 33605</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            <Navigation className="size-4" />
            Use my location
          </button>
          <button
            type="button"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View on map
          </button>
        </div>
      </div>
      <ul className="flex flex-col divide-y">
        {[
          { n: 1, name: "Ybor City #2541", addr: "1502 E 5th Ave, Tampa, FL 33605", miles: 0.8, open: "Open · closes 6pm" },
          { n: 2, name: "Tampa #2531", addr: "3200 W Cypress St, Tampa, FL 33607", miles: 6.6, open: "Open · closes 6pm" },
          { n: 3, name: "Clearwater #2521", addr: "18325 US Hwy 19 N, Clearwater, FL 33764", miles: 8.6, open: "Open · closes 6pm" },
        ].map((s) => (
          <li key={s.n} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {s.n}
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">{s.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.addr}</p>
                <p className="mt-1 text-xs font-medium text-emerald-700">{s.open}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">~{s.miles} mi</span>
              <button
                type="button"
                className="rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
              >
                Location details
              </button>
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Set as my branch
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Direction C — Product-aware inventory drawer (Watsco style) ──── */

function DirectionC() {
  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <p className="text-base font-bold">Check Availability</p>
        <button
          type="button"
          aria-label="Close"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-red-600 hover:text-red-700"
        >
          Close <X className="size-3.5" />
        </button>
      </div>
      {/* Product context header */}
      <div className="flex items-start gap-3 border-b bg-muted/40 p-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-md border bg-background">
          <Package className="size-6 text-muted-foreground/60" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Carrier
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight">
            2.5 Ton 14.3 SEER2 Residential Heat Pump Condensing Unit (R-454B)
          </p>
        </div>
      </div>
      {/* Tabs */}
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
          className="flex flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Truck className="size-4" />
          Delivery
        </button>
      </div>
      {/* Rows */}
      <ul className="flex flex-col divide-y">
        <li className="p-4">
          <span className="inline-flex items-center rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
            Currently shopping
          </span>
          <p className="mt-2 text-sm font-bold">Ybor City #2541</p>
          <button
            type="button"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Get directions
          </button>
          <p className="mt-1 text-xs text-muted-foreground">
            1502 E 5th Ave, Tampa, FL 33605
          </p>
          <p className="mt-1 text-xs font-semibold text-emerald-700">
            12 available today
          </p>
          <p className="mt-2 flex items-center gap-3 text-xs">
            <a
              href="#"
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              <Phone className="size-3.5" />
              (813) 555-2541
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              <MessageSquare className="size-3.5" />
              Chat with us
            </a>
          </p>
        </li>
        {[
          { name: "Tampa #2531", miles: 6.6, qty: 8 },
          { name: "Clearwater #2521", miles: 8.6, qty: 4 },
          { name: "Lakeland #2551", miles: 12.4, qty: 2 },
        ].map((s) => (
          <li key={s.name} className="flex items-start justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-bold">{s.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {s.miles} miles · Get directions
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-700">
                {s.qty} available today
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
            >
              Pickup here
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t p-3">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-primary py-2 text-sm font-semibold text-primary hover:bg-primary/5"
        >
          Find other branches
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Page ─────────────────────────────── */

export default function StoreLocatorPage() {
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/pdp"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Back to templates
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Store Locator + Inventory Drawer
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              One shared drawer for two jobs: pick your branch (store locator)
              and check per-branch stock for a product (inventory drawer).
              Both surfaces should feel like the same component in different
              modes. Homans is the starting reference; below are three UX
              directions distilled from best-in-class patterns
              (Walmart, Raising Cane&apos;s, Chipotle, Sprint, Ferguson).
              Pick one to move forward with — happy to combine strengths
              across directions on a merge pass.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://arrow-sw-homans.wsm.wsoecom.ninja/search?q=blower%20motor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Homans reference
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* TOC / direction jump-links */}
        <nav className="mt-6 flex flex-wrap gap-2 text-sm">
          {[
            { id: "direction-a", label: "A — Split map + list" },
            { id: "direction-b", label: "B — Numbered ranked list" },
            { id: "direction-c", label: "C — Product-aware drawer" },
          ].map((d) => (
            <a
              key={d.id}
              href={`#${d.id}`}
              className="rounded-full border bg-card px-3 py-1.5 font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              {d.label}
            </a>
          ))}
        </nav>

        {/* Directions */}
        <div className="mt-8 flex flex-col gap-8">
          <DirectionCard
            id="direction-a"
            eyebrow="Direction A"
            title="Split map + list drawer"
            premise="A two-column drawer — searchable ranked list on the left, live map on the right. Radio-select + explicit Save at the bottom. The consumer pattern most Watsco buyers already know from Walmart, Home Depot, and Lowe's."
            strengths={[
              "Familiar consumer pattern — near-zero learning curve",
              "Map gives instant geographic context",
              "Explicit Save is a hard commit — no accidental branch swaps",
            ]}
            tradeoffs={[
              "Map is expensive to build + license",
              "Two-step commit (select then save) is a click contractors don't need",
              "Wider drawer footprint — collapses to list-only on mobile",
            ]}
            bestFor="First-time visitors and consumer buyers who orient by geography before deciding."
          >
            <DirectionA />
          </DirectionCard>

          <DirectionCard
            id="direction-b"
            eyebrow="Direction B"
            title="Numbered ranked list — list-only by default"
            premise="A single scannable list, numbered by distance, with two per-row CTAs — Location details and Set as my branch. Map is a toggle, not the default. Inspired by Raising Cane's + Chipotle: minimal chrome, maximum signal, keyboard-friendly."
            strengths={[
              "Fastest path for contractors who already know their branch",
              "One tap to commit — no separate Save step",
              "No map dependency — ships without a map integration",
              "Reads well down to phone width",
            ]}
            tradeoffs={[
              "No geographic context by default — some users want the map",
              "Numbering can look consumer-y for a distributor tone",
            ]}
            bestFor="Return contractors — the highest-frequency user cohort."
          >
            <DirectionB />
          </DirectionCard>

          <DirectionCard
            id="direction-c"
            eyebrow="Direction C"
            title="Product-aware inventory drawer"
            premise="The drawer is context-aware. Opened from a PDP, the product is pinned at top, tabs split Branch pickup vs Delivery, and each row shows real-time inventory + a per-row primary CTA (Pickup here). This is the current Watsco pattern, elevated — same component doubles as the plain store locator when no product is in scope."
            strengths={[
              "Two jobs in one component — no separate widgets to maintain",
              "Fewer clicks: commit + branch swap happens inline per row",
              "Inventory number is a first-class signal, not a footnote",
              "Delivery tab makes the fulfilment choice explicit",
            ]}
            tradeoffs={[
              "Density is higher — needs strict typographic hierarchy",
              "Header changes when product context is missing (extra layout state)",
            ]}
            bestFor="The Watsco pro pattern — buyers who open the drawer already knowing what they want to buy."
          >
            <DirectionC />
          </DirectionCard>
        </div>

        {/* Recommendation */}
        <section className="mt-10 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 p-6 dark:bg-emerald-950/20">
          <p className="text-xs font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
            Recommendation
          </p>
          <p className="mt-2 max-w-3xl text-sm">
            <strong className="text-foreground">Direction C</strong> as the
            base, with Direction B&apos;s numbered ranking and single-tap
            commit merged in. Add Direction A&apos;s map behind a{" "}
            <em>View on map</em> toggle for the consumer-adjacent surfaces
            (header entry point only). One component, one drawer, three
            modes:{" "}
            <span className="whitespace-nowrap">1) plain store locator</span>{" "}
            (opened from the header),{" "}
            <span className="whitespace-nowrap">
              2) product inventory drawer
            </span>{" "}
            (opened from a PDP or cart line),{" "}
            <span className="whitespace-nowrap">3) map view</span> (toggled
            from either).
          </p>
        </section>

        <p className="mt-10 text-xs text-muted-foreground">
          Reference set: Walmart · Raising Cane&apos;s · Chipotle · Sprint ·
          Ferguson · Homans (current).
        </p>
      </main>
    </div>
  );
}
