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
  brand: "TRADEPRO®",
  title: "Single Phase Type 1 Surge Protector - 120/240 VAC",
  item: "369307A",
  mfg: "TP-SPD-50",
  image: "/uc-tabs-accordions/tp-spd-50.avif",
  price: 55.7,
  points: 1,
  allBranchesQty: 310,
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
  allBranchesQty: 12,
};

export function ProductCardsSection() {
  return (
    <Category
      id="product-cards"
      title="Product Card"
      description="Canonical worst-case card. Every slot reserves fixed height — cards in a row are always the same height regardless of which fields are populated."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Case title="Minimal (signed out)" signedIn={false} data={BASE} />
        <Case title="Signed in" signedIn={true} data={BASE} />
        <Case
          title="With badges"
          signedIn={true}
          data={{
            ...BASE,
            badges: [
              { label: "New", tone: "solid", color: "blue" },
              { label: "PRO Essentials", tone: "soft", color: "blue" },
            ],
          }}
        />
        <Case
          title="On sale"
          signedIn={true}
          data={{
            ...BASE,
            price: 46.5,
            wasPrice: 55.7,
            badges: [{ label: "Sale", tone: "solid", color: "red" }],
          }}
        />
        <Case
          title="Customers Also Purchased"
          signedIn={true}
          data={{ ...BASE, pct: 42 }}
        />
        <Case title="Long title (4-line clamp)" signedIn={true} data={LONG_TITLE} />
        <Case
          title="No brand"
          signedIn={true}
          data={{ ...BASE, brand: undefined }}
        />
        <Case
          title="Kitchen sink"
          signedIn={true}
          data={{
            ...LONG_TITLE,
            price: 289.5,
            wasPrice: 328.75,
            pct: 68,
            badges: [
              { label: "New", tone: "solid", color: "blue" },
              { label: "Sale", tone: "solid", color: "red" },
              { label: "PRO Essentials", tone: "soft", color: "blue" },
            ],
          }}
        />
      </div>
    </Category>
  );
}
