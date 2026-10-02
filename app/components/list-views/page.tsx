import type { Metadata } from "next";

import ListViewsReference from "./list-views-reference";

export const metadata: Metadata = {
  title: "List Views — Watsco DS",
  description:
    "The one canonical storefront list-row pattern behind every product list — PLP, cart, checkout review, shopping list, and AHRI matched systems — and where each is used.",
};

export default function ListViewsPage() {
  return <ListViewsReference />;
}
