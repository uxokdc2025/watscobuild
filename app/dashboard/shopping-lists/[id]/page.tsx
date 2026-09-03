import type { Metadata } from "next";

import { getListMeta } from "../_list-meta";
import { ListDetail } from "./list-detail";

// Server Component so it can export metadata; the interactive detail view lives
// in the client child, keeping cart/drawer state out of the server graph.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const meta = getListMeta(id);
  return {
    title: `${meta.name} — Shopping List`,
    description: `Products saved in the ${meta.name} shopping list.`,
  };
}

export default async function ShoppingListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ListDetail id={id} />;
}
