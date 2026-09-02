import type { Metadata } from "next";

import ButtonReference from "./button-reference";

export const metadata: Metadata = {
  title: "Button — Watsco DS",
  description:
    "The Button component: every variant, size, and state, with the exact code to paste. The single source of truth for every button in the storefront.",
};

// The page is a Server Component (so it can export metadata); all the live
// <Button> rendering lives in the client child, keeping radix/Button out of
// the server graph.
export default function ButtonPage() {
  return <ButtonReference />;
}
