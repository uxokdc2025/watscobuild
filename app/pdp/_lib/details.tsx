import { ChevronUp, FileText, Search, Share2, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartsGrid } from "./parts";
import type {
  PdpDescription,
  PdpDocument,
  PdpProduct,
  SpecGroup,
  SpecRow,
} from "./types";

function DescriptionBody({ description }: { description: PdpDescription }) {
  const hasRich = description.bullets?.length || description.notes?.length;
  if (!hasRich) {
    return (
      <p className="max-w-3xl text-sm text-muted-foreground">{description.intro}</p>
    );
  }
  return (
    <div className="flex max-w-3xl flex-col gap-4 text-sm">
      <p className="text-muted-foreground">{description.intro}</p>
      {description.bullets?.length ? (
        <ul className="flex flex-col gap-1.5">
          {description.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-muted-foreground">
              <span aria-hidden className="text-primary">
                •
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {description.notes?.length ? (
        <dl className="grid gap-2 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
          {description.notes.map(([k, v]) => (
            <div key={k}>
              <dt className="inline font-medium">{k}: </dt>
              <dd className="inline text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

/** Grouped spec fallback (used when a product has no flat spec list). */
function SpecGroupBlock({ group }: { group: SpecGroup }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">{group.title}</h3>
      <div className="overflow-hidden rounded-lg border">
        {group.rows.map((r, i) => (
          <div
            key={r.label}
            className={cn(
              "grid grid-cols-[2fr_3fr] gap-4 px-4 py-3 text-sm",
              i > 0 && "border-t",
              i % 2 === 1 && "bg-muted/40"
            )}
          >
            <span className="font-medium">{r.label}</span>
            <span className="text-muted-foreground">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Flat spec list distributed column-by-column across 4 columns. */
function FlatSpecs({ specs }: { specs: SpecRow[] }) {
  const cols = 4;
  const per = Math.ceil(specs.length / cols);
  const chunks = Array.from({ length: cols }, (_, i) =>
    specs.slice(i * per, (i + 1) * per)
  );
  return (
    <div className="rounded-lg border px-2">
      <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
        {chunks.map((chunk, i) => (
          <div key={i}>
            {chunk.map((r) => (
              <div
                key={r.label}
                className="flex items-baseline justify-between gap-4 border-b px-2 py-3 text-sm last:border-b-0"
              >
                <span className="font-semibold capitalize">{r.label}</span>
                <span className="text-right text-muted-foreground">{r.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDocumentation({
  item,
  documents,
}: {
  item: string;
  documents: PdpDocument[];
}) {
  const code = item.replace(/[^a-z0-9]/gi, "").toUpperCase();
  const groups = new Map<string, PdpDocument[]>();
  for (const d of documents) {
    const key = d.category ?? d.label;
    groups.set(key, [...(groups.get(key) ?? []), d]);
  }
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {documents.length} document{documents.length === 1 ? "" : "s"} found for
        item #{code}
      </p>
      <div className="relative mt-4">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          aria-label="Filter documents by name"
          placeholder="Filter documents by name"
          className="h-11 w-full rounded-md border bg-background pr-3 pl-9 text-sm outline-none"
        />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {[...groups.entries()].map(([cat, docs]) => (
          <div key={cat} className="overflow-hidden rounded-md border">
            <div className="flex items-center justify-between gap-4 bg-muted px-4 py-2.5 text-sm font-semibold">
              <span>
                {cat}
                <span className="ml-6 font-normal text-muted-foreground">
                  {docs.length} Document{docs.length === 1 ? "" : "s"}
                </span>
              </span>
              <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
            </div>
            <ul>
              {docs.map((d) => (
                <li
                  key={d.label}
                  className="flex items-center justify-between gap-4 border-t px-4 py-3"
                >
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {d.kind === "video" ? (
                      <Video className="size-5 shrink-0" />
                    ) : (
                      <FileText className="size-5 shrink-0" />
                    )}
                    {d.label}
                  </a>
                  <button
                    type="button"
                    aria-label={`Share ${d.label}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Share2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PdpDetails({ product }: { product: PdpProduct }) {
  const hasParts = Boolean(product.parts?.length);
  const hasDocs = Boolean(product.documents?.length);

  return (
    <Tabs defaultValue="description">
      <TabsList variant="line">
        <TabsTrigger value="description">Description</TabsTrigger>
        {hasParts ? <TabsTrigger value="parts">Part Lists</TabsTrigger> : null}
        <TabsTrigger value="specs">{product.specTabLabel}</TabsTrigger>
        {hasDocs ? (
          <TabsTrigger value="docs">Product Documentation</TabsTrigger>
        ) : null}
      </TabsList>

      <TabsContent value="description" className="pt-6">
        <DescriptionBody description={product.description} />
      </TabsContent>

      {hasParts ? (
        <TabsContent value="parts" className="pt-6">
          <PartsGrid parts={product.parts!} />
        </TabsContent>
      ) : null}

      <TabsContent value="specs" className="pt-6">
        {product.specsFlat?.length ? (
          <FlatSpecs specs={product.specsFlat} />
        ) : (
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              {product.specGroupsLeft.map((g) => (
                <SpecGroupBlock key={g.title} group={g} />
              ))}
            </div>
            <div className="flex flex-col gap-8">
              {product.specGroupsRight.map((g) => (
                <SpecGroupBlock key={g.title} group={g} />
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      {hasDocs ? (
        <TabsContent value="docs" className="pt-6">
          <ProductDocumentation item={product.item} documents={product.documents!} />
        </TabsContent>
      ) : null}
    </Tabs>
  );
}
