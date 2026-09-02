import type { Metadata } from "next";

import { MediaSection } from "../_sections/media";

export const metadata: Metadata = {
  title: "Media — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <MediaSection />
    </main>
  );
}
