import {
  ChevronDown,
  ClipboardList,
  Facebook,
  Home,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { AccountFlyout, CartTrigger } from "./account-flyout";
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import { MegaMenu } from "@/components/ui/mega-menu";

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
 *    (`rounded-md px-2 py-1 transition-colors hover:bg-white/10`) — never an
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
};

const BRAND_THEME: Record<string, BrandTheme> = {
  gemaire: {
    logo: "https://www.gemaire.com/static/version1784840842/frontend/Gemaire/base/en_US/images/gemaire-logo-header-small.svg",
    wordmark: "Gemaire",
    barClass: "bg-brand-gemaire text-brand-gemaire-foreground",
    navClass: "bg-black/10 text-brand-gemaire-foreground",
  },
  baker: {
    logo: "https://www.bakerdist.com/static/version1783616181/frontend/Baker/base/en_US/images/logo.svg",
    wordmark: "Baker Distributing",
    barClass: "bg-brand-baker text-brand-baker-foreground",
    navClass: "bg-black/10 text-brand-baker-foreground",
  },
  carrier: {
    // Live CE site renders an inline wordmark/monogram (no stable asset URL).
    logo: null,
    wordmark: "Carrier Enterprise",
    barClass: "bg-brand-carrier text-brand-carrier-foreground",
    navClass: "bg-black/10 text-brand-carrier-foreground",
  },
  peirce: {
    logo: "https://www.peirce.com/static/version1784845039/frontend/Peirce/base/en_US/images/peirce-phelps-logo.png",
    wordmark: "Peirce-Phelps",
    barClass: "bg-brand-peirce text-brand-peirce-foreground",
    navClass: "bg-black/10 text-brand-peirce-foreground",
    logoChip: true,
  },
  ecmdi: {
    // Live ECMD site renders an inline data-URI wordmark (no stable asset URL).
    logo: null,
    wordmark: "East Coast Metal Distributors",
    barClass: "bg-brand-ecmdi text-brand-ecmdi-foreground",
    navClass: "bg-black/10 text-brand-ecmdi-foreground",
  },
  dcne: {
    logo: "https://d36aiwq7h8e0h3.cloudfront.net/userfiles/dcne_logo.svg",
    wordmark: "DCNE",
    barClass: "bg-brand-dcne text-brand-dcne-foreground",
    navClass: "bg-black/10 text-brand-dcne-foreground",
    logoChip: true,
  },
  homans: {
    logo: "https://www.homans.com/homansWhiteLogo-mER.png",
    wordmark: "Homans Associates",
    barClass: "bg-brand-homans text-brand-homans-foreground",
    navClass: "bg-brand-homans-nav text-brand-homans-foreground",
  },
};

/** Neutral fallback for any brand key without a dedicated theme. */
const FALLBACK_THEME: BrandTheme = {
  logo: null,
  wordmark: "",
  barClass: "bg-primary text-primary-foreground",
  navClass: "bg-black/10 text-primary-foreground",
};

function themeFor(brand: BrandChrome): BrandTheme {
  const theme = BRAND_THEME[brand.key] ?? FALLBACK_THEME;
  return { ...theme, wordmark: theme.wordmark || brand.name };
}

/* ════════════════════════════════════════════════════════════════════════
   Utility bar links + nav caret rule (shared, brand-agnostic)
   ════════════════════════════════════════════════════════════════════════ */

const UTILITY_LINKS = [
  "AHRI Search",
  "Part Finder",
  "Warranty Center",
  "Quick Order",
  "Help & Support",
];

/** Nav labels that read as expandable categories get a caret affordance. */
const NAV_CARET =
  /^(Products|Brands|Resources|Categories|Services|Shop for Products|Training & Events|About Us|PRO Guides|Find A Local Dealer)$/i;

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
  const branch = signedIn ? "Wilmington, MA #1248" : "Select your store";

  return (
    <header>
      {/* Row 1 — utility bar (thin, neutral, NOT brand color) */}
      <nav
        aria-label="Quick links"
        className="hidden border-b bg-background md:block"
      >
        <div className="mx-auto flex max-w-[var(--layout-max-width)] items-center justify-end gap-1 px-4 py-1 text-xs text-muted-foreground md:px-6">
          {UTILITY_LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="rounded-md px-2 py-1 whitespace-nowrap transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l}
            </a>
          ))}
        </div>
      </nav>

      {/* Row 2 — main bar (brand color) */}
      <div className={theme.barClass}>
        <div className="mx-auto flex max-w-[var(--layout-max-width)] items-center gap-3 px-4 py-3 md:gap-4 md:px-6">
          {/* LEFT: logo */}
          {theme.logo ? (
            <Link
              href="/"
              className={cn(
                "shrink-0",
                theme.logoChip && "rounded-md bg-white px-2.5 py-1.5 shadow-sm"
              )}
              aria-label={`${brand.name} home`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={theme.logo}
                alt={brand.name}
                className="h-8 w-auto md:h-9"
              />
            </Link>
          ) : (
            <Link
              href="/"
              className="shrink-0 rounded-md px-1 text-lg font-black tracking-tight whitespace-nowrap transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label={`${brand.name} home`}
            >
              {theme.wordmark}
            </Link>
          )}

          {/* LEFT: store / branch selector — immediately after the logo on EVERY brand */}
          <a
            href="/store-locator/in-plp?v=c"
            className="hidden items-center gap-2 rounded-md px-2 py-1 text-xs leading-tight transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:flex"
          >
            <Home className="size-5 shrink-0" aria-hidden />
            <span>
              <span className="block opacity-90">Your store</span>
              <span className="block font-bold whitespace-nowrap">{branch}</span>
              {signedIn ? (
                <span className="block text-[11px] font-semibold text-green-300">
                  Open now
                </span>
              ) : null}
            </span>
          </a>

          {/* CENTER: search (grows) */}
          <SearchAutocomplete placeholder="Search item # or name" />

          {/* RIGHT: Lists · Account · Cart */}
          <Link
            href="/dashboard/shopping-lists"
            className="hidden flex-col items-center rounded-md px-2 py-1 text-[11px] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:flex"
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
          {brand.nav.map((n) =>
            n === "Products" ? (
              <MegaMenu key={n} />
            ) : (
              <button
                key={n}
                type="button"
                className="my-1.5 inline-flex min-h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {n}
                {NAV_CARET.test(n) ? (
                  <ChevronDown className="size-3.5" aria-hidden />
                ) : null}
              </button>
            )
          )}
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
    <footer className="mt-16 border-t bg-background">
      {/* Slim brand-color accent */}
      <div className={cn("h-1 w-full", theme.barClass)} aria-hidden />

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
