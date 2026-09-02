import type { Metadata } from "next";

import FormsReference from "./forms-reference";

export const metadata: Metadata = {
  title: "Forms — Watsco DS",
  description:
    "The form controls: Input, Label, Textarea, Checkbox, Radio group, and Select — every state, with the exact code to paste. The single source of truth for every field in the storefront.",
};

// The page is a Server Component (so it can export metadata); all the live
// control rendering lives in the client child. Importing the radix-backed
// components/ui form controls directly into a server page breaks the Vercel
// build via radix's createContext — the split keeps them out of the server graph.
export default function FormsPage() {
  return <FormsReference />;
}
