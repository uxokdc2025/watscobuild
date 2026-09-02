import { redirect } from "next/navigation";

// Store Locator was split into two distinct patterns: Branch Selector and
// Inventory Drawer. Redirect the old combined route to Branch Selector.
export default function StoreLocatorRedirect() {
  redirect("/components/branch-selector");
}
