/* Category Landing — CMS content blocks (plug-and-play).
 * Reusable, prop-driven content components for category landing pages,
 * composed only from design-system primitives and tokens. A bridge to the
 * future CMS: each block is a drag-in slot an editor can configure. */
export { LargeBanner, MiniBanner } from "./banners";
export type { BannerCta, MiniBannerItem } from "./banners";
export {
  CategoryTileGrid,
  PromoTiles,
  BrandTiles,
  SideBySideImage,
} from "./tiles";
export type { Tile, PromoTile, BrandTile, AdPanel } from "./tiles";
export { ContentCards, BrandRow, ProductRail } from "./content";
export type { ContentCard, BrandChip } from "./content";
