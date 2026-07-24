"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Check, Copy, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ───────────────────────── Theme toggle ───────────────────────── */

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Only trust the resolved theme after mount; before that, server and client
  // must agree on a stable label to avoid a hydration mismatch.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Avoid hydration mismatch: render a neutral icon until mounted */}
      {!mounted ? (
        <Sun className="opacity-0" />
      ) : isDark ? (
        <Moon />
      ) : (
        <Sun />
      )}
    </Button>
  );
}

/* ───────────────────────── Category section ───────────────────────── */

export function Category({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>
    </section>
  );
}

/* ───────────────────────── Component demo card ───────────────────────── */

export function Demo({
  name,
  slug,
  description,
  className,
  children,
}: {
  name: string;
  /** shadcn registry slug, e.g. "dropdown-menu" */
  slug: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <header className="flex flex-col gap-2 border-b px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{name}</h3>
          <InstallCommand slug={slug} />
        </div>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className={cn("flex flex-1 flex-wrap items-end gap-x-6 gap-y-5 p-5", className)}>
        {children}
      </div>
    </div>
  );
}

/* ───────────────────────── Install command chip ───────────────────────── */

export function InstallCommand({ slug }: { slug: string }) {
  const [copied, setCopied] = React.useState(false);
  const command = `npx shadcn@latest add ${slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success("Copied install command", { description: command });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy install command"
      className="group inline-flex max-w-full items-center gap-2 rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="truncate">add {slug}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-in-stock" />
      ) : (
        <Copy className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
      )}
    </button>
  );
}

/* ───────────────────────── State tile ───────────────────────── */

/**
 * A single labelled example. `label` names the state (Default, Hover,
 * Focus, Disabled, Loading, Error, Selected). Hover/Focus tiles render the
 * component with its interaction classes forced so the state is visible
 * without pointer/keyboard interaction.
 */
export function State({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <div className="flex min-h-9 items-center">{children}</div>
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

/** Full-width block inside a Demo (for tables, carousels, etc.). */
export function Block({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {children}
      {label ? (
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
      ) : null}
    </div>
  );
}
