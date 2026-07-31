import type {
  PartItem,
  PdpDocument,
  PdpProduct,
  SpecGroup,
  SpecRow,
} from "./types";

/**
 * PDP registry. Add a product here and it gets a page at /pdp/<slug> and a
 * link on the Master index (/pdp). Each entry drives the same template.
 */

// Real TRADEPRO TP-EC13-50 product image (Gemaire CDN, verified 200).
const EC13_IMG =
  "https://cdn.gemaire.com/tradepro_tp-ec13-50_article_1111184500437961_en_normal?wid=700&hei=700&qlt=80";

// Real TP-EC13 documents (grouped under "Consumer Literature" per the source).
const EC13_DOCUMENTS: PdpDocument[] = [
  {
    label: "Consumer Literature",
    kind: "pdf",
    category: "Consumer Literature",
    href: "https://resource.gemaire.com/is/content/Watscocom/Gemaire/tradepro_motor-brochure-2021_en_cl.pdf",
  },
];

// Flat Equipment Specification rows (4-column list, per the source PDP).
const EC13_SPECS_FLAT: SpecRow[] = [
  { label: "amps", value: "3.8, 6.3" },
  { label: "Basis Of Rotation View", value: "Lead End" },
  { label: "Bearing Type", value: "Ball" },
  { label: "brand", value: "TRADEPRO®" },
  { label: "Country Of Origin", value: "MEX" },
  { label: "Cycle Hertz", value: "60 Hz" },
  { label: "duty", value: "(S1) Continuous Running Duty" },
  { label: "Insulation Class", value: "B" },
  { label: "Motor Enclosure", value: "Open Air Over (OPAO)" },
  { label: "Motor Hp", value: "1/3 - 1/2" },
  { label: "Motor Type", value: "ECM (Electronically Commutated Motor)" },
  { label: "Mounting Type", value: "Belly Band" },
  { label: "Nema Frame", value: "48Y" },
  { label: "Number Of Speeds", value: "Variable" },
  { label: "Online Only", value: "false" },
  { label: "phase", value: "Single" },
  { label: "poles", value: "10" },
  { label: "Prop 65", value: "false" },
  { label: "Reference Only", value: "false" },
  { label: "rotation", value: "Reversible" },
  { label: "rpm", value: "1075" },
  { label: "Shaft Diameter", value: '0.5" (1/2")' },
  { label: "Shaft Length", value: '5.0"' },
  { label: "Status In Erp", value: "active" },
  { label: "Substantial Commodity", value: "Steel, Copper" },
  { label: "voltage", value: "115 VAC, 208-230 VAC" },
];

// Related part shown in the "Parts" section — the 3/4 HP sibling (real image).
const EC13_PARTS: PartItem[] = [
  {
    id: "tp-ec13-75",
    title:
      "TP-EC13-75 - Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230 V, 9.3/5.8-5.4 Amps, 3/4 HP",
    item: "TP-EC13-75",
    mfg: "TP-EC13-75",
    image:
      "https://cdn.gemaire.com/tradepro_tp-ec13-75_article_1111184500437944_en_normal?wid=500&hei=500&qlt=80",
    branchQty: 6,
    branchName: "Mobile #251",
    nearbyQty: 9,
  },
];

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
  thumbnailCount: 1,
  images: [EC13_IMG],
  description: EC13_DESCRIPTION,
  documents: EC13_DOCUMENTS,
  parts: EC13_PARTS,
  specTabLabel: "Equipment Specification",
  specGroupsLeft: EC13_SPECS_LEFT,
  specGroupsRight: EC13_SPECS_RIGHT,
  specsFlat: EC13_SPECS_FLAT,
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
  thumbnailCount: 1,
  images: [EC13_IMG],
  description: EC13_DESCRIPTION,
  documents: EC13_DOCUMENTS,
  parts: EC13_PARTS,
  specTabLabel: "Equipment Specification",
  specGroupsLeft: EC13_SPECS_LEFT,
  specGroupsRight: EC13_SPECS_RIGHT,
  specsFlat: EC13_SPECS_FLAT,
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
  thumbnailCount: 1,
  images: ["/brand/baker/us-motors-9656.png"],
  description: {
    intro:
      "1/15 HP, 1550 RPM, 230V, RESCUE® Direct Drive Refrigeration Fan Blower Motor (OAO) Stud Mount",
    prop65: true,
  },
  specTabLabel: "Features and Specifications",
  specGroupsLeft: [],
  specGroupsRight: [],
  specsFlat: [
    { label: "Weight", value: "5" },
    { label: "Basis Of Rotation View", value: "Shaft End" },
    { label: "Bearing Type", value: "Ball" },
    { label: "Brand", value: "U.S. Motors" },
    { label: "Cubic Measurement", value: "0.0251" },
    { label: "Cycle/Hertz", value: "50/60 Hz" },
    { label: "Dimensional Weight", value: "2" },
    { label: "Duty", value: "(S1) Continuous Running Duty" },
    { label: "EAN", value: "0786382010973" },
    { label: "Height", value: "3.39" },
    { label: "Insulation Class", value: "B" },
    { label: "Length", value: "3.78" },
    { label: "Motor Enclosure", value: "Open Air Over (OPAO)" },
    { label: "Motor HP", value: "1/15" },
    { label: "Motor Type", value: "PSC (Permanent Split Capacitor)" },
    { label: "NEMA Frame", value: "3.3" },
    { label: "Number of Speeds", value: "1" },
    { label: "Phase", value: "Single" },
    { label: "Poles", value: "4" },
    { label: "Prop 65", value: "No" },
    { label: "Rotation", value: "Clockwise (CW)" },
    { label: "RPM", value: "1,550" },
    { label: "Service Factor", value: "1" },
    { label: "Shaft Diameter", value: '0.3125" (5/16")' },
    { label: "Shaft Length", value: '3"' },
    { label: "UOM", value: "EA" },
    { label: "UPC", value: "786382010973" },
    { label: "Voltage", value: "230 VAC" },
    { label: "Width", value: "3.39" },
    { label: "Country of Origin", value: "CHN" },
    { label: "Substantial Commodity", value: "Steel; Copper" },
    { label: "Approvals", value: "UL Recognized" },
  ],
  documents: [
    { label: "specification sheet", kind: "pdf", href: "#" },
    { label: "wiring diagrams", kind: "pdf", href: "#" },
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
  fbt: [
    {
      label: "Frequently Bought Together",
      items: [
        { id: "tmg-10acic", title: "Tmg Co. - 10ACIC - Acetylene (C2H2) Contents Only", item: "10ACIC", mfg: "10ACIC", image: "/brand/baker/compressed-gas.webp", price: 26.62, branchQty: 15, branchName: "Baker Jacksonville #301", nearbyQty: 76 },
        { id: "heatcraft-5140c", title: "Interlink Heatcraft - 5140C - 12 CW, 5 Blade Fan, 5/16 Bore, 23° Pitch", item: "5140C", mfg: "5140C", image: "https://resource.bakerdist.com/is/image/Watscocom/heatcraft_5140c_article_1416399936833_en_normal?defaultImage=Baker_No_Image&wid=400&hei=400&qlt=80", price: 50.3, branchQty: 107, branchName: "Baker Jacksonville #301", nearbyQty: 7 },
        { id: "tmg-40nic", title: "Tmg Co. - 40NIC - Industrial Nitrogen 40 Contents Only", item: "40NIC", mfg: "40NIC", image: "/brand/baker/compressed-gas.webp", price: 16.79, branchQty: 3, branchName: "Baker Jacksonville #301", nearbyQty: 56 },
      ],
    },
  ],
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
  images: [
    "https://resource.peirce.com/is/image/Watscocom/factory-authorized-parts_58mv660006_article_1411645331538_en_normal?wid=700&hei=700&qlt=80",
  ],
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

// Carrier Scene7 image for a related product, by its "<slug>_article_<id>" key.
const ceImg = (key: string) =>
  `https://resource.carrierenterprise.com/is/image/Watscocom/${key}_en_normal?wid=400&hei=400&qlt=80`;

const ecmImg = (key: string) =>
  `https://resource.ecmdi.com/is/image/Watscocom/${key}_en_normal?wid=400&hei=400&qlt=80`;

const carrierTpE50: PdpProduct = {
  slug: "carrier-tp-e50-3sp2",
  brand: "TRADEPRO®",
  brandKey: "carrier",
  store: { name: "Ybor City #2541" },
  title:
    "TRADEPRO® - Blower Motor Direct Drive - PSC 208-230 VAC 1,075 RPM 1/2 HP 3-Speed",
  item: "TP-E50-3SP2",
  mfg: "TP-E50-3SP2",
  thumbnailCount: 7,
  images: [
    "normal",
    "ai1",
    "ai2",
    "ai3",
    "ai4",
    "spibs12r01c12",
    "spis29r02c05",
  ].map(
    (v) =>
      `https://resource.carrierenterprise.com/is/image/Watscocom/tradepro_tp-e50-3sp2_article_1418039133491_en_${v}?wid=700&hei=700&qlt=80`
  ),
  detailsStyle: "about",
  description: {
    intro:
      "TRADEPRO® fixed fractional condenser motor — heavy-duty construction and rugged durability built for HVAC professionals.",
    bullets: [
      "Universal fixed fractional condenser motor",
      "208 - 230V",
      "Single phase",
      "2.7 amp draw",
      "Speeds - 800, 950, 1075",
      "48Y frame",
      '5" keyed shaft',
      '1/2" diameter',
      "10MF 370 or 440V capacitor",
      "Side shell mount is pre-drilled to accept mount wings and resilient mount wings",
      "Dynamic self-aligning bearing with reversible direction",
    ],
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
  productSpecs: [
    {
      title: "Dimensions",
      rows: [
        { label: "Length", value: "6.402 inches (in)" },
        { label: "Width", value: "5.625 inches (in)" },
        { label: "Height", value: "5.625 inches (in)" },
        { label: "Weight", value: "17.38 pounds (lbs)" },
      ],
    },
    {
      title: "Attributes",
      rows: [
        { label: "Approvals", value: "UL Recognized" },
        { label: "Basis Of Rotation View", value: "Lead End" },
        { label: "Bearing Type", value: "Self Aligning (SAB)" },
        { label: "Brand", value: "TRADEPRO®" },
        { label: "Country of Origin", value: "MEX" },
        { label: "Cubic Measurement", value: "0.1172" },
        { label: "Cycle/Hertz", value: "60 Hz" },
        { label: "Horsepower", value: "1/2" },
        { label: "Phase", value: "Single" },
        { label: "RPM", value: "1,075" },
        { label: "Speeds", value: "3-Speed" },
        { label: "Voltage", value: "208-230 VAC" },
      ],
    },
  ],
  documents: [
    { label: "Consumer Literature", kind: "pdf", category: "Consumer Literature", href: "#" },
    { label: "Product Data", kind: "pdf", category: "Product Data", href: "#" },
  ],
  fbt: [
    {
      label: "Best Sellers",
      items: [
        { id: "tp-c25-1sp2", title: "TRADEPRO® - Condenser Motor - PSC 208-230 VAC 1,075 RPM 1/4 HP 1-Speed", item: "TP-C25-1SP2", mfg: "TP-C25-1SP2", image: ceImg("tradepro_tp-c25-1sp2_article_1418039133435"), branchQty: 0, branchName: "", nearbyQty: 0, price: 77.1, points: 1, stockStatus: "IN STOCK", stockBranch: "Ybor City #2541" },
        { id: "tp-c33-1sp2", title: "TRADEPRO® - Condenser Motor - PSC 208-230 VAC 1,075 RPM 1/3 HP 1-Speed", item: "TP-C33-1SP2", mfg: "TP-C33-1SP2", image: ceImg("tradepro_tp-c33-1sp2_article_1418039132335"), branchQty: 0, branchName: "", nearbyQty: 0, price: 94.8, points: 1, stockStatus: "AVAILABLE", stockBranch: "Other Branches" },
        { id: "tp-e33-3sp2", title: "TRADEPRO® - Blower Motor Direct Drive - PSC 208-230 VAC 1,075 RPM 1/3 HP 3-Speed", item: "TP-E33-3SP2", mfg: "TP-E33-3SP2", image: ceImg("tradepro_tp-e33-3sp2_article_1418039134489"), branchQty: 0, branchName: "", nearbyQty: 0, price: 90.3, points: 1, stockStatus: "IN STOCK", stockBranch: "Ybor City #2541" },
        { id: "tp-cap-10-440usa", title: "TRADEPRO® - 10MFD 370/440 VAC Oval Single Run Capacitor (Made in the USA)", item: "TP-CAP-10/440USA", mfg: "TP-CAP-10/440USA", image: ceImg("tradepro_tp-cap-10-440usa_article_2126576031128668"), branchQty: 0, branchName: "", nearbyQty: 0, price: 11.6, stockStatus: "IN STOCK", stockBranch: "Ybor City #2541" },
        { id: "tp-e33-3sp1", title: "TRADEPRO® - Blower Motor Direct Drive - PSC 115 VAC 1,075 RPM 1/3 HP 3-Speed", item: "TP-E33-3SP1", mfg: "TP-E33-3SP1", image: ceImg("tradepro_tp-e33-3sp1_article_1418039136075"), branchQty: 0, branchName: "", nearbyQty: 0, price: 88.2, points: 1, stockStatus: "IN STOCK", stockBranch: "Ybor City #2541" },
        { id: "tp-c50-1sp2", title: "TRADEPRO® - Condenser Motor - PSC 208-230 VAC 1,075 RPM 1/2 HP 1-Speed", item: "TP-C50-1SP2", mfg: "TP-C50-1SP2", image: ceImg("tradepro_tp-c50-1sp2_article_1418039136131"), branchQty: 0, branchName: "", nearbyQty: 0, price: 103.5, points: 2, stockStatus: "IN STOCK", stockBranch: "Ybor City #2541" },
      ],
    },
    {
      label: "Other",
      items: [
        { id: "all-access-83412", title: "ALL-ACCESS® - Overflow Shut Off Switch", item: "83412", mfg: "83412", image: ceImg("all-access_83412_article_3095504903732323"), branchQty: 0, branchName: "", nearbyQty: 0, price: 29.9, stockStatus: "IN STOCK", stockBranch: "Ybor City #2541" },
        { id: "aquaguard-96100", title: "Aquaguard® - Leading Magnetic Float Switch", item: "AG-1100", mfg: "96100", image: ceImg("aquaguard_96100_article_1389111991663"), branchQty: 0, branchName: "", nearbyQty: 0, price: 24.6, stockStatus: "IN STOCK", stockBranch: "Ybor City #2541" },
      ],
    },
  ],
  substitutes: [
    { id: "hc43ae200", title: "Factory Authorized Parts™ - HC43AE200 Blower Motor", item: "HC43AE200", mfg: "HC43AE200", image: ceImg("factory-authorized-parts_hc43ae200_article_1411645327495"), price: 742.7, points: 14 },
    { id: "p257-8588", title: "TOTALINE® - Blower Motor Direct Drive - PSC 208-230 VAC 1,075 RPM 1/2 HP 3-Speed", item: "P257-8588", mfg: "P257-8588", image: ceImg("totaline_psc-direct-drive-blower"), price: 272.4, points: 5 },
  ],
  recentlyViewed: [
    {
      id: "58mv660006",
      title: "Factory Authorized Parts™ - Blower Motor - ECM 120/240 VAC 1,050 RPM 1/2 HP",
      item: "58MV660006",
      mfg: "58MV660006",
      image:
        "https://resource.peirce.com/is/image/Watscocom/factory-authorized-parts_58mv660006_article_1411645331538_en_normal?wid=400&hei=400&qlt=80",
      branchQty: 0,
      branchName: "",
      nearbyQty: 0,
    },
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
  thumbnailCount: 1,
  images: [
    "https://resource.ecmdi.com/is/image/Watscocom/diversitech_pf-kit_article_1375441854867_en_normal?wid=700&hei=700&qlt=80",
  ],
  description: {
    intro:
      "Non-VOC, residue-free flushing solvent kit for R-410A retrofits, refrigerant conversions and compressor burnouts — compatible with all refrigerants and compressor oils. Makes servicing quick, easy and safe with all necessary hardware on hand for 1-stop servicing.",
    bullets: [
      "8 oz container of Pro-Flush™ solvent",
      "Refillable Pro-Flush™ injector tool pressure tank",
      "Pressure relief valve for added safety",
      'Large rubber adapter that flushes up to 1-1/4" line sets',
      "Service hose",
    ],
    prop65: true,
  },
  documents: [
    { label: "Consumer Catalog", kind: "pdf", href: "#" },
    { label: "Safety Data Sheet", kind: "pdf", href: "#" },
    { label: "Installation Instructions", kind: "pdf", href: "#" },
  ],
  specTabLabel: "Specifications",
  specGroupsLeft: [],
  specGroupsRight: [],
  specsFlat: [
    { label: "Weight", value: "3.65" },
    { label: "Height", value: "12" },
    { label: "Length", value: "3.6" },
    { label: "Width", value: "6.75" },
    { label: "Brand", value: "DiversiTech®" },
    { label: "Cubic Measurement", value: "0.1688" },
    { label: "Dimensional Weight", value: "3" },
    { label: "EAN", value: "0095247128952" },
    { label: "Prop 65", value: "No" },
    { label: "Size", value: "16 Ounce" },
    { label: "Type", value: "Flushing Solvent Kit" },
    { label: "UOM", value: "EA" },
    { label: "UPC", value: "095247128952" },
  ],
  fbt: [
    {
      label: "Frequently Bought Together",
      items: [
        { id: "diversitech-pf-16", title: "DiversiTech® - PF-16 Pro-Flush™ Flushing Solvent 16 oz.", item: "PF-16", mfg: "PF-16", image: ecmImg("diversitech_pf-16_article_1375441857788"), price: 34.9, branchQty: 12, branchName: "Durham NC #1", nearbyQty: 40 },
        { id: "diversitech-750-rc841", title: "DiversiTech® - 750-RC841 Refrigerant Recovery Cylinder", item: "750-RC841", mfg: "750-RC841", image: ecmImg("diversitech_750-rc841_article_1379329921784"), price: 89.6, branchQty: 6, branchName: "Durham NC #1", nearbyQty: 18 },
        { id: "southwark-6s120", title: "Southwark - 6S120 Sheet Metal Fitting", item: "6S120", mfg: "6S120", image: ecmImg("southwark_6s120_article_1386941903341"), price: 12.4, branchQty: 30, branchName: "Durham NC #1", nearbyQty: 120 },
        { id: "southwark-97ls", title: "Southwark - 97LS Sheet Metal Fitting", item: "97LS", mfg: "97LS", image: ecmImg("southwark_97ls"), price: 9.8, branchQty: 22, branchName: "Durham NC #1", nearbyQty: 96 },
        { id: "royce-plenum-box", title: "Royce® - Plenum Box", item: "PLENUM-BOX", mfg: "PLENUM-BOX", image: ecmImg("royce_plenum-box"), price: 46.2, branchQty: 8, branchName: "Durham NC #1", nearbyQty: 24 },
        { id: "tutco-hk-heater-kits", title: "Tutco® - HK Heater Kit", item: "HK-HEATER-KIT", mfg: "HK-HEATER-KIT", image: ecmImg("tutco_hk-heater-kits"), price: 58.7, branchQty: 5, branchName: "Durham NC #1", nearbyQty: 15 },
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

// v2 demo — East Coast Pro-Flush with the pack-size PILLS control (Each / 12-Pk,
// the client's "few options" case). Everything else identical to v1.
const ecmdiProFlushV2: PdpProduct = {
  ...ecmdiProFlush,
  slug: "ecmdi-pro-flush-v2",
  commerce: {
    ...ecmdiProFlush.commerce!,
    packSizes: ["Each", "12-Pk"],
  },
};

// ── Use case: Replacement Products (discontinued item → replacement) ──
const ucReplacement: PdpProduct = {
  slug: "uc-replacement-products",
  brand: "AmRad",
  brandKey: "ecmdi",
  useCase: "Replacement Products",
  store: { name: "Durham NC #1" },
  badges: [
    { label: "Replacement Product Available", tone: "soft", color: "amber" },
  ],
  title: "CAB050400440CT Dual Round Capacitor - 40/5 MFD - 440V",
  item: "366572A",
  mfg: "CAB050400440CT",
  thumbnailCount: 1,
  status: "replaced",
  description: {
    intro:
      "Dual round run capacitor — 40/5 MFD, 440V. This item has been superseded; see the replacement product for the current equivalent.",
  },
  specTabLabel: "Specifications",
  specGroupsLeft: [
    {
      title: "Capacitor",
      rows: [
        { label: "Type", value: "Dual Run Capacitor" },
        { label: "Shape", value: "Round" },
        { label: "Capacitance", value: "40 / 5 MFD" },
        { label: "Voltage", value: "440 VAC" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "General",
      rows: [
        { label: "Tolerance", value: "±6%" },
        { label: "Frequency", value: "50 / 60 Hz" },
      ],
    },
  ],
  replacements: [
    {
      id: "cap050400440rtp",
      title: "CAP050400440RTP Dual Round Capacitor - 40/5 MFD - 440V",
      item: "379287A",
      mfg: "CAP050400440RTP",
      image:
        "https://cdn.ecmdi.com/na_cap050400440rtp_article_16648380127855147_en_normal?wid=400&hei=400&qlt=80",
    },
  ],
};

// ── Use case: AHRI Matched System (badge + View System Details link) ──
const ucAhri: PdpProduct = {
  slug: "uc-ahri-matched-system",
  brand: "Goodman",
  brandKey: "ecmdi",
  useCase: "AHRI Matched System",
  store: { name: "Durham NC #1" },
  badges: [{ label: "AHRI Matched System", tone: "soft", color: "blue" }],
  title: "GLZS4B Series 3-1/2 Ton Split System Heat Pump - 14.3 SEER2 - R-32",
  item: "378798A",
  mfg: "GLZS4BA4210",
  thumbnailCount: 1,
  ahri: { number: "213895723" },
  description: {
    intro:
      "3-1/2 ton split-system heat pump, 14.3 SEER2, R-32 refrigerant. Part of an AHRI certified matched system — see the AHRI reference for the matched indoor/outdoor combination.",
  },
  specTabLabel: "Specifications",
  specGroupsLeft: [
    {
      title: "System",
      rows: [
        { label: "Nominal Capacity", value: "3-1/2 Ton (42,000 BTU)" },
        { label: "Efficiency", value: "14.3 SEER2" },
        { label: "System Type", value: "Split System Heat Pump" },
        { label: "Refrigerant", value: "R-32" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "Electrical",
      rows: [
        { label: "Voltage", value: "208/230V" },
        { label: "Phase", value: "1" },
      ],
    },
  ],
  commerce: {
    price: 2389.0,
    uom: "EA",
    yourBranch: { name: "Durham NC #1", stock: 3 },
    nearbyBranches: [
      { qty: 2, name: "Raleigh NC #5" },
      { qty: 5, name: "Greensboro NC #6" },
    ],
  },
};

// ── Use case: Pack Size (segmented → pills; one or many options) ──
const ucPackSize: PdpProduct = {
  slug: "uc-pack-size",
  brand: "RectorSeal",
  brandKey: "gemaire",
  useCase: "Pack Size",
  title: "Safe-T-Switch® SS2 - Condensate Overflow Shutoff Switch",
  item: "97087",
  mfg: "97087",
  thumbnailCount: 1,
  description: {
    intro:
      "Safe-T-Switch SS2 condensate overflow shutoff switch — installs in the secondary drain line to shut down the system on overflow. Sold individually or by the 12-pack.",
  },
  specTabLabel: "Specifications",
  specGroupsLeft: [
    {
      title: "General",
      rows: [
        { label: "Type", value: "Condensate Overflow Switch" },
        { label: "Mount", value: "Secondary Drain Line" },
        { label: "Contacts", value: "Normally Closed" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "Electrical",
      rows: [
        { label: "Voltage", value: "24 VAC" },
        { label: "Rating", value: "5 A" },
      ],
    },
  ],
  commerce: {
    price: 16.9,
    uom: "EA",
    packSizes: ["Each", "12-Pk"],
    yourBranch: { name: "Mobile #251", stock: 48 },
    nearbyBranches: [
      { qty: 120, name: "Pensacola #253" },
      { qty: 64, name: "Panama City #257" },
    ],
  },
};

// ── Use case: Bundle & $200 Rebate (promo badge + Included In Bundle) ──
const ucBundle: PdpProduct = {
  slug: "uc-bundle-rebate",
  brand: "Bryant®",
  brandKey: "carrier",
  useCase: "Bundle & $200 Rebate",
  store: { name: "Ybor City #2541" },
  badges: [{ label: "$200 Instant Rebate", tone: "solid", color: "green" }],
  title: "Bryant® - 5 Ton 16 SEER Straight Cool Bundle R-454B",
  item: "CE-PA5-5-AC-D60",
  mfg: "CE-PA5SAN56000W-PF5MNXD60L00",
  thumbnailCount: 1,
  description: {
    intro:
      "Matched 5-ton, 16 SEER2 straight-cool system bundle (R-454B) — condenser and fan coil sold together with a $200 instant rebate.",
  },
  specTabLabel: "Specifications",
  specGroupsLeft: [
    {
      title: "System",
      rows: [
        { label: "Tonnage", value: "5 Ton" },
        { label: "SEER2", value: "Up to 16" },
        { label: "Refrigerant", value: "R-454B" },
        { label: "Type", value: "Straight Cool" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "Bundle",
      rows: [
        { label: "Condenser", value: "PA5SAN56000W" },
        { label: "Fan Coil", value: "PF5MNXD60L00" },
      ],
    },
  ],
  bundleItems: [
    {
      id: "pa5san56000w",
      title: "5 Ton Up to 16 SEER2 Air Conditioner Condenser Unit (R-454B)",
      item: "PA5SAN56000W",
      mfg: "PA5SAN56000W",
    },
    {
      id: "pf5mnxd60l00",
      title: "5 Ton Residential Fan Coil Multipoise R-454B (Aluminum Coil)",
      item: "PF5MNXD60L00",
      mfg: "PF5MNXD60L00",
    },
  ],
  commerce: {
    price: 6842.0,
    uom: "EACH",
    yourBranch: { name: "Ybor City #2541", stock: 3 },
    nearbyBranches: [{ qty: 12, name: "Other Branches" }],
  },
};

// ── Use case: Earning Points (CE Rewards points on purchase) ──
const ucPoints: PdpProduct = {
  slug: "uc-earning-points",
  brand: "RCD Corporation®",
  brandKey: "carrier",
  useCase: "Earning Points",
  store: { name: "Ybor City #2541" },
  title: "RCD Corporation® - 106002 #6 Mastic® - 2 gal. Pail",
  item: "RCD6-2GAL",
  mfg: "106002",
  thumbnailCount: 1,
  description: {
    intro:
      "#6 Mastic water-based duct sealant, 2-gallon pail. Earns CE Rewards points on every purchase.",
  },
  specTabLabel: "Specifications",
  specGroupsLeft: [
    {
      title: "General",
      rows: [
        { label: "Type", value: "Water-Based Duct Mastic" },
        { label: "Container", value: "2 gal. Pail" },
        { label: "Color", value: "Gray" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "Application",
      rows: [
        { label: "Use", value: "Duct Sealing" },
        { label: "Coverage", value: "~110 lb/gal solids" },
      ],
    },
  ],
  commerce: {
    price: 44.9,
    uom: "EACH",
    points: 1,
    yourBranch: { name: "Ybor City #2541", stock: 26 },
    nearbyBranches: [{ qty: 58, name: "Other Branches" }],
  },
};

// ── Use case: Non-Sellable (not available for online purchase) ──
const ucNonSellable: PdpProduct = {
  slug: "uc-non-sellable",
  brand: "Empire",
  brandKey: "peirce",
  useCase: "Non-Sellable",
  store: { name: "Norristown, PA" },
  badges: [{ label: "Non-Sellable", tone: "soft", color: "slate" }],
  title: "9 in. True Blue Professional Torpedo Level",
  item: "EM819G",
  mfg: "EM81.9G",
  thumbnailCount: 1,
  images: [
    "https://resource.peirce.com/is/image/Watscocom/empire_em819g_article_1604089103823369_en_normal?wid=700&hei=700&qlt=80",
  ],
  status: "non-sellable",
  description: {
    intro:
      "9 in. True Blue professional magnetic torpedo level. This item is catalog-reference only and is not available for online purchase.",
  },
  specTabLabel: "Specifications",
  specGroupsLeft: [
    {
      title: "General",
      rows: [
        { label: "Length", value: "9 in." },
        { label: "Vials", value: "3 (plumb, level, 45°)" },
        { label: "Magnetic", value: "Yes" },
      ],
    },
  ],
  specGroupsRight: [
    {
      title: "Material",
      rows: [
        { label: "Frame", value: "Aluminum" },
        { label: "Finish", value: "True Blue" },
      ],
    },
  ],
};

export const pdps: PdpProduct[] = [
  glasflossZlp,
  tradeproEc13Homans,
  tradeproEc13Gemaire,
  carrierTpE50,
  usMotors9656Baker,
  peirce58mv,
  ecmdiProFlush,
  ecmdiProFlushV2,
  ucReplacement,
  ucAhri,
  ucPackSize,
  ucBundle,
  ucPoints,
  ucNonSellable,
];

export function getPdp(slug: string): PdpProduct | undefined {
  return pdps.find((p) => p.slug === slug);
}

export function getPdpSlugs(): string[] {
  return pdps.map((p) => p.slug);
}
