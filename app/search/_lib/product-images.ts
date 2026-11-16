/**
 * Product photos captured from each distributor's search page. Per-brand list
 * because extensions and counts differ (Homans: 24× webp — logo + spacer
 * dropped; Peirce: 28× avif + 1× webp).
 *
 * Shared by the PLP grid, the family-table list view and the family section
 * thumbnails so a SKU shows the same photo in every view.
 */

const IMAGES_BY_BRAND: Record<string, string[]> = {
  homans: Array.from({ length: 24 }, (_, i) => `/homans-search/blower-motor-${(i + 1).toString().padStart(2, "0")}.webp`),
  peirce: [
    "/peirce-search/blower-motor-01.avif",
    "/peirce-search/blower-motor-02.avif",
    "/peirce-search/blower-motor-03.avif",
    "/peirce-search/blower-motor-04.avif",
    "/peirce-search/blower-motor-05.avif",
    "/peirce-search/blower-motor-06.avif",
    "/peirce-search/blower-motor-07.avif",
    "/peirce-search/blower-motor-08.avif",
    "/peirce-search/blower-motor-09.avif",
    "/peirce-search/blower-motor-10.avif",
    "/peirce-search/blower-motor-11.avif",
    "/peirce-search/blower-motor-12.avif",
    "/peirce-search/blower-motor-13.avif",
    "/peirce-search/blower-motor-14.avif",
    "/peirce-search/blower-motor-15.avif",
    "/peirce-search/blower-motor-16.avif",
    "/peirce-search/blower-motor-17.avif",
    "/peirce-search/blower-motor-18.avif",
    "/peirce-search/blower-motor-19.avif",
    "/peirce-search/blower-motor-20.avif",
    "/peirce-search/blower-motor-21.avif",
    "/peirce-search/blower-motor-22.avif",
    "/peirce-search/blower-motor-23.avif",
    "/peirce-search/blower-motor-24.avif",
    "/peirce-search/blower-motor-25.avif",
    "/peirce-search/blower-motor-26.avif",
    "/peirce-search/blower-motor-27.webp",
    "/peirce-search/blower-motor-28.avif",
    "/peirce-search/blower-motor-29.avif",
  ],
};

export function productImageFor(brandKey: string, index: number, explicit?: string): string {
  if (explicit) return explicit;
  const list = IMAGES_BY_BRAND[brandKey] ?? IMAGES_BY_BRAND.homans;
  return list[index % list.length];
}
