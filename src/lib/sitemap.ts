import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, toAbsoluteAssetUrl } from "@/lib/site-config";
import { getRealProductImages } from "@/lib/seo";

export const PRODUCT_SITEMAP_PAGE_SIZE = 5000;

function uniqueAbsoluteImages(images: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      images
        .map((image) => toAbsoluteAssetUrl(image))
        .filter((image): image is string => Boolean(image))
    )
  );
}

export async function getPublicProductSitemapIds() {
  const total = await prisma.product.count({
    where: {
      active: true,
      store: {
        is: {
          isActive: true,
        },
      },
    },
  });

  const sitemapCount = Math.ceil(total / PRODUCT_SITEMAP_PAGE_SIZE);

  return Array.from({ length: sitemapCount }, (_, index) => String(index));
}

export async function buildCoreSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      logo: true,
      heroes: {
        where: { isActive: true },
        orderBy: { position: "asc" },
        take: 1,
        select: {
          image: true,
        },
      },
      user: {
        select: {
          linktree: {
            select: {
              updatedAt: true,
            },
          },
        },
      },
      categories: {
        where: { isActive: true },
        select: {
          slug: true,
          updatedAt: true,
          products: {
            where: { active: true },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const latestStoreUpdate = stores[0]?.updatedAt || new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: latestStoreUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const store of stores) {
    entries.push({
      url: absoluteUrl(`/${store.slug}`),
      lastModified: store.updatedAt,
      changeFrequency: "daily",
      priority: 0.9,
      images: uniqueAbsoluteImages([store.heroes[0]?.image, store.logo]),
    });

    if (store.user?.linktree) {
      entries.push({
        url: absoluteUrl(`/${store.slug}/links`),
        lastModified: store.user.linktree.updatedAt,
        changeFrequency: "weekly",
        priority: 0.55,
        images: uniqueAbsoluteImages([store.logo]),
      });
    }

    for (const category of store.categories) {
      if (category.products.length === 0) {
        continue;
      }

      entries.push({
        url: absoluteUrl(`/${store.slug}/categoria/${category.slug}`),
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
        images: uniqueAbsoluteImages([store.heroes[0]?.image, store.logo]),
      });
    }
  }

  return entries;
}

export async function buildProductSitemapEntries(
  id: string
): Promise<MetadataRoute.Sitemap> {
  const page = Number(id);

  if (!Number.isInteger(page) || page < 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      store: {
        is: {
          isActive: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: page * PRODUCT_SITEMAP_PAGE_SIZE,
    take: PRODUCT_SITEMAP_PAGE_SIZE,
    select: {
      id: true,
      slug: true,
      updatedAt: true,
      imageUrl: true,
      images: {
        orderBy: { position: "asc" },
        select: {
          url: true,
        },
      },
      store: {
        select: {
          slug: true,
          logo: true,
        },
      },
    },
  });

  return products.map((product) => ({
    url: absoluteUrl(`/${product.store.slug}/product/${product.slug || product.id}`),
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
    images: uniqueAbsoluteImages([
      ...getRealProductImages(
        product.images.map((image) => image.url),
        product.imageUrl
      ),
      product.store.logo,
    ]),
  }));
}
