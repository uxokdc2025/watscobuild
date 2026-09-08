import type { CartItem } from "@/components/cart/cart-context";

/* ───────────────────────── Cart demo data ─────────────────────────
 * The cart line is a CartItem (id/title/brand/image/price/quantity) plus the
 * catalog identifiers (item / mfg) the row shows, and an optional replacement
 * set — the SAME shape the shopping-list detail carries — so a line that has a
 * newer revision or a cross-compatible option can surface the yellow
 * "Replacements available" panel and open the substitutes drawer.
 *
 * Data is reused from the checkout demo items (Aspen air handler + Duro Dyne
 * wire rope) and the shopping-list detail (the out-of-stock contactor and the
 * X-13 blower motor, which carry substitutes) — no parallel mock. */

export type AltProduct = {
  id: string;
  brand: string;
  title: string;
  item: string;
  mfg: string;
  image: string;
  price: number;
  qty: number;
};

export type CartLine = CartItem & {
  /** Catalog identifiers shown on the row. */
  item: string;
  mfg: string;
  /** When present, the line has a replacement/substitute set. */
  replacement?: {
    note: string;
    replacements: AltProduct[];
    substitutes: AltProduct[];
  };
};

const img = (n: string) => `/peirce-search/blower-motor-${n}.avif`;

export const DEMO_CART: CartLine[] = [
  {
    id: "cart-air-handler",
    title: "Aspen® 3-Ton Multi-Position Electric Air Handler",
    brand: "Aspen",
    item: "AH3-676A",
    mfg: "ASP-3T-MP",
    price: 676.5,
    quantity: 1,
    image: img("07"),
  },
  {
    id: "cart-contactor",
    title: "TP-CON-2P30A — Definite Purpose Contactor, 2 Pole, 30 Amp, 24V Coil",
    brand: "TRADEPRO®",
    item: "34530C",
    mfg: "TP-CON-2P30A",
    price: 22.75,
    quantity: 2,
    image: img("09"),
    replacement: {
      note: "Out of stock at your branch — a form-fit-function equivalent ships today.",
      replacements: [
        {
          id: "tp-con-2p40a",
          brand: "TRADEPRO®",
          title: "TP-CON-2P40A — Definite Purpose Contactor, 2 Pole, 40 Amp, 24V Coil",
          item: "34540C",
          mfg: "TP-CON-2P40A",
          image: img("11"),
          price: 24.9,
          qty: 33,
        },
      ],
      substitutes: [
        {
          id: "packard-c230b",
          brand: "PACKARD",
          title: "C230B — Contactor, 2 Pole, 30 Amp, 24V Coil",
          item: "77230",
          mfg: "C230B",
          image: img("13"),
          price: 19.99,
          qty: 60,
        },
      ],
    },
  },
  {
    id: "cart-blower-motor",
    title:
      "TP-EC13-50 — Blower Motor, X-13 ECM, Variable Speed, 1075 RPM, 115/208-230V, 1/2 HP",
    brand: "TRADEPRO®",
    item: "54510A",
    mfg: "TP-EC13-50",
    price: 168.42,
    quantity: 1,
    image: img("01"),
    replacement: {
      note: "This motor has a newer revision and cross-compatible options.",
      replacements: [
        {
          id: "tp-ec13-50r2",
          brand: "TRADEPRO®",
          title: "TP-EC13-50-R2 — Blower Motor, X-13 ECM (updated control board)",
          item: "54511A",
          mfg: "TP-EC13-50-R2",
          image: img("02"),
          price: 172.0,
          qty: 21,
        },
      ],
      substitutes: [
        {
          id: "us-5462",
          brand: "US MOTORS",
          title: "5462 — ECM Blower Motor, 1/2 HP, 1075 RPM, 208-230V",
          item: "88245",
          mfg: "5462",
          image: img("03"),
          price: 189.9,
          qty: 5,
        },
        {
          id: "gen-mtr-050",
          brand: "GENTEQ",
          title: "Evergreen 1/2 HP ECM Replacement Motor, 208-230V",
          item: "6205E",
          mfg: "GEN-EVG-050",
          image: img("04"),
          price: 214.5,
          qty: 12,
        },
      ],
    },
  },
  {
    id: "cart-wire-rope",
    title: "Duro Dyne® Cable Lock Wire Rope - 500' Roll",
    brand: "Duro Dyne",
    item: "DD-500WR",
    mfg: "CL-WR-500",
    price: 277,
    quantity: 1,
    image: img("17"),
  },
];
