"use client";

import Link from "next/link";
import { ExternalLink, ImageIcon } from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselHeader,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "avatar", label: "Avatar" },
  { id: "aspect-ratio", label: "Aspect ratio" },
  { id: "carousel", label: "Carousel" },
  { id: "guidance", label: "Guidance" },
  { id: "api", label: "API" },
  { id: "in-production", label: "In production" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export default function MediaReference() {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Media</h1>
          <p className="max-w-2xl text-muted-foreground">
            Images and identities: user/brand avatars, a fixed-ratio image frame that
            prevents layout shift, and the swipeable rail behind product galleries and
            &quot;you may also like&quot; strips. Each renders live below with the exact JSX to
            paste.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Avatar, … }"} from &quot;@/components/ui/avatar&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              npx shadcn add avatar carousel
            </code>
          </div>
        </header>

        {/* ── Avatar ── */}
        <section className="space-y-4">
          <H2 id="avatar">Avatar</H2>
          <p className="text-sm text-muted-foreground">
            An image with an automatic text fallback when the source fails.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">size</code> is{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">sm</code> /{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">default</code> /{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">lg</code>; a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Badge</code> marks presence and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Group</code> stacks a set.
          </p>
          <PreviewCode
            install="avatar"
            code={`{/* Image with fallback */}
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

{/* Fallback only (broken/empty src) */}
<Avatar>
  <AvatarImage src="" alt="broken" />
  <AvatarFallback>AL</AvatarFallback>
</Avatar>

{/* With presence badge */}
<Avatar>
  <AvatarFallback>ok</AvatarFallback>
  <AvatarBadge className="bg-in-stock" />
</Avatar>

{/* Stacked group with overflow count */}
<AvatarGroup>
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>`}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="" alt="broken" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>ok</AvatarFallback>
              <AvatarBadge className="bg-in-stock" />
            </Avatar>
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+3</AvatarGroupCount>
            </AvatarGroup>
          </PreviewCode>
        </section>

        {/* ── Aspect ratio ── */}
        <section className="space-y-4">
          <H2 id="aspect-ratio">Aspect ratio</H2>
          <p className="text-sm text-muted-foreground">
            Product thumbnails reserve their space with a Tailwind{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">aspect-*</code> utility on the
            frame — no layout shift as the image loads. There is no{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">AspectRatio</code> component in
            this registry; this utility-first pattern is the standard.
          </p>
          <PreviewCode
            previewClassName="items-start"
            code={`{/* Square PLP/PDP thumbnail — reserve the box, then fill it */}
<div className="w-40 overflow-hidden rounded-lg border bg-muted">
  <div className="aspect-square">
    <img
      src="/product.jpg"
      alt="Blower motor"
      className="size-full object-contain"
    />
  </div>
</div>

{/* 4:3 and 16:9 frames use the same pattern */}
<div className="aspect-[4/3] …" />
<div className="aspect-video …" />`}
          >
            <div className="flex flex-wrap items-start gap-4">
              <figure className="w-40 space-y-1">
                <div className="overflow-hidden rounded-lg border bg-muted">
                  <div className="flex aspect-square items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-8" />
                  </div>
                </div>
                <figcaption className="text-center text-xs text-muted-foreground">aspect-square</figcaption>
              </figure>
              <figure className="w-40 space-y-1">
                <div className="overflow-hidden rounded-lg border bg-muted">
                  <div className="flex aspect-[4/3] items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-8" />
                  </div>
                </div>
                <figcaption className="text-center text-xs text-muted-foreground">aspect-[4/3]</figcaption>
              </figure>
              <figure className="w-56 space-y-1">
                <div className="overflow-hidden rounded-lg border bg-muted">
                  <div className="flex aspect-video items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-8" />
                  </div>
                </div>
                <figcaption className="text-center text-xs text-muted-foreground">aspect-video</figcaption>
              </figure>
            </div>
          </PreviewCode>
        </section>

        {/* ── Carousel ── */}
        <section className="space-y-4">
          <H2 id="carousel">Carousel</H2>
          <p className="text-sm text-muted-foreground">
            A swipeable rail (Embla). Put the title and a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">CarouselControls</code> inside a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">CarouselHeader</code> so the
            prev/next arrows sit top-right, aligned with the heading — not tiny circles overlapping
            the cards. At the first slide the Previous control is disabled; use the arrows or drag.
            Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">opts={"{{ align: \"start\" }}"}</code>{" "}
            and a <code className="rounded bg-muted px-1 py-0.5 text-xs">basis-*</code> on each item
            for multi-up product rails.
          </p>
          <PreviewCode
            install="carousel"
            previewClassName="items-stretch"
            code={`{/* Single-item gallery — controls in the header row */}
<Carousel className="flex flex-col gap-3">
  <CarouselHeader>
    <span className="text-sm font-medium">Gallery</span>
    <CarouselControls />
  </CarouselHeader>
  <CarouselContent>
    {items.map((n) => (
      <CarouselItem key={n}>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-4xl font-semibold">{n}</span>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>`}
          >
            <div className="mx-auto w-full max-w-xs">
              <Carousel className="flex flex-col gap-3">
                <CarouselHeader>
                  <span className="text-sm font-medium">Gallery</span>
                  <CarouselControls />
                </CarouselHeader>
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <CarouselItem key={i}>
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold">{i + 1}</span>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </PreviewCode>

          <p className="pt-2 text-sm font-medium">Multiple items per view (product rails)</p>
          <PreviewCode
            previewClassName="items-stretch"
            code={`<Carousel opts={{ align: "start" }} className="flex flex-col gap-3">
  <CarouselHeader>
    <h3 className="text-xl font-bold tracking-tight">Frequently Bought Together</h3>
    <CarouselControls />
  </CarouselHeader>
  <CarouselContent>
    {items.map((n) => (
      <CarouselItem key={n} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold">{n}</span>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>`}
          >
            <div className="w-full">
              <Carousel opts={{ align: "start" }} className="flex w-full flex-col gap-3">
                <CarouselHeader>
                  <span className="text-sm font-medium">Products</span>
                  <CarouselControls />
                </CarouselHeader>
                <CarouselContent>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <CarouselItem key={i} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-2xl font-semibold">{i + 1}</span>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </PreviewCode>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Always give <code className="rounded bg-muted px-1 py-0.5 text-xs">AvatarFallback</code> real initials — it is what shows when the image 404s.</>,
              <>Reserve image space with an <code className="rounded bg-muted px-1 py-0.5 text-xs">aspect-*</code> frame so thumbnails never shift the grid.</>,
              <>Use <code className="rounded bg-muted px-1 py-0.5 text-xs">object-contain</code> for product cutouts, <code className="rounded bg-muted px-1 py-0.5 text-xs">object-cover</code> for lifestyle shots.</>,
              <>For product rails, set <code className="rounded bg-muted px-1 py-0.5 text-xs">opts={"{{ align: \"start\" }}"}</code> + per-item <code className="rounded bg-muted px-1 py-0.5 text-xs">basis-*</code>.</>,
            ]}
            donts={[
              <>Ship an <code className="rounded bg-muted px-1 py-0.5 text-xs">AvatarImage</code> without a matching <code className="rounded bg-muted px-1 py-0.5 text-xs">alt</code>.</>,
              <>Fix only a width on a thumbnail and let height float — that is the layout-shift bug.</>,
              <>Reach for an <code className="rounded bg-muted px-1 py-0.5 text-xs">AspectRatio</code> component; it is not in this registry — use the utility.</>,
              <>Put non-visual, keyboard-only flows inside a drag Carousel as the only path.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="Avatar — parts & props"
            rows={[
              { name: "Avatar size", type: "sm | default | lg", description: "24 / 32 / 40px circle." },
              { name: "AvatarImage", type: "img", description: "Source; hides itself on load error." },
              { name: "AvatarFallback", type: "span", description: "Shown until/if the image fails — put initials here." },
              { name: "AvatarBadge", type: "span", description: "Presence dot, bottom-right. Colour via className." },
              { name: "AvatarGroup / AvatarGroupCount", type: "div", description: "Overlapping stack + overflow count chip." },
            ]}
          />
          <PropsTable
            caption="Aspect ratio — utility"
            rows={[
              { name: "aspect-square", type: "1 / 1", description: "PLP / PDP product thumbnails." },
              { name: "aspect-[4/3]", type: "4 / 3", description: "Standard catalog photography." },
              { name: "aspect-video", type: "16 / 9", description: "Hero and video embeds." },
              { name: "object-contain | object-cover", type: "fit", description: "contain = product cutout; cover = lifestyle crop." },
            ]}
          />
          <PropsTable
            caption="Carousel — parts & props"
            rows={[
              { name: "Carousel opts", type: "Embla options", description: "e.g. { align: \"start\", loop: true }." },
              { name: "Carousel orientation", type: "horizontal | vertical", description: "Scroll axis. Defaults to horizontal." },
              { name: "CarouselHeader", type: "div", description: "Header row — title left, controls right." },
              { name: "CarouselControls", type: "div", description: "Prev + next cluster for the header row." },
              { name: "CarouselItem className", type: "basis-*", description: "Controls items-per-view for rails." },
              { name: "CarouselPrevious / CarouselNext", type: "button", description: "Outline icon buttons; auto-disable (dim) at the ends." },
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where these ship. Compare against the library above.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "PDP — gallery & thumbnails", href: "/pdp/uc-replacement-products?signedin=1" },
              { label: "PLP — Search results", href: "/search?q=blower%20motor&signedin=1" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
                <ExternalLink className="size-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}
