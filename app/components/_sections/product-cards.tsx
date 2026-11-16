"use client";

import Link from "next/link";

import { ProductCard, type ProductCardData } from "@/app/pdp/_lib/product-card";
import { MoreOptionsCard } from "@/components/ui/more-options-card";
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
      description="Canonical worst-case card. Every slot reserves fixed height — cards in a row are always the same height regardless of which fields are populated. The blue tile is the grid end card variant."
    >
      <div className="flex flex-wrap items-stretch gap-6 lg:col-span-2">
        {/* Badges + % Also Purchased (richest state) */}
        <Case signedIn={true} data={{ ...BASE, pct: 42 }} />
        {/* Badges only */}
        <Case signedIn={true} data={BASE} />
        {/* No badges, no % */}
        <Case signedIn={true} data={{ ...BASE, badges: undefined }} />
        {/* End card variant — last tile in the PLP grid. Counts mirror the
            page's "Stocked At" facet; the interactive version (links switch
            the filter) lives on the Product Card page. */}
        <div className="flex w-[247px] flex-col gap-2">
          <div className="flex-1">
            <MoreOptionsCard
              branchName="Manchester, NH - Homans"
              shownCount={16}
              scopes={[
                { label: "Nearby Branches", count: 96 },
                { label: "All Branches", count: 348 },
              ]}
            />
          </div>
          <Link
            href="/components/product-card#end-card"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            End card — docs + live filter switching
          </Link>
        </div>
      </div>
    </Category>
  );
}
