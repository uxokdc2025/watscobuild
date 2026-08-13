"use client";

import { ProductCard, type ProductCardData } from "@/app/pdp/_lib/product-card";
import { Category } from "../_showcase";

/** One demo card + a short label so use cases can be compared side by side. */
function Case({
  data,
  signedIn,
}: {
  data: ProductCardData;
  signedIn: boolean;
}) {
  // 247px is the canonical card width per David's spec.
  return (
    <div className="w-[247px]">
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
  branchName: "Miami",
  nearbyBranchQty: 123,
  badges: [
    { label: "PRO Essentials", tone: "outline-color", color: "red" },
    { label: "Substitute", tone: "outline-color", color: "blue" },
  ],
};


export function ProductCardsSection() {
  return (
    <Category
      id="product-cards"
      title="Product Card"
      description="Canonical worst-case card. Every slot reserves fixed height — cards in a row are always the same height regardless of which fields are populated."
    >
      <div className="flex flex-wrap gap-6">
        {/* Frame 6 — badges only */}
        <Case signedIn={true} data={BASE} />
        {/* Frame 3 — badges + % Also Purchased */}
        <Case signedIn={true} data={{ ...BASE, pct: 42 }} />
        {/* Frame 4 — no badges, no % */}
        <Case signedIn={true} data={{ ...BASE, badges: undefined }} />
        {/* Frame 5 — same as Frame 4 (height parity check) */}
        <Case signedIn={true} data={{ ...BASE, badges: undefined }} />
      </div>
    </Category>
  );
}
