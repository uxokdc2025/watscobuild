import type { Metadata } from "next";

import { OverlaysSection } from "../_sections/overlays";

export const metadata: Metadata = {
  title: "Overlays — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <OverlaysSection />
    </main>
  );
}
