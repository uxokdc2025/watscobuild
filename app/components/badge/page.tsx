import type { Metadata } from "next";

import { LabelsSection } from "../_sections/labels";

export const metadata: Metadata = {
  title: "Badge — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <LabelsSection />
    </main>
  );
}
