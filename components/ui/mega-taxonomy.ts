export type TaxonomyNode = {
  label: string;
  slug: string;
  children?: TaxonomyNode[];
};

/** Shared taxonomy source for category navigation, links, and future facets.
 *  HVAC-realistic and 3 levels deep for the flagship categories (Residential,
 *  Parts · Service · Electrical, Commercial Equipment); shallower elsewhere. */
export const PRODUCT_TAXONOMY: TaxonomyNode[] = [
  {
    label: "Residential",
    slug: "residential",
    children: [
      {
        label: "Air Conditioners",
        slug: "air-conditioners",
        children: [
          { label: "Single-Stage AC", slug: "single-stage-ac" },
          { label: "Two-Stage AC", slug: "two-stage-ac" },
          { label: "Variable-Speed AC", slug: "variable-speed-ac" },
          { label: "Packaged AC", slug: "packaged-ac" },
        ],
      },
      {
        label: "Heat Pumps",
        slug: "heat-pumps",
        children: [
          { label: "Single-Stage Heat Pump", slug: "single-stage-heat-pump" },
          { label: "Two-Stage Heat Pump", slug: "two-stage-heat-pump" },
          { label: "Variable-Speed Heat Pump", slug: "variable-speed-heat-pump" },
          { label: "Packaged Heat Pump", slug: "packaged-heat-pump" },
        ],
      },
      {
        label: "Gas Furnaces",
        slug: "gas-furnaces",
        children: [
          { label: "80% AFUE", slug: "80-afue" },
          { label: "90%+ AFUE", slug: "90-afue" },
          { label: "Modulating", slug: "modulating-furnace" },
        ],
      },
      {
        label: "Air Handlers",
        slug: "air-handlers",
        children: [
          { label: "Multi-Position", slug: "multi-position-air-handler" },
          { label: "Modular", slug: "modular-air-handler" },
          { label: "Variable-Speed", slug: "variable-speed-air-handler" },
        ],
      },
      {
        label: "Evaporator Coils",
        slug: "evaporator-coils",
        children: [
          { label: "Cased Coils", slug: "cased-coils" },
          { label: "Uncased Coils", slug: "uncased-coils" },
          { label: "Slab Coils", slug: "slab-coils" },
        ],
      },
      {
        label: "Ductless Mini-Splits",
        slug: "ductless-mini-splits",
        children: [
          { label: "Single-Zone", slug: "single-zone-ductless" },
          { label: "Multi-Zone", slug: "multi-zone-ductless" },
          { label: "Ceiling Cassette", slug: "ceiling-cassette" },
        ],
      },
      {
        label: "Boilers",
        slug: "boilers",
        children: [
          { label: "Gas Boilers", slug: "gas-boilers" },
          { label: "Oil Boilers", slug: "oil-boilers" },
          { label: "Combi Boilers", slug: "combi-boilers" },
        ],
      },
    ],
  },
  {
    label: "Parts · Service · Electrical",
    slug: "parts-service-electrical",
    children: [
      {
        label: "Motors",
        slug: "motors",
        children: [
          { label: "Blower Motors", slug: "blower-motors" },
          { label: "Condenser Fan Motors", slug: "condenser-fan-motors" },
          { label: "ECM Motors", slug: "ecm-motors" },
          { label: "Inducer Motors", slug: "inducer-motors" },
        ],
      },
      {
        label: "Capacitors",
        slug: "capacitors",
        children: [
          { label: "Run Capacitors", slug: "run-capacitors" },
          { label: "Start Capacitors", slug: "start-capacitors" },
          { label: "Dual Run Capacitors", slug: "dual-run-capacitors" },
        ],
      },
      {
        label: "Contactors & Relays",
        slug: "contactors-relays",
        children: [
          { label: "Single-Pole Contactors", slug: "single-pole-contactors" },
          { label: "Two-Pole Contactors", slug: "two-pole-contactors" },
          { label: "Relays", slug: "relays" },
        ],
      },
      {
        label: "Ignition & Sensors",
        slug: "ignition-sensors",
        children: [
          { label: "Hot Surface Igniters", slug: "hot-surface-igniters" },
          { label: "Flame Sensors", slug: "flame-sensors" },
          { label: "Pressure Switches", slug: "pressure-switches" },
        ],
      },
      {
        label: "Refrigeration",
        slug: "refrigeration",
        children: [
          { label: "Compressors", slug: "compressors" },
          { label: "TXV Valves", slug: "txv-valves" },
          { label: "Filter Driers", slug: "filter-driers" },
        ],
      },
    ],
  },
  {
    label: "Commercial Equipment",
    slug: "commercial-equipment",
    children: [
      {
        label: "Rooftop Units",
        slug: "rooftop-units",
        children: [
          { label: "Packaged RTUs", slug: "packaged-rtus" },
          { label: "Gas / Electric RTUs", slug: "gas-electric-rtus" },
          { label: "Heat Pump RTUs", slug: "heat-pump-rtus" },
        ],
      },
      {
        label: "Split Systems",
        slug: "commercial-split-systems",
        children: [
          { label: "Commercial Condensers", slug: "commercial-condensers" },
          { label: "Commercial Air Handlers", slug: "commercial-air-handlers" },
        ],
      },
      {
        label: "Chillers",
        slug: "chillers",
        children: [
          { label: "Air-Cooled Chillers", slug: "air-cooled-chillers" },
          { label: "Water-Cooled Chillers", slug: "water-cooled-chillers" },
        ],
      },
      {
        label: "Commercial Controls",
        slug: "commercial-controls",
        children: [
          { label: "Building Controls", slug: "building-controls" },
          { label: "Economizers", slug: "economizers" },
        ],
      },
    ],
  },
  {
    label: "Mitsubishi",
    slug: "mitsubishi",
    children: [
      { label: "Indoor Units", slug: "indoor-units" },
      { label: "Outdoor Units", slug: "outdoor-units" },
      { label: "Controls", slug: "mitsubishi-controls" },
    ],
  },
  {
    label: "IAQ, Thermostats & Zoning",
    slug: "iaq-thermostats-zoning",
    children: [
      { label: "Air Quality", slug: "air-quality" },
      { label: "Thermostats", slug: "thermostats" },
      { label: "Zoning", slug: "zoning" },
    ],
  },
  {
    label: "Ductwork & Air Distribution",
    slug: "ductwork-air-distribution",
    children: [
      { label: "Ductwork", slug: "ductwork" },
      { label: "Grilles & Registers", slug: "grilles-registers" },
      { label: "Dampers", slug: "dampers" },
    ],
  },
  {
    label: "General & Shop Supplies",
    slug: "general-shop-supplies",
    children: [
      { label: "Filters", slug: "filters" },
      { label: "Fasteners", slug: "fasteners" },
      { label: "Jobsite Supplies", slug: "jobsite-supplies" },
    ],
  },
  {
    label: "Tools",
    slug: "tools",
    children: [
      { label: "Hand Tools", slug: "hand-tools" },
      { label: "Testing Equipment", slug: "testing-equipment" },
      { label: "Safety Gear", slug: "safety-gear" },
    ],
  },
  {
    label: "Specials",
    slug: "specials",
    children: [
      { label: "Featured Deals", slug: "featured-deals" },
      { label: "Clearance", slug: "clearance" },
    ],
  },
];

export function taxonomyHref(node: TaxonomyNode) {
  return `/search?category=${encodeURIComponent(node.slug)}`;
}
