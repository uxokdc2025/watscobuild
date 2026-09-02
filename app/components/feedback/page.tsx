import type { Metadata } from "next";

import { FeedbackSection } from "../_sections/feedback";

export const metadata: Metadata = {
  title: "Feedback — Watsco DS",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <FeedbackSection />
    </main>
  );
}
