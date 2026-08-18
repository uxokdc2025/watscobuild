"use client";

import { Check, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ProEssentialsBadge,
  SubstituteBadge,
} from "@/components/ui/label-badges";
import { Category, Demo, State } from "../_showcase";

export function ActionsSection() {
  return (
    <Category
      id="actions"
      title="Actions"
      description="Triggers and status markers. Hover/Focus tiles show the interaction styles forced on; every tile is also live."
    >
      {/* ── Button ── */}
      <Demo name="Button" slug="button" description="Six variants, four sizes.">
        <State label="Default">
          <Button>Button</Button>
        </State>
        <State label="Hover">
          <Button className="bg-primary/90">Button</Button>
        </State>
        <State label="Focus">
          <Button className="border-ring ring-[3px] ring-ring/50">Button</Button>
        </State>
        <State label="Disabled">
          <Button disabled>Button</Button>
        </State>
        <State label="Loading">
          <Button disabled>
            <Loader2 className="animate-spin" />
            Saving
          </Button>
        </State>
        <State label="Error">
          <Button variant="destructive">Delete</Button>
        </State>
        <State label="Secondary">
          <Button variant="secondary">Button</Button>
        </State>
        <State label="Outline">
          <Button variant="outline">Button</Button>
        </State>
        <State label="Ghost">
          <Button variant="ghost">Button</Button>
        </State>
        <State label="Link">
          <Button variant="link">Button</Button>
        </State>
        <State label="Icon">
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
        </State>
        <State label="Small">
          <Button size="sm">Button</Button>
        </State>
        <State label="Large">
          <Button size="lg">Button</Button>
        </State>
      </Demo>

      {/* ── Badge ── */}
      <Demo name="Badge" slug="badge" description="Compact status labels.">
        <State label="Default">
          <Badge>Badge</Badge>
        </State>
        <State label="Hover">
          <Badge asChild>
            <a href="#actions" className="bg-primary/90">
              Badge
            </a>
          </Badge>
        </State>
        <State label="Secondary">
          <Badge variant="secondary">Badge</Badge>
        </State>
        <State label="Outline">
          <Badge variant="outline">Badge</Badge>
        </State>
        <State label="Error">
          <Badge variant="destructive">Error</Badge>
        </State>
        <State label="Selected">
          <Badge className="bg-in-stock text-white">
            <Check className="size-3" />
            Active
          </Badge>
        </State>
        <State label="Pro Essentials">
          <ProEssentialsBadge />
        </State>
        <State label="Substitute">
          <SubstituteBadge />
        </State>
        <State label="Solid (Best Value)">
          <Badge variant="solid" color="violet">
            Best Value
          </Badge>
        </State>
        <State label="Soft — colors" className="w-full">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="soft" color="blue">Blue</Badge>
            <Badge variant="soft" color="violet">Violet</Badge>
            <Badge variant="soft" color="green">Green</Badge>
            <Badge variant="soft" color="amber">Amber</Badge>
            <Badge variant="soft" color="red">Red</Badge>
            <Badge variant="soft" color="slate">Slate</Badge>
          </div>
        </State>
        <State label="Solid — colors" className="w-full">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="solid" color="blue">Blue</Badge>
            <Badge variant="solid" color="violet">Violet</Badge>
            <Badge variant="solid" color="green">Green</Badge>
            <Badge variant="solid" color="amber">Amber</Badge>
            <Badge variant="solid" color="red">Red</Badge>
            <Badge variant="solid" color="slate">Slate</Badge>
          </div>
        </State>
      </Demo>
    </Category>
  );
}
