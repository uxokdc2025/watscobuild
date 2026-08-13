"use client";

import { ProductCard, type ProductCardData } from "@/app/pdp/_lib/product-card";
import { Category } from "../_showcase";

/** One demo card + a short label so use cases can be compared side by side. */
function Case({
  title,
  data,
  signedIn,
}: {
  title: string;
  data: ProductCardData;
  signedIn: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold">{title}</p>
      <ProductCard data={data} signedIn={signedIn} />
    </div>
  );
}

const BASE: ProductCardData = {
  id: "base",
  brand: "DiversiTech®",
  title: 'DiversiTech®- HT4040-4 Hurricane T Class Concrete Equipment Pad™ 40" x 40" x 4"',
  item: "EP-40X40X4-T",
  mfg: "HT4040-4",
  image: "/uc-tabs-accordions/ht4040-4.avif",
  price: 193.2,
  points: 3,
  yourBranchQty: 2,
  nearbyBranchQty: 123,
  badges: [
    { label: "PRO Essentials", tone: "outline-color", color: "red" },
    { label: "Substitute", tone: "outline-color", color: "blue" },
  ],
};

const LONG_TITLE: ProductCardData = {
  id: "long",
  brand: "Factory Authorized Parts",
  title:
    "Factory Authorized Parts™ - Blower Motor - 1/2 HP - 120/240 V - 7.7/4.3 Amp - 1050 RPM - Multi-Speed ECM",
  item: "58MV660006",
  mfg: "58MV 660 006",
  image: "/homans-search/blower-motor-01.webp",
  price: 328.75,
  points: 328,
  yourBranchQty: 4,
  nearbyBranchQty: 12,
};

export function ProductCardsSection() {
  return (
    <Category
      id="product-cards"
      title="Product Card"
      description="Canonical worst-case card. Every slot reserves fixed height — cards in a row are always the same height regardless of which fields are populated."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Case
          title="Frame 6 — badges only"
          signedIn={true}
          data={BASE}
        />
        <Case
          title="Frame 3 — with 42% Also Purchased"
          signedIn={true}
          data={{ ...BASE, pct: 42 }}
        />
        <Case
          title="Frame 4 — no badges, no %"
          signedIn={true}
          data={{ ...BASE, badges: undefined }}
        />
        <Case
          title="Frame 5 — same as Frame 4"
          signedIn={true}
          data={{ ...BASE, badges: undefined }}
        />
        <Case title="Signed out" signedIn={false} data={BASE} />
        <Case
          title="On sale"
          signedIn={true}
          data={{
            ...BASE,
            price: 154.5,
            wasPrice: 193.2,
            badges: [{ label: "Sale", tone: "solid", color: "red" }],
          }}
        />
        <Case title="Long title (3-line clamp)" signedIn={true} data={LONG_TITLE} />
        <Case
          title="Kitchen sink"
          signedIn={true}
          data={{
            ...LONG_TITLE,
            price: 289.5,
            wasPrice: 328.75,
            pct: 68,
            badges: [
              { label: "PRO Essentials", tone: "outline-color", color: "red" },
              { label: "Substitute", tone: "outline-color", color: "blue" },
              { label: "New", tone: "solid", color: "blue" },
            ],
          }}
        />
      </div>
    </Category>
  );
}
