import type { Metadata } from "next";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  GOOGLE_SITE_VERIFICATION,
  normalizePublicPath,
  getMetadataBase,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  TWITTER_HANDLE,
  toAbsoluteAssetUrl,
} from "@/lib/site-config";

const MAX_DESCRIPTION_LENGTH = 160;
const DEFAULT_OPEN_GRAPH_IMAGE_WIDTH = 1200;
const DEFAULT_OPEN_GRAPH_IMAGE_HEIGHT = 630;
const PRODUCT_PLACEHOLDER_PATH = "/placeholder-product.svg";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type SeoImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  type?: string;
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  images?: SeoImage[];
  keywords?: string[];
  openGraphType?: "website" | "article" | "profile" | "product" | null;
  twitterCard?: "summary" | "summary_large_image";
  socialTitle?: string;
};

export function stripHtml(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function normalizeText(value: string | null | undefined) {
  return stripHtml(value).replace(/\s+/g, " ").trim();
}

export function truncateText(value: string | null | undefined, max = MAX_DESCRIPTION_LENGTH) {
  const normalized = normalizeText(value);

  if (!normalized || normalized.length <= max) {
    return normalized;
  }

  const truncated = normalized.slice(0, max + 1);
  const lastBreak = Math.max(
    truncated.lastIndexOf(" "),
    truncated.lastIndexOf("."),
    truncated.lastIndexOf(",")
  );

  if (lastBreak > max * 0.6) {
    return `${truncated.slice(0, lastBreak).trim()}\u2026`;
  }

  return `${truncated.slice(0, max).trim()}\u2026`;
}

export function buildCanonicalUrl(path: string) {
  return absoluteUrl(normalizePublicPath(path));
}

export function buildRobots({ index }: { index: boolean }): NonNullable<Metadata["robots"]> {
  return {
    index,
    follow: index,
    nocache: !index,
    googleBot: {
      index,
      follow: index,
      noimageindex: !index,
      "max-image-preview": index ? "large" : "none",
      "max-snippet": index ? -1 : 0,
      "max-video-preview": index ? -1 : 0,
    },
  };
}

export function buildOpenGraphImage(url: string, alt: string) {
  return {
    url,
    width: DEFAULT_OPEN_GRAPH_IMAGE_WIDTH,
    height: DEFAULT_OPEN_GRAPH_IMAGE_HEIGHT,
    alt,
    type: "image/png",
  };
}

export function buildTwitterImage(url: string, alt: string) {
  return {
    url,
    alt,
  };
}

export function buildDefaultSeoImage() {
  return buildOpenGraphImage(absoluteUrl(DEFAULT_OG_IMAGE_PATH), DEFAULT_OG_IMAGE_ALT);
}

export function normalizeSeoImages(images: SeoImage[] | undefined) {
  const uniqueImages = new Map<string, SeoImage>();

  for (const image of images || []) {
    if (!image?.url) {
      continue;
    }

    const absoluteImageUrl = toAbsoluteAssetUrl(image.url);

    if (!absoluteImageUrl) {
      continue;
    }

    uniqueImages.set(absoluteImageUrl, {
      ...image,
      url: absoluteImageUrl,
      width: image.width || DEFAULT_OPEN_GRAPH_IMAGE_WIDTH,
      height: image.height || DEFAULT_OPEN_GRAPH_IMAGE_HEIGHT,
      type: image.type || "image/png",
    });
  }

  if (uniqueImages.size === 0) {
    const fallbackImage = buildDefaultSeoImage();
    uniqueImages.set(fallbackImage.url, fallbackImage);
  }

  return Array.from(uniqueImages.values());
}

export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
  images,
  keywords,
  openGraphType = "website",
  twitterCard,
  socialTitle,
}: PageMetadataInput): Metadata {
  const canonicalPath = normalizePublicPath(path);
  const canonicalUrl = buildCanonicalUrl(canonicalPath);
  const normalizedImages = normalizeSeoImages(images);
  const resolvedTitle = buildTitle(title);
  const resolvedSocialTitle = socialTitle || resolvedTitle;

  return {
    title: resolvedTitle,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    robots: buildRobots({ index }),
    openGraph: {
      ...(openGraphType ? { type: openGraphType } : {}),
      url: canonicalUrl,
      title: resolvedSocialTitle,
      description,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: normalizedImages.map((image) => buildOpenGraphImage(image.url, image.alt)),
    },
    twitter: {
      card:
        twitterCard ||
        (normalizedImages.length > 0 ? "summary_large_image" : "summary"),
      title: resolvedSocialTitle,
      description,
      images: normalizedImages.map((image) => buildTwitterImage(image.url, image.alt)),
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
  };
}

export function buildNoIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description,
    robots: buildRobots({ index: false }),
  };
}

export function isPlaceholderProductImage(value: string | null | undefined) {
  return value === PRODUCT_PLACEHOLDER_PATH;
}

export function getRealProductImages(
  images: Array<string | null | undefined>,
  primaryImage?: string | null
) {
  return Array.from(
    new Set(
      [...images, primaryImage]
        .filter((value): value is string => Boolean(value))
        .filter((value) => !isPlaceholderProductImage(value))
    )
  );
}

export function buildProductImageAlt(input: {
  productName: string;
  brand?: string | null;
  category?: string | null;
  position?: number;
}) {
  const parts = [input.productName.trim()];

  if (input.brand) {
    parts.push(`da marca ${input.brand.trim()}`);
  }

  if (input.category) {
    parts.push(`na categoria ${input.category.trim()}`);
  }

  if (typeof input.position === "number" && input.position > 0) {
    parts.push(`imagem ${input.position}`);
  }

  return parts.join(" ");
}

export function buildDefaultMetadata(): Metadata {
  const defaultPageMetadata = buildPageMetadata({
    title: `${SITE_NAME} | ${SITE_TITLE}`,
    socialTitle: `${SITE_NAME} | ${SITE_TITLE}`,
    description: SITE_DESCRIPTION,
    path: "/",
    images: [buildDefaultSeoImage()],
    keywords: SITE_KEYWORDS,
  });
  delete defaultPageMetadata.alternates;

  return {
    metadataBase: getMetadataBase(),
    applicationName: SITE_NAME,
    title: {
      default: `${SITE_NAME} | ${SITE_TITLE}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    referrer: "origin-when-cross-origin",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/favicon.ico" }],
      shortcut: [{ url: "/favicon.ico" }],
      apple: [{ url: "/favicon.ico" }],
    },
    ...defaultPageMetadata,
    verification: {
      google: GOOGLE_SITE_VERIFICATION,
    },
    category: "e-commerce",
    creator: SITE_NAME,
    publisher: SITE_NAME,
    other: {
      "content-language": SITE_LANGUAGE,
    },
  };
}

export function buildTitle(value: string) {
  return value.trim();
}

export function buildStoreDescription(input: {
  name: string;
  description?: string | null;
  city?: string | null;
  state?: string | null;
  category?: string | null;
}) {
  const pieces = [normalizeText(input.description)];
  const location = [input.city, input.state].filter(Boolean).join(" - ");

  if (location) {
    pieces.push(`Atendimento em ${location}.`);
  }

  if (input.category) {
    pieces.push(`${input.category}.`);
  }

  pieces.push(`Conheça a loja ${input.name} no ${SITE_NAME}.`);

  return truncateText(pieces.filter(Boolean).join(" "));
}

export function buildProductDescription(input: {
  name: string;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  storeName: string;
}) {
  const pieces = [
    truncateText(input.description, 110),
    input.brand ? `Marca: ${input.brand}.` : null,
    input.category ? `Categoria: ${input.category}.` : null,
    `Disponível na loja ${input.storeName}.`,
  ];

  return truncateText(pieces.filter(Boolean).join(" "));
}

export function buildCategoryDescription(input: {
  categoryName: string;
  description?: string | null;
  storeName: string;
}) {
  return truncateText(
    [
      normalizeText(input.description),
      `Explore produtos da categoria ${input.categoryName} na loja ${input.storeName}.`,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildCollectionPageJsonLd(input: {
  name: string;
  description?: string | null;
  url: string;
  inLanguage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: truncateText(input.description),
    url: input.url,
    inLanguage: input.inLanguage || SITE_LANGUAGE,
  };
}

export function buildWebSiteJsonLd(input: {
  name?: string;
  description?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name || SITE_NAME,
    url: input.url || absoluteUrl("/"),
    description: input.description || SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
  };
}

export function buildStoreJsonLd(input: {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  sameAs?: string[];
}) {
  const address = input.address || input.city || input.state || input.postalCode
    ? {
        "@type": "PostalAddress",
        streetAddress: input.address || undefined,
        addressLocality: input.city || undefined,
        addressRegion: input.state || undefined,
        postalCode: input.postalCode || undefined,
        addressCountry: input.country || "BR",
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: input.name,
    description: truncateText(input.description),
    url: input.url,
    image: input.image || undefined,
    email: input.email || undefined,
    telephone: input.phone || undefined,
    address,
    sameAs: input.sameAs?.length ? input.sameAs : undefined,
  };
}

export function buildProductJsonLd(input: {
  name: string;
  description?: string | null;
  url: string;
  images: string[];
  sku?: string | null;
  brand?: string | null;
  category?: string | null;
  price: number;
  currency?: string;
  sellerName?: string | null;
  availability?:
    | "https://schema.org/InStock"
    | "https://schema.org/OutOfStock"
    | "https://schema.org/PreOrder";
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  } | null;
  review?: Array<{
    author: string;
    reviewBody?: string | null;
    reviewRating?: number | null;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: truncateText(input.description),
    image: input.images.length > 0 ? input.images : undefined,
    sku: input.sku || undefined,
    brand: input.brand
      ? {
          "@type": "Brand",
          name: input.brand,
        }
      : undefined,
    category: input.category || undefined,
    url: input.url,
    offers: {
      "@type": "Offer",
      url: input.url,
      price: input.price.toFixed(2),
      priceCurrency: input.currency || "BRL",
      availability: input.availability,
    },
    seller: input.sellerName
      ? {
          "@type": "Organization",
          name: input.sellerName,
        }
      : undefined,
    aggregateRating: input.aggregateRating
      ? {
          "@type": "AggregateRating",
          ratingValue: input.aggregateRating.ratingValue,
          reviewCount: input.aggregateRating.reviewCount,
        }
      : undefined,
    review: input.review?.length
      ? input.review.map((item) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: item.author,
          },
          reviewBody: item.reviewBody || undefined,
          reviewRating:
            typeof item.reviewRating === "number"
              ? {
                  "@type": "Rating",
                  ratingValue: item.reviewRating,
                }
              : undefined,
        }))
      : undefined,
  };
}

export function buildJsonLdScriptContent(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
