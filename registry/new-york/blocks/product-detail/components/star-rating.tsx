import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Read-only star rating. Filled portion uses the `rating-star` token; the empty
 * track uses a muted token. Values render to the nearest half star.
 */
export function StarRating({
  rating,
  className,
  starClassName,
}: {
  rating: number;
  className?: string;
  starClassName?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rounded - i)); // 0, 0.5, or 1
        return (
          <span key={i} className={cn("relative inline-flex", starClassName)}>
            <Star className="size-4 text-muted-foreground/40" aria-hidden />
            {fill > 0 ? (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className="size-4 fill-rating-star text-rating-star"
                  aria-hidden
                />
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
