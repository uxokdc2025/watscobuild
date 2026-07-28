import type { PdpProduct } from "./types";

/**
 * PDP registry. Add a product here and it gets a page at /pdp/<slug> and a
 * link on the Master index (/pdp). Each entry drives the same template.
 */

const glasflossZlp: PdpProduct = {
  slug: "glasfloss-zlp17h211",
  brand: "Glasfloss",
  brandKey: "gemaire",
  badges: [
    { label: "Best Value", tone: "solid", color: "violet" },
    { label: "Pro Essentials", tone: "soft", color: "blue" },
  ],
  title:
    'ZLP17H211 - Custom Z-Line Standard Capacity Pleated Filter, MERV 10, 17 1/2" X 21" X 1"',
  item: "ZLP17H211",
  mfg: "ZLP17H211",
  thumbnailCount: 7,
  description: {
    intro:
      "Custom Z-Line standard capacity throwaway pleated filter, MERV 10, built to the exact dimensions of the equipment it serves.",
  },
  specTabLabel: "Features and Specification",
  specGroupsLeft: [
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
  ],
  specGroupsRight: [
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
  ],
  commerce: {
    price: 38.42,
    uom: "EA",
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
    ],
  },
  fbt: [
    {
      label: "Equipment",
      items: [
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
    },
    {
      label: "Parts",
      items: [
        {
          id: "tp-e33",
          title: "TP-E33-3SP2 - 1/3 HP Direct Drive Blower Motor, 1075 RPM, 208-230V",
          item: "TP-E33-3SP2",
          mfg: "TP-E33-3SP2",
          branchQty: 42,
          branchName: "West Palm Beach #105",
          nearbyQty: 588,
        },
      ],
    },
    {
      label: "Supplies",
      items: [
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
    },
  ],
};

const tradeproEc13: PdpProduct = {
  slug: "tradepro-tp-ec13-50",
  brand: "TRADEPRO®",
  brandKey: "homans",
  sourceUrl:
    "https://arrow-sw-homans.wsm.wsoecom.ninja/product/TRADEPRO-TP-EC13-50-Blower-Motor-X-13-ECM-Variable-Speed-1075-RPM-115-208-230-V-6.3-4.0-3.8-Amps-1-2-1-3-HP/1111184500437961",
  store: { name: "Manchester, NH — Homans", hours: "Opens at 06:00" },
  title:
    "TRADEPRO® TP-EC13-50 Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230 V, 6.3/4.0-3.8 Amps, 1/2-1/3 HP",
  item: "TPEC1350",
  mfg: "TP-EC13-50",
  thumbnailCount: 7,
  description: {
    intro:
      "Universal ECM replacement for furnaces and air handlers. Improved reliability with built-in 6,000-volt surge protection and industry-leading moisture protection.",
    bullets: [
      "Replaces X13, Endura Pro and SelecTech constant-torque ECM",
      "Truck stock — universal replacement, ready to install",
      "Replaces thousands of OEM models",
      "Pre-programmed with Universal Program — no programming required",
      "Up to 82% efficiency",
    ],
    notes: [
      ["Inputs", "24 VAC, tap inputs"],
      ["Rotation", "Auto-rotation sensing"],
      ["Hertz", "60 & 50 Hz"],
      ["Operation mode", "Constant torque"],
      ["Construction", "NEMA 48 frame · Open Air Over (OAO) · belly-band mounting"],
    ],
  },
  specTabLabel: "Equipment Specification",
  specGroupsLeft: [
    {
      title: "Motor",
      rows: [
        { label: "Motor Type", value: "ECM (Electronically Commutated Motor)" },
        { label: "Motor HP", value: "1/3 – 1/2" },
        { label: "Number of Speeds", value: "Variable" },
        { label: "RPM", value: "1075" },
        { label: "Poles", value: "10" },
        { label: "Duty", value: "(S1) Continuous Running Duty" },
        { label: "Rotation", value: "Reversible" },
        { label: "Basis of Rotation View", value: "Lead End" },
      ],
    },
    {
      title: "Electrical",
      rows: [
        { label: "Voltage", value: "115 VAC, 208–230 VAC" },
        { label: "Amps", value: "3.8, 6.3" },
        { label: "Phase", value: "Single" },
        { label: "Cycle", value: "60 Hz" },
        { label: "Insulation Class", value: "B" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "Mechanical",
      rows: [
        { label: "NEMA Frame", value: "48Y" },
        { label: "Motor Enclosure", value: "Open Air Over (OPAO)" },
        { label: "Mounting Type", value: "Belly Band" },
        { label: "Bearing Type", value: "Ball" },
        { label: "Shaft Diameter", value: '0.5" (1/2")' },
        { label: "Shaft Length", value: '5.0"' },
      ],
    },
    {
      title: "General",
      rows: [
        { label: "Brand", value: "TRADEPRO®" },
        { label: "Country of Origin", value: "MEX" },
        { label: "Substantial Commodity", value: "Steel, Copper" },
        { label: "Prop 65", value: "No" },
      ],
    },
  ],
  comingSoonTabs: ["Part Lists", "Product Documentation"],
  // No `commerce`: source is sign-in gated, so signed-in also shows the gated state.
};

export const pdps: PdpProduct[] = [glasflossZlp, tradeproEc13];

export function getPdp(slug: string): PdpProduct | undefined {
  return pdps.find((p) => p.slug === slug);
}

export function getPdpSlugs(): string[] {
  return pdps.map((p) => p.slug);
}
