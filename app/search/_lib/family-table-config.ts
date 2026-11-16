/**
 * Per-category column config for the family-table list view.
 *
 * This is THE knob: a category gets different table columns by adding an
 * entry here, never by forking the table component. Columns are plain data —
 * a spec key, a label, alignment and an optional responsive drop-out — so a
 * merchandiser-facing admin could eventually write them.
 *
 * `key` addresses a value on `NormalizedProduct.specs` (see
 * ./product-families). The one special case is `kind: "price"`, which the
 * view renders through the signed-in price gate rather than as a spec.
 */

export type FamilyColumnConfig = {
  /** Spec key on the normalized row, or "price" when `kind` is "price". */
  key: string;
  label: string;
  align?: "left" | "right";
  /**
   * Drop the column below this breakpoint. The value still shows in the
   * expanded row's spec list, so narrow screens lose nothing.
   */
  hideBelow?: "sm" | "md" | "lg";
  /** "price" routes through the signed-in gate. Omitted means a plain spec. */
  kind?: "spec" | "price";
};

export type CategoryTableConfig = {
  /** Spec key the rows are sub-grouped by inside each family. */
  groupBy: string;
  /** Label prefixed to each sub-group band, e.g. "Refrigerant". */
  groupLabel: string;
  columns: FamilyColumnConfig[];
};

/**
 * AC condensers / residential outdoor units: tonnage and cooling capacity,
 * voltage, cabinet dimensions, brand and price — sub-grouped by refrigerant,
 * which is the first thing a contractor filters on during the R-454B
 * transition.
 */
const RESIDENTIAL_CONFIG: CategoryTableConfig = {
  groupBy: "refrigerant",
  groupLabel: "Refrigerant",
  columns: [
    { key: "tonnage", label: "Tonnage" },
    { key: "capacity", label: "Cooling capacity", hideBelow: "sm" },
    { key: "efficiency", label: "Efficiency", hideBelow: "lg" },
    { key: "voltage", label: "Voltage", hideBelow: "md" },
    { key: "dimensions", label: "Dimensions (H×W×D)", hideBelow: "lg" },
    { key: "brand", label: "Brand", hideBelow: "md" },
    { key: "price", label: "Price", align: "right", kind: "price" },
  ],
};

/**
 * Parts / motors (the default search result set): the spec ladder a counter
 * pro walks — horsepower, voltage, speed, amps — sub-grouped by bearing type.
 */
const PARTS_CONFIG: CategoryTableConfig = {
  groupBy: "bearing",
  groupLabel: "Bearing type",
  columns: [
    { key: "hp", label: "Horsepower" },
    { key: "voltage", label: "Voltage", hideBelow: "sm" },
    { key: "rpm", label: "RPM", hideBelow: "md" },
    { key: "amps", label: "Amps", align: "right", hideBelow: "lg" },
    { key: "brand", label: "Brand", hideBelow: "md" },
    { key: "price", label: "Price", align: "right", kind: "price" },
  ],
};

/** Category slug → table config. Add a slug here to give it its own columns. */
export const CATEGORY_TABLE_CONFIG: Record<string, CategoryTableConfig> = {
  residential: RESIDENTIAL_CONFIG,
  "air-conditioners": RESIDENTIAL_CONFIG,
};

export function tableConfigFor(categorySlug?: string): CategoryTableConfig {
  if (categorySlug && CATEGORY_TABLE_CONFIG[categorySlug]) {
    return CATEGORY_TABLE_CONFIG[categorySlug];
  }
  return PARTS_CONFIG;
}
