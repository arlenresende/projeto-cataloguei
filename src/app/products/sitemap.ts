import type { MetadataRoute } from "next";
import {
  buildProductSitemapEntries,
  getPublicProductSitemapIds,
} from "@/lib/sitemap";

export async function generateSitemaps() {
  const ids = await getPublicProductSitemapIds();

  return ids.map((id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  return buildProductSitemapEntries(await id);
}
