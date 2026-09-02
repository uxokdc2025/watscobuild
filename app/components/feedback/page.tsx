import type { Metadata } from "next";

import FeedbackReference from "./feedback-reference";

export const metadata: Metadata = {
  title: "Feedback — Watsco DS",
  description:
    "Alert, Skeleton, Progress, and toast: how the storefront tells a customer what just happened, with the exact code to paste.",
};

// Server Component (so it can export metadata); all live rendering — including
// the client-only sonner/radix components — lives in the client child, keeping
// radix createContext out of the server graph (a Vercel build failure otherwise).
export default function FeedbackPage() {
  return <FeedbackReference />;
}
