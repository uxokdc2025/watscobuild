import { Menu, Phone, Search, ShoppingCart, User } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Config-driven brand chrome. We do NOT own the per-brand header/footer, so
 * this is a faithful *approximation* of each sub-company's current chrome —
 * enough for the client to see the shared content template sitting inside
 * their own header/footer. Swap for the real chrome when available.
 */
export type FooterColumn = { title: string; links: string[] };

export type BrandChrome = {
  key: string;
  /** Display name / wordmark text. */
  name: string;
  /** Approximate brand accent (header/logo). */
  accent: string;
  phone?: string;
  nav: string[];
  footerColumns: FooterColumn[];
  copyright: string;
};

export function SiteHeader({ brand }: { brand: BrandChrome }) {
  return (
    <header className="border-b bg-background" style={{ ["--brand" as string]: brand.accent }}>
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
        {/* Wordmark as an accent chip — white-on-accent stays AA in light + dark. */}
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
          <button
            type="button"
            aria-label="Sign in"
            className="inline-flex items-center gap-1.5"
          >
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
      <nav aria-label="Primary" className="border-t" style={{ backgroundColor: "color-mix(in oklch, var(--brand) 6%, transparent)" }}>
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

export function SiteFooter({ brand }: { brand: BrandChrome }) {
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
            <div key={col.title}>
              <h3 className="text-sm font-semibold tracking-wide uppercase">
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
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {brand.copyright}
        </div>
      </div>
    </footer>
  );
}
