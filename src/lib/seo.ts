import type { Metadata } from "next";
import {
  absoluteUrl,
  getMetadataBase,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
} from "@/lib/site-config";

const MAX_DESCRIPTION_LENGTH = 160;
const PRODUCT_PLACEHOLDER_PATH = "/placeholder-product.svg";

export type BreadcrumbItem = {
  name: string;
  url: string;
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
  return absoluteUrl(path);
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
    width: 1200,
    height: 630,
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

export function buildDefaultMetadata(): Metadata {
  const defaultImageUrl = absoluteUrl("/og");

  return {
    metadataBase: getMetadataBase(),
    applicationName: SITE_NAME,
    title: {
      default: `${SITE_NAME} | Catálogo online para vender mais`,
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
    robots: buildRobots({ index: true }),
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      title: `${SITE_NAME} | Catálogo online para vender mais`,
      description: SITE_DESCRIPTION,
      url: absoluteUrl("/"),
      images: [buildOpenGraphImage(defaultImageUrl, `Compartilhamento do ${SITE_NAME}`)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} | Catálogo online para vender mais`,
      description: SITE_DESCRIPTION,
      images: [buildTwitterImage(defaultImageUrl, `Compartilhamento do ${SITE_NAME}`)],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
    category: "e-commerce",
    creator: SITE_NAME,
    publisher: SITE_NAME,
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
    "@type": "Store",
    name: input.name,
    description: truncateText(input.description),
    url: input.url,
    image: input.image || undefined,
    email: input.email || undefined,
    telephone: input.phone || undefined,
    address,
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
  availability?:
    | "https://schema.org/InStock"
    | "https://schema.org/OutOfStock"
    | "https://schema.org/PreOrder";
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
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function buildJsonLdScriptContent(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
