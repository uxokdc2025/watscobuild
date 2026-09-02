import type { Metadata } from "next";

import MediaReference from "./media-reference";

export const metadata: Metadata = {
  title: "Media — Watsco DS",
  description:
    "Avatar, the aspect-ratio thumbnail pattern, and Carousel: every part and state, with the exact code to paste. The single source of truth for images and identities in the storefront.",
};

// Server Component (so it can export metadata); all live rendering lives in the
// client child, keeping radix/embla/createContext out of the server graph.
export default function MediaPage() {
  return <MediaReference />;
}
