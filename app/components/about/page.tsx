import type { Metadata } from "next";

import AboutReference from "./about-reference";

export const metadata: Metadata = {
  title: "About This Product — Watsco DS",
  description:
    "The single data-driven About This Product accordion every PDP renders — Description, Specifications, Documents, Part List (or Bundle Components) — with one canonical icon set.",
};

export default function AboutPage() {
  return <AboutReference />;
}
