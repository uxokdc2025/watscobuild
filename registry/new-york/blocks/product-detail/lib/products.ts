/**
 * Mock data for the product-detail block.
 *
 * Swatch colors reference design tokens from globals.css (raw palette) so the
 * block stays on-token and portable — never hardcode hex/oklch here.
 * `icon` keys map to lucide icons in the gallery; images are placeholders meant
 * to be swapped for real product photography by the consumer.
 */

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type ProductColor = {
  id: string;
  name: string;
  /** CSS custom-property reference, e.g. "var(--zinc-800)" */
  swatch: string;
};

export type ProductSize = {
  id: string;
  label: string;
  available: boolean;
};

export type ProductImage = {
  id: string;
  alt: string;
  /** lucide icon key resolved in the gallery */
  icon: "shirt" | "sparkles" | "layers" | "ruler" | "package";
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

export type RelatedProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  /** Optional second segment shown after the category, e.g. "Oxford". */
  subcategory?: string;
  /** Optional corner tag, e.g. "New" or "Trending". */
  badge?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  icon: ProductImage["icon"];
};

export type Product = {
  id: string;
  slug: string;
  category: string;
  name: string;
  breadcrumb: { label: string; href: string }[];
  shortDescription: string;
  longDescription: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  currency: string;
  rating: number;
  reviewCount: number;
  stock: StockStatus;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
  specs: ProductSpec[];
  shipping: string[];
  reviews: ProductReview[];
};

export const product: Product = {
  id: "aurora-merino-crew",
  slug: "aurora-merino-crew-sweater",
  category: "Men's Knitwear",
  name: "Aurora Merino Crew Sweater",
  breadcrumb: [
    { label: "Home", href: "#" },
    { label: "Men", href: "#" },
    { label: "Knitwear", href: "#" },
    { label: "Aurora Merino Crew", href: "#" },
  ],
  shortDescription:
    "A midweight crewneck knit from 100% extra-fine merino — breathable, temperature-regulating, and soft enough to wear next to skin.",
  longDescription: [
    "The Aurora Merino Crew is built around a 19.5-micron extra-fine merino yarn, fully-fashioned so every panel is knit to shape rather than cut from a blank. The result is a cleaner seam, less waste, and a garment that holds its form wash after wash.",
    "Merino naturally regulates temperature and resists odor, making this a true three-season layer — on its own in spring, under a jacket when it drops. A ribbed crew collar, cuffs, and hem keep the silhouette tailored without feeling restrictive.",
  ],
  price: 148,
  originalPrice: 210,
  discountPercent: 30,
  currency: "USD",
  rating: 4.6,
  reviewCount: 218,
  stock: "low-stock",
  colors: [
    { id: "graphite", name: "Graphite", swatch: "var(--zinc-800)" },
    { id: "sky", name: "Sky", swatch: "var(--sky-500)" },
    { id: "cobalt", name: "Cobalt", swatch: "var(--blue-600)" },
    { id: "forest", name: "Forest", swatch: "var(--emerald-600)" },
  ],
  sizes: [
    { id: "xs", label: "XS", available: true },
    { id: "s", label: "S", available: true },
    { id: "m", label: "M", available: true },
    { id: "l", label: "L", available: true },
    { id: "xl", label: "XL", available: true },
    { id: "xxl", label: "XXL", available: false },
  ],
  images: [
    { id: "front", alt: "Front view", icon: "shirt" },
    { id: "detail", alt: "Yarn detail", icon: "sparkles" },
    { id: "back", alt: "Back view", icon: "layers" },
    { id: "fit", alt: "Fit and measurements", icon: "ruler" },
    { id: "packaging", alt: "Packaging", icon: "package" },
  ],
  specs: [
    { label: "Material", value: "100% extra-fine merino wool (19.5µ)" },
    { label: "Fit", value: "Regular — true to size" },
    { label: "Weight", value: "Midweight, 320 g/m²" },
    { label: "Construction", value: "Fully-fashioned, ribbed crew collar" },
    { label: "Care", value: "Machine wash cold, dry flat" },
    { label: "Origin", value: "Knit in Portugal" },
  ],
  shipping: [
    "Free carbon-neutral shipping on orders over $75.",
    "Standard delivery in 3–5 business days; express in 1–2.",
    "30-day free returns — send it back in the original packaging.",
  ],
  reviews: [
    {
      id: "r1",
      author: "Daniel R.",
      rating: 5,
      title: "Becomes your default sweater",
      body: "Soft, not itchy at all, and the fit is spot on. I've worn it twice a week since it arrived.",
      date: "2 weeks ago",
    },
    {
      id: "r2",
      author: "Priya M.",
      rating: 4,
      title: "Great quality, sizing runs slightly large",
      body: "Beautiful knit and the color is exactly as shown. I'd size down if you want it fitted.",
      date: "1 month ago",
    },
  ],
};

export const relatedProducts: RelatedProduct[] = [
  {
    id: "meridian-oxford",
    slug: "meridian-oxford-shirt",
    name: "Meridian Oxford Shirt",
    category: "Shirts",
    subcategory: "Oxford",
    price: 92,
    rating: 4.4,
    reviewCount: 96,
    icon: "shirt",
  },
  {
    id: "terra-flannel",
    slug: "terra-brushed-flannel",
    name: "Terra Brushed Flannel",
    category: "Shirts",
    subcategory: "Flannel",
    badge: "Trending",
    price: 78,
    originalPrice: 110,
    rating: 4.7,
    reviewCount: 143,
    icon: "layers",
  },
  {
    id: "coastal-tee",
    slug: "coastal-supima-tee",
    name: "Coastal Supima Tee",
    category: "T-Shirts",
    subcategory: "Supima",
    badge: "New",
    price: 42,
    rating: 4.5,
    reviewCount: 311,
    icon: "sparkles",
  },
  {
    id: "harbor-overshirt",
    slug: "harbor-wool-overshirt",
    name: "Harbor Wool Overshirt",
    category: "Outerwear",
    subcategory: "Wool",
    price: 188,
    originalPrice: 240,
    rating: 4.8,
    reviewCount: 74,
    icon: "package",
  },
  {
    id: "ridge-henley",
    slug: "ridge-waffle-henley",
    name: "Ridge Waffle Henley",
    category: "Knitwear",
    price: 64,
    rating: 4.3,
    reviewCount: 58,
    icon: "ruler",
  },
  {
    id: "atlas-chino",
    slug: "atlas-tapered-chino",
    name: "Atlas Tapered Chino",
    category: "Trousers",
    price: 98,
    originalPrice: 130,
    rating: 4.6,
    reviewCount: 205,
    icon: "shirt",
  },
];

const currencyFormatters = new Map<string, Intl.NumberFormat>();

export function formatPrice(value: number, currency = "USD"): string {
  let formatter = currencyFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    currencyFormatters.set(currency, formatter);
  }
  return formatter.format(value);
}
