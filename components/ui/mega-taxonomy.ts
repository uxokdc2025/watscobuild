export type TaxonomyNode = {
  label: string;
  slug: string;
  children?: TaxonomyNode[];
};

/** Shared taxonomy source for category navigation, links, and future facets. */
export const PRODUCT_TAXONOMY: TaxonomyNode[] = [
  { label: "Residential", slug: "residential", children: [
    { label: "80% + AFUE Gas Furnace", slug: "80-afue-gas-furnace", children: [
      { label: "Single Stage", slug: "single-stage" }, { label: "2 Stage", slug: "2-stage" }, { label: "Communicating", slug: "communicating" },
    ] },
    { label: "90% + AFUE Gas Furnace", slug: "90-afue-gas-furnace" }, { label: "Accessories", slug: "accessories" },
    { label: "Air Conditioner", slug: "air-conditioner" }, { label: "Air Handler", slug: "air-handler" }, { label: "Boilers", slug: "boilers" },
    { label: "Ductless", slug: "ductless" }, { label: "Evaporator Coil", slug: "evaporator-coil" }, { label: "Heat Pump", slug: "heat-pump" },
    { label: "Oil Furnace", slug: "oil-furnace" }, { label: "Small Packaged Products", slug: "small-packaged-products" }, { label: "Unico", slug: "unico" },
  ] },
  { label: "Mitsubishi", slug: "mitsubishi", children: [{ label: "Indoor Units", slug: "indoor-units" }, { label: "Outdoor Units", slug: "outdoor-units" }, { label: "Controls", slug: "controls" }] },
  { label: "Mechanical Insulation", slug: "mechanical-insulation", children: [{ label: "Pipe Insulation", slug: "pipe-insulation" }, { label: "Duct Insulation", slug: "duct-insulation" }] },
  { label: "Ductwork & Air Distribution", slug: "ductwork-air-distribution", children: [{ label: "Ductwork", slug: "ductwork" }, { label: "Grilles & Registers", slug: "grilles-registers" }, { label: "Dampers", slug: "dampers" }] },
  { label: "IAQ Thermostats & Zoning", slug: "iaq-thermostats-zoning", children: [{ label: "Air Quality", slug: "air-quality" }, { label: "Thermostats", slug: "thermostats" }, { label: "Zoning", slug: "zoning" }] },
  { label: "Parts Service & Electrical", slug: "parts-service-electrical", children: [{ label: "Motors", slug: "motors" }, { label: "Electrical", slug: "electrical" }, { label: "Refrigeration", slug: "refrigeration" }] },
  { label: "Commercial Equipment", slug: "commercial-equipment", children: [{ label: "Packaged Units", slug: "packaged-units" }, { label: "Rooftop Systems", slug: "rooftop-systems" }, { label: "Commercial Parts", slug: "commercial-parts" }] },
  { label: "General & Shop Supplies", slug: "general-shop-supplies", children: [{ label: "Filters", slug: "filters" }, { label: "Fasteners", slug: "fasteners" }, { label: "Jobsite Supplies", slug: "jobsite-supplies" }] },
  { label: "Tools", slug: "tools", children: [{ label: "Hand Tools", slug: "hand-tools" }, { label: "Testing Equipment", slug: "testing-equipment" }, { label: "Safety Gear", slug: "safety-gear" }] },
  { label: "Specials", slug: "specials", children: [{ label: "Featured Deals", slug: "featured-deals" }, { label: "Clearance", slug: "clearance" }] },
  { label: "Mobile App", slug: "mobile-app", children: [{ label: "HVAC Pro+", slug: "hvac-pro" }] },
];

export function taxonomyHref(node: TaxonomyNode) {
  return `/search?category=${encodeURIComponent(node.slug)}`;
}
