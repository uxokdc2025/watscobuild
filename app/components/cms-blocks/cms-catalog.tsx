import * as React from "react";
import { ImageIcon, Play, Star } from "lucide-react";

import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════════
   Shopware CMS — Landing Page block catalog.
   A design-system mirror of every block Shopware's "Shopping Experiences"
   editor offers when building a LANDING PAGE. Verified against the
   shopware/shopware trunk source — the sw-cms block registry + the en.json
   snippet labels, and the isBlockAllowedInPageType() gate for the
   `landingpage` page type:
     Text (6), Images (11), Text & images (7), Video (3), Commerce (6),
     Sidebar (1), Form (1), HTML (1) = 36 landing-page blocks.
   Each thumbnail is built from DS tokens. Clicking a block jumps to its
   full, realistic example on the /components/cms-blocks/examples page.
   Only three blocks are NOT offered on a landing page (hidden, or gated by
   allowedPageTypes) — listed in CMS_OTHER for completeness.
   ════════════════════════════════════════════════════════════════════════ */

/* Thumbnail copy — real HVAC marketing lines (not lorem stand-ins) so the
   catalog previews read like the live examples they link to. */
const HEAD = "HVAC Products You Need";
const LEAD =
  "The quality HVAC equipment, supplies, parts, and tools you need, when you need them — from the most trusted manufacturers in heating and cooling.";
const SHORT = "Trusted HVAC brands, in stock at your local branch.";

/* ── Preview primitives ─────────────────────────────────────────────── */
function Img({
  className,
  rounded = "rounded-md",
  ratio,
}: {
  className?: string;
  rounded?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn("grid place-items-center bg-muted text-muted-foreground/60", rounded, className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <ImageIcon className="size-7" aria-hidden />
    </div>
  );
}

function Txt({
  align = "left",
  head = HEAD,
  body = LEAD,
  headClass = "text-sm",
  rule = false,
}: {
  align?: "left" | "center";
  head?: string;
  body?: string;
  headClass?: string;
  rule?: boolean;
}) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      <p className={cn("font-bold leading-tight tracking-tight text-foreground", headClass)}>{head}</p>
      {rule ? <span className={cn("mt-2 block h-0.5 w-10 rounded bg-border", align === "center" && "mx-auto")} /> : null}
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function VideoPh({ brand }: { brand: "youtube" | "vimeo" }) {
  return (
    <div className="relative grid aspect-video place-items-center overflow-hidden rounded-md bg-muted">
      <span
        className={cn(
          "grid size-12 place-items-center rounded-xl text-white shadow",
          brand === "youtube" ? "bg-[#ff0000]" : "bg-[#1ab7ea]",
        )}
      >
        <Play className="size-6 translate-x-0.5 fill-current" aria-hidden />
      </span>
      <span className="absolute bottom-2 right-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {brand === "youtube" ? "YouTube" : "Vimeo"}
      </span>
    </div>
  );
}

/* Mini product box for the Commerce thumbnails. */
function PBox() {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border bg-card p-2">
      <Img ratio="1" className="bg-muted" />
      <span className="h-2 w-3/4 rounded bg-border" />
      <span className="h-2 w-1/2 rounded bg-primary/40" />
    </div>
  );
}

/* ── Per-block preview renderer (keyed by Shopware block name) ───────── */
export function Preview({ name }: { name: string }) {
  switch (name) {
    /* Text */
    case "text":
      return <Txt />;
    case "text-hero":
      return <Txt align="center" head={HEAD} headClass="text-xl" />;
    case "text-teaser":
      return <Txt align="center" headClass="text-lg" rule body={SHORT} />;
    case "text-teaser-section":
      return (
        <div className="grid grid-cols-2 gap-4">
          <Txt rule body={SHORT} />
          <Txt rule body={SHORT} />
        </div>
      );
    case "text-two-column":
      return (
        <div className="grid grid-cols-2 gap-4">
          <Txt /> <Txt />
        </div>
      );
    case "text-three-column":
      return (
        <div className="grid grid-cols-3 gap-3">
          <Txt body={SHORT} /> <Txt body={SHORT} /> <Txt body={SHORT} />
        </div>
      );

    /* Images */
    case "image":
      return (
        <div className="px-10">
          <Img ratio="16/9" />
        </div>
      );
    case "image-cover":
      return <Img ratio="21/9" rounded="rounded-none" />;
    case "image-two-column":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Img ratio="4/3" /> <Img ratio="4/3" />
        </div>
      );
    case "image-three-column":
      return (
        <div className="grid grid-cols-3 gap-3">
          <Img ratio="1" /> <Img ratio="1" /> <Img ratio="1" />
        </div>
      );
    case "image-three-cover":
      return (
        <div className="grid grid-cols-3 gap-0">
          <Img ratio="1" rounded="rounded-l-md" />
          <Img ratio="1" rounded="rounded-none" />
          <Img ratio="1" rounded="rounded-r-md" />
        </div>
      );
    case "image-four-column":
      return (
        <div className="grid grid-cols-4 gap-2">
          <Img ratio="1" /> <Img ratio="1" /> <Img ratio="1" /> <Img ratio="1" />
        </div>
      );
    case "image-bubble-row":
      return (
        <div className="flex justify-center gap-6">
          {[0, 1, 2].map((i) => (
            <Img key={i} ratio="1" rounded="rounded-full" className="w-20" />
          ))}
        </div>
      );
    case "image-highlight-row":
      return (
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3">
          <Img ratio="1" className="bg-background" />
          <Img ratio="1" className="bg-background" />
          <Img ratio="1" className="bg-background" />
        </div>
      );
    case "image-simple-grid":
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-3">
            <Img ratio="2/1" /> <Img ratio="2/1" />
          </div>
          <Img />
        </div>
      );
    case "image-slider":
      return (
        <div className="flex items-center gap-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-full border text-muted-foreground">‹</span>
          <div className="flex-1">
            <Img ratio="21/9" />
            <div className="mt-2 flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className={cn("size-1.5 rounded-full", i === 0 ? "bg-primary" : "bg-border")} />
              ))}
            </div>
          </div>
          <span className="grid size-6 shrink-0 place-items-center rounded-full border text-muted-foreground">›</span>
        </div>
      );
    case "image-gallery":
      return (
        <div className="space-y-2">
          <Img ratio="21/9" />
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <Img key={i} ratio="1" className="w-14" />
            ))}
          </div>
        </div>
      );

    /* Video */
    case "video":
      return (
        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-md bg-muted">
          <span className="grid size-12 place-items-center rounded-xl bg-primary text-white shadow">
            <Play className="size-6 translate-x-0.5 fill-current" aria-hidden />
          </span>
          <span className="absolute bottom-2 right-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Media
          </span>
        </div>
      );
    case "youtube-video":
      return <VideoPh brand="youtube" />;
    case "vimeo-video":
      return <VideoPh brand="vimeo" />;

    /* Text & images */
    case "image-text":
      return (
        <div className="grid grid-cols-2 items-center gap-4">
          <Img ratio="4/3" />
          <Txt />
        </div>
      );
    case "image-text-cover":
      return (
        <div className="grid grid-cols-2 items-stretch gap-0">
          <Img rounded="rounded-l-md" />
          <div className="flex items-center bg-muted/40 p-4">
            <Txt />
          </div>
        </div>
      );
    case "center-text":
      return (
        <div className="grid grid-cols-3 items-center gap-4">
          <Img ratio="1" />
          <Txt align="center" body={SHORT} />
          <Img ratio="1" />
        </div>
      );
    case "image-text-row":
      return (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Img ratio="4/3" />
              <Txt body={SHORT} headClass="text-xs" />
            </div>
          ))}
        </div>
      );
    case "image-text-gallery":
      return (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Img ratio="4/3" rounded="rounded-none" />
              <div className="p-3">
                <Txt body={SHORT} headClass="text-xs" />
              </div>
            </div>
          ))}
        </div>
      );
    case "image-text-bubble":
      return (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <Img ratio="1" rounded="rounded-full" className="w-16" />
              <Txt align="center" body={SHORT} headClass="text-xs" />
            </div>
          ))}
        </div>
      );
    case "text-on-image":
      return (
        <div className="relative grid aspect-[21/9] place-items-center overflow-hidden rounded-md bg-muted">
          <div className="text-center">
            <p className="text-lg font-bold tracking-tight text-foreground">{HEAD}</p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">{SHORT}</p>
          </div>
        </div>
      );

    /* Commerce */
    case "product-slider":
      return (
        <div className="grid grid-cols-4 gap-2">
          <PBox /> <PBox /> <PBox /> <PBox />
        </div>
      );
    case "product-three-column":
      return (
        <div className="grid grid-cols-3 gap-2">
          <PBox /> <PBox /> <PBox />
        </div>
      );
    case "cross-selling":
      return (
        <div>
          <span className="mb-1.5 block h-2 w-24 rounded bg-border" />
          <div className="grid grid-cols-4 gap-2">
            <PBox /> <PBox /> <PBox /> <PBox />
          </div>
        </div>
      );
    case "category-name":
      return (
        <div className="rounded-md bg-muted/60 p-4">
          <p className="text-lg font-bold tracking-tight text-foreground">Category Name</p>
        </div>
      );
    case "gallery-buybox":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Img ratio="1" />
          <div className="flex flex-col justify-center gap-1.5">
            <span className="h-2.5 w-3/4 rounded bg-border" />
            <span className="h-3 w-1/2 rounded bg-primary/40" />
            <span className="mt-1 h-6 w-full rounded bg-primary/80" />
          </div>
        </div>
      );
    case "product-description-reviews":
      return (
        <div className="space-y-1.5">
          <span className="block h-2 w-full rounded bg-border" />
          <span className="block h-2 w-5/6 rounded bg-border" />
          <span className="mt-2 flex items-center gap-1 text-rating-star" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-3 fill-current" />
            ))}
          </span>
        </div>
      );

    /* Sidebar */
    case "category-navigation":
      return (
        <div className="max-w-[180px] space-y-1.5 rounded-md border p-2">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cn("block h-2.5 rounded", i === 0 ? "w-3/4 bg-primary/40" : "w-full bg-border")} />
          ))}
        </div>
      );

    /* Form */
    case "form":
      return (
        <div className="space-y-2">
          <span className="block h-7 w-full rounded border bg-background" />
          <span className="block h-7 w-full rounded border bg-background" />
          <span className="block h-6 w-20 rounded bg-primary/80" />
        </div>
      );

    /* HTML */
    case "html":
      return (
        <div className="rounded-md bg-foreground p-3 font-mono text-[10px] leading-relaxed text-background">
          &lt;div class=&quot;promo&quot;&gt;…&lt;/div&gt;
        </div>
      );

    default:
      return (
        <div className="grid place-items-center rounded-md bg-muted py-8 text-xs text-muted-foreground">
          Not drawn
        </div>
      );
  }
}

/* ── Catalog data (landing-page categories, Shopware order) ──────────── */
export type Block = { name: string; label: string };
export type CmsCategory = { id: string; title: string; shopware: string; blocks: Block[] };
type Category = CmsCategory;

export const CMS_CATEGORIES: Category[] = [
  {
    id: "text",
    title: "Text",
    shopware: "Text",
    blocks: [
      { name: "text", label: "Text" },
      { name: "text-hero", label: "Text banner" },
      { name: "text-teaser", label: "Teaser text" },
      { name: "text-teaser-section", label: "Two columns, teaser text" },
      { name: "text-two-column", label: "Two columns, text" },
      { name: "text-three-column", label: "Three columns, text" },
    ],
  },
  {
    id: "image",
    title: "Images",
    shopware: "Images",
    blocks: [
      { name: "image", label: "Image, boxed" },
      { name: "image-cover", label: "Image, full-sized" },
      { name: "image-two-column", label: "Two columns, boxed" },
      { name: "image-three-column", label: "Three columns, boxed" },
      { name: "image-three-cover", label: "Three columns, full-sized" },
      { name: "image-four-column", label: "Four columns, boxed" },
      { name: "image-bubble-row", label: "Three columns, rounded" },
      { name: "image-highlight-row", label: "Three columns, boxed & background" },
      { name: "image-simple-grid", label: "Image grid" },
      { name: "image-slider", label: "Image slider" },
      { name: "image-gallery", label: "Image gallery" },
    ],
  },
  {
    id: "text-image",
    title: "Text & images",
    shopware: "Text & images",
    blocks: [
      { name: "image-text", label: "Two columns, boxed image & text" },
      { name: "image-text-cover", label: "Two columns, full-sized image & text" },
      { name: "center-text", label: "Three columns, boxed images & text" },
      { name: "image-text-row", label: "Three columns, captioned images" },
      { name: "image-text-gallery", label: "Three columns, image/text cards" },
      { name: "image-text-bubble", label: "Three columns, captioned & rounded" },
      { name: "text-on-image", label: "Hero image" },
    ],
  },
  {
    id: "video",
    title: "Video",
    shopware: "Video",
    blocks: [
      { name: "video", label: "Video" },
      { name: "vimeo-video", label: "Vimeo video" },
      { name: "youtube-video", label: "YouTube video" },
    ],
  },
  {
    id: "commerce",
    title: "Commerce",
    shopware: "Commerce",
    blocks: [
      { name: "product-slider", label: "Product slider" },
      { name: "product-three-column", label: "Three columns, product boxes" },
      { name: "cross-selling", label: "Cross Selling" },
      { name: "category-name", label: "Category name" },
      { name: "gallery-buybox", label: "Image gallery and buy box" },
      { name: "product-description-reviews", label: "Product description & reviews" },
    ],
  },
  {
    id: "sidebar",
    title: "Sidebar",
    shopware: "Sidebar",
    blocks: [{ name: "category-navigation", label: "Category navigation" }],
  },
  {
    id: "form",
    title: "Form",
    shopware: "Form",
    blocks: [{ name: "form", label: "Form" }],
  },
  {
    id: "html",
    title: "HTML",
    shopware: "HTML",
    blocks: [{ name: "html", label: "HTML" }],
  },
];

/* The only blocks the Landing-page picker does NOT surface — verified in the
   sw-cms registry (either `hidden`, or gated by `allowedPageTypes`). */
export const CMS_OTHER = [
  { title: "Commerce", blocks: ["Product listing", "Product name & manufacturer logo"] },
  { title: "Sidebar", blocks: ["Product filter"] },
];

export function BlockCard({ block }: { block: Block }) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <div className="flex min-h-[150px] flex-1 items-center bg-background p-5">
        <div className="w-full">
          <Preview name={block.name} />
        </div>
      </div>
      <figcaption className="border-t bg-muted/40 px-4 py-2.5 text-center text-sm font-medium">
        {block.label}
      </figcaption>
    </figure>
  );
}
