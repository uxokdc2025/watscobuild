import type { Metadata } from "next";

import { AccountMenusCompare } from "./_compare";

export const metadata: Metadata = {
  title: "Account menus — v1 vs v2 · Watsco DS",
  description:
    "Current flat account menus (v1) vs a nested Buying Tools version (v2), for the account fly-out and the dashboard sidebar — shown side by side.",
};

export default function AccountMenusPage() {
  return <AccountMenusCompare />;
}
