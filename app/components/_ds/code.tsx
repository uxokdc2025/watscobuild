"use client";

import * as React from "react";
import { Check, Copy, Code2, Eye } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

/* ─────────────────────────── Copy button ─────────────────────────── */

function CopyButton({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy code"
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md border bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
    >
      {copied ? <Check className="size-3.5 text-in-stock" /> : <Copy className="size-3.5" />}
    </button>
  );
}

/* ─────────────────────────── Code block ─────────────────────────── */

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <div className={cn("group relative", className)}>
      <pre className="overflow-x-auto rounded-lg border bg-muted/40 px-4 py-3 font-mono text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
      <CopyButton code={code} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100" />
    </div>
  );
}

/* ─────────────────────────── Preview / Code ───────────────────────────
 * The atomic unit of the reference — the shadcn pattern. Flip between the
 * rendered component and the EXACT source that produces it. The code is the
 * only thing a dev copies, so production can never drift from the library.
 * -------------------------------------------------------------------- */

export function PreviewCode({
  code,
  install,
  children,
  className,
  previewClassName,
}: {
  /** The exact JSX a developer should paste. */
  code: string;
  /** Optional registry install command, e.g. "button". */
  install?: string;
  children: React.ReactNode;
  className?: string;
  previewClassName?: string;
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card", className)}>
      <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
        <div role="tablist" aria-label="Preview or code" className="flex items-center gap-1">
          <button
            role="tab"
            aria-selected={tab === "preview"}
            onClick={() => setTab("preview")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              tab === "preview"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="size-3.5" />
            Preview
          </button>
          <button
            role="tab"
            aria-selected={tab === "code"}
            onClick={() => setTab("code")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              tab === "code"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="size-3.5" />
            Code
          </button>
        </div>
        <div className="flex items-center gap-2 pr-1">
          {install ? (
            <code className="hidden rounded-md border bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground sm:inline">
              npx shadcn add {install}
            </code>
          ) : null}
          <CopyButton code={tab === "code" ? code : `npx shadcn add ${install ?? ""}`.trim()} />
        </div>
      </div>

      {tab === "preview" ? (
        <div className={cn("flex flex-wrap items-center gap-4 bg-background p-6", previewClassName)}>
          {children}
        </div>
      ) : (
        <pre className="overflow-x-auto bg-muted/20 px-4 py-4 font-mono text-xs leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

/* ─────────────────────────── Props / API table ─────────────────────────── */

export function PropsTable({
  caption,
  rows,
}: {
  caption?: string;
  rows: { name: string; type: string; description: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-sm">
        {caption ? (
          <caption className="border-b px-4 py-2 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="border-b bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-2 font-medium">Value</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Use it for</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b last:border-0">
              <td className="px-4 py-2.5 align-top font-mono text-xs font-medium whitespace-nowrap">
                {r.name}
              </td>
              <td className="px-4 py-2.5 align-top font-mono text-xs whitespace-nowrap text-muted-foreground">
                {r.type}
              </td>
              <td className="px-4 py-2.5 align-top text-muted-foreground">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────── Do / Don't ─────────────────────────── */

export function Guidance({
  dos,
  donts,
}: {
  dos: React.ReactNode[];
  donts: React.ReactNode[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-in-stock/30 bg-in-stock/5 p-4">
        <p className="mb-2 text-xs font-semibold tracking-wide text-in-stock uppercase">Do</p>
        <ul className="flex flex-col gap-1.5 text-sm text-foreground">
          {dos.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="mt-0.5 text-in-stock">✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <p className="mb-2 text-xs font-semibold tracking-wide text-destructive uppercase">Don&apos;t</p>
        <ul className="flex flex-col gap-1.5 text-sm text-foreground">
          {donts.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="mt-0.5 text-destructive">✕</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
