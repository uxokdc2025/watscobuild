"use client";

import * as React from "react";
import { ChevronRight, LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FilterPill, FilterOption, FilterSection, RadiusControl } from "@/components/ui/plp-filters";
import { ProductListRow } from "@/components/ui/product-list-row";
import { Category, Demo, State } from "../_showcase";

export function PlpSection() {
  const [radius, setRadius] = React.useState("50");
  return (
    <Category id="plp" title="PLP patterns" description="Reusable product-list patterns: branch selection, applied filters, radius, facets, view controls, and product actions.">
      <Demo name="Applied filter pills" slug="plp-filters" description="Blue pills sit below the results heading; Clear All is a text link.">
        <State label="Default">
          <div className="flex flex-wrap items-center gap-2"><FilterPill label="Manchester, NH - Homans" onRemove={() => undefined} /><FilterPill label="Amps: 2" onRemove={() => undefined} /><Button variant="link" className="px-1">Clear All</Button></div>
        </State>
      </Demo>
      <Demo name="Branch selector" slug="plp-branch-selector" description="The active header store is selected by default and does not become an applied filter pill.">
        <State label="Your store selected">
          <Card className="w-full max-w-sm"><CardContent className="p-4"><p className="mb-3 font-semibold">Stocked At</p><RadioGroup defaultValue="your-store" className="gap-2"><label className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"><span className="flex items-center gap-2"><RadioGroupItem value="your-store" />Your Store</span><span className="text-xs text-muted-foreground">(0)</span></label><label className="flex items-center justify-between px-3 py-2"><span className="flex items-center gap-2"><RadioGroupItem value="nearby" />Nearby Branches</span><span className="text-xs text-muted-foreground">(0)</span></label><label className="flex items-center justify-between px-3 py-2"><span className="flex items-center gap-2"><RadioGroupItem value="all" />All Branches</span><span className="text-xs text-muted-foreground">(101)</span></label></RadioGroup><Button variant="link" className="mt-2 px-0">Change</Button></CardContent></Card>
        </State>
      </Demo>
      <Demo name="Radius control" slug="plp-radius" description="Numeric radius input with an explicit miles label and Apply action.">
        <State label="Default"><RadiusControl value={radius} onChange={setRadius} /></State>
      </Demo>
      <Demo name="Facet list" slug="plp-facet-list" description="Expandable section with checkboxes, counts, and a compact See More link.">
        <State label="Expanded"><div className="w-full max-w-sm"><FilterSection title="Amps"><div className="space-y-1"><FilterOption id="plp-amp-2" label="2" count={1} /><FilterOption id="plp-amp-3" label="3" count={4} /><FilterOption id="plp-amp-4" label="4" count={10} /></div><Button variant="link" size="sm" className="mt-2 px-0">See More</Button></FilterSection></div></State>
      </Demo>
      <Demo name="Results view controls" slug="plp-view-toggle" description="Grid and list are mutually exclusive selected states.">
        <State label="Grid selected"><div className="inline-flex rounded-md border p-0.5"><Button size="sm" className="gap-1"><LayoutGrid />Grid</Button><Button size="sm" variant="ghost" className="gap-1"><List />List</Button></div></State>
      </Demo>
      <Demo name="Product list row" slug="product-list-row" description="Compact PLP result row: product identity on the left, commerce actions aligned to the right.">
        <State label="Default"><div className="w-full"><ProductListRow image="/peirce-search/blower-motor-01.avif" imageAlt="Blower motor" brand="Factory Authorized Parts" title="Blower Motor 1/2 HP · 120/240 V" item="58MV660006" mfg="58MV 660 006" actions={<Button size="sm">Add to Cart</Button>} /></div></State>
      </Demo>
      <Demo name="Product-card actions" slug="plp-product-actions" description="Quantity control, primary Add action, and secondary Save link follow the shared button system.">
        <State label="Default"><div className="flex items-center gap-2"><div className="inline-flex h-9 items-center rounded-md border"><Button size="icon-sm" variant="ghost" aria-label="Decrease quantity">−</Button><span className="grid h-full w-8 place-items-center border-x text-sm">1</span><Button size="icon-sm" variant="ghost" aria-label="Increase quantity">+</Button></div><Button><span className="sr-only">Add </span>to Cart</Button><Button variant="link">Save</Button><ChevronRight className="sr-only" /></div></State>
      </Demo>
    </Category>
  );
}
