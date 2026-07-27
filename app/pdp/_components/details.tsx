import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  product,
  specGroupsLeft,
  specGroupsRight,
  type SpecGroup,
} from "../_data";

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

export function PdpDetails() {
  return (
    <Tabs defaultValue="description">
      <TabsList variant="line">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Features and Specification</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="pt-6">
        <p className="max-w-3xl text-sm text-muted-foreground">
          {product.description}
        </p>
      </TabsContent>

      <TabsContent value="specs" className="pt-6">
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            {specGroupsLeft.map((g) => (
              <SpecGroupBlock key={g.title} group={g} />
            ))}
          </div>
          <div className="flex flex-col gap-8">
            {specGroupsRight.map((g) => (
              <SpecGroupBlock key={g.title} group={g} />
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
