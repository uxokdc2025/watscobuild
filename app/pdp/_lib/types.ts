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
  /** Rich-card fields (Carrier-style FBT): image, price, loyalty points, stock. */
  image?: string;
  price?: number;
  points?: number;
  stockStatus?: string;
  stockBranch?: string;
  /** Manufacturer/brand line + "% Also Purchased" (Customers Also Purchased). */
  brand?: string;
  pct?: number;
  /** Aggregated all-branches qty (East Coast style: "52 All Branches"). */
  allBranchesQty?: number;
  /** Original price for strike-thru ("was" price). */
  wasPrice?: number;
};

/** A related part shown in the "Parts" section (mini product card). */
export type PartItem = FbtProduct & { image?: string };

/** A substitute product row ("May not be covered by warranty"). */
export type SubstituteItem = {
  id: string;
  title: string;
  item: string;
  mfg: string;
  image?: string;
  price?: number;
  points?: number;
};

/** A downloadable/linked asset shown in the "Product Documentation" tab. */
export type PdpDocument = {
  label: string;
  kind: "pdf" | "video";
  href: string;
  /** Group heading in the documentation list (defaults to label). */
  category?: string;
};

/** Rich description: a lead paragraph, optional bullet list, optional note pairs. */
export type PdpDescription = {
  intro: string;
  bullets?: string[];
  notes?: [string, string][];
  /** Shows the California Proposition 65 warning link under the description. */
  prop65?: boolean;
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
  /** CE Rewards points earned on purchase — shows an "Earn N points" line. */
  points?: number;
  /** Original price for strike-through ("was") pricing. */
  wasPrice?: number;
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
  /** Label for the specification tab, e.g. "Equipment Specification". */
  specTabLabel: string;
  specGroupsLeft: SpecGroup[];
  specGroupsRight: SpecGroup[];
  /** Flat spec rows — when present, rendered as a 4-column list (no groups). */
  specsFlat?: SpecRow[];
  /** Extra tabs that are empty on the source (rendered as "coming soon"). */
  comingSoonTabs?: string[];
  /** Signed-in pricing/inventory. Omit for products we only have gated data for. */
  commerce?: PdpCommerce;
  /** Frequently-bought-together groups, keyed by tab label. */
  fbt?: { label: string; items: FbtProduct[] }[];
  /** Documents shown at the bottom of the Description (literature, video). */
  documents?: PdpDocument[];
  /** Render documents inside the Description tab (right column) vs a separate tab. */
  docsInline?: boolean;
  /** Related parts shown in the "Parts" section. */
  parts?: PartItem[];
  /**
   * Content layout for the details area:
   *  - "tabs" (default): Description / Part Lists / Equipment Spec / Documentation
   *  - "about": Carrier "About This Product" — Product Info / Documents /
   *    Part List / Where Used, plus Substitutes + Recently Viewed sections.
   */
  detailsStyle?: "tabs" | "about";
  /** Grouped specs for the Carrier "Product Info" panel (Dimensions, Attributes…). */
  productSpecs?: SpecGroup[];
  /** Substitute products ("May not be covered by warranty"). */
  substitutes?: SubstituteItem[];
  /** Recently-viewed product cards. */
  recentlyViewed?: PartItem[];
  /** Labels this as a use-case demo (grouped under "Use Cases" on the Master). */
  useCase?: string;
  /** Special commerce state that replaces the normal price / Add-to-Cart block. */
  status?: "replaced" | "non-sellable" | "requires-license" | "discontinued";
  /** Replacement products, shown when this item is discontinued / replaced. */
  replacements?: SubstituteItem[];
  /** AHRI matched-system reference — renders a badge + "View System Details" link. */
  ahri?: { number: string };
  /** Components included in a bundle ("Included In Bundle" section). */
  bundleItems?: SubstituteItem[];
  /** "Customers Also Purchased" cards (with % also-purchased). */
  customersAlsoPurchased?: FbtProduct[];
  /** Render the "No Image Available" placeholder instead of the hatched box. */
  noImage?: boolean;
  /** Promo rebate message shown near the buy box (e.g. "Up to $200 rebate"). */
  rebate?: string;
};

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
