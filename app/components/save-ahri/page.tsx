import type { Metadata } from "next";

import { PdpActionsSection } from "../_sections/pdp-actions";

export const metadata: Metadata = {
  title: "Save + AHRI — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PdpActionsSection />
    </main>
  );
}
