import type { Metadata } from "next";

import PlpReference from "./plp-reference";

export const metadata: Metadata = {
  title: "PLP Patterns — Watsco DS",
  description:
    "The reusable product-list patterns: branch selection, applied-filter pills, radius, facets, view controls, and the compact list row — with the exact code to paste.",
};

// Server Component so it can export metadata; all live rendering (radix-backed
// filters + list row) lives in the client child, keeping radix out of the
// server graph.
export default function PlpPage() {
  return <PlpReference />;
}
