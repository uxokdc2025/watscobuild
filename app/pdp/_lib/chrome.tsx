import {
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Per-brand chrome. Each brand's header/footer is rebuilt "as close to the
 * original as possible" using OUR design system (Roboto, 4px radius, our
 * tokens). Where a brand's real chrome uses a colored background, that exact
 * color lives as a brand token in globals.css (e.g. --brand-gemaire) — never
 * hardcoded here.
 *
 * SiteHeader/SiteFooter dispatch on brand.key: a faithful build where we have
 * one, else the generic approximation below.
 */
export type FooterColumn = { title: string; links: string[] };

export type BrandChrome = {
  key: string;
  /** Display name / wordmark text. */
  name: string;
  /** Approximate brand accent (used by the generic fallback chrome). */
  accent: string;
  phone?: string;
  nav: string[];
  footerColumns: FooterColumn[];
  copyright: string;
};

/* ════════════════════════════════════════════════════════════════════════
   GEMAIRE — faithful chrome (reference implementation)
   Real header: blue bar (#0080df → --brand-gemaire) with white wordmark,
   prominent centered search, branch selector, cart; then a white sub-bar
   (Menu · Sign in / Register / Order Templates). Footer: light grey.
   ════════════════════════════════════════════════════════════════════════ */

function GemaireHeader({ brand }: { brand: BrandChrome }) {
  return (
    <header>
      {/* Blue bar */}
      <div className="bg-brand-gemaire text-brand-gemaire-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
          {/* Real logo (white version served for the blue bar) */}
          <a href="#" className="shrink-0" aria-label="Gemaire home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.gemaire.com/static/version1784840842/frontend/Gemaire/base/en_US/images/gemaire-logo-header-small.svg"
              alt="Gemaire Distributors"
              className="h-7 w-auto"
            />
          </a>

          {/* Prominent search */}
          <div className="relative hidden min-w-0 flex-1 md:block">
            <input
              aria-label="Search for products"
              placeholder="Search for products, categories, systems..."
              className="h-10 w-full rounded bg-white pr-11 pl-3 text-sm text-foreground outline-none"
            />
            <button
              type="button"
              aria-label="Search"
              className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded bg-brand-gemaire text-white"
            >
              <Search className="size-4" />
            </button>
          </div>

          {/* Branch selector */}
          <button
            type="button"
            className="ml-auto hidden items-center gap-1.5 text-left sm:inline-flex"
          >
            <MapPin className="size-5 shrink-0" />
            <span className="leading-tight">
              <span className="block text-[10px] tracking-wide uppercase opacity-90">
                Your Branch
              </span>
              <span className="block text-sm font-semibold">Select ▾</span>
            </span>
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Cart"
            className="inline-flex items-center gap-1.5 font-medium"
          >
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* White sub-bar */}
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 py-2.5 text-sm font-semibold text-brand-gemaire"
          >
            <Menu className="size-4" />
            Menu
          </button>
          <div className="flex items-center gap-5 text-sm">
            <a href="#" className="inline-flex items-center gap-1.5 hover:text-brand-gemaire">
              <User className="size-4" />
              Sign in
            </a>
            <a href="#" className="hidden hover:text-brand-gemaire sm:inline">
              Register
            </a>
            <button
              type="button"
              className="hidden items-center gap-1 hover:text-brand-gemaire sm:inline-flex"
            >
              Order Templates
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function GemaireFooter({ brand }: { brand: BrandChrome }) {
  const social = [
    { label: "LinkedIn", Icon: Linkedin },
    { label: "Facebook", Icon: Facebook },
    { label: "Instagram", Icon: Instagram },
  ];
  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {brand.footerColumns.map((col) => (
            <FooterColumnBlock key={col.title} col={col} />
          ))}
        </div>

        {/* Social */}
        <div className="mt-8 flex items-center gap-3">
          {social.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="grid size-9 place-items-center rounded-full border text-muted-foreground hover:text-brand-gemaire"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>Copyright © {brand.copyright}</span>
          <div className="flex items-center gap-4">
            <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   BAKER — faithful chrome
   Real header: dark utility strip (#3a3838 → --brand-baker-bar) with text
   links; white main bar (red Baker logo, store selector, search, account);
   white category nav with a red (#c8102e → --brand-baker) active underline.
   Footer: white, 4 columns, red headings, dark copyright bar.
   ════════════════════════════════════════════════════════════════════════ */

const BAKER_LOGO =
  "https://www.bakerdist.com/static/version1783616181/frontend/Baker/base/en_US/images/logo.svg";
const BAKER_UTILITY = [
  "Brands",
  "Events",
  "Specials",
  "Careers",
  "Resources",
  "Open Account",
  "BakerPay",
];

function BakerHeader({ brand }: { brand: BrandChrome }) {
  return (
    <header className="bg-background">
      {/* Dark utility strip */}
      <div className="bg-brand-baker-bar text-brand-baker-bar-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-1.5 text-xs md:px-6">
          {BAKER_UTILITY.map((l) => (
            <a key={l} href="#" className="whitespace-nowrap opacity-90 hover:opacity-100">
              {l}
            </a>
          ))}
          {brand.phone ? (
            <span className="ml-auto hidden items-center gap-1.5 opacity-90 sm:inline-flex">
              <Phone className="size-3.5" />
              {brand.phone}
            </span>
          ) : null}
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <a href="#" className="shrink-0" aria-label="Baker Distributing home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BAKER_LOGO} alt="Baker Distributing" className="h-8 w-auto" />
        </a>
        <div className="hidden items-center gap-1.5 text-xs leading-tight lg:flex">
          <MapPin className="size-4 shrink-0 text-brand-baker" />
          <span>
            <span className="block text-muted-foreground">You&apos;re shopping at store</span>
            <span className="block font-semibold">Select branch ▾</span>
          </span>
        </div>
        <div className="relative hidden min-w-0 flex-1 md:block">
          <input
            aria-label="Search"
            placeholder="Search by Model, Item #, or Name..."
            className="h-9 w-full rounded border bg-background pr-10 pl-3 text-sm outline-none"
          />
          <button
            type="button"
            aria-label="Search"
            className="absolute top-1/2 right-1 grid size-7 -translate-y-1/2 place-items-center rounded bg-brand-baker text-white"
          >
            <Search className="size-4" />
          </button>
        </div>
        <button type="button" aria-label="Account" className="ml-auto md:ml-0">
          <User className="size-6 text-brand-baker" />
        </button>
      </div>

      {/* Category nav */}
      <nav aria-label="Primary" className="border-y">
        <div className="mx-auto flex max-w-6xl gap-0 overflow-x-auto px-4 md:px-6">
          {brand.nav.map((n, i) => (
            <a
              key={n}
              href="#"
              className={cn(
                "border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap",
                i === 0
                  ? "border-brand-baker text-foreground"
                  : "border-transparent text-foreground/80 hover:text-foreground"
              )}
            >
              {n}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function BakerFooter({ brand }: { brand: BrandChrome }) {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {brand.footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold tracking-wide text-brand-baker uppercase">
                {col.title}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Dark copyright bar */}
      <div className="bg-brand-baker-bar text-brand-baker-bar-foreground">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs md:px-6">
          Copyright © {brand.copyright}
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   CARRIER ENTERPRISE — faithful chrome
   Real header: white utility bar (tool links); white main bar (CE monogram,
   search, account, GREEN cart #49a942 → --brand-carrier-cart); deep-purple
   category nav (#3d2762 → --brand-carrier) with white text. Footer: white.
   Logo is an inline SVG on the live site (no asset URL) → clean CE wordmark.
   ════════════════════════════════════════════════════════════════════════ */

const CE_UTIL_LEFT = [
  "AHRI Search",
  "Branches",
  "Cross-Reference",
  "Part Finder",
  "Quick Order",
  "System Builder",
  "Warranty",
];
const CE_UTIL_RIGHT = ["CE PATH", "CE Rewards", "Contact"];

function CarrierHeader({ brand }: { brand: BrandChrome }) {
  return (
    <header className="bg-background">
      {/* Utility bar */}
      <div className="border-b">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-1.5 text-xs text-muted-foreground md:px-6">
          <div className="hidden items-center gap-4 lg:flex">
            {CE_UTIL_LEFT.map((l) => (
              <a key={l} href="#" className="whitespace-nowrap hover:text-foreground">
                {l}
              </a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            {CE_UTIL_RIGHT.map((l) => (
              <a key={l} href="#" className="whitespace-nowrap hover:text-foreground">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <a href="#" className="flex shrink-0 items-center gap-2" aria-label="Carrier Enterprise home">
          <span className="grid size-9 place-items-center rounded-full bg-brand-carrier text-sm font-black text-white">
            CE
          </span>
          <span className="hidden text-sm leading-tight font-semibold sm:block">
            Carrier
            <br />
            Enterprise
          </span>
        </a>
        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search"
            placeholder="Search by keyword, model or part #"
            className="h-10 w-full rounded border bg-background pr-3 pl-9 text-sm outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <button type="button" className="inline-flex items-center gap-1.5">
            <User className="size-5" />
            <span className="hidden lg:inline">Account</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded px-3 py-2 font-medium text-white"
            style={{ backgroundColor: "var(--brand-carrier-cart)" }}
          >
            <ShoppingCart className="size-4" />
            Cart
          </button>
        </div>
      </div>

      {/* Purple category nav */}
      <nav
        aria-label="Primary"
        className="bg-brand-carrier text-brand-carrier-foreground"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 md:px-6">
          {brand.nav.map((n) => (
            <a
              key={n}
              href="#"
              className="px-3 py-3 text-sm font-medium whitespace-nowrap text-white/90 hover:text-white"
            >
              {n}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function CarrierFooter({ brand }: { brand: BrandChrome }) {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {brand.footerColumns.map((col) => (
            <FooterColumnBlock key={col.title} col={col} />
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {brand.copyright}</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Accessibility</a>
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PEIRCE-PHELPS — faithful chrome
   White header + footer with a blue logo (--brand-peirce) and a red "Specials"
   accent (--brand-peirce-accent). Utility bar of tool links + branch; main bar
   with real logo, blue search button, account, cart; white nav row.
   ════════════════════════════════════════════════════════════════════════ */

const PEIRCE_LOGO =
  "https://www.peirce.com/static/version1784845039/frontend/Peirce/base/en_US/images/peirce-phelps-logo.png";
const PEIRCE_UTIL = [
  "AHRI Search",
  "Part Finder",
  "Warranty Center",
  "Quick Order",
  "My Lists",
  "Help & Support",
];

function PeirceHeader({ brand }: { brand: BrandChrome }) {
  return (
    <header className="bg-background">
      {/* Utility bar */}
      <div className="border-b">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-1.5 text-xs text-muted-foreground md:px-6">
          <div className="hidden items-center gap-4 lg:flex">
            {PEIRCE_UTIL.map((l) => (
              <a key={l} href="#" className="whitespace-nowrap hover:text-foreground">
                {l}
              </a>
            ))}
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            You&apos;re Shopping · Norristown, PA
            <ChevronDown className="size-3.5" />
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <a href="#" className="shrink-0" aria-label="Peirce-Phelps home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PEIRCE_LOGO} alt="Peirce-Phelps" className="h-11 w-auto" />
        </a>
        <div className="relative hidden min-w-0 flex-1 md:block">
          <input
            aria-label="Search"
            placeholder="Search item # or keyword"
            className="h-10 w-full rounded border bg-background pr-11 pl-3 text-sm outline-none"
          />
          <button
            type="button"
            aria-label="Search"
            className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded bg-brand-peirce text-white"
          >
            <Search className="size-4" />
          </button>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <a href="#" className="hidden text-left leading-tight sm:block">
            <span className="font-semibold text-brand-peirce underline-offset-2 hover:underline">
              Sign In
            </span>{" "}
            or{" "}
            <span className="font-semibold text-brand-peirce underline-offset-2 hover:underline">
              Register
            </span>
            <span className="block text-muted-foreground">My Account</span>
          </a>
          <button type="button" aria-label="Cart" className="inline-flex items-center gap-1.5">
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Nav row */}
      <nav aria-label="Primary" className="border-y">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 md:px-6">
          {brand.nav.map((n, i) => (
            <a
              key={n}
              href="#"
              className={cn(
                "px-3 py-2.5 text-sm font-semibold whitespace-nowrap",
                i === 0
                  ? "text-brand-peirce-accent"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              {n}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function PeirceFooter({ brand }: { brand: BrandChrome }) {
  const social = [
    { label: "LinkedIn", Icon: Linkedin },
    { label: "Facebook", Icon: Facebook },
    { label: "Instagram", Icon: Instagram },
  ];
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {brand.footerColumns.map((col) => (
            <FooterColumnBlock key={col.title} col={col} />
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3">
          {social.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="grid size-9 place-items-center rounded-full border text-muted-foreground hover:text-brand-peirce"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {brand.copyright}
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Shared footer column
   ════════════════════════════════════════════════════════════════════════ */

function FooterColumnBlock({ col }: { col: FooterColumn }) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide uppercase">{col.title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {col.links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   GENERIC fallback chrome — approximation for brands not yet rebuilt.
   Paints brand.accent as the header background/wordmark.
   ════════════════════════════════════════════════════════════════════════ */

function GenericHeader({ brand }: { brand: BrandChrome }) {
  return (
    <header
      className="border-b bg-background"
      style={{ ["--brand" as string]: brand.accent }}
    >
      {/* Utility strip */}
      <div className="text-white" style={{ backgroundColor: "var(--brand)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 text-xs md:px-6">
          <span className="opacity-90">Wholesale HVAC/R distribution</span>
          <div className="flex items-center gap-4">
            {brand.phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" />
                {brand.phone}
              </span>
            ) : null}
            <span className="hidden sm:inline">Help &amp; Support</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <button type="button" aria-label="Menu" className="md:hidden">
          <Menu className="size-5" />
        </button>
        <span
          className="rounded px-2 py-1 text-lg font-extrabold tracking-tight text-white"
          style={{ backgroundColor: "var(--brand)" }}
        >
          {brand.name}
        </span>
        <div className="relative hidden flex-1 md:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search"
            placeholder="Search item # or name"
            className="h-9 w-full rounded-md border bg-muted/40 pr-3 pl-9 text-sm outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <button type="button" aria-label="Sign in" className="inline-flex items-center gap-1.5">
            <User className="size-4" />
            <span className="hidden sm:inline">Sign in</span>
          </button>
          <button type="button" aria-label="Cart" className="inline-flex items-center gap-1.5">
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Primary nav */}
      <nav
        aria-label="Primary"
        className="border-t"
        style={{ backgroundColor: "color-mix(in oklch, var(--brand) 6%, transparent)" }}
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 md:px-6">
          {brand.nav.map((n) => (
            <a
              key={n}
              href="#"
              className="px-3 py-2.5 text-sm font-medium whitespace-nowrap text-foreground/80 hover:text-foreground"
            >
              {n}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function GenericFooter({ brand }: { brand: BrandChrome }) {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div
          className={cn(
            "grid grid-cols-2 gap-8 sm:grid-cols-3",
            brand.footerColumns.length >= 4 && "lg:grid-cols-4"
          )}
        >
          {brand.footerColumns.map((col) => (
            <FooterColumnBlock key={col.title} col={col} />
          ))}
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {brand.copyright}
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Dispatchers
   ════════════════════════════════════════════════════════════════════════ */

export function SiteHeader({ brand }: { brand: BrandChrome }) {
  if (brand.key === "gemaire") return <GemaireHeader brand={brand} />;
  if (brand.key === "baker") return <BakerHeader brand={brand} />;
  if (brand.key === "carrier") return <CarrierHeader brand={brand} />;
  if (brand.key === "peirce") return <PeirceHeader brand={brand} />;
  return <GenericHeader brand={brand} />;
}

export function SiteFooter({ brand }: { brand: BrandChrome }) {
  if (brand.key === "gemaire") return <GemaireFooter brand={brand} />;
  if (brand.key === "baker") return <BakerFooter brand={brand} />;
  if (brand.key === "carrier") return <CarrierFooter brand={brand} />;
  if (brand.key === "peirce") return <PeirceFooter brand={brand} />;
  return <GenericFooter brand={brand} />;
}
