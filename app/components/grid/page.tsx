import type { Metadata } from "next";

import GridReference from "./grid-reference";

export const metadata: Metadata = {
  title: "Grid & Breakpoints — Watsco DS",
  description:
    "The supported breakpoints, the 1920px content canvas, and the product grid that search and every PLP use. Content is fluid to 1920px, then it stops and centers, and the grid is capped at five columns — never six.",
};

// Server Component so it can export metadata; the live demos (overlay toggle,
// resizable grid) live in the client child.
export default function GridPage() {
  return <GridReference />;
}
