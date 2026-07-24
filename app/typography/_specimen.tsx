"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export type Spec = {
  /** Human name, e.g. "Section heading" */
  name: string;
  /** Tailwind classes applied to the live sample */
  cls: string;
  /** Rendered size in px */
  px: number;
  /** Weight description, e.g. "Semibold 600" */
  weight: string;
  /** Live sample copy */
  sample: string;
};

function ClassChip({ cls }: { cls: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(cls);
      setCopied(true);
      toast.success("Copied Tailwind classes", { description: cls });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy Tailwind classes"
      className="group inline-flex items-center gap-2 rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span>{cls}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-in-stock" />
      ) : (
        <Copy className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
      )}
    </button>
  );
}

export function TypeSpecimen({ spec }: { spec: Spec }) {
  return (
    <div className="flex flex-col gap-3 border-b py-6 last:border-b-0 md:flex-row md:items-start md:justify-between md:gap-10">
      {/* Live sample rendered at its actual class */}
      <p className={cn("min-w-0 flex-1 text-foreground", spec.cls)}>
        {spec.sample}
      </p>

      {/* Spec metadata */}
      <div className="flex shrink-0 flex-col gap-1.5 md:w-64 md:items-end md:text-right">
        <span className="text-sm font-medium">{spec.name}</span>
        <ClassChip cls={spec.cls} />
        <span className="text-xs text-muted-foreground">
          {spec.px}px · {spec.weight}
        </span>
      </div>
    </div>
  );
}
