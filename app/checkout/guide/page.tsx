import type { Metadata } from "next";

import CheckoutGuide from "./_guide";

// Server route: metadata lives here. The interactive index (DS Button/Badge,
// which pull radix into the module graph) is a "use client" child, so this
// route stays a server component and avoids the createContext-in-server error.
export const metadata: Metadata = {
  title: "Checkout — Brand Walkthroughs | Watsco",
  description:
    "One unified checkout, four distributor skins. Every use case from each brand's document, mapped one-to-one to the live flow.",
};

export default function CheckoutGuidePage() {
  return <CheckoutGuide />;
}
