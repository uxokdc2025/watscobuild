import type { Metadata } from "next";

import { FormsSection } from "../_sections/forms";

export const metadata: Metadata = {
  title: "Forms — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <FormsSection />
    </main>
  );
}
