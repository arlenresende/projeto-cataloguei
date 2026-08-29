import type { MetadataRoute } from "next";
import { buildCoreSitemapEntries } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildCoreSitemapEntries();
}
