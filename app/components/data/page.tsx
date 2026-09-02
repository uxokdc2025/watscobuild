import type { Metadata } from "next";

import { DataSection } from "../_sections/data";

export const metadata: Metadata = {
  title: "Data — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <DataSection />
    </main>
  );
}
