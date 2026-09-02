import type { Metadata } from "next";

import NavigationReference from "./navigation-reference";

export const metadata: Metadata = {
  title: "Navigation — Watsco DS",
  description:
    "Breadcrumb, Pagination, and Tabs-as-nav: every part and state, with the exact code to paste. The single source of truth for wayfinding in the storefront.",
};

// Server Component (so it can export metadata); all live rendering lives in the
// client child, keeping radix/createContext out of the server graph.
export default function NavigationPage() {
  return <NavigationReference />;
}
