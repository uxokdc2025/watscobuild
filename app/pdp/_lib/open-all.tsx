"use client";

import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Opens every PDP in its own tab (staggered so popup blockers are friendlier). */
export function OpenAllButton({ slugs }: { slugs: string[] }) {
  return (
    <Button
      variant="outline"
      onClick={() =>
        slugs.forEach((s, i) =>
          window.setTimeout(() => window.open(`/pdp/${s}`, "_blank"), i * 150)
        )
      }
    >
      <ExternalLink />
      Open all brands
    </Button>
  );
}
