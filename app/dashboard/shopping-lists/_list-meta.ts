/**
 * Shared, server-safe metadata for shopping lists. Imported by the lists table
 * (to build detail links), the [id] route's server wrapper (for metadata) and
 * the client detail view. No "use client" — safe on both sides of the boundary.
 */
export type ListType = "Personal" | "Shared";

export type ListMeta = { name: string; type: ListType; created: string };

/** URL-safe slug from a list name. Used as the [id] route segment. */
export function slugifyList(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const LIST_META: Record<string, ListMeta> = {
  "hvac-maintenance-kit": {
    name: "HVAC maintenance kit",
    type: "Personal",
    created: "August 12, 2026",
  },
  "blower-motor-replacements": {
    name: "Blower motor replacements",
    type: "Personal",
    created: "August 28, 2026",
  },
  "frequently-ordered-parts": {
    name: "Frequently ordered parts",
    type: "Shared",
    created: "July 30, 2026",
  },
};

/** Resolve a slug to its metadata, falling back to a title-cased slug. */
export function getListMeta(id: string): ListMeta {
  return (
    LIST_META[id] ?? {
      name: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      type: "Personal",
      created: "August 2026",
    }
  );
}
