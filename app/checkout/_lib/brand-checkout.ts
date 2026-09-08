import type { FulfillmentMethod } from "../_components/fulfillment";

/* ───────────────────────── Per-brand checkout config ─────────────────────────
 * ONE config object per distributor drives the whole checkout: which fulfillment
 * methods appear, the account context, the switch-account seed, the pickup
 * branches, the grouped "Deliver to" address book, tax, and the confirmation
 * order number. The flow/components are identical across brands — only this data
 * changes — so there is NO scattered `brand === "…"` branching in the JSX.
 *
 * Each brand shows ONLY its own real methods and ONLY brand-consistent demo data
 * (account / store / addresses all in the brand's own region). */

export type BrandCheckoutKey = "baker" | "peirce" | "homans" | "ecmdi";

export type SwitchAccount = {
  id: string;
  name: string;
  kind: "Account" | "Ship-to" | "Company" | "Location";
  detail: string;
};

export type BrandAddressGroup = "job" | "account" | "billing";

export type BrandAddress = {
  id: string;
  group: BrandAddressGroup;
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  contact?: string;
  /** Deterministic default — the first job/primary address, never random. */
  isDefault?: boolean;
  /** 150-mile rule: address sits outside the branch delivery radius (Baker/ECM). */
  outOfRadius?: boolean;
};

export type BrandBranch = {
  id: string;
  name: string;
  address: string;
  miles: number;
  hours: string;
  current?: boolean;
};

/** A pickup add-on service (Baker Express) — a toggle inside the pickup panel,
 *  NOT a separate fulfillment method. */
export type PickupAddon = { id: string; label: string; hint: string };

export type BrandCheckoutConfig = {
  key: BrandCheckoutKey;
  /** Display name used in account-scoped copy ("charge to your … account"). */
  brandName: string;
  /** Fulfillment methods this brand exposes, in display order. [0] = default. */
  methods: FulfillmentMethod[];
  /** Baker Express — pickup add-on, shown only when present. */
  pickupAddon?: PickupAddon;
  /** Delivery date entry: a real picker, or a CSR-confirmed note (Peirce). */
  deliveryDateMode: "picker" | "csr";
  /** Split-shipment + liftgate modifiers (Homans local delivery). */
  deliveryModifiers: boolean;
  /** 150-mile radius rule + "Outside radius" flag (brands with Truck). */
  radiusRule: boolean;
  /** Rate line label for the Truck method, brand-named. */
  truckLabel?: string;
  account: { name: string; detail: string };
  switchAccounts: SwitchAccount[];
  branches: BrandBranch[];
  addresses: BrandAddress[];
  orderNumber: string;
  taxRate: number;
  /** Short branch label for the Review "Pickup — …" line. */
  pickupBranchShort: string;
};

/* ── Baker Distributing — Jacksonville, FL ── */
const BAKER: BrandCheckoutConfig = {
  key: "baker",
  brandName: "Baker Distributing",
  methods: ["pickup", "truck", "freight"],
  pickupAddon: { id: "baker-express", label: "Baker Express", hint: "Priority same-day staging for counter pickup" },
  deliveryDateMode: "picker",
  deliveryModifiers: false,
  radiusRule: true,
  truckLabel: "Baker Truck — $0.00",
  account: { name: "Internal Test Account", detail: "#602061 · Jacksonville, FL" },
  switchAccounts: [
    { id: "bkr602061", name: "Internal Test Account", kind: "Account", detail: "#602061 · Jacksonville, FL" },
    { id: "bkr-southside", name: "Southside job site", kind: "Ship-to", detail: "Jacksonville, FL 32216" },
    { id: "bkr-dc", name: "Baker DC — Jacksonville", kind: "Location", detail: "10771 Philips Hwy, Jacksonville, FL" },
    { id: "bkr-parent", name: "Baker — North Florida", kind: "Company", detail: "Parent company · 9 branches" },
    { id: "bkr-orangepark", name: "Orange Park branch", kind: "Location", detail: "550 Wells Rd, Orange Park, FL" },
  ],
  branches: [
    { id: "jax301", name: "Baker Jacksonville #301", address: "10771 Philips Hwy, Jacksonville, FL 32258", miles: 0, hours: "Open · closes 5pm", current: true },
    { id: "jax-southside", name: "Jacksonville Southside #312", address: "6200 Philips Hwy, Jacksonville, FL", miles: 8.4, hours: "Open · closes 5pm" },
    { id: "orangepark", name: "Orange Park #318", address: "550 Wells Rd, Orange Park, FL", miles: 14.1, hours: "Open · closes 5pm" },
    { id: "staugustine", name: "St. Augustine #327", address: "2450 US-1 S, St. Augustine, FL", miles: 38.7, hours: "Open · closes 4:30pm" },
  ],
  addresses: [
    { id: "bkr-job-baymeadows", group: "job", name: "Baymeadows retrofit", contact: "Site super — Luis M.", line1: "8130 Baymeadows Rd", city: "Jacksonville", state: "FL", zip: "32256", isDefault: true },
    { id: "bkr-job-tallahassee", group: "job", name: "Tallahassee new install", contact: "GC — Southern Air", line1: "1215 Apalachee Pkwy", city: "Tallahassee", state: "FL", zip: "32301", outOfRadius: true },
    { id: "bkr-acct-main", group: "account", name: "Internal Test Account — Main", line1: "10771 Philips Hwy", city: "Jacksonville", state: "FL", zip: "32258" },
    { id: "bkr-acct-southside", group: "account", name: "Southside warehouse", line1: "6200 Philips Hwy", city: "Jacksonville", state: "FL", zip: "32216" },
    { id: "bkr-bill", group: "billing", name: "Accounts payable", line1: "PO Box 40086", city: "Jacksonville", state: "FL", zip: "32203" },
  ],
  orderNumber: "BKR-2026-04871",
  taxRate: 0.075,
  pickupBranchShort: "Jacksonville #301",
};

/* ── Peirce-Phelps — Camp Hill, PA ── */
const PEIRCE: BrandCheckoutConfig = {
  key: "peirce",
  brandName: "Peirce-Phelps",
  methods: ["pickup", "delivery"],
  deliveryDateMode: "csr",
  deliveryModifiers: false,
  radiusRule: false,
  account: { name: "JK Mechanical Inc", detail: "#144010 · Camp Hill, PA" },
  switchAccounts: [
    { id: "pp144010", name: "JK Mechanical Inc", kind: "Account", detail: "#144010 · Camp Hill, PA" },
    { id: "pp-harrisburg", name: "Harrisburg job site", kind: "Ship-to", detail: "Harrisburg, PA 17101" },
    { id: "pp-shop", name: "JK Mechanical — Shop", kind: "Location", detail: "210 Cumberland Pkwy, Mechanicsburg, PA" },
    { id: "pp-parent", name: "JK Mechanical — Central PA", kind: "Company", detail: "Parent company · 4 branches" },
    { id: "pp-york", name: "York branch", kind: "Location", detail: "1350 Roosevelt Ave, York, PA" },
  ],
  branches: [
    { id: "camphill", name: "Camp Hill, PA #144", address: "3960 Hartzdale Dr, Camp Hill, PA 17011", miles: 0, hours: "Open · closes 5pm", current: true },
    { id: "harrisburg", name: "Harrisburg, PA #151", address: "1001 Paxton St, Harrisburg, PA", miles: 6.9, hours: "Open · closes 5pm" },
    { id: "york", name: "York, PA #158", address: "1350 Roosevelt Ave, York, PA", miles: 24.3, hours: "Open · closes 5pm" },
    { id: "lancaster", name: "Lancaster, PA #163", address: "1912 Olde Homestead Ln, Lancaster, PA", miles: 37.2, hours: "Open · closes 4:30pm" },
  ],
  addresses: [
    { id: "pp-job-capitol", group: "job", name: "Capitol complex retrofit", contact: "Site super — Dan K.", line1: "501 N 3rd St", city: "Harrisburg", state: "PA", zip: "17101", isDefault: true },
    { id: "pp-job-hershey", group: "job", name: "Hershey medical office", contact: "GC — Keystone Mech.", line1: "35 Hope Dr", city: "Hershey", state: "PA", zip: "17033" },
    { id: "pp-acct-shop", group: "account", name: "JK Mechanical — Shop", line1: "210 Cumberland Pkwy", city: "Mechanicsburg", state: "PA", zip: "17055" },
    { id: "pp-acct-yard", group: "account", name: "Equipment yard", line1: "4600 Marketplace Way", city: "Enola", state: "PA", zip: "17025" },
    { id: "pp-bill", group: "billing", name: "Accounts payable", line1: "PO Box 4300", city: "Harrisburg", state: "PA", zip: "17111" },
  ],
  orderNumber: "PP-2026-04871",
  taxRate: 0.06,
  pickupBranchShort: "Camp Hill #144",
};

/* ── Homans Associates — Wilmington, MA ── */
const HOMANS: BrandCheckoutConfig = {
  key: "homans",
  brandName: "Homans Associates",
  methods: ["pickup", "local"],
  deliveryDateMode: "picker",
  deliveryModifiers: true,
  radiusRule: false,
  account: { name: "Homans Associates", detail: "#509973 · Wilmington, MA" },
  switchAccounts: [
    { id: "hom509973", name: "Homans Associates", kind: "Account", detail: "#509973 · Wilmington, MA" },
    { id: "hom-woburn", name: "20 Cummings Park", kind: "Ship-to", detail: "Woburn, MA 01801" },
    { id: "hom-north", name: "North warehouse", kind: "Location", detail: "42 Industrial Way, Andover, MA" },
    { id: "hom-parent", name: "Homans — New England", kind: "Company", detail: "Parent company · 12 branches" },
    { id: "hom-portsmouth", name: "Portsmouth branch", kind: "Location", detail: "155 Heritage Ave, Portsmouth, NH" },
  ],
  branches: [
    { id: "wilmington", name: "Wilmington, MA #1248", address: "230 Andover St, Wilmington, MA 01887", miles: 0, hours: "Open · closes 5pm", current: true },
    { id: "woburn", name: "Woburn, MA #1256", address: "20 Cummings Park, Woburn, MA", miles: 8.1, hours: "Open · closes 5pm" },
    { id: "manchester", name: "Manchester, NH #1290", address: "613 Main Street, Manchester, NH", miles: 34.6, hours: "Open · closes 5pm" },
    { id: "portsmouth", name: "Portsmouth, NH #1277", address: "155 Heritage Ave, Portsmouth, NH", miles: 47.2, hours: "Open · closes 4:30pm" },
  ],
  addresses: [
    { id: "hom-job-spring", group: "job", name: "Spring maintenance", contact: "Site super — Dave R.", line1: "88 Elm Street", city: "Woburn", state: "MA", zip: "01801", isDefault: true },
    { id: "hom-job-riverside", group: "job", name: "Riverside retrofit", contact: "GC — Meadow Mechanical", line1: "1200 Shore Road", city: "Portsmouth", state: "NH", zip: "03801" },
    { id: "hom-acct-main", group: "account", name: "Homans Associates — Main", line1: "230 Andover St", city: "Wilmington", state: "MA", zip: "01887" },
    { id: "hom-acct-north", group: "account", name: "North warehouse", line1: "42 Industrial Way", city: "Andover", state: "MA", zip: "01810" },
    { id: "hom-bill", group: "billing", name: "Accounts payable", line1: "PO Box 2200", city: "Woburn", state: "MA", zip: "01801" },
  ],
  orderNumber: "HOM-2026-04871",
  taxRate: 0.0625,
  pickupBranchShort: "Wilmington #1248",
};

/* ── East Coast Metal Distributors — Durham, NC ── */
const ECMDI: BrandCheckoutConfig = {
  key: "ecmdi",
  brandName: "East Coast Metal Distributors",
  methods: ["pickup", "truck", "freight", "ups"],
  deliveryDateMode: "picker",
  deliveryModifiers: false,
  radiusRule: true,
  truckLabel: "ECMD Truck — $0.00",
  account: { name: "KDTM LLC dba Happy Home Svcs", detail: "#30095 · Durham, NC" },
  switchAccounts: [
    { id: "ecm30095", name: "KDTM LLC dba Happy Home Svcs", kind: "Account", detail: "#30095 · Durham, NC" },
    { id: "ecm-raleigh", name: "Raleigh job site", kind: "Ship-to", detail: "Raleigh, NC 27601" },
    { id: "ecm-shop", name: "Happy Home Svcs — Shop", kind: "Location", detail: "5102 NC-55, Durham, NC" },
    { id: "ecm-parent", name: "ECM — Triangle", kind: "Company", detail: "Parent company · 6 branches" },
    { id: "ecm-cary", name: "Morrisville branch", kind: "Location", detail: "1000 Aviation Pkwy, Morrisville, NC" },
  ],
  branches: [
    { id: "durham1", name: "Durham, NC #1", address: "2925 E Pettigrew St, Durham, NC 27703", miles: 0, hours: "Open · closes 5pm", current: true },
    { id: "raleigh", name: "Raleigh, NC #4", address: "3200 Gresham Lake Rd, Raleigh, NC", miles: 12.7, hours: "Open · closes 5pm" },
    { id: "morrisville", name: "Morrisville, NC #7", address: "1000 Aviation Pkwy, Morrisville, NC", miles: 16.9, hours: "Open · closes 5pm" },
    { id: "greensboro", name: "Greensboro, NC #12", address: "4400 W Wendover Ave, Greensboro, NC", miles: 54.3, hours: "Open · closes 4:30pm" },
  ],
  addresses: [
    { id: "ecm-job-southpoint", group: "job", name: "Southpoint install", contact: "Site super — Marcus T.", line1: "6910 Fayetteville Rd", city: "Durham", state: "NC", zip: "27713", isDefault: true },
    { id: "ecm-job-wilmington", group: "job", name: "Wilmington coastal job", contact: "GC — Cape Fear Mech.", line1: "1000 Market St", city: "Wilmington", state: "NC", zip: "28401", outOfRadius: true },
    { id: "ecm-acct-main", group: "account", name: "KDTM LLC — Main", line1: "5102 NC-55", city: "Durham", state: "NC", zip: "27713" },
    { id: "ecm-acct-yard", group: "account", name: "Equipment yard", line1: "2925 E Pettigrew St", city: "Durham", state: "NC", zip: "27703" },
    { id: "ecm-bill", group: "billing", name: "Accounts payable", line1: "PO Box 12040", city: "Durham", state: "NC", zip: "27709" },
  ],
  orderNumber: "ECM-2026-04871",
  taxRate: 0.075,
  pickupBranchShort: "Durham #1",
};

const CONFIGS: Record<BrandCheckoutKey, BrandCheckoutConfig> = {
  baker: BAKER,
  peirce: PEIRCE,
  homans: HOMANS,
  ecmdi: ECMDI,
};

/** Resolve a checkout config by brand key. Brands without a dedicated checkout
 *  profile (carrier / dcne / gemaire) fall back to the Homans default. */
export function getBrandCheckout(key: string): BrandCheckoutConfig {
  return CONFIGS[key as BrandCheckoutKey] ?? HOMANS;
}
