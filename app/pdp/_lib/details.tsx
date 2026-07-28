import { FileText, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  PdpDescription,
  PdpDocument,
  PdpProduct,
  SpecGroup,
} from "./types";

function DocumentsBlock({ documents }: { documents: PdpDocument[] }) {
  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-base font-bold">Documents</h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {documents.map((d) => (
          <li key={d.label}>
            <a
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {d.kind === "video" ? (
                <Video className="size-4 shrink-0" />
              ) : (
                <FileText className="size-4 shrink-0" />
              )}
              {d.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
      {label} — coming soon.
    </div>
  );
}

export function PdpDetails({ product }: { product: PdpProduct }) {
  return (
    <Tabs defaultValue="description">
      <TabsList variant="line">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">{product.specTabLabel}</TabsTrigger>
        {product.comingSoonTabs?.map((t, i) => (
          <TabsTrigger key={t} value={`cs-${i}`}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="description" className="pt-6">
        <DescriptionBody description={product.description} />
        {product.documents?.length ? (
          <DocumentsBlock documents={product.documents} />
        ) : null}
      </TabsContent>

      <TabsContent value="specs" className="pt-6">
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
      </TabsContent>

      {product.comingSoonTabs?.map((t, i) => (
        <TabsContent key={t} value={`cs-${i}`} className="pt-6">
          <ComingSoon label={t} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
