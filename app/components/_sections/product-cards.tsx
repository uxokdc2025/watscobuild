"use client";

import { ProductCard, type ProductCardData } from "@/app/pdp/_lib/product-card";
import { Category } from "../_showcase";

/** One demo card + a short label so use cases can be compared side by side. */
function Case({
  title,
  note,
  data,
  signedIn,
}: {
  title: string;
  note: string;
  data: ProductCardData;
  signedIn: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <header>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </header>
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
      description="The canonical worst-case card, used everywhere a product renders as a card (/search PLP, FBT, Customers Also Purchased). Every slot reserves fixed height — cards in a row are always the same height regardless of which fields are populated. Layout structure documented at the top of app/pdp/_lib/product-card.tsx."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Case
          title="Minimal (signed out)"
          note="No commerce visible; steps 6-10 collapse to a Sign-in link."
          signedIn={false}
          data={BASE}
        />
        <Case
          title="Signed in"
          note="Base commerce state: price, points as badge, stock, qty + Add to Cart, Add to List."
          signedIn={true}
          data={BASE}
        />
        <Case
          title="With badges"
          note="Multiple badges — merchandising chips + PointsBadge in one row."
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
          note="Was-price strikethrough after the price. Sale intent lives in the badges row."
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
          note="Adds the italic '% Also Purchased' affinity line under badges."
          signedIn={true}
          data={{ ...BASE, pct: 42 }}
        />
        <Case
          title="Long title (4-line clamp)"
          note="Title clamps to 4 lines with an ellipsis; height is still identical."
          signedIn={true}
          data={LONG_TITLE}
        />
        <Case
          title="No brand"
          note="Brand slot reserves its line even when empty — card stays the same height."
          signedIn={true}
          data={{ ...BASE, brand: undefined }}
        />
        <Case
          title="Kitchen sink"
          note="Everything on: multiple badges + points + % + sale + long title."
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
