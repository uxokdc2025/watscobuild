"use client";

import {
  ChevronDown,
  ClipboardList,
  Facebook,
  Home,
  Linkedin,
  Lock,
  Twitter,
  Wrench,
  Youtube,
  Zap,
} from "lucide-react";
import * as React from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { AccountFlyout, CartTrigger, CheckoutCartTrigger } from "./account-flyout";
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import { MegaMenu } from "@/components/ui/mega-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

/**
 * ONE unified storefront chrome for all Watsco distributor brands.
 *
 * The whole point of the design system: a single, consistent header + footer.
 * A brand differs ONLY by its COLOR (the `--brand-<key>` tokens in globals.css,
 * surfaced here as `barClass` / `navClass`) and its LOGO (harvested from each
 * brand's original chrome). Everything else — layout, spacing, controls,
 * interaction, accessibility — is identical across every brand.
 *
 * Design rules baked in here:
 *  - Filled hover on every interactive header control
 *    (`rounded-md px-2 py-1 transition-colors hover:bg-white/10 hover:no-underline`) — never an
 *    underline. Underline is reserved for real inline text links (the footer
 *    legal/column links may underline on hover; header controls never do).
 *  - Brand color ONLY via the token classes in BRAND_THEME — never a hex.
 *  - Landmarks: <header> / <nav aria-label>, aria-labels on icon-only controls,
 *    ≥44px tap targets, visible keyboard focus, mobile-first responsive.
 */
export type FooterColumn = { title: string; links: string[] };

export type BrandChrome = {
  key: string;
  /** Display name / wordmark text. */
  name: string;
  /** Approximate brand accent (kept for callers; chrome uses tokens, not this). */
  accent: string;
  phone?: string;
  /** The brand's own "home" branch (label incl. city/state + store number),
   *  shown in the header store pill when signed in. Region-correct per brand —
   *  never another brand's store — and, for brands with a checkout profile,
   *  matches that profile's current branch so header and checkout agree. */
  defaultBranch: string;
  nav: string[];
  footerColumns: FooterColumn[];
  copyright: string;
  /** Whether this BU's real site has the "Compare" product feature. */
  hasCompare?: boolean;
};

/* ════════════════════════════════════════════════════════════════════════
   BRAND_THEME — the ONLY thing that varies between brands.
   `logo`     harvested logo URL, or null → render the text `wordmark`.
   `barClass` main bar surface (brand color token) — bg + foreground.
   `navClass` category-nav surface. Only Homans ships a distinct nav token
              (--brand-homans-nav); every other brand falls back to a subtle
              darker shade of its bar (`bg-black/10`) for the nav strip.
   ════════════════════════════════════════════════════════════════════════ */

type BrandTheme = {
  logo: string | null;
  wordmark: string;
  barClass: string;
  navClass: string;
  /** Logo is a dark asset made for a white bar — set on a white chip so it reads
   *  on the brand-colored bar. */
  logoChip?: boolean;
  /** Brands whose real identity is a styled wordmark/monogram (not a plain
   *  asset or text): rendered in place of the logo/wordmark text. */
  Mark?: ComponentType<{ className?: string }>;
};

/* ── Brand wordmark/monogram components (recovered from per-brand headers) ── */
function CeMonogram({ className }: { className?: string }) {
  // Real Carrier Enterprise CE mark (inline SVG from the live site). Uses
  // currentColor so it inherits the brand bar's white foreground.
  return (
    <svg
      viewBox="0 0 40 30"
      className={cn("h-8 w-auto", className)}
      role="img"
      aria-label="Carrier Enterprise home"
    >
      <g fill="currentColor" fillRule="evenodd">
        <path d="M28.498 14.243h-5.035c-.597-.81-1.308-1.417-2.133-1.822s-1.763-.608-2.813-.608c-.849 0-1.654.16-2.416.478a6.045 6.045 0 0 0-2.025 1.388 6.782 6.782 0 0 0-1.453 2.206 6.7 6.7 0 0 0-.515 2.567c0 1.93.62 3.547 1.86 4.854 1.239 1.306 2.755 1.959 4.549 1.959 1.032 0 1.96-.193 2.784-.578a4.954 4.954 0 0 0 2.004-1.678h5.048c-.984 2.15-2.295 3.766-3.935 4.845-1.64 1.08-3.597 1.62-5.872 1.62-1.582 0-3.04-.303-4.376-.91-1.336-.609-2.534-1.51-3.594-2.706a10.264 10.264 0 0 1-2.04-3.391c-.463-1.268-.694-2.626-.694-4.072 0-1.466.28-2.857.839-4.173.559-1.317 1.379-2.515 2.46-3.595 1.02-1.003 2.156-1.762 3.405-2.278 1.249-.516 2.592-.774 4.029-.774 2.304 0 4.274.55 5.908 1.65 1.635 1.099 2.973 2.772 4.015 5.018M39.369 29.475h-9.534V11.813h9.534v3.106h-6.114v4.027h6.114v3.057h-6.114v4.367h6.114v3.105" />
        <path d="m33.653 7.717-.007.004a18.464 18.464 0 0 0-6.034-5.372l-.97-.502A18.644 18.644 0 0 0 18.752 0l-1.038.018c-2.398.11-4.816.69-7.12 1.788C2.824 5.504-1.195 13.896.312 21.971l.227 1.045a18.68 18.68 0 0 0 1.267 3.539 18.67 18.67 0 0 0 2.124 3.444L6.79 30l.975-2.677a13.949 13.949 0 0 1-1.745-2.774 13.933 13.933 0 0 1-.949-2.65l-.17-.783C3.773 15.071 6.783 8.788 12.598 6.02a13.861 13.861 0 0 1 5.332-1.34l.777-.013c2.066.021 4.095.504 5.937 1.396l.697.363a13.833 13.833 0 0 1 4.488 3.98h2.85l.974-2.677-.004-.004.004-.008" />
      </g>
    </svg>
  );
}

function EcmdiWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("leading-none", className)} aria-label="East Coast Metal Distributors">
      <span className="block text-lg font-black tracking-tight italic">East Coast</span>
      <span className="block text-[9px] font-semibold tracking-[0.25em]">
        METAL DISTRIBUTORS
      </span>
    </span>
  );
}

const BRAND_THEME: Record<string, BrandTheme> = {
  gemaire: {
    logo: "https://www.gemaire.com/static/version1784840842/frontend/Gemaire/base/en_US/images/gemaire-logo-header-small.svg",
    wordmark: "Gemaire",
    barClass: "bg-brand-gemaire text-brand-gemaire-foreground",
    navClass: "bg-brand-gemaire text-brand-gemaire-foreground border-t border-white/15",
  },
  baker: {
    logo: "https://www.bakerdist.com/static/version1783616181/frontend/Baker/base/en_US/images/logo.svg",
    wordmark: "Baker Distributing",
    barClass: "bg-brand-baker text-brand-baker-foreground",
    navClass: "bg-brand-baker text-brand-baker-foreground border-t border-white/15",
  },
  carrier: {
    // Live CE site renders an inline wordmark/monogram (no stable asset URL) —
    // recovered as the CeMonogram component.
    logo: null,
    wordmark: "Carrier Enterprise",
    barClass: "bg-brand-carrier text-brand-carrier-foreground",
    navClass: "bg-brand-carrier text-brand-carrier-foreground border-t border-white/15",
    Mark: CeMonogram,
  },
  peirce: {
    logo: "https://www.peirce.com/static/version1784845039/frontend/Peirce/base/en_US/images/peirce-phelps-logo.png",
    wordmark: "Peirce-Phelps",
    barClass: "bg-brand-peirce text-brand-peirce-foreground",
    navClass: "bg-brand-peirce text-brand-peirce-foreground border-t border-white/15",
    logoChip: true,
  },
  ecmdi: {
    // Live ECMD site renders an inline wordmark (no stable asset URL) —
    // recovered as the EcmdiWordmark component. Nav dimmed with brightness-95
    // to match the original two-tone red.
    logo: null,
    wordmark: "East Coast Metal Distributors",
    barClass: "bg-brand-ecmdi text-brand-ecmdi-foreground",
    navClass: "bg-brand-ecmdi text-brand-ecmdi-foreground border-t border-white/15 brightness-95",
    Mark: EcmdiWordmark,
  },
  homans: {
    logo: "https://www.homans.com/homansWhiteLogo-mER.png",
    wordmark: "Homans Associates",
    barClass: "bg-brand-homans text-brand-homans-foreground",
    navClass: "bg-brand-homans-nav text-brand-homans-foreground",
  },
};

/** Neutral fallback for any brand key without a dedicated theme — brand-color
 *  nav, never a washed grey. */
const FALLBACK_THEME: BrandTheme = {
  logo: null,
  wordmark: "",
  barClass: "bg-primary text-primary-foreground",
  navClass: "bg-primary text-primary-foreground border-t border-white/15",
};

function themeFor(brand: BrandChrome): BrandTheme {
  const theme = BRAND_THEME[brand.key] ?? FALLBACK_THEME;
  return { ...theme, wordmark: theme.wordmark || brand.name };
}

/** The brand's identity mark — real img logo, styled wordmark/monogram
 *  component, or plain wordmark text — shared by the header bar and the footer
 *  masthead so both always show the same (never a plain-text fallback where a
 *  real asset exists). Rendered on a brand-colored surface, so white logo
 *  assets read correctly. */
function BrandMark({ brand, theme }: { brand: BrandChrome; theme: BrandTheme }) {
  if (theme.logo) {
    return (
      <span className={cn("inline-flex shrink-0", theme.logoChip && "rounded-md bg-white px-2.5 py-1.5 shadow-sm")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={theme.logo} alt={brand.name} className="h-8 w-auto md:h-9" />
      </span>
    );
  }
  if (theme.Mark) return <theme.Mark />;
  return (
    <span className="text-lg font-black tracking-tight whitespace-nowrap">
      {theme.wordmark}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Utility bar links + nav caret rule (shared, brand-agnostic)
   ════════════════════════════════════════════════════════════════════════ */

/* The old skinny top strip is gone. Its tools now live in the "More Tools" nav
   dropdown; Quick Order became a signed-in icon in the main bar. */
const MORE_TOOLS_MENU: { label: string; href: string }[] = [
  { label: "AHRI Search", href: "#" },
  { label: "Part Finder", href: "#" },
  { label: "Warranty Center", href: "#" },
  { label: "Help & Support", href: "#" },
];

/** Real Homans content for the nav items that DO open a dropdown. Any nav item
 *  without an entry here (and that isn't the Products mega-menu) renders as a
 *  plain link with no caret — no empty dropdowns. */
const BRANDS_MENU: string[] = [
  "Armstrong Air", "Bryant", "Carrier", "DiversiTech", "Ductmate", "Duro Dyne",
  "Goodman", "Honeywell", "Mitsubishi Electric", "Rheem", "Fieldpiece", "White-Rodgers",
];
const RESOURCES_MENU: { label: string; href: string }[] = [
  { label: "Credit Application", href: "#" },
  { label: "Homans Pay", href: "#" },
  { label: "Simple Proposal", href: "#" },
  { label: "Line Cards", href: "#" },
  { label: "Documents", href: "#" },
  { label: "Rebates", href: "#" },
  { label: "Watsco Tools", href: "#" },
];

const NAV_TRIGGER_CLASS =
  "group relative my-1.5 inline-flex min-h-9 items-center gap-1 px-3 py-2 text-sm font-medium whitespace-nowrap text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 data-[state=open]:text-white";

/** A top-level nav item that opens a real dropdown (DS DropdownMenu). Open
 *  state is controlled so only one nav menu is open at a time. */
function NavDropdown({
  label,
  children,
  open,
  onOpenChange,
}: {
  label: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className={NAV_TRIGGER_CLASS}>
        <span>{label}</span>
        <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[70vh] w-56 overflow-y-auto">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   UnifiedHeader — three rows: utility · main · nav
   ════════════════════════════════════════════════════════════════════════ */

function UnifiedHeader({
  brand,
  signedIn = false,
}: {
  brand: BrandChrome;
  signedIn?: boolean;
}) {
  const theme = themeFor(brand);
  const branch = signedIn ? brand.defaultBranch : "Select your store";
  // Which top-level nav menu is open — only one at a time (mega-menu + dropdowns).
  const [openNav, setOpenNav] = React.useState<string | null>(null);
  const navProps = (key: string) => ({
    open: openNav === key,
    onOpenChange: (o: boolean) => setOpenNav(o ? key : null),
  });

  return (
    <header>
      {/* Row 2 — main bar (brand color). The old skinny utility strip is gone;
          its tools moved into the "More Tools" nav dropdown and Quick Order. */}
      <div className={theme.barClass}>
        <div className="mx-auto flex max-w-[var(--layout-max-width)] items-center gap-3 px-4 py-3 md:gap-4 md:px-6">
          {/* LEFT: logo / brand mark */}
          <Link
            href="/"
            className="shrink-0 rounded-md px-1 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={`${brand.name} home`}
          >
            <BrandMark brand={brand} theme={theme} />
          </Link>

          {/* LEFT: branch selector — a prominent, bordered control immediately
              after the logo on EVERY brand. Reads as the "Your Branch" picker. */}
          <a
            href="/store-locator/in-plp?v=c"
            className="hidden items-center gap-2.5 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 leading-tight transition-colors hover:bg-white/20 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
          >
            <Home className="size-5 shrink-0" aria-hidden />
            <span className="text-left">
              <span className="block text-[11px] uppercase tracking-wide opacity-80">Your Branch</span>
              <span className="flex items-center gap-1.5 text-sm font-bold whitespace-nowrap">
                {branch}
                <ChevronDown className="size-3.5 opacity-80" aria-hidden />
              </span>
              {signedIn ? (
                <span className="block text-[11px] font-semibold text-green-300">Open now</span>
              ) : null}
            </span>
          </a>

          {/* CENTER: search — the front-and-center focal point (grows to fill). */}
          <SearchAutocomplete placeholder="Search item # or name" />

          {/* RIGHT: Quick Order (signed-in) · Lists · Account · Cart */}
          {signedIn ? (
            <Link
              href="/quick-order"
              className="hidden flex-col items-center rounded-md px-2 py-1 text-[11px] transition-colors hover:bg-white/10 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:flex"
            >
              <Zap className="size-5" aria-hidden />
              Quick Order
            </Link>
          ) : null}
          <Link
            href="/dashboard/shopping-lists"
            className="hidden flex-col items-center rounded-md px-2 py-1 text-[11px] transition-colors hover:bg-white/10 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:flex"
          >
            <ClipboardList className="size-5" aria-hidden />
            Lists
          </Link>
          <AccountFlyout signedIn={signedIn} />
          <CartTrigger signedIn={signedIn} />
        </div>
      </div>

      {/* Row 3 — category nav (brand nav shade) */}
      <nav aria-label="Primary" className={theme.navClass}>
        <div className="mx-auto flex max-w-[var(--layout-max-width)] gap-1 overflow-x-auto px-4 md:px-6">
          {brand.nav.map((n) => {
            if (n === "Products") return <MegaMenu key={n} {...navProps("Products")} />;
            if (n === "Brands")
              return (
                <NavDropdown key={n} label="Brands" {...navProps("Brands")}>
                  {BRANDS_MENU.map((b) => (
                    <DropdownMenuItem key={b} asChild>
                      <Link href={`/search?q=${encodeURIComponent(b)}&signedin=1`}>{b}</Link>
                    </DropdownMenuItem>
                  ))}
                </NavDropdown>
              );
            if (n === "Resources")
              return (
                <NavDropdown key={n} label="Resources" {...navProps("Resources")}>
                  {RESOURCES_MENU.map((r) => (
                    <DropdownMenuItem key={r.label} asChild>
                      <Link href={r.href}>{r.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </NavDropdown>
              );
            if (n === "More Tools")
              return (
                <NavDropdown key={n} label="More Tools" {...navProps("More Tools")}>
                  {MORE_TOOLS_MENU.map((r) => (
                    <DropdownMenuItem key={r.label} asChild>
                      <Link href={r.href}>
                        <Wrench className="size-4 opacity-70" aria-hidden />
                        {r.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </NavDropdown>
              );
            if (n === "Specials")
              // Promo item — stands out in brand yellow, pushed to the end.
              return (
                <Link
                  key={n}
                  href="/search?q=specials&signedin=1"
                  className="my-1.5 inline-flex min-h-9 items-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-bold whitespace-nowrap text-blue-950 transition-colors hover:bg-yellow-300 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {n}
                </Link>
              );
            // Everything else is a plain link — no caret, no empty dropdown.
            return (
              <Link
                key={n}
                href="#"
                className="group relative my-1.5 inline-flex min-h-9 items-center px-3 py-2 text-sm font-medium whitespace-nowrap text-white/90 transition-colors hover:text-white hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <span>{n}</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-3 -bottom-2 h-[2px] rounded-full bg-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   UnifiedFooter — consistent across brands, brand color only as a slim accent
   ════════════════════════════════════════════════════════════════════════ */

const SOCIAL = [
  { label: "Facebook", Icon: Facebook },
  { label: "Twitter", Icon: Twitter },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "YouTube", Icon: Youtube },
];

function FooterColumnBlock({ col }: { col: FooterColumn }) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide uppercase">{col.title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {col.links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UnifiedFooter({ brand }: { brand: BrandChrome }) {
  const theme = themeFor(brand);
  return (
    <footer className="mt-16 bg-background">
      {/* Brand masthead — real logo/mark on the brand color, so the top of the
          footer carries the brand identity instead of an empty white band. */}
      <div className={theme.barClass}>
        <div className="mx-auto flex max-w-[var(--layout-max-width)] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-5 md:px-6">
          <Link
            href="/"
            className="rounded-md px-1 transition-colors hover:bg-white/10 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={`${brand.name} home`}
          >
            <BrandMark brand={brand} theme={theme} />
          </Link>
          <p className="text-sm opacity-90">
            HVAC equipment, parts, and supplies for the trade.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {brand.footerColumns.map((col) => (
            <FooterColumnBlock key={col.title} col={col} />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Copyright © {brand.copyright}
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Dispatchers — one unified chrome for ALL brand keys
   ════════════════════════════════════════════════════════════════════════ */

/**
 * Umbrella site header. When a `searchQuery` is passed (e.g. the current PLP
 * query string), we splice a global effect below the header that pre-fills
 * every rendered search input — so the top search bar reflects the active
 * query on every brand's chrome without threading the value through each brand.
 */
export function SiteHeader({
  brand,
  signedIn = false,
  searchQuery,
}: {
  brand: BrandChrome;
  signedIn?: boolean;
  searchQuery?: string;
}) {
  return (
    <>
      <UnifiedHeader brand={brand} signedIn={signedIn} />
      {searchQuery ? <HeaderSearchQuerySync value={searchQuery} /> : null}
    </>
  );
}

/**
 * Pre-fills any `input[type="search"]` inside the site header with the
 * current query. Runs once on mount — keeps every brand's chrome DRY (no
 * per-brand prop threading). If the query changes on subsequent PLPs, the
 * page reloads with a new key and this effect re-runs.
 */
function HeaderSearchQuerySync({ value }: { value: string }) {
  if (typeof window === "undefined") return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(() => { const v = ${JSON.stringify(value)}; document.querySelectorAll('header input[type="search"], header input[aria-label="Search"]').forEach(i => { if (!i.value) i.value = v; }); })();`,
      }}
    />
  );
}

export function SiteFooter({ brand }: { brand: BrandChrome }) {
  return <UnifiedFooter brand={brand} />;
}

/* ════════════════════════════════════════════════════════════════════════
   Minimal checkout chrome — Secure Checkout header + slim help/legal footer.
   Same brand bar color + BrandMark as SiteHeader; no nav, search, or
   account/utility links.
   ════════════════════════════════════════════════════════════════════════ */

export function CheckoutHeader({ brand }: { brand: BrandChrome }) {
  const theme = themeFor(brand);
  return (
    <header className={cn(theme.barClass, "border-b border-black/15")}>
      <div className="mx-auto flex max-w-[var(--layout-max-width)] items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="shrink-0 rounded-md px-1 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={`${brand.name} home`}
          >
            <BrandMark brand={brand} theme={theme} />
          </Link>
          <span className="flex items-center gap-1.5 border-l border-white/25 pl-3 text-sm font-semibold whitespace-nowrap opacity-95">
            <Lock className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </span>
        </div>
        <CheckoutCartTrigger />
      </div>
    </header>
  );
}

const CHECKOUT_LEGAL_LINKS = ["Guest Service Center", "Privacy Policy", "Terms & Conditions"];

export function CheckoutFooter({ brand }: { brand: BrandChrome }) {
  const phone = brand.phone ?? "(800) 555-0199";
  return (
    // Mobile: tight top margin (no dead space under the order summary) and bottom
    // padding to clear the fixed sticky CTA bar. Desktop keeps the roomy margin.
    <footer className="mt-6 border-t bg-background pb-24 lg:mt-16 lg:pb-0">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 md:px-6">
        <div className="flex flex-col gap-1 py-5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
          <span className="font-semibold">Need Help?</span>
          <span className="text-muted-foreground">
            Call us at <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="font-medium text-foreground underline-offset-4 hover:underline">{phone}</a>
            {" "}(Mon–Fri, 7am–6pm ET) or{" "}
            <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
              Chat with a Specialist
            </a>
          </span>
        </div>
        <div className="flex flex-col gap-2 border-t py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {brand.copyright}</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {CHECKOUT_LEGAL_LINKS.map((l) => (
              <a key={l} href="#" className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
                {l}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
