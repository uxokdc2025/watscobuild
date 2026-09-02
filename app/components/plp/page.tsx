import type { Metadata } from "next";

import { PlpSection } from "../_sections/plp";

export const metadata: Metadata = {
  title: "PLP Patterns — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PlpSection />
    </main>
  );
}
