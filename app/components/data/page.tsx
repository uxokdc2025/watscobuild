import type { Metadata } from "next";

import DataReference from "./data-reference";

export const metadata: Metadata = {
  title: "Data display — Watsco DS",
  description:
    "Table, Tabs, and Accordion: every part and state, with the exact code to paste. The single source of truth for structured content in the storefront.",
};

// Server Component (so it can export metadata); all live rendering lives in the
// client child, keeping radix/createContext out of the server graph.
export default function DataPage() {
  return <DataReference />;
}
