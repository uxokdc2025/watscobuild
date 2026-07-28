"use client";

import * as React from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Represents the LOCKED third-party image gallery (still image + thumbnail
 * rail + zoom controls). We do not restyle its internals — we only frame it
 * in an outlined box so it sits inside the new PDP template. The hatched
 * "[ Product Image ]" area stands in for the vendor widget's canvas.
 */

function Placeholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-md text-xs text-muted-foreground",
        className
      )}
      style={{
        backgroundColor: "var(--muted)",
        backgroundImage:
          "repeating-linear-gradient(45deg, color-mix(in oklch, var(--muted-foreground) 12%, transparent) 0 8px, transparent 8px 16px)",
      }}
      aria-hidden
    >
      <span className="font-mono">[ Product Image ]</span>
    </div>
  );
}

function ZoomButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-8 cursor-pointer place-items-center rounded-md text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4"
    >
      {children}
    </button>
  );
}

export function PdpGallery({
  thumbnailCount = 7,
  images,
  alt = "Product",
}: {
  thumbnailCount?: number;
  images?: string[];
  alt?: string;
}) {
  const [active, setActive] = React.useState(0);
  const hasImages = Boolean(images?.length);
  const thumbs = hasImages
    ? images!
    : (Array.from({ length: thumbnailCount }) as undefined[]);
  // A single image needs no thumbnail rail.
  const showThumbs = thumbs.length > 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Main image canvas — border only around the image itself */}
      <div className="relative overflow-hidden rounded-lg border bg-card">
        {hasImages ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images![active] ?? images![0]}
            alt={alt}
            className="aspect-square w-full bg-white object-contain"
          />
        ) : (
          <Placeholder className="aspect-square w-full rounded-none" />
        )}

        {/* Vendor zoom controls (visual) */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md border bg-background/90 p-0.5 backdrop-blur">
          <ZoomButton label="Zoom in">
            <Plus />
          </ZoomButton>
          <ZoomButton label="Zoom out">
            <Minus />
          </ZoomButton>
          <ZoomButton label="Reset view">
            <RotateCcw />
          </ZoomButton>
        </div>
        <div className="absolute right-2 bottom-2 rounded-md border bg-background/90 p-0.5 backdrop-blur">
          <ZoomButton label="Fullscreen">
            <Maximize2 />
          </ZoomButton>
        </div>
      </div>

      {/* Thumbnail rail — hidden when there's only one image */}
      {showThumbs ? (
      <ul
        className="flex gap-2 overflow-x-auto pb-1"
        aria-label="Product image thumbnails"
      >
        {thumbs.map((src, i) => {
          const selected = i === active;
          return (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={selected}
                className={cn(
                  "block cursor-pointer overflow-hidden rounded-md border-2 outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  selected
                    ? "border-foreground"
                    : "border-transparent hover:border-foreground/30"
                )}
              >
                {hasImages ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src as string} alt="" className="size-14 bg-white object-contain" />
                ) : (
                  <Placeholder className="size-14" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      ) : null}
    </div>
  );
}
