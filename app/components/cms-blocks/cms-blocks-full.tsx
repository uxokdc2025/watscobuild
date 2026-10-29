import * as React from "react";
import { ImageIcon, Play, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ════════════════════════════════════════════════════════════════════════
   Full-size renderers for every Shopware Landing-page block — the real,
   live-page version of each catalog thumbnail. Drives both the single-block
   view and the "Build a Page" composer. DS tokens + placeholder imagery only.
   ════════════════════════════════════════════════════════════════════════ */

const HEAD = "Lorem Ipsum Dolor";
const PARA =
  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.";
const SHORT = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.";

function FImg({ className, rounded = "rounded-lg", ratio }: { className?: string; rounded?: string; ratio?: string }) {
  return (
    <div
      className={cn("grid place-items-center bg-muted text-muted-foreground/50", rounded, className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <ImageIcon className="size-10" aria-hidden />
    </div>
  );
}

function Heading({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-2xl font-bold tracking-tight text-foreground", className)}>{children ?? HEAD}</h3>;
}
function Para({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm leading-relaxed text-muted-foreground", className)}>{children ?? PARA}</p>;
}

function TextCol({ center = false, short = false }: { center?: boolean; short?: boolean }) {
  return (
    <div className={cn(center && "text-center")}>
      <Heading className="text-xl" />
      <Para className="mt-2">{short ? SHORT : PARA}</Para>
    </div>
  );
}

function Video({ brand }: { brand: "youtube" | "vimeo" }) {
  return (
    <div className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-lg bg-muted">
      <span
        className={cn(
          "grid size-16 place-items-center rounded-2xl text-white shadow-lg",
          brand === "youtube" ? "bg-[#ff0000]" : "bg-[#1ab7ea]",
        )}
      >
        <Play className="size-8 translate-x-0.5 fill-current" aria-hidden />
      </span>
    </div>
  );
}

/** Renders one block full width. `boxed` keeps the section inside the page
 *  gutter; a few blocks render edge-to-edge. */
export function FullBlock({ name }: { name: string }) {
  switch (name) {
    /* ── Text ── */
    case "text":
      return (
        <div>
          <Heading />
          <Para className="mt-3" />
        </div>
      );
    case "text-hero":
      return (
        <div className="rounded-xl bg-muted/50 px-6 py-12 text-center">
          <Heading className="text-4xl" />
          <Para className="mx-auto mt-4 max-w-2xl">{SHORT}</Para>
        </div>
      );
    case "text-teaser":
      return (
        <div className="text-center">
          <Heading className="text-3xl" />
          <span className="mx-auto mt-3 block h-1 w-16 rounded bg-primary/40" />
          <Para className="mx-auto mt-4 max-w-2xl">{PARA}</Para>
        </div>
      );
    case "text-teaser-section":
      return (
        <div className="grid gap-10 md:grid-cols-2">
          <TextCol short />
          <TextCol short />
        </div>
      );
    case "text-two-column":
      return (
        <div className="grid gap-10 md:grid-cols-2">
          <TextCol /> <TextCol />
        </div>
      );
    case "text-three-column":
      return (
        <div className="grid gap-8 md:grid-cols-3">
          <TextCol short /> <TextCol short /> <TextCol short />
        </div>
      );

    /* ── Images ── */
    case "image":
      return (
        <div className="mx-auto max-w-3xl">
          <FImg ratio="16/9" />
        </div>
      );
    case "image-cover":
      return <FImg ratio="21/9" />;
    case "image-two-column":
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          <FImg ratio="4/3" /> <FImg ratio="4/3" />
        </div>
      );
    case "image-three-column":
      return (
        <div className="grid gap-6 sm:grid-cols-3">
          <FImg ratio="1" /> <FImg ratio="1" /> <FImg ratio="1" />
        </div>
      );
    case "image-three-cover":
      return (
        <div className="grid grid-cols-3 gap-1">
          <FImg ratio="1" rounded="rounded-l-lg" />
          <FImg ratio="1" rounded="rounded-none" />
          <FImg ratio="1" rounded="rounded-r-lg" />
        </div>
      );
    case "image-four-column":
      return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FImg ratio="1" /> <FImg ratio="1" /> <FImg ratio="1" /> <FImg ratio="1" />
        </div>
      );
    case "image-bubble-row":
      return (
        <div className="flex flex-wrap justify-center gap-10">
          {[0, 1, 2].map((i) => (
            <FImg key={i} ratio="1" rounded="rounded-full" className="w-36" />
          ))}
        </div>
      );
    case "image-highlight-row":
      return (
        <div className="grid gap-5 rounded-2xl bg-muted/60 p-6 sm:grid-cols-3">
          <FImg ratio="1" className="bg-background" />
          <FImg ratio="1" className="bg-background" />
          <FImg ratio="1" className="bg-background" />
        </div>
      );
    case "image-simple-grid":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-5">
            <FImg ratio="2/1" /> <FImg ratio="2/1" />
          </div>
          <FImg />
        </div>
      );
    case "image-slider":
      return (
        <div className="flex items-center gap-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border text-muted-foreground">
            <ChevronLeft className="size-5" />
          </span>
          <div className="flex-1">
            <FImg ratio="21/9" />
            <div className="mt-3 flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={cn("size-2 rounded-full", i === 0 ? "bg-primary" : "bg-border")} />
              ))}
            </div>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border text-muted-foreground">
            <ChevronRight className="size-5" />
          </span>
        </div>
      );
    case "image-gallery":
      return (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <FImg ratio="4/3" />
          <div className="flex gap-3 sm:flex-col">
            {[0, 1, 2, 3].map((i) => (
              <FImg key={i} ratio="1" className="w-20" />
            ))}
          </div>
        </div>
      );

    /* ── Video ── */
    case "youtube-video":
      return <Video brand="youtube" />;
    case "vimeo-video":
      return <Video brand="vimeo" />;

    /* ── Text & images ── */
    case "image-text":
      return (
        <div className="grid items-center gap-8 md:grid-cols-2">
          <FImg ratio="4/3" />
          <div>
            <Heading />
            <Para className="mt-3" />
            <Button className="mt-5">Learn More</Button>
          </div>
        </div>
      );
    case "image-text-cover":
      return (
        <div className="grid items-stretch gap-0 overflow-hidden rounded-xl border md:grid-cols-2">
          <FImg rounded="rounded-none" className="min-h-[260px]" />
          <div className="flex flex-col justify-center bg-muted/40 p-8">
            <Heading />
            <Para className="mt-3" />
            <Button className="mt-5 w-fit">Learn More</Button>
          </div>
        </div>
      );
    case "center-text":
      return (
        <div className="grid items-center gap-8 md:grid-cols-3">
          <FImg ratio="1" />
          <div className="text-center">
            <Heading className="text-xl" />
            <Para className="mt-3">{SHORT}</Para>
          </div>
          <FImg ratio="1" />
        </div>
      );
    case "image-text-row":
      return (
        <div className="grid gap-8 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <FImg ratio="4/3" />
              <Heading className="mt-4 text-lg" />
              <Para className="mt-2">{SHORT}</Para>
            </div>
          ))}
        </div>
      );
    case "image-text-gallery":
      return (
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-card">
              <FImg ratio="16/9" rounded="rounded-none" />
              <div className="p-5">
                <Heading className="text-lg" />
                <Para className="mt-2">{SHORT}</Para>
                <Button variant="outline" size="sm" className="mt-4 text-foreground">
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
    case "image-text-bubble":
      return (
        <div className="grid gap-8 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <FImg ratio="1" rounded="rounded-full" className="w-28" />
              <Heading className="mt-4 text-lg" />
              <Para className="mt-2">{SHORT}</Para>
            </div>
          ))}
        </div>
      );
    case "text-on-image":
      return (
        <div className="relative grid min-h-[340px] place-items-center overflow-hidden rounded-xl bg-muted">
          <ImageIcon className="absolute size-16 text-muted-foreground/30" aria-hidden />
          <div className="relative z-10 max-w-xl px-6 text-center">
            <Heading className="text-4xl" />
            <Para className="mx-auto mt-4 max-w-md">{SHORT}</Para>
            <Button className="mt-6">Shop Now</Button>
          </div>
        </div>
      );

    default:
      return <div className="rounded-lg bg-muted py-16 text-center text-sm text-muted-foreground">Preview unavailable</div>;
  }
}

/** Blocks that intentionally render edge-to-edge (no page gutter). */
export const FULL_BLEED = new Set(["image-cover", "text-on-image"]);
