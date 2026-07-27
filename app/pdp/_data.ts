/**
 * Mock data for the v2 (Watsco B2B) PDP template.
 * Modeled on the Glasfloss ZLP17H211 filter from the reference screenshots.
 */

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

export const product = {
  brand: "Glasfloss",
  badges: [
    { label: "Best Value", tone: "solid" as const, color: "violet" as const },
    { label: "Pro Essentials", tone: "soft" as const, color: "blue" as const },
  ],
  title:
    'ZLP17H211 - Custom Z-Line Standard Capacity Pleated Filter, MERV 10, 17 1/2" X 21" X 1"',
  item: "ZLP17H211",
  mfg: "ZLP17H211",
  price: 38.42,
  uom: "EA",
  breadcrumb: [
    { label: "Home", href: "#" },
    {
      label:
        'ZLP17H211 - Custom Z-Line Standard Capacity Pleated Filter, MERV 10, 17 1/2" X 21" X 1"',
      href: "#",
    },
  ],
  description:
    "Custom Z-Line standard capacity throwaway pleated filter, MERV 10, built to the exact dimensions of the equipment it serves.",
  packSizes: ["Each", "12-Pk", "24-Pk", "36-Pk"],
  yourBranch: { name: "West Palm Beach #105", stock: 17 },
  nearbyBranches: [
    { qty: 0, name: "Melbourne #101" },
    { qty: 0, name: "Port St Lucie #103" },
    { qty: 37, name: "Boynton Beach #106" },
    { qty: 13, name: "Tamarac #108" },
    { qty: 320, name: "Pompano Beach #109" },
    { qty: 173, name: "Hollywood #111" },
    { qty: 643, name: "Kendall #116" },
  ] as Branch[],
  /** Number of thumbnails shown by the (locked) third-party gallery widget. */
  thumbnailCount: 7,
};

export const specGroupsLeft: SpecGroup[] = [
  {
    title: "Unit Size",
    rows: [
      { label: "Cubic Measurement", value: "0.2127" },
      { label: "Dimensional Weight", value: "3" },
      { label: "Height", value: "21" },
      { label: "Length", value: "1" },
      { label: "Weight", value: "0.533" },
      { label: "Width", value: "17.5" },
    ],
  },
  { title: "Data", rows: [{ label: "ERP ID", value: "345084" }] },
  {
    title: "Description",
    rows: [
      { label: "Brand", value: "Glasfloss" },
      { label: "Removes Fine Dust", value: "Yes" },
      { label: "Removes Smoke", value: "No" },
    ],
  },
  {
    title: "Ratings/Certifications",
    rows: [
      { label: "Country of Origin", value: "USA" },
      { label: "Prop 65", value: "Yes" },
    ],
  },
];

export const specGroupsRight: SpecGroup[] = [
  {
    title: "Filtration",
    rows: [
      { label: "Filter Efficiency", value: "40% to 85%" },
      { label: "Filter Rating (Microns)", value: "1.0 to 10.0" },
      { label: "Filter Type", value: "Throwaway" },
      { label: "Frame Type", value: "Beverage Board" },
      { label: "MERV Rating", value: "10" },
      { label: "Nominal Filter Height in Inches", value: "21" },
      { label: "Nominal Filter Size in Inches (W x H x D)", value: "17.5 × 21 × 1" },
      { label: "Nominal Filter Thickness in Inches", value: "1" },
      { label: "Pleats per Linear Feet", value: "14" },
    ],
  },
  {
    title: "Dimensional",
    rows: [{ label: "Nominal Filter Width in Inches", value: "17.5" }],
  },
  { title: "Packaging", rows: [{ label: "UOM", value: "EA" }] },
];

export const fbt: Record<"equipment" | "parts" | "supplies", FbtProduct[]> = {
  equipment: [
    {
      id: "rxbh05",
      title:
        "RXBH-1724C05J-B - Heater Kit, 5kW, 208-230/1/60 (Pullout Disconnect) With Smart Plug",
      item: "RXBH-1724C05J-B",
      mfg: "RXBH-1724C05J-B",
      branchQty: 153,
      branchName: "West Palm Beach #105",
      nearbyQty: 1206,
    },
    {
      id: "rxbh07",
      title:
        "RXBH-1724C07J-B - Heater Kit, 7kW, 208-230/1/60 (Pullout Disconnect) With Smart Plug",
      item: "RXBH-1724C07J-B",
      mfg: "RXBH-1724C07J-B",
      branchQty: 149,
      branchName: "West Palm Beach #105",
      nearbyQty: 1247,
    },
  ],
  parts: [
    {
      id: "tp-e33",
      title: "TP-E33-3SP2 - 1/3 HP Direct Drive Blower Motor, 1075 RPM, 208-230V",
      item: "TP-E33-3SP2",
      mfg: "TP-E33-3SP2",
      branchQty: 42,
      branchName: "West Palm Beach #105",
      nearbyQty: 588,
    },
    {
      id: "cap-1075",
      title: "43-25133-01 - Run Capacitor, 10 µF, 370V, Round",
      item: "43-25133-01",
      mfg: "43-25133-01",
      branchQty: 210,
      branchName: "West Palm Beach #105",
      nearbyQty: 3140,
    },
  ],
  supplies: [
    {
      id: "coil-clean",
      title: "CC-1G - Evaporator Coil Cleaner, Foaming, 1 Gallon",
      item: "CC-1G",
      mfg: "CC-1G",
      branchQty: 64,
      branchName: "West Palm Beach #105",
      nearbyQty: 902,
    },
  ],
};

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
