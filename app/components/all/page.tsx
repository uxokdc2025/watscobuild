import type { Metadata } from "next";

import { ActionsSection } from "../_sections/actions";
import { LabelsSection } from "../_sections/labels";
import { FormsSection } from "../_sections/forms";
import { FeedbackSection } from "../_sections/feedback";
import { OverlaysSection } from "../_sections/overlays";
import { DataSection } from "../_sections/data";
import { NavigationSection } from "../_sections/navigation";
import { MediaSection } from "../_sections/media";
import { ProductCardsSection } from "../_sections/product-cards";
import { PdpActionsSection } from "../_sections/pdp-actions";
import { PlpSection } from "../_sections/plp";

export const metadata: Metadata = {
  title: "All components — Watsco DS",
  description:
    "Every component in the registry, shown across all its states. Being split into dedicated pages.",
};

export default function AllComponentsPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 py-10 md:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">All components</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The full registry on one page. Each category is being promoted to its own
          dedicated page (see <span className="font-medium text-foreground">Button</span> for the
          finished pattern).
        </p>
      </header>

      <ProductCardsSection />
      <PlpSection />
      <PdpActionsSection />
      <ActionsSection />
      <LabelsSection />
      <FormsSection />
      <FeedbackSection />
      <OverlaysSection />
      <DataSection />
      <NavigationSection />
      <MediaSection />
    </main>
  );
}
