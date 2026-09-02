import type { Metadata } from "next";

import BadgeReference from "./badge-reference";

export const metadata: Metadata = {
  title: "Badge — Watsco DS",
  description:
    "The Badge component: every variant, color, and domain status label, with the exact code to paste. The single source of truth for every badge in the storefront.",
};

// The page is a Server Component (so it can export metadata); all the live
// <Badge> rendering lives in the client child, keeping radix/Badge out of the
// server graph (importing components/ui into a server page trips the radix
// createContext build failure — the Button page split avoids it the same way).
export default function BadgePage() {
  return <BadgeReference />;
}
