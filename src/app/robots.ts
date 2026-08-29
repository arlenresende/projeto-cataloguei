import type { MetadataRoute } from "next";
import { getPublicProductSitemapIds } from "@/lib/sitemap";
import { absoluteUrl, getSiteUrl } from "@/lib/site-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const productSitemapIds = await getPublicProductSitemapIds();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/favicon.ico", "/manifest.webmanifest", "/og", "/og/"],
        disallow: [
          "/admin",
          "/login",
          "/register",
          "/verify-email",
          "/api",
        ],
      },
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      ...productSitemapIds.map((id) => absoluteUrl(`/products/sitemap/${id}.xml`)),
    ],
    host: getSiteUrl(),
  };
}
