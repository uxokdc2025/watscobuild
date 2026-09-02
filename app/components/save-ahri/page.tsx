import type { Metadata } from "next";

import SaveAhriReference from "./save-ahri-reference";

export const metadata: Metadata = {
  title: "Save + AHRI — Watsco DS",
  description:
    "The canonical PDP secondary-actions row: a muted Save link beside a promoted violet Find-an-AHRI-Matched-System button, with the exact code to paste.",
};

// Server Component so it can export metadata; all live rendering lives in the
// client child to keep the server graph clean and consistent with the other
// reference pages.
export default function SaveAhriPage() {
  return <SaveAhriReference />;
}
