import type { Metadata } from "next";

import OverlaysReference from "./overlays-reference";

export const metadata: Metadata = {
  title: "Overlays — Watsco DS",
  description:
    "Dialog, Sheet, Drawer, Popover, Tooltip, and Dropdown menu: every layered surface, live, with the exact code to paste and the a11y rules baked in.",
};

// Server Component (so it can export metadata); all live rendering — the
// radix/framer-motion overlay components — lives in the client child, keeping
// radix createContext out of the server graph (a Vercel build failure otherwise).
export default function OverlaysPage() {
  return <OverlaysReference />;
}
