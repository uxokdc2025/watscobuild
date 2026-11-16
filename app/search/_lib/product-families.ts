/**
 * Product-family normalization for the family-table list view.
 *
 * The mock result rows are flat (title / brand / item / mfg / price / stock) —
 * the shape a real search response has. The family table needs two things the
 * flat row doesn't carry:
 *
 *   1. a FAMILY  — the model series a SKU belongs to (Bryant® Legacy™ 134SAN,
 *                  Armstrong Air® A7AC13F OMNI, …), with a thumbnail and a
 *                  short plain-language description for the section header.
 *   2. SPECS     — normalized attribute values the per-category column config
 *                  addresses by key ("tonnage", "voltage", "rpm", …).
 *
 * Both are derived here rather than hand-authored per row, so the existing
 * mock data stays the single source of truth. Everything parsed out of the
 * title (tonnage, SEER, refrigerant, stage, HP, RPM) is a real catalog value.
 * The two values the titles don't carry — cabinet dimensions and voltage for
 * residential condensers — come from the documented tables below and are
 * representative prototype values, not catalog specs.
 */

import type { SearchResult } from "./mock-data";

export type ProductFamily = {
  key: string;
  name: string;
  /** One or two sentences: what this family is for. */
  description: string;
  image?: string;
};

export type NormalizedProduct = SearchResult & {
  familyKey: string;
  /** Normalized attribute values, keyed the way the column config addresses them. */
  specs: Record<string, string>;
};

export type ProductFamilyBucket = {
  family: ProductFamily;
  rows: NormalizedProduct[];
};

/* ------------------------------------------------------------------ *
 * Families
 * ------------------------------------------------------------------ */

/**
 * Residential condenser families, matched on the real MFR / item number
 * prefix. Model-series prefixes are the catalog's own family boundary, which
 * is exactly how Grainger groups: one section per series, not per SKU.
 */
type FamilyRule = {
  key: string;
  /** Tested against the MFR number, then the item number. */
  test: RegExp;
  name: string;
  description: string;
};

const FAMILY_RULES: FamilyRule[] = [
  {
    key: "bryant-legacy-134san",
    test: /^134SAN/i,
    name: "Bryant® Legacy™ 134SAN Air Conditioner",
    description:
      "Single-stage 14-SEER R-454B condensers — the straightforward residential changeout. Full 2–4 ton ladder, 208/230V single phase.",
  },
  {
    key: "bryant-legacy-135san",
    test: /^135SAN/i,
    name: "Bryant® Legacy™ 135SAN Air Conditioner",
    description:
      "The 15-SEER step up from the 134SAN in the same cabinet footprint, for jobs that need a higher efficiency rating without changing the pad.",
  },
  {
    key: "bryant-preferred-148tan",
    test: /^148TAN/i,
    name: "Bryant® Preferred™ 148TAN Air Conditioner",
    description:
      "Two-stage 18-SEER2 condensers with InteliSense™ diagnostics — the premium tier, for comfort and humidity control on higher-end replacements.",
  },
  {
    key: "bryant-pa4san",
    test: /^PA4SAN/i,
    name: "Bryant® PA4SAN Air Conditioner",
    description:
      "Compact single-stage 14-SEER2 condensers built for tight side-yard clearances where a full-size cabinet will not fit.",
  },
  {
    key: "armstrong-a7ac13f",
    test: /^ARA-A7AC13F/i,
    name: "Armstrong Air® A7AC13F OMNI Air Conditioner",
    description:
      "13-SEER2 single-stage OMNI-platform condensers on R-454B — Armstrong's value tier, stocked across the full tonnage range.",
  },
  {
    key: "armstrong-a7ac14f",
    test: /^ARA-A7AC14F/i,
    name: "Armstrong Air® A7AC14F OMNI Air Conditioner",
    description:
      "14-SEER2 OMNI condensers sharing the A7AC13F cabinet and line-set sizes, for jobs that need the higher efficiency rating.",
  },
];

/**
 * Parts results have no model series to group on, so the family falls back to
 * the manufacturer line — which is how a counter pro shops motors: pick the
 * line first (OEM-exact vs. universal), then the spec.
 */
const PART_FAMILY_NOTES: Record<string, string> = {
  "Factory Authorized Parts":
    "OEM-spec replacement motors for Carrier, Bryant and Payne equipment — factory-matched windings, shaft and mount, no adapting.",
  "TRADEPRO®":
    "Value-line universal motors covering the common HP / voltage / speed combinations in one stocked family.",
  "Genteq®":
    "ECM and PSC motors from the OEM that builds most of the industry's blower motors — programmable and multi-tap options.",
  "U.S. MOTORS":
    "Heavy-duty direct-drive motors built for long duty cycles and tight-tolerance replacements.",
  "DiversiTech®":
    "Universal replacement motors with broad cross-reference coverage — the one to reach for when the OEM number is unreadable.",
  "TOTALINE®":
    "Direct-drive motors stocked as the house line, priced for routine maintenance work.",
};

function familyRuleFor(result: SearchResult): FamilyRule | undefined {
  return FAMILY_RULES.find((rule) => rule.test.test(result.mfg) || rule.test.test(result.item));
}

export function familyKeyFor(result: SearchResult): string {
  return familyRuleFor(result)?.key ?? `brand-${slugify(result.brand)}`;
}

function familyFor(result: SearchResult): ProductFamily {
  const rule = familyRuleFor(result);
  if (rule) {
    return { key: rule.key, name: rule.name, description: rule.description };
  }
  return {
    key: `brand-${slugify(result.brand)}`,
    name: `${result.brand} Blower Motors`,
    description:
      PART_FAMILY_NOTES[result.brand] ??
      `${result.brand} replacement motors, grouped so the spec comparison stays inside one line.`,
  };
}

/* ------------------------------------------------------------------ *
 * Spec normalization
 * ------------------------------------------------------------------ */

/**
 * Cabinet dimensions (H × W × D, inches) by nominal tonnage. Representative
 * prototype values — residential condenser cabinets do step up with capacity,
 * but these are not catalog dimensions. Swap for real specs when the product
 * feed lands.
 */
const CABINET_BY_TONNAGE: Record<string, string> = {
  "1.5": '26" × 26" × 26"',
  "2": '28" × 29½" × 29½"',
  "2.5": '28" × 29½" × 29½"',
  "3": '32" × 29½" × 29½"',
  "3.5": '36" × 29½" × 29½"',
  "4": '40" × 29½" × 29½"',
  "5": '44" × 33½" × 33½"',
};

/** Residential condensers in this set are all 208/230V single phase. */
const RESIDENTIAL_VOLTAGE = "208/230V · 1 Ph";

const TONS_TO_BTU = 12000;

export function normalizeProduct(result: SearchResult): NormalizedProduct {
  const title = result.title;
  const specs: Record<string, string> = { brand: result.brand };

  const tonnage = match(title, /([\d.]+)\s*-?\s*Ton\b/i);
  if (tonnage) {
    const tons = Number.parseFloat(tonnage);
    specs.tonnage = `${trimZeros(tonnage)} Ton`;
    if (Number.isFinite(tons)) {
      specs.capacity = `${(tons * TONS_TO_BTU).toLocaleString()} Btu/h`;
    }
    const cabinet = CABINET_BY_TONNAGE[trimZeros(tonnage)];
    if (cabinet) specs.dimensions = cabinet;
    // Everything with a tonnage in this catalog is a residential condenser.
    specs.voltage = RESIDENTIAL_VOLTAGE;
  }

  const seer2 = match(title, /([\d.]+)\s*SEER2\b/i);
  const seer = seer2 ?? match(title, /([\d.]+)\s*SEER\b/i);
  if (seer) specs.efficiency = `${trimZeros(seer)} ${seer2 ? "SEER2" : "SEER"}`;

  const refrigerant = match(title, /\b(R-\d{2,3}[A-Z]?)\b/i);
  if (refrigerant) specs.refrigerant = refrigerant.toUpperCase();

  if (/two\s*stage|2\s*stage/i.test(title)) specs.stage = "Two stage";
  else if (/variable\s*speed/i.test(title)) specs.stage = "Variable speed";
  else if (/single\s*stage/i.test(title)) specs.stage = "Single stage";

  // Handles "1/2 HP", "2.4 HP" and ranged ECM ratings like "1/2-1/3 HP".
  const hp = match(title, /((?:\d+\s*\/\s*\d+|[\d.]+)(?:\s*-\s*(?:\d+\s*\/\s*\d+|[\d.]+))?)\s*HP\b/i);
  if (hp) specs.hp = `${hp.replace(/\s+/g, "")} HP`;

  const rpm = match(title, /(\d{3,4})\s*RPM\b/i);
  if (rpm) specs.rpm = `${rpm} RPM`;

  // Motor voltage lives in the title ("115 V", "208-230 V", "120/240 V").
  if (!specs.voltage) {
    // "115 V", "120/240 V", "115/208-230 V" all collapse to one token.
    const volts = match(title, /(\d{2,3}(?:[-/]\d{2,3})*)\s*V(?:olt)?\b/i);
    if (volts) specs.voltage = `${volts}V`;
  }

  if (/\bECM\b/i.test(title)) specs.motorType = "ECM";
  else if (/\bPSC\b/i.test(title)) specs.motorType = "PSC";

  const speeds = match(title, /(\d)\s*-?\s*(?:SPD|Speed)\b/i);
  if (speeds) specs.speeds = `${speeds}-speed`;

  if (result.amps) specs.amps = `${result.amps} A`;
  if (result.bearingType) specs.bearing = result.bearingType;
  if (result.basisOfRotationView) specs.rotationView = result.basisOfRotationView;
  if (result.capacitorMfdF) specs.capacitor = `${result.capacitorMfdF} MFD`;

  return { ...result, familyKey: familyKeyFor(result), specs };
}

/* ------------------------------------------------------------------ *
 * Grouping
 * ------------------------------------------------------------------ */

/**
 * Buckets results into families, preserving the order the families first
 * appear in the result set (relevance order is still the spine of the page).
 * `imageFor` resolves a row's photo so the family thumbnail matches the SKU
 * photos inside it.
 */
export function groupIntoFamilies(
  results: SearchResult[],
  imageFor: (result: SearchResult, index: number) => string | undefined,
): ProductFamilyBucket[] {
  const buckets = new Map<string, ProductFamilyBucket>();
  results.forEach((result, index) => {
    const normalized = normalizeProduct(result);
    const image = imageFor(result, index);
    let bucket = buckets.get(normalized.familyKey);
    if (!bucket) {
      bucket = { family: { ...familyFor(result), image }, rows: [] };
      buckets.set(normalized.familyKey, bucket);
    }
    bucket.rows.push({ ...normalized, image: image ?? normalized.image });
  });
  return Array.from(buckets.values());
}

/**
 * Sub-groups a family's rows by one spec key. Rows missing the attribute fall
 * into a single trailing "Other" group rather than disappearing.
 */
export function groupBySpec(
  rows: NormalizedProduct[],
  specKey: string,
): { key: string; label: string; rows: NormalizedProduct[] }[] {
  const groups = new Map<string, { key: string; label: string; rows: NormalizedProduct[] }>();
  for (const row of rows) {
    const label = row.specs[specKey] ?? "Other";
    let group = groups.get(label);
    if (!group) {
      group = { key: slugify(label) || "other", label, rows: [] };
      groups.set(label, group);
    }
    group.rows.push(row);
  }
  return Array.from(groups.values());
}

/** "2 Ton – 4 Ton" style span for the family header's meta line. */
export function tonnageSpan(rows: NormalizedProduct[]): string | undefined {
  const tons = rows
    .map((r) => Number.parseFloat(r.specs.tonnage ?? ""))
    .filter((n) => Number.isFinite(n));
  if (!tons.length) return undefined;
  const min = Math.min(...tons);
  const max = Math.max(...tons);
  return min === max ? `${trimZeros(String(min))} Ton` : `${trimZeros(String(min))}–${trimZeros(String(max))} Ton`;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function match(value: string, pattern: RegExp): string | undefined {
  return value.match(pattern)?.[1];
}

/** "2.0" → "2", "2.5" → "2.5" — tonnage reads as the trade writes it. */
function trimZeros(value: string): string {
  return value.replace(/\.0+$/, "");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
}
