"use client";

import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pdps } from "./_lib/registry";
import type { PdpProduct } from "./_lib/types";
import { BRANDS } from "./_lib/brands";

/** Product Listing Page (PLP) entries — /search route rendered inside a brand's chrome. */
type PlpEntry = {
  brandKey: string;
  brand: string;
  title: string;
  query: string;
  pageSize?: number;
  sourceUrl: string;
};

const PLP_ENTRIES: PlpEntry[] = [
  {
    brandKey: "homans",
    brand: "Homans Associates",
    title: "Search Results — Blower Motor (Homans)",
    query: "blower motor",
    sourceUrl: "https://arrow-sw-homans.wsm.wsoecom.ninja/search?q=blower%20motor",
  },
  {
    brandKey: "peirce",
    brand: "Peirce-Phelps",
    title: "Search Results — Blower Motor (Peirce-Phelps)",
    query: "blower motor",
    pageSize: 18,
    sourceUrl: "https://www.peirce.com/search?q=blower+motor&page_size=18",
  },
  {
    brandKey: "ecmdi",
    brand: "East Coast Metal Distributors",
    title: "Search Results — Blower (ECMDI)",
    query: "blower",
    sourceUrl: "https://www.ecmdi.com/search?q=blower",
  },
];

function PlpCard({ p }: { p: PlpEntry }) {
  const b = BRANDS[p.brandKey];
  const params = new URLSearchParams({ q: p.query, brand: p.brandKey });
  if (p.pageSize) params.set("page_size", String(p.pageSize));
  const signedOutHref = `/search?${params.toString()}`;
  const signedInHref = `/search?${params.toString()}&signedin=1`;
  const routeLabel = `/search?q=${encodeURIComponent(p.query)}&brand=${p.brandKey}${p.pageSize ? `&page_size=${p.pageSize}` : ""}`;

  return (
    <li className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        {b ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: b.accent }}
            />
            <span className="text-sm font-semibold">{b.name}</span>
          </span>
        ) : null}
        <span className="text-sm text-muted-foreground">{p.brand}</span>
        <Badge className="px-2.5 py-0.5 font-semibold">Search Results</Badge>
      </div>
      <div className="mt-1 line-clamp-1 font-medium">{p.title}</div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">
        Query &ldquo;{p.query}&rdquo; · {routeLabel}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={signedOutHref} target="_blank" rel="noopener noreferrer">
            Signed Out
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={signedInHref} target="_blank" rel="noopener noreferrer">
            Signed In
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
      <a
        href={p.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={p.sourceUrl}
        className="mt-2 block truncate font-mono text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
      >
        ↗ reference: {p.sourceUrl.replace(/^https?:\/\/(www\.)?/, "")}
      </a>
    </li>
  );
}

// Business units we're actively designing the shared PDP content for.
const IN_SCOPE = ["ecmdi", "baker", "homans", "peirce"];

function TemplateCard({
  p,
  descoped = false,
  signedInOnly = false,
}: {
  p: PdpProduct;
  descoped?: boolean;
  signedInOnly?: boolean;
}) {
  const b = p.brandKey ? BRANDS[p.brandKey] : undefined;
  return (
    <li className={`rounded-xl border bg-card p-5 ${descoped ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        {b ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: b.accent }}
            />
            <span className="text-sm font-semibold">{b.name}</span>
          </span>
        ) : null}
        <span className="text-sm text-muted-foreground">{p.brand}</span>
        {p.useCase ? (
          <Badge className="px-2.5 py-0.5 font-semibold">{p.useCase}</Badge>
        ) : descoped ? (
          <Badge variant="soft" color="amber">Descoped</Badge>
        ) : (
          <Badge variant="outline" className="font-normal text-muted-foreground">
            {p.commerce?.price != null ? "priced + gated" : "gated"}
          </Badge>
        )}
      </div>
      <div className="mt-1 line-clamp-1 font-medium">{p.title}</div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">
        Item {p.item} · /pdp/{p.slug}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {signedInOnly ? null : (
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/pdp/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Signed Out
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        )}
        <Button asChild size="sm">
          <Link
            href={`/pdp/${p.slug}?signedin=1`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {signedInOnly ? "Open (Signed In)" : "Signed In"}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
      {p.sourceUrl ? (
        <a
          href={p.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={p.sourceUrl}
          className="mt-2 block truncate font-mono text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
        >
          ↗ reference: {p.sourceUrl.replace(/^https?:\/\/(www\.)?/, "")}
        </a>
      ) : null}
    </li>
  );
}

/* ── Change log — grouped by review date. Each date is its own collapsible
   folder; the newest sits open at the top, older dates collapse below. New
   work lands in a new dated folder (newest first). */
type ChangeItem = {
  title: string;
  /** One-line lead describing the edit. */
  desc: string;
  /** Optional explicit list of what changed — rendered as bullets. */
  bullets?: string[];
  links: { label: string; href: string }[];
};
type ChangeLog = { id: string; badge: string; title: string; items: ChangeItem[] };

const CHANGE_LOGS: ChangeLog[] = [
  {
    id: "oct-28",
    badge: "Oct 28",
    title: "New edits since the Oct 28 meeting",
    items: [
      {
        title: "Dashboard — Account Balances as cards + Pay Bill",
        desc: "Changed the Account Balances block on the dashboard:",
        bullets: [
          "Replaced the balances table with one card per account (Account #, nickname, balance, credit limit).",
          "Each card shows a utilization meter + % pill, coloured under 50% green / 50–80% amber / over 80% red.",
          "Added a “Pay Bill” button at the top of the section, in the edit-button style.",
        ],
        links: [
          { label: "Dashboard — Account Balances", href: "/dashboard?signedin=1" },
        ],
      },
      {
        title: "Homans header — search widened, actions pinned right",
        desc: "Adjusted the Homans top bar:",
        bullets: [
          "The search field now stretches to fill the empty space in the bar.",
          "Lists · My Account · Cart are pinned to the far-right edge (the floating gap is gone).",
        ],
        links: [
          { label: "Homans header (on the PLP)", href: "/search?brand=homans&q=blower%20motor&signedin=1" },
        ],
      },
      {
        title: "Cart — Save / Share relocated; Backorder removed",
        desc: "Two edits on the cart page:",
        bullets: [
          "Moved Save Cart / Share Cart up to the “Cart” title row (right-aligned), out of the Order Summary header.",
          "Removed the red Backorder banner (the yellow Nearby-branches notice stays).",
        ],
        links: [
          { label: "Cart", href: "/cart?demo=1" },
        ],
      },
      {
        title: "East Coast Metal — home content + brand carousel",
        desc: "Filled in the ECM home with the real ecmdi.com content:",
        bullets: [
          "“Premium Tools For Fast Ordering” — the 4 cards now have their icon, description, and Learn More.",
          "The two boxes below — “Check Out Our Blog” (Read Now) and “Grow Your Skillset” (Start Learning) — filled with verbatim copy + CTA.",
          "Brands We Trust is now a seamless, no-gap logo carousel of the 25 manufacturer logos.",
        ],
        links: [
          { label: "East Coast Metal — Home", href: "/home/ecmdi?signedin=1" },
        ],
      },
      {
        title: "Peirce-Phelps — service copy/CTAs + 4-up categories",
        desc: "Two edits on the Peirce home:",
        bullets: [
          "Added the description and CTA to all 6 “Our Services” cards (OnCall Air → Boost a Proposal, Housecall Pro → Run Your Business Better, Amply → Explore Amply, Wingman → See How It Works, AHRI System Builder → Build a System, FlashClaim → Start a Claim).",
          "Featured Categories now lay out 4 across (4 on top, 4 on bottom).",
        ],
        links: [
          { label: "Peirce-Phelps — Home", href: "/home/peirce?signedin=1" },
        ],
      },
      {
        title: "PDP — Specifications filter, inset",
        desc: "Wrapped the Specifications filter in a padded grey box so the search reads as its own inset element instead of blending into the tabs above and the spec table below. (Open the Specifications tab.)",
        links: [
          { label: "PDP — Specifications", href: "/pdp/uc-ahri-matched-system?signedin=1" },
        ],
      },
    ],
  },
  {
    id: "oct-20",
    badge: "Oct 20",
    title: "New edits since the Oct 20 meeting",
    items: [
      {
        title: "Category “Jump” page (Residential)",
        desc: "The page a top-level category links to (Ryan’s “jump” page): a banner + a grid of category tiles that forces a subcategory choice before any product grid (Walmart /cp/electronics pattern), with light merchandising below — top sellers, buyer’s guides, brands — never a filterable results grid first. Built from reusable, design-system-only CMS blocks; transparent product tiles, DS-token promo tiles, real brand logos, and generated buyer’s-guide photos.",
        links: [
          { label: "Jump page (Residential)", href: "/category/residential?v=jump&signedin=1" },
          { label: "Category Landing — CMS block catalog", href: "/components/category-landing" },
        ],
      },
      {
        title: "Home reskins — Peirce & East Coast Metal",
        desc: "A clone-bones reskin of two distributor home pages: each site's content and structure kept, re-rendered on our design system using the Category Landing CMS blocks (hero, specials, category tiles, service cards, two-up content, brand tiles, partner CTA) inside that brand's own chrome, so both read as one system. Source brand art and third-party manufacturer logos dropped for our tokens + image pool.",
        links: [
          { label: "Peirce-Phelps — Home (reskin)", href: "/home/peirce?signedin=1" },
          { label: "East Coast Metal — Home (reskin)", href: "/home/ecmdi?signedin=1" },
        ],
      },
      {
        title: "PDP — Specifications tab, reorganized",
        desc: "Reworked the Specifications tab to be scannable: each row is a tinted key column + value column (one coloured rail down the left), group cards flow into two columns (flat lists split into two balanced columns) so the table fills the width instead of stretching one row edge to edge, and the filter is a full-width design-system input that actually filters rows. Renders in the new tab layout; design-system tokens throughout. Open the Specifications tab.",
        links: [
          { label: "PDP — Specifications (new layout)", href: "/pdp/uc-ahri-matched-system?signedin=1" },
        ],
      },
      {
        title: "Mini cart — layouts (V1 / V2) + design-system cleanup",
        desc: "The mini-cart drawer in two layouts, opened in context on a PDP. V1: View Cart + Checkout side by side (Checkout right), with Save Cart | Share Cart as a full-width band right under the header. V2: same side-by-side buttons, with Save / Share moved into the header, left of the close. Shared cleanup: Save / Share now use the design-system Button (foreground, not grey) like Create Proposal; dropped the “You may also need” cross-sell on V1/V2; tightened the top and footer spacing.",
        links: [
          { label: "Mini Cart V1 (on a PDP)", href: "/pdp/tradepro-tp-ec13-50?cart=demo&cartv=1&signedin=1" },
          { label: "Mini Cart V2 (on a PDP)", href: "/pdp/tradepro-tp-ec13-50?cart=demo&cartv=2&signedin=1" },
        ],
      },
      {
        title: "Cart — Order Summary to match V2 (two versions)",
        desc: "Carried the V2 mini-cart funnel into the full cart’s Order Summary: Proceed to Checkout stays the one primary, Create Proposal is a DS tertiary button, and Save / Share are quiet ghost buttons. Widened the summary, added a Promo Code row (muted-blue Apply), matched the totals exactly (Subtotal · Tax (0%) $0.00 with the “final tax at checkout” note · Total, one line under Total), dropped the “review fulfillment” note, and added the SimpleProposal “quickly create” copy. Two placements for Save / Share: V1 inline in the header, V2 as a full-width band under the header.",
        links: [
          { label: "Cart V1 (Save/Share in header)", href: "/cart?demo=1" },
          { label: "Cart V2 (Save/Share band under header)", href: "/cart?demo=1&summary=2" },
        ],
      },
      {
        title: "Homans header — reorg pass",
        desc: "Flattened the “Your Branch” selector (no filled box) to two lines — “Your Branch · Open now” over the branch name. Narrowed the search and opened up the spacing across the top bar. Moved Quick Order into the More Tools dropdown, removed Services and Find a Local Dealer from the nav, and pinned Warranty Center + Help & Support (with icons) to the right of the dark nav bar.",
        links: [
          { label: "Homans header (on the PLP)", href: "/search?brand=homans&q=blower%20motor&signedin=1" },
        ],
      },
      {
        title: "Dashboard — lighter charcoal nav + Find-an-Order shadow",
        desc: "The V2 side nav is now a medium grey (#6e6e6e) — the lightest neutral grey that still clears WCAG AA with white text — instead of the near-black panel; all nav text is white, active row is a white pill. Also matched the Find-an-Order filter card’s shadow to the other dashboard cards (it was heavier than the rest).",
        links: [
          { label: "Default Nav", href: "/dashboard?signedin=1" },
          { label: "Grey Nav (V2)", href: "/dashboard/nav-charcoal?signedin=1" },
        ],
      },
      {
        title: "Checkout — fulfillment messages (global + secondary)",
        desc: "Two message slots on the Checkout v2 fulfillment step: a global message above the Pickup / Delivery toggle (e.g. a backordered-item warning) and a secondary message directly under the toggle (e.g. CSR-handled shipping / availability notice). Sample screens for each, plus an all-in-one view for dev handoff.",
        links: [
          { label: "All 3 messages (dev handoff)", href: "/checkout/v2?demo=1&fmsg=all" },
          { label: "Global message (above toggle)", href: "/checkout/v2?demo=1&fmsg=global" },
          { label: "Secondary message (under toggle)", href: "/checkout/v2?demo=1&fmsg=secondary" },
          { label: "On delivery-date click (Delivery tab)", href: "/checkout/v2?demo=1&fmsg=date" },
        ],
      },
    ],
  },
  {
    id: "oct-9",
    badge: "Oct 9",
    title: "New edits since the Oct 9 meeting",
    items: [
      {
        title: "Mini cart — V2 (re-ranked actions)",
        desc: "Re-ranked the mini-cart actions to the purchase funnel Watsco called out: Checkout is the one solid primary, View Cart is secondary, Create Proposal sits a tier down, and Save Cart / Share Cart become quiet links. The footer stays sticky while the items scroll. Shown pulled out on a live PDP, plus a standalone panel view.",
        links: [
          { label: "Mini Cart V2 (on a PDP)", href: "/pdp/tradepro-tp-ec13-50?cart=demo&signedin=1" },
          { label: "Mini Cart V2 (panel)", href: "/cart/mini-cart-v2" },
        ],
      },
      {
        title: "Category impact designs — V1",
        desc: "A category experience in parts. The “Jump” page is what a top-level category (e.g. Residential) links to: a banner + a grid of category tiles that forces a subcategory choice before any product grid (Walmart /cp/electronics pattern), with light merchandising below — top sellers, buyer’s guides, brands — never a filterable results grid first. Selecting a tile opens the merchandised category landing (promo carousel, product rows, a system bundle, promo banners), shown here for Air Conditioners in V1 and an Autumn V2.",
        links: [
          { label: "Jump page (Residential) — pick a category first", href: "/category/residential?v=jump&signedin=1" },
          { label: "Category Scroller (Residential)", href: "/search?brand=homans&category=residential&signedin=1" },
          { label: "Category Landing V1 (Air Conditioners)", href: "/category/air-conditioners?signedin=1" },
          { label: "Category Landing V2 — Autumn (Air Conditioners)", href: "/category/air-conditioners?v=2&signedin=1" },
        ],
      },
      {
        title: "Homans header & nav — rebuilt on the new menu",
        desc: "Reorganized the Homans top nav to its real structure (Products · Brands · Services · Find a Local Dealer · Resources · More Tools · Training & Events · Specials). Products opens the new nested category menu driven by the real Homans taxonomy (10 categories + first sub); Brands, Resources and More Tools use our point-dropdown menus and only one opens at a time; Specials is a highlighted link that sits right after Training & Events. Added a prominent bordered “Your Branch” selector, moved Quick Order to a signed-in icon, dropped the skinny utility strip, and removed the mobile-app nav. Shown on the PLP where the menus live.",
        links: [
          { label: "Homans PLP (header & menus)", href: "/search?brand=homans&q=blower%20motor&signedin=1" },
        ],
      },
      {
        title: "Dashboard sidebar nav — consistent headers + charcoal variant",
        desc: "Every top-level section header (Dashboard · Buying Tools · Quotes · Orders · Account · Company) now shares one bold treatment for a clear hierarchy. Added a second navigation style — the side nav reversed out on a charcoal panel (white text + icons, AA-compliant) — to make the nav stand out.",
        links: [
          { label: "Default Nav", href: "/dashboard?signedin=1" },
          { label: "Charcoal Nav (V2)", href: "/dashboard/nav-charcoal?signedin=1" },
        ],
      },
      {
        title: "Account tables — one consistent action pattern",
        desc: "Every account table now uses the shared RowAction pattern: an icon beside each label, primary actions in blue and Remove / Delete in black, View replaces the ⋮ overflow, and delete opens the detail drawer instead of destroying a row. Table headers sit on a darker, larger grey bar with tighter tab padding.",
        links: [
          { label: "Shopping Lists", href: "/dashboard/shopping-lists?signedin=1" },
          { label: "Saved Carts", href: "/dashboard/saved-carts?signedin=1" },
          { label: "Orders", href: "/dashboard/orders?signedin=1" },
        ],
      },
      {
        title: "Account search — Address Book & Card Management",
        desc: "Added the shared search toolbar (AccountTableToolbar) to Address Book and Card Management so both filter in place like the rest of the account tables.",
        links: [
          { label: "Address Book", href: "/dashboard/addresses?signedin=1" },
          { label: "Card Management", href: "/dashboard/card-management?signedin=1" },
        ],
      },
      {
        title: "Company Users — last login, devices & detail drawer",
        desc: "Company Users now shows a Last Login column and each user’s authorized devices, with a read-only view drawer; the tab panels are force-mounted so the drawer’s controls stay reachable.",
        links: [{ label: "Company Users", href: "/dashboard/company-users?signedin=1" }],
      },
      {
        title: "Dashboard — simpler filter + focusable scroll regions",
        desc: "Slimmed the Find-an-Order filter and reduced its depth on the dashboard, and made the scrollable regions keyboard-focusable so they’re reachable without a mouse.",
        links: [{ label: "Dashboard", href: "/dashboard?signedin=1" }],
      },
      {
        title: "Shopping list detail — redesigned header card, drawers & collapsible replacements",
        desc: "The top is now its own card — the list name with an inline edit pencil beside it, Manage Permissions + Add to Cart on the right, and the created / type / count / total meta below. The replacements banner collapses. Bulk actions read Add to Cart / Move / Copy / Remove; Move and Copy open a “Select Product List” drawer, Manage Permissions opens a Permissions drawer, and Add / Move / Copy / Remove each confirm with a toast. The search toolbar now matches the Shopping Lists index.",
        links: [
          { label: "Shopping List Detail", href: "/dashboard/shopping-lists/hvac-maintenance-kit?signedin=1" },
        ],
      },
      {
        title: "Title Case — every button & link, app-wide",
        desc: "All clickable control labels are now Title Case (Add to Cart, Move, Copy, View Substitutes, …), swept across the whole app and documented as a rule on the Button component sheet so pages stay connected to the design system.",
        links: [{ label: "Button (design system)", href: "/components/button" }],
      },
      {
        title: "Accessibility — WCAG AA pass",
        desc: "Darkened the link blue, in-stock green, muted text, and table-header text so they clear AA contrast on the real page background and on tinted fills; gave every search filter control an accessible name; fixed the page titles; and moved the colour-swatch labels off the saturated tiles. Audited with axe across the app.",
        links: [{ label: "Color & Tokens", href: "/components/colors" }],
      },
    ],
  },
  {
    id: "oct-2",
    badge: "Oct 2",
    title: "New edits (Oct 2 – Oct 8)",
    items: [
      {
        title: "PDP About tabs — Specifications & Part List icons",
        desc: "Restored the decided tab icons on the product's About This Product section: Specifications now uses a gauge and Part List a gear, so neither reads like Description.",
        links: [{ label: "PDP (About Tabs)", href: "/pdp/uc-tabs-accordions?signedin=1" }],
      },
      {
        title: "Account Dashboard — full reimagine + grouped nav",
        desc: "Every dashboard section rebuilt on one pattern — a shared table + Find-an-Order filter, right-side drawers for detail and edit, primary CTAs on the right, colored status pills, and real pagination. The sidebar is now grouped (Buying Tools · Orders · Account · Company) to match the storefront. Review links to every page below.",
        links: [
          { label: "Dashboard", href: "/dashboard?signedin=1" },
          { label: "Orders", href: "/dashboard/orders?signedin=1" },
          { label: "Shopping Lists", href: "/dashboard/shopping-lists?signedin=1" },
          { label: "Saved Carts", href: "/dashboard/saved-carts?signedin=1" },
          { label: "Quotes", href: "/dashboard/quotes?signedin=1" },
          { label: "Address Book", href: "/dashboard/addresses?signedin=1" },
          { label: "Card Management", href: "/dashboard/card-management?signedin=1" },
        ],
      },
      {
        title: "New sections — Order Approval, Proposals & Company",
        desc: "Added the sections the reference has but we didn't: Order Approval (status tabs + approval rules), Proposals, and the whole Company group — Linked Accounts, Company Users, and Roles & Permissions (permission matrix matched to the reference).",
        links: [
          { label: "Order Approval", href: "/dashboard/pending-orders?signedin=1" },
          { label: "Proposals", href: "/dashboard/proposals?signedin=1" },
          { label: "Linked Accounts", href: "/dashboard/linked-accounts?signedin=1" },
          { label: "Company Users", href: "/dashboard/company-users?signedin=1" },
          { label: "Roles & Permissions", href: "/dashboard/roles?signedin=1" },
        ],
      },
      {
        title: "List Views — every pattern shown live",
        desc: "The List Views reference renders each list variant live (one row each) on the shared design-system stock component — PLP, cart, checkout review, and the shopping-list table.",
        links: [{ label: "List Views", href: "/components/list-views" }],
      },
      {
        title: "Shopping list detail — availability, replacements & bulk actions",
        desc: "Availability now matches the product card everywhere — green “N in {branch}” + a blue “N Nearby Branch” link (fixed in the shared InventoryLine, so every list view updates together). Items with a replacement show only in the yellow banner, not twice in the table. Bulk actions (Add selected · Move · Copy · Remove) are grouped next to Select all, with Export CSV on the far right. Header carries Edit · Manage permissions · Add all to cart, and the meta row shows the Updated date.",
        links: [
          { label: "Shopping List (with Replacements)", href: "/dashboard/shopping-lists/hvac-maintenance-kit?signedin=1" },
          { label: "All Shopping Lists", href: "/dashboard/shopping-lists?signedin=1" },
        ],
      },
      {
        title: "Search results (PLP) — List view + availability nav",
        desc: "List view is now a full-width horizontal list on the shared row pattern with DS Add-to-Cart buttons; a PLP v2 adds a checkbox “Shop By Availability” filter (Pick Up Today / All Stores) in our grey-box treatment.",
        links: [
          { label: "PLP (Grid/List)", href: "/search?q=blower%20motor&signedin=1" },
          { label: "PLP v2 — Availability Checkboxes", href: "/search/plp-v2?signedin=1" },
        ],
      },
    ],
  },
  {
    id: "earlier",
    badge: "Earlier",
    title: "Before Oct 2 — baseline, kept for reference",
    items: [
      {
        title: "Checkout v3 — everything open",
        desc: "All sections open on one page (no accordion, no per-section buttons); the Order Summary CTA is “Review Order”, and Review is its own page reusing the v1 review layout without the progress bar.",
        links: [
          { label: "Checkout v3", href: "/checkout/v3?demo=1" },
          { label: "Review page", href: "/checkout/v3/review?demo=1" },
        ],
      },
      {
        title: "Cart & Checkout — mobile pass",
        desc: "Sticky bottom CTAs, no inner-scroll lists, slimmer saved-card tiles, responsive item rows, and step auto-scroll — across both the horizontal (v1) and accordion (v2) flows.",
        links: [
          { label: "Cart", href: "/cart?demo=1" },
          { label: "Checkout v1", href: "/checkout?demo=1" },
          { label: "Checkout v2", href: "/checkout/v2?demo=1" },
        ],
      },
      {
        title: "Homans “Contact Us” — Limited Availability message",
        desc: "The buy box and PLP cards now show “Limited Availability / Let us help you find this product / Contact Us” instead of a bare Contact Us link.",
        links: [
          { label: "PDP", href: "/pdp/homans-contact-us?signedin=1" },
          { label: "PLP", href: "/search/homans-contact-us?signedin=1" },
        ],
      },
      {
        title: "Tab styles — Style 2 + icons",
        desc: "Style 2 active segment is now a soft, AA-accessible light blue; Specifications uses a gauge icon and Part List a gear icon so they no longer read like Description.",
        links: [{ label: "Tab Styles", href: "/pdp/about-variants" }],
      },
      {
        title: "Search — “Change” store link",
        desc: "The “Change” link now lines up with the store name and sits directly under the currently selected store, in both the radio and checkbox availability variants.",
        links: [{ label: "Search (PLP)", href: "/search?q=blower%20motor&signedin=1" }],
      },
      {
        title: "Header & search refinements",
        desc: "Mega-menu column header (section name left, View all right, rule under), account panel actions (Change account primary, stacked), and tighter search-sidebar spacing.",
        links: [{ label: "Open PLP", href: "/search?q=blower%20motor&signedin=1" }],
      },
    ],
  },
];

export default function PdpMasterPage() {
  // Glasfloss (Gemaire) is a placeholder-image example — hidden from the master.
  // AHRI is out of scope for this review — its PDP is excluded everywhere.
  const templates = pdps.filter(
    (p) => p.slug !== "glasfloss-zlp17h211" && p.slug !== "uc-ahri-matched-system",
  );
  const tabsAccordionsSlugs = ["uc-tabs-accordions"];
  const tabsAccordions = templates.filter((p) =>
    tabsAccordionsSlugs.includes(p.slug),
  );
  const useCases = templates.filter(
    (p) => p.useCase && !tabsAccordionsSlugs.includes(p.slug),
  );
  const rest = templates.filter(
    (p) =>
      p.slug !== "ecmdi-pro-flush-v2" &&
      !p.useCase &&
      !tabsAccordionsSlugs.includes(p.slug),
  );
  const inScope = rest
    .filter((p) => IN_SCOPE.includes(p.brandKey ?? ""))
    .sort(
      (a, b) => IN_SCOPE.indexOf(a.brandKey ?? "") - IN_SCOPE.indexOf(b.brandKey ?? "")
    );
  const descoped = rest.filter((p) => !IN_SCOPE.includes(p.brandKey ?? ""));

  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Watsco Design Templates</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              One data-driven template · {inScope.length} in-scope business units,
              each rendered inside its own header / footer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                Account Section
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild>
              <Link
                href="/search?q=blower%20motor&signedin=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open PLP
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href="/components"
                target="_blank"
                rel="noopener noreferrer"
              >
                Components
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <a
                href="https://github.com/uxokdc2025/watscobuild"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
              >
                <Github className="size-3.5" />
                GitHub
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* ── Today's changes — dated, at-a-glance review list. New work lands
            here at the top; everything else lives in the sections below. ── */}
        <section
          aria-labelledby="todays-changes"
          className="mt-8 rounded-xl border-2 border-primary/30 bg-primary/[0.04] p-5"
        >
          <h2 id="todays-changes" className="text-lg font-bold tracking-tight">
            Change log
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Grouped by meeting — each card is dated to a meeting and holds the new edits made since it. The latest (Oct 28) is open; earlier meetings are collapsed. Click any link to open that change.
          </p>
          <Accordion
            type="multiple"
            defaultValue={CHANGE_LOGS.length > 0 ? [CHANGE_LOGS[0].id] : []}
            className="mt-4 flex flex-col gap-3"
          >
            {CHANGE_LOGS.map((log) => (
              <AccordionItem
                key={log.id}
                value={log.id}
                className="rounded-lg border bg-card px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left">
                    <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                      {log.badge}
                    </Badge>
                    <span className="text-sm font-semibold">{log.title}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      · {log.items.length} change{log.items.length === 1 ? "" : "s"}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-3 pb-2">
                    {log.items.map((c) => (
                      <li key={c.title} className="rounded-lg border bg-background p-4">
                        <p className="font-semibold">{c.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{c.desc}</p>
                        {c.bullets ? (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-primary">
                            {c.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {c.links.map((l) => (
                            <Button key={l.href} asChild variant="outline" size="sm">
                              <Link href={l.href} target="_blank" rel="noopener noreferrer">
                                {l.label}
                                <ArrowUpRight className="size-3.5" />
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Everything below is prior work, organized by area. Each section is
            its own accordion panel; all panels start collapsed to keep the
            review focused on Today's Changes above. */}
        <Accordion
          type="multiple"
          defaultValue={[]}
          className="mt-8 flex flex-col gap-3"
        >
          <AccordionItem
            value="in-scope"
            className="rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Product Details Page
                </Badge>
                <span className="text-lg font-bold tracking-tight">
                  Baseline ({inScope.length})
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-3 pb-2">
                {inScope.map((p) => (
                  <TemplateCard key={p.slug} p={p} />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {useCases.length ? (
            <AccordionItem
              value="use-cases"
              id="use-cases"
              className="scroll-mt-6 rounded-xl border bg-card px-5"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3">
                  <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                    Product Details Page
                  </Badge>
                  <span className="text-lg font-bold tracking-tight">
                    Content Patterns &amp; Badges ({useCases.length})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  One PDP per pattern — each demonstrates a specific state or badge
                  (Replacement, pack size, bundle &amp; rebate, points,
                  non-sellable, requires-license, strike-thru pricing). Open
                  ours (signed in) next to the{" "}
                  <span className="font-medium text-foreground">reference</span> link
                  to compare.
                </p>
                <ul className="mt-4 flex flex-col gap-3 pb-2">
                  {useCases.map((p) => (
                    <TemplateCard key={p.slug} p={p} signedInOnly />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          {tabsAccordions.length ? (
            <AccordionItem
              value="tabs-accordions"
              id="tabs-accordions"
              className="scroll-mt-6 rounded-xl border bg-card px-5"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3">
                  <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                    Product Details Page
                  </Badge>
                  <span className="text-lg font-bold tracking-tight">
                    Tabs &amp; Accordions ({tabsAccordions.length})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-3 pb-2">
                  {tabsAccordions.map((p) => (
                    <TemplateCard key={p.slug} p={p} signedInOnly />
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center gap-2 pb-2">
                  <Button asChild>
                    <Link
                      href="/pdp/about-variants"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      About This Product — Tab Styles (Client Review)
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      href="/pdp/about-accordion-variants"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      About This Product — Accordion Styles (Client Review)
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          <AccordionItem
            value="store-locator"
            id="store-locator"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Shared Component
                </Badge>
                <span className="text-lg font-bold tracking-tight">
                  Store Locator + Inventory Drawer
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Two related components, three directions each. Store Locator
                slides in from the LEFT (branch selection). Inventory Drawer
                slides in from the RIGHT (per-branch stock for one product) —
                surfaces from a PDP&apos;s Nearby Branches link or a PLP card.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button asChild>
                  <Link
                    href="/store-locator"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Store Locator + Inventory Drawer
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="account-menus"
            id="account-menus"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Shared Component
                </Badge>
                <span className="text-lg font-bold tracking-tight">
                  Account Menus — v1 vs v2
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="max-w-2xl text-sm text-muted-foreground">
                A choice for the account menus: the current flat lists (v1), or a
                nested version (v2) that groups Shopping Lists + Saved Carts under a
                single <span className="font-medium text-foreground">Buying Tools</span>{" "}
                parent — like the live Homans site. The account fly-out and the dashboard
                sidebar are each shown current next to nested.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button asChild>
                  <Link
                    href="/components/account-menus"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Account Menus Comparison
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="plp"
            id="plp"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Product Listing Page
                </Badge>
                <span className="text-lg font-bold tracking-tight">
                  Search Results (PLP) ({PLP_ENTRIES.length})
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-3 pb-2">
                {PLP_ENTRIES.map((p) => (
                  <PlpCard key={p.brandKey} p={p} />
                ))}
              </ul>
              <div className="pb-2">
                <Button asChild size="sm">
                  <Link href="/search/plp-v2?signedin=1" target="_blank" rel="noopener noreferrer">
                    PLP v2 — Checkbox Availability
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="homans-contact-us"
            id="homans-contact-us"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <Badge className="px-3 py-1 font-bold tracking-wide uppercase">
                  Homans
                </Badge>
                <span className="text-lg font-bold tracking-tight">
                  Out-of-stock → Contact Us (Homans)
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Homans never shows out-of-stock — a zero-availability product
                renders a simple{" "}
                <span className="font-medium text-foreground">Contact Us</span>{" "}
                link instead of branch-availability zeros or any
                &ldquo;out of stock&rdquo; wording. Price, Quantity, Add to
                Cart, and Add to List stay exactly as-is.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 pb-2">
                <Button asChild>
                  <Link
                    href="/pdp/homans-contact-us?signedin=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Homans PDP (Signed In)
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="/search/homans-contact-us?signedin=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Homans PLP (Signed In)
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link
                    href="/search/homans-contact-us-v2?signedin=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PLP (Multi-Result Example)
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="checkout"
            id="checkout"
            className="scroll-mt-6 rounded-xl border bg-card px-5"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="text-lg font-bold tracking-tight">Cart and Checkout Flow</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-3 pb-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/checkout?demo=1">
                    Checkout
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/checkout/v2?demo=1">
                    Checkout — Progressive (v2)
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/checkout/v3?demo=1">
                    Checkout v3 — Everything Open
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/cart?demo=1">
                    Cart
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {descoped.length ? (
            <AccordionItem
              value="descoped"
              className="rounded-xl border bg-card px-5"
            >
              <AccordionTrigger className="text-sm font-semibold tracking-wide text-muted-foreground uppercase hover:no-underline">
                Descoped · Building Independently ({descoped.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-3 pb-2">
                  {descoped.map((p) => (
                    <TemplateCard key={p.slug} p={p} descoped />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : null}
        </Accordion>

        {/* Project footer — persistent credits + provenance. Kept terse so
            the review page ends with signal, not chrome. */}
        <footer className="mt-16 border-t pt-8 pb-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-semibold text-foreground">
                Watsco Prototype
              </p>
              <p className="mt-1">
                Started July 23, 2026 · Design-system prototype for the Watsco
                distributor storefronts.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs sm:text-sm">
              <dt className="font-semibold text-foreground">Client</dt>
              <dd>Ryan · Watsco</dd>
              <dt className="font-semibold text-foreground">UX Designer</dt>
              <dd>David Cervantes</dd>
              <dt className="font-semibold text-foreground">Stack</dt>
              <dd>Next.js 15 · React 19 · Tailwind v4 · shadcn</dd>
              <dt className="font-semibold text-foreground">Source</dt>
              <dd>
                <a
                  href="https://github.com/uxokdc2025/watscobuild"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  github.com/uxokdc2025/watscobuild
                </a>
              </dd>
            </dl>
          </div>
          <p className="mt-6 text-xs">
            Prototype · not for production. Product data is representative,
            not live inventory.
          </p>
        </footer>
      </main>
    </div>
  );
}
