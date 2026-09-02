import type { Metadata } from "next";

import AccountDrawerReference from "./account-drawer-reference";

export const metadata: Metadata = {
  title: "Account Drawer — Watsco DS",
  description: "The global account panel — account switching, ship-to, and account nav.",
};

export default function AccountDrawerBlock() {
  return <AccountDrawerReference />;
}
