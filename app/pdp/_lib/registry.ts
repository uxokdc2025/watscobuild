import type { PdpProduct, SpecGroup } from "./types";

/**
 * PDP registry. Add a product here and it gets a page at /pdp/<slug> and a
 * link on the Master index (/pdp). Each entry drives the same template.
 */

// Real TRADEPRO TP-EC13-50 product image (Gemaire CDN, verified 200).
const EC13_IMG =
  "https://cdn.gemaire.com/tradepro_tp-ec13-50_article_1111184500437961_en_normal?wid=700&hei=700&qlt=80";

// Shared TP-EC13-50 specs (same motor, sold by Homans, Gemaire, Carrier, ...).
const EC13_SPECS_LEFT: SpecGroup[] = [
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
];
const EC13_SPECS_RIGHT: SpecGroup[] = [
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
];
const EC13_DESCRIPTION = {
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
  ] as [string, string][],
};

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

const tradeproEc13Homans: PdpProduct = {
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
  thumbnailCount: 2,
  images: [EC13_IMG],
  description: EC13_DESCRIPTION,
  specTabLabel: "Equipment Specification",
  specGroupsLeft: EC13_SPECS_LEFT,
  specGroupsRight: EC13_SPECS_RIGHT,
  comingSoonTabs: ["Part Lists", "Product Documentation"],
  // Homans signed-in: price hidden, fulfillment is call-based.
  commerce: { price: null, uom: "EA", fulfillmentNote: "Call for availability" },
};

const tradeproEc13Gemaire: PdpProduct = {
  slug: "gemaire-tp-ec13-50",
  brand: "TRADEPRO®",
  brandKey: "gemaire",
  title:
    "TP-EC13-50 - Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230 V, 6.3/4.0-3.8 Amps, 1/2-1/3 HP",
  item: "TP-EC13-50",
  mfg: "TP-EC13-50",
  thumbnailCount: 2,
  images: [EC13_IMG],
  description: EC13_DESCRIPTION,
  specTabLabel: "Equipment Specification",
  specGroupsLeft: EC13_SPECS_LEFT,
  specGroupsRight: EC13_SPECS_RIGHT,
  // Gemaire signed-in: real price + branch availability.
  commerce: {
    price: 269.71,
    uom: "EA",
    yourBranch: { name: "Mobile #251", stock: 1 },
    nearbyBranches: [
      { qty: 4, name: "New Port Richey #151" },
      { qty: 1, name: "Ocala #206" },
      { qty: 7, name: "Pensacola #253" },
      { qty: 0, name: "Ft Walton #255" },
      { qty: 37, name: "Panama City #257" },
      { qty: 44, name: "Valdosta #263" },
    ],
  },
};

const usMotors9656Baker: PdpProduct = {
  slug: "baker-us-motors-9656",
  brand: "U.S. Motors",
  brandKey: "baker",
  store: { name: "Baker Jacksonville #301" },
  title:
    "U.S. Motors - 9656 - 1/15 HP, 1550 RPM, 230V, RESCUE® Direct Drive Refrigeration Fan Blower Motor (OAO) Stud Mount",
  item: "US9656",
  mfg: "9656",
  thumbnailCount: 4,
  description: {
    intro:
      "RESCUE® direct-drive refrigeration fan / blower motor. Open Air Over (OAO) enclosure, stud mount.",
  },
  specTabLabel: "Specifications",
  specGroupsLeft: [
    {
      title: "Motor",
      rows: [
        { label: "Horsepower", value: "1/15 HP" },
        { label: "RPM", value: "1550" },
        { label: "Drive", value: "Direct Drive" },
        { label: "Application", value: "Refrigeration Fan / Blower" },
      ],
    },
  ],
  specGroupsRight: [
    { title: "Electrical", rows: [{ label: "Voltage", value: "230V" }] },
    {
      title: "Mechanical",
      rows: [
        { label: "Enclosure", value: "Open Air Over (OAO)" },
        { label: "Mounting", value: "Stud Mount" },
      ],
    },
  ],
  commerce: {
    price: 101.22,
    uom: "EA",
    yourBranch: { name: "Baker Jacksonville #301", stock: 12 },
    nearbyBranches: [
      { qty: 1, name: "Baker Orange Park #358" },
      { qty: 1, name: "Baker Jacksonville #314" },
      { qty: 1, name: "Baker St Augustine #367" },
    ],
  },
};

const peirce58mv: PdpProduct = {
  slug: "peirce-58mv660006",
  brand: "Factory Authorized Parts",
  brandKey: "peirce",
  store: { name: "Norristown, PA" },
  title:
    "Factory Authorized Parts™ - 58MV660006 Blower Motor 1/2 HP 120/240 V 7.7/4.3 Amp 1050 RPM",
  item: "58MV660006",
  mfg: "58MV660006",
  thumbnailCount: 1,
  description: {
    intro: "Factory Authorized Parts blower motor, 1/2 HP, 1050 RPM.",
  },
  specTabLabel: "Specification",
  specGroupsLeft: [
    {
      title: "Motor",
      rows: [
        { label: "Horsepower", value: "1/2 HP" },
        { label: "RPM", value: "1050" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "Electrical",
      rows: [
        { label: "Voltage", value: "120/240 V" },
        { label: "Amps", value: "7.7/4.3" },
      ],
    },
  ],
  commerce: {
    price: 1548.95,
    uom: "Each",
    yourBranch: { name: "Norristown, PA", stock: 5 },
    nearbyBranches: [{ qty: 173, name: "All Branches" }],
  },
};

const carrierTpE50: PdpProduct = {
  slug: "carrier-tp-e50-3sp2",
  brand: "TRADEPRO®",
  brandKey: "carrier",
  store: { name: "Ybor City #2541" },
  title:
    "TRADEPRO® - Blower Motor Direct Drive - PSC 208-230 VAC 1,075 RPM 1/2 HP 3-Speed",
  item: "TP-E50-3SP2",
  mfg: "TP-E50-3SP2",
  thumbnailCount: 1,
  images: [
    "https://resource.carrierenterprise.com/is/image/Watscocom/tradepro_tp-e50-3sp2_article_1418039133491_en_normal?wid=700&hei=700&qlt=80",
  ],
  description: {
    intro: "TRADEPRO PSC direct-drive blower motor, 3-speed.",
  },
  specTabLabel: "Equipment Specification",
  specGroupsLeft: [
    {
      title: "Motor",
      rows: [
        { label: "Type", value: "PSC Direct Drive" },
        { label: "Horsepower", value: "1/2 HP" },
        { label: "RPM", value: "1075" },
        { label: "Speeds", value: "3-Speed" },
      ],
    },
  ],
  specGroupsRight: [
    { title: "Electrical", rows: [{ label: "Voltage", value: "208-230 VAC" }] },
  ],
  commerce: {
    price: 110.1,
    uom: "EACH",
    yourBranch: { name: "Ybor City #2541", stock: 0 },
    nearbyBranches: [{ qty: 45, name: "Other Branches" }],
  },
};

const ecmdiProFlush: PdpProduct = {
  slug: "ecmdi-pro-flush-80866",
  brand: "DiversiTech®",
  brandKey: "ecmdi",
  store: { name: "Durham NC #1" },
  badges: [{ label: "Pro Essentials", tone: "soft", color: "blue" }],
  title: "Pro-Flush™ Flushing Solvent Refill Kit - 8 oz.",
  item: "80866",
  mfg: "PF-KIT",
  thumbnailCount: 6,
  description: {
    intro:
      "Pro-Flush flushing solvent refill kit, 8 oz — for flushing A/C and refrigeration line sets.",
  },
  specTabLabel: "Specifications",
  specGroupsLeft: [
    {
      title: "Product",
      rows: [
        { label: "Type", value: "Flushing Solvent" },
        { label: "Size", value: "8 oz." },
        { label: "Brand", value: "DiversiTech®" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "Application",
      rows: [
        { label: "Use", value: "A/C & Refrigeration Systems" },
        { label: "Kit", value: "Refill" },
      ],
    },
  ],
  commerce: {
    price: 266.34,
    uom: "EA",
    yourBranch: { name: "Durham NC #1", stock: 4 },
    nearbyBranches: [
      { qty: 3, name: "Raleigh NC #5" },
      { qty: 3, name: "Greensboro NC #6" },
      { qty: 3, name: "Fayetteville NC #38" },
      { qty: 5, name: "Aberdeen NC #39" },
    ],
  },
};

export const pdps: PdpProduct[] = [
  glasflossZlp,
  tradeproEc13Homans,
  tradeproEc13Gemaire,
  carrierTpE50,
  usMotors9656Baker,
  peirce58mv,
  ecmdiProFlush,
];

export function getPdp(slug: string): PdpProduct | undefined {
  return pdps.find((p) => p.slug === slug);
}

export function getPdpSlugs(): string[] {
  return pdps.map((p) => p.slug);
}
