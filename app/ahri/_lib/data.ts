import type { FbtProduct } from "@/app/pdp/_lib/types";

/* ──────────────────────────────────────────────────────────────────────────
 * AHRI System Builder — data model
 *
 * An AHRI "system" is a certified combination of matched components (an
 * outdoor unit + indoor coil, optionally a gas furnace or air handler). Each
 * carries the performance ratings that define the match (SEER2 / EER2 / HSPF2
 * / AFUE / capacity) and the attributes the builder filters on.
 *
 * Reference flows: ecmdi.com (East Coast) and Peirce-Phelps (arrow-pp). The
 * anchor outdoor unit is the Goodman GLZS4B 3-1/2 ton heat pump already in the
 * PDP registry (slug `uc-ahri-matched-system`, AHRI #213895723).
 * ────────────────────────────────────────────────────────────────────────── */

export type SystemTypeId =
  | "furnace-coil"
  | "air-handler"
  | "indoor-coil"
  | "mobile-home";

export type SystemType = {
  id: SystemTypeId;
  label: string;
  tagline: string;
  /** lucide icon name, resolved in the UI layer */
  icon: "flame" | "fan" | "snowflake" | "home";
};

export const SYSTEM_TYPES: SystemType[] = [
  {
    id: "furnace-coil",
    label: "Furnace + Indoor Coil",
    tagline: "Pair a gas furnace and cased coil with your outdoor unit.",
    icon: "flame",
  },
  {
    id: "air-handler",
    label: "Air Handler",
    tagline: "Match an air handler to a heat pump or condenser.",
    icon: "fan",
  },
  {
    id: "indoor-coil",
    label: "Indoor Coil Only",
    tagline: "Find a cased or uncased coil that matches your system.",
    icon: "snowflake",
  },
  {
    id: "mobile-home",
    label: "Mobile Home Coils",
    tagline: "Coils engineered for manufactured-home applications.",
    icon: "home",
  },
];

export type ComponentKind = "outdoor" | "coil" | "furnace" | "air-handler";

export type AhriComponent = {
  id: string;
  kind: ComponentKind;
  role: string; // "Outdoor Unit" · "Indoor Coil" · "Gas Furnace" · "Air Handler"
  brand: string;
  title: string;
  model: string; // MFG part number
  item: string; // distributor item number
  image?: string;
  price: number;
  branchQty: number;
  branchName: string;
  allBranchesQty: number;
  specs: { label: string; value: string }[];
};

export type AhriSystem = {
  ahriNumber: string;
  systemType: SystemTypeId;
  /** Short human headline, e.g. "3.5 Ton · 15.2 SEER2 Heat Pump System" */
  headline: string;
  tonnage: number;
  seer2: number;
  eer2?: number;
  hspf2?: number;
  afue?: number;
  capacityBTU: number;
  airflow: "upflow-horizontal" | "downflow" | "multipoise";
  stage: "single" | "two";
  refrigerant: "R-32" | "R-410A";
  taxCredit: boolean;
  components: AhriComponent[];
  addOns: FbtProduct[];
};

/* ── Attribute display helpers ── */

export const AIRFLOW_LABEL: Record<AhriSystem["airflow"], string> = {
  "upflow-horizontal": "Upflow / Horizontal",
  downflow: "Downflow",
  multipoise: "Multipoise",
};

export const STAGE_LABEL: Record<AhriSystem["stage"], string> = {
  single: "Single-Stage",
  two: "Two-Stage",
};

/* ──────────────────────────────────────────────────────────────────────────
 * Builder filters — each has an explicit "Any / Not sure" escape hatch so a
 * contractor who doesn't know a spec is never blocked. `test` decides whether
 * a system matches a chosen value.
 * ────────────────────────────────────────────────────────────────────────── */

export type FilterOption = { value: string; label: string };

export type AhriFilter = {
  key: string;
  label: string;
  help: string;
  /** which system types this filter applies to; omit = all */
  appliesTo?: SystemTypeId[];
  options: FilterOption[];
  test: (sys: AhriSystem, value: string) => boolean;
};

export const ANY = "any";

export const FILTERS: AhriFilter[] = [
  {
    key: "tonnage",
    label: "Capacity",
    help: "Nominal cooling tonnage of the system.",
    options: [
      { value: ANY, label: "Any / Not sure" },
      { value: "2.5", label: "2.5 Ton" },
      { value: "3", label: "3 Ton" },
      { value: "3.5", label: "3.5 Ton" },
      { value: "4", label: "4 Ton" },
      { value: "5", label: "5 Ton" },
    ],
    test: (s, v) => String(s.tonnage) === v,
  },
  {
    key: "seer2",
    label: "Cooling Efficiency",
    help: "Minimum SEER2 rating.",
    options: [
      { value: ANY, label: "Any / Not sure" },
      { value: "14", label: "14+ SEER2" },
      { value: "15", label: "15+ SEER2" },
      { value: "16", label: "16+ SEER2" },
    ],
    test: (s, v) => s.seer2 >= Number(v),
  },
  {
    key: "afue",
    label: "Heating Efficiency",
    help: "Minimum furnace AFUE.",
    appliesTo: ["furnace-coil"],
    options: [
      { value: ANY, label: "Any / Not sure" },
      { value: "80", label: "80%+ AFUE" },
      { value: "90", label: "90%+ AFUE" },
      { value: "96", label: "96%+ AFUE" },
    ],
    test: (s, v) => (s.afue ?? 0) >= Number(v),
  },
  {
    key: "stage",
    label: "Compressor Stage",
    help: "Single- or two-stage operation.",
    options: [
      { value: ANY, label: "Any / Not sure" },
      { value: "single", label: "Single-Stage" },
      { value: "two", label: "Two-Stage" },
    ],
    test: (s, v) => s.stage === v,
  },
  {
    key: "airflow",
    label: "Airflow",
    help: "Installed orientation of the indoor unit.",
    appliesTo: ["furnace-coil", "air-handler", "indoor-coil"],
    options: [
      { value: ANY, label: "Any / Not sure" },
      { value: "upflow-horizontal", label: "Upflow / Horizontal" },
      { value: "downflow", label: "Downflow" },
      { value: "multipoise", label: "Multipoise" },
    ],
    test: (s, v) => s.airflow === v,
  },
  {
    key: "refrigerant",
    label: "Refrigerant",
    help: "Refrigerant charge type.",
    options: [
      { value: ANY, label: "Any / Not sure" },
      { value: "R-32", label: "R-32 (low-GWP)" },
      { value: "R-410A", label: "R-410A" },
    ],
    test: (s, v) => s.refrigerant === v,
  },
  {
    key: "taxCredit",
    label: "Tax Credit",
    help: "Qualifies for the 25C federal energy tax credit.",
    options: [
      { value: ANY, label: "Any / Not sure" },
      { value: "yes", label: "Tax-credit eligible" },
    ],
    test: (s) => s.taxCredit,
  },
];

/* ── Shared add-on pool (Customers Also Purchased) ──
   FbtProduct shape so it renders through the canonical ProductCard rail. */
const ADD_ONS: FbtProduct[] = [
  {
    id: "addon-pad",
    brand: "DiversiTech",
    title: 'UltraLite 32" x 32" x 3" Equipment Pad',
    item: "UC3232-3",
    mfg: "UC3232-3",
    price: 38.9,
    branchQty: 24,
    branchName: "Durham NC #1",
    nearbyQty: 120,
    allBranchesQty: 120,
  },
  {
    id: "addon-whip",
    brand: "Southwire",
    title: "AC Whip Disconnect Whip Kit — 6 ft, 10/3",
    item: "WHIP-6-103",
    mfg: "55289021",
    price: 24.75,
    branchQty: 60,
    branchName: "Durham NC #1",
    nearbyQty: 240,
    allBranchesQty: 240,
  },
  {
    id: "addon-disconnect",
    brand: "Siemens",
    title: "60-Amp Non-Fused AC Disconnect, NEMA 3R",
    item: "WN2060",
    mfg: "WN2060U",
    price: 19.5,
    branchQty: 41,
    branchName: "Durham NC #1",
    nearbyQty: 180,
    allBranchesQty: 180,
  },
  {
    id: "addon-pump",
    brand: "Little Giant",
    title: "VCMA-20ULS Condensate Removal Pump",
    item: "554401",
    mfg: "VCMA-20ULS",
    price: 72.4,
    wasPrice: 84.0,
    branchQty: 12,
    branchName: "Durham NC #1",
    nearbyQty: 64,
    allBranchesQty: 64,
  },
  {
    id: "addon-pad-cork",
    brand: "Diversitech",
    title: "Anti-Vibration Cork + Rubber Isolation Pads (4-pack)",
    item: "MP-4",
    mfg: "MP-4",
    price: 14.25,
    branchQty: 88,
    branchName: "Durham NC #1",
    nearbyQty: 300,
    allBranchesQty: 300,
  },
  {
    id: "addon-thermostat",
    brand: "Honeywell",
    title: "T6 Pro Programmable Thermostat",
    item: "TH6220U2000",
    mfg: "TH6220U2000",
    price: 68.0,
    branchQty: 33,
    branchName: "Durham NC #1",
    nearbyQty: 140,
    allBranchesQty: 140,
  },
];

/* ── Reusable components ── */
const OUTDOOR_GLZS4B: AhriComponent = {
  id: "glzs4ba4210",
  kind: "outdoor",
  role: "Outdoor Unit",
  brand: "Goodman",
  title: "GLZS4B 3-1/2 Ton Split System Heat Pump — R-32",
  model: "GLZS4BA4210",
  item: "378798A",
  image: "/uc/glzs4b.png",
  price: 4119.84,
  branchQty: 3,
  branchName: "Durham NC #1",
  allBranchesQty: 24,
  specs: [
    { label: "Nominal Capacity", value: "3.5 Ton (42,000 BTU)" },
    { label: "SEER2", value: "15.2" },
    { label: "HSPF2", value: "7.8" },
    { label: "Refrigerant", value: "R-32" },
  ],
};

function coil(
  id: string,
  model: string,
  item: string,
  tons: number,
  price: number,
  qty: number,
): AhriComponent {
  return {
    id,
    kind: "coil",
    role: "Indoor Coil",
    brand: "Goodman",
    title: `CAPTA Cased Upflow/Downflow A-Coil — ${tons} Ton`,
    model,
    item,
    price,
    branchQty: qty,
    branchName: "Durham NC #1",
    allBranchesQty: qty * 9,
    specs: [
      { label: "Nominal Capacity", value: `${tons} Ton` },
      { label: "Orientation", value: "Upflow / Horizontal" },
      { label: "Refrigerant", value: "R-32 / R-410A" },
    ],
  };
}

function furnace(
  id: string,
  model: string,
  item: string,
  afue: number,
  btu: number,
  stage: string,
  price: number,
  qty: number,
): AhriComponent {
  return {
    id,
    kind: "furnace",
    role: "Gas Furnace",
    brand: "Goodman",
    title: `${afue}% AFUE ${btu / 1000}k BTU ${stage} Gas Furnace`,
    model,
    item,
    price,
    branchQty: qty,
    branchName: "Durham NC #1",
    allBranchesQty: qty * 7,
    specs: [
      { label: "AFUE", value: `${afue}%` },
      { label: "Input", value: `${btu.toLocaleString()} BTU/h` },
      { label: "Stage", value: stage },
    ],
  };
}

function airHandler(
  id: string,
  model: string,
  item: string,
  tons: number,
  price: number,
  qty: number,
): AhriComponent {
  return {
    id,
    kind: "air-handler",
    role: "Air Handler",
    brand: "Goodman",
    title: `AMST Multi-Position Air Handler — ${tons} Ton`,
    model,
    item,
    price,
    branchQty: qty,
    branchName: "Durham NC #1",
    allBranchesQty: qty * 8,
    specs: [
      { label: "Nominal Capacity", value: `${tons} Ton` },
      { label: "Orientation", value: "Multipoise" },
      { label: "Heat Kit", value: "Field-installed" },
    ],
  };
}

/* ── The certified systems ── */
export const SYSTEMS: AhriSystem[] = [
  {
    ahriNumber: "215217523",
    systemType: "furnace-coil",
    headline: "3.5 Ton · 15.2 SEER2 Dual-Fuel System · 96% AFUE",
    tonnage: 3.5,
    seer2: 15.2,
    eer2: 12.0,
    hspf2: 7.8,
    afue: 96,
    capacityBTU: 42000,
    airflow: "upflow-horizontal",
    stage: "single",
    refrigerant: "R-32",
    taxCredit: true,
    components: [
      OUTDOOR_GLZS4B,
      coil("capta4230c3", "CAPTA4230C3", "381120A", 3.5, 612.5, 14),
      furnace("gr9s960804bn", "GR9S960804BN", "379440A", 96, 80000, "Single-Stage", 1284.0, 9),
    ],
    addOns: ADD_ONS,
  },
  {
    ahriNumber: "215217524",
    systemType: "furnace-coil",
    headline: "3.5 Ton · 15.2 SEER2 Dual-Fuel System · 80% AFUE",
    tonnage: 3.5,
    seer2: 15.2,
    eer2: 12.0,
    hspf2: 7.8,
    afue: 80,
    capacityBTU: 42000,
    airflow: "upflow-horizontal",
    stage: "single",
    refrigerant: "R-32",
    taxCredit: true,
    components: [
      OUTDOOR_GLZS4B,
      coil("capta4230c3", "CAPTA4230C3", "381120A", 3.5, 612.5, 14),
      furnace("gr9s800804bn", "GR9S800804BN", "379421A", 80, 80000, "Single-Stage", 948.0, 11),
    ],
    addOns: ADD_ONS,
  },
  {
    ahriNumber: "215217525",
    systemType: "furnace-coil",
    headline: "3.5 Ton · 15.2 SEER2 Dual-Fuel System · 96% Two-Stage",
    tonnage: 3.5,
    seer2: 15.2,
    eer2: 12.0,
    hspf2: 7.8,
    afue: 96,
    capacityBTU: 42000,
    airflow: "multipoise",
    stage: "two",
    refrigerant: "R-32",
    taxCredit: true,
    components: [
      OUTDOOR_GLZS4B,
      coil("capta4230d3", "CAPTA4230D3", "381121A", 3.5, 648.0, 8),
      furnace("gc9s960804cn", "GC9S960804CN", "379461A", 96, 80000, "Two-Stage", 1512.0, 6),
    ],
    addOns: ADD_ONS,
  },
  {
    ahriNumber: "215219901",
    systemType: "air-handler",
    headline: "3.5 Ton · 15.2 SEER2 Heat Pump + Air Handler",
    tonnage: 3.5,
    seer2: 15.2,
    eer2: 12.0,
    hspf2: 7.8,
    capacityBTU: 42000,
    airflow: "multipoise",
    stage: "single",
    refrigerant: "R-32",
    taxCredit: true,
    components: [
      OUTDOOR_GLZS4B,
      airHandler("amst42cu1400", "AMST42CU1400", "380655A", 3.5, 1189.0, 7),
    ],
    addOns: ADD_ONS,
  },
  {
    ahriNumber: "215219902",
    systemType: "air-handler",
    headline: "3 Ton · 16.0 SEER2 Heat Pump + Air Handler",
    tonnage: 3,
    seer2: 16.0,
    eer2: 12.5,
    hspf2: 8.1,
    capacityBTU: 36000,
    airflow: "multipoise",
    stage: "two",
    refrigerant: "R-32",
    taxCredit: true,
    components: [
      {
        ...OUTDOOR_GLZS4B,
        id: "glzs4ba3610",
        title: "GLZS4B 3 Ton Split System Heat Pump — R-32",
        model: "GLZS4BA3610",
        item: "378796A",
        price: 3764.0,
        specs: [
          { label: "Nominal Capacity", value: "3 Ton (36,000 BTU)" },
          { label: "SEER2", value: "16.0" },
          { label: "HSPF2", value: "8.1" },
          { label: "Refrigerant", value: "R-32" },
        ],
      },
      airHandler("amst36cu1400", "AMST36CU1400", "380653A", 3, 1098.0, 9),
    ],
    addOns: ADD_ONS,
  },
  {
    ahriNumber: "215224410",
    systemType: "indoor-coil",
    headline: "3.5 Ton Cased A-Coil Match — R-32",
    tonnage: 3.5,
    seer2: 15.2,
    capacityBTU: 42000,
    airflow: "upflow-horizontal",
    stage: "single",
    refrigerant: "R-32",
    taxCredit: false,
    components: [
      OUTDOOR_GLZS4B,
      coil("capta4230c3", "CAPTA4230C3", "381120A", 3.5, 612.5, 14),
    ],
    addOns: ADD_ONS,
  },
  {
    ahriNumber: "215228830",
    systemType: "mobile-home",
    headline: "3 Ton Mobile-Home Coil Match — R-32",
    tonnage: 3,
    seer2: 14.3,
    capacityBTU: 36000,
    airflow: "downflow",
    stage: "single",
    refrigerant: "R-32",
    taxCredit: false,
    components: [
      {
        ...OUTDOOR_GLZS4B,
        id: "glzs4ba3610",
        title: "GLZS4B 3 Ton Split System Heat Pump — R-32",
        model: "GLZS4BA3610",
        item: "378796A",
        price: 3764.0,
        specs: [
          { label: "Nominal Capacity", value: "3 Ton (36,000 BTU)" },
          { label: "SEER2", value: "14.3" },
          { label: "Refrigerant", value: "R-32" },
        ],
      },
      {
        ...coil("cmh3", "CHPTA3630MH", "381330A", 3, 684.0, 6),
        title: "CHPTA Mobile-Home Downflow Coil — 3 Ton",
      },
    ],
    addOns: ADD_ONS,
  },
];

export function getSystem(ahriNumber: string): AhriSystem | undefined {
  return SYSTEMS.find((s) => s.ahriNumber === ahriNumber);
}

export function systemPrice(sys: AhriSystem): number {
  return sys.components.reduce((sum, c) => sum + c.price, 0);
}

export function systemTypeLabel(id: SystemTypeId): string {
  return SYSTEM_TYPES.find((t) => t.id === id)?.label ?? id;
}
