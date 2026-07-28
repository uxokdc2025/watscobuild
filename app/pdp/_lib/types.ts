/**
 * Data-driven PDP model. One template renders any entry in the registry.
 * Each product carries its content plus an optional `commerce` block; the
 * template's signed-in/out toggle decides whether commerce (price, branches,
 * pack sizes) is shown or the gated "Sign in" state is shown instead.
 */

export type BadgeTone = "solid" | "soft";
export type BadgeColor = "blue" | "violet" | "green" | "amber" | "red" | "slate";
export type PdpBadge = { label: string; tone: BadgeTone; color: BadgeColor };

export type Branch = { qty: number; name: string };
export type SpecRow = { label: string; value: string };
export type SpecGroup = { title: string; rows: SpecRow[] };

export type FbtProduct = {
  id: string;
  title: string;
  item: string;
  mfg: string;
  branchQty: number;
  branchName: string;
  nearbyQty: number;
};

/** Rich description: a lead paragraph, optional bullet list, optional note pairs. */
export type PdpDescription = {
  intro: string;
  bullets?: string[];
  notes?: [string, string][];
};

/** Present when we have real pricing/inventory (i.e. a signed-in experience). */
export type PdpCommerce = {
  /** null when the brand hides price ("Price not available"). */
  price: number | null;
  uom: string;
  packSizes?: string[];
  yourBranch?: { name: string; stock: number };
  nearbyBranches?: Branch[];
  /** Shown instead of branch inventory when fulfillment is call-based (Homans). */
  fulfillmentNote?: string;
};

export type PdpProduct = {
  slug: string;
  brand: string;
  /** Key into the brand-chrome registry (renders that site's header/footer). */
  brandKey?: string;
  /** Source URL this was modeled on (shown on the Master index). */
  sourceUrl?: string;
  store?: { name: string; hours?: string };
  badges?: PdpBadge[];
  title: string;
  item: string;
  mfg: string;
  thumbnailCount: number;
  /** Real product image URLs (first is the hero). Falls back to a placeholder. */
  images?: string[];
  description: PdpDescription;
  /** Label for the specification tab, e.g. "Features and Specification". */
  specTabLabel: string;
  specGroupsLeft: SpecGroup[];
  specGroupsRight: SpecGroup[];
  /** Extra tabs that are empty on the source (rendered as "coming soon"). */
  comingSoonTabs?: string[];
  /** Signed-in pricing/inventory. Omit for products we only have gated data for. */
  commerce?: PdpCommerce;
  /** Frequently-bought-together groups, keyed by tab label. */
  fbt?: { label: string; items: FbtProduct[] }[];
};

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
