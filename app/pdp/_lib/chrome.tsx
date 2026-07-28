import {
  Bell,
  ChevronDown,
  ClipboardList,
  Facebook,
  Home,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
  Video,
  Youtube,
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

const GEMAIRE_SUBNAV: { label: string; caret?: boolean }[] = [
  { label: "Shop for Products", caret: true },
  { label: "Brands", caret: true },
  { label: "Resources", caret: true },
  { label: "Quick Order" },
  { label: "Matched Systems" },
];

function GemaireHeader({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <header>
      {/* Blue bar */}
      <div className="bg-brand-gemaire text-brand-gemaire-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5 md:px-6">
          {/* Real logo (white version served for the blue bar) */}
          <a href="#" className="shrink-0" aria-label="Gemaire home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.gemaire.com/static/version1784840842/frontend/Gemaire/base/en_US/images/gemaire-logo-header-small.svg"
              alt="Gemaire Distributors"
              className="h-8 w-auto"
            />
          </a>

          {/* Prominent search */}
          <div className="relative hidden min-w-0 flex-1 md:block">
            <input
              aria-label="Search for products"
              placeholder="Search for products, categories, systems..."
              className="h-11 w-full rounded-sm bg-white pr-11 pl-4 text-sm text-foreground outline-none"
            />
            <button
              type="button"
              aria-label="Search"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
            >
              <Search className="size-5" />
            </button>
          </div>

          {/* Branch selector */}
          <button
            type="button"
            className="ml-auto hidden items-center gap-2 text-left lg:inline-flex"
          >
            <MapPin className="size-5 shrink-0" />
            <span className="leading-tight">
              <span className="block text-[10px] font-medium tracking-wide uppercase opacity-90">
                Your Branch
              </span>
              <span className="block text-sm font-bold">
                {signedIn ? "MOBILE #251" : "Select Branch"}
              </span>
            </span>
            <ChevronDown className="size-4 opacity-90" />
          </button>

          {/* Orange cart */}
          <button
            type="button"
            aria-label="Cart, 7 items"
            className="relative inline-flex items-center gap-2 rounded-sm bg-brand-gemaire-cart px-4 py-2.5 font-semibold text-white"
          >
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">Cart</span>
            {signedIn ? (
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-white text-[11px] font-bold text-brand-gemaire-cart">
                7
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* White sub-bar */}
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <nav aria-label="Primary" className="flex items-center gap-5 overflow-x-auto">
            {GEMAIRE_SUBNAV.map((n) => (
              <button
                key={n.label}
                type="button"
                className="inline-flex items-center gap-1 py-3 text-sm font-semibold whitespace-nowrap hover:text-brand-gemaire"
              >
                {n.label}
                {n.caret ? <ChevronDown className="size-3.5" /> : null}
              </button>
            ))}
          </nav>
          <div className="hidden items-center gap-6 text-sm whitespace-nowrap md:flex">
            {signedIn ? (
              <button type="button" className="inline-flex items-center gap-1 font-medium hover:text-brand-gemaire">
                David&apos;s Account #63352
                <ChevronDown className="size-4" />
              </button>
            ) : (
              <span>
                <a href="#" className="font-medium text-brand-gemaire hover:underline">Sign In</a>
                <span className="text-muted-foreground"> or </span>
                <a href="#" className="font-medium text-brand-gemaire hover:underline">Register</a>
              </span>
            )}
            <button type="button" className="inline-flex items-center gap-1 font-medium hover:text-brand-gemaire">
              Order Templates
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

const GEMAIRE_SOCIAL = [
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Facebook", Icon: Facebook },
  { label: "X", Icon: Twitter },
  { label: "Instagram", Icon: Instagram },
];

function GemaireFooter({ brand }: { brand: BrandChrome }) {
  const [contact, ...cols] = [...brand.footerColumns].reverse();
  const leftCols = cols.reverse(); // all but CONTACT US, original order

  return (
    <footer className="mt-16 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        {/* Link columns + contact/social */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {leftCols.map((col) => (
            <FooterColumnBlock key={col.title} col={col} />
          ))}
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">
              {contact.title}
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {contact.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className={cn(
                      "text-sm underline-offset-4 hover:underline",
                      l.includes("@") ? "text-brand-gemaire" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold">Follow Us</p>
            <div className="mt-2 flex items-center gap-2">
              {GEMAIRE_SOCIAL.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full bg-background text-foreground shadow-sm hover:text-brand-gemaire"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Subscribe + Mobile App cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-sm bg-background p-6 shadow-sm">
            <h3 className="text-lg font-semibold">
              Subscribe for Exclusive Deals and Promotions
            </h3>
            <div className="mt-4 flex gap-2">
              <input
                aria-label="Email address"
                placeholder="Enter your email address"
                className="h-10 flex-1 rounded-sm border px-3 text-sm outline-none"
              />
              <button
                type="button"
                className="rounded-sm bg-brand-gemaire px-5 text-sm font-semibold text-white"
              >
                Subscribe
              </button>
            </div>
          </div>
          <div className="rounded-sm bg-background p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Gemaire HVAC Pro+ Mobile App</h3>
            <div className="mt-4 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://resource.gemaire.com/is/image/Watscocom/gemaire_content_google-play-logo?hei=40&fmt=png-alpha"
                alt="Get it on Google Play"
                className="h-10 w-auto"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://resource.gemaire.com/is/image/Watscocom/gemaire_content_app-store-logo?hei=40&fmt=png-alpha"
                alt="Download on the App Store"
                className="h-10 w-auto"
              />
              <a href="#" className="text-sm font-medium text-brand-gemaire hover:underline">
                Learn more
              </a>
            </div>
          </div>
        </div>

        {/* Centered distributor logo */}
        <div className="mt-12 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.gemaire.com/static/version1784840842/frontend/Gemaire/base/en_US/images/gemaire-distributor_blue.svg"
            alt="Gemaire Distributors"
            className="h-9 w-auto"
          />
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Copyright © {brand.copyright}</p>
          <p className="mt-2">
            <a href="#" className="hover:text-foreground hover:underline">Privacy Policy</a>
            <span className="px-2">|</span>
            <a href="#" className="hover:text-foreground hover:underline">Terms And Conditions</a>
          </p>
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
  "Documents",
  "Part Finder",
  "Quick Order",
  "Supersedes",
  "System Builder",
  "Warranty",
];
const CE_UTIL_RIGHT = ["CE PATH", "CE Rewards", "CE Statements", "Contact"];

function CeMonogram() {
  return (
    <span
      className="grid size-10 place-items-center rounded-full border-2 border-foreground text-base font-black tracking-tighter text-foreground"
      aria-hidden
    >
      CE
    </span>
  );
}

function CarrierHeader({
  brand,
  signedIn = false,
}: {
  brand: BrandChrome;
  signedIn?: boolean;
}) {
  const greyBtn =
    "inline-flex items-center gap-2 rounded bg-slate-500 px-3 text-white hover:bg-slate-600";
  return (
    <header className="bg-background">
      {/* Utility bar */}
      <div>
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 pt-2 text-xs text-muted-foreground md:px-6">
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
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <a href="#" className="shrink-0" aria-label="Carrier Enterprise home">
          <CeMonogram />
        </a>
        <div className="relative min-w-0 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search"
            placeholder="Search"
            className="h-10 w-full rounded border bg-background pr-3 pl-9 text-sm outline-none"
          />
        </div>
        {/* Account */}
        <button type="button" className={cn(greyBtn, "hidden py-1.5 text-left text-xs sm:inline-flex")}>
          <User className="size-5 shrink-0" />
          <span className="leading-tight">
            <span className="block text-sm font-semibold">{signedIn ? "Dave" : "Sign In"}</span>
            <span className="block opacity-90">{signedIn ? "234716 : 00" : "Account"}</span>
          </span>
        </button>
        {/* Lists */}
        <button type="button" className={cn(greyBtn, "hidden py-2 text-sm font-medium md:inline-flex")}>
          <ClipboardList className="size-5" />
          Lists
        </button>
        {/* Notifications */}
        <button type="button" aria-label="Notifications" className={cn(greyBtn, "hidden py-2 lg:inline-flex")}>
          <Bell className="size-5" />
        </button>
        {/* Cart */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded py-2 pr-1.5 pl-3 font-semibold text-white"
          style={{ backgroundColor: "var(--brand-carrier-cart)" }}
        >
          <ShoppingCart className="size-5" />
          <span className="hidden sm:inline">Cart</span>
          <span className="rounded bg-black/20 px-2 py-0.5 text-sm tabular-nums">
            {signedIn ? 26 : 0}
          </span>
        </button>
      </div>

      {/* Purple category nav */}
      <nav
        aria-label="Primary"
        className="bg-brand-carrier text-brand-carrier-foreground"
      >
        <div className="mx-auto flex max-w-6xl justify-between gap-1 overflow-x-auto px-4 md:px-6">
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

const CE_SOCIAL = [
  { label: "Facebook", Icon: Facebook, color: "#1877F2" },
  { label: "Instagram", Icon: Instagram, color: "#E4405F" },
  { label: "LinkedIn", Icon: Linkedin, color: "#0A66C2" },
  { label: "YouTube", Icon: Youtube, color: "#FF0000" },
];
const CE_NEWS = [
  { date: "Recent", title: "New product line now available at CE" },
  { date: "Recent", title: "Seasonal promotions are now live" },
];

function CarrierFooter({ brand }: { brand: BrandChrome }) {
  const greyBtn =
    "inline-flex items-center rounded bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700";
  return (
    <footer className="mt-16 bg-background">
      {/* Purple PRO bar */}
      <div className="bg-brand-carrier text-brand-carrier-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 py-4 md:px-6">
          <span className="font-bold">Be a PRO on the GO</span>
          <button type="button" className="rounded bg-white px-4 py-2 text-sm font-semibold text-brand-carrier">
            Download Mobile App
          </button>
        </div>
      </div>

      {/* Top section */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold">Customer Service</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our teams across every location are here to support your business.
            </p>
            <button type="button" className={cn(greyBtn, "mt-4")}>Contact Support</button>
          </div>
          {/* Subscribe + social */}
          <div>
            <h3 className="text-lg font-bold">Subscribe For Offers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get exclusive promotions and product updates by email.
            </p>
            <button type="button" className={cn(greyBtn, "mt-4")}>Subscribe</button>
            <p className="mt-6 font-bold">Follow Us</p>
            <div className="mt-2 flex items-center gap-3">
              {CE_SOCIAL.map(({ label, Icon, color }) => (
                <a key={label} href="#" aria-label={label} style={{ color }} className="hover:opacity-80">
                  <Icon className="size-6" />
                </a>
              ))}
            </div>
          </div>
          {/* HVAC News */}
          <div>
            <h3 className="text-lg font-bold">HVAC News</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Stay current on new products, contractor tips, and special offers.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {CE_NEWS.map((n) => (
                <li key={n.title} className="flex gap-3">
                  <div
                    className="size-14 shrink-0 rounded"
                    style={{
                      backgroundColor: "var(--muted)",
                      backgroundImage:
                        "repeating-linear-gradient(45deg, color-mix(in oklch, var(--muted-foreground) 12%, transparent) 0 6px, transparent 6px 12px)",
                    }}
                    aria-hidden
                  />
                  <span>
                    <span className="block text-[11px] tracking-wide text-muted-foreground uppercase">{n.date}</span>
                    <a href="#" className="text-sm font-semibold text-primary hover:underline">{n.title}</a>
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" className={cn(greyBtn, "mt-4")}>Read News</button>
          </div>
          {/* Mobile Apps */}
          <div>
            <h3 className="text-lg font-bold">Mobile Apps</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Product info and time-saving tools for HVAC pros, on the go.{" "}
              <a href="#" className="font-semibold text-primary hover:underline">See Features</a>
            </p>
            <div className="mt-4 flex gap-2">
              <StoreBadge store="App Store" />
              <StoreBadge store="Google Play" />
            </div>
          </div>
        </div>
      </div>

      {/* Lower link columns */}
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
              {brand.footerColumns.map((col) => (
                <FooterColumnBlock key={col.title} col={col} />
              ))}
            </div>
            <div className="shrink-0 text-sm lg:text-right">
              <div className="flex items-center gap-2 lg:justify-end">
                <span className="font-semibold">Language</span>
                <span className="inline-flex items-center gap-1 rounded border px-3 py-1.5">
                  English <ChevronDown className="size-4" />
                </span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">© {brand.copyright}</p>
              <div className="mt-3 flex flex-col gap-1.5 text-sm text-primary lg:items-end">
                {["Accessibility", "Privacy Policy", "Terms & Conditions", "Terms Of Use"].map((l) => (
                  <a key={l} href="#" className="hover:underline">{l}</a>
                ))}
              </div>
            </div>
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

/* ════════════════════════════════════════════════════════════════════════
   EAST COAST METAL DISTRIBUTORS — faithful chrome
   Real header: solid red (#cb0015 → --brand-ecmdi) with white script wordmark,
   search, account, branch selector, cart; red category nav. Footer: white.
   Live logo is an inline data URI (no stable URL) → styled white wordmark.
   ════════════════════════════════════════════════════════════════════════ */

function EcmdiHeader({ brand }: { brand: BrandChrome }) {
  return (
    <header>
      {/* Red main bar */}
      <div className="bg-brand-ecmdi text-brand-ecmdi-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5 md:px-6">
          <a href="#" className="shrink-0 leading-none" aria-label="East Coast Metal Distributors home">
            <span className="block text-lg font-black tracking-tight italic">
              East Coast
            </span>
            <span className="block text-[9px] font-semibold tracking-[0.25em]">
              METAL DISTRIBUTORS
            </span>
          </a>
          <div className="relative hidden min-w-0 flex-1 md:block">
            <input
              aria-label="Search our site"
              placeholder="Search our site..."
              className="h-9 w-full rounded bg-white pr-10 pl-3 text-sm text-foreground outline-none"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground">
              <Search className="size-4" />
            </span>
          </div>
          <button type="button" className="ml-auto hidden text-left text-xs leading-tight sm:block">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4" />
              <span>
                Sign In <span className="opacity-90">or</span>
                <br />
                Create an Account
              </span>
            </span>
          </button>
          <button type="button" className="hidden text-left text-xs leading-tight lg:block">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              <span>
                <span className="block opacity-90">Your Current Branch</span>
                <span className="block font-semibold">Select ▾</span>
              </span>
            </span>
          </button>
          <button type="button" aria-label="Shopping Cart" className="inline-flex items-center gap-1.5 font-medium">
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Red category nav (slightly deeper) */}
      <nav
        aria-label="Primary"
        className="bg-brand-ecmdi text-brand-ecmdi-foreground brightness-90"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 md:px-6">
          {brand.nav.map((n) => (
            <a
              key={n}
              href="#"
              className="px-3 py-2.5 text-sm font-medium whitespace-nowrap text-white/90 hover:text-white"
            >
              {n}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function EcmdiFooter({ brand }: { brand: BrandChrome }) {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {brand.footerColumns.map((col) => (
            <FooterColumnBlock key={col.title} col={col} />
          ))}
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          Copyright © {brand.copyright}
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   DCNE — faithful chrome
   Real header: dark-navy utility strip (#001056 → --brand-dcne) with text
   links; white main bar (real DCNE logo, search, sign in, branch, cart);
   white nav row. Footer: white.
   ════════════════════════════════════════════════════════════════════════ */

const DCNE_LOGO = "https://d36aiwq7h8e0h3.cloudfront.net/userfiles/dcne_logo.svg";

function DcneHeader({ brand }: { brand: BrandChrome }) {
  return (
    <header className="bg-background">
      {/* Navy utility strip */}
      <div className="bg-brand-dcne text-brand-dcne-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-2 text-xs md:px-6">
          <a href="#" className="opacity-90 hover:opacity-100">About Us</a>
          <a href="#" className="opacity-90 hover:opacity-100">Contact Us</a>
          <div className="ml-auto flex items-center gap-5">
            <a href="#" className="opacity-90 hover:opacity-100">Part Finder</a>
            <a href="#" className="opacity-90 hover:opacity-100">Warranty</a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <a href="#" className="shrink-0" aria-label="DCNE home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DCNE_LOGO} alt="DCNE" className="h-8 w-auto" />
        </a>
        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search"
            placeholder="Search"
            className="h-10 w-full rounded border bg-background pr-3 pl-9 text-sm outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <button type="button" className="inline-flex items-center gap-1.5">
            <User className="size-5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
          <button type="button" className="hidden text-left text-xs leading-tight lg:block">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-brand-dcne" />
              <span>
                <span className="block text-muted-foreground">You&apos;re shopping</span>
                <span className="block font-semibold">Select branch ▾</span>
              </span>
            </span>
          </button>
          <button type="button" aria-label="Cart" className="inline-flex items-center gap-1.5">
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Nav row */}
      <nav aria-label="Primary" className="border-y">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 md:px-6">
          {brand.nav.map((n) => (
            <a
              key={n}
              href="#"
              className="px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-foreground/80 hover:text-brand-dcne"
            >
              {n}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function DcneFooter({ brand }: { brand: BrandChrome }) {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {brand.footerColumns.map((col) => (
            <FooterColumnBlock key={col.title} col={col} />
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>Copyright © {brand.copyright}</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Return Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HOMANS ASSOCIATES — faithful chrome
   Real header: white utility bar (tool links); white main bar (real blue
   logo, search, account, cart); navy category nav (#003874 → --brand-homans)
   with a gold Specials. Footer: white.
   ════════════════════════════════════════════════════════════════════════ */

const HOMANS_LOGO = "https://www.homans.com/homansWhiteLogo-mER.png";
const HOMANS_UTIL = [
  "AHRI Search",
  "Part Finder",
  "Warranty Center",
  "Quick Order",
  "Help & Support",
];
const HOMANS_CARET = /^(Products|Find A Local Dealer)$/i;

function HomansHeader({
  brand,
  signedIn = false,
}: {
  brand: BrandChrome;
  signedIn?: boolean;
}) {
  return (
    <header>
      {/* Utility bar (white, centered) */}
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-4 py-2 text-xs text-muted-foreground md:px-6">
          {HOMANS_UTIL.map((l) => (
            <a key={l} href="#" className="whitespace-nowrap hover:text-foreground">
              {l}
            </a>
          ))}
        </div>
      </div>

      {/* Main bar (blue) */}
      <div className="bg-brand-homans text-brand-homans-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
          <a href="#" className="shrink-0" aria-label="Homans Associates home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HOMANS_LOGO} alt="Homans Associates" className="h-9 w-auto" />
          </a>

          {/* Your store */}
          <div className="hidden items-center gap-2 text-xs leading-tight xl:flex">
            <Home className="size-5 shrink-0" />
            <span>
              <span className="block opacity-90">Your store</span>
              <span className="block font-bold underline underline-offset-2">
                Manchester, NH - Homans, NH
              </span>
              <span className="block text-[11px] font-semibold text-green-300">
                Open now
              </span>
            </span>
          </div>

          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <input
              aria-label="Search"
              placeholder="Search item # or name"
              className="h-11 w-full rounded-sm bg-white pr-11 pl-4 text-sm text-foreground outline-none"
            />
            <button
              type="button"
              aria-label="Search"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
            >
              <Search className="size-5" />
            </button>
          </div>

          {/* Lists */}
          <button type="button" className="hidden flex-col items-center text-[11px] lg:flex">
            <ClipboardList className="size-5" />
            Lists
          </button>

          {/* Account */}
          <button type="button" className="hidden text-left text-xs leading-tight sm:block">
            <span className="block opacity-90">{signedIn ? "Hello, David" : "Sign In"}</span>
            <span className="block font-bold">My Account</span>
          </button>

          {/* Cart */}
          <button type="button" aria-label="Cart" className="flex items-center gap-1.5 text-[11px] leading-tight">
            <ShoppingCart className="size-6 shrink-0" />
            <span className="hidden text-left sm:block">
              {signedIn ? <span className="block font-semibold">1 Item</span> : null}
              <span className="block">Cart</span>
            </span>
          </button>
        </div>
      </div>

      {/* Nav bar (darker navy) */}
      <nav aria-label="Primary" className="bg-brand-homans-nav text-brand-homans-foreground">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 md:px-6">
          {brand.nav.map((n) => (
            <button
              key={n}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-3 text-sm font-medium whitespace-nowrap text-white/90 hover:text-white"
            >
              {n}
              {HOMANS_CARET.test(n) ? <ChevronDown className="size-3.5" /> : null}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

const HOMANS_FOOTER_COLS: FooterColumn[][] = [
  [
    { title: "Company", links: ["About", "Branch Finder", "Careers", "Mobile Apps"] },
    { title: "Resources", links: ["Credit Application", "Homans Pay", "Simple Proposal"] },
  ],
  [
    { title: "Local", links: ["Brands", "Bryant Resources", "Mitsubishi Team"] },
    { title: "Watsco Tools", links: ["Housecall Pro", "OnCall Air", "Amply Energy", "Coral"] },
  ],
];
const HOMANS_SOCIAL = [
  { label: "Facebook", Icon: Facebook },
  { label: "X", Icon: Twitter },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Vimeo", Icon: Video },
];

function StoreBadge({ store }: { store: string }) {
  return (
    <span className="inline-flex items-center rounded bg-black px-3 py-1.5 text-white">
      <span className="text-sm font-bold">{store}</span>
    </span>
  );
}

function HomansFooter({ brand }: { brand: BrandChrome }) {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Columns 1 & 2: stacked link groups */}
          {HOMANS_FOOTER_COLS.map((groups, i) => (
            <div key={i} className="flex flex-col gap-8">
              {groups.map((g) => (
                <FooterColumnBlock key={g.title} col={g} />
              ))}
            </div>
          ))}

          {/* Column 3: Follow Us + Mobile Apps */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase">Follow Us</h3>
              <div className="mt-3 flex items-center gap-4">
                {HOMANS_SOCIAL.map(({ label, Icon }) => (
                  <a key={label} href="#" aria-label={label} className="text-brand-homans hover:opacity-70">
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase">Mobile Apps</h3>
              <p className="mt-2 text-sm font-semibold">HVAC Pro+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Product info and time-saving tools for HVAC pros, on the go.
              </p>
              <a href="#" className="mt-2 inline-block text-sm font-semibold text-brand-homans hover:underline">
                See Features →
              </a>
              <div className="mt-3 flex gap-2">
                <StoreBadge store="App Store" />
                <StoreBadge store="Google Play" />
              </div>
            </div>
          </div>

          {/* Column 4: Customer Service + Subscribe */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase">Customer Service</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our team is here to support your business across every branch.
              </p>
              <button
                type="button"
                className="mt-3 rounded-sm bg-brand-homans px-4 py-2 text-sm font-semibold text-white"
              >
                Contact Support →
              </button>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase">Subscribe For Offers</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign up for exclusive promotions and product updates.
              </p>
              <button
                type="button"
                className="mt-3 rounded-sm bg-brand-homans px-4 py-2 text-sm font-semibold text-white"
              >
                Subscribe →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navy bottom bar */}
      <div className="bg-brand-homans text-brand-homans-foreground">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs md:px-6">
          <p>© {brand.copyright}</p>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {["Privacy Policy", "Terms of Use", "Accessibility", "Help"].map((l, i) => (
              <span key={l} className="inline-flex items-center gap-3">
                {i > 0 ? <span aria-hidden className="opacity-60">|</span> : null}
                <a href="#" className="hover:underline">{l}</a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
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

export function SiteHeader({
  brand,
  signedIn = false,
}: {
  brand: BrandChrome;
  signedIn?: boolean;
}) {
  if (brand.key === "gemaire") return <GemaireHeader signedIn={signedIn} />;
  if (brand.key === "baker") return <BakerHeader brand={brand} />;
  if (brand.key === "carrier") return <CarrierHeader brand={brand} signedIn={signedIn} />;
  if (brand.key === "peirce") return <PeirceHeader brand={brand} />;
  if (brand.key === "ecmdi") return <EcmdiHeader brand={brand} />;
  if (brand.key === "dcne") return <DcneHeader brand={brand} />;
  if (brand.key === "homans") return <HomansHeader brand={brand} signedIn={signedIn} />;
  return <GenericHeader brand={brand} />;
}

export function SiteFooter({ brand }: { brand: BrandChrome }) {
  if (brand.key === "gemaire") return <GemaireFooter brand={brand} />;
  if (brand.key === "baker") return <BakerFooter brand={brand} />;
  if (brand.key === "carrier") return <CarrierFooter brand={brand} />;
  if (brand.key === "peirce") return <PeirceFooter brand={brand} />;
  if (brand.key === "ecmdi") return <EcmdiFooter brand={brand} />;
  if (brand.key === "dcne") return <DcneFooter brand={brand} />;
  if (brand.key === "homans") return <HomansFooter brand={brand} />;
  return <GenericFooter brand={brand} />;
}
