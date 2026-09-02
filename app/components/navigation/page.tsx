import type { Metadata } from "next";

import { NavigationSection } from "../_sections/navigation";

export const metadata: Metadata = {
  title: "Navigation — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <NavigationSection />
    </main>
  );
}
