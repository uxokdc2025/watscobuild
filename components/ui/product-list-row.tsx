import type { ReactNode } from "react";

import { ImageOff } from "lucide-react";

export function ProductListRow({
  image,
  imageAlt,
  brand,
  title,
  item,
  mfg,
  actions,
}: {
  image?: string;
  imageAlt: string;
  brand: string;
  title: ReactNode;
  item: string;
  mfg: string;
  actions: ReactNode;
}) {
  return (
    <article className="grid gap-4 p-4 sm:grid-cols-[80px_1fr_auto] sm:items-center">
      <div className="grid aspect-square place-items-center rounded-md bg-muted/40 p-1 text-muted-foreground">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={imageAlt} loading="lazy" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
        ) : <ImageOff className="size-6 opacity-40" aria-hidden="true" />}
      </div>
      <div>
        <p className="text-xs font-medium text-primary">{brand}</p>
        <div className="text-sm font-semibold leading-snug">{title}</div>
        <p className="mt-1 text-xs text-muted-foreground">Item: {item} · MFG: {mfg}</p>
      </div>
      <div className="text-sm sm:text-right">{actions}</div>
    </article>
  );
}
