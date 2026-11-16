import type { Metadata } from "next";

import FamilyTableReference from "./family-table-reference";

export const metadata: Metadata = {
  title: "Family Table — Watsco DS",
  description:
    "The grouped result table that replaces the flat list view: product-family sections, attribute sub-group bands, data-driven columns per category, and rows that expand in place.",
};

// Server Component so it can export metadata; the live table (state, cart) is
// a client child.
export default function FamilyTablePage() {
  return <FamilyTableReference />;
}
