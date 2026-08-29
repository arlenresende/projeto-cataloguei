import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, toAbsoluteAssetUrl } from "@/lib/site-config";
import { getRealProductImages } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      logo: true,
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
      products: {
        where: { active: true },
        select: {
          id: true,
          slug: true,
          updatedAt: true,
          imageUrl: true,
        },
      },
    },
  });

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
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
      images: store.logo ? [toAbsoluteAssetUrl(store.logo)!] : undefined,
    });

    if (store.user?.linktree) {
      entries.push({
        url: absoluteUrl(`/${store.slug}/links`),
        lastModified: store.user.linktree.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
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
      });
    }

    for (const product of store.products) {
      const productImages = getRealProductImages([], product.imageUrl);

      entries.push({
        url: absoluteUrl(`/${store.slug}/product/${product.slug || product.id}`),
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
        images: productImages.length
          ? productImages.map((image) => toAbsoluteAssetUrl(image)!).filter(Boolean)
          : undefined,
      });
    }
  }

  return entries;
}
